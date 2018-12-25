<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">LockIn/LockOut</h1>
      <!-- <h2 class="contentHeader_title" v-html="myAssetsTotal"></h2> -->
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input type="text" placeholder="ETH" class="input-text" @keyup="searchInput" v-model="searchContent"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="../../../../assets/image/search.png"></div></div>
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
          <li v-for="(item, index) in bitIconTypeSearch" :key="index">
            <div class="iconImg"><img :src="item.logo"></div>
            <h4 class="title" v-html="item.nameFull"></h4>
            <div class="dappView_btn" v-if="item.nameFull !== 'MORE'">
              <a class="setBtn" v-if="item.btnView" @click="toUrlLock('/LILO/lockIn', item.currency)">Deposit</a>
              <a class="setBtn" v-if="item.btnView" @click="toUrlLock('/LILO/lockOut', item.currency)" :style="!item.viewOpacity ? 'opacity:0.5' : ''">Withdraw</a>
              <a class="setBtn" v-if="!item.btnView" @click="privateSure(item.currency)">Request</a>
            </div>
            <div class="line"></div>
          </li>
        </ul>
      </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="privateSure" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" @click="modalClick">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Unlock</h4>
          </div>
          <div class="modal-body">
            <router-view v-on:sendSignData='getSignData' :sendDataPage='dataPage'></router-view>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import wallet from '../../../../assets/js/wallet'
