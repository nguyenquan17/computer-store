import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const FeeNftRouters: RouteConfig[] = [
  {
    path: '/fee-nft',
    name: 'FeeNft',
    // redirect: { name: 'FeeNftLynk' },
    component: Layout,
    meta: {
      module: 'FEE-NFT'
    },
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: '/',
            name: 'MainFeeNft',
            component: () => import('../view/MainView.vue'),
            children: [
              {
                path: 'LYNK',
                name: 'FeeNftLynk',
                component: () => import('../view/FeeNft.vue'),
                meta: {
                  module: 'FEE-NFT'
                }
              },
              {
                path: 'HUB',
                name: 'FeeNftHub',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'CLM',
                name: 'FeeNftClm',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'BTC',
                name: 'FeeNftBtc',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'ETH',
                name: 'FeeNftEth',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'BNB',
                name: 'FeeNftBnb',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'USDT',
                name: 'FeeNftUsdt',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'USDC',
                name: 'FeeNftUsdc',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'BUSD',
                name: 'FeeNftBusd',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              },
              {
                path: 'OTHERS',
                name: 'FeeNftOthers',
                meta: {
                  module: 'FEE-NFT'
                },
                component: () => import('../view/FeeNft.vue')
              }
            ]
          }
        ]
      },
      {
        path: '*',
        redirect: '/feenft'
      }
    ]
  }
]

export default FeeNftRouters
