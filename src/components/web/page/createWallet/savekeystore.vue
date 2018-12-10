<template>
  <div>
    <div class="newwallet_box">
      <div class="contTip_box">
        <hgroup class="contTip_title flex-c">
          <h3 class="title">Save your <span>Keystore</span> File.</h3>
        </hgroup>
        <div class="contTip_btn flex-c">
          <!-- <button class="btn flex-c" download="Download the Vue Devtools extension for a better development experience:">Download Keystore File (UTC / JSON)</button> -->
          <a class="btn flex-c" :download="keystoreName" :href="keystoreURL" @click="downloadChange">Download Keystore File (UTC / JSON)</a>
        </div>
      </div>

      <div class="contTip_box">
        <hgroup class="contTip_title noborder">
          <p class="p">**Do not lose it!** It cannot be recovered if you lose it.<br/>**Do not share it!** Your funds will be stolen if you use this file on a malicious/phishing site.<br/>**Make a backup!** Secure it like the millions of dollars it may one day be worth.</p>
        </hgroup>
        <div class="contTip_btn flex-c">
          <button class="btn flex-c red" @click="goBackupWallet" id="understandBtn" disabled="disabled">I understand. Continue.</button>
        </div>
      </div>
      <div class="contTip_p">
        <p>Fusion DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys,<br>reset passwords, nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.
</p>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'createWallet',
  data () {
    return {
      password: '',
      keystoreURL: '',
      keystoreName: ''
    }
  },
  mounted () {
    let that = this
    that.keystoreURL = that.$store.state.keystoreURL
    that.keystoreName = that.$store.state.downloadName
    console.log(that.keystoreName)
    if (!that.keystoreURL) {
      history.go(-1)
    }
  },
  methods: {
    goBackupWallet () {
      let that = this
      // that.$router.push('/backupWallet')
      that.$router.push('/')
    },
    downloadChange () {
      let that = this
      $('#understandBtn').removeAttr('disabled')
    }
  }
}
</script>
