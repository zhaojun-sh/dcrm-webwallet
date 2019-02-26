import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'

// const index = resolve => require.ensure([], () => resolve(require('@/components/web/page/index')), 'group-wallet')

const biticonView = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/createWallet/index')), 'group-wallet')
const createWallet = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/createWallet/create')), 'group-wallet')
const saveKeystore = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/createWallet/savekeystore')), 'group-wallet')
const importWallet = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/createWallet/import')), 'group-wallet')

const navLeft = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/nav')), 'group-wallet')
const myAssets = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/myAssets/index')), 'group-wallet')

const transfer = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/transfer/index')), 'group-wallet')
const tranReceive = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/transfer/receive')), 'group-wallet')
const tranSend = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/transfer/send')), 'group-wallet')

const lilo = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/lilo/index')), 'group-wallet')
const coinList = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/lilo/coinList')), 'group-wallet')
const lockIn = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/lilo/lockIn')), 'group-wallet')
const lockOut = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/lilo/lockOut')), 'group-wallet')
const lockNav = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/lilo/lockNav')), 'group-wallet')

const dapp = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/dapp/index')), 'group-wallet')

const pwdSure = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/public/pwdSure')), 'group-wallet')
// const loading = resolve =>
//   require.ensure([], () => resolve(require('@/components/web/page/public/loading')), 'group-wallet')

const backupWallet = resolve =>
  require.ensure([], () => resolve(require('@/components/web/page/backupWallet/index')), 'group-wallet')
// const backupSure = resolve =>
//   require.ensure([], () => resolve(require('@/components/web/page/backupWallet/backupSure')), 'group-wallet')

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

// const index = resolve => require(['@/components/web/page/index'], resolve)

// const biticonView = resolve => require(['@/components/web/page/createWallet/index'], resolve)
// const createWallet = resolve => require(['@/components/web/page/createWallet/create'], resolve)
// const saveKeystore = resolve => require(['@/components/web/page/createWallet/savekeystore'], resolve)
// const importWallet = resolve => require(['@/components/web/page/createWallet/import'], resolve)

// const navLeft = resolve => require(['@/components/web/page/nav'], resolve)
// const myAssets = resolve => require(['@/components/web/page/myAssets/index'], resolve)

// const transfer = resolve => require(['@/components/web/page/transfer/index'], resolve)
// const tranReceive = resolve => require(['@/components/web/page/transfer/receive'], resolve)
// const tranSend = resolve => require(['@/components/web/page/transfer/send'], resolve)

// const lilo = resolve => require(['@/components/web/page/lilo/index'], resolve)
// const coinList = resolve => require(['@/components/web/page/lilo/coinList'], resolve)
// const lockIn = resolve => require(['@/components/web/page/lilo/lockIn'], resolve)
// const lockOut = resolve => require(['@/components/web/page/lilo/lockOut'], resolve)
// const lockNav = resolve => require(['@/components/web/page/lilo/lockNav'], resolve)

// const dapp = resolve => require(['@/components/web/page/dapp/index'], resolve)

// const pwdSure = resolve => require(['@/components/web/page/public/pwdSure'], resolve)
// const loading = resolve => require(['@/components/web/page/public/loading'], resolve)

// const backupWallet = resolve => require(['@/components/web/page/backupWallet/index'], resolve)
// const backupSure = resolve => require(['@/components/web/page/backupWallet/backupSure'], resolve)

Vue.use(Router)

const routers = new Router({
  // mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   // name: 'index',
    //   component: index,
    //   children: [
    {
      path: '/',
      component: biticonView
    }, {
      path: '/biticonView',
      name: 'biticonView',
      component: biticonView
    }, {
      path: '/createWallet',
      name: 'createWallet',
      component: createWallet
    }, {
      path: '/importWallet',
      name: 'importWallet',
      component: importWallet
    }, {
      path: '/saveKeystore',
      name: 'saveKeystore',
      component: saveKeystore
    }, {
      path: '/nav',
      // name: 'nav',
      component: navLeft,
      children: [
        {
          path: '/',
          component: myAssets
        }, {
          path: '/MyAssets',
          name: 'MyAssets',
          component: myAssets,
          children: [
            {
              path: '/pwdMyAssets',
              component: pwdSure
            }
          ]
        }, {
          path: '/Transfer',
          // name: 'Transfer',
          component: transfer,
          children: [
            {
              path: '/',
              component: tranReceive
            }, {
              path: '/Transfer/tranReceive',
              name: 'tranReceive',
              component: tranReceive
            }, {
              path: '/Transfer/tranSend',
              name: 'tranSend',
              component: tranSend,
              children: [
                {
                  path: '/pwdSend',
                  component: pwdSure
                }
              ]
            }
          ]
        }, {
          path: '/LILO',
          // name: 'LILO',
          component: lilo,
          children: [
            {
              path: '/',
              component: coinList,
              children: [
                {
                  path: '/pwdCoinList',
                  component: pwdSure
                }
              ]
            }, {
              path: '/lockNav',
              // name: 'lockNav',
              component: lockNav,
              children: [
                {
                  path: '/',
                  component: lockIn
                }, {
                  path: '/LILO/lockIn',
                  name: 'lockIn',
                  component: lockIn,
                  children: [
                    {
                      path: '/pwdLockIn',
                      component: pwdSure
                    }
                  ]
                }, {
                  path: '/LILO/lockOut',
                  name: 'lockOut',
                  component: lockOut,
                  children: [
                    {
                      path: '/pwdLockOut',
                      component: pwdSure
                    }
                  ]
                }
              ]
            }
          ]
        }, {
          path: '/DAPP',
          name: 'DAPP',
          component: dapp
        }, {
          path: '/backupWallet',
          name: 'backupWallet',
          component: backupWallet
        }
        // , {
        //   path: '/loading',
        //   name: 'loading',
        //   component: loading
        // }
      ]
    }
    //   ]
    // }
  ]
})

routers.beforeEach((to, from, next) => {
  const showSearchURL = [
    'biticonView',
    'createWallet',
    'importWallet',
    'saveKeystore'
  ]
  if (store.state.addressInfo) {
    next()
  } else {
    if (
      to.path === '/' ||
      to.path === '/importWallet' ||
      to.path === '/createWallet' ||
      to.path === '/saveKeystore' ||
      to.path === '/backupSure'
    ) {
      next()
    } else {
      next('/')
    }
  }
  let toPath = to.path.toUpperCase()
  let navView = () => {
    let topSearchViewId = document.getElementById('topSearchView')
    let topSetViewId = document.getElementById('topSetView')
    if (toPath === '/') {
      topSearchViewId.style.display = 'block'
      topSetViewId.style.display = 'none'
    } else {
      for (let i = 0; i < showSearchURL.length; i++) {
        if (toPath.indexOf(showSearchURL[i].toUpperCase()) !== -1) {
          topSearchViewId.style.display = 'block'
          topSetViewId.style.display = 'none'
          break
        } else {
          topSearchViewId.style.display = 'none'
          topSetViewId.style.display = 'block'
        }
      }
    }
  }
  if (document.getElementById('topSearchView')) {
    navView()
  } else {
    window.onload = () => {
      navView()
    }
  }
})

export default routers
