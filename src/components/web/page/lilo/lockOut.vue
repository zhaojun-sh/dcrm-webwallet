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
          <button class="btn blue flex-c W240 mt-10" @click="privateSure">Send</button>
        </div>
      </div>

      <div class="tableHistory_box">
        <hgroup class="tableHistory_title">
          <h3 class="title">History:</h3>
        </hgroup>
        <div class="tableHistory_table table-responsive">
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
                <td><span v-html="item.statusFsn" :class="item.statusFsn !== 'Success'?'red':''"></span></td>
                <td><span v-html="selectData.coin"></span></td>
                <td><span v-html="item.value"></span></td>
                <td><span v-html="item.date"></span></td>
                <td>
                  <div class="moreInfo_box" @click="MoreContent">
                    <span v-html="item.fsnhash" :title="item.fsnhash" class="ellipsis moreInfo_hax"></span>
                    <ul class="list">
                      <li>TXid：{{item.fsnhash}}</li>
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

    <div class="modal fade bs-example-modal-lg" id="privateSure" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" @click="modalClick">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">LochOut</h4>
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

    <div class="modal fade bs-example-modal-lg" id="sendInfo" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">LochOut</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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
                  <span>{{Number(balanceNum)}} {{selectData.coin}}</span>
                </li>
                <li>
                  <h3>Coin:</h3>
                  <span>{{selectData.coin}}</span>
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
import Lilo from '@/assets/js/lilo'
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
      if (cur.coin !== old.coin) {
        this.getInitData()
      }
    }
  },
  mounted () {
    const that = this
    this.pageRefresh()
    if (this.selectData) {
      this.getInitData()
    }
    this.walletAddress = this.$store.state.addressInfo
    this.sendAmound = this.$$.thousandBit('0')
    $('.keyPressBtn').keypress(function (e) {
      if (e.which === 13) {
        that.privateSure()
      }
    })
  },
  methods: {
    getInitData () {
      this.titleChange(this.selectData.coin)
      this.coinAddress = this.selectData.address
      this.getDatabaseInfo()
      this.setWeb3()
    },
    modalClick () {
      $('#privateSure').on('hide.bs.modal', () => {
        this.$router.push('/LILO/lockOut')
      })
    },
    titleChange (bitType) {
      this.addressTitle = bitType + ' Withdraw Address'
    },
    setWeb3 () {
      this.$$.setWeb3(this)
      this.newWeb3 = new Lilo(this.$$.baseUrl)
    },
    setBaseSendData () {
      try {
        this.nonceNum = this.web3.eth.getTransactionCount(this.walletAddress, 'pending')
      } catch (error) {
        this.nonceNum = this.$$.getWeb3({
          method: 'eth_getTransactionCount',
          params: [this.walletAddress, 'pending']
        }).result
      }

      try {
        this.gasPriceNum = this.web3.eth.gasPrice.toString(10)
      } catch (error) {
        this.gasPriceNum = this.$$.getWeb3({
          method: 'eth_gasPrice',
          params: []
        }).result.toString(10)
      }

      let getGasLimit
      try {
        getGasLimit = this.web3.eth.estimateGas({to: this.toAddress})
      } catch (error) {
        try {
          getGasLimit = this.$$.getWeb3({
            method: 'eth_estimateGas',
            params: [{to: this.toAddress}]
          })
          if (getGasLimit.error) {
            getGasLimit = 'Error'
          } else {
            getGasLimit = getGasLimit.result
          }
        } catch (error) {
          getGasLimit = error
        }
      }

      if (getGasLimit.toString().indexOf('Error') !== -1) {
        this.$$.layerMsg({
          tip: getGasLimit,
          time: 4000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
        throw getGasLimit
      }
      this.gasLimitNum = getGasLimit * 6
      if (this.selectData.coin === 'FSN') {
        try {
          this.balanceNum = this.web3.fromWei(this.web3.eth.getBalance(this.$store.state.addressInfo), 'ether')
        } catch (error) {
          this.balanceNum = this.$$.getWeb3({
            method: 'eth_getBalance',
            params: [this.$store.state.addressInfo, 'latest']
          }).result
          this.balanceNum = this.web3.fromWei(this.balanceNum, 'ether')
        }
      } else {
        this.newWeb3.lilo.dcrmGetBalance(this.$store.state.addressInfo, this.selectData.coin).then((res) => {
          this.balanceNum = this.web3.fromWei(res, 'ether')
        })
      }
      this.maxFee = this.web3.fromWei(Number(this.gasLimitNum) * Number(this.gasPriceNum), 'ether')
      try {
        this.netWorkInfo = this.web3.version.node
      } catch (error) {
        this.netWorkInfo = this.$$.getWeb3({
          method: 'web3_clientVersion',
          params: []
        }).result
      }
    },
    getSignData (data) {
      if (data) {
        this.serializedTx = data
        $('#privateSure').modal('hide')
        $('#sendInfo').modal('show')
      } else {
        $('#privateSure').modal('hide')
        $('#sendInfo').modal('hide')
        this.$$.layerMsg({
          tip: 'Sign error!',
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
      }
    },
    privateSure () {
      if (!this.toAddress) {
        this.$$.layerMsg({
          tip: this.selectData.coin + ' Receiving Address is not null.',
          time: 2000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
        return
      }
      if (this.toAddress.toLowerCase() === this.walletAddress.toLowerCase()) {
        this.$$.layerMsg({
          tip: 'You can`t transfer money to yourself.',
          time: 5000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
        return
      }
      if (this.selectData.coin !== 'BTC' && this.toAddress.indexOf('0x') !== 0) {
        this.$$.layerMsg({
          tip: 'The address needs to start with 0x',
          time: 5000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
        return
      }
      let getAmountTip = this.$$.limitCoin(this.sendAmound, this.selectData.limit, this.selectData.number)
      if (getAmountTip.flag) {
        this.$$.layerMsg({
          tip: getAmountTip.msg,
          time: 3000,
          bgColor: '#ea4b40',
          icon: require('@/assets/image/Prompt.svg')
        })
        return
      }
      this.$$.loadingStart()
      this.setWeb3()
      this.setBaseSendData()
      let to_value = this.web3.toWei(this.sendAmound, 'ether')
      if (this.selectData.coin === 'BTC') {
        to_value = this.$$.toWei(this.sendAmound, 'btc')
      }
      this.newWeb3.lilo.dcrmGetAddr(this.walletAddress, this.selectData.coin).then((val) => {
        // console.log(val)
        this.dataPage = {
          nonce: this.nonceNum,
          gasPrice: Number(this.gasPriceNum),//Number类型 
          gasLimit: Number(this.gasLimitNum),
          from: this.walletAddress,
          to: '0x00000000000000000000000000000000000000dc',
          value: Number(0),//Number类型
          data: 'LOCKOUT:' + this.toAddress + ':' + to_value + ':' + this.selectData.coin,
          sendType: 'LOCKOUT',
          coin: this.selectData.coin,
          url: this.$$.baseUrl,
          to_value: to_value,
          to_address: this.toAddress,
          to_from: this.coinAddress
        }
        this.$router.push('/pwdLockOut')
        $('#privateSure').modal('show')
        this.$$.loadingEnd()
      })
    },
    MoreContent (e) {
      $(e.target.parentNode).parents('tr').siblings('tr').find('.list').hide()
      $(e.target.parentNode).find('.list').toggle()
    },
    pageRefresh () {
      if (this.selectData) {
        this.titleChange(this.selectData.coin)
      }
      if (location.href.indexOf('lockOut') !== -1) {
        $('.transferBtn_btn').find('a:eq(0)').removeClass('router-link-active')
      }
    },
    sendAmoundInfo () {
      this.$$.loadingStart()
      this.setWeb3()
      let dataBase = {
        date: this.dataPage.data,
        from: this.dataPage.to_from,
        gas: '',
        gasPrice: this.dataPage.gasPrice,
        fsnhash: '',
        nonce: this.dataPage.nonce,
        timeStamp: new Date(),
        to: this.dataPage.to_address,
        value: this.dataPage.to_value,
        statusFsn: '',
        coin: this.dataPage.coin,
        data: this.dataPage.data,
        tokenSymbol: this.dataPage.coin
      }
      this.web3.eth.sendRawTransaction(this.serializedTx, (err, hash) => {
        if (!err) {
          dataBase.fsnhash = hash
          dataBase.statusFsn = 'success'
          $('#sendInfo').modal('hide')
          this.$$.layerMsg({
            tip: 'Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use ETH Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： ' + hash,
            time: 5000,
            bgColor: '#5dba5a',
            icon: require('@/assets/image/Prompt.svg')
          })
          this.$store.commit('storeWalletLoadFlag', true)
        } else {
          console.log(err)
          dataBase.fsnhash = ''
          dataBase.statusFsn = 'failure'
          this.$$.layerMsg({
            tip: err,
            time: 4000,
            bgColor: '#ea4b40',
            icon: require('@/assets/image/Prompt.svg')
          })
        }
        this.createDatabaseInfo(dataBase)
        this.$$.loadingEnd()
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
          // console.log(res)
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
        data: {from: that.coinAddress, coin: that.selectData.coin},
        success: function (res) {
          that.historyData = []
          if (res.msg === 'success') {
            for (let i = 0; i < res.info.length; i++) {
              res.info[i].date = that.$$.timeChange({date: res.info[i].date, type:'yyyy-mm-dd hh:mm'})
              res.info[i].value = that.web3.fromWei(res.info[i].value, 'ether')
              res.info[i].statusFsn = that.getStatus(res.info[i])
              that.historyData.push(res.info[i])
            }
          }
        }
      })
    },
    getStatus (txhax) {
      let statusFsn = ''
      if (txhax.fsnhash) {
        this.setWeb3()
        try {
          let receipt = this.web3.eth.getTransactionReceipt(txhax.fsnhash)
          if (receipt && receipt.status) {
            statusFsn = 'Success'
          } else {
            statusFsn = 'Pending'
          }
        } catch (error) {
          statusFsn = 'Failure'
        }
      } else {
        if (txhax.hash) {
          statusFsn = 'Failure'
        } else {
          statusFsn = 'Failure'
        }
      }
      return statusFsn
    },
  }
}
</script>
