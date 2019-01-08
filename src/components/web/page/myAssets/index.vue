<template>
  <div style="background:#fff;min-height:100%">
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">My Assets</h1>
      <h2 class="contentHeader_title">$ {{myAssetsTotal}}</h2>
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input type="text" placeholder="FSN" class="input-text" @keyup="searchInput" v-model="searchContent"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="@/assets/image/search.png"></div></div>
      </div>
    </div>

    <div class="myAssetsTable_box table-responsive">
      <table>
        <thead>
          <tr>
            <th width="220">Coin</th>
            <th>Available Balance</th>
            <th>Freeze</th>
            <th>Total Balance</th>
            <th width="165">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in bitIconTypeSearch" :key="index">
            <td>
              <div class="flex-sc">
                <div class="logo"><img :src="item.logo"></div>
                <div class="title">
                  <h2 class="span" v-html="item.nameSimplicity"></h2>
                  <h3 class="p" v-html="item.nameFull"></h3>
                </div>
              </div>
            </td>
            <td><span class="span" v-html="item.availbleBalance"></span></td>
            <td><span class="span" v-html="item.freeze"></span></td>
            <td><span class="span" v-html="item.totalBalance"></span><p class="p">$ {{item.totalBalanceDoller}}</p></td>
            <td>
              <div style="text-align:left">
                <!-- {{item.btnView}} -->
                <router-link :to="{path:'/Transfer/tranReceive', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView === 2">Receive</router-link>
                <router-link :to="{path:'/Transfer/tranSend', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView === 2">Send</router-link>
                <a class="setBtn" v-if="item.btnView === 0" @click="privateSure(item.currency, item.btnView)">Request</a>
                <a class="setBtn" v-if="item.btnView === 1" @click="privateSure(item.currency, item.btnView)" style="opacity:0.5">Pending</a>
                <!-- <a class="setBtn" @click="privateSure(item.currency)">Request</a> -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade bs-example-modal-lg" id="privateSure" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" @click="modalClick">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">Unlock</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <router-view @sendSignData='getSignData' :sendDataPage='dataPage'></router-view>
          </div>
          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div> -->
        </div>
      </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="confirmDcrm" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">Request address confirmation</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <div class="">
              Do you request?
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">No, get me out of here!</button>
            <button type="button" class="btn btn-primary" @click="sendRawTransion(confirmData)">Yes, I am sure!</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Lilo from '@/assets/js/lilo'
