import { useConvertUtcTime } from '@/composables/convertUtcTime'
import request from '@/plugins/request'
import { forEach } from 'lodash-es'

export default class CustomerRepository {
  // prefix = 'main/api/v1/customers'
  prefix = 'client'

  async registerAccount(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/registerAccount`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListCustomer(params: Record<string, any>): Promise<any> {
    try {
      params.fromCreatedAt = useConvertUtcTime(params.fromCreatedAt, 'from')
      params.toCreatedAt = useConvertUtcTime(params.toCreatedAt, 'to')
      const _params = this.convertParams(params)
      const rs = await request.get(`${this.prefix}`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListBalance(id: number, params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${id}/balance`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListReferral(params: Record<string, any>): Promise<any> {
    try {
      params.toCreatedAt = useConvertUtcTime(params.toCreatedAt, 'to')
      params.fromCreatedAt = useConvertUtcTime(params.fromCreatedAt, 'from')
      const rs = await request.get(`api/v1/customers/invited-by-user`, { params: params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListBonus(params: Record<string, any>): Promise<any> {
    try {
      params.toDate = useConvertUtcTime(params.toDate, 'to')
      params.fromDate = useConvertUtcTime(params.fromDate, 'from')
      const _params = this.convertParamsHasNumberDecimal(params)
      const rs = await request.get(`main/api/v1/bonus-programs/histories`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getStatistics(customerId: number): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${customerId}/statistic`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getDetailCustomer(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListDevice(customerId: number): Promise<any> {
    try {
      const rs = await request.get(`api/v1/user-device/${customerId}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListTransactionCustomer(userId: number, params: Record<string, any>): Promise<any> {
    try {
      params.toTransactionDate = useConvertUtcTime(params.toTransactionDate, 'to')
      params.fromTransactionDate = useConvertUtcTime(params.fromTransactionDate, 'from')
      const rs = await request.get(`${this.prefix}/transaction-histories/${userId}`, { params: this.convertParams(params) })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  private convertParams(params: Record<string, any>): Record<string, any> {
    const _params = { ...params }
    const objKey = Object.keys(_params)
    forEach(objKey, key => {
      if (_params[key] === '' && key !== 'type') {
        delete _params[key]
      }
    })
    return _params
  }

  private convertParamsHasNumberDecimal(params: Record<string, any>): Record<string, any> {
    const _params = { ...params }
    const objKey = Object.keys(_params)

    if (_params.fromAmount) {
      _params.fromAmount = _params.fromAmount.replaceAll(',', '') * 1
    }
    if (_params.toAmount) {
      _params.toAmount = _params.toAmount.replaceAll(',', '') * 1
    }

    forEach(objKey, key => {
      if (_params[key] === '' || key === 'total') {
        _params[key] = null
      }
    })
    return _params
  }
}
