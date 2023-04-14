import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class FeeNftRepository extends BaseRepository {
  constructor() {
    super('nft/api/v1/transaction')
  }
  async getListFeeNft(tab: string, params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${tab}`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getFeeNftSummary(tab: string, params: Record<string, any>):Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${tab}`, {params})
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async exportExcelNft(params: Record<string, any>):Promise<any> {
    const exportPrefix = this.prefix.replace('/transaction', '')
    try {
      const rs = await request.get(`${exportPrefix}/export`, {
        params,
        responseType: 'blob'
      })
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
