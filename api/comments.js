var express = require('express');
var app = express();
var bp = require('body-parser');
var jwt = require('jwt-simple');
var request = require('request');
const { getFilmNameById } = require('./films.js');

var knex = require("knex")({
    client: 'sqlite3',
    connection: {
      filename: "./database.db"
    },
    useNullAsDefault: true
});

authentication = require('./authentication.js')
film = require('./films.js')

exports.getCommentsByFilm = function(pet, resp){
    var id = parseInt(pet.params.id)
    //resp.send("url de films")
    knex('comments').where('film_id', id).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje:"No hay comentarios para esta pelicula"})
        }else{
            knex.select().from('comments').where('film_id', id).then(function (data){
                resp.status(200).send(data)
            }).catch(function (error){
                console.log(error)
            })
        }
    })
}

exports.saveComment = async function(pet, resp){
    var id = parseInt(pet.params.id)
    var user = authentication.getUserNameByToken(pet)
    var user_id = authentication.getUserByToken(pet)
    var mensaje = pet.body.mensaje;
    var existe = 404
    var com = request({
        method:'GET',
        url: pet.protocol + "://"+ pet.get('host') + '/films/' + id  
    }, (err, response, body) => {
        existe = response.statusCode
        if(existe == 200){
            knex('comments').insert({
                user_id: user_id,
                user_name: user,
                text: mensaje,
                film_id: id
            }).then(function(){
                resp.status(201).send({
                    mensaje: "Comentario creado correctamente",
                    film: pet.protocol + "://"+ pet.get('host') + "/films/" + id
                })
            }).catch(function(err){
                resp.status(400).send({mensaje: "El comentario no ha podido añadirse correctamente" + err})
            })
        }else{
            resp.status(404).send({mensaje: "No existe la pelicula"})
        }
    })
}

exports.deleteComments = function(id){
    var film_id = id
    knex('comments').where('film_id', film_id).del().then(function(i){
    }).catch(function(err){
        console.log(err)
    })
}