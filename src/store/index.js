import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const { GoogleSpreadsheet } = require('google-spreadsheet');

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

      store = store.split(' ').join('')

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

      store = store.split(' ').join('')

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

      store = store.split(' ').join('')

      let invoiceRes = await axios.post('http://localhost:8085/getInvoice', {
        id : id,
        pw : pw,
        store : store,
      })

      const doc = new GoogleSpreadsheet('1BPE-mtjv7VoNmi_4aevyPLdq0xZC6Y8lyNUa_bQBwzk');
     
      await doc.useServiceAccountAuth(require('../crew30-a4b6e6cdd464.json'));
      await doc.loadInfo();
      
      const qodnwnwkd = await doc.sheetsByIndex[4]
      const urbane = await doc.sheetsByIndex[5]
      
      const qodnwnwkdRow = await qodnwnwkd.getRows()
      const urbaneRow = await urbane.getRows()

      let invoice = await invoiceRes.data.invoiceList

      if (invoice.length == 0) return alert('수정할 주문이 없습니다.')

      let cookies = await invoiceRes.data.cookies

      let temp = 0

      for(let i = 0; i < invoice.length; i++) {
        if(invoice[i].deliveryInvoiceNo == '해외배송진행중') {
          let invoiceNum = ''
          let tempOrderNo = invoice[i].productOrderNo

          const qodnwnwkdRes = await qodnwnwkdRow.find(r => r._rawData[5] == tempOrderNo)

          if(qodnwnwkdRes!=undefined) {
            invoiceNum = await qodnwnwkdRes._rawData[23]
              if(invoiceNum == undefined) continue;
          } else {
              const urbaneRes = await urbaneRow.find(r => r._rawData[5] == tempOrderNo)
              if(urbaneRes == undefined) continue;
              invoiceNum = await urbaneRes._rawData[23]
              if(invoiceNum == undefined) continue;
          }
          
          let result = await axios.post('http://localhost:8085/updateInvoice', {
            cookies : cookies,
            productNum : tempOrderNo,
            invoiceNum : invoiceNum,
          })

          if(result.data == '성공') temp ++;
      }
      }

      return alert(temp +'건 성공')

    },
  },
})
