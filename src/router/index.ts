import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/modules/Auth/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'Customer', params: { type: 'all' } }
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
