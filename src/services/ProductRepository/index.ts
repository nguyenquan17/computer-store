import request from '@/plugins/request'

export default class ProductRepository {
  prefix = 'product'

  async getAllProductByCategory(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/client/search`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getProductDetailById(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/detail`, { params })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
