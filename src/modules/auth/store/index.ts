import { apiAuth } from '@/services'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import request from '@/plugins/request'
import type { IUser } from '@/interfaces'
import { trim } from 'lodash-es'

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
  const authUser = ref<Record<string, any>>({
    userId: Cookies.get('user_id') || '',
    token: Cookies.get('access_token') || '',
    refreshToken: ''
  })

  const isLogin = computed(() => {
    return !!authUser.value.token && trim(authUser.value.token) !== ''
    // return Cookies.get('access_token') || false
  })

  const getInfoUser = async () => {
    const userId = Cookies.get('user_id')
    const info = await apiAuth.getInfo(userId)
    console.log(info)
    user.value = info
  }

  const login = async (data: Record<string, any>) => {
    try {
      const result = await apiAuth.login(data)
      console.log(result, 'LOGIN')
      authUser.value = result
      // console.log(authUser.value)
      request.defaults.headers.common['Authorization'] = `Bearer ${result.token}`
      Cookies.set('access_token', result.token, { expires: 1 })
      Cookies.set('user_id', result.userId, { expires: 1 })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    try {
      user.value = {} as IUser
      authUser.value = {}
      Cookies.remove('access_token')
      Cookies.remove('user_id')
      request.defaults.headers.common['Authorization'] = ''
    } catch (error) {
      console.log(error)
    }
  }

  return { user, authUser, isLogin, login, logout, getInfoUser }
})