import Lilo from '../../../../assets/js/lilo'
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
      searchContent: ''
    }
  },
  beforeCreate () {
    const that = this
    that.$$.loadingStart()
  },
  created () {
    const that = this
    that.$$.loadingEnd()
  },
  mounted () {
    let that = this
    that.walletAddress = that.$store.state.addressInfo
    that.getInitData()
    if (that.$store.state.walletLoadFlag) {
      that.getBalanceData()
    }
  },
  methods: {
    toUrlLock (url, coin) {
      const that = this
      if (coin === 'ETH' || url === '/LILO/lockIn') {
        that.$router.push({ path: url, query: { currency: coin }})
      }
    },
    modalClick () {
      const that = this
      $('#privateSure').on('hide.bs.modal', function () {
        that.$router.push('/LILO')
      })
    },
    searchInput () {
      const that = this
      that.bitIconTypeSearch = []
      let searchTxt = that.searchContent
      if (searchTxt === '') {
        that.bitIconTypeSearch = that.bitIconTypeData
      } else {
        if (!isNaN(that.searchContent)) {
          searchTxt = that.$$.thousandBit(that.searchContent, 'no')
        }
        for (let i = 0; i < that.bitIconTypeData.length; i++) {
          let searchArr = that.bitIconTypeData[i]
          let searchObj = {
            nameSimplicity: searchArr.nameSimplicity,
            nameFull: searchArr.nameFull,
            availbleBalance: searchArr.availbleBalance,
            freeze: searchArr.freeze,
            totalBalance: searchArr.totalBalance,
            totalBalanceDoller: searchArr.totalBalanceDoller
          }
          if (searchObj.nameSimplicity.indexOf(searchTxt) !== -1 || searchObj.nameFull.indexOf(searchTxt) !== -1 || searchObj.availbleBalance.indexOf(searchTxt) !== -1 || searchObj.freeze.indexOf(searchTxt) !== -1 || searchObj.totalBalance.indexOf(searchTxt) !== -1 || searchObj.totalBalanceDoller.indexOf(searchTxt) !== -1) {
            that.bitIconTypeSearch.push(searchArr)
          }
        }
      }
    },
    getInitData () {
      const that = this
      let coinInfo = that.$store.state.coinInfo
      let bitCoinInfo = []
      for (let i = 0;i < coinInfo.length; i++) {
        if (coinInfo[i].coin === 'FSN') {
          continue
        }
        bitCoinInfo.push({
          logo: coinInfo[i].logo,
          nameSimplicity: coinInfo[i].coin,
          nameFull: coinInfo[i].coinAll,
          availbleBalance: that.$$.thousandBit(coinInfo[i].balance),
          freeze: that.$$.thousandBit(coinInfo[i].freeze),
          totalBalance: that.$$.thousandBit(coinInfo[i].balance),
          totalBalanceDoller: that.$$.thousandBit(coinInfo[i].balanceDoller),
          currency: coinInfo[i].coin,
          receive: '',
          send: '',
          btnView: coinInfo[i].flag
        })
      }
      bitCoinInfo.push({
        logo: require('../../../../assets/image/MORE.svg'),
        nameSimplicity: 'MORE',
        nameFull: 'MORE',
        availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
        freeze: that.$$.thousandBit(0),
        totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
        totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
        currency: 'MORE',
        receive: '',
        send: '',
        btnView: false,
        viewOpacity: false
      })
      that.bitIconTypeSearch = that.bitIconTypeData = bitCoinInfo
    },
    setWeb3 () {
      const that = this
      that.$$.setWeb3(that)
      // let Web3 = require('web3')
      // let web3 = new Web3()
      // // console.log(that.selectData.url)
      // if (typeof web3 !== 'undefined') {
      //   // Web3 = new Web3(Web3.currentProvider)
      //   web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      // } else {
      //   Web3 = new Web3(new Web3.providers.HttpProvider(that.selectData.url))
      // }
      // that.web3 = Web3
      that.newWeb3 = new Lilo(that.$$.baseUrl)
    },
    privateSure (data) {
      const that = this
      // that.setBaseSendData()
      that.setWeb3()
      that.dataPage = {
        coin: data,
        sendType: 'MYWALLET',
        from: that.walletAddress,
        nonce: '',
        gasPrice: ''
      }

      try {
        that.dataPage.nonce = that.web3.eth.getTransactionCount(that.walletAddress, 'pending')
      } catch (error) {
        that.nonceNum = that.$$.getWeb3({
          method: 'eth_getTransactionCount',
          params: [that.walletAddress, 'pending']
        }).result
      }
      try {
        that.dataPage.gasPrice = that.web3.eth.gasPrice.toString(10)
      } catch (error) {
        that.dataPage.gasPrice = that.$$.getWeb3({
          method: 'eth_gasPrice',
          params: []
        }).result.toString(10)
      }

      that.$router.push('/pwdCoinList')
      $('#privateSure').modal('show')
    },
    getSignData (data) {
      const that = this
      if (data) {
        for (let i = 0; i < that.bitIconTypeData.length; i++) {
          if (data === that.bitIconTypeData[i].currency) {
            that.bitIconTypeData[i].btnView = true
          }
        }
        $('#privateSure').modal('hide')
        that.$$.layerMsg({
          tip: 'Request success',
          time: 3000,
          bgColor: '#5dba5a',
          icon: require('../../../../assets/image/Prompt.svg')
        })
        // that.getBalanceData()
        let storeData = {
          balance: 0,
          balanceDoller: 0,
          flag: true,
          coin: data
        }
        that.$store.commit('storeCoinInfo', storeData)
      } else {
        $('#privateSure').modal('hide')
        that.$$.layerMsg({
          tip: 'Sign error!',
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
      }
    },
    getBalanceData () {
      const that = this
      that.setWeb3()
      for (let i = 0; i < that.bitIconTypeData.length; i++) {
        if (that.bitIconTypeData[i].currency === 'FSN' || that.bitIconTypeData[i].currency === 'MORE') {
          continue
        }
        that.newWeb3.lilo.dcrmGetBalance(that.walletAddress, that.bitIconTypeData[i].currency).then(function(res){
          let storeData = {
            balance: '',
            balanceDoller: '',
            flag: '',
            coin: that.bitIconTypeData[i].currency
          }
          if (!isNaN(res)) {
            let balanceChange = that.web3.fromWei(res, 'ether')
            balanceChange = balanceChange === 0 ? '0.00' : that.$$.thousandBit(balanceChange, 'no')
            storeData = {
              balance: balanceChange,
              balanceDoller: balanceChange,
              flag: true,
              coin: that.bitIconTypeData[i].currency
            }
            that.bitIconTypeData[j].btnView = true
            that.$store.commit('storeCoinInfo', storeData)
          } else {
            let balanceChange = that.web3.fromWei(0, 'ether')
            balanceChange = balanceChange === 0 ? '0.00' : that.$$.thousandBit(balanceChange, 'no')
            storeData = {
              balance: balanceChange,
              balanceDoller: balanceChange,
              flag: false,
              coin: that.bitIconTypeData[i].currency
            }
            that.bitIconTypeData[j].btnView = false
            that.$store.commit('storeCoinInfo', storeData)
          }
        })
        // that.newWeb3.lilo.dcrmGetAddr(sessionStorage.getItem('localFromAddress'), that.bitIconTypeData[i].currency).then(function(res){
          //   // console.log(that.bitIconTypeData[i].currency + ":" + res)
        //   if (res && (res.indexOf('0x') === 0 || res.indexOf('coin') === -1)) {
          //     that.bitIconTypeData[i].btnView = true
        //     let storeData = {
          //       flag: true,
        //       coin: coin
        //     }
        //     that.$store.commit('storeCoinInfo', storeData)
        //   }
        // })
      }
      that.$store.commit('storeWalletLoadFlag', false)
    }
  }
}
</script>
