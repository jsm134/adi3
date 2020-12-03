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
        dato: new Film(),
        film: new Film(),
        comentario: "",
        datos: [],
      }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
    },
    created(){
        this.obtenerDatos()
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
        obtenerDatos(){
            fetch('http://localhost:3000/films/'+this.$route.params.id)
            .then(res => res.json())
            .then(data => {
                //console.log("Listado de peliculas")
                this.dato = data
                this.film = data.film[0]
                //console.log(this.$route.params.id)
            })
        },
        /*obtenerComents(){
            fetch('http://localhost:3000/films')
            .then(res => res.json())
            .then(data => {
                console.log("Listado de peliculas")
                this.films = data.film
                console.log(this.films)
            })
        },*/
        deleteFilm(id){
            console.log(id)
        },
        addComment(){
            console.log("hola")
            console.log(this.film)
            var com = {
                'mensaje': this.comentario
            }
            //com.mensaje="aaaaaaaaa"
            //console.log(com)
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