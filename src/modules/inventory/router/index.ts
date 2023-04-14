import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const inventoryRouters: RouteConfig[] = [
  {
    path: '/inventory',
    name: 'Inventory',
    component: Layout,
    redirect: { name: 'MainInventory' },
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: '/',
            name: 'MainInventory',
            meta: {
              module: 'INVENTORY'
            },
            component: () => import('../view/Inventory.vue')
            // children: [
            //   {
            //     path: 'CLM',
            //     name: 'InventoryClm',
            //     component: () => import('../view/Inventory.vue')
            //   },
            //   {
            //     path: 'LYNK',
            //     name: 'InventoryLynk',
            //     component: () => import('../view/Inventory.vue')
            //   }
            // ]
          }
        ]
      },
      {
        path: '*',
        redirect: '/inventory'
      }
    ]
  }
]

export default inventoryRouters
