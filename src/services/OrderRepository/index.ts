import request from '@/plugins/request'
import Axios from 'axios'

export default class OrderRepository {
  prefix = 'order'

  async createCheckoutSession(body: Record<string, any>[], orderId: string): Promise<any> {
    try {
      const rs = await request.post(`create-checkout-session`, body, {
        params: {
          orderId
        }
      })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  // async createCheckoutSession(body: Record<string, any>[]): Promise<any> {
  //   try {
  //     const rs = await request.post(`create-checkout-session`, body)
  //     return Promise.resolve(rs.data)
  //   } catch (error) {
  //     console.log(error)
  //     return Promise.reject(error)
  //   }
  // }

  async createOrder(body: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/create`, body)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getExchangeRate(): Promise<any> {
    try {
      const rs = await Axios.get('https://api.currencyapi.com/v3/latest?apikey=G4dgNEVIRaaMrGwInjy7EIG3UyHNZedlruXGUAzP')
      return Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getListOrderClient(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/client/getAllOrder`, { params })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getOrderDetailClient(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/detail`, { params })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
