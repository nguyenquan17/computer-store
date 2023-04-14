import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class RequestRepository extends BaseRepository {
  constructor() {
    super('/main/api/v1')
  }
  async getDataTable(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/transaction/request/search`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getUserInfo(id: string | number): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/customers?userId=${id}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getTableStatement(currency: string | any, id: string | number, page: number | any, limit: number | any): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/transaction/request/transactions?currency=${currency}&transactionType=&orderBy&page=${page}&limit=${limit}&userId=${id}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async updateRequest(transactionId: number | any, action: string | any, reason: string | any): Promise<any> {
    try {
      const rs = await request.put(`${this.prefix}/transaction/request/update?transactionId=${transactionId}&action=${action}&reason=${reason}`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
