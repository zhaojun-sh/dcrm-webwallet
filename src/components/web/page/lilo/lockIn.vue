<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" readonly v-model="privateKey" id="privateKeyShow" />
          <input type="hidden" readonly v-model="privateKey" id="privateKeyHide" />
        </div>
        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c" @click="qrcode(privateKey)"><div class="icon"><img src="../../../../assets/image/QRcode.svg"></div>Show QR code</button>
          <button class="btn cyan flex-c" @click="copyAddress('#privateKeyHide')"><div class="icon"><img src="../../../../assets/image/copy.svg"></div>Copy clipboard</button>
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
                <td><span v-html="item.status" :class="item.status=='failure'?'red':''"></span></td>
                <td><span v-html="item.coin"></span></td>
                <td><span v-html="item.amount"></span></td>
                <td><span v-html="item.date"></span></td>
                <td><span v-html="item.info" :title="item.info" class="ellipsis"></span></td>
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
export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      privateKey: '',
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
    that.historyData = [
      {
        status: 'failure',
        coin: 'FSN',
        amount: that.$$.thousandBit(500, 0),
        date: '2018/10/22/15:46',
        info: '0xfd02759fba7aa4ddb1a9e361d7ea6fa1e...'
      }, {
        status: 'success',
        coin: '',
        amount: '',
        date: '',
        info: ''
      }
    ]
    if (that.selectData) {
      that.dataInit(that.selectData)
    }
    if (location.href.indexOf('lockOut') === -1) {
      $('.transferBtn_btn').find('a:eq(0)').addClass('router-link-active')
    }
    // console.log(that.selectData)
  },
  methods: {
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
      console.log(qrcodeInit)
      $('#qrcodeBox').modal('show')
    },
    copyAddress (id) {
      $(id).select()
      document.execCommand('Copy')
      this.$$.layerMsg('Copy Success')
    },
    dataInit (data) {
      let that = this
      that.titleChange(data)
      that.peivateKeyChange(data)
    }
  }
}
</script>
