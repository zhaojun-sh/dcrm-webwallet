const Web3 = require('web3')
const pub = require('./public')

let web3 = new Web3(new Web3.providers.HttpProvider(pub.serverURL))

// if (web3 !== undefined) {
//   web3 = new Web3(Web3.currentProvider)
// } else {
//   web3 = new Web3(new Web3.providers.HttpProvider(pub.serverURL))
// }
let newBlock = web3.eth.filter('latest')
newBlock.watch(function (error, result) {
  console.log('newBlock')
  console.log(error)
  console.log(result)
  console.log(web3.eth.syncing)
  let newData = web3.eth.getBlock(result)
  console.log(newData)
})
let syncBlock = web3.eth.filter({fromBlock: 0, toBlock: 'latest', address: null})
syncBlock.get(function (error, result) {
  console.log('syncBlock')
  console.log(error)
  console.log(result)
})

// web3.eth.getBlockNumber(function (error, result) {
//   console.log(error)
//   console.log(result)
// })
// console.log(web3.eth.getBlock(22))
