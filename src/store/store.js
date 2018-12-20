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
      {url: 'http://54.164.7.63:40415', value: 'FSN', limit: 0.001, number: 'FLOAT', token: ''},
      {url: 'http://54.164.7.63:40415', value: 'BTC', limit: 0, number: 'FLOAT', token: 'tokentx'},
      {url: 'http://54.164.7.63:40415', value: 'ETH', limit: 0.001, number: 'FLOAT', token: 'txlist'},
      {url: 'http://54.164.7.63:40415', value: 'BNB', limit: 0, number: 'FLOAT', token: 'tokentx'},
      {url: 'http://54.164.7.63:40415', value: 'MKR', limit: 0, number: 'FLOAT', token: 'tokentx'},
      {url: 'http://54.164.7.63:40415', value: 'GUSD', limit: 0, number: 'FLOAT', token: 'tokentx'},
      {url: 'http://54.164.7.63:40415', value: 'HT', limit: 0, number: 'FLOAT', token: 'tokentx'},
      {url: 'http://54.164.7.63:40415', value: 'BNT', limit: 0, number: 'FLOAT', token: 'tokentx'}
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
