import request from '@/plugins/request'

export default class CartRepository {
  prefix = 'cart'

  async addProductToCart(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/addProduct`, null, { params: params })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async removeProductToCart(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/removeProduct`, null, { params: params })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getCartDetail(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/getCartDetail`, { params: params })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
