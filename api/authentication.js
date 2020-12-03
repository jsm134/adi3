var express = require('express');
var app = express();
var bp = require('body-parser');
var jwt = require('jwt-simple');

var knex = require("knex")({
    client: 'sqlite3',
    connection: {
      filename: "./database.db"
    },
    useNullAsDefault: true
});

var secret = "123456"

//Middleware: lo pondremos ANTES de procesar la petición
exports.loggueado = function chequeaJWT(pet, resp, next) {
    var cabecera = pet.header('Authorization')
    //Parte el string por el espacio. Si está, devolverá un array de 2
    //la 2ª pos será lo que hay detrás de "Bearer"
    if(!cabecera){
        resp.status(401).send({Message: "No estás logueado"})
    }else{
        var campos = cabecera.split(' ')
        if (campos.length>1 && cabecera.startsWith('Bearer')) {
            var token = campos[1]
            decodeToken = jwt.decode(token, secret)
            //aux = existeUser(decodeToken.id, decodeToken.user, decodeToken.pass)
            //console.log('aux = ' + aux)
            if(!decodeToken.id || !decodeToken.user || ! decodeToken.pass){
                resp.status(403).send({mensaje:"Faltan credenciales"})
            }else{
                knex('user').where({
                    id: decodeToken.id,
                    user: decodeToken.user,
                    pass: decodeToken.pass
                }).count('id as i').then(function(query){
                    if(query[0].i == 0){
                        resp.status(403).send({mensaje:"No existe ningun usuario con esos credenciales"})
                    }else{
                        next()
                    }
                })
            }
        }else{
            resp.status(401).send({Message: "Faltan credenciales"})
        }
    }   
}
exports.login = async function(pet, resp){
    var datos = pet.body
    //un SELECT, devuelve un array con las filas
    var res = await knex("user").where({user:datos.user, pass:datos.pass})
    //si no hay datos, el array estará vacío
    if (res.length>0) {
        //TODO: cambiar esto por código que genere y envíe un JWT 
        var token = jwt.encode({id:res[0].id, user:datos.user, pass:datos.pass}, secret)
        resp.send({mensaje:"OK", token:token})
    }
    else {
        resp.status(401).send({mensaje: "No estás logueado"})
    }
}

exports.getUserNameByToken = function(pet){
    var cabecera = pet.header('Authorization')
    var campos = cabecera.split(' ')
    var token = campos[1]
    decodeToken = jwt.decode(token, secret)
    return decodeToken.user
}

exports.getUserByToken = function(pet){
    var cabecera = pet.header('Authorization')
    var campos = cabecera.split(' ')
    var token = campos[1]
    decodeToken = jwt.decode(token, secret)
    return decodeToken.id
}

exports.imTheUser = function(pet, resp, next){
    var id = parseInt(pet.params.id)
    var cabecera = pet.header('Authorization')
    var campos = cabecera.split(' ')
    var token = campos[1]
    decodeToken = jwt.decode(token, secret)
    if(decodeToken.id == id){
        next()
    }else{
        resp.status(403).send({mensaje:"No tienes permiso para acceder a los datos de este usuario"})
    }
}

exports.getUserNameById = function(id){
    knex('user').where('id', id).then(function(query){
        //console.log(query[0].id)
        if(query.length == 0){
            return -1
        }else{
            username = query[0].user
            return username
        }
    })
}

exports.getUserByID = function(pet, resp){
    var id = parseInt(pet.params.id)
    //resp.send("url de films")
    //get json token
    knex('user').where('id', id).count('id as i').then(function(query){
        if(query[0].i == 0){
            resp.status(404).send({mensaje:"No existe un usuario con ese id"})
        }else{
            knex.select().from('user').where('id', id).then(function (data){
                resp.status(200).send(data)
            }).catch(function (error){
                console.log(error)
            })
        }
    }) 
}

exports.updateUser = function(pet, resp){
    var id = parseInt(pet.params.id)
    var data = pet.body
    knex('user').where('id', id).update({
        user: data.user,
        pass: data.pass,
        telephone: data.telephone
    }).then(function(){
        resp.status(201).send({Message: 'Usuario actualizado correctamente'})
    }).catch(function(err){
        resp.status(404).send({Message: 'El usuario no se pudo actualizar' + err})
    })
}

exports.register = function(pet,res){
    var user_name = pet.body.user
    var user_pass = pet.body.pass
    var user_telephone = pet.body.telephone
    knex('user').where('user', user_name).count('id as i').then(function(query){
        if(query[0].i == 0){
            knex('user').insert({
                user: user_name,
                pass: user_pass,
                telephone: user_telephone
            }).then(function(id){
                res.status(201).send({
                    mensaje: "Usuario " + user_name + " creado correctamente"
                })
            })
        }else{
            res.status(401).send({Message: "Usuario existente, prueba con otro nombre de usuario"})
        }
    }) 
}