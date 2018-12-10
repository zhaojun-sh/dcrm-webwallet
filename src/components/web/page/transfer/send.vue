<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" v-model="toAddress" />
        </div>

        <h3 class="mt-20">Amount:</h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text amount" v-model="sendAmound" id="amountShow" @change="changeAmount" />
          <label v-html="selectData" class="currency"></label>
        </div>

        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c W240 mt-10" @click="sendAmoundInfo">Send</button>
        </div>
      </div>

      <div class="tableHistory_box">
        <hgroup class="tableHistory_title">
          <h3 class="title">History:</h3>
        </hgroup>
        <div class="tableHistory_table">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th width='5%'>Status</th>
                <th width='5%'>Coin</th>
                <th width='20%'>Amount</th>
                <th width='30%'>Date</th>
                <th width='40%'>Information</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyData" :key="item.index">
                <td><span v-html="item.status" :class="item.status !== 'success' ? 'red' : ''"></span></td>
                <td><span v-html="item.coin"></span></td>
                <td><span v-html="item.value" class="nowrap"></span></td>
                <td><span v-html="item.date" class="nowrap"></span></td>
                <td>
                  <div class="moreInfo_box" @click="MoreContent">
                    <span v-html="item.txhax" :title="item.info" class="ellipsis moreInfo_hax"></span>
                    <ul class="list">
                      <li  v-html="item.txhax"></li>
                      <li  v-html="item.to_address"></li>
                    </ul>
                    <i class="arrow"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// let Web3 = require('web3')

