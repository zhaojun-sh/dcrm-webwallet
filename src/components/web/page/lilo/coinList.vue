<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{LANG.TITLE.LOCKIN}} / {{LANG.TITLE.LOCKOUT}}</h1>
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input
          type="text"
          placeholder="ETH"
          class="input-text"
          @keyup="searchInput"
          v-model="searchContent"
        />
        <div class="searchIcon">
          <div class="icon flex-c">
            <img src="@etc/img/search.png">
          </div>
        </div>
      </div>
    </div>

    <div class="contView_box">
      <div class="supCoinView_list lockView_list">

        <el-row :gutter="10">
          <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6"  v-for="(item, index) in bitIconTypeSearch" :key="index" class="item">
            <div class="iconImg"><img :src="item.logo"></div>
            <h4 class="title" v-html="item.nameFull"></h4>
            <div class="dappView_btn" v-if="item.nameFull !== 'MORE'">
              <a class="setBtn" v-if="item.btnView === 2" @click="toUrlLock('/LILO/lockIn', item.currency)">{{LANG.BTN.DEPOSIT}}</a>
              <a class="setBtn" v-if="item.btnView === 2" @click="toUrlLock('/LILO/lockOut', item.currency)" :style="item.currency === 'ETH' ? '' : 'opacity:0.5'">{{LANG.BTN.WITHDRAW}}</a>
              <a class="setBtn" v-if="item.btnView === 0 && !$store.state.safeMode" @click="privateSure(item.currency, item.btnView)">{{LANG.BTN.REQUEST}}</a>
              <a class="setBtn" v-if="item.btnView === 1 && !$store.state.safeMode" @click="privateSure(item.currency, item.btnView)" style="opacity:0.5">{{LANG.BTN.PENDING}}</a>
              <a class="setBtn" v-if="item.btnView === 0 && $store.state.safeMode" style="opacity:0.5">{{LANG.BTN.REQUEST}}</a>
            </div>
            <div class="dappView_btn" v-if="item.nameFull === 'MORE'"></div>
            <div class="line"></div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog
      :title="LANG.BTN.UNLOCK"
      :visible.sync="privateSureVisible"
      width="75%"
      :before-close="modalClick"
      >
      <router-view @sendSignData="getSignData" :sendDataPage="dataPage" @elDialogView="getElDialogView"></router-view>
    </el-dialog>
    

    <el-dialog
      :title="LANG.TITLE.REQUEST_CONFIRM"
      :visible.sync="confirmDcrmVisible"
      width="60%"
      :before-close="modalClick"
      >
      <div class="">
        {{LANG.WARNING_TIP.TIP_1}}
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        <button type="button" class="btn btn-default" @click="modalClick">{{LANG.BTN.GET_OUT}}</button>
        <button type="button" class="btn btn-primary" @click="sendRawTransion(confirmData)">{{LANG.BTN.YES_SURE}}</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "myAssets",
  data () {
    return {
      bitIconTypeData: [],
      bitIconTypeSearch: [],
      walletAddress: "",
      balanceCoin: {
        FSN: "",
        ETH: ""
      },
      dataPage: {},
      selectOption: [],
      searchContent: "",
      confirmData: "",
      privateSureVisible: false,
      confirmDcrmVisible: false
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.addressInfo
    this.getInitData()
    if (this.$store.state.walletLoadFlag && !this.$store.state.safeMode) {
      this.getBalanceData()
    }
  },
  methods: {
    toUrlLock (url, coin) {
      if (coin === "ETH" || url === "/LILO/lockIn") {
        this.$router.push({ path: url, query: { currency: coin }})
      } else {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_1)
      }
    },
    getElDialogView () {
      this.modalClick()
    },
    modalClick () {
      this.$router.push("/LILO")
      this.privateSureVisible = false
      this.confirmDcrmVisible = false
    },
    searchInput () {
      this.bitIconTypeSearch = []
      let searchTxt = this.searchContent
      if (searchTxt === "") {
        this.bitIconTypeSearch = this.bitIconTypeData
      } else {
        if (!isNaN(this.searchContent)) {
          searchTxt = this.$$.thousandBit(this.searchContent, "no")
        }
        for (let i = 0; i < this.bitIconTypeData.length; i++) {
          let searchArr = this.bitIconTypeData[i]
          let searchObj = {
            nameSimplicity: searchArr.nameSimplicity,
            nameFull: searchArr.nameFull,
            availbleBalance: searchArr.availbleBalance,
            freeze: searchArr.freeze,
            totalBalance: searchArr.totalBalance,
            totalBalanceDoller: searchArr.totalBalanceDoller
          }
          if (searchObj.nameSimplicity.indexOf(searchTxt) !== -1 || searchObj.nameFull.indexOf(searchTxt) !== -1 || searchObj.availbleBalance.indexOf(searchTxt) !== -1 || searchObj.freeze.indexOf(searchTxt) !== -1 || searchObj.totalBalance.indexOf(searchTxt) !== -1 || searchObj.totalBalanceDoller.indexOf(searchTxt) !== -1) {
            this.bitIconTypeSearch.push(searchArr)
          }
        }
      }
    },
    getInitData () {
      let coinInfo = this.$store.state.coinInfo
      let bitCoinInfo = []
      for (let i = 0;i < coinInfo.length; i++) {
        if (coinInfo[i].coin === "FSN") {
          continue
        }
        bitCoinInfo.push({
          logo: coinInfo[i].logo,
          nameSimplicity: coinInfo[i].coin,
          nameFull: coinInfo[i].coinAll,
          availbleBalance: this.$$.thousandBit(coinInfo[i].balance),
          freeze: this.$$.thousandBit(coinInfo[i].freeze),
          totalBalance: this.$$.thousandBit(coinInfo[i].balance),
          totalBalanceDoller: this.$$.thousandBit(coinInfo[i].balanceDollar),
          currency: coinInfo[i].coin,
          receive: "",
          send: "",
          btnView: coinInfo[i].flag
        })
      }
      bitCoinInfo.push({
        logo: require("@etc/img/MORE.svg"),
        nameSimplicity: "MORE",
        nameFull: "MORE",
        availbleBalance: this.$$.thousandBit(this.balanceCoin.ETH),
        freeze: this.$$.thousandBit(0),
        totalBalance: this.$$.thousandBit(this.balanceCoin.ETH),
        totalBalanceDoller: "$" + this.$$.thousandBit(this.balanceCoin.ETH),
        currency: "MORE",
        receive: "",
        send: "",
        btnView: 3,
        viewOpacity: false
      })
      this.bitIconTypeSearch = this.bitIconTypeData = bitCoinInfo
    },
    privateSure (data, flag) {
      if (flag === 1) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_9)
        return
      }
      this.dataPage = {
        coin: data,
        sendType: "MYWALLET",
        from: this.walletAddress,
        nonce: "",
      }
      try {
        this.dataPage.nonce = v_web3.eth.getTransactionCount(this.walletAddress, "pending")
      } catch (error) {
        this.$$.errTip(error)
        return
      }
      this.$router.push("/pwdCoinList")
      this.privateSureVisible = true
    },
    getSignData (data) {
      if (data) {
        if (data.nowFlag) {
          this.sendRawTransion(data)
        } else {
          this.confirmData = data
          this.confirmDcrmVisible = true
        }
      } else {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_6)
      }
      this.privateSureVisible = false
    },
    sendRawTransion (data) {
      v_web3.eth.sendRawTransaction(data.serializedTx, (err, hash) => {
        if (err) {
          console.log(err)
          this.$$.errTip(err)
        } else {
          for (let i = 0; i < this.bitIconTypeData.length; i++) {
            if (data.coin === this.bitIconTypeData[i].currency) {
              this.bitIconTypeData[i].btnView = 1
            }
          }
          let storeData = {
            balance: 0,
            balanceDollar: 0,
            flag: 1,
            coin: data.coin
          }
          this.$store.commit("storeCoinInfo", storeData)
          this.modalClick()
          this.$$.successTip(this.LANG.ERROR_TIP.TIP_10.FIRST + hash + this.LANG.ERROR_TIP.TIP_10.LAST)
        }
        // this.confirmDcrmVisible = false
      })
    },
    getBalanceData () {
      
      let balance_count = 0
      let balance_setInterval = setInterval(() => {
        if (balance_count >= this.bitIconTypeData.length) {
          clearInterval(balance_setInterval)
          this.$store.commit("storeWalletLoadFlag", false)
          balance_count = 0
          return
        }
        // console.log(balance_count)
        if (this.bitIconTypeData[balance_count].currency === "FSN" || this.bitIconTypeData[balance_count].currency === "MORE") {
          // continue
        } else {
          try {
            this.setBalance(this.bitIconTypeData[balance_count].currency, v_web3.lilo.dcrmGetBalance(this.walletAddress, this.bitIconTypeData[balance_count].currency), 2)
            this.bitIconTypeData[balance_count].btnView = 2
          } catch (error) {
            this.setBalance(this.bitIconTypeData[balance_count].currency, "", 0)
            this.bitIconTypeData[balance_count].btnView = 0
          }
        }
        balance_count ++
      }, 80)
      // for (let i = 0; i < this.bitIconTypeData.length; i++) {
      //   if (this.bitIconTypeData[i].currency === "FSN" || this.bitIconTypeData[i].currency === "MORE") {
      //     continue
      //   }
      //   try {
      //     this.setBalance(this.bitIconTypeData[i].currency, v_web3.lilo.dcrmGetBalance(this.walletAddress, this.bitIconTypeData[i].currency), 2)
      //     this.bitIconTypeData[i].btnView = 2
      //   } catch (error) {
      //     this.setBalance(this.bitIconTypeData[i].currency, "", 0)
      //     this.bitIconTypeData[i].btnView = 0
      //   }
      // }
      // this.$store.commit("storeWalletLoadFlag", false)
    },
    setBalance (coin, balance, flag) {
      let balanceChange, balanceUSD
      let storeData = {
        balance: "",
        balanceDollar: "",
        flag: "",
        coin: coin
      }
      if (coin === "BTC") {
        balanceChange = this.$$.fromWei(balance, "btc")
      } else {
        balanceChange = v_web3.fromWei(balance, "ether").toString()
      }
      // if (Number(balanceChange) === 0 || !balanceChange) {
      if (isNaN(balanceChange)) {
        return 0
      } else {
        let coinData = this.$store.state.coinInfo
        for (let i = 0; i < coinData.length; i++) {
          if (coin === coinData[i].coin) {
            this.getDoller(coinData[i].dollarURL, balanceChange, coin, flag)
            break
          }
        }
      }
    },
    getDoller (url, balance, coin, flag) {
      $ajax.get(url).then(res => {
        res = res.data
        let callbackData = 0
        if (res.length > 0) {
          callbackData = res[0].price_usd
        } else {
          callbackData = 0
        }
        let balanceUSD = callbackData * balance
        let balanceGwei = balance
        let storeData = {
          balance: balanceGwei,
          balanceDollar: balanceUSD,
          flag: flag,
          coin: coin
        }
        this.$store.commit("storeCoinInfo", storeData)
      }).catch(err => {
        callbackData = 0
      })
    }
  }
}
</script>
