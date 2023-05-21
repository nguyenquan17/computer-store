import request from '@/plugins/request'
import type { IProductDetail } from '@/interfaces'
import Axios from 'axios'

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

  async getProductDetailById(params: Record<string, any>): Promise<IProductDetail | any> {
    try {
      const rs = await request.get(`${this.prefix}/detail`, { params })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async uploadImage(formData: FormData): Promise<any> {
    try {
      const rs = await Axios.post('https://api.cloudinary.com/v1_1/dv0zrozae/upload', formData)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async createProduct(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/create`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
