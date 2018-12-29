<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">DAPP</h1>
    </div>

    <div class="contView_box">
      <div class="dappView_list">
        <ul>
          <li v-for="item in iconData" :key="item.index" @click="toUrl()">
            <div class="iconImg"><img :src="item.icon"></div>
            <h4 class="title" v-html="item.title"></h4>
            <div class="line"></div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Transfer',
  data () {
    return {
      // selectData: '',
      iconData: []
    }
  },
  mounted () {
    let that = this
    that.iconData = [
      {icon: require('../../../../assets/image/dex.svg'), title: 'DEX'},
      {icon: require('../../../../assets/image/mining.svg'), title: 'Mining'},
      {icon: require('../../../../assets/image/TimeToken.svg'), title: 'Time Token'},
      {icon: require('../../../../assets/image/kyc.svg'), title: 'KYC/AML'},
      {icon: require('../../../../assets/image/pay.svg'), title: 'Payment'},
      {icon: require('../../../../assets/image/bond.svg'), title: 'Bond'},
      {icon: require('../../../../assets/image/abs.svg'), title: 'ABS'},
      {icon: require('../../../../assets/image/loan.svg'), title: 'Loan'},
      {icon: require('../../../../assets/image/dark.svg'), title: 'Dark Pool'},
      {icon: require('../../../../assets/image/etf.svg'), title: 'ETF'},
      {icon: require('../../../../assets/image/lssue.svg'), title: 'Issue Asset'},
      {icon: require('../../../../assets/image/stable.svg'), title: 'Stable Coin'},
      {icon: require('../../../../assets/image/custudy.svg'), title: 'Custody'},
      {icon: require('../../../../assets/image/lns.svg'), title: 'Insurance'},
      {icon: require('../../../../assets/image/MORE.svg'), title: 'More'}
    ]
  },
  methods: {
    toUrl (url) {
      const that = this
      if (url === '/') {
        that.$router.push({ path: url, query: { currency: '' }})
      } else {
        that.$$.layerMsg({
          tip: 'Functional development!',
          time: 3000,
          bgColor: '#f15a4a',
          icon: require('../../../../assets/image/Prompt.svg')
        })
      }
    },
  }
}
</script>
