import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account : null
  },
  mutations: {
    INIT(state) {
      let tempStorage = localStorage.getItem('account')
      tempStorage = JSON.parse(tempStorage)

      state.account = tempStorage
    },

    SAVE(state) {
      let tempAccount = state.account

      for(let i = 0; i < tempAccount.length; i++) {
        if(!isNaN(Number(tempAccount[i].length))) tempAccount.splice(i, 1)
      }

      let tempStr = JSON.stringify(tempAccount)
      localStorage.setItem('account', tempStr)
    },

  },
  actions: {
    ADD({state}) {
      let tempAccount = state.account
      console.log(state.account)
      if(!tempAccount) {return state.account = ['']}
      console.log(tempAccount)
      if(tempAccount.length>=0) {tempAccount.push(''); return state.account = tempAccount}
    },

    DEL({state, commit}, payload) {

      let store = payload.store
      let delIndex = null
      let tempAccount = state.account

      for(let i = 0 ; i < tempAccount.length; i ++) {
        if(tempAccount[i].store == store) {delIndex = i; break;}
      }
      
      if(delIndex == null) return

      tempAccount.splice(delIndex, 1)
      state.account = tempAccount

      commit('SAVE')
    },

    async CHECK({state, commit}, payload) {

      let id = payload.id
      let pw = payload.pw
      let store = payload.store

      try {
        await axios.post('http://localhost:8085/login', {
          id : id,
          pw : pw,
          store : store,
        })
        alert('로그인 성공')
      } catch{
        return alert('로그인 실패')
      }
      

      let tempAccount = state.account
      let delIndex = null
    
      if(tempAccount == '') state.account = []

      for(let i = 0 ; i < tempAccount.length; i ++) {
        if(tempAccount[i].store == store) {delIndex = i; break;}
      }
      
      if(delIndex != null) return false

      state.account.push({
        id : id,
        pw : pw,
        store : store,
      })
      commit('SAVE')

      return true
    },

    async UPDATE({state}, payload) {
      state
      let id = payload.id
      let pw = payload.pw
      let store = payload.store

      await axios.post('http://localhost:8085/updateInvoice', {
        id : id,
        pw : pw,
        store : store,
      })

    },
  },
})
