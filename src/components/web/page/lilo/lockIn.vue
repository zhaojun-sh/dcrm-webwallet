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
          >
          <!-- <input type="hidden" readonly v-model="privateKey" id="privateKeyHide" /> -->
        </div>
        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c" @click="qrcode(coinAddress)">
            <div class="icon">
              <img src="@/assets/image/QRcode.svg">
            </div>Show QR code
          </button>
          <button class="btn cyan flex-c" @click="copyAddress('#walletAdressHide')">
            <div class="icon">
              <img src="@/assets/image/copy.svg">
            </div>Copy clipboard
          </button>
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
                <th width>Information</th>
                <th width="10%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historyData" :key="item.index">
                <td>
                  <span v-html="item.statusFsn" :class="item.statusFsn=='New'?'red':''"></span>
                </td>
                <td>
                  <span v-html="selectData.coin"></span>
                </td>
                <td>
                  <span v-html="item.value2"></span>
                </td>
                <td>
                  <span v-html="item.date"></span>
                </td>
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
                  <button
                    class="btn"
                    v-if="item.statusFsn === 'New'"
                    @click="privateSure({nonce:item.nonce, gasPrice: item.gasPrice, gas: item.gas, value: item.value2,hash: item.hash})"
                  >Lockin</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="modal fade bs-example-modal-md"
        tabindex="-1"
        role="dialog"
        aria-labelledby="mySmallModalLabel"
        id="qrcodeBox"
      >
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
            <h4 class="modal-title" id="myModalLabel">LockIn</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <router-view @sendSignData="getSignData" :sendDataPage="dataPage"></router-view>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="modal fade bs-example-modal-lg" id="sendInfo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="myModalLabel">You are about to send...</h4>
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
                  <span>{{Number(balanceNum)}} {{selectData}}</span>
                </li>
                <li>
                  <h3>Coin:</h3>
                  <span>{{selectData}}</span>
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
                  <span>(none)</span>
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
    </div>-->
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import Lilo from "@/assets/js/lilo";

const PromptSvg = require("@/assets/image/Prompt.svg");

