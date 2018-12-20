import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/web/page/index'

import biticonView from '@/components/web/page/createWallet/index'
import createWallet from '@/components/web/page/createWallet/create'
import saveKeystore from '@/components/web/page/createWallet/savekeystore'
import importWallet from '@/components/web/page/createWallet/import'

import navLeft from '@/components/web/page/nav'
import myAssets from '@/components/web/page/myAssets/index'

import transfer from '@/components/web/page/transfer/index'
import tranReceive from '@/components/web/page/transfer/receive'
import tranSend from '@/components/web/page/transfer/send'

import lilo from '@/components/web/page/lilo/index'
import coinList from '@/components/web/page/lilo/coinList'
import lockIn from '@/components/web/page/lilo/lockIn'
import lockOut from '@/components/web/page/lilo/lockOut'
import lockNav from '@/components/web/page/lilo/lockNav'

import dapp from '@/components/web/page/dapp/index'

import pwdSure from '@/components/web/page/public/pwdSure'

import backupWallet from '@/components/web/page/backupWallet/index'

Vue.use(Router)

const routers = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      // name: 'index',
      component: index,
      children: [
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
          ]
        }
      ]
    }
  ]
})

routers.beforeEach((to, from, next) => {
  const showSearchURL = ['biticonView', 'createWallet', 'importWallet', 'saveKeystore']
  let toPath = to.path.toUpperCase()
  // console.log(this.$store)
  // if (!this.$store.state.storePrivateKey) {
  //   this.$router.push('/')
  // }
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
  next()
})

export default routers
