import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const reportRouters: RouteConfig[] = [
  {
    path: '/report',
    name: 'Report',
    redirect: { name: 'ReportUser' },
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: 'user',
            name: 'ReportUser',
            meta: {
              module: 'REPORT'
            },
            component: () => import('../view/ReportKyc.vue')
          },
          {
            path: 'device',
            name: 'ReportDevice',
            meta: {
              module: 'REPORT'
            },
            component: () => import('../view/ReportKyc.vue')
          }
        ]
      },
      {
        path: '*',
        redirect: '/report'
      }
    ]
  }
]

export default reportRouters
