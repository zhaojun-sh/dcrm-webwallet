<template>
  <div>
    <div class="pwdSure_box">

      <!-- <div class="newWallet_title flex-c">
        <h3 class="title">Import wallet</h3>
      </div> -->

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

      <!-- <div class="createInfo_tip pb-20">
        <h3 class="h3">Fusion DCRM Wallet does not hold your keys for you. We cannot access accounts, recover keys, reset passwords,<br/>nor reverse transactions. Protect your keys & always check that you are on correct URL. You are responsible for your security.</h3>
      </div> -->

    </div>
  </div>
</template>

<style>

</style>

<script>
import wallet from '../../../../assets/js/wallet'
import Lilo from '../../../../assets/js/lilo'
export default {
  name: 'createWallet',
  props: ['sendDataPage'],
  data () {
    return {
      password: '',
      fileJSON: '',
      showPwd: false,
      showPwdBtn: false,
      fileData: '',
      privateKey: '',
      checkAddress: '',
      web3: '',
      newWeb3: '',
      dcrmAddress: ''
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
      that.checkAddress = ''
    })
    $('#fileUpload').change(function () {
      let reader = new FileReader()
      that.password = ''
      let _this = this
      reader.onload = function (onLoadEvent) {
        that.fileData = onLoadEvent.currentTarget.result
        that.showPwd = that.walletRequirePass(that.fileData)
      }
      reader.readAsText($(this)[0].files[0])
    })
    // console.log(that.sendDataPage)
  },
  methods: {
    setWeb3 () {
      const that = this
      that.$$.setWeb3(that)
      // let Web3 = require('web3')
      // let web3
      // try {
      //   web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      // } catch (error) {
      //   web3 = new Web3()
      //   console.log(error)
      // }
      // let web3 = new Web3()
      // // console.log(that.selectData.url)
      // if (typeof web3 !== 'undefined') {
      //   // Web3 = new Web3(Web3.currentProvider)
      //   web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      // } else {
      //   Web3 = new Web3(new Web3.providers.HttpProvider(that.selectData.url))
      // }
      // that.web3 = web3
      that.newWeb3 = new Lilo(that.$$.baseUrl)
    },
    inputFileBtn () {
      let that = this
      let walletData
      try{
        walletData = wallet.getWalletFromPrivKeyFile(that.fileData, that.password)
        that.privateKey = walletData.getPrivateKeyString()
        that.checkAddress = walletData.getChecksumAddressString()
        // console.log(that.checkAddress.toLowerCase())
        // console.log(that.sendDataPage.from.toLowerCase())
        if (that.checkAddress.toLowerCase() !== that.sendDataPage.from.toLowerCase()) {
          that.$$.layerMsg({
            tip: 'Account error!',
            time: 3000,
            bgColor: '#ea4b40',
            icon: require('../../../../assets/image/Prompt.svg')
          })
          // $('#privateSure').modal('hide')
          $('#sendInfo').modal('hide')
          return
        }
        if (that.sendDataPage.sendType === 'LOCKOUT' || that.sendDataPage.sendType === 'LOCKIN' || that.sendDataPage.sendType === 'SENDDCRM') {
          that.getDcrmAddress()
        } else if (that.sendDataPage.sendType === 'MYWALLET') {
          that.getDecrAddress(that.privateKey)
        } else {
          that.signSendData()
        }
      } catch (e) {
        that.$$.layerMsg({
          tip: e,
          time: 5000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
      }
    },
    
    inputPwdBtn () {
      let that = this
      // console.log(that.sendDataPage)
      let walletData
      try {
        walletData = new wallet(new Buffer(that.fixPkey(that.privateKey), 'hex'))
        that.privateKey = walletData.getPrivateKeyString()
        that.checkAddress = walletData.getChecksumAddressString()
        if (that.checkAddress.toLowerCase() !== that.sendDataPage.from.toLowerCase()) {
          that.$$.layerMsg({
            tip: 'Account error!',
            time: 3000,
            bgColor: '#ea4b40',
            icon: require('../../../../assets/image/Prompt.svg')
          })
          // $('#privateSure').modal('hide')
          $('#sendInfo').modal('hide')
          return
        }
        if (that.sendDataPage.sendType === 'LOCKOUT' || that.sendDataPage.sendType === 'LOCKIN' || that.sendDataPage.sendType === 'SENDDCRM') {
          // console.log('lock')
          that.getDcrmAddress()
        } else if (that.sendDataPage.sendType === 'MYWALLET') {
          that.getDecrAddress(that.privateKey)
        }else {
          that.signSendData()
        }
      } catch (e) {
        console.log(e)
        that.$$.layerMsg({
          tip: e,
          time: 5000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
      }
    },
    getDcrmAddress () {
      const that = this
      that.setWeb3()
      that.newWeb3.lilo.dcrmGetAddr(that.$store.state.addressInfo, that.sendDataPage.coin).then(function (val) {
        that.dcrmAddress = val
        that.signSendData()
      })
    },
    getDecrAddress (pwd) {
      const that = this
      that.setWeb3()
      let gasPriceNum
      try {
        gasPriceNum = that.web3.eth.gasPrice.toString(10)
      } catch (error) {
        gasPriceNum = that.$$.getWeb3({
          method: 'eth_gasPrice',
          params: []
        }).result.toString(10)
      }

      let getGasLimit
      try {
        getGasLimit = that.web3.eth.estimateGas({to: that.toAddress})
      } catch (error) {
        try {
          getGasLimit = that.$$.getWeb3({
            method: 'eth_estimateGas',
            params: [{to: that.toAddress}]
          })
          if (getGasLimit.error) {
            getGasLimit = 'Error'
          } else {
            getGasLimit = getGasLimit.result
          }
        } catch (error) {
          getGasLimit = error
        }
        // throw error
      }
      if (getGasLimit && getGasLimit.toString().indexOf('Error') !== -1) {
        that.$$.layerMsg({
          tip: getGasLimit,
          time: 5000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
        throw getGasLimit
      }
      let rawTx = {
        nonce: that.sendDataPage.nonce,
        gasPrice: Number(gasPriceNum),
        gasLimit: Number(getGasLimit),
        // gasLimit: 21000,
        from: that.sendDataPage.from,
        to: '0x00000000000000000000000000000000000000dc',
        value: 0,
        data: ''
      }
      let sendBack = {
        coin: that.sendDataPage.coin,
        serializedTx: '',
        nowFlag: false,
        dcrmAddress: ''
      }
      let Tx = require('ethereumjs-tx')
      pwd = pwd.indexOf('0x') === 0 ? pwd.substr(2) : pwd
      let privateKey = new Buffer(pwd, 'hex')
      that.newWeb3.lilo.dcrmReqAddr(that.sendDataPage.from, that.sendDataPage.coin, pwd).then(function (val) {
        let dcrmAddressVal
        // console.log(val)
        // console.log(typeof val)
        if ((typeof val).toLowerCase() === 'object' && val.result) {
          // console.log(val.result)
          // console.log(val.result.indexOf('the account has confirm dcrm address already.the dcrm address is'))
          if (val.result.indexOf('the account has confirm dcrm address already.the dcrm address is') === 0) {
            that.$$.layerMsg({
              tip: 'The address has been requested. Please refresh later. DCRM:' + val.result.split(':')[1],
              time: 8000,
              bgColor: '#5dba5a',
              icon: require('../../../../assets/image/Prompt.svg')
            })
            $('#privateSure').modal('hide')
          } else{
            that.$$.layerMsg({
              tip: val.result,
              time: 8000,
              bgColor: '#ea4b40',
              icon: require('../../../../assets/image/Prompt.svg')
            })
          }
          return
        }
        if (val.error && val.error.message.indexOf('the account has request dcrm address already.the dcrm address is') === 0) {
          dcrmAddressVal = val.error.message.split(':')[1]
          sendBack.nowFlag = false
        } else {
          dcrmAddressVal = val
          sendBack.nowFlag = true
        }
        sendBack.dcrmAddress = dcrmAddressVal
        rawTx.data = 'DCRMCONFIRMADDR:' + dcrmAddressVal + ':' + that.sendDataPage.coin
        // console.log(rawTx)
        let tx = new Tx(rawTx)
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        let serializedTxString = serializedTx.toString('hex')
        serializedTxString = serializedTxString.indexOf('0x') === 0 ? serializedTxString : ('0x' + serializedTxString)
        sendBack.serializedTx = serializedTxString
        that.sendSignData(sendBack)
      })
    },
    signSendData () {
      const that = this
      if (that.checkAddress.toLowerCase() === that.sendDataPage.from.toLowerCase()) {
        let rawTx = {
          nonce: that.sendDataPage.nonce,
          gasPrice: Number(that.sendDataPage.gasPrice),//Number类型 
          gasLimit: Number(that.sendDataPage.gasLimit),
          from: that.sendDataPage.from,
          to: that.sendDataPage.to,
          value: Number(that.sendDataPage.value),//Number类型
          data: that.sendDataPage.data
        }
        // console.log(rawTx)
        let Tx = require('ethereumjs-tx')
        let privateKey = new Buffer(that.fixPkey(that.privateKey), 'hex')
        let tx = new Tx(rawTx)
        tx.sign(privateKey)
        let serializedTx = tx.serialize()
        let serializedTxString = serializedTx.toString('hex')
        serializedTxString = serializedTxString.indexOf('0x') === 0 ? serializedTxString : ('0x' + serializedTxString)
        // console.log(serializedTxString)
        that.sendSignData(serializedTxString)
        // console.log(serializedTxString)
      } else {    
        that.$$.layerMsg({
          tip: 'Account error!',
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
        // $('#privateSure').modal('hide')
        $('#sendInfo').modal('hide')
        return
      }
    },
    sendSignData (data) {
      let that = this
      that.$emit('sendSignData', data)
      that.password = ''
      $('#fileUpload').val('')
      that.privateKey = ''
      that.checkAddress = ''
      that.showPwdBtn = false
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
      if (e.which === 13) {
        that.inputFileBtn()
      }
      that.showPwdBtn = true
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
