import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class KycRepository extends BaseRepository {
  constructor() {
    super('api/v1/user')
  }

  async getListKyc(params: Record<string, any>, name: string): Promise<any> {
    try {
      if (params.orderBy === 'CREATED_AT' && name !== 'KycPending') {
        params.orderBy = 'APPROVED_AT'
      }
      const rs = await request.get(`${this.prefix}/settings/kyc-requests`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getDetailKyc(id: string | number): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/settings/kyc-requests/${id}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async rejectKyc(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/settings/kyc-reject`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async approveKyc(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/settings/kyc-approval`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getListApprove(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/members`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async updateKyc(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.put(`${this.prefix}/settings/kyc-requests/update`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
