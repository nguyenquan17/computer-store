import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/modules/auth/store'
import { includes } from 'lodash-es'

const LayoutLanding = (): any => import('@/components/layout/layout-landing/LayoutLanding.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutLanding,
      name: 'Home',
      redirect: { name: 'LayoutLanding' },
      children: [
        {
          path: '',
          name: 'LandingPage',
          component: () => import('../modules/landing/views/LandingPage.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  console.log(to.name)
  const store = useAuthStore()

  if (to.meta?.isNotLogin) {
    if (Cookies.get('access_token')) {
      location.href = '/'
      return
    }
    next()
    return
  }

  if (!store.isLogin) {
    if (
      includes(
        [
          'LandingPage',
          'HomeProduct',
          'ProductView',
          'ProductDetailView',
          'FormSignUp',
          'FormSignIn',
          'CartView',
          'CheckoutView'
        ],
        to.name
      )
    ) {
      next()
      window.scrollTo(0, 0)
      return
    } else {
      await router.push({ name: 'LoginPage' })
      Cookies.remove('access_token')
      location.href = '/login'
    }
  }
  next()
})

export default router