export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      privateKey: '',
      publicKey: '',
      walletAdress: '',
      toAddress: '',
      historyData: [],
      sendAmound: '',
      web3Set: ''
    }
  },
  watch: {
    selectData (cur, old) {
      const that = this
      that.dataInit(cur)
    }
  },
  mounted () {
    const that = this
    that.pageRefresh()
    that.privateKey = that.$store.state.privateKey
    that.publicKey = that.$store.state.publicKey
    that.walletAdress = that.$store.state.addressInfo
    that.sendAmound = that.$$.thousandBit('0')
    that.getSendHistory()
    // $('body').on('click', '.moreInfo_hax', function () {
    //   $(this).siblings('.list').toggle()
      // if ($(this).siblings('.list').css('display') == 'none') {
      //   console.log(1)
      //   $(this).siblings('.list').css('display','block')
      // } else {
      //   console.log(2)
      //   $(this).siblings('.list').css('display','none')
      // }
    // })
  },
  methods: {
    titleChange (bitType) {
      const that = this
      that.addressTitle = bitType + ' Receiving Address'
    },
    MoreContent (e) {
      const that = this
      // $('.moreInfo_box').find('.list').hide()
      $(e.target.parentNode).parents('tr').siblings('tr').find('.list').hide()
      $(e.target.parentNode).find('.list').toggle()
    },
    dataInit (data) {
      const that = this
      that.titleChange(data)
    },
    pageRefresh () {
      const that = this
      if (that.selectData) {
        that.dataInit(that.selectData)
      }
      if (location.href.indexOf('tranSend') !== -1) {
        $('.transferBtn_btn').find('a:eq(0)').removeClass('router-link-active')
      }
    },
    changeAmount () {
      const that = this
      that.sendAmound = that.$$.thousandChange(that.sendAmound)
    },
    setWeb3 () {
      const that = this
      let Web3 = require('web3')
      if (typeof web3 !== 'undefined') {
        Web3 = new Web3(Web3.currentProvider)
      } else {
        Web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      }
      that.web3Set = Web3
    },
    sendAmoundInfo () {
      const that = this
      // let privKey = '0xd60d59ac00cc5fd92abb92b9f4ec7d19f45d11fd5b0a726a28cc6be0a443d684'
      // let privKey = 'e63d00f899b00b98b9f56d260d677af0b7ae5564feab9444afc808c914b19e3d'
      let privKey = that.privateKey.substr(2)
      // console.log(that.privateKey)
      // console.log(that.privateKey.substr(2))
      // let from_address = '0xfeB89d8b6e4f775087c53aA8208Ca72A4E64A475'
      // let from_address = '0xD562BB03A071f8928F885946Be4bd37b5beAeD6E'
      let from_address = that.walletAdress
      // let to_address = '0x0520e8e5e08169c4dbc1580dc9bf56638532773a'
      // let to_address = '0x02b135e7e9d00410c518d9c420fde0ed0b21732c'
      let to_address = that.toAddress
      let to_value = that.sendAmound
      that.setWeb3()
      // console.log(that.web3Set.isConnected())
      let nonceNum = that.web3Set.eth.getTransactionCount(from_address, 'pending')
      // let balanceNum = that.web3Set.eth.getBalance(from_address)
      let getGasPriceNum = that.web3Set.eth.gasPrice.toString(10)
      // let gasNum = that.web3Set.eth.estimateGas({to: to_address})
      // that.getGasPrice()
      // console.log(gasNum)
      // console.log(nonceNum)
      // console.log(that.toNum(balanceNum))
      // console.log(that.toNum(that.web3Set.fromWei(balanceNum, 'ether')))
      // console.log(that.web3Set.toWei('0.01', 'ether').length)
      // console.log(getGasPriceNum)
      let rawTx = {
        nonce: nonceNum,
        // gasPrice: Number(that.web3Set.toWei(0.0475, 'ether')), 
        gasPrice: Number(getGasPriceNum),//Number类型 
        gasLimit: '300',
        from: from_address,
        to: to_address,
        value: Number(to_value),//Number类型
        // value: that.web3Set.toWei(0.000000000001, 'ether'),
        data: ""
      }
      let Tx = require('ethereumjs-tx')
      let privateKey = new Buffer(privKey, 'hex')
      let tx = new Tx(rawTx)
      tx.sign(privateKey)
      let serializedTx = tx.serialize()
      let serializedTxString = serializedTx.toString('hex')
      serializedTxString = serializedTxString.indexOf('0x') === 0 ? serializedTxString : ('0x' + serializedTxString)
      let dataBase = {
        value: Number(that.$$.thousandToNum(to_value)),
        coin: that.selectData,
        to_address: to_address,
        from_address: from_address,
        date: new Date(),
        txhax: '',
        status: ''
      }
      that.web3Set.eth.sendRawTransaction(serializedTxString, function(err, hash) {
        if (!err) {
          dataBase.txhax = hash.result
          dataBase.status = 'pending'
        } else {
          console.log(err)
          dataBase.txhax = ''
          dataBase.status = 'failure'
        }
        that.sendDatabase(dataBase)
      })
    },
    sendDatabase (data) {
      const that = this
      $.ajax({
        url: that.$$.serverURL + '/send/create',
        datatype: 'json',
        type: 'post',
        data: {
          value: data.value,
          coin: data.coin,
          to_address: data.to_address,
          from_address: data.from_address,
          date: data.date,
          txhax: data.txhax,
          status: data.status
        },
        success: function (res) {
          console.log(res)
          if (res.msg === 'success') {
            that.getSendHistory()
          }
        }
      })
    },
    getSendHistory () {
      const that = this
      $.ajax({
        url: that.$$.serverURL + '/send/history',
        datatype: 'json',
        type: 'post',
        data: {
          from_address: that.walletAdress
        },
        success: function (res) {
          console.log(res)
          if (res.msg === 'success' && res.info.length > 0) {
            for (let i = 0; i < res.info.length; i++) {
              res.info[i].date = that.$$.timeChange({date: res.info[i].date, type:'yyyy-mm-dd hh:mm'})
              res.info[i].value = that.$$.thousandBit(res.info[i].value)
              // console.log(that.$$.thousandBit(res.info[i].value.toString()))
              that.getStatus(res.info[i])
            }
            // that.historyData = res.info.reverse()
          } else {

          }
        },
        error: function (res) {
          console.log(res)
        }
      })
    },
    getStatus (txhax) {
      const that = this
      that.setWeb3()
      if (txhax.txhax) {
        that.web3Set.eth.getTransactionReceipt(txhax.txhax, function (err, res) {
          if (err) {
            console.log(err)
          } else {
            // console.log(res)
            if (res.status) {
              txhax.status = 'success'
              that.historyData.push(txhax)
            } else {
              txhax.status = 'pending'
              that.historyData.push(txhax)
            }
          }
        })
      } else {
        txhax.status = 'failure'
        that.historyData.push(txhax)
      }
      // console.log(statusData)
    },
    toNum (num) {
      let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    }
  }
}
</script>
