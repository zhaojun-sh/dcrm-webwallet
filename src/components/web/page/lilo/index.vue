<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
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
  mounted () {
  },
  methods: {
  }
}
</script>
