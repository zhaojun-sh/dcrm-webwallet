<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input
            type="text"
            class="input-text input"
            readonly
            v-model="walletAddress"
            id="walletAdressHide"
          >
          <!-- <input type="text" v-model="walletAdress" id="walletAdressHide" class="inputOpacity"/> -->
        </div>
        <div class="receiveAddress_btn flex-c" id="receiveAddressBtn">
          <button class="btn blue flex-c" @click="qrcode(coinAddress)">
            <div class="icon">
              <img src="@/assets/image/QRcode.svg">
            </div>Show QR code
          </button>
          <button
            class="btn cyan flex-c"
            @click="copyAddress('walletAdressHide', 'receiveAddressBtn')"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Copy clipboard"
          >
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
          <table class="table table-bordered table-hover table-striped">
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
              <tr v-for="(item, index) in historyData" :key="index">
                <td>
                  <span v-html="item.status" :class="item.status !== 'success' ? 'red' : ''"></span>
                </td>
                <td>
                  <span v-html="item.coin"></span>
                </td>
                <td>
                  <span v-html="item.value"></span>
                </td>
                <td>
                  <span v-html="item.date"></span>
                </td>
                <td>
                  <div class="moreInfo_box" @click="MoreContent">
                    <span v-html="item.txhax" :title="item.info" class="ellipsis moreInfo_hax"></span>
                    <ul class="list">
                      <li>TXid：{{item.txhax}}</li>
                      <li>Adress：{{item.from_address}}</li>
                    </ul>
                    <i class="arrow"></i>
                  </div>
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
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "receive",
  props: ["selectData"],
  data() {
    return {
      addressTitle: "",
      walletAddress: "",
      historyData: [],
      refreshHistory: null,
      coinAddress: "",
      web3: ""
    };
  },
  watch: {
    selectData(cur, old) {
      this.getInitData();
      // console.log(this.selectData.address)
    }
  },
  mounted() {
    this.walletAddress = this.$store.state.addressInfo;
    this.pageRefresh();
    this.getInitData();
    $(() => {
      $("[data-toggle='tooltip']").tooltip();
    });
    this.refreshHistory = setInterval(() => {
      this.getSendHistory();
    }, 30000);
    // console.log(this.selectData.address)
  },
  methods: {
    getInitData() {
      this.titleChange(this.selectData.coin);
      // console.log(this.selectData.address)
      this.coinAddress = this.selectData.address;
      this.getSendHistory();
      this.setWeb3();
    },
    pageRefresh() {
      if (this.selectData.coin) {
        this.titleChange(this.selectData.coin);
      }
      if (location.href.indexOf("tranSend") === -1) {
        $(".transferBtn_btn")
          .find("a:eq(0)")
          .addClass("router-link-active");
      }
    },
    titleChange(bitType) {
      this.addressTitle = bitType + " Receiving Address";
      // this.addressTitle = 'FSN Receiving Address'
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
      // console.log(qrcodeInit)
      $("#qrcodeBox").modal("show");
    },
    copyAddress(id, textId) {
      let copyText = $("#" + textId)
        .find(".tooltip-inner")
        .text();
      document.getElementById(id).select();
      document.execCommand("Copy");
      $("#" + textId)
        .find(".tooltip-inner")
        .text("Copied");
      setTimeout(() => {
        $("#" + textId)
          .find(".tooltip-inner")
          .text(copyText);
      }, 3000);
      this.$$.layerMsg("Copy Success");
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
      // let web3 = new Web3()
      // // console.log(this.selectData.url)
      // if (typeof web3 !== 'undefined') {
      //   // Web3 = new Web3(Web3.currentProvider)
      //   web3 = new Web3(new Web3.providers.HttpProvider(this.$$.baseUrl))
      // } else {
      //   Web3 = new Web3(new Web3.providers.HttpProvider(this.selectData.url))
      // }
      // this.web3 = web3
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
    getSendHistory() {
      if (!this.walletAddress || !this.selectData.coin) {
        return;
      }
      $.ajax({
        url: this.$$.serverURL + "/transfer/receiveHistory",
        datatype: "json",
        type: "post",
        data: {
          to_address: this.walletAddress,
          coin: this.selectData.coin
        },
        success: res => {
          console.log(res);
          this.historyData = [];
          if (res.msg === "success" && res.info.length > 0) {
            for (let i = 0; i < res.info.length; i++) {
              if (
                res.info[i].coin === this.selectData.coin &&
                res.info[i].txhax
              ) {
                // console.log(12)
                res.info[i].date = this.$$.timeChange({
                  date: res.info[i].date,
                  type: "yyyy-mm-dd hh:mm"
                });
                res.info[i].value = this.$$.thousandBit(
                  res.info[i].value,
                  "no"
                );
                // res.info[i].value = res.info[i].value
                if (res.info[i].txhax) {
                  res.info[i].status = "success";
                } else {
                  res.info[i].status = "failure";
                }
                this.historyData.push(res.info[i]);
                // console.log(this.historyData)
              }
            }
          } else {
          }
        },
        error: res => {
          console.log(res);
        }
      });
    },
    getStatus(txhax) {
      this.setWeb3();
      if (txhax.txhax) {
        this.web3.eth.getTransactionReceipt(txhax.txhax, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(res)
            if (res.status) {
              txhax.status = "success";
              this.historyData.push(txhax);
            } else {
              txhax.status = "pending";
              this.historyData.push(txhax);
            }
          }
        });
      } else {
        this.historyData.push(txhax);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.refreshHistory);
    this.refreshHistory = null;
  }
};
</script>
