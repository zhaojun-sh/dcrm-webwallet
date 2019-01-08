<template>
  <div class="supCoinView_container">
    <div class="walletBtn_box">
      <ul>
        <li>
          <router-link to="/createWallet" class="btnStyle btnBlue flex-c">
          <div class="icon">
            <img src="@/assets/image/pageWhite.svg">
            </div>Create wallet
          </router-link>
        </li>
        <li>
          <router-link to="/importWallet" class="btnStyle btnWhite flex-c">
          <div class="icon">
            <img src="@/assets/image/Importwallet-blue.svg">
            </div>Import wallet
          </router-link>
        </li>
      </ul>
    </div>
    <div class="supCoinView_box">
      <hgroup class="supCoinView_title">
        <h3 class="title">Coins Supported</h3>
      </hgroup>
      <div class="supCoinView_list">
        <ul>
          <li v-for="item in iconData" :key="item.index" class="col col-md-3">
            <div class="iconImg">
              <img :src="item.icon">
            </div>
            <h4 class="title" v-html="item.title"></h4>
            <div class="line"></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: "",
  data () {
    return {
      iconData: [
        {
          icon: require("@/assets/image/btc.svg"),
          title: "Bitcoin (BTC)"
        },
        {
          icon: require("@/assets/image/eth.svg"),
          title: "Ethereum (ETH)"
        },
        {
          icon: require("@/assets/image/fsn.svg"),
          title: "FUSION (FSN)"
        },
        {
          icon: require("@/assets/image/bnb.svg"),
          title: "Binance (BNB)"
        },
        {
          icon: require("@/assets/image/mkr.svg"),
          title: "Maker (MKR)"
        },
        {
          icon: require("@/assets/image/gusd.svg"),
          title: "Gemini Dollar (GUSD)"
        },
        {
          icon: require("@/assets/image/ht.svg"),
          title: "HuobiToken (HT)"
        },
        {
          icon: require("@/assets/image/bnt.svg"),
          title: "Bancor (BNT)"
        }
      ]
    }
  },
  mounted () {
    let toPath = location.href.toUpperCase()
    if (toPath.lastIndexOf("/") === (toPath.length - 1)) {
      this.$store.commit("storeAddress", "")
    }
    this.$$.loadingEndIndex()
  }
}
</script>
