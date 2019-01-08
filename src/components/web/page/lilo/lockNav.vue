<template>
  <div style="background:#fff">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Lockin / Lockout</h1>
      <div class="biticonSelect_box">
        <div class="logo"><img src="@/assets/image/Fusion.svg"></div>
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
import Lilo from '@/assets/js/lilo'
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
      this.getCoinInfo(cur)
    }
  },
  mounted () {
    this.selectVal = this.$route.query.currency ? this.$route.query.currency : 'ETH'
    this.walletAddress = this.$store.state.addressInfo
    for (let i = 0; i < this.$store.state.coinInfo.length; i++) {
      if (this.$store.state.coinInfo[i].coin !== 'FSN') {
        this.SetcoinAndUrl.push(this.$store.state.coinInfo[i])
      }
    }
    this.getCoinInfo(this.selectVal)
  },
  methods: {
    getCoinInfo (coin) {
      for (let i = 0; i < this.SetcoinAndUrl.length; i++) {
        if (coin === this.SetcoinAndUrl[i].coin) {
          this.setWeb3()
          this.newWeb3.lilo.dcrmGetAddr(this.walletAddress, coin).then((val) => {
            this.coinDataPage = {
              coin: coin,
              address: val,
              limit: this.SetcoinAndUrl[i].limit,
              number: this.SetcoinAndUrl[i].number,
              token: this.SetcoinAndUrl[i].token
            }
            this.$store.commit('storeDcrmAddress', val)
          })
        }
      }
      // }
    },
    setWeb3 () {
      this.$$.setWeb3(this)
      this.newWeb3 = new Lilo(this.$$.baseUrl)
    }
  }
}
</script>
