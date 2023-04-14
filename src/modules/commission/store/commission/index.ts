import { Module } from 'vuex'
import mutations from './mutations'

export interface IAuth {
  listCommission: Array<Record<string, any>>
}

const state: IAuth = {
  listCommission: []
}

const beCommission: Module<IAuth, unknown> = {
  namespaced: true,
  state,
  mutations
}

export default beCommission
