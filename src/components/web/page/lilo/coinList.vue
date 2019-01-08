<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">Lockin / Lockout</h1>
      <!-- <h2 class="contentHeader_title" v-html="myAssetsTotal"></h2> -->
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input type="text" placeholder="ETH" class="input-text" @keyup="searchInput" v-model="searchContent"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="@/assets/image/search.png"></div></div>
      </div>
    </div>

    <!-- <div class="myAssetsTable_box">
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Available Balance</th>
            <th>Freeze</th>
            <th>Total Balance</th>
            <th>Actions</th>
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
            <td><span class="span" v-html="item.totalBalance"></span><p class="p" v-html="item.totalBalanceDoller"></p></td>
            <td>
              <div>
                <router-link :to="{path:'/LILO/lockIn', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView">lockIn</router-link>
                <router-link :to="{path:'/LILO/lockOut', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView">lockOut</router-link>
                <a class="setBtn" v-if="!item.btnView" @click="privateSure(item.currency)">Request</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <div class="contView_box">
      <div class="supCoinView_list lockView_list">
        <ul>
          <li v-for="(item, index) in bitIconTypeSearch" :key="index" class="col col-md-3">
            <div class="iconImg"><img :src="item.logo"></div>
            <h4 class="title" v-html="item.nameFull"></h4>
            <div class="dappView_btn" v-if="item.nameFull !== 'MORE'">
              <a class="setBtn" v-if="item.btnView === 2" @click="toUrlLock('/LILO/lockIn', item.currency)">Deposit</a>
              <a class="setBtn" v-if="item.btnView === 2" @click="toUrlLock('/LILO/lockOut', item.currency)" :style="item.currency === 'ETH' ? '' : 'opacity:0.5'">Withdraw</a>
              <a class="setBtn" v-if="item.btnView === 0" @click="privateSure(item.currency, item.btnView)">Request</a>
              <a class="setBtn" v-if="item.btnView === 1" @click="privateSure(item.currency, item.btnView)" style="opacity:0.5">Pending</a>
            </div>
            <div class="dappView_btn" v-if="item.nameFull === 'MORE'"></div>
            <div class="line"></div>
          </li>
        </ul>
      </div>
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
      bitIconTypeData: [],
      bitIconTypeSearch: [],
      walletAddress: '',
      web3: '',
      newWeb3: '',
      balanceCoin: {
        FSN: '',
        ETH: ''
      },
      dataPage: {},
      selectOption: [],
      searchContent: '',
      confirmData: ''
    }
  },
  mounted () {
    this.walletAddress = this.$store.state.addressInfo
    this.getInitData()
    if (this.$store.state.walletLoadFlag) {
      this.getBalanceData()
    }
  },
  methods: {
    toUrlLock (url, coin) {
      if (coin === 'ETH' || url === '/LILO/lockIn') {
        this.$router.push({ path: url, query: { currency: coin }})
      } else {
        this.$$.layerMsg({
          tip: 'Functional development!',
          time: 3000,
          bgColor: '#f15a4a',
          icon: require('@/assets/image/Prompt.svg')
        })
      }
    },
    modalClick () {
      $('#privateSure').on('hide.bs.modal', () => {
        this.$router.push('/LILO')
      })
    },
    searchInput () {
      this.bitIconTypeSearch = []
      let searchTxt = this.searchContent
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
        if (coinInfo[i].coin === 'FSN') {
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
          receive: '',
          send: '',
          btnView: coinInfo[i].flag
        })
      }
      bitCoinInfo.push({
        logo: require('@/assets/image/MORE.svg'),
        nameSimplicity: 'MORE',
        nameFull: 'MORE',
        availbleBalance: this.$$.thousandBit(this.balanceCoin.ETH),
        freeze: this.$$.thousandBit(0),
        totalBalance: this.$$.thousandBit(this.balanceCoin.ETH),
        totalBalanceDoller: '$' + this.$$.thousandBit(this.balanceCoin.ETH),
        currency: 'MORE',
        receive: '',
        send: '',
        btnView: 3,
        viewOpacity: false
      })
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
      this.setWeb3()
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
      this.$router.push('/pwdCoinList')
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
          time: 5000,
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
      this.setWeb3()
      for (let i = 0; i < this.bitIconTypeData.length; i++) {
        if (this.bitIconTypeData[i].currency === 'FSN' || this.bitIconTypeData[i].currency === 'MORE') {
          continue
        }
        this.newWeb3.lilo.dcrmGetBalance(this.walletAddress, this.bitIconTypeData[i].currency).then((res) => {
          if (!isNaN(res)) {
            this.setBalance(this.bitIconTypeData[i].currency, res, 2)
            this.bitIconTypeData[i].btnView = 2
          } else {
            this.setBalance(this.bitIconTypeData[i].currency, 0, 0)
            this.bitIconTypeData[i].btnView = 0
          }
        })
      }
      this.$store.commit('storeWalletLoadFlag', false)
    },
    setBalance (coin, balance, flag) {
      let balanceChange, balanceUSD
      let storeData = {
        balance: '',
        balanceDollar: '',
        flag: '',
        coin: coin
      }
      if (coin === 'BTC') {
        balanceChange = this.$$.fromWei(balance, 'btc')
      } else {
        balanceChange = this.web3.fromWei(balance, 'ether').toString()
      }
      balanceUSD = this.changeCoinDoller(coin, balanceChange)
      balanceChange = balanceChange === 0 ? '0.00' : this.$$.thousandBit(balanceChange, 'no')
      storeData = {
        balance: balanceChange,
        balanceDollar: balanceUSD,
        flag: flag,
        coin: coin
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
  }
}
</script>
