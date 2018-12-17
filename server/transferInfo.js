const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost:27017/fsn')

const transferSchema = new Schema({
  // privateKey: {type: String},
  // publicKey: {type: String},
  value: {type: Number},
  coin: {type: String},
  to_address: {type: String},
  from_address: {type: String},
  date: {type: Date},
  txhax: {type: String},
  status: {type: String}
})

const TransferModel = mongoose.model('transfer', transferSchema)

router.post('/create', function (req, res) {
  console.log(req.body)
  let send = new TransferModel({
    // privateKey: '0xe63d00f899b00b98b9f56d260d677af0b7ae5564feab9444afc808c914b19e3d',
    // publicKey: '0x071569354f5edc6fd8f4b37b70a84f07c79ec025120a6f1822e2238df9685dd0a28af34d6da3412653f6f8509968e72a9af971a53969789092ac1898783f7d45',
    value: Number(req.body.value),
    coin: req.body.coin,
    to_address: req.body.to_address,
    from_address: req.body.from_address,
    date: req.body.date,
    txhax: req.body.txhax,
    status: req.body.status
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

router.post('/history', function (req, res) {
  // console.log(req.body)
  let data = {
    msg: 'error',
    info: ''
  }
  TransferModel.find({from_address: req.body.from_address, coin: req.body.coin}, function (err, result) {
    if (err) {
      // console.log(3)
      data.msg = 'errpr'
      data.info = err
      console.log(err)
    } else {
      // console.log(4)
      // console.log(result)
      data.msg = 'success'
      let compare = function compare (property) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (value1 > value2) {
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

router.post('/receiveHistory', function (req, res) {
  // console.log(req.body)
  let data = {
    msg: 'error',
    info: ''
  }
  TransferModel.find({to_address: req.body.to_address, coin: req.body.coin}, function (err, result) {
    if (err) {
      // console.log(3)
      data.msg = 'errpr'
      data.info = err
      console.log(err)
    } else {
      // console.log(4)
      // console.log(result)
      data.msg = 'success'
      let compare = function compare (property) {
        return function (a, b) {
          let value1 = a[property]
          let value2 = b[property]
          if (value1 > value2) {
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
