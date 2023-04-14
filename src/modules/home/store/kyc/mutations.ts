import { MutationTree } from 'vuex'
import { IAuth } from '.'

const mutations: MutationTree<IAuth> = {
  SET_LIST_REJECT: (state, data) => {
    state.listReason = data
  }
}
export default mutations
