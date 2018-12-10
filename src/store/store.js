import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    keystoreURL: '',
    privateKey: '',
    publicKey: '',
    addressInfo: '',
    downloadName: ''
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
    }
  }
})

export default store
