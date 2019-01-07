<template>
  <div>
    <div class="newwallet_box">
      <div class="newWallet_title flex-c">
        <h3 class="title">Import wallet</h3>
      </div>

      <div class="flex-bc selectType_box">
        <div class="selectType_type flex-ai-c">
          <ul>
            <li>
              <input type="radio" name="selectType" id="aria1" class="input" checked>
              <label class="flex-sc labelStyle" for="aria1" data-show="keystore">
                <div class="radioBox flex-c">
                  <i class="radio"></i>
                </div>
                <p class="p">Keystore / JSON File</p>
              </label>
            </li>
            <li>
              <input type="radio" name="selectType" id="aria2" class="input">
              <label class="flex-sc labelStyle" for="aria2" data-show="private">
                <div class="radioBox flex-c">
                  <i class="radio"></i>
                </div>
                <p class="p">Private Key</p>
              </label>
            </li>
          </ul>
        </div>

        <div class="selectType_content">
          <div class="selectType_keystore" id="keystore" data-view="keystore" style="display:block">
            <hgroup class="selectType_contTitle">
              <h3 class="title">Select Your Wallet File</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="selectType_KSbtn">
                <p class="p">SELECT WALLET FILE...</p>
                <input type="file" class="file" id="fileUpload">
              </div>
              <div class="selectType_contTnput" v-if="showPwd">
                <input
                  type="password"
                  placeholder="Enter a password"
                  class="input-text input"
                  v-model="password"
                  @keyup="changePwd"
                >
              </div>

              <div class="createInfo_btn flex-c" v-if="showPwdBtn">
                <button class="btn" @click="inputFileBtn" id="UnlockBtn">Unlock</button>
              </div>
            </div>
          </div>

          <div class="selectType_keystore" id="private" data-view="private">
            <hgroup class="selectType_contTitle">
              <h3 class="title">Paste Your Private Key</h3>
            </hgroup>
            <div class="selectType_contentBox">
              <div class="selectType_contTnput">
                <input
                  type="password"
                  placeholder="Enter a Private Key"
                  class="input-text input"
                  v-model="privateKey"
                  @keyup="changePrv"
                >
              </div>

              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputPwdBtn" v-if="showPwdBtn">Unlock</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="createInfo_tip pb-20">
        <h3
          class="h3"
        >Fusion DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, reset passwords,
          <br>nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.
        </h3>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import wallet from "@/assets/js/wallet";

const PromptSvg = require("@/assets/image/Prompt.svg");

export default {
  name: "createWallet",
  // props: ['wAdress'],
  data() {
    return {
      password: "",
      fileJSON: "",
      showPwd: false,
      showPwdBtn: false,
      fileData: "",
      privateKey: "",
      publicKey: "",
      checkAddress: "",
      downloadURL: "",
      downloadName: ""
    };
  },
  mounted() {
    // TODO: Have to do refactoring
    $(".selectType_type").on("click", "label", event => {
      let showID = $(event.currentTarget).attr("data-show");
      $("[data-view]").hide();
      $("[data-view=" + showID + "]").show();
      this.showPwd = false;
      this.showPwdBtn = false;
      this.password = "";
      $("#fileUpload").val("");
      this.privateKey = "";
      this.publicKey = "";
      this.checkAddress = "";
      this.downloadName = "";
      this.downloadURL = "";
    });
    $("#fileUpload").change(() => {
      let reader = new FileReader();
      this.password = "";
      let _this = this;
      reader.onload = onLoadEvent => {
        this.fileData = onLoadEvent.currentTarget.result;
        // this.downloadName = $(_this)[0].files[0].name
        // this.downloadName = this.$$.getBlob('text/json;charset=UTF-8', this.fileData)
        this.showPwd = this.walletRequirePass(this.fileData);
      };
      reader.readAsText($(this)[0].files[0]);
    });
  },
  methods: {
    goBackupWallet() {
      this.setStore();
      this.sendInfoToParent();
      this.$router.push("/backupWallet");
    },
    inputFileBtn() {
      let walletData;
      try {
        walletData = wallet.getWalletFromPrivKeyFile(
          this.fileData,
          this.password
        );
        this.checkAddress = walletData.getChecksumAddressString();
        this.privateKey = walletData.getPrivateKeyString();
        this.downloadName = walletData.getV3Filename();
        this.downloadURL = this.$$.getBlob(
          "text/json;charset=UTF-8",
          this.fileData
        );
        if (
          this.checkAddress.toLowerCase() !==
          this.$store.state.addressInfo.toLowerCase()
        ) {
          this.$$.layerMsg({
            tip: "Account error!",
            time: 3000,
            bgColor: "#ea4b40",
            icon: PromptSvg
          });
          return;
        }
        this.goBackupWallet();
      } catch (e) {
        this.$$.layerMsg({
          tip: e,
          time: 2000,
          bgColor: "#ea4b40",
          icon: PromptSvg
        });
      }
    },
    inputPwdBtn() {
      let walletData;
      try {
        walletData = new wallet(
          new Buffer(this.fixPkey(this.privateKey), "hex")
        );
        this.checkAddress = walletData.getChecksumAddressString();
        this.downloadURL = "";
        this.downloadName = "";
        if (
          this.checkAddress.toLowerCase() !==
          this.$store.state.addressInfo.toLowerCase()
        ) {
          this.$$.layerMsg({
            tip: "Account error!",
            time: 3000,
            bgColor: "#ea4b40",
            icon: PromptSvg
          });
          return;
        }
        this.goBackupWallet();
      } catch (e) {
        this.$$.layerMsg({
          tip: e,
          time: 2000,
          bgColor: "#ea4b40",
          icon: PromptSvg
        });
      }
    },
    sendInfoToParent() {
      this.$emit("setAddress", this.checkAddress);
    },
    setStore() {
      this.$store.commit("storePrivateKey", this.privateKey);
      // this.$store.commit('storePubliceKey', this.publicKey)
      this.$store.commit("storeAddress", this.checkAddress);
      this.$store.commit("storeKeystoreURL", this.downloadURL);
      this.$store.commit("storeDownload", this.downloadName);
    },
    changePrv(e) {
      // if (this.privateKey.length < 6) {
      //   this.showPwdBtn = false
      // } else {
      this.showPwdBtn = true;
      if (e.which === 13) {
        this.inputPwdBtn();
      }
      // }
    },
    changePwd(e) {
      // if (this.password.length < 6) {
      //   this.showPwdBtn = false
      // } else {
      this.showPwdBtn = true;
      if (e.which === 13) {
        this.inputFileBtn();
      }
      // }
    },
    walletRequirePass(ethjson) {
      let jsonArr;
      try {
        jsonArr = JSON.parse(ethjson);
      } catch (err) {
        throw "This is not a valid wallet file. ";
      }
      if (jsonArr.encseed != null) {
        return true;
      } else if (jsonArr.Crypto != null || jsonArr.crypto != null) {
        return true;
      } else if (jsonArr.hash != null && jsonArr.locked) {
        return true;
      } else if (jsonArr.hash != null && !jsonArr.locked) {
        return false;
      } else if (jsonArr.publisher == "MyEtherWallet" && !jsonArr.encrypted) {
        return false;
      } else {
        throw "Sorry! We don't recognize this type of wallet file. ";
      }
    },
    fixPkey(key) {
      if (key.indexOf("0x") === 0) {
        return key.slice(2);
      }
      return key;
    }
  }
};
</script>
