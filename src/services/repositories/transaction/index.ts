import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'
import { forEach } from 'lodash'

export class TransactionRepository extends BaseRepository {
  constructor() {
    super('main/api/v1/transaction')
  }

  async getlistBalanceDetail(tab: string, params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${tab}`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getListTransaction(tab: string, params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/${tab}`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getListAddress(params: Record<string, any>): Promise<any> {
    try {
      this.prefix = '/main/api/v1/transaction/search/address'
      console.log(params, 'k')
      const rs = await request.get(`${this.prefix}`, {params})
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getListTransactionNft(params: Record<string, any>): Promise<any> {
    try {
      const objKeys = Object.keys(params)
      forEach(objKeys, key => {
        if (params[key] === '') {
          delete params[key]
        }
      })
      const rs = await request.get(`nft/api/v1/transaction/activities`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  // get api staking
  async getListTransactionStakingNft(params: Record<string, any>): Promise<any> {
    try {
      const objKeys = Object.keys(params)
      forEach(objKeys, key => {
        if (params[key] === '') {
          delete params[key]
        }
      })
      const rs = await request.get(`nft/api/v1/transaction/activities-dailyProfit`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getDetailTransactionNft(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`nft/api/v1/transaction/activities/detail`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async addDeposit(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.put(`${this.prefix}/deposit/insert`, {}, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
