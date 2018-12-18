<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">My Assets</h1>
      <h2 class="contentHeader_title" v-html="myAssetsTotal"></h2>
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input type="text" placeholder="FSN" class="input-text" @keyup="searchInput" v-model="searchContent"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="../../../../assets/image/search.png"></div></div>
      </div>
    </div>

    <div class="myAssetsTable_box">
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
            <td><span class="span" v-html="item.totalBalance"></span><p class="p" v-html="item.totalBalanceDoller"></p></td>
            <td>
              <div style="text-align:left">
                <router-link :to="{path:'/Transfer/tranReceive', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView">Receive</router-link>
                <router-link :to="{path:'/Transfer/tranSend', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView">Send</router-link>
                <a class="setBtn" v-if="!item.btnView" @click="privateSure(item.currency)">Request</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div> -->
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
      myAssetsTotal: '',
      bitIconTypeData: [],
      bitIconTypeSearch: [],
      walletAdress: '',
      web3: '',
      newWeb3: '',
      balanceCoin: {
        FSN: '',
        ETH: ''
      },
      dataPage: {},
      selectOption: [],
      SetcoinAndUrl: this.$store.state.coinAndUrl,
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
    that.getInitData()
    that.setWeb3()
  },
  methods: {
    modalClick () {
      const that = this
      $('#privateSure').on('hide.bs.modal', function () {
        that.$router.push('/MyAssets')
      })
    },
    myAssetsTotalBalance () {
      const that = this
      that.myAssetsTotal = 0
      for (let i = 0; i < that.bitIconTypeData.length; i++) {
        that.myAssetsTotal += that.$$.thousandToNum(that.bitIconTypeData[i].totalBalance)
      }
      that.myAssetsTotal = that.$$.thousandBit(that.myAssetsTotal)
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
        // console.log(that.bitIconTypeData.toString())
      }
    },
    getInitData () {
      const that = this
      that.walletAdress = that.$store.state.addressInfo
      that.bitIconTypeSearch = that.bitIconTypeData = [{
          logo: require('../../../../assets/image/fsn.svg'),
          nameSimplicity: 'FSN',
          nameFull: 'Fusion',
          availbleBalance: that.$$.thousandBit(0),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(0),
          totalBalanceDoller: '$' + that.$$.thousandBit(0),
          currency: 'FSN',
          receive: '',
          send: '',
          btnView: true
        }, {
          logo: require('../../../../assets/image/btc.svg'),
          nameSimplicity: 'BTC',
          nameFull: 'Bitcoin',
          availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
          currency: 'BTC',
          receive: '',
          send: '',
          btnView: false
        }, {
          logo: require('../../../../assets/image/eth.svg'),
          nameSimplicity: 'ETH',
          nameFull: 'Ethereum',
          availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
          currency: 'ETH',
          receive: '',
          send: '',
          btnView: false
        }, {
          logo: require('../../../../assets/image/bnb.svg'),
          nameSimplicity: 'BNB',
          nameFull: 'Binance',
          availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
          currency: 'BNB',
          receive: '',
          send: '',
          btnView: false
        }, {
          logo: require('../../../../assets/image/mkr.svg'),
          nameSimplicity: 'MKR',
          nameFull: 'Maker',
          availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
          currency: 'MKR',
          receive: '',
          send: '',
          btnView: false
        }, {
          logo: require('../../../../assets/image/gusd.svg'),
          nameSimplicity: 'GUSD',
          nameFull: 'Gemini Dollar',
          availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
          currency: 'GUSD',
          receive: '',
          send: '',
          btnView: false
        }, {
          logo: require('../../../../assets/image/ht.svg'),
          nameSimplicity: 'HT',
          nameFull: 'HuobiToken',
          availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
          currency: 'HT',
          receive: '',
          send: '',
          btnView: false
        }, {
          logo: require('../../../../assets/image/bnt.svg'),
          nameSimplicity: 'BNT',
          nameFull: 'Bancor',
          availbleBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          freeze: that.$$.thousandBit(0),
          totalBalance: that.$$.thousandBit(that.balanceCoin.ETH),
          totalBalanceDoller: '$' + that.$$.thousandBit(that.balanceCoin.ETH),
          currency: 'BNT',
          receive: '',
          send: '',
          btnView: false
        }
      ]
      that.getBalanceData()
    },
    setWeb3 () {
      const that = this
      let Web3 = require('web3')
      if (typeof web3 !== 'undefined') {
        Web3 = new Web3(Web3.currentProvider)
      } else {
        Web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      }
      that.web3 = Web3
      that.newWeb3 = new Lilo(that.$$.baseUrl)
    },
    getCoinUrl (coin) {
      const that = this
      for (let i = 0; i < that.SetcoinAndUrl.length; i++) {
        if (coin === that.SetcoinAndUrl[i].value) {
          return that.SetcoinAndUrl[i]
        }
      }
    },
    privateSure (data) {
      const that = this
      that.dataPage = {
        coin: data,
        sendType: 'MYWALLET',
        from: that.walletAdress,
        nonce: that.web3.eth.getTransactionCount(that.walletAdress),
        gasPrice: Number(that.web3.eth.gasPrice.toString(10)),
        url: that.$$.baseUrl
      }
      that.$router.push('/pwdMyAssets')
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
      // console.log(that.newWeb3.lilo)
      // console.log(that.web3.isConnected())
      // console.log(that.web3.eth.getBlock(20))
      // if (!that.web3.isConnected()) {
      //   that.web3.setProvider(new web3.providers.HttpProvider(that.$$.baseUrl))
      // }
      // console.log(that.web3.isConnected())
      for (let i = 0; i < that.bitIconTypeData.length; i++) {
        let coin = that.bitIconTypeData[i].currency
        if (coin === 'FSN') {
          try {
            // let getBalanceNum = that.web3.eth.getBalance(that.walletAdress)
            let balanceChange = that.web3.fromWei(that.web3.eth.getBalance(that.walletAdress), 'ether').toString()
            that.balanceCoin.FSN = balanceChange
            that.bitIconTypeData[i].availbleBalance = Number(that.balanceCoin.FSN) === 0 ? '0.00' : that.$$.thousandBit(that.balanceCoin.FSN, 'no')
            that.bitIconTypeData[i].totalBalance = Number(that.balanceCoin.FSN) === 0 ? '0.00' : that.$$.thousandBit(that.balanceCoin.FSN, 'no')
            that.bitIconTypeData[i].totalBalanceDoller = '$' + (Number(that.balanceCoin.FSN) === 0 ? '0.00' : that.$$.thousandBit(that.balanceCoin.FSN, 'no'))
          } catch (error) {
            console.log(error)
          }
        } else {
          that.newWeb3.lilo.dcrmGetBalance(that.walletAdress, coin).then(function(res){
            if (!isNaN(res)) {
              that.balanceCoin[coin] = that.web3.fromWei(res, 'ether')
              that.bitIconTypeData[i].availbleBalance = Number(that.balanceCoin[coin]) === 0 ? '0.00' : that.$$.thousandBit(that.balanceCoin[coin], 'no')
              that.bitIconTypeData[i].totalBalance = Number(that.balanceCoin[coin]) === 0 ? '0.00' : that.$$.thousandBit(that.balanceCoin[coin], 'no')
              that.bitIconTypeData[i].totalBalanceDoller = '$' + (Number(that.balanceCoin[coin]) === 0 ? '0.00' : that.$$.thousandBit(that.balanceCoin[coin], 'no'))
              that.bitIconTypeData[i].btnView = true
            }
          })
        }
      }
      // that.newWeb3.lilo.dcrmGetBalance(sessionStorage.getItem('localFromAddress'), coin).then(function(res){
      //   console.log(res)
      //   if (!isNaN(res)) {
      //     that.balanceCoin[coin] = that.web3.fromWei(res, 'ether')
      //     for (let i = 0; i < that.bitIconTypeData.length; i++) {
      //       if (coin === that.bitIconTypeData[i].currency) {
      //         that.bitIconTypeData[i].availbleBalance = that.$$.thousandBit(that.balanceCoin[coin])
      //         that.bitIconTypeData[i].totalBalance = that.$$.thousandBit(that.balanceCoin[coin])
      //         that.bitIconTypeData[i].totalBalanceDoller = '$' + that.$$.thousandBit(that.balanceCoin[coin])
      //         that.bitIconTypeData[i].btnView = true
      //       }
      //     }
      //   }
      //   that.myAssetsTotalBalance()
      // })
    }
  }
}
</script>
