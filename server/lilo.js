const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// mongoose.connect('mongodb://localhost:27017/fsn')
mongoose.connect('mongodb://localhost:27017/fsn')
const liloSchema = new Schema({
  blockHash: {type: String},
  blockNumber: {type: String},
  confirmations: {type: String},
  contractAddress: {type: String},
  cumulativeGasUsed: {type: String},
  date: {type: String},
  from: {type: String},
  gas: {type: String},
  gasPrice: {type: String},
  gasUsed: {type: String},
  hash: {type: String},
  fsnhash: {type: String},
  input: {type: String},
  isError: {type: String},
  nonce: {type: String},
  timeStamp: {type: String},
  to: {type: String},
  transactionIndex: {type: String},
  txreceipt_status: {type: String},
  value: {type: String}
})

const LiloModel = mongoose.model('lilo', liloSchema)

router.post('/create', function (req, res) {
  let send = new LiloModel({
    blockHash: req.body.blockHash.toLowerCase(),
    blockNumber: req.body.blockNumber.toLowerCase(),
    confirmations: req.body.confirmations.toLowerCase(),
    contractAddress: req.body.contractAddress.toLowerCase(),
    cumulativeGasUsed: req.body.cumulativeGasUsed.toLowerCase(),
    date: req.body.date.toLowerCase(),
    from: req.body.from.toLowerCase(),
    gas: req.body.gas.toLowerCase(),
    gasPrice: req.body.gasPrice.toLowerCase(),
    gasUsed: req.body.gasUsed.toLowerCase(),
    hash: req.body.hash.toLowerCase(),
    fsnhash: req.body.fsnhash.toLowerCase(),
    input: req.body.input.toLowerCase(),
    isError: req.body.isError.toLowerCase(),
    nonce: req.body.nonce.toLowerCase(),
    timeStamp: req.body.timeStamp.toLowerCase(),
    to: req.body.to.toLowerCase(),
    transactionIndex: req.body.transactionIndex.toLowerCase(),
    txreceipt_status: req.body.txreceipt_status.toLowerCase(),
    value: req.body.value.toLowerCase()
  })
  let data = {
    msg: 'error',
    info: ''
  }
  send.save(function (err, result) {
    if (err) {
      // console.log(1)
      console.log(err)
      data.msg = 'errpr'
      data.info = err
    } else {
      // console.log(2)
      // console.log(result)
      data.msg = 'success'
      data.info = result
      res.json(data)
    }
  })
})

router.post('/lockInHistory', function (req, res) {
  let data = {
    msg: 'error',
    info: ''
  }
  LiloModel.find({to: req.body.to.toLowerCase()}, function (err, result) {
    if (err) {
      data.msg = 'errpr'
      data.info = err
    } else {
      data.msg = 'success'
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
          // return Date.parse(value1) - Date.parse(value2)
        }
      }
      result.sort(compare('date'))
      data.info = result
      res.json(data)
    }
  })
})

router.post('/lockOutHistory', function (req, res) {
  let data = {
    msg: 'error',
    info: ''
  }
  LiloModel.find({from: req.body.from.toLowerCase()}, function (err, result) {
    if (err) {
      data.msg = 'errpr'
      data.info = err
    } else {
      data.msg = 'success'
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
          // return Date.parse(value1) - Date.parse(value2)
        }
      }
      result.sort(compare('date'))
      data.info = result
      res.json(data)
    }
  })
})

module.exports = router
