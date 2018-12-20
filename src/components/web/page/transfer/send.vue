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
          <input type="text" class="input-text amount keyPressBtn" v-model="sendAmound" id="amountShow" />
          <label v-html="selectData.value" class="currency"></label>
        </div>

        <div class="receiveAddress_btn flex-c">
          <!-- <button class="btn blue flex-c W240 mt-10" @click="sendAmoundInfo">Send</button><br> -->
          <button class="btn blue flex-c W240 mt-10" @click="privateSure">Send</button>
        </div>
      </div>

      <div class="tableHistory_box">
        <hgroup class="tableHistory_title">
          <h3 class="title">History:</h3>
        </hgroup>
        <div class="tableHistory_table">
          <table class="table table-bordered table-hover table-striped">
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
                      <li>TXid：{{item.txhax}}</li>
                      <li>Adress：{{item.to_address}}</li>
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

    <div class="modal fade bs-example-modal-lg" id="privateSure" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" @click="modalClick">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Send Ether & Tokens</h4>
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

    <div class="modal fade bs-example-modal-lg" id="sendInfo" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">You are about to send...</h4>
          </div>
          <div class="modal-body">
            <div class="sendInfo_box">
              <ul>
                <li>
                  <h3>To Address:</h3>
                  <span>{{toAddress}}</span>
                </li>
                <li>
                  <h3>From Address:</h3>
                  <span>{{walletAddress}}</span>
                </li>
                <li>
                  <h3>Amount to Send:</h3>
                  <span>{{sendAmound}}</span>
                </li>
                <li>
                  <h3>Account Balance:</h3>
                  <span>{{Number(balanceNum)}} {{selectData.value}}</span>
                </li>
                <li>
                  <h3>Coin:</h3>
                  <span>{{selectData.value}}</span>
                </li>
                <li>
                  <h3>Network:</h3>
                  <span>{{netWorkInfo}}</span>
                </li>
                <li>
                  <h3>Gas Limit:</h3>
                  <span>{{gasLimitNum}}</span>
                </li>
                <li>
                  <h3>Gas Price:</h3>
                  <span>{{gasPriceNum}}</span>
                </li>
                <li>
                  <h3>Max TX Fee:</h3>
                  <span>{{maxFee}}</span>
                </li>
                <li>
                  <h3>Nonce:</h3>
                  <span>{{nonceNum}}</span>
                </li>
                <li>
                  <h3>Data:</h3>
                  <span>{{dataPage.data || '(none)'}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">No, get me out of here!</button>
            <button type="button" class="btn btn-primary" @click="sendAmoundInfo">Yes, I am sure! Make transaction.</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// let Web3 = require('web3')
import Lilo from '../../../../assets/js/lilo'
export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      coinAddress: '',
      toAddress: '',
      historyData: [],
      walletAddress: '',
      sendAmound: '',
      web3: '',
      newWeb3: '',
      gasPriceNum: '',
      gasLimitNum: '',
      balanceNum: '',
      nonceNum: '',
      dataPage: '',
      serializedTx: '',
      maxFee: '',
      netWorkInfo: '',
      refreshHistory: null
    }
  },
  watch: {
    selectData (cur, old) {
      const that = this
      that.getInitData()
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
    const that = this
    that.walletAddress = that.$store.state.addressInfo
    that.pageRefresh()
    that.getInitData()
    that.sendAmound = that.$$.thousandBit('0', 2)
    that.refreshHistory = setInterval(() => {
      that.getSendHistory()
    }, 20000)
    $('.keyPressBtn').keypress(function (e) {
      if (e.which === 13) {
        that.privateSure()
      }
    })
  },
  methods: {
    getInitData () {
      const that = this
      that.coinAddress = that.selectData.address
      that.titleChange(that.selectData.value)
      that.getSendHistory()
    },
    modalClick () {
      const that = this
      $('#privateSure').on('hide.bs.modal', function () {
        // alert('模态框关闭了');
        // history.go(-1)
        that.$router.push('/Transfer/tranSend')
      })
    },
    privateSure () {
      const that = this
      if (!that.toAddress) {
        that.$$.layerMsg({
          tip: that.selectData.value + ' Receiving Address is not null.',
          time: 2000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
        return
      }
      let getAmountTip = that.$$.limitCoin(that.sendAmound, that.selectData.limit, that.selectData.number)
      if (getAmountTip.flag) {
        that.$$.layerMsg({
          tip: getAmountTip.msg,
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
        return
      }
      that.setBaseSendData()
      let to_value = that.web3.toWei(that.sendAmound, 'ether')
      that.dataPage = {
        nonce: that.nonceNum,
        gasPrice: Number(that.gasPriceNum),//Number类型 
        gasLimit: Number(that.gasLimitNum),
        from: that.walletAddress,
        to: that.toAddress,
        value: Number(to_value),//Number类型,
        url: that.selectData.url,
        coin: that.selectData.value
      }
      if (that.selectData.value !== 'FSN') {
        that.dataPage.data = 'TRANSACTION:' + that.toAddress + ':' + to_value + ':' + that.selectData.value
        that.dataPage.sendType = 'SENDDCRM'
        that.dataPage.to = '0x00000000000000000000000000000000000000dc'
        that.dataPage.value = '0'
      }
      console.log(that.dataPage)
      that.$router.push('/pwdSend')
      $('#privateSure').modal('show')
    },
    getSignData (data) {
      const that = this
      if (data) {
        that.serializedTx = data
        $('#privateSure').modal('hide')
        $('#sendInfo').modal('show')
      } else {
        $('#privateSure').modal('hide')
        $('#sendInfo').modal('hide')
        that.$$.layerMsg({
          tip: 'Sign error!',
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('../../../../assets/image/Prompt.svg')
        })
      }
      // console.log(data)
    },
    titleChange (bitType) {
      const that = this
      that.addressTitle = bitType + ' Receiving Address'
    },
    MoreContent (e) {
      const that = this
      $(e.target.parentNode).parents('tr').siblings('tr').find('.list').hide()
      $(e.target.parentNode).find('.list').toggle()
    },
    pageRefresh () {
      const that = this
      if (location.href.indexOf('tranSend') !== -1) {
        $('.transferBtn_btn').find('a:eq(0)').removeClass('router-link-active')
      }
    },
    changeAmount () {
      const that = this
      that.sendAmound = that.$$.thousandChange(that.sendAmound, 18)
    },
    setWeb3 () {
      const that = this
      let Web3 = require('web3')
      // console.log(that.selectData.url)
      if (typeof web3 !== 'undefined') {
        Web3 = new Web3(Web3.currentProvider)
      } else {
        Web3 = new Web3(new Web3.providers.HttpProvider(that.selectData.url))
      }
      that.web3 = Web3
      that.newWeb3 = new Lilo(that.selectData.url)
    },
    setBaseSendData () {
      const that = this
      that.setWeb3()
      // console.log(that.coinAddress)

      let to_value = that.web3.toWei(that.sendAmound, 'ether')
      let getGasLimit = that.web3.eth.estimateGas({to: that.toAddress})
      // console.log(getGasLimit)
      // .then(function (val) {
      //   console.log(val)
      // })

      that.nonceNum = that.web3.eth.getTransactionCount(that.walletAddress, 'pending')
      that.gasPriceNum = that.web3.eth.gasPrice.toString(10)
      that.gasLimitNum = getGasLimit * 6
      if (that.selectData.value === 'FSN') {
        that.balanceNum = that.web3.fromWei(that.web3.eth.getBalance(that.coinAddress), 'ether')
      } else {
        that.newWeb3.lilo.dcrmGetBalance(sessionStorage.getItem('localFromAddress'), that.selectData.value).then(function(res){
          that.balanceNum = that.web3.fromWei(res, 'ether')
        })
      }
      that.maxFee = that.web3.fromWei(Number(that.gasLimitNum) * Number(that.gasPriceNum), 'ether')
      that.netWorkInfo = that.web3.version.node
      // console.log(that.balanceNum)
    },
    sendAmoundInfo () {
      const that = this
      that.setWeb3()
      let dataBase = {
        value: Number(that.$$.thousandToNum(that.sendAmound)),
        coin: that.selectData.value,
        to_address: that.toAddress,
        from_address: that.walletAddress,
        date: new Date(),
        txhax: '',
        status: ''
      }
      that.web3.eth.sendRawTransaction(that.serializedTx, function(err, hash) {
        if (!err) {
          dataBase.txhax = hash
          dataBase.status = 'success'
          $('#sendInfo').modal('hide')
          that.$$.layerMsg({
            tip: 'Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use ETH Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： ' + hash,
            time: 5000,
            bgColor: '#5dba5a',
            icon: require('../../../../assets/image/Prompt.svg')
          })
        } else {
          console.log(err)
          dataBase.txhax = ''
          dataBase.status = 'failure'
          that.$$.layerMsg({
            tip: err,
            time: 4000,
            bgColor: '#ea4b40',
            icon: require('../../../../assets/image/Prompt.svg')
          })
        }
        that.sendDatabase(dataBase)
      })
    },
    sendDatabase (data) {
      const that = this
      $.ajax({
        url: that.$$.serverURL + '/transfer/create',
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
        url: that.$$.serverURL + '/transfer/history',
        datatype: 'json',
        type: 'post',
        data: {
          from_address: that.walletAddress,
          coin: that.selectData.value
        },
        success: function (res) {
          // console.log(res)
          that.historyData = []
          if (res.msg === 'success' && res.info.length > 0) {
            for (let i = 0; i < res.info.length; i++) {
              res.info[i].date = that.$$.timeChange({date: res.info[i].date, type:'yyyy-mm-dd hh:mm'})
              res.info[i].value = that.$$.thousandBit(res.info[i].value, 'no')
              // res.info[i].value = res.info[i].value
              if (res.info[i].txhax) {
                res.info[i].status = 'success'
              } else {
                res.info[i].status = 'failure'
              }
              // res.info[i].value = that.$$.thousandBit(res.info[i].value)
              // that.getStatus(res.info[i])
            }
            that.historyData = res.info
          } else {

          }
        },
        error: function (res) {
          console.log(res)
        }
      })
    },
    /**
     * that.getStatus()方法暂不使用
     * 后期会使用
     */
    // getStatus (txhax) {
    //   const that = this
    //   that.setWeb3()
    //   that.web3.eth.getTransactionReceipt(txhax.txhax, function (err, res) {
    //     if (err) {
    //       // console.log(err)
    //       txhax.status = 'failure'
    //       that.historyData.push(txhax)
    //     } else {
    //       if (res && res.status) {
    //         txhax.status = 'success'
    //         that.historyData.push(txhax)
    //       } else {
    //         txhax.status = 'pending'
    //         that.historyData.push(txhax)
    //       }
    //     }
    //   })
    // },
  },
  beforeDestroy () {
    const that = this
    clearInterval(that.refreshHistory)
    that.refreshHistory = null
  }
}
</script>
