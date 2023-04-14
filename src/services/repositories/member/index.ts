import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class MemberRepository extends BaseRepository {
  constructor() {
    super('api/v1/admin')
  }

  async getListMember(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/members`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createMember(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/register`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async updateMember(id: number, data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.put(`${this.prefix}/members/${id}`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async deleteMember(id: number): Promise<any> {
    try {
      const rs = await request.delete(`${this.prefix}/members/${id}`)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async resetPassWordMember(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/reset-pass`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
