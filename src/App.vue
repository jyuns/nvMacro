<template>
  <div id="app">
    <div class='main-container'>
    <login-form v-for="(value, index) in account" :key='"accont" + index' :id='value.id' :pw='value.pw' :store='value.store' />
    <button class='add-btn' @click='add()'>+</button>
    </div>
  </div>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',

  components : {
    loginForm : require('./components/loginForm').default
  },

  mounted() {
    this.INIT()
  },

  computed : {
    ...mapState([
      'account'
    ])
  },

  methods : {

    ...mapMutations([
      'SAVE', 'INIT'
    ]),

    ...mapActions([
      'ADD', 
    ]),

    add() {
      this.ADD()
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
  height: 100vh;
  display:flex;
  align-items: center;;
}

.add-btn {
  width: 24px;
  height: 24px;
}

.main-container {
  display:flex;
  overflow: auto;
  overflow-x: auto;
  align-items: center;;
}
</style>
