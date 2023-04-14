import type { RouteRecordRaw } from 'vue-router'
const TheLayout = () => import('@/components/layout/TheLayout.vue')

const feeRouter: RouteRecordRaw[] = [
  {
    path: '/fee',
    component: TheLayout,
    name: 'FeeMain',
    redirect: { name: 'Fee', params: {currency: 'MAGIC' }},
    children: [
      {
        path: ':currency',
        name: 'Fee',
        meta: {
          module: 'FEE',
          title: 'Fee'
        },
        component: () => import('../view/FeeView.vue'),
        
      }
    ]
  }
]

export default feeRouter