export default {
  name: 'myAssets',
  data () {
    return {
      myAssetsTotal: '',
      bitIconTypeData: [],
      bitIconTypeSearch: [],
      walletAddress: '',
      web3: '',
      newWeb3: '',
      dataPage: {},
      selectOption: [],
      searchContent: '',
      refreshBalance: '',
      confirmData: ''
    }
  },
  watch: {
    myAssetsTotal (cur) {
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.addressInfo
    this.getInitData()
    this.setWeb3()
    
    if (this.$store.state.walletLoadFlag) {
      this.getBalanceData()
    }
    this.refreshBalance = setInterval(() => {
      this.getBalanceData()
    }, 250000)
  },
  methods: {
    modalClick () {
      $('#privateSure').on('hide.bs.modal', () => {
        this.$router.push('/MyAssets')
      })
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
      if (searchTxt === '') {
        this.bitIconTypeSearch = this.bitIconTypeData
      } else {
        if (!isNaN(this.searchContent)) {
          searchTxt = this.$$.thousandBit(this.searchContent, 'no')
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
        let balance = Number(coinInfo[i].balance) === 0 ? '0.00' : this.$$.thousandBit(coinInfo[i].balance, 'no')
        let balanceDollar = Number(coinInfo[i].balanceDollar) === 0 ? '0.00' : this.$$.thousandBit(coinInfo[i].balanceDollar, 2)
        bitCoinInfo.push({
          logo: coinInfo[i].logo,
          nameSimplicity: coinInfo[i].coin,
          nameFull: coinInfo[i].coinAll,
          availbleBalance: balance,
          freeze: Number(coinInfo[i].freeze) === 0 ? '0.00' : this.$$.thousandBit(coinInfo[i].freeze, 'no'),
          totalBalance: balance,
          totalBalanceDoller: balanceDollar,
          currency: coinInfo[i].coin,
          receive: '',
          send: '',
          btnView: coinInfo[i].flag
        })
        this.myAssetsTotal = Number(this.myAssetsTotal) + Number(coinInfo[i].balanceDollar)
      }
      this.myAssetsTotal = this.$$.thousandBit(this.myAssetsTotal, 2)
      this.bitIconTypeSearch = this.bitIconTypeData = bitCoinInfo
    },
    setWeb3 () {
      this.$$.setWeb3(this)
      this.newWeb3 = new Lilo(this.$$.baseUrl)
    },
    privateSure (data, flag) {
      if (flag === 1) {
        this.$$.layerMsg({
          tip: 'Please refresh the page to view!',
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
        return
      }
      this.dataPage = {
        coin: data,
        sendType: 'MYWALLET',
        from: this.walletAddress,
        nonce: '',
      }
      try {
        this.dataPage.nonce = this.web3.eth.getTransactionCount(this.walletAddress, 'pending')
      } catch (error) {
        this.nonceNum = this.$$.getWeb3({
          method: 'eth_getTransactionCount',
          params: [this.walletAddress, 'pending']
        }).result
      }
      this.$router.push('/pwdMyAssets')
      $('#privateSure').modal('show')
    },
    getSignData (data) {
      if (data) {
        if (data.nowFlag) {
          this.sendRawTransion(data)
        } else {
          this.confirmData = data
          $('#confirmDcrm').modal('show')
        }
        $('#privateSure').modal('hide')
      } else {
        $('#privateSure').modal('hide')
        this.$$.layerMsg({
          tip: 'Sign error!',
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
      }
    },
    sendRawTransion (data) {
      this.web3.eth.sendRawTransaction(data.serializedTx, (err, hash) => {
        if (err) {
          console.log(err)
          this.$$.layerMsg({
            tip: err,
            time: 5000,
            bgColor: '#ea4b40',
            icon: require('@/assets/image/Prompt.svg')
          })
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
          this.$store.commit('storeCoinInfo', storeData)
          $('#confirmDcrm').modal('hide')
          this.$$.layerMsg({
            tip: 'Request success,Save your TX Hash in case you need it later：' + hash +', and refresh the page to view after 15 seconds.',
            time: 3000,
            bgColor: '#5dba5a',
            icon: require('@/assets/image/Prompt.svg')
          })
        }
      })
    },
    getBalanceData () {
      if (!this.walletAddress) {
        return
      }
      this.setWeb3()
      let coinInfo = this.$store.state.coinInfo
      this.myAssetsTotal = 0
      for (let i = 0; i < coinInfo.length; i++) {
        let coin = coinInfo[i].coin
        if (coin === 'FSN') {
          try {
            let balanceWei = this.web3.eth.getBalance(this.walletAddress)
            this.setBalance(coin, balanceWei, 2)
          } catch (error) {
            this.setBalance(coin, 0, 2)
            this.$$.layerMsg({
              tip: error,
              time: 3000,
              bgColor: '#ea4b40',
              icon: require('@/assets/image/Prompt.svg')
            })
          }
        } else {
          // this.newWeb3.lilo.dcrmGetBalance(this.walletAddress, coin).then(function(res){
          this.newWeb3.lilo.dcrmGetBalance(this.walletAddress, coin).then((res) => {
            if (!isNaN(res)) {
              this.setBalance(coin, res, 2)
            } else {
              this.setBalance(coin, 0, 0)
            }
          })
        }
      }
      this.$store.commit('storeWalletLoadFlag', false)
    },
    setBalance (coin, balance, flag) {
      let storeData = {
        balance: '',
        balanceDollar: '',
        flag: '',
        coin: coin
      }
      let balanceWei = balance
      let balanceGwei = 0
      if (coin === 'BTC') {
        balanceGwei = this.$$.fromWei(balanceWei, 'btc')
      } else {
        balanceGwei = this.web3.fromWei(balanceWei, 'ether').toString()
      }
      let balanceUSD = this.changeCoinDoller(coin, balanceGwei)
      this.myAssetsTotal = Number(this.myAssetsTotal) + Number(balanceUSD)
      storeData = {
        balance: balanceGwei,
        balanceDollar: balanceUSD,
        flag: flag,
        coin: coin
      }
      balanceGwei = Number(balanceGwei) === 0 ? '0.00' : this.$$.thousandBit(balanceGwei, 'no')
      balanceUSD = Number(balanceUSD) === 0 ? '0.00' : this.$$.thousandBit(balanceUSD, 2)
      for (let j = 0; j < this.bitIconTypeData.length; j++) {
        if (this.bitIconTypeData[j].currency === coin) {
          this.bitIconTypeData[j].availbleBalance = balanceGwei
          this.bitIconTypeData[j].totalBalance = balanceGwei
          this.bitIconTypeData[j].totalBalanceDoller = balanceUSD
          this.bitIconTypeData[j].btnView = flag
        }
      }
      this.$store.commit('storeCoinInfo', storeData)
    },
    changeCoinDoller (coin, balance) {
      let dollerNum = 0
      let coinData = this.$store.state.coinInfo
      for (let i = 0; i < coinData.length; i++) {
        if (coin === coinData[i].coin) {
          dollerNum = this.getDoller(coinData[i].dollarURL)
          break
        }
      }
      dollerNum = dollerNum * balance
      return dollerNum
    },
    getDoller (url) {
      let callbackData = 0
      $.ajax({
        url: url,
        type: 'get',
        datatype: 'jsonp',
        async: false,
        success: function (res) {
          if (res.length > 0) {
            callbackData = res[0].price_usd
          } else {
            callbackData = 0
          }
        },
        error: function (res) {
          callbackData = 0
        }
      })
      return callbackData
    }
  },
  beforeDestroy () {
    clearInterval(this.refreshBalance)
    this.refreshBalance = null
  }
}
</script>
