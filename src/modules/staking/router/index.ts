import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const StakingRoute: RouteConfig[] = [
  {
    path: '/staking',
    name: 'StakingMain',
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: 'setup',
            name: 'StakingSetup',
            component: () => import('../view/Setup.vue')
          },
          {
            path: 'tvl/:token/:type',
            name: 'StakingLVT',
            component: () => import('../view/LVT.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/staking/setup'
      }
    ]
  }
]

export default StakingRoute
