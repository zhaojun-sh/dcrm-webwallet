<template>
  <div>
    <div class="newwallet_box">

      <div class="newWallet_title flex-c">
        <h3 class="title">Create New Wallet</h3>
      </div>

      <div class="createInfo_box">
        <div class="createInfo_input">
          <input
            type="password"
            placeholder="Enter a password"
            class="input-text input"
            v-model="password"
            @keyup="validPwd"
          >
        </div>
        <div class="createInfo_danger">* Do NOT forget to save this!</div>
        <div class="createInfo_btn flex-c">
          <button class="btn" @click="changePwd">Next step</button>
        </div>
        <hgroup class="createInfo_tip">
          <h1
            class="h1"
          >This password encrypts your private key. This does not act as a seed to generate your keys.</h1>
          <h2 class="h2">You will need this password + your private key to unlock your wallet.</h2>
          <h3
            class="h3"
          >Fusion DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, 
            <br/>reset passwords, nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.
          </h3>
        </hgroup>
      </div>

    </div>
  </div>
</template>

<style>

</style>

<script>
import wallet from "@/assets/js/wallet"
export default {
  name: "createWallet",
  data () {
    return {
      password: "",
      walletInit: ""
    }
  },
  mounted () {
    this.$$.showSearchTop()
    this.$store.commit("storeWalletLoadFlag", true)
    this.$store.commit("storeAddress", "")
  },
  methods: {
    goSaveKeystore () {
      this.$router.push("/saveKeystore")
    },
    createKey (pwd) {
      this.walletInit = wallet.generate(pwd)
    },
    changePwd () {
      if (this.password.length < 9) {
        this.$$.layerMsg({
          tip: "Your password must be at least 9 characters. Please ensure it is a strong password.",
          time: 2000,
          bgColor: "#ea4b40",
          icon: this.$$.promptSvg
        })
      } else {
        this.createKey()
        let walletJSON = this.walletInit.toV3(this.password, {
          kdf: "scrypt",
          n: 8192
        })
        let keyStoreURL = this.$$.getBlob("text/json;charset=UTF-8", walletJSON)
        this.$store.commit("storeKeystoreURL", keyStoreURL)
        this.$store.commit("storeDownload", this.walletInit.getV3Filename())
        this.goSaveKeystore()
      }
    },
    validPwd (e) {
      if (this.password.length < 9) {
        $(".createInfo_input")
          .find(".input")
          .css("border","2px solid #ea4b40")
      } else {
        $(".createInfo_input").find(".input").css("border","2px solid #2f7cd7")
        if (e.which === 13) {
          this.changePwd()
        }
      }
    }
  }
}
</script>
