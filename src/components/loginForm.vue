<template>
  <div class='login-container'>
      <p class='login-header'>ID <button @click='del()'>X</button></p>
      <input type='text' v-model="tempId" :disabled='disabled' />
      <p>PW</p>
      <input type='text' v-model="tempPw" :disabled='disabled' />
      <span style='margin-top: 16px;'><button style="width:153px;" @click='check()'>✓</button></span>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
    data() {
        return {
            tempId : '',
            tempPw : '',

            disabled : false,
        }       
    },

    props : {
        id : String,
        pw : String,
    },

    mounted() {
        if(this.id) this.disabled=true

        this.tempId = this.id
        this.tempPw = this.pw
    },

    computed : {
        ...mapState([
            'account'
        ])
    },

    methods : {

        ...mapActions([
            'CHECK', 'DEL'
        ]),

        async check() {
            if(!this.tempId.length) return
            if(!this.tempPw.length) return

            let result = await this.CHECK({
                id : this.tempId,
                pw : this.tempPw,
            })
            
            if(result) this.disabled = true
        },

        del() {
            this.DEL({
                id : this.id
            })
        },
    }
}
</script>

<style>
.login-container {
    display:flex;
    flex-direction: column;
    padding: 16px;
    border: 1px solid white;
    margin: 24px;
}

.login-header {
    display:flex;
    justify-content: space-between;
}

p {
    color:white;
    text-align: left;
    margin-bottom: 8px;
    margin-top: 4px!important;
}

</style>