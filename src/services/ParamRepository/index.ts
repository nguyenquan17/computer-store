import request from '@/plugins/request'

export default class ParamsRepository {
  url = 'main/api/v1'

  async getSystemParams(): Promise<Record<string, any>> {
    try {
      const result = await request.get(`${this.url}/system-params?type=SYSTEM`)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getListAssetToken(): Promise<any> {
    try {
      const rs = await request.get(`main/api/v1/exchange-rates`)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
