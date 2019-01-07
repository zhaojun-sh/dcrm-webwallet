<template>
  <div style="background:#fff">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Receive / Send</h1>
      <div class="biticonSelect_box">
        <div class="logo">
          <img src="@/assets/image/Fusion.svg">
        </div>
        <div class="arrow flex-c">
          <i class="i"></i>
        </div>
        <select class="select" v-model="selectVal">
          <option
            v-for="(item, index) in SetcoinAndUrl"
            :key="index"
            v-html="item.coin"
            :value="item.coin"
          ></option>
        </select>
      </div>
    </div>

    <div class="transferBtn_box">
      <div class="transferBtn_btn flex-sc">
        <router-link to="/Transfer/tranReceive" class="tranBtn flex-c">
          Receive
          <i class="arrow"></i>
        </router-link>
        <router-link to="/Transfer/tranSend" class="tranBtn flex-c">
          Send
          <i class="arrow"></i>
        </router-link>
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
import Lilo from "@/assets/js/lilo";
export default {
  name: "Transfer",
  data() {
    return {
      // selectData: '',
      selectVal: "",
      SetcoinAndUrl: this.$store.state.coinInfo,
      coinDataPage: {},
      web3: "",
      newWeb3: ""
    };
  },
  watch: {
    selectVal(cur, oold) {
      // console.log(cur)
      this.getCoinInfo(cur);
    }
  },
  mounted() {
    this.selectVal = this.$route.query.currency
      ? this.$route.query.currency
      : "FSN";
    this.getCoinInfo(this.selectVal);
  },
  methods: {
    getCoinInfo(coin) {
      for (let i = 0; i < this.SetcoinAndUrl.length; i++) {
        if (this.SetcoinAndUrl[i].coin === "FSN") {
          this.coinDataPage = {
            coin: coin,
            address: this.$store.state.addressInfo,
            limit: this.SetcoinAndUrl[i].limit,
            number: this.SetcoinAndUrl[i].number
          };
        } else {
          if (coin === this.SetcoinAndUrl[i].coin) {
            this.setWeb3();
            this.newWeb3.lilo
              .dcrmGetAddr(this.$store.state.addressInfo, coin)
              .then(val => {
                this.coinDataPage = {
                  coin: coin,
                  address: val,
                  limit: this.SetcoinAndUrl[i].limit,
                  number: this.SetcoinAndUrl[i].number
                };
                // console.log(this.coinDataPage)
                this.$store.commit("storeDcrmAddress", val);
              });
          }
        }
      }
    },
    setWeb3() {
      this.$$.setWeb3(this);
      this.newWeb3 = new Lilo(this.$$.baseUrl);
    }
  }
};
</script>
