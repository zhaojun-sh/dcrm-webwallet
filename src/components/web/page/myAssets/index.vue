<template>
  <div>
    <div class="contentHeader_box flex-bc">
      <h1 class="contentHeader_title">My Assets</h1>
      <h2 class="contentHeader_title" v-html="myAssets"></h2>
    </div>

    <div class="myAssetsSear_box flex-ec">
      <div class="myAssetsSear_input">
        <input type="text" placeholder="FSN" class="input-text"/>
        <div class="searchIcon"><div class="icon flex-c"><img src="../../../../assets/image/search.png"></div></div>
      </div>
    </div>

    <div class="myAssetsTable_box">
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Available Balance</th>
            <th>Freeze</th>
            <th>Total Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in bitIconTypeData" :key="item.index">
            <td>
              <div class="flex-sc">
                <div class="logo"><img :src="item.logo"></div>
                <div class="title">
                  <h2 class="span" v-html="item.nameSimplicity"></h2>
                  <h3 class="p" v-html="item.nameFull"></h3>
                </div>
              </div>
            </td>
            <td><span class="span" v-html="item.availbleBalance"></span></td>
            <td><span class="span" v-html="item.freeze"></span></td>
            <td><span class="span" v-html="item.totalBalance"></span><p class="p" v-html="item.totalBalanceDoller"></p></td>
            <td>
              <div>
                <router-link :to="{path:'/Transfer/tranReceive', query: {currency: item.currency}}" class="setBtn">Receive</router-link>
                <router-link :to="{path:'/Transfer/tranSend', query: {currency: item.currency}}" class="setBtn">Send</router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import wallet from '../../../../assets/js/wallet'
