import { ActionTree } from 'vuex'
import { IAuth } from '.'

const actions: ActionTree<IAuth, unknown> = {
  setListRound({ commit }, listRound) {
    commit('SET_LIST_ROUND', listRound)
  },
  setRoundCurrent({ commit }, round) {
    commit('SET_ROUND_CURRENT', round)
  }
}

export default actions
