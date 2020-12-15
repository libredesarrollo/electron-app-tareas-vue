
<template>
  <div class="center-container">
    <md-card>
      <md-card-header>
        <div class="md-title">Login</div>
      </md-card-header>

      <md-card-content>
        <div v-if="!loading">
          <md-field>
            <label>Usuario</label>
            <md-input v-model="login.user" autofocus></md-input>
          </md-field>

          <md-field>
            <label>Contraseña</label>
            <md-input type="password" v-model="login.password" autofocus></md-input>
          </md-field>

          <md-button class="md-raised md-primary" @click="auth">Log In</md-button>
        </div>

        <div class="loading-overlay" v-if="loading">
          <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
        </div>
      </md-card-content>
    </md-card>

    <md-dialog-alert
      :md-active.sync="loginError"
      md-content="Usuario y/o contraseña incorrectos"
      md-confirm-text="Ok"
    />
    
  </div>
</template>
<script>
const axios = require("axios");

export default {
  data: function () {
    return {
      loading: false,
      login: {
        user: "",
        password: "",
      },
      loginError: false,
    };
  },
  methods: {
    auth() {
      //this.loading = true;

      let data = {
        username: this.login.user,
        password: this.login.password,
      };

      //axios.post("http://localhost:3000/login",data).then((res) => console.log(res.data))

      axios.post("http://localhost:3000/login", data).then((res) => {
        console.log(res.data.token);
        this.loading = false;

        if(res.data.token){
          const { ipcRenderer } = window.require("electron");
          ipcRenderer.send('close-window-login')
        } else{
          this.loginError=true;
        }

      });

      /*setTimeout(() => {
        this.loading = false;
      }, 5000);*/


    },
  },
};
</script>
<style>
.center-container {
  padding: 40px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>