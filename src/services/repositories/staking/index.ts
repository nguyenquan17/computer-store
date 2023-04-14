import { IQueryStakingLvt, IQueryStakingSetup } from '@/interface'
import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'
import { cloneDeep, forEach } from 'lodash'

export default class StakingRepository extends BaseRepository {
  constructor() {
    super('main/api/v1')
  }

  private convertData(data: Record<string, any>): Record<string, any> {
    const _data = cloneDeep(data)
    const listKey = Object.keys(_data)
    forEach(listKey, key => {
      if (!_data[key]) {
        delete _data[key]
      }
    })
    return _data
  }

  async getListStakingSetup(params: IQueryStakingSetup): Promise<any> {
    try {
      const _params = this.convertData(params)
      const result = await request.get(`${this.prefix}/bo-staking-plans/list`, { params: _params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getListStakingLvt(params: IQueryStakingLvt): Promise<any> {
    try {
      const _params = this.convertData(params)
      const result = await request.get(`${this.prefix}/bo-staking-tvl/search`, { params: _params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getListStakingInvestor(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/staking-plans/0`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async createStaking(body: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/bo-staking-plans/create`, body)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async updateStaking(body: Record<string, any>, planId: number): Promise<any> {
    try {
      const result = await request.put(`${this.prefix}/bo-staking-plans/update/${planId}`, body)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async deleteStaking(params: Record<string, any>, planId: number): Promise<any> {
    try {
      const result = await request.delete(`${this.prefix}/bo-staking-plans/delete/${planId}`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
