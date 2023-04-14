import { GetterTree } from 'vuex'
import { IAuth } from '.'
const getters: GetterTree<IAuth, any> = {
  templateDatas: state => {
    return state.template.metaDatas
  },
  templateTypes: state => {
    return state.template.metaTypes
  },
  getTabs: (state): Array<Record<string, any>> => {
    let rs: Array<Record<string, any>> = []
    rs = state.template.metaTypes.map((metaType: Record<string, any>): Record<string, any> => {
      return metaType
    })
    return rs
  },
  getApiBody: (state): Record<string, any> => {
    return state.template.apiBody
  }
}
export default getters
