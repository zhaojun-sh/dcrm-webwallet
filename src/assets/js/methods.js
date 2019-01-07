let $$ = {};

let idNum = 0;
// $$.baseUrl = 'http://54.169.254.177:40415'
// $$.baseUrl = 'http://54.164.7.63:40415'
// $$.baseUrl = window.location.protocol + '//54.164.7.63:40445'
// $$.baseUrl = window.location.protocol + "//api.dcrm.network";

if (process.env.NODE_ENV == "development") {
  $$.baseUrl = "/api";
} else {
  $$.baseUrl = window.location.protocol + "//api.dcrm.network";
}
// $$.baseUrl = 'http://10.192.32.92:40445'
// $$.baseUrl = 'http://47.92.255.230:40415/'

// $$.serverURL = 'http://localhost:8087'
// $$.serverURL = 'http://localhost:8085'
// $$.serverURL = 'https://localhost:8085'
// $$.serverURL = 'http://54.164.7.63:8087'
// $$.serverURL = 'https://wallet.dcrm.network:8085'
// $$.serverURL = window.location.protocol + '//wallet.dcrm.network:8087'
$$.serverURL = window.location.protocol + "//wallet.dcrm.network:8085";

$$.thousandBit = (num, dec = 2) => {
  num = Number(num);
  if (isNaN(num)) {
    num = 0;
    num = num.toFixed(dec);
  } else {
    if (isNaN(dec)) {
      // console.log(num)
      if (num.toString().indexOf(".") === -1) {
        num = num
          .toLocaleString()
          .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
          .toLocaleString();
      } else {
        let numSplit = num.toString().split(".");
        numSplit[1] =
          numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1];
        // console.log(numSplit)
        num = numSplit[0]
          .toLocaleString()
          .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
          .toLocaleString();
        num = num + "." + numSplit[1];
      }
    } else {
      num = num
        .toFixed(dec)
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toLocaleString();
    }
  }
  return num;
};

$$.thousandChange = function(num, dec) {
  num = this.thousandToNum(num);
  return this.thousandBit(num, dec);
};

$$.thousandToNum = num => {
  // console.log(num)
  return num.toString().replace(/,/, "");
};

$$.bigNumber = num => {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
};

$$.timeChange = data => {
  let time = data.date ? new Date(data.date) : new Date();
  let formatType = data.format ? data.format : "/";
  let Y = time.getFullYear();
  let M =
    time.getMonth() + 1 < 10
      ? "0" + (time.getMonth() + 1)
      : time.getMonth() + 1;
  let D = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  let h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  let m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  let s = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  // console.log(Date.parse(data.date))
  // console.log(new Date(Date.parse(data.date)).getDate())
  if (data.type === "yyyy-mm-dd") {
    time = Y + formatType + M + formatType + D;
  } else if (data.type === "yyyy-mm-dd hh:mm") {
    time = Y + formatType + M + formatType + D + " " + h + ":" + m;
  } else if (data.type === "yyyy-mm-dd hh:mm:ss") {
    time = Y + formatType + M + formatType + D + " " + h + ":" + m + ":" + s;
  } else if (data.type === "yyyy-mm-dd hh") {
    time = Y + formatType + M + formatType + D + " " + h;
  } else if (data.type === "yyyy-mm") {
    time = Y + formatType + M;
  } else if (data.type === "yyyy") {
    time = Y;
  }
  return time;
};

