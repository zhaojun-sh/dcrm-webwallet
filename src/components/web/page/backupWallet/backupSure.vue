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
                <div class="radioBox flex-c"><i class="radio"></i></div>
                <p class="p">Keystore / JSON File</p>
              </label>
            </li>
            <li>
              <input type="radio" name="selectType" id="aria2" class="input">
              <label class="flex-sc labelStyle" for="aria2" data-show="private">
                <div class="radioBox flex-c"><i class="radio"></i></div>
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
                <input type="password" placeholder="Enter a password" class="input-text input" v-model="password" @keyup="changePwd">
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
                <input type="password" placeholder="Enter a password" class="input-text input" v-model="privateKey" @keyup="changePrv">
              </div>

              <div class="createInfo_btn flex-c">
                <button class="btn" @click="inputPwdBtn" v-if="showPwdBtn">Unlock</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="createInfo_tip pb-20">
        <h3 class="h3">Fusion DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, reset passwords,<br/>nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.</h3>
      </div>

    </div>
  </div>
</template>

<style>

</style>

<script>
import wallet from '../../../../assets/js/wallet'
export default {
  name: 'createWallet',
  // props: ['wAdress'],
  data () {
    return {
      password: '',
      fileJSON: '',
      showPwd: false,
      showPwdBtn: false,
      fileData: '',
      privateKey: '',
      publicKey: '',
      checkAddress: '',
      downloadURL: '',
      downloadName: ''
    }
  },
  mounted () {
    let that = this
    $('.selectType_type').on('click', 'label', function () {
      let showID = $(this).attr('data-show')
      $('[data-view]').hide()
      $('[data-view=' + showID + ']').show()
      that.showPwd = false
      that.showPwdBtn = false
      that.password = ''
      $('#fileUpload').val('')
      that.privateKey = ''
      that.publicKey = ''
      that.checkAddress = ''
      that.downloadName = ''
      that.downloadURL = ''
    })
    $('#fileUpload').change(function () {
      let reader = new FileReader()
      that.password = ''
      let _this = this
      reader.onload = function (onLoadEvent) {
        that.fileData = onLoadEvent.currentTarget.result
        // that.downloadName = $(_this)[0].files[0].name
        // that.downloadName = that.$$.getBlob('text/json;charset=UTF-8', that.fileData)
        that.showPwd = that.walletRequirePass(that.fileData)
      }
      reader.readAsText($(this)[0].files[0])
    })
  },
  methods: {
    goBackupWallet () {
      let that = this
      that.setStore()
      that.sendInfoToParent()
      that.$router.push('/backupWallet')
    },
    inputFileBtn () {
      let that = this
      let walletData
      try{
        walletData = wallet.getWalletFromPrivKeyFile(that.fileData, that.password)
        that.checkAddress = walletData.getChecksumAddressString()
        that.privateKey = walletData.getPrivateKeyString()
        that.downloadName = walletData.getV3Filename()
        that.downloadURL = that.$$.getBlob('text/json;charset=UTF-8', that.fileData)
        if (that.checkAddress.toLowerCase() !== that.$store.state.addressInfo.toLowerCase()) {
          that.$$.layerMsg({
            tip: 'Account error!',
            time: 3000,
            bgColor: '#ea4b40',
            icon: require('../../../../assets/image/Prompt.svg')
          })
          return
        }
        // console.log(that.checkAddress)
        that.goBackupWallet()
      } catch (e) {
        that.$$.layerMsg({
          tip: e,
          time: 2000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
        // that.showPwdBtn = false
      }
    },
    inputPwdBtn () {
      let that = this
      let walletData
      try {
        walletData = new wallet(new Buffer(that.fixPkey(that.privateKey), 'hex'))
        that.checkAddress = walletData.getChecksumAddressString()
        that.downloadURL = ''
        that.downloadName = ''
        if (that.checkAddress.toLowerCase() !== that.$store.state.addressInfo.toLowerCase()) {
          that.$$.layerMsg({
            tip: 'Account error!',
            time: 3000,
            bgColor: '#ea4b40',
            icon: require('../../../../assets/image/Prompt.svg')
          })
          return
        }
        that.goBackupWallet()
      } catch (e) {
        that.$$.layerMsg({
          tip: e,
          time: 2000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
        // that.showPwdBtn = false
      }
    },
    sendInfoToParent () {
      let that = this
      that.$emit('setAddress', that.checkAddress)
    },
    setStore () {
      let that = this
      that.$store.commit('storePrivateKey', that.privateKey)
      // that.$store.commit('storePubliceKey', that.publicKey)
      that.$store.commit('storeAddress', that.checkAddress)
      that.$store.commit('storeKeystoreURL', that.downloadURL)
      that.$store.commit('storeDownload', that.downloadName)
    },
    changePrv (e) {
      let that = this
      // if (that.privateKey.length < 6) {
      //   that.showPwdBtn = false
      // } else {
      that.showPwdBtn = true
      if (e.which === 13) {
        that.inputPwdBtn()
      }
      // }
    },
    changePwd (e) {
      let that = this
      // if (that.password.length < 6) {
      //   that.showPwdBtn = false
      // } else {
      that.showPwdBtn = true
      if (e.which === 13) {
        that.inputFileBtn()
      }
      // }
    },
    walletRequirePass (ethjson) {
        let jsonArr
        try {
            jsonArr = JSON.parse(ethjson)
        } catch (err) {
            throw 'This is not a valid wallet file. '
        }
        if (jsonArr.encseed != null) {
          return true
        } else if (jsonArr.Crypto != null || jsonArr.crypto != null) {
          return true
        } else if (jsonArr.hash != null && jsonArr.locked) {
          return true
        } else if (jsonArr.hash != null && !jsonArr.locked) {
          return false
        } else if (jsonArr.publisher == "MyEtherWallet" && !jsonArr.encrypted) {
          return false
        } else {
          throw 'Sorry! We don\'t recognize this type of wallet file. '
        }
    },
    fixPkey (key) {
      if (key.indexOf("0x") === 0) {
        return key.slice(2);
      }
      return key
    }
  }
}
</script>
