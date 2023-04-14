import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class InventoryRepository extends BaseRepository {
  constructor() {
    super('nft/api/v1/bo/inventory')
  }

  async getListInventoryDataTable(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/list`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getSummaryData(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/summary`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getDetailItem(params: Record<string, any>): Promise<any> {
    try {
      const response = await request.get(`${this.prefix}/detail`, { params })
      return Promise.resolve(response.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getDetailActivity(id: any): Promise<any> {
    try {
      const response = await request.get(`${this.prefix}/account/statement/detail?activityId=` + id)
      return Promise.resolve(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async burnNft(params: Record<string, any>): Promise<any> {
    try {
      const response = await request.post(`${this.prefix}/item/burn`, params)
      return Promise.resolve(response.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async removeForSaleNft(params: Record<string, any>): Promise<any> {
    try {
      this.prefix = 'nft/api/v1/bo/sale'
      const response = await request.post(`${this.prefix}/remove`, params)
      return Promise.resolve(response.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async lockNft(params: Record<string, any>): Promise<any> {
    try {
      const response = await request.post(`${this.prefix}/item/LOCK`, params)
      return Promise.resolve(response.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async unLockNft(params: Record<string, any>): Promise<any> {
    try {
      const response = await request.post(`${this.prefix}/item/UNLOCK`, params)
      return Promise.resolve(response.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
