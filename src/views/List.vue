<template>
  <div>
    <md-button v-on:click="itemCreate" class="md-raised md-primary">Crear</md-button>
    <md-button v-if="!$root.isAuth()" v-on:click="openWindowLogin" class="md-raised md-primary">Login</md-button>

    <md-list class="md-elevation-2">
      <md-list-item v-for="(item, key) in items" v-bind:key="item.id">
        <md-icon class="md-accent">done</md-icon>
        <span class="md-list-item-text">{{ item.task }}</span>

        <md-button @click="itemUpdate(key)" class="md-icon-button md-list-action">
          <md-icon class="md-primary">create</md-icon>
          <md-tooltip md-direction="top">Editar: {{ item.task }}</md-tooltip>
        </md-button>

        <md-button @click="itemDeleteConfirm(key)" class="md-icon-button md-list-action">
          <md-icon class="md-accent">delete</md-icon>
          <md-tooltip md-direction="top">Borrar</md-tooltip>
        </md-button>
      </md-list-item>
      <md-divider class="md-inset"></md-divider>
    </md-list>

    <md-button @click="itemCreate" class="md-fab md-plain md-primary md-fab-bottom-right">
      <md-icon>add</md-icon>
      <md-tooltip md-direction="top">Crear</md-tooltip>
    </md-button>

    <md-dialog-prompt
      :md-active.sync="showModal"
      v-model="task"
      md-title="Ingrese Tarea"
      md-input-maxlength="30"
      md-input-placeholder="Ingrese Tarea"
      md-confirm-text="Guardar"
      @md-confirm="saveTask"
    />

    <md-dialog-confirm
      :md-active.sync="showModalDelete"
      md-title="¿Seguro que deseas borrar la tarea seleccionada?"
      md-content="No podrás revertir la operación."
      md-confirm-text="Borrar"
      md-cancel-text="No borrar"
      @md-confirm="itemDelete"
    />
  </div>
</template>

<script>
//var { ipcRenderer } = require('electron')
const axios = require("axios");

export default {
  data: function() {
    return {
      items: [],
      itemsIndex: -1,
      showModal: false,
      showModalDelete: false,
      task: ""
    };
  },
  created() {
    //this.items = data;

  

    axios
      .get("http://localhost:3000/task")
      .then(res => (this.items = res.data));
    /*fetch('http://localhost:3000/task')
    .then(res => res.json())
    .then(res => this.items = res)*/
  },
  methods: {
    openWindowLogin: function(){
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send('open-window-login')

    //console.log("Auth "+this.$root.isAuth()+" "+this.$root.token)

    },
    itemGet: function(id) {
      axios
        .get("http://localhost:3000/task/" + id)
        .then(res => this.items.push(res.data));
      /* fetch('http://localhost:3000/task/'+id)
        .then(res => res.json())
        .then(res => this.items.push(res))*/
    },
    itemCreate: function() {
      this.itemsIndex = -1;
      this.showModal = true;
    },
    saveTask() {
      if (this.task.trim() == "") return;

      //const { ipcRenderer } = window.require("electron");

      if (this.itemsIndex == -1) {
        //this.items.push(this.task);
        //ipcRenderer.send('item-save',this.task)

        const data = { task: this.task.trim() };

        axios
          .post("http://localhost:3000/task", data)
          .then(res => this.itemGet(res.data.id));

        /*   fetch('http://localhost:3000/task',{
          method:'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(res => this.itemGet(res.id))
*/
      } else {
        //this.items[this.itemsIndex] = this.task;
        //ipcRenderer.send('item-update',this.items[this.itemsIndex].id, this.task)
        const data = { task: this.task.trim() };
        this.items[this.itemsIndex].task = this.task;

        axios.put(
          "http://localhost:3000/task/" + this.items[this.itemsIndex].id,
          data
        );

        /* fetch('http://localhost:3000/task/'+this.items[this.itemsIndex].id,{
          method:'PUT',
          body: JSON.stringify(data),
          headers:{
            'Content-Type': 'application/json'
          }
        })*/
      }
      //ipcRenderer.send('item-send')
      this.task = "";
    },
    itemDelete() {
      //const { ipcRenderer } = window.require("electron");
      //ipcRenderer.send('item-delete',this.items[index].id)

      axios.delete(
        "http://localhost:3000/task/" + this.items[this.itemsIndex].id
      );

      /*fetch('http://localhost:3000/task/'+this.items[this.itemsIndex].id,{
        method:'DELETE',
        headers:{
          'Content-Type': 'application/json'
        }
      })*/
      this.items.splice(this.itemsIndex, 1);

      this.itemsIndex = -1;
      this.showModalDelete = false;
    },
    itemDeleteConfirm(index) {
      this.showModalDelete = true;
      this.itemsIndex = index;
    },
    itemUpdate(index) {
      this.itemsIndex = index;
      this.showModal = true;
      this.task = this.items[this.itemsIndex].name;
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
</style>