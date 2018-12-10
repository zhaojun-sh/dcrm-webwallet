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
    if (!that.$store.state.storePrivateKey) {
      that.$router.push('/')
    }
    $(function () {
      $("[data-toggle='tooltip']").tooltip()
    })
    // $('#copyAddress').click(function () {
    //     console.log($('#addressCopy').val())
    //     console.log(that.walletAdress)
    //     $('#addressCopy').select()
    //     document.execCommand('Copy')
    // })
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
