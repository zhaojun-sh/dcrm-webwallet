<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">My Wallet</h1>
    </div>

    <div class="contView_box backupInfo_box">
      <div class="backupInfo_top">
        <div class="backupCont_box">
          <h3 class="title">Your Address</h3>
          <div class="backupCont_input">
            <input
              type="text"
              class="input-text input"
              readonly
              v-model="walletAdress"
              id="walletAdress"
            />
          </div>
          <div v-if="keystoreHide">
            <p class="tip">Keystore File (UTC / JSON · Recommended · Encrypted)</p>
            <a class="btn" :download="keystoreName" :href="keystoreURL">Download</a>
          </div>
        </div>

        <div class="backupCont_box" id="receiveAddressBtn">
          <h3 class="title">Private Key (unencrypted)</h3>
          <div class="backupCont_input">
            <input
              type="password"
              class="input-text input input1"
              readonly
              v-model="privateKey"
              id="privateKey"
            />
            <input
              type="text"
              class="input-text input input1"
              v-model="privateKey"
              id="privateKeyInfo"
              style="opacity: 0;"
            />
            <div class="eyesBox showAndHideEyes" id="eyesView"><div class="eyes"><img src="@/assets/image/Visible.svg"></div></div>
          </div>
          <button class="btn" @click="copyAddress('privateKeyInfo', 'receiveAddressBtn')" data-toggle="tooltip" data-placement="bottom" title="Copy clipboard">Copy clipboard</button>
        </div>
      </div>

      <div class="qrcodeView_box">
        <ul>
          <li>
            <div class="qrcodeView_cont">
              <h3 class="title">Your Address</h3>
              <div id="addressQrcode"></div>
            </div>
          </li>
          <li>
            <div class="qrcodeView_cont">
              <h3 class="title">Private Key (unencrypted)</h3>
              <div id="privateQrcode" data-eyes="1"></div>
              <div class="qrcodeView_black"></div>
              <div class="qrcodeView_eyes showAndHideEyes"><img src="@/assets/image/Visible.svg"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<style>

</style>

<script>
import QRCode from "qrcodejs2"
export default {
  name: "Transfer",
  data () {
    return {
      walletAdress: "",
      privateKey: "",
      keystoreName: "",
      keystoreURL: "",
      keystoreHide: false
    }
  },
  mounted () {
    this.pageRefresh()
    $(".showAndHideEyes").click(() => {
      let pwdAndTxt = $("#privateKey").attr("type")
      $("#privateQrcode").html("")
      if (pwdAndTxt === "password") {
        $("#privateKey").attr("type", "text")
        $("#eyesView").find("img").attr("src", require("@/assets/image/Hide.svg"))
        this.qrcode(this.privateKey, "privateQrcode")
        $(".qrcodeView_eyes").find("img").attr("src", require("@/assets/image/Hide.svg"))
        $("#privateQrcode").attr("data-eyes", "0")
        $(".qrcodeView_black").hide()
      } else {
        $("#privateKey").attr("type", "password")
        $("#eyesView").find("img").attr("src", require("@/assets/image/Visible.svg"))
        $(".qrcodeView_eyes").find("img").attr("src", require("@/assets/image/Visible.svg"))
        $("#privateQrcode").attr("data-eyes", "1")
        $(".qrcodeView_black").show()
      }
    })

    if (!this.$store.state.privateKey) {
      this.$router.push("/importWallet")
    }
  },
  methods: {
    qrcode (cont, id) {
      let qrcodeInit = new QRCode(id, {
        width: 270,
        height: 270, // 高度
        text: cont // 二维码内容
        // render: "canvas" // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: "#f0f"
        // foreground: "#ff0"
      })
      // console.log(qrcodeInit)
    },
    pageRefresh () {
      this.walletAdress = this.$store.state.addressInfo
      this.privateKey = this.$store.state.privateKey
      this.keystoreURL = this.$store.state.keystoreURL
      this.keystoreName = this.$store.state.downloadName
      if (this.keystoreURL && this.keystoreName) {
        this.keystoreHide = true
      }
      if (this.walletAdress) {
        this.qrcode(this.walletAdress, "addressQrcode")
      }
      if (this.privateKey) {
        this.qrcode(this.privateKey, "privateQrcode")
      }
    },
    copyAddress (id, textId) {
      let copyText = $("#" + textId).find(".tooltip-inner").text()
      document.getElementById(id).select()
      document.execCommand("Copy")
      $("#" + textId).find(".tooltip-inner").text("Copied")
      setTimeout(function () {
        $("#" + textId).find(".tooltip-inner").text(copyText)
      }, 3000)
      this.$$.layerMsg("Copy Success")
    },
  },
  destroyed () {
    this.$store.commit("storePrivateKey", "")
  }
}
</script>
