import { IAssetNetwork } from '@/interface'
import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'

export interface ISBase {
  popup: string[]
  coinMain: string
  urlSystem: Record<string, any>
  siteKey: string
  listAssetToken: IAssetNetwork[]
}

const state: ISBase = {
  popup: [],
  coinMain: 'MAGIC',
  urlSystem: {},
  listAssetToken: [],
  siteKey: '6Ley9OYiAAAAANMWTsCkqtNIxLEhz96PE1VmS0KJ'
}

const beBase: Module<ISBase, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations
}

export default beBase
