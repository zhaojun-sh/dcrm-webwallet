const express = require('express')
const router = express.Router()
// const mongoose = require('mongoose')
const pub = require('./public')
const mongoose = pub.mongoose
const Schema = mongoose.Schema
// mongoose.connect('mongodb://localhost:27017/fsn', { useNewUrlParser: true })

const transferSchema = new Schema({
  value: {type: Number},
  coin: {type: String},
  to: {type: String},
  from: {type: String},
  timestamp: {type: Number},
  hash: {type: String},
  status: {type: String}
})

const TransferModel = mongoose.model('transfer', transferSchema)

router.post('/create', function (req, res) {
  console.log(req.body)
  let send = new TransferModel({
    value: Number(req.body.value),
    coin: req.body.coin,
    to: req.body.to,
    from: req.body.from,
    timestamp: req.body.timestamp,
    hash: req.body.hash,
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
  TransferModel.find({from: req.body.from, coin: req.body.coin}, function (err, result) {
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
      result.sort(compare('timestamp'))
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
  TransferModel.find({to: req.body.to, coin: req.body.coin}, function (err, result) {
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
      result.sort(compare('timestamp'))
      data.info = result
      res.json(data)
    }
  })
})

module.exports = router
