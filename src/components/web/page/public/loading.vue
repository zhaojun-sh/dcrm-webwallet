<template>
  <div>

  </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {

    }
  },
  beforeCreate () {
    const that = this
    // that.$$.loadingStart()
  },
  mounted () {
    let that = this
    that.$store.commit('storeWalletLoadFlag', true)
    that.goBack()
  },
  methods: {
    goBack () {
      history.go(-1)
    }
  }
  // destroyed () {
  //   let that = this
  //   setTimeout(function () {
  //     that.$$.loadingEnd()
  //   }, 600)
  // }
}
</script>

