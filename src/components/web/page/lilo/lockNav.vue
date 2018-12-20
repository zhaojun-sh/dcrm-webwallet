<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Lockin / Lockout</h1>
      <div class="biticonSelect_box">
        <div class="logo"><img src="../../../../assets/image/Fusion.svg"></div>
        <div class="arrow flex-c"><i class="i"></i></div>
        <select class="select" v-model="selectVal" id="selectValData">
          <option v-for="(item, index) in SetcoinAndUrl" :key="index" v-html="item.value" :value="item.value" :data-coinUrl="item.url"></option>
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
      coinDataPage: '',
      web3: '',
      newWeb3: ''
    }
  },
  watch: {
    selectVal (cur, oold) {
      const that = this
      that.getCoinInfo(cur)
    }
  },
  mounted () {
    const that = this
    that.selectVal = that.$route.query.currency ? that.$route.query.currency : 'ETH'
    for (let i = 0; i < that.$store.state.coinAndUrl.length; i++) {
        if (that.$store.state.coinAndUrl[i].value !== 'FSN') {
          that.SetcoinAndUrl.push(that.$store.state.coinAndUrl[i])
        }
    }
    that.getCoinInfo(that.selectVal)
  },
  methods: {
    getCoinInfo (coin) {
      const that = this
      // console.log(that.SetcoinAndUrl)
      for (let i = 0; i < that.SetcoinAndUrl.length; i++) {
        if (coin === that.SetcoinAndUrl[i].value) {
          // console.log(coin)
          that.setWeb3(that.SetcoinAndUrl[i].url)
            // console.log(123)
          that.newWeb3.lilo.dcrmGetAddr(that.$store.state.addressInfo, coin).then(function (val) {
            console.log(val)
            that.coinDataPage = {
              value: coin,
              url: that.SetcoinAndUrl[i].url,
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
    setWeb3 (url) {
      const that = this
      let Web3 = require('web3')
      
      if (typeof web3 !== 'undefined') {
        Web3 = new Web3(Web3.currentProvider)
      } else {
        Web3 = new Web3(new Web3.providers.HttpProvider(url))
      }
      that.web3 = Web3
      that.newWeb3 = new Lilo(url)
    }
  }
}
</script>
