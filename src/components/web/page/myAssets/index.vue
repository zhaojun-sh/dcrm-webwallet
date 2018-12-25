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
            <td><span class="span" v-html="item.totalBalance"></span><p class="p">$ {{item.totalBalanceDoller}}</p></td>
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
      walletAddress: '',
      web3: '',
      newWeb3: '',
      dataPage: {},
      selectOption: [],
      searchContent: '',
      refreshBalance: ''
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
    that.setWeb3()
    
    if (that.$store.state.walletLoadFlag) {
      that.getBalanceData()
    }
    that.refreshBalance = setInterval(() => {
      that.getBalanceData()
    }, 25000)
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
      let coinInfo = that.$store.state.coinInfo
      let bitCoinInfo = []
      for (let i = 0;i < coinInfo.length; i++) {
        let balance = Number(coinInfo[i].balance) === 0 ? '0.00' : that.$$.thousandBit(coinInfo[i].balance, 'no')
        // console.log(balance)
        bitCoinInfo.push({
          logo: coinInfo[i].logo,
          nameSimplicity: coinInfo[i].coin,
          nameFull: coinInfo[i].coinAll,
          availbleBalance: balance,
          freeze: Number(coinInfo[i].freeze) === 0 ? '0.00' : that.$$.thousandBit(coinInfo[i].freeze, 'no'),
          totalBalance: balance,
          totalBalanceDoller: balance,
          currency: coinInfo[i].coin,
          receive: '',
          send: '',
          btnView: coinInfo[i].flag
        })
      }
      that.bitIconTypeSearch = that.bitIconTypeData = bitCoinInfo
    },
    setWeb3 () {
      const that = this
      that.$$.setWeb3(that)
      that.newWeb3 = new Lilo(that.$$.baseUrl)
    },
    privateSure (data) {
      const that = this
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
      if (!that.walletAddress) {
        return
      }
      that.setWeb3()
      let coinInfo = that.$store.state.coinInfo
      // console.log(that.walletAddress)
      for (let i = 0; i < coinInfo.length; i++) {
        let coin = coinInfo[i].coin
        let storeData = {
          balance: '',
          balanceDoller: '',
          flag: ''
        }
        if (coin === 'FSN') {
          try {
            let balanceChange = that.web3.fromWei(that.web3.eth.getBalance(that.walletAddress), 'ether').toString()
            storeData = {
              balance: balanceChange,
              balanceDoller: balanceChange,
              flag: true,
              coin: coin
            }
            balanceChange = Number(balanceChange) === 0 ? '0.00' : that.$$.thousandBit(balanceChange, 'no')
            that.bitIconTypeData[0].availbleBalance = balanceChange
            that.bitIconTypeData[0].totalBalance = balanceChange
            that.bitIconTypeData[0].totalBalanceDoller = balanceChange
            that.$store.commit('storeCoinInfo', storeData)
          } catch (error) {
            console.log(error)
            that.$$.web3({
              method: 'eth_getBalance',
              params: [that.walletAddress, 'latest']
            }).then(function (res) {
              if (!res.error) {
                let balanceChange = that.web3.fromWei(res.result, 'ether').toString()
                storeData = {
                  balance: balanceChange,
                  balanceDoller: balanceChange,
                  flag: true,
                  coin: coin
                }
                balanceChange = Number(balanceChange) === 0 ? '0.00' : that.$$.thousandBit(balanceChange, 'no')
                that.bitIconTypeData[0].availbleBalance = balanceChange
                that.bitIconTypeData[0].totalBalance = balanceChange
                that.bitIconTypeData[0].totalBalanceDoller = balanceChange
                that.$store.commit('storeCoinInfo', storeData)
              } else {
                let balanceChange = that.web3.fromWei(0, 'ether').toString()
                storeData = {
                  balance: balanceChange,
                  balanceDoller: balanceChange,
                  flag: true,
                  coin: coin
                }
                balanceChange = Number(balanceChange) === 0 ? '0.00' : that.$$.thousandBit(balanceChange, 'no')
                that.bitIconTypeData[0].availbleBalance = balanceChange
                that.bitIconTypeData[0].totalBalance = balanceChange
                that.bitIconTypeData[0].totalBalanceDoller = balanceChange
                that.$$.layerMsg({
                  tip: res,
                  time: 3000,
                  bgColor: '#ea4b40',
                  icon: require('../../../../assets/image/Prompt.svg')
                })
              }
            })
          }
        } else {
          that.newWeb3.lilo.dcrmGetBalance(that.walletAddress, coin).then(function(res){
            if (!isNaN(res)) {
              let balanceChange = that.web3.fromWei(res, 'ether')
              storeData = {
                balance: balanceChange,
                balanceDoller: balanceChange,
                flag: true,
                coin: coin
              }
              balanceChange = Number(balanceChange) === 0 ? '0.00' : that.$$.thousandBit(balanceChange, 'no')
              for (let j = 0; j < that.bitIconTypeData.length; j++) {
                if (that.bitIconTypeData[j].currency === coin) {
                  that.bitIconTypeData[j].availbleBalance = balanceChange
                  that.bitIconTypeData[j].totalBalance = balanceChange
                  that.bitIconTypeData[j].totalBalanceDoller = balanceChange
                  that.bitIconTypeData[j].btnView = true
                }
              }
              that.$store.commit('storeCoinInfo', storeData)
            } else {
              let balanceChange = that.web3.fromWei(0, 'ether')
              storeData = {
                balance: balanceChange,
                balanceDoller: balanceChange,
                flag: false,
                coin: coin
              }
              balanceChange = Number(balanceChange) === 0 ? '0.00' : that.$$.thousandBit(balanceChange, 'no')
              for (let j = 0; j < that.bitIconTypeData.length; j++) {
                if (that.bitIconTypeData[j].currency === coin) {
                  that.bitIconTypeData[j].availbleBalance = balanceChange
                  that.bitIconTypeData[j].totalBalance = balanceChange
                  that.bitIconTypeData[j].totalBalanceDoller = balanceChange
                  that.bitIconTypeData[j].btnView = false
                }
              }
              that.$store.commit('storeCoinInfo', storeData)
            }
          })
        }
      }
      that.$store.commit('storeWalletLoadFlag', false)
      // that.getInitData()
    }
  },
  beforeDestroy () {
    let that = this
    clearInterval(that.refreshBalance)
    that.refreshBalance = null
  }
}
</script>
