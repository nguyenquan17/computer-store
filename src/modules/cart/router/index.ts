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
  },
  {
    path: '/checkout',
    component: LayoutLanding,
    name: 'Checkout',
    redirect: { name: 'CheckoutView' },
    children: [
      {
        path: '',
        name: 'CheckoutView',
        component: () => import('../view/CheckoutView.vue')
      }
    ]
  }
]
export default cartRouter
