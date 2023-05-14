import type { RouteRecordRaw } from 'vue-router'

const LayoutLanding = (): any => import('@/components/layout/layout-landing/LayoutLanding.vue')

const homeProductRouter: RouteRecordRaw[] = [
  {
    path: '/product',
    component: LayoutLanding,
    name: 'HomeProduct',
    children: [
      {
        path: '',
        component: () => import('../view/HomeProduct.vue'),
        redirect: { name: 'LandingPage' },
        children: [
          {
            path: ':category',
            name: 'ProductView',
            // meta: {
            //   module: 'ProductView',
            //   title: 'ProductView'
            // },
            component: () => import('../view/ProductView.vue')
          },
          {
            path: 'detail/:detail',
            name: 'ProductDetailView',
            meta: {
              module: 'ProductDetailView',
              title: 'ProductDetailView'
            },
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
