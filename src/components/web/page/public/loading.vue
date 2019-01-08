<template>
  <div></div>
</template>

<script>
export default {
  name: "loading",
  data () {
    return {}
  },
  mounted () {
    this.$store.commit("storeWalletLoadFlag", true)
    this.goBack()
  },
  methods: {
    goBack () {
      history.go(-1)
    }
  }
}
</script>

