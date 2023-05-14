import type { RouteRecordRaw } from 'vue-router'

const LayoutLanding = (): any => import('@/components/layout/layout-landing/LayoutLanding.vue')

const cartRouter: RouteRecordRaw[] = [
  {
    path: '/cart',
    component: LayoutLanding,
    name: 'Cart',
    redirect: { name: 'CartView' },
    children: [
      {
        path: '',
        name: 'CartView',
        component: () => import('../view/CartView.vue')
      }
    ]
  }
]
export default cartRouter
