<template>
    <div class="boxContent">
        <header class="headerTop_box flex-bc">
            <div class="logo"><router-link to="/"><img src="../../../assets/image/logo.svg"></router-link></div>
            <div class="headerTop_serBox" id="topSearchView">
                <img src="../../../assets/image/wifi.png" class="wifi">
                <i class="arrow"></i>
                <select class="select">
                    <option>Bank of China</option>
                </select>
            </div>
            <div class="headerTop_setBox" id="topSetView">
                <ul class="flex-ec">
                    <li id="copyAddress" @click="copyAddress('addressCopy','copyAddress')" class="cursorP"><a class="setBtn flex-c" data-toggle="tooltip" data-placement="bottom" title="Copy clipboard"><div class="addreess">{{walletAdressTop}}</div><img src="../../../assets/image/copy2.svg"></a></li>
                    <li><router-link class="setBtn flex-c" to="/backupWallet"><img src="../../../assets/image/Setting2.svg"></router-link></li>
                    <li><router-link class="setBtn flex-c" to="/"><img src="../../../assets/image/Help.svg"></router-link></li>
                    <li><div class="setBtn flex-c cursorP" @click="refreshPage"><img src="../../../assets/image/Refresh.svg"></div></li>
                    <li><router-link class="setBtn flex-c" to="/"><img src="../../../assets/image/Quit.svg"></router-link></li>
                </ul>
            </div>
        </header>
        <input type="text" v-model="walletAdress" id="addressCopy" class="inputOpacity" style="opacity: 0;">
        <section id="boxContent_box">
            <router-view v-on:setAddress='getChildInfo'></router-view>
        </section>
        <footer class="footerBottom_box flex-c">
            <ul class="flex-c">
                <li><img src="../../../assets/image/logo-white.svg" width="61" height="16"></li>
                <li class="center flex-c">
                    <a class="mr-10 flex-c"><img src="../../../assets/image/GIT.svg" width="16" height="16"></a>
                    <a class="flex-c"><img src="../../../assets/image/GIT2.svg" width="16" height="16"></a>
                </li>
                <li>{{copyRight}}</li>
            </ul>
        </footer>
    </div>
</template>

<style>

</style>

<script>
// import Web3 from '../../../assets/js/lilo'
export default {
  name: 'index',
  data () {
    return {
      copyRight: '2018 FUSION Foundation. All rights reserved.',
      walletAdress: '',
      walletAdressTop: '',
    }
  },
  mounted () {
    let that = this
    // that.topSetViewFlag = topSetViewFlag
    that.$$.showSearchTop()
    if (!that.$store.state.addressInfo) {
      that.$router.push('/')
    }
    $(function () {
      $("[data-toggle='tooltip']").tooltip()
    })
    // let setweb3 = new Web3(that.$$.baseUrl)
    // let setweb3 = new Web3('http://47.92.255.230:8111')
    // setweb3.setProvider(that.$$.baseUrl)
    // console.log(setweb3)
    // console.log(that.$$.thousandBit(setweb3.lilo.dcrmGetBalance('0xD562BB03A071f8928F885946Be4bd37b5beAeD6E', 'szabo')))
    // console.log(setweb3.lilo.dcrmReqAddr('0xD562BB03A071f8928F885946Be4bd37b5beAeD6E', 'ETH'))
    // setweb3.lilo.dcrmReqAddr('0xD562BB03A071f8928F885946Be4bd37b5beAeD6E', 'ETH', '0xe63d00f899b00b98b9f56d260d677af0b7ae5564feab9444afc808c914b19e3d').then(function(val){
    //   console.log(val)
    // })
    // setweb3.lilo.dcrmGetAddr('0xD562BB03A071f8928F885946Be4bd37b5beAeD6E', 'ETH').then(function(val){
    //   console.log(val)
    // })
    // console.log(setweb3.lilo.dcrmGetAddr('0xD562BB03A071f8928F885946Be4bd37b5beAeD6E', 'ETH').then())
  },
  methods: {
    goBackupWallet () {
      let that = this
      that.$router.push('/backupWallet')
    },
    copyAddress (id, textId) {
      let copyText = $('#' + textId).find('.tooltip-inner').text()
      document.getElementById(id).select()
      document.execCommand('Copy')
      $('#' + textId).find('.tooltip-inner').text('Copied')
      setTimeout(function () {
        $('#' + textId).find('.tooltip-inner').text(copyText)
      }, 3000)
      this.$$.layerMsg('Copy Success')
    },
    refreshPage () {
      history.go(0)
    //   top.location.hert = top.location.hert
    },
    cutOut (str) {
      var str1 = str.substr(0, 6)
      var str2 = str.substr(str.length - 5)
      return str = str1 + '…' + str2
    },
    getChildInfo (address) {
      let that = this
      that.walletAdress = address
      that.walletAdressTop = that.cutOut(address)
    }
  }
}

</script>
