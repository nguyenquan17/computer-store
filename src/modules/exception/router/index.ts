import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const exceptionRouters: RouteConfig[] = [
  {
    path: '/exception',
    name: 'Exception',
    redirect: { name: 'ExceptionWithdraw' },
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          // {
          //   path: 'deposit',
          //   name: 'ExceptionDeposit',
          //   component: () => import('../view/Exception.vue')
          // },
          {
            path: 'withdraw',
            name: 'ExceptionWithdraw',
            meta: {
              module: 'EXCEPTION'
            },
            component: () => import('../view/Exception.vue')
          },
          {
            path: 'crowdsales',
            name: 'ExceptionCrowdsale',
            meta: {
              module: 'EXCEPTION'
            },
            component: () => import('../view/Exception.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/exception'
      }
    ]
  }
]

export default exceptionRouters
