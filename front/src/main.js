import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import store from './store';

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


// Rutas
import Home from './components/Home'
import Films from './components/Films'
import Login from './components/Login'
import CFilms from './components/CreateFilm'
import DFilms from './components/FilmDetails'
import EFilms from './components/EditFilm'
import Rents from './components/Rents'
import DRents from './components/RentDetails'
import Register from './components/Register'


// path: '/users/:id/edit',
// {{ $route.params.id}} para llamar desde los componentes

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/films',
      component: Films
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/createFilm',
      component: CFilms
    },
    {
      path: '/films/:id/',
      component: DFilms
    },
    {
      path:'/films/:id/edit',
      component: EFilms
    },
    {
      path:'/rents',
      component: Rents
    },
    {
      path: '/rents/:id/',
      component: DRents
    },
    {
      path: '/signin',
      component: Register
    },
  ]
})

new Vue({
  store,
  router,
  render: function (h) { return h(App) },
}).$mount('#app')