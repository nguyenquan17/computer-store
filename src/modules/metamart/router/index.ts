import Layout from '@/components/layout/Layout.vue'
import LayoutSecond from '@/components/layout/LayoutSecond.vue'
import { RouteConfig } from 'vue-router'

const metamartRouters: RouteConfig[] = [
  {
    path: '/metamart',
    name: 'NftMain',
    redirect: { name: 'Nft' },
    component: Layout,
    children: [
      {
        path: '/',
        components: {
          default: LayoutSecond
        },
        children: [
          {
            path: 'nft',
            name: 'Nft',
            meta: {
              module: 'NFT'
            },
            component: () => import('../view/Metamart.vue')
          },
          {
            path: 'collection',
            name: 'Collection',
            meta: {
              module: 'NFT'
            },
            component: () => import('../view/Metamart.vue')
          },
          {
            path: 'category',
            name: 'Category',
            meta: {
              module: 'NFT'
            },
            component: () => import('../view/Metamart.vue')
          },
          {
            path: 'banner',
            name: 'Banner',
            meta: {
              module: 'NFT'
            },
            component: () => import('../view/Metamart.vue')
          },
          {
            path: 'template',
            name: 'Template',
            meta: {
              module: 'NFT'
            },
            component: () => import('../view/Metamart.vue')
          },
          {
            path: 'template/create-template',
            name: 'CreateTemplate',
            meta: {
              module: 'NFT'
            },
            component: () => import('../view/CreateTemplate.vue'),
            props: route => ({
              query: {
                template: route.query.template,
                status: route.query.status,
                id: route.query.id
              }
            })
          }
        ]
      },
      {
        path: '*',
        redirect: '/metamart'
      }
    ]
  }
]

export default metamartRouters
