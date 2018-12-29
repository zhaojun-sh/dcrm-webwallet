import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'
// import $$ from '../assets/js/methods'
// import index from '@/components/web/page/index'

// import biticonView from '@/components/web/page/createWallet/index'
// import createWallet from '@/components/web/page/createWallet/create'
// import saveKeystore from '@/components/web/page/createWallet/savekeystore'
// import importWallet from '@/components/web/page/createWallet/import'

// import navLeft from '@/components/web/page/nav'
// import myAssets from '@/components/web/page/myAssets/index'

// import transfer from '@/components/web/page/transfer/index'
// import tranReceive from '@/components/web/page/transfer/receive'
// import tranSend from '@/components/web/page/transfer/send'

// import lilo from '@/components/web/page/lilo/index'
// import coinList from '@/components/web/page/lilo/coinList'
// import lockIn from '@/components/web/page/lilo/lockIn'
// import lockOut from '@/components/web/page/lilo/lockOut'
// import lockNav from '@/components/web/page/lilo/lockNav'

// import dapp from '@/components/web/page/dapp/index'

// import pwdSure from '@/components/web/page/public/pwdSure'
// import loading from '@/components/web/page/public/loading'

// import backupWallet from '@/components/web/page/backupWallet/index'
// import backupSure from '@/components/web/page/backupWallet/backupSure'

Vue.use(Router)

const routers = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      // name: 'index',
      component: resolve => require(['@/components/web/page/index'], resolve), // index,
      children: [
        {
          path: '/',
          component: resolve => require(['@/components/web/page/createWallet/index'], resolve) // biticonView
        }, {
          path: '/biticonView',
          name: 'biticonView',
          component: resolve => require(['@/components/web/page/createWallet/index'], resolve) // biticonView
        }, {
          path: '/createWallet',
          name: 'createWallet',
          component: resolve => require(['@/components/web/page/createWallet/create'], resolve) // createWallet
        }, {
          path: '/importWallet',
          name: 'importWallet',
          component: resolve => require(['@/components/web/page/createWallet/import'], resolve) // importWallet
        }, {
          path: '/saveKeystore',
          name: 'saveKeystore',
          component: resolve => require(['@/components/web/page/createWallet/savekeystore'], resolve) // saveKeystore
        }, {
          path: '/backupSure',
          name: 'backupSure',
          component: resolve => require(['@/components/web/page/backupWallet/backupSure'], resolve) // backupSure
        }, {
          path: '/nav',
          // name: 'nav',
          component: resolve => require(['@/components/web/page/nav'], resolve), // navLeft,
          children: [
            {
              path: '/',
              component: resolve => require(['@/components/web/page/myAssets/index'], resolve) // myAssets
            }, {
              path: '/MyAssets',
              name: 'MyAssets',
              component: resolve => require(['@/components/web/page/myAssets/index'], resolve), // myAssets,
              children: [
                {
                  path: '/pwdMyAssets',
                  component: resolve => require(['@/components/web/page/public/pwdSure'], resolve) // pwdSure
                }
              ]
            }, {
              path: '/Transfer',
              // name: 'Transfer',
              component: resolve => require(['@/components/web/page/transfer/index'], resolve), // transfer,
              children: [
                {
                  path: '/',
                  component: resolve => require(['@/components/web/page/transfer/receive'], resolve) // tranReceive
                }, {
                  path: '/Transfer/tranReceive',
                  name: 'tranReceive',
                  component: resolve => require(['@/components/web/page/transfer/receive'], resolve) // tranReceive
                }, {
                  path: '/Transfer/tranSend',
                  name: 'tranSend',
                  component: resolve => require(['@/components/web/page/transfer/send'], resolve), // tranSend,
                  children: [
                    {
                      path: '/pwdSend',
                      component: resolve => require(['@/components/web/page/public/pwdSure'], resolve) // pwdSure
                    }
                  ]
                }
              ]
            }, {
              path: '/LILO',
              // name: 'LILO',
              component: resolve => require(['@/components/web/page/lilo/index'], resolve), // lilo,
              children: [
                {
                  path: '/',
                  component: resolve => require(['@/components/web/page/lilo/coinList'], resolve), // coinList,
                  children: [
                    {
                      path: '/pwdCoinList',
                      component: resolve => require(['@/components/web/page/public/pwdSure'], resolve) // pwdSure
                    }
                  ]
                }, {
                  path: '/lockNav',
                  // name: 'lockNav',
                  component: resolve => require(['@/components/web/page/lilo/lockNav'], resolve), // lockNav,
                  children: [
                    {
                      path: '/',
                      component: resolve => require(['@/components/web/page/lilo/lockIn'], resolve) // lockIn
                    }, {
                      path: '/LILO/lockIn',
                      name: 'lockIn',
                      component: resolve => require(['@/components/web/page/lilo/lockIn'], resolve), // lockIn,
                      children: [
                        {
                          path: '/pwdLockIn',
                          component: resolve => require(['@/components/web/page/public/pwdSure'], resolve) // pwdSure
                        }
                      ]
                    }, {
                      path: '/LILO/lockOut',
                      name: 'lockOut',
                      component: resolve => require(['@/components/web/page/lilo/lockOut'], resolve), // lockOut,
                      children: [
                        {
                          path: '/pwdLockOut',
                          component: resolve => require(['@/components/web/page/public/pwdSure'], resolve) // pwdSure
                        }
                      ]
                    }
                  ]
                }
              ]
            }, {
              path: '/DAPP',
              name: 'DAPP',
              component: resolve => require(['@/components/web/page/dapp/index'], resolve) // dapp
            }, {
              path: '/backupWallet',
              name: 'backupWallet',
              component: resolve => require(['@/components/web/page/backupWallet/index'], resolve) // backupWallet
            }, {
              path: '/loading',
              name: 'loading',
              component: resolve => require(['@/components/web/page/public/loading'], resolve) // loading
            }
          ]
        }
      ]
    }
  ]
})

