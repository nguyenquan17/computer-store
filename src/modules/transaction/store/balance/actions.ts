import getRepository from '@/services'
import { ActionTree } from 'vuex'
import { IAuth } from '.'
import { ParamsRepository } from '@/services/repositories/params'

const apiParams: ParamsRepository = getRepository('params')

const actions: ActionTree<IAuth, unknown> = {
  getListReason({ commit }) {
    apiParams.getTypeReject({ type: 'KYC_REJECT_REASON' }).then(res => {
      commit('SET_LIST_REJECT', res.content)
    })
  }
}

export default actions
