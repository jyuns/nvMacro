<template>
  <div class='login-container'>
      <p class='login-header'>아이디 <button @click='del()'>X</button></p>
      <input type='text' v-model="tempId" :disabled='disabled' />
      <p>비밀번호</p>
      <input type='text' v-model="tempPw" :disabled='disabled' />
      <p>스토어명</p>
      <input type='text' v-model="tempStore" :disabled='disabled' />
      <span style='margin-top: 16px;'><button style="width:153px;" @click='check()'>✓</button></span>
      <span style='margin-top: 16px;'><button style="width:153px;" @click='update()'>업로드</button></span>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

export default {
    data() {
        return {
            tempId : '',
            tempPw : '',
            tempStore : '',
            disabled : false,
        }       
    },

    props : {
        id : String,
        pw : String,
        store : String,
    },

    mounted() {
        if(!this.id) return
        if(this.id) {this.disabled=true}

        this.tempId = this.id
        this.tempPw = this.pw
        this.tempStore = this.store
    },

    computed : {
        ...mapState([
            'account'
        ])
    },

    methods : {

        ...mapActions([
            'CHECK', 'DEL', 'UPDATE'
        ]),

        async check() {
            if(!this.tempId.length) return
            if(!this.tempPw.length) return
            if(!this.tempStore.length) return

            let result = await this.CHECK({
                id : this.tempId,
                pw : this.tempPw,
                store : this.tempStore
            })
            
            if(result) this.disabled = true
        },

        update() {
            if(!this.disabled) return
            
            this.UPDATE({
                id : this.tempId,
                pw : this.tempPw,
                store : this.tempStore
            })

        },

        del() {
            this.DEL({
                store : this.tempStore
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
    margin-bottom: .5em;
    margin-top: 1rem;
}

</style>