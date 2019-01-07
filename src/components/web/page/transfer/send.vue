<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" v-model="toAddress">
        </div>

        <h3 class="mt-20">Amount:</h3>
        <div class="receiveAddress_pwd">
          <input
            type="text"
            class="input-text amount keyPressBtn"
            v-model="sendAmound"
            id="amountShow"
          >
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
        <div class="tableHistory_table table-responsive">
          <table class="table table-bordered table-hover table-striped">
            <thead>
              <tr>
                <th width="5%">Status</th>
                <th width="5%">Coin</th>
                <th width="20%">Amount</th>
                <th width="30%">Date</th>
                <th width="40%">Information</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyData" :key="item.index">
                <td>
                  <span v-html="item.status" :class="item.status !== 'success' ? 'red' : ''"></span>
                </td>
                <td>
                  <span v-html="item.coin"></span>
                </td>
                <td>
                  <span v-html="item.value" class="nowrap"></span>
                </td>
                <td>
                  <span v-html="item.date" class="nowrap"></span>
                </td>
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

    <div
      class="modal fade bs-example-modal-lg"
      id="privateSure"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
      data-keyboard="false"
      aria-labelledby="myModalLabel"
      @click="modalClick"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">Send Ether & Tokens</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <router-view @sendSignData="getSignData" :sendDataPage="dataPage"></router-view>
          </div>
          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>-->
        </div>
      </div>
    </div>

    <div
      class="modal fade bs-example-modal-lg"
      id="sendInfo"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
      data-keyboard="false"
      aria-labelledby="myModalLabel"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">You are about to send...</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
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
            <button
              type="button"
              class="btn btn-default"
              data-dismiss="modal"
            >No, get me out of here!</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="sendAmoundInfo"
            >Yes, I am sure! Make transaction.</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// let Web3 = require('web3')
