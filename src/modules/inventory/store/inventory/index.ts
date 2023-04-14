import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'

export interface IAuth {
  type_popup: string
}

const state: IAuth = {
  type_popup: ''
}

const bcInventory: Module<IAuth, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default bcInventory
