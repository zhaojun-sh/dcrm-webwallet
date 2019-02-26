// console.log($ajax)
function newWeb3 (providers) {
  let idInit = 0
  this.lilo = {
    dcrmReqAddr: function (fromAddress, coin) {
      let inputdata = {
        params: [fromAddress, coin],
        method: 'lilo_dcrmReqAddr',
        jsonrpc: '2.0',
        id: ++idInit
      }
      let callback = new Promise(function (resolve) {
        $ajax.post(providers, Qs.stringify(inputdata), {
          headers: {'Content-Type': 'application/json'}
        }).then(data => {
          data = data.data
          if (data && data.result) {
            if (data.result.indexOf('{') === 0) {
              let $data = JSON.parse(data.result)
              sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
              resolve($data.DcrmAddr)
            } else {
              resolve(data)
            }
          } else if (data && data.error) {
            resolve(data)
          }
        })
        // $.ajax({
        //   url: providers,
        //   type: 'post',
        //   data: JSON.stringify(inputdata),
        //   dataType: 'json',
        //   contentType: 'application/json',
        //   success: function (data) {
        //     if (data && data.result) {
        //       if (data.result.indexOf('{') === 0) {
        //         let $data = JSON.parse(data.result)
        //         sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
        //         resolve($data.DcrmAddr)
        //       } else {
        //         resolve(data)
        //       }
        //     } else if (data && data.error) {
        //       resolve(data)
        //     }
        //   },
        //   error: function (e) {
        //     console.log('error', e)
        //     resolve(e)
        //   }
        // })
      })
      return callback
    },
    dcrmConfimAddr: function (data, coin) {
      let inputdata = {
        params: [data, coin],
        method: 'lilo_dcrmConfirmAddr',
        jsonrpc: '2.0',
        id: ++idInit
      }
      let callback = new Promise(function (resolve) {
        $ajax.post(providers, Qs.stringify(inputdata), {
          headers: {'Content-Type': 'application/json'}
        }).then(data => {
          data = data.data
          if (data && data.result) {
            if (data.result.indexOf('{') === 0) {
              let $data = JSON.parse(data.result)
              sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
              resolve($data.DcrmAddr)
              // that.lilo.dcrmConfimAddr($data.DcrmAddr, coin, pwd).then(function (val) {
              //   resolve(val)
              // })
            } else {
              resolve(data)
            }
          } else if (data && data.error) {
            resolve(data)
          }
        })
        // $.ajax({
        //   url: providers,
        //   type: 'post',
        //   data: JSON.stringify(inputdata),
        //   dataType: 'json',
        //   contentType: 'application/json',
        //   success: function (data) {
        //     if (data && data.result) {
        //       if (data.result.indexOf('{') === 0) {
        //         let $data = JSON.parse(data.result)
        //         sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
        //         resolve($data.DcrmAddr)
        //         // that.lilo.dcrmConfimAddr($data.DcrmAddr, coin, pwd).then(function (val) {
        //         //   resolve(val)
        //         // })
        //       } else {
        //         resolve(data)
        //       }
        //     } else if (data && data.error) {
        //       resolve(data)
        //     }
        //   },
        //   error: function (e) {
        //     console.log('error', e)
        //     resolve(e)
        //   }
        // })
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
        $ajax.post(providers, Qs.stringify(inputdata), {
          headers: {'Content-Type': 'application/json'}
        }).then(data => {
          data = data.data
          if (data && data.result) {
            let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
            sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
            // console.log(1)
            resolve($data)
          } else {
            // console.log(2)
            resolve(data.result)
          }
        })
        // $.ajax({
        //   url: providers,
        //   type: 'post',
        //   data: JSON.stringify(inputdata),
        //   dataType: 'json',
        //   contentType: 'application/json',
        //   success: function (data) {
        //     // console.log(data)
        //     if (data && data.result) {
        //       let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
        //       sessionStorage.setItem('dcrmFromAddress', $data.DcrmAddr)
        //       // console.log(1)
        //       resolve($data)
        //     } else {
        //       // console.log(2)
        //       resolve(data.result)
        //     }
        //     // console.log(3)
        //   },
        //   error: function (e) {
        //     console.log('error', e)
        //     resolve(e)
        //   }
        // })
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
        $ajax.post(providers, Qs.stringify(inputdata), {
          headers: {'Content-Type': 'application/json'}
        }).then(data => {
          data = data.data
          if (data && data.result) {
            let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
            resolve($data)
          } else if (data && data.error) {
            reject(data)
          }
        })
        // $.ajax({
        //   url: providers,
        //   type: 'post',
        //   data: JSON.stringify(inputdata),
        //   dataType: 'json',
        //   contentType: 'application/json',
        //   success: function (data) {
        //     if (data && data.result) {
        //       let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
        //       resolve($data)
        //     } else if (data && data.error) {
        //       reject(data)
        //     }
        //   },
        //   error: function (e) {
        //     console.log('error', e)
        //     reject(e)
        //   }
        // })
      })
      return callback
    },
    dcrmGetBalance: function (fromAddress, coin) {
      let inputdata = {
        params: [fromAddress, coin],
        method: 'lilo_dcrmGetBalance',
        jsonrpc: '2.0',
        id: ++idInit
      }
      let callback = new Promise(function (resolve, reject) {
        $ajax.post(providers, Qs.stringify(inputdata), {
          headers: {'Content-Type': 'application/json'}
        }).then(data => {
          data = data.data
          if (data && data.result) {
            let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
            resolve($data)
          } else if (data && data.error) {
            resolve(data)
          }
        })
        // $.ajax({
        //   url: providers,
        //   type: 'post',
        //   data: JSON.stringify(inputdata),
        //   dataType: 'json',
        //   contentType: 'application/json',
        //   success: function (data) {
        //     if (data && data.result) {
        //       let $data = data.result.indexOf('{') === 0 ? JSON.parse(data.result) : data.result
        //       resolve($data)
        //     } else if (data && data.error) {
        //       resolve(data)
        //     }
        //   },
        //   error: function (e) {
        //     console.log('error', e)
        //     resolve(e)
        //   }
        // })
      })
      return callback
    }
  }
  return this
  // return this.returnWeb3
}

export default newWeb3
