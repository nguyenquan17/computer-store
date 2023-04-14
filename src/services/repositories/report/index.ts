import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export default class ReportRepository extends BaseRepository {
  constructor() {
    super('log/api/v1')
  }

  async getListUserReport(params?: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.prefix}/report/user/list`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getDataChart(params?: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.prefix}/report/user/chart`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getListDeviceReport(params?: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.prefix}/report/device/list`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getDataChartDevice(params?: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.prefix}/report/device/chart`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getDeviceListByUserID(params?: Record<string, any>): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.prefix}/report/device/list/detail`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async exportExcel(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/report/user/export`, {
        params,
        responseType: 'blob'
      })
      return Promise.resolve(rs)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async exportExcelDevice(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/report/device/export`, {
        params,
        responseType: 'blob'
      })
      return Promise.resolve(rs)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
