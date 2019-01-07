<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <!-- <div class="transferCont_absolute">
      <div class="transferCont_box">
        <transition name="fade">
          <router-view :selectData="coinDataPage"></router-view>
        </transition>
      </div>
    </div>-->
  </div>
</template>

<script>
// import Lilo from '@/assets/js/lilo'
export default {
  name: "Transfer",
  data() {
    return {
      // selectData: '',
      selectVal: "",
      SetcoinAndUrl: [],
      coinDataPage: "",
      web3: "",
      newWeb3: ""
    };
  }
};
</script>
