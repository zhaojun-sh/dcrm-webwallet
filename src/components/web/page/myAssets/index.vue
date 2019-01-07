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
                <router-link :to="{path:'/Transfer/tranReceive', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView">Receive</router-link>
                <router-link :to="{path:'/Transfer/tranSend', query: {currency: item.currency}}" class="setBtn" v-if="item.btnView">Send</router-link>
                <a class="setBtn" v-if="!item.btnView" @click="privateSure(item.currency)">Request</a>
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
            <router-view v-on:sendSignData='getSignData' :sendDataPage='dataPage'></router-view>
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
              Do you requeest?
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
    myAssetsTotal () {
      const that = this
      that.myAssetsTotal = that.$$.thousandBit(that.myAssetsTotal, 2)
    }
    // bitIconTypeData (cur, old) {
    //   console.log('bitIconTypeData')
    //   console.log(cur)
    //   console.log(old)
    //   const that = this
    //   that.myAssetsTotal = 0
    //   // for (let i = 0; i < that.bitIconTypeData.length; i++) {
    //   //   that.myAssetsTotal += Number(that.bitIconTypeData[i].balanceDoller)
    //   // }
    //   for (let i = 0; i < cur.length; i++) {
    //     that.myAssetsTotal += Number(cur[i].balanceDoller)
    //   }
    //   that.myAssetsTotal = that.$$.thousandBit(that.myAssetsTotal, 'no')
    // },
    // bitIconTypeSearch (cur) {
    //   const that = this
    //   that.myAssetsTotal = 0
    //   for (let i = 0; i < cur.length; i++) {
    //     that.myAssetsTotal += Number(that.$$.thousandToNum(cur[i].totalBalanceDoller))
    //   }
    //   that.myAssetsTotal = that.$$.thousandBit(that.myAssetsTotal, 2)
    // }
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
    }, 250000)

    // that.changeCoinDoller('FSN')
    console.log(that.$$.baseUrl)
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
      let searchTxt = that.searchContent ? that.searchContent : that.searchContent.toLowerCase()
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
          if (searchObj.nameSimplicity.toLowerCase().indexOf(searchTxt) !== -1 || searchObj.nameFull.toLowerCase().indexOf(searchTxt) !== -1 || searchObj.availbleBalance.indexOf(searchTxt) !== -1 || searchObj.freeze.indexOf(searchTxt) !== -1 || searchObj.totalBalance.indexOf(searchTxt) !== -1 || searchObj.totalBalanceDoller.indexOf(searchTxt) !== -1) {
            that.bitIconTypeSearch.push(searchArr)
          }
      }
        // console.log(that.bitIconTypeData.toString())
      }
      that.myAssetsTotal = 0
      for (let i = 0; i < that.bitIconTypeSearch.length; i++) {
        that.myAssetsTotal += Number(that.$$.thousandToNum(that.bitIconTypeSearch[i].totalBalanceDoller))
      }
      that.myAssetsTotal = that.$$.thousandBit(that.myAssetsTotal, 2)
    },
    getInitData () {
      const that = this
      let coinInfo = that.$store.state.coinInfo
      let bitCoinInfo = []
      for (let i = 0;i < coinInfo.length; i++) {
        let balance = Number(coinInfo[i].balance) === 0 ? '0.00' : that.$$.thousandBit(coinInfo[i].balance, 'no')
        let balanceDoller = Number(coinInfo[i].balanceDoller) === 0 ? '0.00' : that.$$.thousandBit(coinInfo[i].balanceDoller, 2)
        // console.log(balance)
        bitCoinInfo.push({
          logo: coinInfo[i].logo,
          nameSimplicity: coinInfo[i].coin,
          nameFull: coinInfo[i].coinAll,
          availbleBalance: balance,
          freeze: Number(coinInfo[i].freeze) === 0 ? '0.00' : that.$$.thousandBit(coinInfo[i].freeze, 'no'),
          totalBalance: balance,
          totalBalanceDoller: balanceDoller,
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
      }
      try {
        that.dataPage.nonce = that.web3.eth.getTransactionCount(that.walletAddress, 'pending')
      } catch (error) {
        that.nonceNum = that.$$.getWeb3({
          method: 'eth_getTransactionCount',
          params: [that.walletAddress, 'pending']
        }).result
      }
      that.$router.push('/pwdMyAssets')
      $('#privateSure').modal('show')
    },
    getSignData (data) {
      const that = this
      if (data) {
        if (data.nowFlag) {
          that.sendRawTransion(data)
        } else {
          that.confirmData = data
          $('#confirmDcrm').modal('show')
        }
        $('#privateSure').modal('hide')
      } else {
        $('#privateSure').modal('hide')
        that.$$.layerMsg({
          tip: 'Sign error!',
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
      }
    },
    sendRawTransion (data) {
      const that = this
      try {
        that.web3.eth.sendRawTransaction(data.serializedTx, function (err, hash) {
          if (err) {
            console.log(err)
            that.$$.layerMsg({
              tip: err,
              time: 5000,
              bgColor: '#ea4b40',
              icon: require('@/assets/image/Prompt.svg')
            })
          } else {
            for (let i = 0; i < that.bitIconTypeData.length; i++) {
              if (data.coin === that.bitIconTypeData[i].currency) {
                that.bitIconTypeData[i].btnView = true
              }
            }
            let storeData = {
              balance: 0,
              balanceDoller: 0,
              flag: true,
              coin: data.coin
            }
            that.$store.commit('storeCoinInfo', storeData)
            $('#confirmDcrm').modal('hide')
            that.$$.layerMsg({
              tip: 'Request success',
              time: 3000,
              bgColor: '#5dba5a',
              icon: require('@/assets/image/Prompt.svg')
            })
            // resolve(hash)
          }
        })
      } catch (error) {
        that.$$.web3({
          method: 'eth_sendRawTransaction',
          params: [data.serializedTx]
        }).then(function (res) {
          if (res.error) {
            that.$$.layerMsg({
              tip: res.error,
              time: 4000,
              bgColor: '#ea4b40',
              icon: require('@/assets/image/Prompt.svg')
            })
          } else {
            for (let i = 0; i < that.bitIconTypeData.length; i++) {
              if (data.coin === that.bitIconTypeData[i].currency) {
                that.bitIconTypeData[i].btnView = true
              }
            }
            that.$$.layerMsg({
              tip: 'Request success',
              time: 3000,
              bgColor: '#5dba5a',
              icon: require('@/assets/image/Prompt.svg')
            })
            let storeData = {
              balance: 0,
              balanceDoller: 0,
              flag: true,
              coin: data.coin
            }
            that.$store.commit('storeCoinInfo', storeData)
          }
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
      that.myAssetsTotal = 0
      for (let i = 0; i < coinInfo.length; i++) {
        let coin = coinInfo[i].coin
        let storeData = {
          balance: '',
          balanceDoller: '',
          flag: '',
          coin: coin
        }
        if (coin === 'FSN') {
          try {
            let balanceWei = that.web3.eth.getBalance(that.walletAddress)
            let balanceGwei = that.web3.fromWei(balanceWei, 'ether').toString()
            let balanceUSD = that.changeCoinDoller(coin, balanceGwei)
            that.myAssetsTotal = Number(that.myAssetsTotal) + Number(balanceUSD)
            storeData = {
              balance: balanceGwei,
              balanceDoller: balanceUSD,
              flag: true,
              coin: coin
            }
            
            balanceGwei = Number(balanceGwei) === 0 ? '0.00' : that.$$.thousandBit(balanceGwei, 'no')
            balanceUSD = Number(balanceUSD) === 0 ? '0.00' : that.$$.thousandBit(balanceUSD, 2)
            that.bitIconTypeData[0].availbleBalance = balanceGwei
            that.bitIconTypeData[0].totalBalance = balanceGwei
            that.bitIconTypeData[0].totalBalanceDoller = balanceUSD
            that.$store.commit('storeCoinInfo', storeData)
          } catch (error) {
            console.log(error)
            that.$$.web3({
              method: 'eth_getBalance',
              params: [that.walletAddress, 'latest']
            }).then(function (res) {
              if (!res.error) {
                let balanceWei = that.web3.eth.getBalance(that.walletAddress)
                let balanceGwei = that.web3.fromWei(balanceWei, 'ether').toString()
                let balanceUSD = that.changeCoinDoller(coin, balanceGwei)
                that.myAssetsTotal = Number(that.myAssetsTotal) + Number(balanceUSD)
                storeData = {
                  balance: balanceGwei,
                  balanceDoller: balanceUSD,
                  flag: true,
                  coin: coin
                }
                balanceGwei = Number(balanceGwei) === 0 ? '0.00' : that.$$.thousandBit(balanceGwei, 'no')
                balanceUSD = Number(balanceUSD) === 0 ? '0.00' : that.$$.thousandBit(balanceUSD, 2)
                that.bitIconTypeData[0].availbleBalance = balanceGwei
                that.bitIconTypeData[0].totalBalance = balanceGwei
                that.bitIconTypeData[0].totalBalanceDoller = balanceUSD
                that.$store.commit('storeCoinInfo', storeData)
              } else {
                let balanceWei = that.web3.eth.getBalance(that.walletAddress)
                let balanceGwei = that.web3.fromWei(balanceWei, 'ether').toString()
                let balanceUSD = that.changeCoinDoller(coin, balanceGwei)
                that.myAssetsTotal = Number(that.myAssetsTotal) + Number(balanceUSD)
                storeData = {
                  balance: balanceGwei,
                  balanceDoller: balanceUSD,
                  flag: true,
                  coin: coin
                }
                balanceGwei = Number(balanceGwei) === 0 ? '0.00' : that.$$.thousandBit(balanceGwei, 'no')
                balanceUSD = Number(balanceUSD) === 0 ? '0.00' : that.$$.thousandBit(balanceUSD, 2)
                that.bitIconTypeData[0].availbleBalance = balanceGwei
                that.bitIconTypeData[0].totalBalance = balanceGwei
                that.bitIconTypeData[0].totalBalanceDoller = balanceUSD
                that.$$.layerMsg({
                  tip: res,
                  time: 3000,
                  bgColor: '#ea4b40',
                  icon: require('@/assets/image/Prompt.svg')
                })
              }
            })
          }
        } else {
          that.newWeb3.lilo.dcrmGetBalance(that.walletAddress, coin).then(function(res){
            if (!isNaN(res)) {
              // let balanceGwei = that.web3.fromWei(res, 'ether')
              let balanceWei = res
              let balanceGwei = that.web3.fromWei(res, 'ether').toString()
              let balanceUSD = that.changeCoinDoller(coin, balanceGwei)
              that.myAssetsTotal = Number(that.myAssetsTotal) + Number(balanceUSD)
              storeData = {
                balance: balanceGwei,
                balanceDoller: balanceUSD,
                flag: true,
                coin: coin
              }
              balanceGwei = Number(balanceGwei) === 0 ? '0.00' : that.$$.thousandBit(balanceGwei, 'no')
              balanceUSD = Number(balanceUSD) === 0 ? '0.00' : that.$$.thousandBit(balanceUSD, 2)
              for (let j = 0; j < that.bitIconTypeData.length; j++) {
                if (that.bitIconTypeData[j].currency === coin) {
                  that.bitIconTypeData[j].availbleBalance = balanceGwei
                  that.bitIconTypeData[j].totalBalance = balanceGwei
                  that.bitIconTypeData[j].totalBalanceDoller = balanceUSD
                  that.bitIconTypeData[j].btnView = true
                }
              }
              that.$store.commit('storeCoinInfo', storeData)
            } else {
              // let balanceGwei = that.web3.fromWei(0, 'ether')
              let balanceWei = 0
              let balanceGwei = that.web3.fromWei(0, 'ether').toString()
              let balanceUSD = that.changeCoinDoller(coin, balanceGwei)
              that.myAssetsTotal = Number(that.myAssetsTotal) + Number(balanceUSD)
              storeData = {
                balance: balanceGwei,
                balanceDoller: balanceUSD,
                flag: false,
                coin: coin
              }
              balanceGwei = Number(balanceGwei) === 0 ? '0.00' : that.$$.thousandBit(balanceGwei, 'no')
              balanceUSD = Number(balanceUSD) === 0 ? '0.00' : that.$$.thousandBit(balanceUSD, 2)
              for (let j = 0; j < that.bitIconTypeData.length; j++) {
                if (that.bitIconTypeData[j].currency === coin) {
                  that.bitIconTypeData[j].availbleBalance = balanceGwei
                  that.bitIconTypeData[j].totalBalance = balanceGwei
                  that.bitIconTypeData[j].totalBalanceDoller = balanceUSD
                  that.bitIconTypeData[j].btnView = false
                }
              }
              that.$store.commit('storeCoinInfo', storeData)
            }
          })
        }
      }
      that.$store.commit('storeWalletLoadFlag', false)
    },
    changeCoinDoller (coin, balance) {
      const that = this
      let dollerNum = 0
      let coinData = [{
        coin: 'FSN',
        url: 'https://api.coinmarketcap.com/v1/ticker/fusion/'
      }, {
        coin: 'BTC',
        url: 'https://api.coinmarketcap.com/v1/ticker/bitcoin/'
      }, {
        coin: 'ETH',
        url: 'https://api.coinmarketcap.com/v1/ticker/ethereum/'
      }, {
        coin: 'BNB',
        url: 'https://api.coinmarketcap.com/v1/ticker/binance-coin/'
      }, {
        coin: 'MKR',
        url: 'https://api.coinmarketcap.com/v1/ticker/maker/'
      }, {
        coin: 'GUSD',
        url: 'https://api.coinmarketcap.com/v1/ticker/gemini-dollar/'
      }, {
        coin: 'HT',
        url: 'https://api.coinmarketcap.com/v1/ticker/huobi-token/'
      }, {
        coin: 'BNT',
        url: 'https://api.coinmarketcap.com/v1/ticker/bancor/'
      }]
      // let endTime = Date.parse(new Date())
      // let startTime = endTime - (1000 * 60 * 60 * 24)
      // let periodTime = '/' + startTime + '/' + endTime
      for (let i = 0; i < coinData.length; i++) {
        if (coin === coinData[i].coin) {
          dollerNum = that.getDoller(coinData[i].url)
          break
        }
      }
      dollerNum = dollerNum * balance
      // console.log(periodTime)
      // console.log(coin + ':' + dollerNum)
      return dollerNum
    },
    getDoller (url) {
      // $.ajax({
      //   type: "get",
      //   async: false,
      //   url: url + time,
      //   dataType: "jsonp",
      //   jsonp: "callback",
      //   jsonpCallback: "weather",
      //   success: function (res) {
      //     console.log(res)
      //   },
      //   error: function (res) {
      //     console.log(res)
      //   }
      // })
      // let script
      // script = document.createElement('i')
      // script.type = 'text/javascript'
      // script.src = url + time
      // document.body.appendChild(script)
      // return
      let callbackData = 0
      $.ajax({
        url: url,
        type: 'get',
        // contentType: 'application/json',
        datatype: 'jsonp',
        async: false,
        success: function (res) {
          // console.log(res[0].price_usd)
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
    let that = this
    clearInterval(that.refreshBalance)
    that.refreshBalance = null
  }
}
</script>
