<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" readonly v-model="privateKey" id="privateKeyShow" />
        </div>

        <h3 class="mt-20">Amount:</h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text amount" v-model="sendAmound" id="amountShow" @change="changeAmount" />
          <label v-html="selectData" class="currency"></label>
        </div>

        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c W240 mt-10">Send</button>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      privateKey: '',
      historyData: [],
      sendAmound: ''
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
    // that.selectData = ''
    that.sendAmound = that.$$.thousandBit('20000')
    if (that.selectData) {
      that.dataInit(that.selectData)
    }
    if (location.href.indexOf('lockOut') !== -1) {
      $('.transferBtn_btn').find('a:eq(0)').removeClass('router-link-active')
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
    dataInit (data) {
      let that = this
      that.titleChange(data)
      that.peivateKeyChange(data)
    },
    changeAmount (data) {
      let that = this
      that.sendAmound = that.$$.thousandChange(that.sendAmound)
    }
  }
}
</script>
