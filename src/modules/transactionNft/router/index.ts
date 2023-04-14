import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const transactionNftRouters: RouteConfig[] = [
  {
    path: '/nft-transaction',
    name: 'TransactionNftMain',
    redirect: { name: 'TransactionNft', params: { token: process.env.VUE_APP_COIN_MAIN, type: 'put-on-sale' } },
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: ':token/:type',
            name: 'TransactionNft',
            meta: {
              module: 'TRANSACTION-NFT'
            },
            component: () => import('../view/Transaction.vue')
            // children: [
            //   {
            //     path: 'Deposit',
            //     name: 'TransactionDeposit1',
            //     component: () => import('../view/Transaction.vue')
            //   },
            //   {
            //     path: 'Withdraw',
            //     name: 'TransactionWithdraw',
            //     component: () => import('../view/Transaction.vue')
            //   },
            //   {
            //     path: 'Transfer',
            //     name: 'TransactionTransfer',
            //     component: () => import('../view/Transaction.vue')
            //   },
            //   {
            //     path: 'Bonus',
            //     name: 'TransactionBonus',
            //     component: () => import('../view/Transaction.vue')
            //   },
            //   {
            //     path: 'crowdsale',
            //     name: 'TransactionCrowdsale',
            //     component: () => import('../view/Transaction.vue')
            //   }
            // ]
          }
        ]
      },
      {
        path: '*',
        redirect: '/nft-transaction'
      }
    ]
  }
]

export default transactionNftRouters
