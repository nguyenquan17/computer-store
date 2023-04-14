import { filter, includes, trim } from 'lodash'
import { IAuth } from './index'
import { GetterTree } from 'vuex'

const getters: GetterTree<IAuth, any> = {
  isLogin: state => {
    return !!state.access_token && trim(state.access_token) !== ''
  },
  listModuleCanView: state => {
    return filter(state.role.roles, elm => {
      return includes(elm.roles, 'view') || includes(elm.roles, 'all')
    })
  },
  getUserID: state => {
    return state.user.userId
  }
}

export default getters
