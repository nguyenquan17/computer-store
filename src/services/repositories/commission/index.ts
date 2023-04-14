import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export default class CommissionRepository extends BaseRepository {
  constructor() {
    super('nft/api/v1/bo/commissions')
  }

  async getListCommission(params: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.prefix}/search`, { params })
      return result.data.data
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getSalesMemberFilterList(params: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.prefix}/sale-filter`, { params })
      return result.data.data
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async searchInvestor(params: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`/nft/api/v1/account/search`, { params })
      return result.data.data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
