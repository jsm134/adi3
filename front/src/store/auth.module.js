//import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
        console.log("login")
        /*console.log(user.username)
        console.log(user.password)*/
        return fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user: user.username, pass: user.password}),
        }).then(res => res.json()).then(data => {
            console.log(data)
            if(data.mensaje=="OK"){
              data.username = user.username
              localStorage.setItem('user', JSON.stringify(data))
              commit('loginSuccess', user);
            }else{
              console.log("Error login")
            }
        })
    },
    logout({ commit }) {
      localStorage.removeItem('user')
      commit('logout');
      console.log("logout")
    },
    register({ commit }, user) {
      /*return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );*/
      console.log("register")
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};
