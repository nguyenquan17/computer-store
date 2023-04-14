import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'
import { IBodyApiVerify } from '@/interface'

export class SettingRepository extends BaseRepository {
  constructor() {
    super('api/v1/user')
  }

  async getKyc(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/kyc-settings`, { params: { ...data } })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async genCode(data?: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/settings/gen-code`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async changePassword(data?: Record<string, any>, userId = 0): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/${userId}/change-pass`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async resendCode(data?: Record<string, any>): Promise<any> {
    try {
      data!.userType = 'EMPLOYEE'
      const result = await request.post(`${this.prefix}/0/resendCode`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
