import { useConvertUtcTime } from '@/composables/convertUtcTime'
import request from '@/plugins/request'
import { forEach } from 'lodash-es'

export default class TransactionRepository {
  prefix = 'main/api/v1/transaction'

  private convertParams(params: Record<string, any>): Record<string, any> {
    const _params = { ...params }
    const objKey = Object.keys(_params)
    forEach(objKey, key => {
      if (_params[key] === '' && key !== 'type') {
        _params[key] = null
      }
    })
    return _params
  }

  async getListTransaction(tab: string, params: Record<string, any>): Promise<any> {
    try {
      params.toDate = useConvertUtcTime(params.toDate, 'to')
      params.fromDate = useConvertUtcTime(params.fromDate, 'from')
      const rs = await request.get(`${this.prefix}/${tab}`, { params: this.convertParams(params) })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListAddress(params: Record<string, any>): Promise<any> {
    try {
      const _params = this.convertParams(params)
      const rs = await request.get(`${this.prefix}/search/address`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getListTransactionType(params: Record<string, any>): Promise<any> {
    try {
      const _params = this.convertParams(params)
      const rs = await request.get(`${this.prefix}/transaction-type/list`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
