<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Receive / Send</h1>
      <div class="biticonSelect_box">
        <div class="logo"><img src="../../../../assets/image/Fusion.svg"></div>
        <div class="arrow flex-c"><i class="i"></i></div>
        <select class="select" v-model="selectVal">
          <option v-for="(item, index) in SetcoinAndUrl" :key="index" v-html="item.value" :value="item.value" :data-coinUrl="item.url"></option>
        </select>
      </div>
    </div>

    <div class="transferBtn_box">
      <div class="transferBtn_btn flex-sc">
        <router-link to="/Transfer/tranReceive" class="tranBtn flex-c">Receive<i class="arrow"></i></router-link>
        <router-link to="/Transfer/tranSend" class="tranBtn flex-c">Send<i class="arrow"></i></router-link>
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
      SetcoinAndUrl: this.$store.state.coinAndUrl,
      coinDataPage: {},
      web3: '',
      newWeb3: ''
    }
  },
  watch: {
    selectVal (cur, oold) {
      const that = this
      console.log(cur)
      that.getCoinInfo(cur)
    }
  },
  mounted () {
    let that = this
    that.selectVal = that.$route.query.currency ? that.$route.query.currency : 'FSN'
    that.getCoinInfo(that.selectVal)
  },
  methods: {
    getCoinInfo (coin) {
      const that = this
      for (let i = 0; i < that.SetcoinAndUrl.length; i++) {
        if (that.SetcoinAndUrl[i].value === 'FSN') {
          that.coinDataPage = {
            value: coin,
            url: that.SetcoinAndUrl[i].url,
            address: that.$store.state.addressInfo,
            limit: that.SetcoinAndUrl[i].limit,
            number: that.SetcoinAndUrl[i].number
          }
        } else {
          if (coin === that.SetcoinAndUrl[i].value) {
            that.setWeb3(that.SetcoinAndUrl[i].url)
            that.newWeb3.lilo.dcrmGetAddr(that.$store.state.addressInfo, coin).then(function (val) {
              that.coinDataPage = {
                value: coin,
                url: that.SetcoinAndUrl[i].url,
                address: val,
                limit: that.SetcoinAndUrl[i].limit,
                number: that.SetcoinAndUrl[i].number
              }
              // console.log(that.coinDataPage)
              that.$store.commit('storeDcrmAddress', val)
            })
          }
        }
      }
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
