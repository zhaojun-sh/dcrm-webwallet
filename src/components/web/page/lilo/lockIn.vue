<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input
            type="text"
            class="input-text input"
            v-model="coinAddress"
            readonly="readonly"
            id="walletAdressHide"
          />
          <!-- <input type="hidden" readonly v-model="privateKey" id="privateKeyHide" /> -->
        </div>
        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c" @click="qrcode(coinAddress)"><div class="icon"><img src="@/assets/image/QRcode.svg"></div>Show QR code</button>
          <button class="btn cyan flex-c" @click="copyAddress('#walletAdressHide')"><div class="icon"><img src="@/assets/image/copy.svg"></div>Copy clipboard</button>
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
                <th width="10%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyData" :key="item.index">
                <td><span v-html="item.statusFsn" :class="item.statusFsn !== 'Success' ? 'red' : ''"></span></td>
                <td><span v-html="selectData.coin"></span></td>
                <td><span v-html="item.value2"></span></td>
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
                  <button class="btn" v-if="item.statusFsn === 'New'" @click="privateSure({nonce:item.nonce, gasPrice: item.gasPrice, gas: item.gas, value: item.value2,hash: item.hash})">Lockin</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal fade bs-example-modal-md" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" id="qrcodeBox">
        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
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

    <div class="modal fade bs-example-modal-lg" id="privateSure" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" @click="modalClick">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">LockIn</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          </div>
          <div class="modal-body">
            <router-view @sendSignData="getSignData" :sendDataPage="dataPage"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2"
