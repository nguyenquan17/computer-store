import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'

export interface IAuth {
  listRound: Record<string, any>[]
  roundCurrent: Record<string, any>
}

const state: IAuth = {
  listRound: [],
  roundCurrent: {}
}

const crowdsaleBo: Module<IAuth, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default crowdsaleBo
