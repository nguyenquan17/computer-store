import { MutationTree } from 'vuex'
import { IAuth } from '.'

const mutations: MutationTree<IAuth> = {
  SET_LIST_TYPE_STAKING: (state, data: Array<Record<string, any>>) => {
    state.listInterestType = data[0].content || []
    state.listDurationType = data[1].content || []
  }
}
export default mutations
