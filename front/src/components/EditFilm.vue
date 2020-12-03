<template>
    <div class="container">
        <div class="row pt-5">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-body">
                        <h1>Editar una Pelicula</h1>
                        <form @submit.prevent="editFilm">
                            <div class="from-group">
                                Titulo: <input type="text" v-model="film.title" placeholder="Titulo"
                                class = "form-control">
                                <br>
                                Año:
                                <input type="text" v-model="film.year" placeholder="Año"
                                class = "form-control">
                                <br>
                                Género
                                <input type="text" v-model="film.genre" placeholder="Género"
                                class = "form-control">
                                <br>
                                Calificación
                                <input type="text" v-model="film.calification" placeholder="Calificacion"
                                class = "form-control">
                                <br>
                                Duración (min):
                                <input type="text" v-model="film.duration" placeholder="Duración"
                                class = "form-control">
                            </div>
                            <br>
                            Descripción:
                            <div class="form-group">
                                <textarea cols="30" rows="10" class="form-control" v-model="film.description" placeholder="Descripción"></textarea>
                            </div>
                            <button class="btn btn-primary btn-block">Editar</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="film of films">
                            <td>{{film.title}}</td>
                            <td>
                                <router-link class="btn btn-primary" :to="'/films/' + film.id + 'edit'">Ver detalles</router-link>
                           </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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
        film: new Film(),
        films: [],
        //api : new Servicio_API('http://localhost:3000')
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
            //console.log("a")
            fetch('http://localhost:3000/films/'+this.$route.params.id)
            .then(res => res.json())
            .then(data => {
                //console.log("Listado de peliculas")
                this.film = data.film[0]
                //console.log(this.$route.params.id)
            })
        },
        editFilm(){
            console.log("hola")
            console.log(this.film)
            fetch('http://localhost:3000/films/'+this.$route.params.id,{
                method: 'PUT',
                body: JSON.stringify(this.film),
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.currentUser.token
                }
            }).then(res=>res.json())
            .then(data => {
                console.log(data)
                this.$router.push('/films/'+this.$route.params.id);
            })
            this.film = new Film()

        }
    }
  }
</script>