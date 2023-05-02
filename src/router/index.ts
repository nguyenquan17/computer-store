import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/modules/Auth/store'

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
    router.push({ name: 'LoginPage' })
    Cookies.remove('access_token')
    location.href = '/login'
  }
  next()
})

export default router