// 提示弹框
$$.layerMsg = layer => {
  let data = {
    tip: layer.tip,
    time: layer.time ? layer.time : 3000,
    bgColor: layer.bgColor ? layer.bgColor : "rgba(0,0,0,.8)",
    icon: layer.icon ? layer.icon : ""
  };
  // console.log(layer)
  // console.log((typeof layer).toLowerCase())
  if ((typeof layer).toLowerCase() !== "object".toLowerCase()) {
    data = {
      tip: layer,
      time: 3000,
      bgColor: "rgba(0,0,0,.8)",
      icon: ""
    };
  }
  let _div = document.createElement("div");
  let _span = document.createElement("span");
  let _i = document.createElement("i");
  _div.id = "layer-tip";
  _div.style.position = "fixed";
  _div.style.bottom = "0";
  _div.style.left = "0";
  _div.style.width = document.body.clientWidth + "px";
  // _div.style.height = document.body.clientHeight + 'px'
  _div.style.display = "flex";
  _div.style.justifyContent = "center";
  _div.style.alignItems = "flex-end";
  _div.style.zIndex = "99999";

  if (data.icon) {
    _span.innerHTML =
      '<img src="' +
      data.icon +
      '" width=16 height=16 style="margin-right:10px">' +
      data.tip;
  } else {
    _span.innerHTML = data.tip;
  }
  _span.display = "block";
  // _span.style.padding = '10px 15px'
  _span.style.backgroundColor = data.bgColor;
  _span.style.color = "#fff";
  // _span.style.maxWidth = '90%'
  _span.style.width = "100%";
  // _span.style.height = '55px'
  _span.style.lineHeight = "22px";
  _span.style.display = "flex";
  _span.style.justifyContent = "center";
  _span.style.alignItems = "center";
  _span.style.position = "relative";
  // _span.style.paddingRight = '144px'
  _span.style.padding = "18px 144px 18px 15px";
  _span.style.fontSize = "16px";

  _i.innerHTML =
    '<img src="' + require("../image/Close.svg") + '" width=15 height=15>';
  _i.style.width = "144px";
  _i.style.height = "100%";
  _i.style.position = "absolute";
  _i.style.top = "0";
  _i.style.right = "0";
  _i.style.display = "flex";
  _i.style.justifyContent = "center";
  _i.style.alignItems = "center";
  _i.style.borderLeft = "1px solid rgba(255,255,255,.7)";
  _i.style.cursor = "pointer";
  _i.onclick = () => {
    document.body.removeChild(_div);
  };
  _span.appendChild(_i);
  _div.appendChild(_span);

  window.onresize = function() {
    _div.style.width = document.body.clientWidth + "px";
    _div.style.height = document.body.clientHeight + "px";
  };
  document.body.appendChild(_div);
  setTimeout(function() {
    var hideCount = 10;
    var hideOpcity = setInterval(function() {
      hideCount--;
      _div.style.opacity = hideCount / 10;
      if (hideCount < 0) {
        window.clearInterval(hideOpcity);
        if ($("#layer-tip").length > 0) {
          document.body.removeChild(_div);
        }
      }
    }, 10);
  }, data.time);
};

$$.showSearchTop = () => {
  const hideSearchURL = [
    "biticonView",
    "createWallet",
    "importWallet",
    "saveKeystore"
  ];
  let toPath = location.href.toUpperCase();
  for (let i = 0; i < hideSearchURL.length; i++) {
    if (
      toPath.indexOf(hideSearchURL[i].toUpperCase()) !== -1 ||
      toPath.lastIndexOf("/") === toPath.length - 1
    ) {
      $("#topSearchView").show();
      $("#topSetView").hide();
      break;
    } else {
      $("#topSearchView").hide();
      $("#topSetView").show();
    }
  }
};

$$.getBlob = (mime, str) => {
  var _typeof =
    typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
      ? function(obj) {
          return typeof obj;
        }
      : function(obj) {
          return obj &&
            typeof Symbol === "function" &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? "symbol"
            : typeof obj;
        };
  var str1 =
    (typeof str === "undefined" ? "undefined" : _typeof(str)) === "object"
      ? JSON.stringify(str)
      : str;
  if (str1 == null) return "";
  var blob = new Blob([str1], {
    type: mime
  });
  return window.URL.createObjectURL(blob);
};

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

