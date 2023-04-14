import { MutationTree } from 'vuex'
import { IAuth } from '.'

const mutations: MutationTree<IAuth> = {
  SET_TYPE_POPUP: (state, data) => {
    state.type_popup = data
  }
}
export default mutations
