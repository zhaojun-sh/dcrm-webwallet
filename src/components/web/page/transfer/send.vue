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
      const that = this;
      that.getInitData();
    }
  },
  mounted() {
    const that = this;
    that.walletAddress = that.$store.state.addressInfo;
    that.pageRefresh();
    that.getInitData();
    that.sendAmound = that.$$.thousandBit("0", 2);
    that.refreshHistory = setInterval(() => {
      that.getSendHistory();
    }, 20000);
    $(".keyPressBtn").keypress(function(e) {
      if (e.which === 13) {
        that.privateSure();
      }
    });
  },
  methods: {
    getInitData() {
      const that = this;
      that.coinAddress = that.selectData.address;
      that.titleChange(that.selectData.coin);
      that.getSendHistory();
    },
    modalClick() {
      const that = this;
      $("#privateSure").on("hide.bs.modal", function() {
        // alert('模态框关闭了');
        // history.go(-1)
        that.$router.push("/Transfer/tranSend");
      });
    },
    privateSure() {
      const that = this;
      if (!that.toAddress) {
        that.$$.layerMsg({
          tip: that.selectData.coin + " Send Address is not null.",
          time: 2000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      if (that.toAddress.toLowerCase() === that.walletAddress.toLowerCase()) {
        that.$$.layerMsg({
          tip: "You can`t transfer money to yourself.",
          time: 5000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      if (
        that.selectData.coin !== "BTC" &&
        that.toAddress.indexOf("0x") !== 0
      ) {
        that.$$.layerMsg({
          tip: "The address needs to start with 0x",
          time: 5000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      let getAmountTip = that.$$.limitCoin(
        that.sendAmound,
        that.selectData.limit,
        that.selectData.number
      );
      if (getAmountTip.flag) {
        that.$$.layerMsg({
          tip: getAmountTip.msg,
          time: 3000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        return;
      }
      that.setBaseSendData();
      let to_value = that.web3.toWei(that.sendAmound, "ether");
      that.dataPage = {
        nonce: that.nonceNum,
        gasPrice: Number(that.gasPriceNum), //Number类型
        gasLimit: Number(that.gasLimitNum),
        from: that.walletAddress,
        to: that.toAddress,
        value: Number(to_value), //Number类型,
        url: that.$$.baseUrl,
        coin: that.selectData.coin
      };
      if (that.selectData.coin !== "FSN") {
        that.dataPage.data =
          "TRANSACTION:" +
          that.toAddress +
          ":" +
          to_value +
          ":" +
          that.selectData.coin;
        that.dataPage.sendType = "SENDDCRM";
        that.dataPage.to = "0x00000000000000000000000000000000000000dc";
        that.dataPage.value = "0";
      }
      console.log(that.dataPage);
      that.$router.push("/pwdSend");
      $("#privateSure").modal("show");
    },
    getSignData(data) {
      const that = this;
      if (data) {
        that.serializedTx = data;
        $("#privateSure").modal("hide");
        $("#sendInfo").modal("show");
      } else {
        $("#privateSure").modal("hide");
        $("#sendInfo").modal("hide");
        that.$$.layerMsg({
          tip: "Sign error!",
          time: 3000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
      }
      // console.log(data)
    },
    titleChange(bitType) {
      const that = this;
      that.addressTitle = bitType + " Send Address";
    },
    MoreContent(e) {
      const that = this;
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
      const that = this;
      if (location.href.indexOf("tranSend") !== -1) {
        $(".transferBtn_btn")
          .find("a:eq(0)")
          .removeClass("router-link-active");
      }
    },
    changeAmount() {
      const that = this;
      that.sendAmound = that.$$.thousandChange(that.sendAmound, 18);
    },
    setWeb3() {
      const that = this;
      that.$$.setWeb3(that);
      // let Web3 = require('web3')
      // let web3
      // try {
      //   web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      // } catch (error) {
      //   web3 = new Web3()
      //   console.log(error)
      // }
      // console.log(that.selectData.url)
      // if (typeof web3 !== 'undefined') {
      //   // Web3 = new Web3(Web3.currentProvider)
      //   web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      // } else {
      //   Web3 = new Web3(new Web3.providers.HttpProvider(that.selectData.url))
      // }
      // that.web3 = web3
      that.newWeb3 = new Lilo(that.$$.baseUrl);
    },
    setBaseSendData() {
      const that = this;
      that.setWeb3();
      // console.log(that.coinAddress)

      let to_value = that.web3.toWei(that.sendAmound, "ether");
      let getGasLimit;
      try {
        getGasLimit = that.web3.eth.estimateGas({ to: that.toAddress });
      } catch (error) {
        try {
          getGasLimit = that.$$.getWeb3({
            method: "eth_estimateGas",
            params: [{ to: that.toAddress }]
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
        that.$$.layerMsg({
          tip: getGasLimit,
          time: 4000,
          bgColor: "#ea4b40",
          icon: require("@/assets/image/Prompt.svg")
        });
        throw getGasLimit;
      }

      try {
        that.nonceNum = that.web3.eth.getTransactionCount(
          that.walletAddress,
          "pending"
        );
      } catch (error) {
        that.nonceNum = that.$$.getWeb3({
          method: "eth_getTransactionCount",
          params: [that.walletAddress, "pending"]
        }).result;
      }

      try {
        that.gasPriceNum = that.web3.eth.gasPrice.toString(10);
      } catch (error) {
        that.gasPriceNum = that.$$.getWeb3({
          method: "eth_gasPrice",
          params: []
        }).result.toString(10);
      }

      that.gasLimitNum = getGasLimit * 6;
      if (that.selectData.coin === "FSN") {
        try {
          that.balanceNum = that.web3.fromWei(
            that.web3.eth.getBalance(that.coinAddress),
            "ether"
          );
          console.log(that.balanceNum);
        } catch (error) {
          that.balanceNum = that.$$.getWeb3({
            method: "eth_getBalance",
            params: [that.coinAddress, "latest"]
          }).result;
          that.balanceNum = that.web3.fromWei(that.balanceNum, "ether");
        }
      } else {
        that.newWeb3.lilo
          .dcrmGetBalance(that.$store.state.addressInfo, that.selectData.coin)
          .then(function(res) {
            that.balanceNum = that.web3.fromWei(res, "ether");
            console.log(that.balanceNum);
          });
      }
      that.maxFee = that.web3.fromWei(
        Number(that.gasLimitNum) * Number(that.gasPriceNum),
        "ether"
      );
      try {
        that.netWorkInfo = that.web3.version.node;
      } catch (error) {
        that.netWorkInfo = that.$$.getWeb3({
          method: "web3_clientVersion",
          params: []
        }).result;
      }
      // console.log(that.balanceNum)
    },
    sendAmoundInfo() {
      const that = this;
      that.setWeb3();
      let dataBase = {
        value: Number(that.$$.thousandToNum(that.sendAmound)),
        coin: that.selectData.coin,
        to_address: that.toAddress,
        from_address: that.walletAddress,
        date: new Date(),
        txhax: "",
        status: ""
      };
      try {
        that.web3.eth.sendRawTransaction(that.serializedTx, function(
          err,
          hash
        ) {
          if (!err) {
            dataBase.txhax = hash;
            dataBase.status = "success";
            $("#sendInfo").modal("hide");
            that.$$.layerMsg({
              tip:
                "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use FSN Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： " +
                hash,
              time: 5000,
              bgColor: "#5dba5a",
              icon: require("@/assets/image/Prompt.svg")
            });
            that.$store.commit("storeWalletLoadFlag", true);
          } else {
            console.log(err);
            dataBase.txhax = "";
            dataBase.status = "failure";
            that.$$.layerMsg({
              tip: err,
              time: 4000,
              bgColor: "#ea4b40",
              icon: require("@/assets/image/Prompt.svg")
            });
          }
          that.sendDatabase(dataBase);
        });
      } catch (error) {
        that.$$.web3({
          method: "eth_sendRawTransaction",
          params: [that.serializedTx]
        }).then(function(res) {
          if (res.error) {
            that.$$.layerMsg({
              tip: res.error,
              time: 4000,
              bgColor: "#ea4b40",
              icon: require("@/assets/image/Prompt.svg")
            });
          } else {
            dataBase.txhax = res.result;
            dataBase.status = "success";
            $("#sendInfo").modal("hide");
            that.$$.layerMsg({
              tip:
                "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use FSN Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： " +
                res.result,
              time: 5000,
              bgColor: "#5dba5a",
              icon: require("@/assets/image/Prompt.svg")
            });
            that.$store.commit("storeWalletLoadFlag", true);
          }
          that.sendDatabase(dataBase);
        });
      }
    },
    sendDatabase(data) {
      const that = this;
      $.ajax({
        url: that.$$.serverURL + "/transfer/create",
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
        success: function(res) {
          console.log(res);
          if (res.msg === "success") {
            that.getSendHistory();
          }
        }
      });
    },
    getSendHistory() {
      const that = this;
      if (!that.walletAddress || !that.selectData.coin) {
        return;
      }
      $.ajax({
        url: that.$$.serverURL + "/transfer/history",
        datatype: "json",
        type: "post",
        data: {
          from_address: that.walletAddress,
          coin: that.selectData.coin
        },
        success: function(res) {
          // console.log(res)
          that.historyData = [];
          if (res.msg === "success" && res.info.length > 0) {
            for (let i = 0; i < res.info.length; i++) {
              res.info[i].date = that.$$.timeChange({
                date: res.info[i].date,
                type: "yyyy-mm-dd hh:mm"
              });
              res.info[i].value = that.$$.thousandBit(res.info[i].value, "no");
              // res.info[i].value = res.info[i].value
              if (res.info[i].txhax) {
                res.info[i].status = "success";
              } else {
                res.info[i].status = "failure";
              }
              // res.info[i].value = that.$$.thousandBit(res.info[i].value)
              // that.getStatus(res.info[i])
            }
            that.historyData = res.info;
          } else {
          }
        },
        error: function(res) {
          console.log(res);
        }
      });
    }
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
  beforeDestroy() {
    const that = this;
    clearInterval(that.refreshHistory);
    that.refreshHistory = null;
  }
};
</script>
