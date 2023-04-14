import type { RouteRecordRaw } from 'vue-router'
const TheLayout = () => import('@/components/layout/TheLayout.vue')

const customerRouter: RouteRecordRaw[] = [
  {
    path: '/customer',
    component: TheLayout,
    name: 'CustomerMain',
    redirect: { name: 'Customer', params: { type: 'all' } },
    children: [
      {
        path: ':type',
        name: 'Customer',
        beforeEnter: (from, to, next) => {
          if (from.params.type === 'all' || from.params.type === 'verified') {
            next()
          } else {
            next({ name: 'Customer', params: { type: 'all' } })
          }
        },
        meta: {
          module: 'CUSTOMER',
          title: 'Customer'
        },
        component: () => import('../view/CustomerView.vue')
      }
    ]
  }
]

export default customerRouter
