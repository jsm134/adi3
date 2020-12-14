<template>
    <div class="container">
        <b-card no-body class="mb-1">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3>
                        {{film.title}}
                    </h3>
                </div>
                <div class="panel-body">
                    Año: {{film.year}}
                    <br>
                    Calificación: {{film.calification}} estrellas
                    <br>
                    Duración: {{film.duration}}min
                    <br>
                    Genero: {{film.genre}}
                    <br>
                    Descripción: {{film.description}}
                </div>
                <div v-if="currentUser">
                    <button class="btn btn-primary" v-on:click="addRent">Alquilar</button> 
                </div>
            </div>
            <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block href="#" v-b-toggle.accordion-2 variant="info">Comentarios</b-button>
            </b-card-header>
            <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                <b-card-body>
                <!--<search-form :fieldList="fieldList" :customs-max-num="customsMaxNum" :data-types="dataTypes" />-->
                 <div class="col">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="c of dato.comments">
                                <td>{{c.user_name}}</td>
                                <td>{{c.text}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </b-card-body>
            </b-collapse>
            <div v-if="currentUser">
                <form @submit.prevent="addComment">
                    <div class="input-group">
                        <input type="text" v-model="comentario" placeholder="Comentar" class="form-control">
                        <span class="input-group-btn">
                            <button class="btn btn-info">Enviar</button>
                        </span>
                    </div>
                </form>
            </div>
        </b-card>
    </div>
</template>

<script>
    class Film{
        constructor(title, year, description, genre, calification, duration){
            this.title = title;
            this.year = year;
            this.description = description;
            this.genre = genre;
            this.calification = calification;
            this.duration = duration;
        }
    }
  export default {
    data() {
      return {
        dato: [],
        film: new Film(),
        comentario: "",
        date: "",
      }
    },
    computed: {
        currentUser() {
            //return this.$store.state.auth.user;
            return JSON.parse(localStorage.getItem('user'))
        },
    },
    created(){
        this.obtenerDatos()
    },
    methods: {
        obtenerDatos(){
            fetch('http://localhost:3000/films/'+this.$route.params.id)
            .then(res => res.json())
            .then(data => {
                this.dato = data
                this.film = data.film[0]
            })
            
        },
        addRent(){
            console.log("hola")
            //console.log(this.film)
            fetch('http://localhost:3000/rents/film/' + this.film.id,{
                method: 'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.currentUser.token
                }
            }).then(res=>res.json())
            .then(data => {
                console.log(data)
                this.$router.push('/rents');
            })
        },
        deleteFilm(id){
            console.log(id)
        },
        addComment(){
            console.log("hola")
            console.log(this.film)
            var com = {
                'mensaje': this.comentario
            }
            fetch('http://localhost:3000/comments/' + this.$route.params.id,{
                method: 'POST',
                body: JSON.stringify(com),
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.currentUser.token
                }
            }).then(res=>res.json())
            .then(data => {
                this.obtenerDatos()
                console.log(data)
            })
            this.comentario = '';

        }
    }
  }
</script>