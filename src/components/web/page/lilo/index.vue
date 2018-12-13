<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Lockin / Lockout</h1>
      <div class="biticonSelect_box">
        <div class="logo"><img src="../../../../assets/image/Fusion.svg"></div>
        <div class="arrow flex-c"><i class="i"></i></div>
        <select class="select" v-model="selectVal" @change="selectCoin">
          <option v-for="(item, index) in selectOption" :key="index" :value="item.value" v-html="item.name"></option>
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
          <router-view :selectData="selectDataPage"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// import Web3 from '../../../../assets/js/lilo'
export default {
  name: 'Transfer',
  data () {
    return {
      // selectData: '',
      selectVal: '',
      selectOption: [],
      selectDataPage: {}
    }
  },
  mounted () {
    const that = this
    that.selectVal = 'http://47.92.255.230:8111'
    that.selectOption = [
      {value: '',name: 'FSN'},
      {value: '',name: 'BTC'},
      {value: 'http://47.92.255.230:8111',name: 'ETH'},
      {value: '',name: 'BNB'},
    ]
    for (let i = 0; i < that.selectOption.length; i++) {
      if (that.selectOption[i].value === that.selectVal) {
        that.selectDataPage = that.selectOption[i]
      }
    }
    // that.setWeb3()
  },
  methods: {
    selectCoin () {
      const that = this
      for (let i = 0; i < that.selectOption.length; i++) {
        if (that.selectOption[i].value === that.selectVal) {
          that.selectDataPage = that.selectOption[i]
        }
      }
    }
  }
}
</script>
