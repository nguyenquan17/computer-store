import type { RouteRecordRaw } from 'vue-router'

const TheLayout = () => import('@/components/layout/TheLayout.vue')

const productManagementRouter: RouteRecordRaw[] = [
  {
    path: '/product-management',
    component: TheLayout,
    name: 'ProductManagement',
    redirect: { name: 'ProductManagementView' },
    children: [
      {
        path: '/',
        name: 'ProductManagementView',
        meta: {
          module: 'ProductManagement',
          title: 'Quản lý sản phẩm'
        },
        component: () => import('../view/ProductManagementView.vue')
      }
    ]
  }
]
export default productManagementRouter
