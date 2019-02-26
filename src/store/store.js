import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginType: [],
    keystoreURL: '',
    addressInfo: '',
    downloadName: '',
    coinInfo: require('@etc/js/config/coinIfno').coininfo,
    walletLoadFlag: true,
    ledger: '',
    trezor: '',
    HDpath: '',
    network: {},
    safeMode: false
  },
  mutations: {
    storeLoginType (state, data) {
      state.loginType = data
    },
    storeKeystoreURL (state, url) {
      state.keystoreURL = url
    },
    storeAddress (state, address) {
      state.addressInfo = address
    },
    storeDownload (state, address) {
      state.downloadName = address
    },
    storeCoinInfo (state, data) {
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
    },
    storeLedger (state, data) {
      state.ledger = data
    },
    storeTrezor (state, data) {
      state.trezor = data
    },
    storeHDpath (state, data) {
      state.HDpath = data
    },
    storeNetwork (state, data) {
      state.network = data
    },
    storeSafeMode (state, data) {
      state.safeMode = data
    }
  }
})

export default store
