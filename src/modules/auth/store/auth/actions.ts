import request from '@/plugins/request'
import { AuthRepository } from '@/services/repositories/auth/index'
import getRepository from '@/services'
import { ActionTree } from 'vuex'
import { IAuth } from '.'
import Cookies from 'js-cookie'
import { trim } from 'lodash'

const authRes: AuthRepository = getRepository('auth')

const actions: ActionTree<IAuth, unknown> = {
  async login({ commit }, data: { username: string; password: string }) {
    try {
      const result = await authRes.login(data)
      commit('SET_USER_INFO', result)
      request.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`
      Cookies.set('access_token', result.accessToken, { expires: 1 })
      Cookies.set('user_id', result.id, { expires: 1 })
      // Cookies.set('refresh_token', result.refreshToken)
      // authRes.createLogLogin({ sourceType: 'WEB' })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async refreshToken({ commit, state }) {
    try {
      const data = {
        email: state.user.username,
        refreshToken: state.refresh_token
      }
      const result = await authRes.refreshToken(data)
      if (!result.accessToken || trim(result.accessToken) === '') {
        return Promise.reject({
          err: 401,
          msg: 'err'
        })
      }
      commit('SET_TOKEN', result)
      request.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`
      Cookies.set('access_token', result.accessToken)
      Cookies.set('refresh_token', result.refreshToken)
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async logout({ commit }, status = true) {
    try {
      if (status) {
        await authRes.logout()
      }
      commit('LOG_OUT')
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      Cookies.remove('user_id')
      request.defaults.headers.common['Authorization'] = ''

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getInfo({ commit }) {
    try {
      const result = await authRes.getInfo()
      console.log(result)

      commit('SET_INFO', result)
    } catch (error: any) {
      return Promise.reject(error)
    }
  }
}

export default actions
