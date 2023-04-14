import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const CommissionRoute: RouteConfig[] = [
  {
    path: '/commission',
    name: 'CommissionMain',
    component: Layout,
    children: [
      {
        path: '',
        redirect: 'transactions',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: ':tab',
            name: 'CommissionTransactions',
            component: () => import('../view/CommissionView.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/commission'
      }
    ]
  }
]

export default CommissionRoute
