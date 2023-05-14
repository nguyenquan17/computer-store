import request from '@/plugins/request'

export default class CategoryRepository {
  prefix = 'category'

  async getAllCategory(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/getAll`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async createCategory(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/create`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
