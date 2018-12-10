<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" readonly v-model="walletAdress" id="walletAdressHide" />
          <!-- <input type="text" v-model="walletAdress" id="walletAdressHide" class="inputOpacity"/> -->
        </div>
        <div class="receiveAddress_btn flex-c" id="receiveAddressBtn">
          <button class="btn blue flex-c" @click="qrcode(walletAdress)"><div class="icon"><img src="../../../../assets/image/QRcode.svg"></div>Show QR code</button>
          <button class="btn cyan flex-c" @click="copyAddress('walletAdressHide', 'receiveAddressBtn')" data-toggle="tooltip" data-placement="bottom" title="Copy clipboard">
            <div class="icon"><img src="../../../../assets/image/copy.svg"></div>
            Copy clipboard
          </button>
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
                <th>Status</th>
                <th>Coin</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Information</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyData" :key="item.index">
                <td><span v-html="item.status" :class="item.status !== 'success' ? 'red' : ''"></span></td>
                <td><span v-html="item.coin"></span></td>
                <td><span v-html="item.value"></span></td>
                <td><span v-html="item.date"></span></td>
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
import { setTimeout } from 'timers';
export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      walletAdress: '',
      privateKey: '',
      publicKey: '',
      historyData: []
    }
  },
  watch: {
    selectData (cur, old) {
      let that = this
      that.dataInit(cur)
    }
  },
  mounted () {
    let that = this
    that.privateKey = that.$store.state.privateKey
    that.publicKey = that.$store.state.publicKey
    that.walletAdress = that.$store.state.addressInfo
    // that.historyData = [
    //   {
    //     status: 'failure',
    //     coin: 'FSN',
    //     amount: that.$$.thousandBit(500, 0),
    //     date: '2018/10/22/15:46',
    //     info: '0xfd02759fba7aa4ddb1a9e361d7ea6fa1e...'
    //   }
    // ]
    that.getSendHistory()
    that.pageRefresh()
    $(function () {
      $("[data-toggle='tooltip']").tooltip()
    })
  },
  methods: {
    pageRefresh () {
      let that = this
      if (that.selectData) {
        that.dataInit(that.selectData)
      }
      if (location.href.indexOf('tranSend') === -1) {
        $('.transferBtn_btn').find('a:eq(0)').addClass('router-link-active')
      }
    },
    titleChange (bitType) {
      let that = this
      that.addressTitle = bitType + ' Receiving Address'
    },
    peivateKeyChange () {
      let that = this
      that.privateKey = '0x6D0340908aB751a343BaF7D05F52508190364ecb'
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
      // console.log(qrcodeInit)
      $('#qrcodeBox').modal('show')
    },
    copyAddress (id, textId) {
      let copyText = $('#' + textId).find('.tooltip-inner').text()
      document.getElementById(id).select()
      document.execCommand('Copy')
      $('#' + textId).find('.tooltip-inner').text('Copied')
      setTimeout(function () {
        $('#' + textId).find('.tooltip-inner').text(copyText)
      }, 3000)
      this.$$.layerMsg('Copy Success')
    },
    dataInit (data) {
      let that = this
      that.titleChange(data)
      that.peivateKeyChange(data)
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
    MoreContent (e) {
      const that = this
      $(e.target.parentNode).parents('tr').siblings('tr').find('.list').hide()
      $(e.target.parentNode).find('.list').toggle()
    },
    getSendHistory () {
      const that = this
      $.ajax({
        url: that.$$.serverURL + '/send/history',
        datatype: 'json',
        type: 'post',
        data: {
          to_address: that.walletAdress
        },
        success: function (res) {
          console.log(res)
          if (res.msg === 'success' && res.info.length > 0) {
            for (let i = 0; i < res.info.length; i++) {
              res.info[i].date = that.$$.timeChange({date: res.info[i].date, type:'yyyy-mm-dd hh:mm'})
              res.info[i].value = that.$$.thousandBit(res.info[i].value)
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
        that.historyData.push(txhax)
      }
      console.log(that.historyData)
      // console.log(statusData)
    },
  }
}
</script>
