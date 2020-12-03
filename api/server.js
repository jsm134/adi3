var express = require('express')
var app = express()

var cors = require('cors');
app.use(cors());

var bp = require('body-parser');
const Knex = require('knex');
app.use(bp.json())

var jwt = require('jwt-simple');
const { KnexTimeoutError } = require('knex');

var knex = require("knex")({
    client: 'sqlite3',
    connection: {
      filename: "./database.db"
    },
    useNullAsDefault: true
});

var films = require('./films.js')
var comments = require('./comments.js')
var authentication = require('./authentication.js')
var rent = require('./rent.js')

// Test
app.post('/login', authentication.login)

// Test
app.post('/register', authentication.register)

app.get('/saludo', function(pet, resp) {
  resp.send("hola soy el API")
})

// Test
app.get('/films', films.allFilms)

// Test
app.post('/films', authentication.loggueado, films.insertFIlm)

// Test
app.get('/films/:id', films.getFilmByID)

// Test
app.delete('/films/:id', authentication.loggueado, films.deleteFilm)

// Test
app.put('/films/:id', authentication.loggueado, films.updateFilm)

// Test
app.get('/comments/:id', comments.getCommentsByFilm)

// Test
app.post('/comments/:id', authentication.loggueado, comments.saveComment)

// Test
app.get('/films/genre/:genre', films.getFilmByGenre)

// Test
app.get('/films/title/:title', films.getFilmByTitle)

// Test
app.get('/user/:id', authentication.loggueado, authentication.imTheUser, authentication.getUserByID)

// Test
app.put('/user/:id', authentication.loggueado, authentication.imTheUser, authentication.updateUser)

// Test
app.get('/rents', authentication.loggueado, rent.myRents)

// Test
app.post('/rents/film/:id', authentication.loggueado, rent.buyRent)

// Test
app.get('/rents/:id', authentication.loggueado, rent.getRentInfo)

// Test
app.delete('/rents/:id', authentication.loggueado, rent.deleteRent)

var listener = app.listen(process.env.PORT||3000, () => {
    console.log(`Servidor en el puerto ${listener.address().port}`);
});