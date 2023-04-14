import request from '@/plugins/request'

export default class RequestRepository {
  prefix = 'main/api/v1/transaction/request'

  async getListWithDraw(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/search`, { params })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
