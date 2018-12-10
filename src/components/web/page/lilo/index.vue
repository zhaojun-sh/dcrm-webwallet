<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Lockin / Lockout</h1>
      <div class="biticonSelect_box">
        <div class="logo"><img src="../../../../assets/image/Fusion.svg"></div>
        <div class="arrow flex-c"><i class="i"></i></div>
        <select class="select" v-model="selectVal">
          <option>FSN</option>
          <option>BTC</option>
          <option>ETH</option>
          <option>BNB</option>
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
          <router-view :selectData="selectVal"></router-view>
        </transition>
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
      selectVal: ''
    }
  },
  mounted () {
    let that = this
    that.selectVal = 'FSN'
  },
  methods: {
  }
}
</script>
