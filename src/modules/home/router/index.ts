import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const homeRouters: RouteConfig[] = [
  {
    path: '/kyc',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Kyc',
        redirect: { name: 'KycPending' },
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: 'pending',
            name: 'KycPending',
            meta: {
              module: 'KYC'
            },
            component: () => import('../view/Kyc.vue')
          },
          {
            path: 'verified',
            name: 'KycVerified',
            meta: {
              module: 'KYC'
            },
            component: () => import('../view/Kyc.vue')
          },
          {
            path: 'rejected',
            name: 'KycRejected',
            meta: {
              module: 'KYC'
            },
            component: () => import('../view/Kyc.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/kyc'
      }
    ]
  }
]

export default homeRouters
