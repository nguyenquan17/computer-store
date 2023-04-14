import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class ParamsRepository extends BaseRepository {
  constructor() {
    super('api/v1/district-params')
  }

  async getTypeReject(params?: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getPramsHeaderHubgame(): Promise<any> {
    try {
      const rs = await request.get(`main/api/v1/system-params?type=SYSTEM`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getPramsHeaderLinkey(): Promise<any> {
    try {
      const rs = await request.get(`api/v1/public/system-params`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getTokenFirebase(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`/api/v1/firebase/auth`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getTypeStaking(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`main/${this.prefix}/type`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getAssetNetwork(): Promise<any> {
    try {
      const rs = await request.get(`main/api/v1/exchange-rates`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
