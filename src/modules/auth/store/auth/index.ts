import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import Cookies from 'js-cookie'
import { UserRoleStoreInterface } from '@/interface/role'

export interface IAuth {
  access_token: string
  refresh_token: string
  user: Record<string, any>
  role: UserRoleStoreInterface
}

const state: IAuth = {
  access_token: Cookies.get('access_token') || '',
  refresh_token: Cookies.get('refresh_token') || '',
  user: {},
  role: {
    roles: [],
    userRole: []
  }
}

const beAuth: Module<IAuth, unknown> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

export default beAuth
