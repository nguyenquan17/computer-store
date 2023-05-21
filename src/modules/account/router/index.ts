import type { RouteRecordRaw } from 'vue-router'

const LayoutLanding = (): any => import('@/components/layout/layout-landing/LayoutLanding.vue')

const accountRouter: RouteRecordRaw[] = [
  {
    path: '/account',
    name: 'MyAccount',
    component: LayoutLanding,
    // redirect: { name: 'AccountView' },
    children: [
      {
        path: '',
        name: 'AccountView',
        component: () => import('../view/AccountView.vue'),
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('../components/Profile.vue')
          },
          {
            path: 'orders',
            name: 'MyOrders',
            component: () => import('../components/MyOrders.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
export default accountRouter
