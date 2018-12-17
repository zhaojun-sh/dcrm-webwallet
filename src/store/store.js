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
    coinAndUrl: [
      {url: 'http://54.169.254.177:40415', value: 'FSN'},
      {url: '', value: 'BTC'},
      {url: 'http://47.92.255.230:8111', value: 'ETH'},
      {url: '', value: 'BNB'}
    ],
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
    }
  }
})

export default store
