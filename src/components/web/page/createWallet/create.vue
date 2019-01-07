<template>
  <div>
    <div class="newwallet_box">

      <div class="newWallet_title flex-c">
        <h3 class="title">Create New Wallet</h3>
      </div>

      <div class="createInfo_box">
        <div class="createInfo_input">
          <input type="password" placeholder="Enter a password" class="input-text input" v-model="password" @keyup="validPwd">
        </div>
        <div class="createInfo_danger">* Do NOT forget to save this!</div>
        <div class="createInfo_btn flex-c">
          <button class="btn" @click="changePwd">Next step</button>
        </div>
        <hgroup class="createInfo_tip">
          <h1 class="h1">This password encrypts your private key. This does not act as a seed to generate your keys. </h1>
          <h2 class="h2">You will need this password + your private key to unlock your wallet.</h2>
          <h3 class="h3">Fusion DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, <br/>reset passwords, nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.</h3>
        </hgroup>
      </div>

    </div>
  </div>
</template>

<style>

</style>

<script>
import wallet from '@/assets/js/wallet'
export default {
  name: 'createWallet',
  data () {
    return {
      password: '',
      walletInit: ''
    }
  },
  mounted () {
    let that = this
    that.$$.showSearchTop()
    that.$store.commit('storeWalletLoadFlag', true)
    that.$store.commit('storeAddress', '')
  },
  methods: {
    goSaveKeystore () {
      let that = this
      that.$router.push('/saveKeystore')
    },
    createKey (pwd) {
      let that = this
      that.walletInit = wallet.generate(pwd)
    },
    changePwd () {
      let that = this
      if (that.password.length < 9) {
        that.$$.layerMsg({
          tip: 'Your password must be at least 9 characters. Please ensure it is a strong password.',
          time: 2000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
      } else {
        that.createKey()
        let walletJSON = that.walletInit.toV3(that.password, {kdf: "scrypt", n: 8192})
        let keyStoreURL = that.$$.getBlob('text/json;charset=UTF-8', walletJSON)
        that.$store.commit('storeKeystoreURL', keyStoreURL)
        that.$store.commit('storeDownload', that.walletInit.getV3Filename())
        that.goSaveKeystore()
      }
    },
    validPwd (e) {
      let that = this
      if (that.password.length < 9) {
        $('.createInfo_input').find('.input').css('border','2px solid #ea4b40')
      } else {
        $('.createInfo_input').find('.input').css('border','2px solid #2f7cd7')
        if (e.which === 13) {
          that.changePwd()
        }
      }
    }
  }
}
</script>
