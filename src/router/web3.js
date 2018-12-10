var Web3 = require('web3')
var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
// var web3 = new Web3('https://etherscan.io')
router.get('/web3', bodyParser.urlencoded({extended: false}), function (req, res) {
  if (typeof web3 !== 'undefined') {
    Web3 = new Web3(Web3.currentProvider)
  } else {
    // set the provider you want from Web3.providers
    // Web3 = new Web3(new Web3.providers.HttpProvider('http://47.107.50.83:8000/'))
    Web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/'))
  }
  var version = Web3.version.api
  console.log(version)
  var pwd = Web3.eth.accounts.wallet.encrypt('test')
  console.log(pwd)
  // console.log(0)
  // var balance = Web3.eth.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1')
  // console.log(balance)
  // var info = Web3.eth.getBlock(48, function (error, results) {
  //   if (error) {
  //     console.log(1)
  //     console.log(error)
  //   } else {
  //     console.log(2)
  //     console.log(results)
  //   }
  // })
  // var info = Web3.eth.getBlock(48)
  // console.log(info)
})

module.exports = router
