<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" readonly v-model="walletAddress" id="walletAdressHide"/>
          <!-- <input type="hidden" readonly v-model="privateKey" id="privateKeyHide" /> -->
        </div>
        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c" @click="qrcode(walletAddress)"><div class="icon"><img src="../../../../assets/image/QRcode.svg"></div>Show QR code</button>
          <button class="btn cyan flex-c" @click="copyAddress('#walletAdressHide')"><div class="icon"><img src="../../../../assets/image/copy.svg"></div>Copy clipboard</button>
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
                <th width="10%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyData" :key="item.index">
                <td><span v-html="item.statusFsn" :class="item.statusFsn=='failure'?'red':''"></span></td>
                <td><span v-html="selectData.name"></span></td>
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
                <td>
                  <button class="btn" v-if="item.statusFsn === 'New'">Lockin</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="qrcodeBox">
        <div class="modal-dialog modal-md" role="document">
          <div class="modal-content">
            <div class="qrcodeCont_box">
              <div id="qrcode" class="flex-c"></div>
              <div class="qrcodeCont_title">
                <h3>Your Address</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Web3 from '../../../../assets/js/lilo'
export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      walletAddress: '',
      historyData: [],
      web3: ''
    }
  },
  watch: {
    selectData (cur, old) {
      let that = this
      that.titleChange(cur.name)
      that.web3 = new Web3(cur.value)
      // that.web3.lilo.dcrmGetAddr('0xD562BB03A071f8928F885946Be4bd37b5beAeD6E', 'ETH').then(function(val){
      //   console.log(val)
      // })
    }
  },
  mounted () {
    let that = this
    that.pageRefresh()
    that.walletAddress = that.$store.state.addressInfo
    that.web3 = new Web3(that.selectData.value)
    // that.getHistory()
    that.getDatabaseInfo()
  },
  methods: {
    titleChange (bitType) {
      let that = this
      that.addressTitle = bitType + ' Receiving Address'
    },
    setWeb3 () {
      const that = this
      that.web3 = new Web3(that.selectData)
    },
    MoreContent (e) {
      const that = this
      $(e.target.parentNode).parents('tr').siblings('tr').find('.list').hide()
      $(e.target.parentNode).find('.list').toggle()
    },
    qrcode (cont) {
      $('#qrcode').html('')
      let qrcodeInit = new QRCode('qrcode', {
        width: 300,
        height: 340, // 高度
        text: cont // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      })
      console.log(qrcodeInit)
      $('#qrcodeBox').modal('show')
    },
    copyAddress (id) {
      $(id).select()
      document.execCommand('Copy')
      this.$$.layerMsg('Copy Success')
    },
    pageRefresh () {
      const that = this
      if (that.selectData) {
        that.titleChange(that.selectData.name)
      }
      if (location.href.indexOf('lockOut') === -1) {
        $('.transferBtn_btn').find('a:eq(0)').addClass('router-link-active')
      }
    },
    getHistory (data) {
      const that = this
      $.ajax({
        url: 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=' + that.walletAddress,
        type: 'post',
        datatype: 'json',
        success: function (res) {
          console.log(res)
          if (res && res.result.length > 0) {
            that.historyData = []
            // console.log(that.web3)
            let j = 0
            do {
              for (let i = 0; i < res.result.length; i++) {
                if (res.result[i].to.toLowerCase() === that.walletAddress.toLowerCase()) {
                  // console.log(data)
                  if (data.length > 0 && data[j].hash === res.result[i].hash) {
                    if (data[j].fsnhash) {
                      res.result[i].statusFsn = 'success'
                    } else {
                      res.result[i].statusFsn = 'New'
                    }
                  } else {
                    that.createDatabaseInfo(res.result[i])
                    res.result[i].statusFsn = 'New'
                  }
                  res.result[i].value = that.web3.fromWei(res.result[i].value, 'ether')
                  res.result[i].date = that.$$.timeChange({date: Number(res.result[i].timeStamp) * 1000, type:'yyyy-mm-dd hh:mm'})
                  that.historyData.push(res.result[i])
                } //if end
              } //for end
              j++
            } while (j < data.length)
          } else {
            that.historyData = data
          }
          // console.log(that.historyData)
        }
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
        }
      })
    },
    getDatabaseInfo () {
      const that = this
      $.ajax({
        url: that.$$.serverURL + '/lilo/lockInHistory',
        type: 'post',
        datatype: 'json',
        data: {to: that.walletAddress},
        success: function (res) {
          console.log(res)
          that.getHistory(res.info)
        }
      })
    }
  }
}
</script>
