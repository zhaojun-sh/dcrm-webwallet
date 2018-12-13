<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" readonly v-model="walletAddress" />
        </div>

        <h3 class="mt-20">Amount:</h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text amount" v-model="sendAmound" id="amountShow" @change="changeAmount" />
          <label v-html="selectData.name" class="currency"></label>
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
                <td><span v-html="item.status" :class="item.status=='failure'?'red':''"></span></td>
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
                <!-- <td>
                  <button class="btn btn-primary">Lockin</button>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from '../../../../assets/js/lilo'
export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      walletAddress: '',
      historyData: [],
      sendAmound: ''
    }
  },
  watch: {
    selectData (cur, old) {
      let that = this
      that.titleChange(cur.name)
      that.web3 = new Web3(cur.value)
    }
  },
  mounted () {
    let that = this
    that.pageRefresh()
    that.walletAddress = that.$store.state.addressInfo
    that.web3 = new Web3(that.selectData.value)
    that.getDatabaseInfo()
    that.sendAmound = that.$$.thousandBit('20000')
    // console.log(that.selectData)
  },
  methods: {
    titleChange (bitType) {
      let that = this
      that.addressTitle = bitType + ' Receiving Address'
    },
    changeAmount (data) {
      let that = this
      that.sendAmound = that.$$.thousandChange(that.sendAmound)
    },
    MoreContent (e) {
      const that = this
      $(e.target.parentNode).parents('tr').siblings('tr').find('.list').hide()
      $(e.target.parentNode).find('.list').toggle()
    },
    pageRefresh () {
      const that = this
      if (that.selectData) {
        that.titleChange(that.selectData.name)
      }
      if (location.href.indexOf('lockOut') !== -1) {
        $('.transferBtn_btn').find('a:eq(0)').removeClass('router-link-active')
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
                  if (data.length > 0 && data[j].hash === res.result[i].hash) {
                    if (data[j].fsnhash) {
                      res.result[i].statusFsn = 'success'
                    } else {
                      res.result[i].statusFsn = 'penging'
                    }
                  } else {
                    that.createDatabaseInfo(res.result[i])
                    res.result[i].statusFsn = 'penging'
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
          console.log(that.historyData)
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
        url: that.$$.serverURL + '/lilo/lockOutHistory',
        type: 'post',
        datatype: 'json',
        data: {from: that.walletAddress},
        success: function (res) {
          console.log(res)
          that.getHistory(res.info)
        }
      })
    }
  }
}
</script>
