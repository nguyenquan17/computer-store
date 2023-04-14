import request from '@/plugins/request'

export default class AuthRepository {
  url = 'api/v1/user'

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
  async validateUser(data: Record<string, any>, captcha: string): Promise<Record<string, any>> {
    try {
      // const device = await this.getInfoDevice()
      data.employee = true
      delete request.defaults.headers.common['Authorization']
      const rs = await request.post(`${this.url}/validate`, data, {
        headers: {
          'captcha-response': captcha
        }
      })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getInfo(): Promise<any> {
    try {
      const result = await request.get(`${this.url}/info`)
      return Promise.resolve(result.data.data)
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
  async verifyCode(type: string | (string | null)[], data: Record<string, any>, userId = 0): Promise<any> {
    try {
      const rs = await request.post(`${this.url}/${userId}/verify/${type}`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
