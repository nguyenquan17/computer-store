import type { RouteRecordRaw } from 'vue-router'

const LayoutLanding = (): any => import('@/components/layout/layout-landing/LayoutLanding.vue')

const homeProductRouter: RouteRecordRaw[] = [
  {
    path: '/product',
    component: LayoutLanding,
    name: 'HomeProduct',
    redirect: { name: 'LandingPage' },
    children: [
      {
        path: '',
        component: () => import('../view/HomeProduct.vue'),
        children: [
          {
            path: ':category',
            name: 'ProductView',
            // meta: {
            //   module: 'ProductView',
            //   title: 'ProductView'
            // },
            component: () => import('../view/ProductView.vue'),
          },
          {
            path: ':category/:detail',
            name: 'ProductDetailView',
            component: () => import('../view/ProductDetailView.vue')
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
export default homeProductRouter
