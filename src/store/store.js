import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    keystoreURL: '',
    privateKey: '',
    publicKey: '',
    addressInfo: '',
    downloadName: '',
    coinInfo: [{
      coin: 'FSN',
      coinAll: 'Fusion',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 2, // 0: request; 1: pending; 2: success
      logo: require('../assets/image/fsn.svg'),
      limit: 0.001,
      number: 'FLOAT',
      token: '',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/fusion/'
    }, {
      coin: 'BTC',
      coinAll: 'Bitcoin',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 0,
      logo: require('../assets/image/btc.svg'),
      limit: 0,
      number: 'FLOAT',
      token: 'tokentx',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/bitcoin/'
    }, {
      coin: 'ETH',
      coinAll: 'Ethereum',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 0,
      logo: require('../assets/image/eth.svg'),
      limit: 0.001,
      number: 'FLOAT',
      token: 'txlist',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/ethereum/'
    }, {
      coin: 'BNB',
      coinAll: 'Binance',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 0,
      logo: require('../assets/image/bnb.svg'),
      limit: 0,
      number: 'FLOAT',
      token: 'tokentx',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/binance-coin/'
    }, {
      coin: 'MKR',
      coinAll: 'Maker',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 0,
      logo: require('../assets/image/mkr.svg'),
      limit: 0,
      number: 'FLOAT',
      token: 'tokentx',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/maker/'
    }, {
      coin: 'GUSD',
      coinAll: 'Gemini Dollar',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 0,
      logo: require('../assets/image/gusd.svg'),
      limit: 0,
      number: 'FLOAT',
      token: 'tokentx',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/gemini-dollar/'
    }, {
      coin: 'HT',
      coinAll: 'HuobiToken',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 0,
      logo: require('../assets/image/ht.svg'),
      limit: 0,
      number: 'FLOAT',
      token: 'tokentx',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/huobi-token/'
    }, {
      coin: 'BNT',
      coinAll: 'Bancor',
      balance: 0,
      balanceDollar: 0,
      freeze: 0,
      flag: 0,
      logo: require('../assets/image/bnt.svg'),
      limit: 0,
      number: 'FLOAT',
      token: 'tokentx',
      dollarURL: 'https://api.coinmarketcap.com/v1/ticker/bancor/'
    }],
    walletLoadFlag: true,
    dcrmAddress: ''
  },
  mutations: {
    storeKeystoreURL (state, url) {
      state.keystoreURL = url
    },
    storePrivateKey (state, key) {
      state.privateKey = key
    },
    storePubliceKey (state, key) {
      state.publicKey = key
    },
    storeAddress (state, address) {
      state.addressInfo = address
    },
    storeDownload (state, address) {
      state.downloadName = address
    },
    storeDcrmAddress (state, address) {
      state.dcrmAddress = address
    },
    storeCoinInfo (state, data) {
      // console.log(data)
      for (let i = 0; i < state.coinInfo.length; i++) {
        if (data.coin === state.coinInfo[i].coin) {
          state.coinInfo[i].balance = data.balance
          state.coinInfo[i].balanceDollar = data.balanceDollar
          state.coinInfo[i].flag = data.flag
        }
      }
    },
    storeWalletLoadFlag (state, data) {
      state.walletLoadFlag = data
    }
  }
})

export default store
