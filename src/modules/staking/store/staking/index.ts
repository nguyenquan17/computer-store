import { Module } from 'vuex'
import mutations from './mutations'

export interface IAuth {
  listInterestType: Array<Record<string, any>>
  listDurationType: Array<Record<string, any>>
}

const state: IAuth = {
  listInterestType: [],
  listDurationType: []
}

const beStaking: Module<IAuth, unknown> = {
  namespaced: true,
  state,
  mutations
}

export default beStaking
