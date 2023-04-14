import { MutationTree } from 'vuex'
import { ISBase } from '.'
import { filter, union } from 'lodash'

const mutations: MutationTree<ISBase> = {
  SET_OPEN_POPUP: (state, data: { popupName: string; isOpen: boolean }) => {
    if (data.isOpen) {
      state.popup = union(state.popup, [data.popupName])
    } else {
      state.popup = filter(state.popup, value => {
        return value !== data.popupName
      })
    }
  },
  SET_SYSTEM_PARAMS: (state, data) => {
    state.urlSystem = { ...data }
  },
  SET_LIST_ASSET_NETWORK: (state, data) => {
    state.listAssetToken = data
  }
}
export default mutations
