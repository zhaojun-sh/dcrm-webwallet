<template>
  <div>
    <div class="walletBtn_box">
      <ul>
        <li><router-link to="/createWallet" class="btnStyle btnBlue flex-c"><div class="icon"><img src="../../../../assets/image/pageWhite.svg"></div>Create wallet</router-link></li>
        <li><router-link to="/importWallet" class="btnStyle btnWhite flex-c"><div class="icon"><img src="../../../../assets/image/pageBlue.svg"></div>Import wallet</router-link></li>
      </ul>
    </div>
    <div class="supCoinView_box">
      <hgroup class="supCoinView_title">
        <h3 class="title">Coins Supported</h3>
      </hgroup>
      <div class="supCoinView_list">
        <ul>
          <li v-for="item in iconData" :key="item.index">
            <div class="iconImg"><img :src="item.icon"></div>
            <h4 class="title" v-html="item.title"></h4>
            <div class="line"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: '',
  data () {
    return {
      iconData: []
    }
  },
  mounted () {
    let that = this
    that.iconData = [
      {icon: require('../../../../assets/image/btc.svg'), title: 'Bitcoin'},
      {icon: require('../../../../assets/image/eth.svg'), title: 'Ethereum'},
      {icon: require('../../../../assets/image/fsn.svg'), title: 'FUSION'},
      {icon: require('../../../../assets/image/bnb.svg'), title: 'Binance'},
      {icon: require('../../../../assets/image/mkr.svg'), title: 'Maker(MKR)'},
      {icon: require('../../../../assets/image/gusd.svg'), title: 'Gemini dollar GUSD'},
      {icon: require('../../../../assets/image/ht.svg'), title: 'HuobiToken (HT)'},
      {icon: require('../../../../assets/image/bnt.svg'), title: 'Bancor (BNT)'}
    ]
  }
}
</script>