export default {
  name: 'myAssets',
  data () {
    return {
      myAssets: '',
      bitIconTypeData: [],
      privateKey: '',
      publicKey: '',
      walletAdress: ''
    }
  },
  mounted () {
    let that = this
    that.privateKey = that.$store.state.privateKey
    // that.publicKey = that.$store.state.publicKey
    // that.publicKey = '0x6224a432c6ef0b33857f49674513c5e797c368dbfe923e10eaba511e50c60c9f00da924b9c6c18313aaba64f7fbe568599e3af7b0c15ea3b105671ef357e2b22' //本地生成的公钥
    that.publicKey = '0x443952603c63bc7747c0b0535e55cbf3b45d4dad8abe5bfc4e2e683631f5c1bd308b7d432a872fdfcabe0b752c13643b1b2531c0a1e33d7929112e332fa359dd' //本地生成的公钥
    // that.walletAdress = that.$store.state.addressInfo
    // that.walletAdress = '0xe3Ce9049a1d7091DffAdFEaa590F0A0410cb5226' //本地生成的地址
    that.walletAdress = '0x3A1b3B81Ed061581558a81F11d63E03129347437' //本地生成的地址
    that.myAssets = '$' + that.$$.thousandBit(1000000)
    that.bitIconTypeData = [
      {
        logo: require('../../../../assets/image/Fusion.svg'),
        nameSimplicity: 'FSN',
        nameFull: 'Fusion',
        availbleBalance: that.$$.thousandBit(1000000),
        freeze: that.$$.thousandBit(1000000),
        totalBalance: that.$$.thousandBit(1000000),
        totalBalanceDoller: '$' + that.$$.thousandBit(1000000),
        currency: 'BTC',
        receive: '',
        send: ''
      }
    ]

    that.requestData({
      params: ['ETH'],
      method: 'fsn_dcrmReqAddr'
    })

    that.requestData({
      params: [that.walletAdress, 'ETH'],
      method: 'fsn_dcrmGetAddr'
    })

    that.requestData({
      params: [that.walletAdress, 'ETH'],
      method: 'fsn_dcrmGetBalance'
    })

    that.requestData({
      params: ['123456789000000000','ETH'],
      method: 'fsn_dcrmLockin'
    })
    that.getDatas()
    // that.createAccount()
    // that.getBalance()
    // console.log(wallet.generateVanityAddress())
    // console.log(wallet.getV3Filename())
  },
  methods: {
    requestData (req) {
      let that = this
      req = that.requestInit(req)
      let inputdata = {
        params: req.params,
        method: req.method,
        jsonrpc: req.jsonrpc,
        id: req.id
      }
      $.ajax({
        // url: $("#selNode").val(),//"http://47.92.168.85:40405/",
        // url: 'http://47.92.168.85:40405/',
        // url: 'http://54.169.254.177:40415/',
        url: 'http://47.92.255.230:40415/',
        type: 'post',
        data: JSON.stringify(inputdata),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          console.log(data)
          // hideMaskLayer();
          if(data && data.result){
            let $data = data.result.indexOf('{') == 0 ? JSON.parse(data.result) : data.result
            console.log($data)
            if ($data.DcrmAddr && $data.Txhash) {
              that.requestData({
                params: [$data.DcrmAddr, $data.Txhash, 'ETH'],
                method: 'fsn_dcrmConfirmAddr'
              })
            }
            // $('#'+$data.COINTYPE.toLowerCase()+'DCRMAddress').append('<option value="'+$data.DCRMPUBKEY+'">'+$data.DCRMADDRESS+'</option>')
            // createQrCode($data.DCRMADDRESS)
            // $('#'+$data.COINTYPE.toLowerCase()+'DCRMAddress').val($data.DCRMPUBKEY)
          }else if(data&&data.error){
            // showTip("Error:"+ JSON.stringify(data.error)+'<br/><br/>Please Retry!');
          }
        },
        error: function (e) {
          console.log("error", e)
        }
      })
    },
    requestInit (req) {
      let res = {
        coin: req.coin ? req.coin : 'ETH',
        adress: req.adress ? req.adress : '',
        prvKey: req.prvKey ? req.prvKey : '',
        pubkey: req.pubkey ? req.pubkey : '',
        to_adress: req.to_adress ? req.to_adress : '',
        id: req.id ? req.id : 67,
        jsonrpc: req.jsonrpc ? req.jsonrpc : '2.0',
        method: req.method ? req.method : '',
        params: req.params ? req.params : [],
        amount: req.amount ? req.amount : ''
      }
      return res
    },
    // createAccount (obj) {
    //   let that = this
    //   // let pubkey = '0x89936afe57a9b4c314c3c5cc5f990df43faa9cd1be6a2c767ba7285d404c2567413cf98db665b3fd064d17af97763d1e1b5c51d18e2c988c422fe9a0113e698301'
    //   // let pubkey = that.walletAdress
    //   obj = that.requestInit(obj)
    //   // let coin = $("#selCoin").val();
    //   // let coin = 'ETH'
    //   // if (pubkey && coin) {     
    //     // inputdata.jsonrpc = "2.0"
    //     // inputdata.method = "fsn_dcrmReqAddress"
    //     // inputdata.params = para
    //     // inputdata.id = 67
    //     // let inputdata = {
    //     //   params: para,
    //     //   method: 'fsn_dcrmGetBalance',
    //     //   jsonrpc: '2.0',
    //     //   id: 67
    //     // }
    //     let inputdata = {
    //       params: obj.params,
    //       method: obj.method,
    //       jsonrpc: obj.jsonrpc,
    //       id: obj.id
    //     }
    //     console.log("json", JSON.stringify(inputdata)); 
    //     // showMaskLayer("Creating "+coin+" address,please wait...<br/><br/><p>DCRM address is distributedly generating by the following nodes:<br/>"+get_ipinfo()+"</p>");
    //     $.ajax({
    //       // url: $("#selNode").val(),//"http://47.92.168.85:40405/",
    //       // url: 'http://47.92.168.85:40405/',
    //       // url: 'http://54.169.254.177:40415/',
    //       url: 'http://47.92.255.230:40415/',
    //       type: 'post',
    //       data: JSON.stringify(inputdata),
    //       dataType: 'json',
    //       contentType: 'application/json',
    //       success: function (data) {
    //         console.log(data)
    //         // hideMaskLayer();
    //         if(data && data.result){
    //           let $data = JSON.parse(data.result)
    //           // $('#'+$data.COINTYPE.toLowerCase()+'DCRMAddress').append('<option value="'+$data.DCRMPUBKEY+'">'+$data.DCRMADDRESS+'</option>')
    //           // createQrCode($data.DCRMADDRESS)
    //           // $('#'+$data.COINTYPE.toLowerCase()+'DCRMAddress').val($data.DCRMPUBKEY)
    //         }else if(data&&data.error){
    //           // showTip("Error:"+ JSON.stringify(data.error)+'<br/><br/>Please Retry!');
    //         }
    //       },
    //       error: function (e) {
    //         // hideMaskLayer()
    //         console.log("error", e)
    //         // showTip("Error:"+ JSON.stringify(e)+'<br/><br/>Please Retry!')
    //         // $(obj).removeAttr("disabled");
    //       }
    //     })
    //   // }else{
    //   //   // showTip("Error: Please Generate Private Key!");
    //   // }
    // },
    getBalance () {
      let that = this
      // let pubkey = '0x89936afe57a9b4c314c3c5cc5f990df43faa9cd1be6a2c767ba7285d404c2567413cf98db665b3fd064d17af97763d1e1b5c51d18e2c988c422fe9a0113e698301'
      // let pubkey = that.publicKey
      // let coin = $("#selCoin").val();
      let coin = 'ETH'
      if (that.walletAdress && coin) {
        coin = (coin == 'BTC' ? 'BTC' : 'ETH')
        let para = new Array()
        para.push(that.walletAdress)
        para.push(coin)
        let inputdata = {
          params: para,
          method: 'fsn_dcrmGetBalance',
          jsonrpc: '2.0',
          id: 67
        }
        $.ajax({
          // url: $("#selNode").val(),//"http://47.92.168.85:40405/",
          // url: 'http://47.92.168.85:40405/',
          url: 'http://54.169.254.177:40415/',
          type: 'post',
          data: JSON.stringify(inputdata),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            console.log(data)
            // hideMaskLayer();
            if(data && data.result){
              let $data = JSON.parse(data.result)
              // $('#'+$data.COINTYPE.toLowerCase()+'DCRMAddress').append('<option value="'+$data.DCRMPUBKEY+'">'+$data.DCRMADDRESS+'</option>')
              // createQrCode($data.DCRMADDRESS)
              // $('#'+$data.COINTYPE.toLowerCase()+'DCRMAddress').val($data.DCRMPUBKEY)
            }else if(data&&data.error){
              // showTip("Error:"+ JSON.stringify(data.error)+'<br/><br/>Please Retry!');
            }
          },
          error: function (e) {
            // hideMaskLayer()
            console.log("error", e)
            // showTip("Error:"+ JSON.stringify(e)+'<br/><br/>Please Retry!')
            // $(obj).removeAttr("disabled");
          }
        })
      }else{
        // showTip("Error: Please Generate Private Key!");
      }
    },
    getDatas () {
      let that = this
      let Web3 = require('web3')
      if (typeof web3 !== 'undefined') {
        Web3 = new Web3(Web3.currentProvider)
        console.log('1'+Web3.currentProvider)
      } else {
        Web3 = new Web3(new Web3.providers.HttpProvider(that.$$.baseUrl))
        console.log('2'+Web3)
      }
      // console.log(Web3)
      let version = Web3.version.api.toString().substr(0, 3)
      // 定义合约abi
      let contractAbi = [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cap","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

      // 合约地址
      // let contractAddress = "0x7FCCF800568747b178c6cBbe4Bf3d147df75ac61";

      // 账号
      let currentAccount = "0x16466C8383F600CE8bA0308C2a3DeAC79fe3fc88";
      let blockTest = Web3.eth.getBlock(196611)
      console.log(blockTest)
      // 定义合约
      // let myContract
      // if (Number(version) >= 1) {
      //   myContract = new Web3.eth.Contract(contractAbi, contractAddress)
      // } else {
      //   myContract = Web3.eth.contract(contractAbi,contractAddress)
      // }

      // 查询以太币余额
      Web3.eth.getBalance(currentAccount, function (error, results) {
        if(error){
          console.log(error)
        }else{

          // console.log('balance:'+that.toNum(results))
          console.log('balance:'+results)
        }
      })
      // 查看某个账号的代币余额
      // myContract.methods.balanceOf(contractAddress).call({from: currentAccount}, function(error, result){
      //   if(!error) {
      //     console.log(result);
      //   } else {
      //     console.log(error);
      //   }
      // })
      // Web3.eth.getBalance(currentAccount).then(console.log())
    },
    toNum (num) {
      let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    }
  }
}
</script>