routers.beforeEach((to, from, next) => {
  const showSearchURL = ['biticonView', 'createWallet', 'importWallet', 'saveKeystore']
  // console.log(this.$store)
  // if (!this.$store.state.storePrivateKey) {
  //   this.$router.push('/')
  // }
  // console.log(store.state.addressInfo)
  // let startTime = Date.parse(new Date())
  // if ($('.OnLodaingIndex').length <= 0) {
  //   $$.loadingStart()
  // }
  // console.log($('.OnLodaingIndex').length)
  if (store.state.addressInfo) {
    next()
    // console.log(1)
  } else {
    if (to.path === '/' || to.path === '/importWallet' || to.path === '/createWallet' || to.path === '/saveKeystore' || to.path === '/backupSure') {
      next()
      // console.log(2)
    } else {
      next('/')
      // console.log(3)
    }
  }
  // console.log(store.state.addressInfo)
  // next()
  let toPath = to.path.toUpperCase()
  if (toPath === '/') {
    $('#topSearchView').show()
    $('#topSetView').hide()
  } else {
    for (let i = 0; i < showSearchURL.length; i++) {
      if (toPath.indexOf(showSearchURL[i].toUpperCase()) !== -1) {
        $('#topSearchView').show()
        $('#topSetView').hide()
        break
      } else {
        $('#topSearchView').hide()
        $('#topSetView').show()
      }
    }
  }
  // let endTime = Date.parse(new Date())
  // let differTime = endTime - startTime
  // let delayTime = 600
  // console.log(differTime)
  // if (differTime > delayTime || toPath === '/loading') {
  //   $$.loadingEnd()
  // } else {
  //   setTimeout(function () {
  //     $$.loadingEnd()
  //   }, delayTime)
  // }
  // next()
})

export default routers
