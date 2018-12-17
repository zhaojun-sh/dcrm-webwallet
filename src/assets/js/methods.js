let $$ = {}
// $$.baseUrl = 'https://mainnet.infura.io/'
// $$.baseUrl = 'https://rinkeby.etherscan.io/api'
// $$.baseUrl = 'http://47.92.168.85:40405/'
// $$.baseUrl = 'http://54.169.254.177:40415'// FSN
$$.baseUrl = 'http://47.92.255.230:8111'// FSN
// $$.baseUrl = 'http://54.183.185.30:8018'// 以太坊
// $$.baseUrl = 'http://47.92.255.230:40415/' //

$$.serverURL = 'http://localhost:8081'

$$.thousandBit = (num, dec = 2) => {
  num = Number(num)
  if (isNaN(num)) {
    num = 0
    num = num.toFixed(dec)
  } else {
    if (isNaN(dec)) {
      num = num.toLocaleString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    } else {
      num = num.toFixed(dec).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
    }
  }
  return num
}

$$.thousandChange = function (num, dec) {
  num = this.thousandToNum(num)
  return this.thousandBit(num, dec)
}

$$.thousandToNum = (num) => {
  return num.replace(/,/, '')
}

$$.bigNumber = (num) => {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}

$$.timeChange = (data) => {
  let time = data.date ? new Date(data.date) : new Date()
  let formatType = data.format ? data.format : '/'
  let Y = time.getFullYear()
  let M = (time.getMonth() + 1) < 10 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)
  let D = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate()
  let h = time.getHours()
  let m = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes()
  let s = time.getSeconds() < 10 ? ('0' + time.getSeconds()) : time.getSeconds()
  // console.log(Date.parse(data.date))
  // console.log(new Date(Date.parse(data.date)).getDate())
  if (data.type === 'yyyy-mm-dd') {
    time = Y + formatType + M + formatType + D
  } else if (data.type === 'yyyy-mm-dd hh:mm') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
  } else if (data.type === 'yyyy-mm-dd hh:mm:ss') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m + ':' + s
  } else if (data.type === 'yyyy-mm-dd hh') {
    time = Y + formatType + M + formatType + D + ' ' + h
  } else if (data.type === 'yyyy-mm') {
    time = Y + formatType + M
  } else if (data.type === 'yyyy') {
    time = Y
  }
  return time
}

// 提示弹框
$$.layerMsg = (layer) => {
  let data = {
    tip: layer.tip,
    time: layer.time ? layer.time : 3000,
    bgColor: layer.bgColor ? layer.bgColor : 'rgba(0,0,0,.8)',
    icon: layer.icon ? layer.icon : ''
  }
  // console.log(layer)
  // console.log((typeof layer).toLowerCase())
  if ((typeof layer).toLowerCase() !== 'object'.toLowerCase()) {
    data = {
      tip: layer,
      time: 3000,
      bgColor: 'rgba(0,0,0,.8)',
      icon: ''
    }
  }
  let _div = document.createElement('div')
  let _span = document.createElement('span')
  let _i = document.createElement('i')
  _div.id = 'layer-tip'
  _div.style.position = 'fixed'
  _div.style.bottom = '0'
  _div.style.left = '0'
  _div.style.width = document.body.clientWidth + 'px'
  // _div.style.height = document.body.clientHeight + 'px'
  _div.style.display = 'flex'
  _div.style.justifyContent = 'center'
  _div.style.alignItems = 'flex-end'
  _div.style.zIndex = '99999'

  if (data.icon) {
    _span.innerHTML = '<img src="' + data.icon + '" width=16 height=16 style="margin-right:10px">' + data.tip
  } else {
    _span.innerHTML = data.tip
  }
  _span.display = 'block'
  // _span.style.padding = '10px 15px'
  _span.style.backgroundColor = data.bgColor
  _span.style.color = '#fff'
  // _span.style.maxWidth = '90%'
  _span.style.width = '100%'
  // _span.style.height = '55px'
  _span.style.lineHeight = '22px'
  _span.style.display = 'flex'
  _span.style.justifyContent = 'center'
  _span.style.alignItems = 'center'
  _span.style.position = 'relative'
  // _span.style.paddingRight = '144px'
  _span.style.padding = '18px 144px 18px 15px'
  _span.style.fontSize = '16px'

  _i.innerHTML = '<img src="' + require('../image/Close.svg') + '" width=15 height=15>'
  _i.style.width = '144px'
  _i.style.height = '100%'
  _i.style.position = 'absolute'
  _i.style.top = '0'
  _i.style.right = '0'
  _i.style.display = 'flex'
  _i.style.justifyContent = 'center'
  _i.style.alignItems = 'center'
  _i.style.borderLeft = '1px solid rgba(255,255,255,.7)'
  _i.style.cursor = 'pointer'
  _i.onclick = () => {
    document.body.removeChild(_div)
  }
  _span.appendChild(_i)
  _div.appendChild(_span)

  window.onresize = function () {
    _div.style.width = document.body.clientWidth + 'px'
    _div.style.height = document.body.clientHeight + 'px'
  }
  document.body.appendChild(_div)
  setTimeout(function () {
    var hideCount = 10
    var hideOpcity = setInterval(function () {
      hideCount--
      _div.style.opacity = hideCount / 10
      if (hideCount < 0) {
        window.clearInterval(hideOpcity)
        if ($('#layer-tip').length > 0) {
          document.body.removeChild(_div)
        }
      }
    }, 10)
  }, data.time)
}

$$.showSearchTop = () => {
  const hideSearchURL = ['biticonView', 'createWallet', 'importWallet', 'saveKeystore']
  let toPath = location.href.toUpperCase()
  for (let i = 0; i < hideSearchURL.length; i++) {
    if (toPath.indexOf(hideSearchURL[i].toUpperCase()) !== -1 || toPath.lastIndexOf('/') === (toPath.length - 1)) {
      $('#topSearchView').show()
      $('#topSetView').hide()
      break
    } else {
      $('#topSearchView').hide()
      $('#topSetView').show()
    }
  }
}

$$.getBlob = (mime, str) => {
  var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { 
    return typeof obj
  } : function (obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
  }
  var str1 = (typeof str === 'undefined' ? 'undefined' : _typeof(str)) === 'object' ? JSON.stringify(str) : str
  if (str1 == null) return ''
  var blob = new Blob([str1], {
    type: mime
  })
  return window.URL.createObjectURL(blob)
}

// $$.web3 = function () {
//   var Web3 = require('web3')
//   if (typeof web3 !== 'undefined') {
//     Web3 = new Web3(Web3.currentProvider)
//   } else {
//     // set the provider you want from Web3.providers
//     // Web3 = new Web3(new Web3.providers.HttpProvider('http://47.107.50.83:8000/'))
//     Web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/'))
//   }
//   return Web3
// }
// $$.web3 = require('web3')

// $('.moreInfo_box').on('click', '.moreInfo_hax', function () {
//   console.log(123)
// })

export default $$
