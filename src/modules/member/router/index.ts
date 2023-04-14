import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const memberRouters: RouteConfig[] = [
  {
    path: '/member',
    name: 'MemberMain',
    redirect: { name: 'MemberActive' },
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: 'active',
            name: 'MemberActive',
            meta: {
              module: 'MEMBER'
            },
            component: () => import('../view/MemberKyc.vue')
          },
          {
            path: 'inactive',
            name: 'MemberInactive',
            meta: {
              module: 'MEMBER'
            },
            component: () => import('../view/MemberKyc.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/member'
      }
    ]
  }
]

export default memberRouters
