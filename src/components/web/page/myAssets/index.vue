<template>
  <div style="background:#fff;min-height:100%"
        v-loading="fullscreenLoading"
        element-loading-text="Loading……">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">{{LANG.NAV.MY_WALLET}}</h1>
      <h2 class="contentHeader_title">$ {{myAssetsTotal}}</h2>
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input type="text" placeholder="FSN" class="input-text" @keyup="searchInput" v-model="searchContent"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="@etc/img/search.png"></div></div>
      </div>
    </div>

    <div class="myAssetsTable_box">
      <el-table
        :data="bitIconTypeSearch"
        style="width: 100%"
        :height="tableH"
        empty-text="Null"
      >
        <el-table-column :label="LANG.THEAD.COIN" width="190">
          <template slot-scope="scope">
            <div class="flex-sc">
              <div class="logo"><img :src="scope.row.logo"></div>
              <div class="title">
                <h2 class="span" v-html="scope.row.nameSimplicity"></h2>
                <h3 class="p" v-html="scope.row.nameFull"></h3>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="LANG.THEAD.ASSETS.AVAILABLE_BALANCE" prop="availbleBalance" width="200"></el-table-column>
        <el-table-column :label="LANG.THEAD.ASSETS.FREEZE" prop="freeze" width="120"></el-table-column>
        <el-table-column :label="LANG.THEAD.ASSETS.TOTAL_BALANCE" min-width="180">
          <template slot-scope="scope">
            <span class="span" v-html="scope.row.totalBalance"></span>
            <p class="p">$ {{scope.row.totalBalanceDoller}}</p>
          </template>
        </el-table-column>
        <el-table-column :label="LANG.THEAD.ACTIONS" width="200">
          <template slot-scope="scope">
            <div style="text-align:left">
              <router-link :to="{path:'/Transfer/tranReceive', query: {currency: scope.row.currency}}" class="setBtn" v-if="scope.row.btnView === 2">{{LANG.BTN.RECEIVE}}</router-link>
              <router-link :to="{path:'/Transfer/tranSend', query: {currency: scope.row.currency}}" class="setBtn" v-if="scope.row.btnView === 2">{{LANG.BTN.SEND}}</router-link>
              <a class="setBtn" v-if="scope.row.btnView === 0 && !$store.state.safeMode" @click="privateSure(scope.row.currency, scope.row.btnView)">{{LANG.BTN.REQUEST}}</a>
              <a class="setBtn" v-if="scope.row.btnView === 1 && !$store.state.safeMode" @click="privateSure(scope.row.currency, scope.row.btnView)" style="opacity:0.5">{{LANG.BTN.PENDING}}</a>
              <a class="setBtn" v-if="scope.row.btnView === 0 && $store.state.safeMode" style="opacity:0.5">{{LANG.BTN.REQUEST}}</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
      myAssetsTotal: "",
      bitIconTypeData: [],
      bitIconTypeSearch: [],
      walletAddress: "",
      dataPage: {},
      selectOption: [],
      searchContent: "",
      refreshBalance: "",
      confirmData: "",
      privateSureVisible: false,
      confirmDcrmVisible: false,
      fullscreenLoading: true,
      count: 0,
      tableH: 0
    }
  },
  watch: {
    myAssetsTotal (cur) {
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.addressInfo
    // console.log(this.$store.state.addressInfo)
    this.getInitData()
    
    if (this.$store.state.walletLoadFlag && !this.$store.state.safeMode) {
      this.getBalanceData()
    } else {
      this.fullscreenLoading = false
    }
    this.refreshBalance = setInterval(() => {
      if (!this.$store.state.safeMode) {
        this.getBalanceData()
      }
    }, 250000)
    setTimeout(() => {
      this.tableHeight()
    }, 100)
    window.onresize = () => {
      this.tableHeight()
    }
  },
  methods: {
    getElDialogView () {
      this.modalClick()
    },
    tableHeight () {
      let headerH= document.querySelector('.headerTop_box').clientHeight,
      countH= document.querySelector('.contentHeader_box').clientHeight,
      searchH= document.querySelector('.myAssetsSear_box').clientHeight,
      footH= document.querySelector('.footerBottom_box').clientHeight,
      bodyH = document.body.clientHeight
      this.tableH = bodyH - (headerH + countH + searchH + footH) - 70
    },
    modalClick () {
      this.$router.push("/MyAssets")
      this.privateSureVisible = false
      this.confirmDcrmVisible = false
    },
    myAssetsTotalBalance () {
      this.myAssetsTotal = 0
      for (let i = 0; i < this.bitIconTypeData.length; i++) {
        this.myAssetsTotal += this.$$.thousandToNum(this.bitIconTypeData[i].totalBalance)
      }
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal)
    },
    searchInput () {
      this.bitIconTypeSearch = []
      let searchTxt = this.searchContent ? this.searchContent : this.searchContent.toLowerCase()
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
          if (searchObj.nameSimplicity.toLowerCase().indexOf(searchTxt) !== -1 || searchObj.nameFull.toLowerCase().indexOf(searchTxt) !== -1 || searchObj.availbleBalance.indexOf(searchTxt) !== -1 || searchObj.freeze.indexOf(searchTxt) !== -1 || searchObj.totalBalance.indexOf(searchTxt) !== -1 || searchObj.totalBalanceDoller.indexOf(searchTxt) !== -1) {
            this.bitIconTypeSearch.push(searchArr)
          }
        }
      }
      this.myAssetsTotal = 0
      for (let i = 0; i < this.bitIconTypeSearch.length; i++) {
        this.myAssetsTotal += Number(this.$$.thousandToNum(this.bitIconTypeSearch[i].totalBalanceDoller))
      }
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
    },
    getInitData () {
      let coinInfo = this.$store.state.coinInfo
      let bitCoinInfo = []
      for (let i = 0;i < coinInfo.length; i++) {
        let balance = Number(coinInfo[i].balance) === 0 ? "0.00" : this.$$.thousandBit(coinInfo[i].balance, "no")
        let balanceDollar = Number(coinInfo[i].balanceDollar) === 0 ? "0.00" : this.$$.thousandBit(coinInfo[i].balanceDollar, 2)
        bitCoinInfo.push({
          logo: coinInfo[i].logo,
          nameSimplicity: coinInfo[i].coin,
          nameFull: coinInfo[i].coinAll,
          availbleBalance: balance,
          freeze: Number(coinInfo[i].freeze) === 0 ? "0.00" : this.$$.thousandBit(coinInfo[i].freeze, "no"),
          totalBalance: balance,
          totalBalanceDoller: balanceDollar,
          currency: coinInfo[i].coin,
          receive: "",
          send: "",
          btnView: coinInfo[i].flag
        })
        this.myAssetsTotal = Number(this.myAssetsTotal) + Number(coinInfo[i].balanceDollar)
      }
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
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
      console.log(this.dataPage)
      this.$router.push("/pwdMyAssets")
      this.privateSureVisible = true
    },
    getSignData (data) {
      console.log(data)
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
      })
    },
    getBalanceData () {
      if (!this.walletAddress) {
        return
      }
      let get_walletAddress = this.$store.state.addressInfo
      let coinInfo = this.$store.state.coinInfo
      this.myAssetsTotal = 0
      let balance_count = 0
      let balance_setInterval = setInterval(() => {
        if (balance_count >= coinInfo.length) {
          clearInterval(balance_setInterval)
          this.$store.commit("storeWalletLoadFlag", false)
          balance_count = 0
          return
        }
        // console.log(balance_count)
        let coin = coinInfo[balance_count].coin
        if (coin === "FSN") {
          try {
            let balanceWei = v_web3.eth.getBalance(this.walletAddress)
            this.setBalance(coin, balanceWei, 2)
          } catch (error) {
            this.setBalance(coin, 0, 2)
            this.$$.errTip(error)
          }
        } else {
          try {
            this.setBalance(coin, v_web3.lilo.dcrmGetBalance(this.walletAddress, coin), 2)
          } catch (error) {
            this.setBalance(coin, "", 0)
          }
        }
        balance_count ++
        
      }, 80)
      // for (let i = 0; i < coinInfo.length; i++) {
      //   let coin = coinInfo[i].coin
      //   if (coin === "FSN") {
      //     try {
      //       let balanceWei = v_web3.eth.getBalance(this.walletAddress)
      //       this.setBalance(coin, balanceWei, 2)
      //     } catch (error) {
      //       this.setBalance(coin, 0, 2)
      //       this.$$.errTip(error)
      //     }
      //   } else {
      //     try {
      //       this.setBalance(coin, v_web3.lilo.dcrmGetBalance(this.walletAddress, coin), 2)
      //     } catch (error) {
      //       this.setBalance(coin, "", 0)
      //     }
      //   }
      // }
      // this.$store.commit("storeWalletLoadFlag", false)
    },
    setBalance (coin, balance, flag) {
      this.count ++
      // console.log(this.count)
      let balanceWei = balance
      let balanceGwei = 0
      if (coin === "BTC") {
        balanceGwei = this.$$.fromWei(balanceWei, "btc")
      } else {
        balanceGwei = v_web3.fromWei(balanceWei, "ether").toString()
      }
      let coinData = this.$store.state.coinInfo
      if (isNaN(balance)) {
        return 0
      } else {
        for (let i = 0; i < coinData.length; i++) {
          if (coin === coinData[i].coin) {
            this.getDoller(coinData[i].dollarURL, balanceGwei, coin, flag)
            break
          }
        }
      }
      if (this.count === coinData.length) {
        this.fullscreenLoading = false
        this.count = 0
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
        this.myAssetsTotal = Number(this.myAssetsTotal) + Number(balanceUSD)
        balanceGwei = Number(balanceGwei) === 0 ? "0.00" : this.$$.thousandBit(balanceGwei, "no")
        balanceUSD = Number(balanceUSD) === 0 ? "0.00" : this.$$.thousandBit(balanceUSD, 2)
        for (let j = 0; j < this.bitIconTypeData.length; j++) {
          if (this.bitIconTypeData[j].currency === coin) {
            this.bitIconTypeData[j].availbleBalance = balanceGwei
            this.bitIconTypeData[j].totalBalance = balanceGwei
            this.bitIconTypeData[j].totalBalanceDoller = balanceUSD
            this.bitIconTypeData[j].btnView = flag
            break
          }
        }
        this.$store.commit("storeCoinInfo", storeData)
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.refreshBalance)
    this.refreshBalance = null
  }
}
</script>
