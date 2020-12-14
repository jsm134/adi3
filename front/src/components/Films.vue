<template>
  <div>
    <div class="col">
        <h2>Listado de Peliculas</h2>
    </div>
    <div class="container">
        <div class="col">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Descripcion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="film of films">
                        <td>{{film.title}}</td>
                        <td>{{film.description}}</td>
                        <td>
                            <div v-if="currentUser">
                                <router-link class="btn btn-primary" :to="'/films/' + film.id">Ver detalles</router-link> 
                                &nbsp;
                                <router-link class="btn btn-warning" :to="'/films/' + film.id + '/edit'">Editar</router-link> 
                                &nbsp;
                                <button @click="deleteFilm(film.id)" class="btn btn-danger">
                                    Borrar
                                </button>
                            </div>
                            <div v-if="!currentUser">
                                <router-link class="btn btn-primary" :to="'/films/' + film.id">Ver detalles</router-link> 
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script>
//import Servicio_API from '../api'
    class Film{
        constructor(title, year, description, genre, calification, duration, link){
            this.title = title;
            this.year = year;
            this.description = description;
            this.genre = genre;
            this.calification = calification;
            this.duration = duration;
            this.link = link;
        }
    }
  export default {
    data() {
      return {
        film: new Film(),
        films: [],
        //api : new Servicio_API('http://localhost:3000')
      }
    },
    created(){
        this.obtenerFilms()
    },
    computed: {
        currentUser() {
            return JSON.parse(localStorage.getItem('user'))
            //return this.$store.state.auth.user;
        },
    },
    /*beforeMount: function() {
        this.api.obtenerFilms().then((response)=>{
            console.log(response)
            response.linkFilms.forEach((dato)=>{
                this.items.push(dato)
            })
        })
    },*/
    methods: {
        obtenerFilms(){
            fetch('http://localhost:3000/films')
            .then(res => res.json())
            .then(data => {
                console.log("Listado de peliculas")
                this.films = data.film
                console.log(this.films)
            })
        },
        deleteFilm(id){
            console.log("Borrar una pelicula")
            fetch('http://localhost:3000/films/' + id,{
                method: 'DELETE',
                headers:{
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + this.currentUser.token
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.obtenerFilms()
            })
            console.log(id)
        }
    }
  }
</script>