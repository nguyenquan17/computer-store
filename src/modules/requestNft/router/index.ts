import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const requestRouteNft: RouteConfig[] = [
  {
    path: '/request-nft',
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },

        children: [
          {
            path: ':type',
            name: 'RequestNFT',
            meta: {
              module: 'REQUEST-NFT'
            },
            component: () => import('../view/RequestNFT.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/request-nft'
      }
    ]
  }
]

export default requestRouteNft
