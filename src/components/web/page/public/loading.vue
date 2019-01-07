<template>
  <div></div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {};
  },
  beforeCreate() {
    // this.$$.loadingStart()
  },
  mounted() {
    this.$store.commit("storeWalletLoadFlag", true);
    this.goBack();
  },
  methods: {
    goBack() {
      history.go(-1);
    }
  }
  // destroyed () {
  //   setTimeout( () => {
  //     this.$$.loadingEnd()
  //   }, 600)
  // }
};
</script>

