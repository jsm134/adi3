<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form name="form" @submit.prevent="register">
        <div>
          <div class="form-group">
            <label for="username">Usuario</label>
            <input
              v-model="username"
              type="text"
              class="form-control"
              name="username" required
            />
          </div>
          <div class="form-group">
            <label for="email">Teléfono</label>
            <input
              v-model="telephone"
              type="text"
              class="form-control"
              name="email" required
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              v-model="pass"
              type="password"
              class="form-control"
              name="password" required
            />
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block">Sign Up</button>
          </div>
        </div>
      </form>

      <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
        </div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';
export default {
  name: 'Register',
  data() {
    return {
      username: undefined,
      telephone: undefined,
      pass: undefined,
      message: undefined,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    register(){
        console.log("hola")
        var r = {
            "user": this.username,
            "pass": this.pass,
            "telephone": this.telephone
        }
        console.log(r)
        if(this.username != undefined && this.pass != undefined && this.telephone != undefined){
            fetch('http://localhost:3000/register',{
            method: 'POST',
            body: JSON.stringify(r),
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
            }).then(res=>res.json())
            .then(data => {
                console.log(data)
                if(data.Message != undefined){
                    console.log(data)
                    this.message="Error: " + data.Message
                    
                }else{
                    this.$router.push('/login')
                }
            })
        }else{
            this.mensaje="Error, es necesario rellenar todos los campos"
        }
        

    },
    handleRegister() {
      /*this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            data => {
              this.message = data.message;
              this.successful = true;
            },
            error => {
              this.message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
        }
      });*/
      console.log("a")
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}
.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}
.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>