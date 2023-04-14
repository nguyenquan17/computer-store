import { MutationTree } from 'vuex'
import { IAuth } from '.'

const mutations: MutationTree<IAuth> = {
  SET_LIST_ROUND: (state, listRound) => {
    state.listRound = listRound
  },
  SET_ROUND_CURRENT: (state, round) => {
    state.roundCurrent = round
  }
}
export default mutations