export default {
  name: "receive",
  props: ["selectData"],
  data() {
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
    };
  },
  watch: {
    selectData(cur, old) {
      if (cur.coin !== old.coin) {
        this.getInitData();
      }
    }
  },
  mounted() {
    this.pageRefresh();
    this.walletAddress = this.$store.state.addressInfo;
    // $('#selectValData').change(event => {
    //   $(event.currentTarget).getInitData()
    // })
    // $('#selectValData').change()
    // this.getInitData()
    if (this.selectData) {
      this.getInitData();
    }
  },
  methods: {
    getInitData() {
      // console.log(this.selectData)
      this.titleChange(this.selectData.coin);
      this.setWeb3();
      this.dcrmAddress = this.coinAddress = this.selectData.address;
      this.getDatabaseInfo();
    },
    modalClick() {
      $("#privateSure").on("hide.bs.modal", () => {
        this.$router.push("/LILO/lockIn");
      });
    },
    titleChange(bitType) {
      this.addressTitle = bitType + " Deposit Address";
    },
    setWeb3() {
      this.$$.setWeb3(this);
      // let Web3 = require('web3')
      // let web3 = new Web3()
      // // console.log(this.selectData.url)
      // if (typeof web3 !== 'undefined') {
      //   // Web3 = new Web3(Web3.currentProvider)
      //   web3 = new Web3(new Web3.providers.HttpProvider(this.$$.baseUrl))
      // } else {
      //   web3 = new Web3(new Web3.providers.HttpProvider(this.selectData.url))
      // }
      // this.web3 = web3
      // console.log(this.$$.baseUrl)
      this.newWeb3 = new Lilo(this.$$.baseUrl);
    },
    getSignData(data) {
      if (data) {
        this.serializedTx = data;
        this.sendAmoundInfo();
        $("#privateSure").modal("hide");
        $("#sendInfo").modal("show");
      } else {
        $("#privateSure").modal("hide");
        $("#sendInfo").modal("hide");
        this.$$.layerMsg({
          tip: "Sign error!",
          time: 3000,
          bgColor: "#ea4b40",
          icon: PromptSvg
        });
      }
    },
    sendAmoundInfo() {
      this.setWeb3();
      try {
        this.web3.eth.sendRawTransaction(this.serializedTx, (err, hash) => {
          if (!err) {
            this.$$.layerMsg({
              tip:
                "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use FSN Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： " +
                hash,
              time: 5000,
              bgColor: "#5dba5a",
              icon: PromptSvg
            });
            this.updateDatabaseInfo({
              hash: this.dataPage.hash,
              fsnhash: hash
            });
            this.$store.commit("storeWalletLoadFlag", true);
          } else {
            this.$$.layerMsg({
              tip: err,
              time: 4000,
              bgColor: "#ea4b40",
              icon: PromptSvg
            });
          }
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
              icon: PromptSvg
            });
          } else {
            this.updateDatabaseInfo({
              hash: this.dataPage.hash,
              fsnhash: hash
            });
            this.$$.layerMsg({
              tip:
                "Your TX has been broadcast to the network. This does not mean it has been mined & sent. During times of extreme volume, it may take 3+ hours to send. 1) Check your TX below. 2) If it is pending for hours or disappears, use the Check TX Status Page to replace. 3) Use FSN Gas Station to see what gas price is optimal. 4) Save your TX Hash in case you need it later： " +
                res.result,
              time: 5000,
              bgColor: "#5dba5a",
              icon: PromptSvg
            });
            this.$store.commit("storeWalletLoadFlag", true);
          }
        });
      }
    },
    privateSure(data) {
      // this.setBaseSendData()
      this.setWeb3();
      // console.log(this.web3.eth.getTransactionCount(this.walletAddress))
      this.dataPage = {
        nonce: this.web3.eth.getTransactionCount(this.walletAddress),
        gasPrice: Number(data.gasPrice), //Number类型
        gasLimit: Number(data.gas) * 6,
        from: this.walletAddress,
        to: "0x00000000000000000000000000000000000000dc",
        // value: Number(this.web3.toWei(data.value, 'ether')),//Number类型
        value: Number(0), //Number类型
        data:
          "LOCKIN:" +
          data.hash +
          ":" +
          this.web3.toWei(data.value, "ether") +
          ":" +
          this.selectData.coin,
        sendType: "LOCKIN",
        coin: this.selectData.coin,
        hash: data.hash
      };
      console.log(this.dataPage);
      this.$router.push("/pwdLockIn");
      $("#privateSure").modal("show");
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
    qrcode(cont) {
      $("#qrcode").html("");
      let qrcodeInit = new QRCode("qrcode", {
        width: 300,
        height: 340, // 高度
        text: cont // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      });
      $("#qrcodeBox").modal("show");
    },
    copyAddress(id) {
      $(id).select();
      document.execCommand("Copy");
      this.$$.layerMsg("Copy Success");
    },
    pageRefresh() {
      if (this.selectData) {
        this.titleChange(this.selectData.coin);
      }
      if (location.href.indexOf("lockOut") === -1) {
        $(".transferBtn_btn")
          .find("a:eq(0)")
          .addClass("router-link-active");
      }
    },
    getHistory(data) {
      $.ajax({
        // url: 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=' + that.coinAddress,
        // url: 'http://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=' + that.coinAddress,
        url:
          "https://api-rinkeby.etherscan.io/api?module=account&action=" +
          this.selectData.token +
          "&address=" +
          this.coinAddress,
        type: "post",
        datatype: "json",
        success: res => {
          // console.log(res)
          this.setWeb3();
          this.historyData = [];
          let arrObj = [];
          let newArr = [];
          let objArr = {};
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              arrObj.push(data[i]);
            }
          }
          // console.log(typeof res.result)
          if (
            res.result &&
            res.result.length > 0 &&
            (typeof res.result).toLowerCase() === "object"
          ) {
            for (let i = 0; i < res.result.length; i++) {
              // console.log(res.result[i])
              if (this.selectData.coin === "ETH") {
                arrObj.push(res.result[i]);
              } else {
                if (
                  res.result[i].to.toLowerCase() ===
                    this.coinAddress.toLowerCase() &&
                  res.result[i].tokenSymbol === this.selectData.coin
                ) {
                  arrObj.push(res.result[i]);
                }
              }
            }
          }
          // console.log(arrObj)
          for (let i = 0; i < arrObj.length; i++) {
            if (!objArr[arrObj[i].hash]) {
              newArr.push(arrObj[i]);
              objArr[arrObj[i].hash] = true;
            }
          }
          // console.log(newArr)
          for (let i = 0; i < newArr.length; i++) {
            if (newArr[i].fsnhash) {
              newArr[i].statusFsn = "Success";
              newArr[i].date = this.$$.timeChange({
                date: newArr[i].date,
                type: "yyyy-mm-dd hh:mm"
              });
            } else {
              newArr[i].statusFsn = "New";
              newArr[i].date = this.$$.timeChange({
                date: Number(newArr[i].timeStamp) * 1000,
                type: "yyyy-mm-dd hh:mm"
              });
            }
            newArr[i].date = this.$$.timeChange({
              date: Number(newArr[i].timeStamp) * 1000,
              type: "yyyy-mm-dd hh:mm"
            });
            // console.log(123)
            // console.log(objArr[newArr[i].hash])
            if (newArr[i].dataType !== "DATABASE") {
              newArr[i].coin = newArr[i].tokenSymbol
                ? newArr[i].tokenSymbol
                : this.selectData.coin;
              this.createDatabaseInfo(newArr[i]);
            }
            if (!newArr[i].fsnhash && newArr[i].hash.indexOf("0xx") === 0) {
              newArr[i].statusFsn = '<span style="color:red">failure</span>';
            }
            newArr[i].hash =
              newArr[i].hash.indexOf("0xx") === 0
                ? newArr[i].fsnhash
                : newArr[i].hash;
            newArr[i].value2 = this.web3.fromWei(newArr[i].value, "ether");
            this.historyData.push(newArr[i]);
          }
          const compare = property => {
            return (a, b) => {
              const value1 = a[property];
              const value2 = b[property];
              if (Date.parse(value1) > Date.parse(value2)) {
                return -1;
              } else if (value1 < value2) {
                return 1;
              } else {
                return 0;
              }
              // return Date.parse(value1) - Date.parse(value2)
            };
          };
          this.historyData.sort(compare("date"));
        }
      });
    },
    createDatabaseInfo(data) {
      $.ajax({
        url: this.$$.serverURL + "/lilo/create",
        type: "post",
        datatype: "json",
        data: data,
        success: res => {
          // console.log(res)
        }
      });
    },
    getDatabaseInfo() {
      // console.log(this.coinAddress)
      if (!this.coinAddress) {
        return;
      }
      $.ajax({
        url: this.$$.serverURL + "/lilo/lockInHistory",
        type: "post",
        datatype: "json",
        data: { to: this.coinAddress },
        success: res => {
          // console.log(res)
          for (let i = 0; i < res.info.length; i++) {
            if (res.info[i].hash === "" || res.info[i].hash === undefined) {
              res.info[i].hash = "0xx" + i;
            }
            res.info[i].dataType = "DATABASE";
          }
          this.getHistory(res.info);
        },
        error: res => {
          this.getHistory([]);
        }
      });
    },
    updateDatabaseInfo(data) {
      $.ajax({
        url: this.$$.serverURL + "/lilo/lockInChangeState",
        type: "post",
        datatype: "json",
        data: { hash: data.hash, fsnhash: data.fsnhash, statusFsn: "Success" },
        success: res => {
          // console.log(res)
          this.getDatabaseInfo();
        },
        error: res => {
          // this.getHistory([])
        }
      });
    }
  }
};
</script>
