<template>
  <div>
  <b-navbar type="dark" variant="dark">
    <b-navbar-nav>
      <b-nav-item><router-link to="/">Home</router-link></b-nav-item>
      <b-nav-item><router-link to="/films">Peliculas</router-link></b-nav-item>
      
      <div v-if="currentUser">
        <b-nav-item><router-link to="/createFilm">Crear Pelicula</router-link></b-nav-item>
      </div>
      <div v-if="currentUser">
        <b-nav-item><router-link to="/rents">Mis alquileres</router-link></b-nav-item>
      </div>
      <!-- Navbar dropdowns
      <b-nav-item-dropdown text="Lang" left>
        <b-dropdown-item href="#">EN</b-dropdown-item>
        <b-dropdown-item href="#">ES</b-dropdown-item>
        <b-dropdown-item href="#">RU</b-dropdown-item>
        <b-dropdown-item href="#">FA</b-dropdown-item>
      </b-nav-item-dropdown>

      <b-nav-item-dropdown text="User" left>
        <b-dropdown-item href="#">Account</b-dropdown-item>
        <b-dropdown-item href="#">Settings</b-dropdown-item>
      </b-nav-item-dropdown> -->
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <div v-if="!currentUser">
        <b-nav-item><router-link to="/login">Login</router-link></b-nav-item>
      </div>
      <div align="right" v-if="currentUser">
        <b-nav-item right>{{currentUser.username}}</b-nav-item>
      </div>
      <div v-if="currentUser">
        <b-nav-item href @click.prevent="logout">Logout</b-nav-item>
      </div>
    </b-navbar-nav>
  </b-navbar>
  <br>
  <router-view />
</div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  components: {
    HelloWorld
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
