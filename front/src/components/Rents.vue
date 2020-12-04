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
                        <th>Fecha de alquiler</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r of rents">
                        <td>{{r.film}}</td>
                        <td>{{r.date}}</td>
                        <td>
                            <div v-if="currentUser">
                                <router-link class="btn btn-primary" :to="'/rents/' + r.id">Ver detalles</router-link> 
                                &nbsp;
                                <button @click="deleteRent(r.id)" class="btn btn-danger">
                                    Borrar
                                </button>
                                <span id="datos" style="display:none">
                                    ID de alquiler: {{r.id}}
                                </span>
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
export default {
    data() {
      return {
        rents: [],
      }
    },
    created(){
        this.obtenerAlquileres()
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
    },
    methods: {
        obtenerDatosPelicula(id){
            fetch('http://localhost:3000/rents/'+id,{
                headers:{
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + this.currentUser.token
                }
            })
            .then(res => res.json())
            .then(data => {
                this.rents.push(data)
            })
        },
        obtenerAlquileres(){
            fetch('http://localhost:3000/rents',{
                headers:{
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + this.currentUser.token
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log("Listado de alquileres")
                for (var d in data){
                    this.obtenerDatosPelicula(data[d].id)                    
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