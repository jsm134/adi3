var express = require('express');
var app = express();
var bp = require('body-parser');
var jwt = require('jwt-simple');
var request = require('request')

var knex = require("knex")({
    client: 'sqlite3',
    connection: {
      filename: "./database.db"
    },
    useNullAsDefault: true
});

var authentication = require('./authentication.js')
var films = require('./films.js')

exports.myRents = async function(pet, resp){
    var r = await knex('rent').where('user_id', authentication.getUserByToken(pet))
    resp.status(200).send(r)
}

exports.buyRent = function(pet, resp){
    var user_id = authentication.getUserByToken(pet)
    var film_id = parseInt(pet.params.id)
    var com = request({
        method:'GET',
        url: pet.protocol + "://"+ pet.get('host') + '/films/' + film_id  
    }, (err, response, body) => {
        bodyJSON = JSON.parse(body)
        //console.log(bodyJSON)
        if(!bodyJSON.mensaje){
            var today = new Date()
            date = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear()
            
            knex('rent').insert({
                user_id: user_id,
                film_id: film_id,
                date: date
            }).then(function(data){
                resp.status(201).send({
                    mensaje: "Ha alquilado correctamente la pelicula",
                    link: pet.protocol + "://"+ pet.get('host') + '/films/' + film_id
                })
            }).catch(function(error){
                resp.status(400).send({mensaje: "La pelicula no ha podido alquilarse correctamente" + error})
            })
        }else{
            resp.status(404).send({message: "la pelicula no existe"})
        }
        
    })
}

exports.getRentInfo = async function(pet, resp){
    var id = parseInt(pet.params.id)
    req = knex('rent').where('id', id).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje: "No existe el pedido solicitado"})
        }else{
            knex('rent').where('id', id).then(function (data){
                if(data[0].user_id == authentication.getUserByToken(pet)){
                    /*const film_name = await films.getFilmNameById(data[0].film_id).then(a => {
                        console.log(a)
                    })*/
                    //////////////
                    knex('film').where('id', data[0].film_id).count('id as i').then(function(query){
                        //console.log(query[0].i)
                        if(query[0].i == 0){
                            //resp.status(404).send({mensaje:"La pelicula no se ha encontrado"})
                            console.log("aaaaaaaaa")
                        }else{
                            knex('film').where('id', data[0].film_id).then(rows => {
                                resp.status(200).send({
                                    id: data[0].id,
                                    user: authentication.getUserNameByToken(pet),
                                    film: rows[0].title,
                                    date: data[0].date
                                })
                                //console.log(rows[0].title)
                                })
                        }
                    })
                    //////////////
                    //films.getFilmNameById(data[0].film_id).then(b => console.log(b))
                    
                    //console.log(film_name)
                }
                else{
                    resp.status(403).send({mensaje:"No tienes permiso para acceder a los datos de este usuario"})
                }
            })
        }
    })
}

exports.deleteRent = function(pet, resp){
    var id = parseInt(pet.params.id)
    req = knex('rent').where('id', id).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje: "No existe el alquiler solicitado"})
        }else{
            knex('rent').where('id', id).then(function (data){
                if(data[0].user_id == authentication.getUserByToken(pet)){
                    knex('rent').where('id', id).del().then(function(i){
                        if(i == 0){
                            resp.status(404).send({mensaje: "El alquiler no existe"})
                        }else{
                            resp.status(200).send({mensaje: "Alquiler borrado correctamente"})
                        }
                    }).catch(function(err){
                        resp.status(400).send({mensaje: "Error al borrar el alquiler " + id + " " + err})
                    })
                }else{
                    resp.status(403).send({mensaje:"No tienes permiso para acceder a los datos de este usuario"})
                }
            })
        }
    })
}