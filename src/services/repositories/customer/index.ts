import { forEach } from 'lodash'
import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class CustomerRepository extends BaseRepository {
  constructor() {
    super('main/api/v1/customers')
  }

  private convertParams(params: Record<string, any>): Record<string, any> {
    const _params = { ...params }
    const objKey = Object.keys(_params)
    forEach(objKey, key => {
      if (_params[key] === '' && key !== 'type') {
        _params[key] = null
      }
      // if (key === 'fromCreatedAt' && _params[key]) {
      //   _params[key] = _params[key] - 7 * 60 * 60 * 1000
      // }
    })
    return _params
  }

  private converParamsHasNumberDecimal(params: Record<string, any>): Record<string, any> {
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
  async updateLockedUser(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/user/settings/lock`, {
        ...params
      })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async updateUnlockUser(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/user/settings/unlock`, {
        ...params
      })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async validatePhoneNumber(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/customers/settings/validate`, {
        ...params
      })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async sendCode(): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/customers/settings/sendcode`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async reset2Fa(userId: string | number): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/customers/settings/${userId}/reset2FA`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async sendCodeCustomer(userId: string | number, params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/customers/settings/${userId}/changePhone`, {
        ...params
      })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async verifyResetDefault(code: string | number): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/customers/settings/verify?code=${code}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async sendCodeLockUser(userId: string | number): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/customers/settings/sendcode?userId=${userId}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getListCustomer(params: Record<string, any>): Promise<any> {
    try {
      const _params = this.convertParams(params)
      const rs = await request.get(`${this.prefix}`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getlistBalance(id: number, params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${id}/balance`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getlistTransaction(id: number, params: Record<string, any>): Promise<any> {
    try {
      const _params = this.converParamsHasNumberDecimal(params)
      console.log(_params)

      const rs = await request.get(`${this.prefix}/transaction-histories/${id}`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getlistAddress(id: number, params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${id}/addresses`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getlistReferral(params: Record<string, any>): Promise<any> {
    try {
      const _params = this.converParamsHasNumberDecimal(params)
      const rs = await request.get(`api/v1/customers/invited-by-user`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getlistBonus(params: Record<string, any>): Promise<any> {
    try {
      const _params = this.converParamsHasNumberDecimal(params)
      const rs = await request.get(`main/api/v1/bonus-programs/histories`, { params: _params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getlistAssetNetwork(): Promise<any> {
    try {
      const rs = await request.get(`main/api/v1/user/asset-network`)
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
  async getListDevice(customerId: number): Promise<any> {
    try {
      const rs = await request.get(`api/v1/user-device/${customerId}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
