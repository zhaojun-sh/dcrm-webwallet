<template>
  <div>
    <div class="receiveContent_box">
      <div class="receiveAddress_box">
        <h3 v-html="addressTitle"></h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text input" v-model="toAddress" />
        </div>

        <h3 class="mt-20">Amount:</h3>
        <div class="receiveAddress_pwd">
          <input type="text" class="input-text amount" v-model="sendAmound" id="amountShow" @change="changeAmount" />
          <label v-html="selectData" class="currency"></label>
        </div>

        <div class="receiveAddress_btn flex-c">
          <button class="btn blue flex-c W240 mt-10" @click="sendAmoundInfo">Send</button>
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
// let Web3 = require('web3')

export default {
  name: 'receive',
  props: ['selectData'],
  data () {
    return {
      addressTitle: '',
      privateKey: '',
      publicKey: '',
      walletAdress: '',
      toAddress: '',
      historyData: [],
      sendAmound: '',
      web3Set: ''
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
    that.pageRefresh()
    that.privateKey = that.$store.state.privateKey
    that.publicKey = that.$store.state.publicKey
    // that.walletAdress = that.$store.state.addressInfo
    that.walletAdress = '3a1b3b81ed061581558a81f11d63e03129347437'
    // console.log(Web3)
    // console.log(Web3.currentProvider)
    // let Web3 = new Web3(Web3.givenProvider || that.$$.baseUrl)
    // if (typeof Web3 !== 'undefined') {
    //     Web3 = new Web3(Web3.currentProvider)
    // } else {
    //   Web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
    // }
    // that.web3Set = Web3
    // that.setWeb3()
    // that.dcrmSignTranForEth()
    // console.log(that.web3Set)
    that.historyData = [
      {
        status: 'failure',
        coin: 'FSN',
        amount: that.$$.thousandBit(500, 0),
        date: '2018/10/22/15:46',
        info: '0xfd02759fba7aa4ddb1a9e361d7ea6fa1e...'
      }
    ]
    // that.selectData = ''
    that.sendAmound = that.$$.thousandBit('20000')
    // console.log(that.selectData)
  },
  methods: {
    titleChange (bitType) {
      let that = this
      that.addressTitle = bitType + ' Receiving Address'
    },
    dataInit (data) {
      let that = this
      that.titleChange(data)
    },
    pageRefresh () {
      let that = this
      if (that.selectData) {
        that.dataInit(that.selectData)
      }
      if (location.href.indexOf('tranSend') !== -1) {
        $('.transferBtn_btn').find('a:eq(0)').removeClass('router-link-active')
      }
    },
    changeAmount () {
      let that = this
      that.sendAmound = that.$$.thousandChange(that.sendAmound)
    },
    setWeb3 () {
      let that = this
      let Web3 = require('web3')
      if (typeof web3 !== 'undefined') {
        Web3 = new Web3(Web3.currentProvider)
      } else {
        Web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
      }
      that.web3Set = Web3
    },
    sendAmoundInfo () {
      let that = this
      that.setWeb3()
      // console.log(that.web3Set.isConnected())
      let rawTx = {
        nonce: '0',
        gasPrice: '400', 
        gasLimit: '300',
        from: '0xD562BB03A071f8928F885946Be4bd37b5beAeD6E',
        // to: '0x0520e8e5e08169c4dbc1580dc9bf56638532773a', 
        to: '0x3a1b3b81ed061581558a81f11d63e03129347437',
        // value: '10000000000000000', 
        value: '0.05', 
        // data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
      }

      // that.web3Set.eth.getAccounts(function (err, res) {
      //   console.log(err)
      //   console.log(res)
      // })
      // let blockTest = that.web3Set.eth.getBlock(196611)
      // console.log(blockTest)
      // return
      // console.log(that.web3Set.isAddress(rawTx.from))
      // console.log(that.web3Set.isAddress(rawTx.to))
      // that.web3Set.eth.sendTransaction(rawTx, function (err, res) {
      //   if (err) {
      //     console.log(err)
      //   } else {
      //     console.log(res)
      //   }
      // })
      // let transaction = that.web3Set.eth.getTransaction('0xd562bb03a071f8928f885946be4bd37b5beaed6e', function (err, res) {
      //   console.log(err)
      //   console.log(res)
      // })
      // console.log(transaction)
      // return
      let Tx = require('ethereumjs-tx')
      let privateKey = new Buffer('e63d00f899b00b98b9f56d260d677af0b7ae5564feab9444afc808c914b19e3d', 'hex')

      let tx = new Tx(rawTx)
      tx.sign(privateKey)

      let serializedTx = tx.serialize()
      let serializedTxString = serializedTx.toString('hex')
      serializedTxString = serializedTxString.indexOf('0x') === 0 ? serializedTxString : ('0x' + serializedTxString)
      //console.log(serializedTx.toString('hex'));
      // console.log(serializedTxString)
      that.web3Set.eth.sendRawTransaction(serializedTxString, function(err, hash) {
        if (!err) {
          console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
        } else {
          console.log(err)
        }
      })
    },
    dcrmSignTranForEth() {
      let that = this
      // let to_address = that.toAddress
      let to_address = '0x0520e8e5e08169c4dbc1580dc9bf56638532773a'
      // let to_value = that.sendAmound
      let to_value = '0.01'
      let address = that.walletAdress
      // let coin = that.selectData
      let coin = 'ETH'
      console.log(that.web3Set.eth)
      if (to_address && to_value && address && coin) {
        to_address = to_address.toLowerCase().indexOf('0x') == 0 ? to_address : ('0x' + to_address)
        address = address.toLowerCase().indexOf('0x') == 0 ? address : ('0x' + address)

        if (to_address.length == 42 && address.length == 42) {
          let reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/

          if (reg.test(to_value)) {
            // showMaskLayer("Lock out is in progress, please wait...<br/><br/><p>Distributed computing by the following p2p nodes:<br/>"+get_ipinfo()+"</p>");
            that.setWeb3()
            // let Web3 = require('web3')
            // if (typeof web3 !== 'undefined') {
            //   Web3 = new Web3(Web3.currentProvider)
            //   console.log('1'+Web3.currentProvider)
            // } else {
            //   Web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
            //   console.log('2'+Web3)
            // }
            // let blockTest = Web3.eth.getBlock(196611)
            // console.log(blockTest)
            // return
            // let version = Web3.version.api.toString().substr(0, 3)
            // if () {

            // }
            // that.web3Set.setProvider(that.$$.baseUrl)
            // that.web3Set.setProvider(new that.web3Set.providers.WebsocketProvider('ws://localhost:8546'));
            // console.log(that.web3Set.eth)
            // console.log(that.web3Set.providers)
            // console.log(that.web3Set.currentProvider)
            that.web3Set.eth.getTransactionCount(address, function(error, result){
              if (!error) {
                console.log('3'+result);

                let nonceHex = that.decToHex(result.toString());
                console.log('4'+nonceHex);
                if (coin == 'ETH') {
                  let value = that.web3Set.toWei(to_value, 'ether')
                  let valHex = that.decToHex(value)
                  that.getEthTxHash(to_address, valHex, nonceHex)
                  console.log('5'+nonceHex);
                } else {
                  let contractAddress, contractABI
                  if (coin=='FSN') {
                    contractAddress = FSN.contractAddr
                    contractABI = FSN.contractAbi
                  } else if (coin=='TRX') {
                    contractAddress = TRX.contractAddr
                    contractABI = TRX.contractAbi
                  }

                  let MMTContract = that.web3Set.eth.contract(contractABI).at(contractAddress)
                  //let decimal = MMTContract.decimals();
                  MMTContract.decimals.call(function (err, result) {
                    let decimal = result.toString();
                    let coinval= parseFloat(to_value) * Math.pow(10, decimal)
                    console.log(coin, coinval)
                    let valHex = that.decToHex(coinval.toString())

                    let erc20_data = MMTContract.transfer.getData(to_address, valHex)

                    that.getEthTxHash(contractAddress, valHex, nonceHex, erc20_data)
                  })
                }
              } else {
                console.log('error:' + 1)
                console.log(error)
                // showTip(error)
                // hideMaskLayer()
              }
            })
          } else {
            console.log('error:' + 2)
            // showTip('Transfer value error!');
          }
        }else{
          console.log('error:' + 3)
          // showTip('Address error!');
        }
      }else{
        console.log('error:' + 4)
          // showTip('Parameter can not be empty!');
      }
    },
    sendTransaction () {
      let that = this
      let tx_hash=$("#signTransaction").val();
      console.log(tx_hash);
      if (tx_hash) {
        $("#lookurl").hide();

        // showMaskLayer("Send Transation...");
        let coin=$('#selCoin').val();

        if (coin == 'BTC') {
          let inputdata = {};
          inputdata.tx = tx_hash;

          $.ajax({
            url: 'https://api.blockcypher.com/v1/btc/test3/txs/push',
            type: 'post',
            data: JSON.stringify(inputdata),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
              console.log(data);
              // hideMaskLayer();
              let $tx = data.tx;
              let hash = $tx.hash;
              $("#lookurl a").attr("href", "https://live.blockcypher.com/btc-testnet/tx/" + hash);
              $("#lookurl .lookurl").text("https://live.blockcypher.com/btc-testnet/tx/" + hash);
              $("#lookurl").show();
            },
            error: function (e) {
              // hideMaskLayer();
              console.log("error", e.responseText);

              // showTip("[Error] " + JSON.parse(e.responseText).error + '<br/><br/>Please Retry!');
            }
          });
        } else {//ETH ERC20 Broadcast Transaction
          that.web3Set.eth.sendRawTransaction(tx_hash, function (err, hash) {
            // hideMaskLayer();
            if (err) {
                console.log(err);
                // let endIndex = err.toString().indexOf('at ');
                // if (endIndex > -1) {
                //     showTip(err.toString().substring(0, endIndex));
                // } else {
                //     showTip(err.toString());
                // }
            } else {
                console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                $("#lookurl a").attr("href", "https://rinkeby.etherscan.io/tx/" + hash);
                $("#lookurl .lookurl").text("https://rinkeby.etherscan.io/tx/" + hash);
                $("#lookurl").show();
            }
          });
        }
      }else{
        // showTip('Please Generate DCRM Signed Transaction!');
      }
    },
    getEthTxHash (to_address,to_value,nonce,erc20_data) {
      let that = this
      $.ajax({
        url: "http://dcrm.network/build_EthTx",
        type: 'post',
        data: { to_address:to_address, to_value:to_value,nonce:nonce,erc20_data:erc20_data},
        dataType: 'json',
        success: function (data) {
          console.log("sighash",data)
          if(data && data.sighash){
            getrpc_dcrmSignForEth(data.sighash,to_address,to_value,nonce,erc20_data);
          }else{
            // hideMaskLayer();
            // showTip(' Build sign hash empty!');
          }
        },
        error:function(e){
          console.log("e",e);
          // showTip("Error:"+JSON.stringify(aa)+'<br/><br/>Please Retry!');
          // hideMaskLayer();
        }
      });
    },
    parseToDigitsArray (str, base) {
      let that = this
      console.log(str);
      let digits = str.split('');
      let ary = [];
      for (let i = digits.length - 1; i >= 0; i--) {
          let n = parseInt(digits[i], base);
          if (isNaN(n)) return null;
          ary.push(n);
      }
      return ary;
    },
    convertBase (str, fromBase, toBase) {
      let that = this
      let digits = that.parseToDigitsArray(str, fromBase);
      if (digits === null) return null;

      let outArray = [];
      let power = [1];
      for (let i = 0; i < digits.length; i++) {
        // invariant: at this point, fromBase^i = power
        if (digits[i]) {
            outArray = that.add(outArray, that.multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = that.multiplyByNumber(fromBase, power, toBase);
      }

      let out = '';
      for (let i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
      }
      return out;
    },
    decToHex(decStr) {
      let that = this
      if (decStr==0) {return '0x00';}
      let hex = that.convertBase(decStr, 10, 16);
      return hex ? '0x' + hex : null;
    },
    add (x, y, base) {
      let that = this
      let z = [];
      let n = Math.max(x.length, y.length);
      let carry = 0;
      let i = 0;
      while (i < n || carry) {
          let xi = i < x.length ? x[i] : 0;
          let yi = i < y.length ? y[i] : 0;
          let zi = carry + xi + yi;
          z.push(zi % base);
          carry = Math.floor(zi / base);
          i++;
      }
      return z;
    },
    multiplyByNumber(num, x, base) {
      let that = this
      if (num < 0) return null;
      if (num == 0) return [];

      let result = [];
      let power = x;
      while (true) {
        if (num & 1) {
            result = that.add(result, power, base);
        }
        num = num >> 1;
        if (num === 0) break;
        power = that.add(power, power, base);
      }

      return result;
    }
  }
}
</script>
