import type { RouteRecordRaw } from 'vue-router'
const TheLayout = () => import('@/components/layout/TheLayout.vue')

const requestRouter: RouteRecordRaw[] = [
  {
    path: '/request',
    component: TheLayout,
    name: 'RequestMain',
    redirect: { name: 'Request', params: { currency: 'MAGIC' } },
    children: [
      {
        path: ':currency',
        name: 'Request',
        meta: {
          module: 'REQUEST',
          title: 'Request'
        },
        component: () => import('../view/RequestView.vue')
      }
    ]
  }
]
export default requestRouter
