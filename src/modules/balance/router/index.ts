import type { RouteRecordRaw } from 'vue-router'
const TheLayout = () => import('@/components/layout/TheLayout.vue')

const balanceRouter: RouteRecordRaw[] = [
  {
    path: '/balance',
    component: TheLayout,
    name: 'BalanceMain',
    redirect: { name: 'Balance', params: { currency: 'MAGIC' } },
    children: [
      {
        path: ':currency',
        name: 'Balance',
        // beforeEnter: (from, to, next) => {
        //   if (!from.params.currency) {
        //     next({ name: 'Balance', params: { currency: 'MAGIC' } })
        //   }
        // },
        meta: {
          module: 'BALANCE',
          title: 'Balance'
        },
        component: () => import('../view/BalanceView.vue')
      }
    ]
  }
]

export default balanceRouter
