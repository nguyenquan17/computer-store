import request from '@/plugins/request'

export default class OrderRepository {
  prefix = 'order'

  async createCheckoutSession(body: Record<string, any>[]): Promise<any> {
    try {
      const rs = await request.post(`create-checkout-session`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

}
