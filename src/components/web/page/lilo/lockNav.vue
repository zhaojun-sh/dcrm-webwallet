<template>
  <div style="background:#fff">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Lockin / Lockout</h1>
      <div class="biticonSelect_box">
        <div class="logo"><img src="../../../../assets/image/Fusion.svg"></div>
        <div class="arrow flex-c"><i class="i"></i></div>
        <select class="select" v-model="selectVal" id="selectValData">
          <option v-for="(item, index) in SetcoinAndUrl" :key="index" v-html="item.coin" :value="item.coin"></option>
        </select>
      </div>
    </div>

    <div class="transferBtn_box">
      <div class="transferBtn_btn flex-sc">
        <router-link to="/LILO/lockIn" class="tranBtn flex-c">Deposit<i class="arrow"></i></router-link>
        <router-link to="/LILO/lockOut" class="tranBtn flex-c">Withdraw<i class="arrow"></i></router-link>
      </div>
    </div>

    <div class="transferCont_absolute">
      <div class="transferCont_box">
        <transition name="fade">
          <router-view :selectData="coinDataPage"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Lilo from '../../../../assets/js/lilo'
export default {
  name: 'Transfer',
  data () {
    return {
      // selectData: '',
      selectVal: '',
      SetcoinAndUrl: [],
      walletAddress: '',
      coinDataPage: '',
      web3: '',
      newWeb3: ''
    }
  },
  watch: {
    selectVal (cur, oold) {
      const that = this
      // console.log(cur)
      that.getCoinInfo(cur)
    }
  },
  mounted () {
    const that = this
    that.selectVal = that.$route.query.currency ? that.$route.query.currency : 'ETH'
    that.walletAddress = that.$store.state.addressInfo
    for (let i = 0; i < that.$store.state.coinInfo.length; i++) {
      if (that.$store.state.coinInfo[i].coin !== 'FSN') {
        that.SetcoinAndUrl.push(that.$store.state.coinInfo[i])
      }
    }
    that.getCoinInfo(that.selectVal)
  },
  methods: {
    getCoinInfo (coin) {
      const that = this
      // console.log(that.SetcoinAndUrl)
      for (let i = 0; i < that.SetcoinAndUrl.length; i++) {
        if (coin === that.SetcoinAndUrl[i].coin) {
          // console.log(coin)
          that.setWeb3()
            // console.log(123)
          that.newWeb3.lilo.dcrmGetAddr(that.walletAddress, coin).then(function (val) {
            // console.log(val)
            that.coinDataPage = {
              coin: coin,
              address: val,
              limit: that.SetcoinAndUrl[i].limit,
              number: that.SetcoinAndUrl[i].number,
              token: that.SetcoinAndUrl[i].token
            }
            // console.log(that.coinDataPage)
            that.$store.commit('storeDcrmAddress', val)
          })
        }
      }
      // }
    },
    setWeb3 () {
      const that = this
      that.$$.setWeb3(that)
      // let Web3 = require('web3')
      
      // if (typeof web3 !== 'undefined') {
      //   Web3 = new Web3(Web3.currentProvider)
      // } else {
      //   Web3 = new Web3(new Web3.providers.HttpProvider(url))
      // }
      // that.web3 = Web3
      that.newWeb3 = new Lilo(that.$$.baseUrl)
    }
  }
}
</script>
