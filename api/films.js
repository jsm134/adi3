var express = require('express');
var app = express();
var bp = require('body-parser');
var jwt = require('jwt-simple');
var request = require('request');
const { response } = require('express');
const { deleteComments } = require('./comments.js');

var knex = require("knex")({
    client: 'sqlite3',
    connection: {
      filename: "./database.db"
    },
    useNullAsDefault: true
});

comments = require('./comments.js')

exports.allFilms = function(pet, resp){
    //resp.send("url de films")
    knex.select().from('film').then(function (data){
        var films
        data.forEach(function(element){
            element['link'] = pet.protocol + "://"+ pet.get('host') +  "/films/" + element.id
            //films.push({element})
        })
        resp.status(200).send({
            "film": data,
        })
    }).catch(function (error){
        console.log(error)
    })
}

exports.getFilmByID = function(pet, resp){
    var id = parseInt(pet.params.id)
    knex('film').where('id', id).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje:"La pelicula no se ha encontrado"})
        }else{
            knex.select().from('film').where('id', id).then(function (data){
                var comment
                var com = request({
                    method:'GET',
                    url: pet.protocol + "://"+ pet.get('host') + '/comments/' + id  
                }, (err, response, body) => {
                    bodyJSON = JSON.parse(body)
                    resp.status(200).send({
                        "film": data,
                        "comments": bodyJSON
                    })
                })
            }).catch(function (error){
                console.log(error)
            })
        }
    })
}

const getUser = (idUser) => {
    var result = knex('user').where('id', idUser).select('id', 'name', 'email')
    return result.then(function(result){return result})
}

exports.getFilmNameById = async function(id){
    await knex('film').where('id', id).count('id as i').then(function(query){
        //console.log(query[0].i)
        if(query[0].i == 0){
            //resp.status(404).send({mensaje:"La pelicula no se ha encontrado"})
            return undefined
        }else{
            var result = knex('film').where('id', id)
            return result.then(function(rows){return rows[0].title})
        }
    })
}

exports.getFilmByGenre = function(pet, resp){
    var genre = pet.params.genre
    knex('film').where('genre', genre).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje:"No se ha encontrado ninguna pelicula con ese genero"})
        }else{
            knex.select().from('film').where('genre', genre).then(function (data){
                data.forEach(function(element){
                    element['link'] = pet.protocol + "://"+ pet.get('host') + "/films/" + element.id
                })
                resp.status(200).send(data)
            }).catch(function (error){
                console.log(error)
            })
        }
    })
}

exports.getFilmByTitle = function(pet, resp){
    var title = pet.params.title
    knex('film').where('title', 'like', '%'+title+'%').count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje:"No se ha encontrado ninguna pelicula con ese titulo"})
        }else{
            knex.select().from('film').where('title', 'like', '%'+ title+'%').then(function (data){
                data.forEach(function(element){
                    element['link'] = pet.protocol + "://"+ pet.get('host') + "/films/" + element.id
                })
                resp.status(200).send(data)
            }).catch(function (error){
                console.log(error)
            })
        }
    })
}

exports.insertFIlm = function(pet, resp){
    var title = pet.body.title;
    var year = pet.body.year;
    var description = pet.body.description;
    var genre = pet.body.genre;
    var calification = pet.body.calification;
    var duration = pet.body.duration;
    knex('film').insert({
        title: title,
        year: year,
        description: description,
        genre: genre,
        calification: calification,
        duration: duration
    }).then(function(id){
        resp.status(201).send({
            mensaje: "Pelicula añadida correctamente",
            film: pet.protocol + "://"+ pet.get('host') + "/films/" + id
        })
    }).catch(function(err){
        resp.status(400).send({mensaje: "La pelicula no ha podido añadirse correctamente" + err})
    })
}

exports.deleteFilm = function(pet, resp){
    var id = parseInt(pet.params.id)
    req = knex('film').where('id', id).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje: "No existe la pelicula solicitada"})
        }else{
            knex('film').where('id', id).del().then(function(i){
                if(i == 0){
                    resp.status(404).send({mensaje: "La pelicula no existe"})
                }else{
                    resp.status(200).send({mensaje: "Pelicula borrada correctamente"})
                }
            }).catch(function(err){
                resp.status(400).send({mensaje: "Error al borrar la pelicula " + id + " " + err})
            })
        }
    })
}

exports.updateFilm = function(pet, resp){
    var id = parseInt(pet.params.id)
    var title = pet.body.title;
    var year = pet.body.year;
    var description = pet.body.description;
    var genre = pet.body.genre;
    var calification = pet.body.calification;
    var duration = pet.body.duration;
    req = knex('film').where('id', id).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje: "No existe la pelicula solicitada"})
        }else{
            knex('film').where('id', id).update({
                title: title,
                year: year,
                description: description,
                genre: genre,
                calification: calification,
                duration: duration
            }).then(function(id_film){
                resp.status(201).send({
                    mensaje: "Pelicula actualizada correctamente",
                    film: pet.protocol + "://"+ pet.get('host') + "/films/" + id
                })
            }).catch(function(err){
                resp.status(400).send({mensaje: "La pelicula no ha podido modificarse correctamente" + err})
            })
        }
    })
}