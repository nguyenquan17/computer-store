import { ActionTree } from 'vuex'
import { IAuth } from '.'

import getRepository from '@/services'
import { NftRepository } from '@/services/repositories/nft'
const apiNft: NftRepository = getRepository('nft')

const actions: ActionTree<IAuth, unknown> = {
  async getTemplateMetaData({ commit }, id: number): Promise<void> {
    try {
      const result = await apiNft.getTemplateMetaData({
        collectionId: id
      })
      commit('SET_LIST_META', result)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default actions