$$.loadingStart = data => {
  let initData = {
    img: require("../image/wait.svg"),
    color: "#999",
    txt: data !== undefined ? data : "Loading……"
  };

  if ((typeof data).toLowerCase() === "object") {
    initData = {
      img: data.img ? data.img : require("../image/wait.svg"),
      color: data.color ? data.color : "#999",
      txt: data.img ? data.txt : "Loading……"
    };
  }

  let _div = document.createElement("div");
  _div.className = "OnLodaing";
  _div.style.width = "100vw";
  _div.style.height = "100vh";
  _div.style.position = "fixed";
  _div.style.top = "0";
  _div.style.left = "0";
  _div.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
  _div.style.zIndex = "99999";
  _div.style.display = "flex";
  _div.style.justifyContent = "center";
  _div.style.alignItems = "center";

  let _Load = document.createElement("div");
  _Load.innerHTML =
    '<div class="rotateLoad"><img src="' +
    initData.img +
    '" /></div><p style="margin-top:15px;font-size:16px;font-weight:bold;color:#333;padding-left:12px;' +
    initData.color +
    '">' +
    initData.txt +
    "</p>";
  _Load.style.textAlign = "center";
  // let _img = ''

  _div.appendChild(_Load);
  document.body.appendChild(_div);
};

$$.loadingEnd = () => {
  // document.getElementsByClassName('OnLodaing').remove()
  $(".OnLodaing").remove();
};
$$.loadingEndIndex = () => {
  // document.getElementsByClassName('OnLodaing').remove()
  $(".OnLodaingIndex").remove();
  // console.log($('.OnLodaingIndex'))
};

$$.limitCoin = function(num, limit, type) {
  let callback = {
    flag: true,
    msg: ""
  };
  if (num < limit) {
    callback = {
      flag: true,
      msg: "The amount cannot be less than " + limit
    };
  } else if (
    type &&
    type === "INT" &&
    Number(num)
      .toString()
      .indexOf(".") !== -1
  ) {
    callback = {
      flag: true,
      msg: "Please enter an integer"
    };
  } else {
    callback = {
      flag: false,
      msg: ""
    };
  }
  return callback;
};

$$.web3 = function(data) {
  let that = this;
  // console.log(data)
  let dataInit = {
    id: ++idNum,
    jsonrpc: "2.0",
    method: data.method,
    params: data.params
  };
  // console.log(dataInit)
  let callback = new Promise(function(resolve) {
    $.ajax({
      url: that.baseUrl,
      type: "post",
      datatype: "json",
      contentType: "application/json",
      data: JSON.stringify(dataInit),
      success: function(res) {
        resolve(res);
      },
      error: function(res) {
        resolve(res);
      }
    });
  });
  return callback;
  // console.log($('body'))
};

$$.getWeb3 = function(data) {
  let that = this;
  // console.log(data)
  let dataInit = {
    id: ++idNum,
    jsonrpc: "2.0",
    method: data.method,
    params: data.params
  };
  // console.log(dataInit)
  let callback = function() {
    let callbackData;
    $.ajax({
      url: that.baseUrl,
      type: "post",
      datatype: "json",
      contentType: "application/json",
      data: JSON.stringify(dataInit),
      async: false,
      success: function(res) {
        callbackData = res;
        // console.log(res)
      },
      error: function(res) {
        callbackData = res;
      }
    });
    return callbackData;
  };
  return callback();
};

// import Lilo from 'lilo'
// let Lilo = require('Lilo')
$$.setWeb3 = function(vueWeb3) {
  let that = this;
  let Web3 = require("web3");
  let web3;
  try {
    web3 = new Web3(new Web3.providers.HttpProvider(that.baseUrl));
  } catch (error) {
    web3 = new Web3();
    console.log(error);
  }
  vueWeb3.web3 = web3;
  // vueWeb3.newWeb3 = new Lilo(that.baseUrl)
};

export default $$;