import Lilo from "@/assets/js/lilo"
export default {
  name: "receive",
  props: ["selectData"],
  data () {
    return {
      addressTitle: "",
      walletAddress: "",
      coinAddress: "",
      historyData: [],
      web3: "",
      dataPage: {},
      serializedTx: "",
      newWeb3: "",
      dcrmAddress: ""
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
    this.pageRefresh()
    this.walletAddress = this.$store.state.addressInfo
    if (this.selectData) {
      this.getInitData()
    }
  },
  methods: {
    getInitData () {
      this.titleChange(this.selectData.coin)
      this.setWeb3()
      this.dcrmAddress = this.coinAddress = this.selectData.address
      this.getDatabaseInfo()
    },
    modalClick () {
      $("#privateSure").on("hide.bs.modal", () => {
        this.$router.push("/LILO/lockIn")
      })
    },
    titleChange (bitType) {
      this.addressTitle = bitType + " Deposit Address"
    },
    setWeb3 () {
      this.$$.setWeb3(this)
      this.newWeb3 = new Lilo(this.$$.baseUrl)
    },
    getSignData (data) {
      if (data) {
        this.serializedTx = data
        this.sendAmoundInfo()
        $("#privateSure").modal("hide")
        $("#sendInfo").modal("show")
      } else {
        $("#privateSure").modal("hide")
        $("#sendInfo").modal("hide")
        this.$$.layerMsg({
          tip: "Sign error!",
          time: 3000,
          bgColor: "#ea4b40",
          icon: this.$$.promptSvg
        })
      }
    },
    sendAmoundInfo () {
      this.setWeb3()
      this.web3.eth.sendRawTransaction(this.serializedTx, (err, hash) => {
        if (!err) {
          this.$$.layerMsg({
            tip: "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use FSN Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： " + hash,
            time: 5000,
            bgColor: "#5dba5a",
            icon: this.$$.promptSvg
          })
          this.updateDatabaseInfo({
            hash: this.dataPage.hash,
            fsnhash: hash
          })
          this.$store.commit("storeWalletLoadFlag", true)
        } else {
          this.$$.layerMsg({
            tip: err,
            time: 4000,
            bgColor: "#ea4b40",
            icon: this.$$.promptSvg
          })
        }
      })
    },
    privateSure (data) {
      this.setWeb3()
      data.gasPrice = data.gasPrice ? data.gasPrice : this.web3.eth.gasPrice.toString(10)
      data.gas = data.gas ? data.gas : this.web3.eth.estimateGas({to: this.toAddress})
      let to_value
      if (this.selectData.coin === "BTC") {
        to_value = this.$$.toWei(data.value, "btc")
      } else {
        to_value = this.web3.toWei(data.value, "ether")
      }
      this.dataPage = {
        nonce: this.web3.eth.getTransactionCount(this.walletAddress),
        gasPrice: Number(data.gasPrice),//Number类型 
        gasLimit: Number(data.gas) * 6,
        from: this.walletAddress,
        to: "0x00000000000000000000000000000000000000dc",
        value: Number(0),//Number类型
        data: "LOCKIN:" + data.hash + ":" + to_value + ":" + this.selectData.coin,
        sendType: "LOCKIN",
        coin: this.selectData.coin,
        hash: data.hash
      }
      console.log(this.dataPage)
      this.$router.push("/pwdLockIn")
      $("#privateSure").modal("show")
    },
    MoreContent (e) {
      $(e.target.parentNode).parents("tr").siblings("tr").find(".list").hide()
      $(e.target.parentNode).find(".list").toggle()
    },
    qrcode (cont) {
      $("#qrcode").html("")
      let qrcodeInit = new QRCode("qrcode", {
        width: 300,
        height: 340, // 高度
        text: cont // 二维码内容
        // render: "canvas" // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: "#f0f"
        // foreground: "#ff0"
      })
      $("#qrcodeBox").modal("show")
    },
    copyAddress (id) {
      $(id).select()
      document.execCommand("Copy")
      this.$$.layerMsg("Copy Success")
    },
    pageRefresh () {
      if (this.selectData) {
        this.titleChange(this.selectData.coin)
      }
      if (location.href.indexOf("lockOut") === -1) {
        $(".transferBtn_btn").find("a:eq(0)").addClass("router-link-active")
      }
    },
    getHistory (data) {
      const that = this
      $.ajax({
        url: "https://api-rinkeby.etherscan.io/api?module=account&action=" + that.selectData.token + "&address=" + that.coinAddress,
        type: "post",
        datatype: "json",
        success: function (res) {
          if (res.result && res.result.length > 0 && (typeof res.result).toLowerCase() === "object") {
            res.result = res.result
          } else {
            res.result = []
          }
          that.delRepeat(data, res.result)
        }
      })
    },
    getStatus (txhax) {
      let statusFsn = ""
      if (txhax.fsnhash) {
        this.setWeb3()
        try {
          let receipt = this.web3.eth.getTransactionReceipt(txhax.fsnhash)
          if (receipt && receipt.status) {
            statusFsn = "Success"
          } else {
            statusFsn = "Failure"
          }
        } catch (error) {
          statusFsn = "Failure"
        }
      } else {
        if (txhax.hash) {
          statusFsn = "New"
        } else {
          statusFsn = "Failure"
        }
      }
      return statusFsn
    },
    delRepeat (data, urldata) {
      this.setWeb3()
      this.historyData = []
      let arrObj = []
      let newArr = []
      let objArr = {}
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          arrObj.push(data[i])
        }
      }
      if (urldata && urldata.length > 0 && (typeof urldata).toLowerCase() === "object") {
        for (let i = 0; i < urldata.length; i++) {
          if (this.selectData.coin === "ETH" && urldata[i].to.toLowerCase() === this.coinAddress.toLowerCase()) {
              arrObj.push(urldata[i])
          } else if (this.selectData.coin === "BTC"){
            arrObj.push(urldata[i])
          } else {
            if  (urldata[i].to.toLowerCase() === this.coinAddress.toLowerCase() && urldata[i].tokenSymbol === this.selectData.coin) {
              arrObj.push(urldata[i])
            }
          }
        }
      }
      for (let i = 0; i < arrObj.length; i++) {
        if (!objArr[arrObj[i].hash]) {
          newArr.push(arrObj[i])
          objArr[arrObj[i].hash] = true
        }
      }
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].statusFsn = this.getStatus(newArr[i])
        if (newArr[i].date) {
          newArr[i].date = this.$$.timeChange({date: newArr[i].date, type:"yyyy-mm-dd hh:mm"})
        } else if (newArr[i].timeStamp) {
          newArr[i].date = this.$$.timeChange({date: Number(newArr[i].timeStamp) * 1000, type:"yyyy-mm-dd hh:mm"})
          console.log(newArr[i].time)
        } else {
          newArr[i].date = this.$$.timeChange({date: newArr[i].time, type:"yyyy-mm-dd hh:mm"})
        }
        if (newArr[i].dataType !== "DATABASE") {
          newArr[i].coin = newArr[i].tokenSymbol ? newArr[i].tokenSymbol : this.selectData.coin
          this.createDatabaseInfo(newArr[i])
        }
        if (newArr[i].fsnhash) {
          newArr[i].hash = newArr[i].fsnhash
        } else {
          newArr[i].hash = newArr[i].hash.indexOf("0xx") === 0 ? newArr[i].fsnhash : newArr[i].hash
        }
        if (this.selectData.coin === "BTC") {
          newArr[i].value2 = this.$$.fromWei(newArr[i].value, "btc")
        } else {
          newArr[i].value2 = this.web3.fromWei(newArr[i].value, "ether")
        }
        this.historyData.push(newArr[i])
      }
      let compare = function compare (property) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (Date.parse(value1) > Date.parse(value2)) {
            return -1
          } else if (value1 < value2) {
            return 1
          } else {
            return 0
          }
        }
      }
      this.historyData.sort(compare("date"))
    },
    getBTChistory (data) {
      const that = this
      $.ajax({
        type: "GET",
        url: "https://api.blockcypher.com/v1/btc/test3/addrs/" + that.coinAddress,
        dataType: "json",
        success: function(res){
          let result = []
          if (res && res.txrefs && res.txrefs.length > 0) {
            for (let i = 0; i < res.txrefs.length; i++) {
              result.push({
                to: res.address,
                value: res.txrefs[i].value,
                hash: res.txrefs[i].tx_hash,
                time: res.txrefs[i].confirmed
              })
            }
          }
          that.delRepeat(data, result)
        },
        error: function (e) {
        }
      })
    },
    createDatabaseInfo (data) {
      $.ajax({
        url: this.$$.serverURL + "/lilo/create",
        type: "post",
        datatype: "json",
        data: data,
        success: function (res) {
        }
      })
    },
    getDatabaseInfo () {
      const that = this
      if (!that.coinAddress) {
        return
      }
      $.ajax({
        url: that.$$.serverURL + "/lilo/lockInHistory",
        type: "post",
        datatype: "json",
        data: {to: that.coinAddress},
        success: function (res) {
          for (let i = 0; i < res.info.length; i++) {
            if (res.info[i].hash === "" || res.info[i].hash === undefined) {
              res.info[i].hash = "0xx" + i
            }
            res.info[i].dataType = "DATABASE"
          }
          if (that.selectData.coin === "BTC") {
            that.getBTChistory(res.info)
          } else {
            that.getHistory(res.info)
          }
        },
        error: function (res) {
          that.getHistory([])
        }
      })
    },
    updateDatabaseInfo (data) {
      const that = this
      $.ajax({
        url: that.$$.serverURL + "/lilo/lockInChangeState",
        type: "post",
        datatype: "json",
        data: {hash: data.hash, fsnhash: data.fsnhash, statusFsn: "Success"},
        success: function (res) {
          that.getDatabaseInfo()
        },
        error: function (res) {
        }
      })
    }
  }
}
</script>
