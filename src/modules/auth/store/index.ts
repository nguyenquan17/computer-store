import { apiAuth } from './../../../services/index'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import request from '@/plugins/request'
import type { IUser } from '@/interfaces'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser>({
    userId: 0,
    firstName: '',
    lastName: '',
    fullName: '',
    displayName: '',
    email: '',
    login2faEnabled: 0,
    avatar: '',
    userType: '',
    phoneVerified: 0,
    emailVerified: 0,
    roles: [],
    roundsUserCanBuy: [],
    affiliationCode: ''
  })

  const isLogin = computed(() => {
    return Cookies.get('access_token') || false
  })

  const getInfoUser = async () => {
    const info = await apiAuth.getInfo()
    user.value = info
  }

  const login = async (data: Record<string, any>) => {
    try {
      const result = await apiAuth.login(data)
      user.value = result
      request.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`
      Cookies.set('access_token', result.accessToken, { expires: 1 })
      Cookies.set('user_id', result.id, { expires: 1 })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = async (status = true) => {
    try {
      if (status) {
        await apiAuth.logout()
      }
      user.value = {} as IUser
      Cookies.remove('access_token')
      Cookies.remove('user_id')
      request.defaults.headers.common['Authorization'] = ''
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return { user, isLogin, login, logout, getInfoUser }
})
