<template>
    <div class="container">
        <b-card no-body class="mb-1">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3>
                        {{rent.film}}
                    </h3>
                </div>
                <div v-if="!error" class="panel-body">
                    Usuario: {{this.currentUser.username}}
                    <br>
                    ID de transacción: {{rent.id}}
                    <br>
                    Fecha del alquiler: {{rent.date}}min
                </div>
                <div class="form-group">
                    <div v-if="error" class="alert alert-danger" role="alert">{{error}}</div>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script>
//import Servicio_API from '../api'
export default {
    data() {
      return {
        rent: {},
        error: "",
      }
    },
    created(){
        this.obtenerDatosAlquiler()
    },
    computed: {
        currentUser() {
            //return this.$store.state.auth.user;
            return JSON.parse(localStorage.getItem('user'))
        },
    },
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
        obtenerDatosAlquiler(id){
            fetch('http://localhost:3000/rents/'+this.$route.params.id,{
                headers:{
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + this.currentUser.token
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(data.id == undefined){
                    console.log('Error ' + data.mensaje)
                    this.error = 'Error: ' + data.mensaje
                }else{
                    this.rent = data
                }
                
            })
        },
        
        deleteRent(id){
            console.log("Borrar una pelicula")
            fetch('http://localhost:3000/rents/' + id,{
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
                this.rents=[]
                this.obtenerAlquileres()
            })
            console.log(id)
        },
    }
  }
</script>