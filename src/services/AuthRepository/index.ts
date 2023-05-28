import request from '@/plugins/request'

export default class AuthRepository {
  // url = 'api/v1/user'
  url = 'auth'

  async login(data: Record<string, any>): Promise<any> {
    try {
      delete request.defaults.headers.common['Authorization']
      data.employee = true
      const result = await request.post(`${this.url}/login`, data, {
        headers: {
          // Device: device
        }
      })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getInfo(userId: number): Promise<any> {
    try {
      const result = await request.get(`/client/detail?userId=${userId}`)
      return Promise.resolve(result.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async logout(): Promise<any> {
    try {
      const result = await request.post(`${this.url}/logout`)
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async registerAccount(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`client/registerAccount`, data)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  // async verifyCode(type: string | (string | null)[], data: Record<string, any>, userId = 0): Promise<any> {
  //   try {
  //     const rs = await request.post(`${this.url}/${userId}/verify/${type}`, data)
  //     return Promise.resolve(rs.data.data)
  //   } catch (error) {
  //     console.log(error)
  //     return Promise.reject(error)
  //   }
  // }
}
