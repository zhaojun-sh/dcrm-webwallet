let Web3 = require('web3')
// console.log(new Web3())
// let newWeb3 = function (providers) {
function newWeb3 (providers) {
  Web3.call(this)
  // if (typeof web3 !== 'undefined') {
  //   Web3 = new Web3(Web3.currentProvider)
  // } else {
  //   Web3 = new Web3(new Web3.providers.HttpProvider(providers))
  // }
  let idInit = 0
  // this.returnWeb3 = Web3
  // let that = this.returnWeb3
  let that = this
  this.lilo = {
    dcrmReqAddr: function (fromAddress, coin, pwd) {
      let inputdata = {
        params: [fromAddress, coin],
        method: 'lilo_dcrmReqAddr',
        jsonrpc: '2.0',
        id: ++idInit
      }
      let callback = new Promise(function (resolve, reject) {
        $.ajax({
          url: providers,
          type: 'post',
          data: JSON.stringify(inputdata),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            if (data && data.result) {
              if (data.result.indexOf('{') === 0) {
                let $data = JSON.parse(data.result)
                sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
                that.lilo.dcrmConfimAddr($data.DcrmAddr, coin, pwd).then(function (val) {
                  resolve(val)
                })
              } else {
                resolve(data)
              }
            } else if (data && data.error) {
              reject(data)
            }
          },
          error: function (e) {
            console.log('error', e)
            reject(e)
          }
        })
      })
      return callback
    },
    dcrmConfimAddr: function (address, coin, pwd) {
      let sendData = {}
      let callback
      sendData = {
        from: address,
        pwd: pwd,
        data: 'DCRMCONFIRMADDR:' + address + ':' + coin
      }
      callback = new Promise(function (resolve) {
        new SendTransactionPub(that, sendData).then(function (res) {
          resolve(res)
        })
      })
      return callback
    },
    dcrmGetAddr: function (coinbase, coin) {
      let inputdata = {
        params: [coinbase, coin],
        method: 'lilo_dcrmGetAddr',
        jsonrpc: '2.0',
        id: ++idInit
      }
      let callback = new Promise(function (resolve, reject) {
        $.ajax({
          url: providers,
          type: 'post',
          data: JSON.stringify(inputdata),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            if (data && data.result) {
              let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
              sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
              resolve($data)
            } else if (data && data.error) {
              reject(data)
            }
          },
          error: function (e) {
            console.log('error', e)
            reject(e)
          }
        })
      })
      return callback
    },
    dcrmLockin: function (txhax, value, coin) {
      let inputdata = {
        params: [txhax, value, coin],
        method: 'lilo_dcrmLockin',
        jsonrpc: '2.0',
        id: ++idInit
      }
      let callback = new Promise(function (resolve, reject) {
        $.ajax({
          url: providers,
          type: 'post',
          data: JSON.stringify(inputdata),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            if (data && data.result) {
              let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
              resolve($data)
            } else if (data && data.error) {
              reject(data)
            }
          },
          error: function (e) {
            console.log('error', e)
            reject(e)
          }
        })
      })
      return callback
    },
    dcrmGetBalance: function (fromAddress, coin) {
      let inputdata = {
        params: [fromAddress, coin],
        method: 'lilo_dcrmGetBalance123',
        jsonrpc: '2.0',
        id: ++idInit
      }
      let callback = new Promise(function (resolve, reject) {
        $.ajax({
          url: providers,
          type: 'post',
          data: JSON.stringify(inputdata),
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
            if (data && data.result) {
              let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
              resolve($data)
            } else if (data && data.error) {
              reject(data)
            }
          },
          error: function (e) {
            console.log('error', e)
            reject(e)
          }
        })
      })
      return callback
    },
    dcrmSendTransaction: function (toAddress, value, coin, pwd) {
      let fromAddress = sessionStorage.getItem('dcrmFromAddress')
      let sendData = {
        from: fromAddress,
        to: toAddress,
        value: value,
        pwd: pwd,
        data: 'LOCKOUT:' + toAddress + ':' + value + ':' + coin
      }
      let callback
      if (!fromAddress) {
        that.lilo.dcrmGetAddr(sessionStorage.getItem('localFromAddress'), coin).then(function (val) {
          sendData.from = val
          callback = new Promise(function (resolve) {
            new SendTransactionPub(that, sendData).then(function (res) {
              resolve(res)
            })
          })
        })
      } else {
        callback = new Promise(function (resolve) {
          new SendTransactionPub(that, sendData).then(function (res) {
            resolve(res)
          })
        })
      }
      return callback
    },
    dcrmLockout: function (toAddress, value, coin, pwd) {
      let fromAddress = sessionStorage.getItem('dcrmFromAddress')
      let sendData = {
        from: fromAddress,
        to: toAddress,
        value: value,
        pwd: pwd,
        data: 'LOCKOUT:' + toAddress + ':' + value + ':' + coin
      }
      let callback
      if (!fromAddress) {
        that.lilo.dcrmGetAddr(sessionStorage.getItem('localFromAddress'), coin).then(function (val) {
          sendData.from = val
          callback = new Promise(function (resolve) {
            new SendTransactionPub(that, sendData).then(function (res) {
              resolve(res)
            })
          })
        })
      } else {
        callback = new Promise(function (resolve) {
          new SendTransactionPub(that, sendData).then(function (res) {
            resolve(res)
          })
        })
      }
      return callback
    }
  }
  return this
  // return this.returnWeb3
}
(function () {
  let Super = function () {}
  Super.prototype = Web3.prototype
  newWeb3.prototype = new Super()
})()

// newWeb3.prototype = new Web3()

function SendTransactionPub (that, data) {
  let rawTx = {
    nonce: data.nonce ? data.nonce : that.eth.getTransactionCount(data.from, 'pending'),
    gasPrice: data.gasPrice ? Number(data.gasPrice) : Number(that.eth.gasPrice.toString(10)),
    gasLimit: data.gasLimit ? Number(data.gasLimit) : Number(21000),
    from: data.from,
    to: data.to ? data.to : '0x00000000000000000000000000000000000000dc',
    value: data.value ? Number(data.value) : 0,
    data: data.data ? data.data : ''
  }
  let Tx = require('ethereumjs-tx')
  data.pwd = data.pwd.indexOf('0x') === 0 ? data.pwd.substr(2) : data.pwd
  let privateKey = new Buffer(data.pwd, 'hex')
  let tx = new Tx(rawTx)
  tx.sign(privateKey)
  let serializedTx = tx.serialize()
  let serializedTxString = serializedTx.toString('hex')
  serializedTxString = serializedTxString.indexOf('0x') === 0 ? serializedTxString : ('0x' + serializedTxString)
  let callback = new Promise(function (resolve, reject) {
    that.eth.sendRawTransaction(serializedTxString, function (err, hash) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        // console.log(hash)
        resolve(hash)
      }
    })
  })
  return callback
}

// newWeb3.lilo.dcrmGetBalance = function () {
//   this.getBlock(12)
// }
export default newWeb3