import Lilo from "@/assets/js/lilo";
export default {
  name: "receive",
  props: ["selectData"],
  data() {
    return {
      addressTitle: "",
      coinAddress: "",
      toAddress: "",
      historyData: [],
      walletAddress: "",
      sendAmound: "",
      web3: "",
      newWeb3: "",
      gasPriceNum: "",
      gasLimitNum: "",
      balanceNum: "",
      nonceNum: "",
      dataPage: "",
      serializedTx: "",
      maxFee: "",
      netWorkInfo: "",
      refreshHistory: null
    };
  },
  watch: {
    selectData(cur, old) {
      this.getInitData();
    }
  },
  mounted() {
    this.walletAddress = this.$store.state.addressInfo;
    this.pageRefresh();
    this.getInitData();
    this.sendAmound = this.$$.thousandBit("0", 2);
    this.refreshHistory = setInterval(() => {
      this.getSendHistory();
    }, 20000);
    $(".keyPressBtn").keypress(e => {
      if (e.which === 13) {
        this.privateSure();
      }
    });
  },
  methods: {
    getInitData() {
      this.coinAddress = this.selectData.address;
      this.titleChange(this.selectData.coin);
      this.getSendHistory();
    },
    modalClick() {
      $("#privateSure").on("hide.bs.modal", () => {
        // alert('模态框关闭了');
        // history.go(-1)
        this.$router.push("/Transfer/tranSend");
      });
    },
    privateSure() {
      if (!this.toAddress) {
        this.$$.layerMsg({
          tip: this.selectData.coin + " Send Address is not null.",
          time: 2000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      if (this.toAddress.toLowerCase() === this.walletAddress.toLowerCase()) {
        this.$$.layerMsg({
          tip: "You can`t transfer money to yourself.",
          time: 5000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      if (
        this.selectData.coin !== "BTC" &&
        this.toAddress.indexOf("0x") !== 0
      ) {
        this.$$.layerMsg({
          tip: "The address needs to start with 0x",
          time: 5000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      let getAmountTip = this.$$.limitCoin(
        this.sendAmound,
        this.selectData.limit,
        this.selectData.number
      );
      if (getAmountTip.flag) {
        this.$$.layerMsg({
          tip: getAmountTip.msg,
          time: 3000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      this.setBaseSendData();
      let to_value = this.web3.toWei(this.sendAmound, "ether");
      this.dataPage = {
        nonce: this.nonceNum,
        gasPrice: Number(this.gasPriceNum), //Number类型
        gasLimit: Number(this.gasLimitNum),
        from: this.walletAddress,
        to: this.toAddress,
        value: Number(to_value), //Number类型,
        url: this.$$.baseUrl,
        coin: this.selectData.coin
      };
      if (this.selectData.coin !== "FSN") {
        this.dataPage.data =
          "TRANSACTION:" +
          this.toAddress +
          ":" +
          to_value +
          ":" +
          this.selectData.coin;
        this.dataPage.sendType = "SENDDCRM";
        this.dataPage.to = "0x00000000000000000000000000000000000000dc";
        this.dataPage.value = "0";
      }
      console.log(this.dataPage);
      this.$router.push("/pwdSend");
      $("#privateSure").modal("show");
    },
    getSignData(data) {
      if (data) {
        this.serializedTx = data;
        $("#privateSure").modal("hide");
        $("#sendInfo").modal("show");
      } else {
        $("#privateSure").modal("hide");
        $("#sendInfo").modal("hide");
        this.$$.layerMsg({
          tip: "Sign error!",
          time: 3000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
      }
      // console.log(data)
    },
    titleChange(bitType) {
      this.addressTitle = bitType + " Send Address";
    },
    MoreContent(e) {
      $(e.target.parentNode)
        .parents("tr")
        .siblings("tr")
        .find(".list")
        .hide();
      $(e.target.parentNode)
        .find(".list")
        .toggle();
    },
    pageRefresh() {
      if (location.href.indexOf("tranSend") !== -1) {
        $(".transferBtn_btn")
          .find("a:eq(0)")
          .removeClass("router-link-active");
      }
    },
    changeAmount() {
      this.sendAmound = this.$$.thousandChange(this.sendAmound, 18);
    },
    setWeb3() {
      this.$$.setWeb3(this);
      // let Web3 = require('web3')
      // let web3
      // try {
      //   web3 = new Web3(new Web3.providers.HttpProvider(this.$$.baseUrl))
      // } catch (error) {
      //   web3 = new Web3()
      //   console.log(error)
      // }
      // console.log(this.selectData.url)
      // if (typeof web3 !== 'undefined') {
      //   // Web3 = new Web3(Web3.currentProvider)
      //   web3 = new Web3(new Web3.providers.HttpProvider(this.$$.baseUrl))
      // } else {
      //   Web3 = new Web3(new Web3.providers.HttpProvider(this.selectData.url))
      // }
      // this.web3 = web3
      this.newWeb3 = new Lilo(this.$$.baseUrl);
    },
    setBaseSendData() {
      this.setWeb3();
      // console.log(this.coinAddress)

      let to_value = this.web3.toWei(this.sendAmound, "ether");
      let getGasLimit;
      try {
        getGasLimit = this.web3.eth.estimateGas({ to: this.toAddress });
      } catch (error) {
        try {
          getGasLimit = this.$$.getWeb3({
            method: "eth_estimateGas",
            params: [{ to: this.toAddress }]
          });
          if (getGasLimit.error) {
            getGasLimit = "Error";
          } else {
            getGasLimit = getGasLimit.result;
          }
        } catch (error) {
          getGasLimit = error;
        }
        // throw error
      }
      // console.log(getGasLimit)
      if (getGasLimit && getGasLimit.toString().indexOf("Error") !== -1) {
        this.$$.layerMsg({
          tip: getGasLimit,
          time: 4000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        throw getGasLimit;
      }

      try {
        this.nonceNum = this.web3.eth.getTransactionCount(
          this.walletAddress,
          "pending"
        );
      } catch (error) {
        this.nonceNum = this.$$.getWeb3({
          method: "eth_getTransactionCount",
          params: [this.walletAddress, "pending"]
        }).result;
      }

      try {
        this.gasPriceNum = this.web3.eth.gasPrice.toString(10);
      } catch (error) {
        this.gasPriceNum = this.$$.getWeb3({
          method: "eth_gasPrice",
          params: []
        }).result.toString(10);
      }

      this.gasLimitNum = getGasLimit * 6;
      if (this.selectData.coin === "FSN") {
        try {
          this.balanceNum = this.web3.fromWei(
            this.web3.eth.getBalance(this.coinAddress),
            "ether"
          );
          console.log(this.balanceNum);
        } catch (error) {
          this.balanceNum = this.$$.getWeb3({
            method: "eth_getBalance",
            params: [this.coinAddress, "latest"]
          }).result;
          this.balanceNum = this.web3.fromWei(this.balanceNum, "ether");
        }
      } else {
        this.newWeb3.lilo
          .dcrmGetBalance(this.$store.state.addressInfo, this.selectData.coin)
          .then(res => {
            this.balanceNum = this.web3.fromWei(res, "ether");
            console.log(this.balanceNum);
          });
      }
      this.maxFee = this.web3.fromWei(
        Number(this.gasLimitNum) * Number(this.gasPriceNum),
        "ether"
      );
      try {
        this.netWorkInfo = this.web3.version.node;
      } catch (error) {
        this.netWorkInfo = this.$$.getWeb3({
          method: "web3_clientVersion",
          params: []
        }).result;
      }
      // console.log(this.balanceNum)
    },
    sendAmoundInfo() {
      this.setWeb3();
      let dataBase = {
        value: Number(this.$$.thousandToNum(this.sendAmound)),
        coin: this.selectData.coin,
        to_address: this.toAddress,
        from_address: this.walletAddress,
        date: new Date(),
        txhax: "",
        status: ""
      };
      try {
        this.web3.eth.sendRawTransaction(this.serializedTx, (err, hash) => {
          if (!err) {
            dataBase.txhax = hash;
            dataBase.status = "success";
            $("#sendInfo").modal("hide");
            this.$$.layerMsg({
              tip:
                "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use FSN Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： " +
                hash,
              time: 5000,
              bgColor: "#5dba5a",
              icon: require("@/assets/image/Prompt.svg")
            });
            this.$store.commit("storeWalletLoadFlag", true);
          } else {
            console.log(err);
            dataBase.txhax = "";
            dataBase.status = "failure";
            this.$$.layerMsg({
              tip: err,
              time: 4000,
              bgColor: "#ea4b40",
              icon: require("@/assets/image/Prompt.svg")
            });
          }
          this.sendDatabase(dataBase);
        });
      } catch (error) {
        this.$$.web3({
          method: "eth_sendRawTransaction",
          params: [this.serializedTx]
        }).then(res => {
          if (res.error) {
            this.$$.layerMsg({
              tip: res.error,
              time: 4000,
              bgColor: "#ea4b40",
              icon: require("@/assets/image/Prompt.svg")
            });
          } else {
            dataBase.txhax = res.result;
            dataBase.status = "success";
            $("#sendInfo").modal("hide");
            this.$$.layerMsg({
              tip:
                "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use FSN Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： " +
                res.result,
              time: 5000,
              bgColor: "#5dba5a",
              icon: require("@/assets/image/Prompt.svg")
            });
            this.$store.commit("storeWalletLoadFlag", true);
          }
          this.sendDatabase(dataBase);
        });
      }
    },
    sendDatabase(data) {
      $.ajax({
        url: this.$$.serverURL + "/transfer/create",
        datatype: "json",
        type: "post",
        data: {
          value: data.value,
          coin: data.coin,
          to_address: data.to_address,
          from_address: data.from_address,
          date: data.date,
          txhax: data.txhax,
          status: data.status
        },
        success: res => {
          console.log(res);
          if (res.msg === "success") {
            this.getSendHistory();
          }
        }
      });
    },
    getSendHistory() {
      if (!this.walletAddress || !this.selectData.coin) {
        return;
      }
      $.ajax({
        url: this.$$.serverURL + "/transfer/history",
        datatype: "json",
        type: "post",
        data: {
          from_address: this.walletAddress,
          coin: this.selectData.coin
        },
        success: res => {
          // console.log(res)
          this.historyData = [];
          if (res.msg === "success" && res.info.length > 0) {
            for (let i = 0; i < res.info.length; i++) {
              res.info[i].date = this.$$.timeChange({
                date: res.info[i].date,
                type: "yyyy-mm-dd hh:mm"
              });
              res.info[i].value = this.$$.thousandBit(res.info[i].value, "no");
              // res.info[i].value = res.info[i].value
              if (res.info[i].txhax) {
                res.info[i].status = "success";
              } else {
                res.info[i].status = "failure";
              }
              // res.info[i].value = this.$$.thousandBit(res.info[i].value)
              // this.getStatus(res.info[i])
            }
            this.historyData = res.info;
          } else {
          }
        },
        error: res => {
          console.log(res);
        }
      });
    }
    /**
     * this.getStatus()方法暂不使用
     * 后期会使用
     */
    // getStatus (txhax) {
    //   const this = this
    //   this.setWeb3()
    //   this.web3.eth.getTransactionReceipt(txhax.txhax, (err, res) => {
    //     if (err) {
    //       // console.log(err)
    //       txhax.status = 'failure'
    //       this.historyData.push(txhax)
    //     } else {
    //       if (res && res.status) {
    //         txhax.status = 'success'
    //         this.historyData.push(txhax)
    //       } else {
    //         txhax.status = 'pending'
    //         this.historyData.push(txhax)
    //       }
    //     }
    //   })
    // },
  },
  beforeDestroy() {
    clearInterval(this.refreshHistory);
    this.refreshHistory = null;
  }
};
</script>
