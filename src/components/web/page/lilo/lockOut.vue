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
          <label v-html="selectData.value" class="currency"></label>
        </div>

        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c W240 mt-10" @click="privateSure">Send</button>
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
                <th width="5%">Status</th>
                <th width="5%">Coin</th>
                <th width="5%">Amount</th>
                <th width="25%">Date</th>
                <th width="">Information</th>
                <!-- <th width="10%">Actions</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyData" :key="item.index">
                <td><span v-html="item.statusFsn" :class="item.statusFsn=='failure'?'red':''"></span></td>
                <td><span v-html="selectData.value"></span></td>
                <td><span v-html="item.value"></span></td>
                <td><span v-html="item.date"></span></td>
                <td>
                  <div class="moreInfo_box" @click="MoreContent">
                    <span v-html="item.hash" :title="item.info" class="ellipsis moreInfo_hax"></span>
                    <ul class="list">
                      <li>TXid：{{item.hash}}</li>
                      <li>Adress：{{item.from}}</li>
                    </ul>
                    <i class="arrow"></i>
                  </div>
                </td>
                <!-- <td>
                  <button class="btn btn-primary">Lockin</button>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade bs-example-modal-lg" id="privateSure" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" @click="modalClick">
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

    <div class="modal fade bs-example-modal-lg" id="sendInfo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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
                  <span>{{coinAddress}}</span>
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
                  <span>{{dataPage.data}}</span>
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
import Lilo from '../../../../assets/js/lilo'
export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      walletAddress: '',
      coinAddress: '',
      toAddress: '',
      historyData: [],
      sendAmound: '',
      web3: '',
      nonceNum: '',
      gasPriceNum: '',
      gasLimitNum: '',
      balanceNum: '',
      maxFee: '',
      netWorkInfo: '',
      dataPage: {},
      newWeb3: ''
    }
  },
  watch: {
    selectData (cur, old) {
      let that = this
      that.getInitData()
    }
  },
  mounted () {
    let that = this
    that.pageRefresh()
    that.getInitData()
    that.walletAddress = that.$store.state.addressInfo
    that.getDatabaseInfo()
    that.sendAmound = that.$$.thousandBit('0')
  },
  methods: {
    getInitData () {
      const that = this
      that.titleChange(that.selectData.value)
      that.coinAddress = that.selectData.address
      that.getDatabaseInfo()
      that.setWeb3()
    },
    modalClick () {
      const that = this
      $('#privateSure').on('hide.bs.modal', function () {
        that.$router.push('/LILO/lockOut')
      })
    },
    titleChange (bitType) {
      let that = this
      that.addressTitle = bitType + ' Receiving Address'
    },
    setWeb3 () {
      const that = this
      let Web3 = require('web3')
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
      that.nonceNum = that.web3.eth.getTransactionCount(that.walletAddress, 'pending')
      that.gasPriceNum = that.web3.eth.gasPrice.toString(10)
      that.gasLimitNum = 21000
      that.balanceNum = that.web3.fromWei(that.web3.eth.getBalance(that.walletAddress), 'ether')
      that.maxFee = that.web3.fromWei(Number(that.gasLimitNum) * Number(that.gasPriceNum), 'ether')
      that.netWorkInfo = that.web3.version.node
    },
    getSignData (data) {
      const that = this
      if (data) {
        that.serializedTx = data
        console.log(that.serializedTx)
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
      that.setWeb3()
      that.setBaseSendData()
      let to_value = that.web3.toWei(that.sendAmound, 'ether')
      // console.log(that.newWeb3)
      that.newWeb3.lilo.dcrmGetAddr(that.walletAddress, that.selectData.value).then(function (val) {
        // console.log(val)
        that.dataPage = {
          nonce: that.nonceNum,
          gasPrice: Number(that.gasPriceNum),//Number类型 
          gasLimit: Number(that.gasLimitNum) * 100,
          from: that.walletAddress,
          to: '0x00000000000000000000000000000000000000dc',
          value: Number(0),//Number类型
          data: 'LOCKOUT:' + that.toAddress + ':' + to_value + ':' + that.selectData.value,
          sendType: 'LOCKOUT',
          coin: that.selectData.value,
          url: that.selectData.url,
          to_value: to_value,
          to_address: that.toAddress,
          to_from: that.coinAddress
        }
        that.$router.push('/pwdLockOut')
        $('#privateSure').modal('show')
      })
    },
    changeAmount (data) {
      let that = this
      // that.sendAmound = that.$$.thousandChange(that.sendAmound)
    },
    MoreContent (e) {
      const that = this
      $(e.target.parentNode).parents('tr').siblings('tr').find('.list').hide()
      $(e.target.parentNode).find('.list').toggle()
    },
    pageRefresh () {
      const that = this
      if (that.selectData) {
        that.titleChange(that.selectData.value)
      }
      if (location.href.indexOf('lockOut') !== -1) {
        $('.transferBtn_btn').find('a:eq(0)').removeClass('router-link-active')
      }
    },
    sendAmoundInfo () {
      const that = this
      that.setWeb3()
      let dataBase = {
        date: that.dataPage.data,
        from: that.dataPage.to_from,
        gas: '',
        gasPrice: that.dataPage.gasPrice,
        fsnhash: '',
        nonce: that.dataPage.nonce,
        timeStamp: new Date(),
        to: that.dataPage.to_address,
        value: that.dataPage.to_value,
        statusFsn: '',
        coin: that.dataPage.coin,
        data: that.dataPage.data
      }
      that.web3.eth.sendRawTransaction(that.serializedTx, function(err, hash) {
        if (!err) {
          dataBase.fsnhash = hash
          dataBase.statusFsn = 'success'
          $('#sendInfo').modal('hide')
          that.$$.layerMsg({
            tip: 'Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use ETH Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： ' + hash,
            time: 5000,
            bgColor: '#5dba5a',
            icon: require('../../../../assets/image/Prompt.svg')
          })
        } else {
          console.log(err)
          dataBase.fsnhash = ''
          dataBase.statusFsn = 'failure'
          that.$$.layerMsg({
            tip: err,
            time: 4000,
            bgColor: '#ea4b40',
            icon: require('../../../../assets/image/Prompt.svg')
          })
        }
        // console.log(12431234)
        that.createDatabaseInfo(dataBase)
      })
    },
    createDatabaseInfo (data) {
      const that = this
      $.ajax({
        url: that.$$.serverURL + '/lilo/create',
        type: 'post',
        datatype: 'json',
        data: data,
        success: function (res) {
          console.log(res)
          that.getDatabaseInfo()
        }
      })
    },
    getDatabaseInfo () {
      const that = this
      that.setWeb3()
      $.ajax({
        url: that.$$.serverURL + '/lilo/lockOutHistory',
        type: 'post',
        datatype: 'json',
        data: {from: that.coinAddress, coin: that.selectData.value},
        success: function (res) {
          console.log(res)
          that.historyData = []
          if (res.msg === 'success') {
            for (let i = 0; i < res.info.length; i++) {
              res.info[i].date = that.$$.timeChange({date: res.info[i].date, type:'yyyy-mm-dd hh:mm'})
              res.info[i].value = that.web3.fromWei(res.info[i].value, 'ether')
              that.historyData.push(res.info[i])
            }
          }
          // that.getHistory(res.info)
        }
      })
    }
  }
}
</script>
