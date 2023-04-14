import type { RouteRecordRaw } from 'vue-router'
const TheLayout = () => import('@/components/layout/TheLayout.vue')

const transactionRouter: RouteRecordRaw[] = [
  {
    path: '/transaction',
    component: TheLayout,
    name: 'TransactionMain',
    redirect: { name: 'Transaction', params: {currency: 'MAGIC' }},
    children: [
      {
        path: ':currency',
        name: 'Transaction',

        meta: {
          module: 'TRANSACTION',
          title: 'Transaction'
        },
        component: () => import('../view/TransactionView.vue'),
        
      }
    ]
  }
]

export default transactionRouter
