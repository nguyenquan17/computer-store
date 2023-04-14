import { ActionTree } from 'vuex'
import { IAuth } from '.'

const actions: ActionTree<IAuth, unknown> = {
  setTypePopup({ commit }, type: string) {
    commit('SET_TYPE_POPUP', type)
  }
}

export default actions
