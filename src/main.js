import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueMaterial from 'vue-material'
import { MdList } from 'vue-material/dist/components'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' 

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(MdList)

new Vue({
  created(){
    this.isAuthMsjElectron()
  },
  methods: {
    isAuth: function(){
      console.log("____"+this.token)
      if(this.token == ""){
        return false
      }
      return true
    },
    isAuthMsjElectron: function(){
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send('get-token')
  
      ipcRenderer.on('get-token',(event, arg) => {
        this.token = arg;
        console.log(this.token)
      })
    }
  },
  data : function(){
    return {
      token: "",
    }
  },
  router,
  render: h => h(App)
}).$mount('#app')
