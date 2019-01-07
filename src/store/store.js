import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    keystoreURL: "",
    privateKey: "",
    publicKey: "",
    addressInfo: "",
    downloadName: "",
    coinAndUrl: [
      {
        url: "http://54.164.7.63:40415",
        value: "FSN",
        limit: 0.001,
        number: "FLOAT",
        token: ""
      },
      {
        url: "http://54.164.7.63:40415",
        value: "BTC",
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        url: "http://54.164.7.63:40415",
        value: "ETH",
        limit: 0.001,
        number: "FLOAT",
        token: "txlist"
      },
      {
        url: "http://54.164.7.63:40415",
        value: "BNB",
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        url: "http://54.164.7.63:40415",
        value: "MKR",
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        url: "http://54.164.7.63:40415",
        value: "GUSD",
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        url: "http://54.164.7.63:40415",
        value: "HT",
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        url: "http://54.164.7.63:40415",
        value: "BNT",
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      }
    ],
    coinInfo: [
      {
        coin: "FSN",
        coinAll: "Fusion",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: true,
        logo: require("@/assets/image/fsn.svg"),
        limit: 0.001,
        number: "FLOAT",
        token: ""
      },
      {
        coin: "BTC",
        coinAll: "Bitcoin",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: false,
        logo: require("@/assets/image/btc.svg"),
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        coin: "ETH",
        coinAll: "Ethereum",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: false,
        logo: require("@/assets/image/eth.svg"),
        limit: 0.001,
        number: "FLOAT",
        token: "txlist"
      },
      {
        coin: "BNB",
        coinAll: "Binance",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: false,
        logo: require("@/assets/image/bnb.svg"),
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        coin: "MKR",
        coinAll: "Maker",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: false,
        logo: require("@/assets/image/mkr.svg"),
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        coin: "GUSD",
        coinAll: "Gemini Dollar",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: false,
        logo: require("@/assets/image/gusd.svg"),
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        coin: "HT",
        coinAll: "HuobiToken",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: false,
        logo: require("@/assets/image/ht.svg"),
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      },
      {
        coin: "BNT",
        coinAll: "Bancor",
        balance: 0,
        balanceDoller: 0,
        freeze: 0,
        flag: false,
        logo: require("@/assets/image/bnt.svg"),
        limit: 0,
        number: "FLOAT",
        token: "tokentx"
      }
    ],
    walletLoadFlag: true,
    dcrmAddress: ""
  },
  mutations: {
    storeKeystoreURL(state, url) {
      state.keystoreURL = url;
    },
    storePrivateKey(state, key) {
      state.privateKey = key;
    },
    storePubliceKey(state, key) {
      state.publicKey = key;
    },
    storeAddress(state, address) {
      state.addressInfo = address;
    },
    storeDownload(state, address) {
      state.downloadName = address;
    },
    storeDcrmAddress(state, address) {
      state.dcrmAddress = address;
    },
    storeCoinInfo(state, data) {
      // console.log(data)
      for (let i = 0; i < state.coinInfo.length; i++) {
        if (data.coin === state.coinInfo[i].coin) {
          state.coinInfo[i].balance = data.balance;
          state.coinInfo[i].balanceDoller = data.balanceDoller;
          state.coinInfo[i].flag = data.flag;
        }
      }
    },
    storeWalletLoadFlag(state, data) {
      state.walletLoadFlag = data;
    }
  }
});

export default store;
