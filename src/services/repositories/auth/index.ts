import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'
import { IBodyApiVerify } from '@/interface'
import DeviceDetector from 'device-detector-js'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const coinMain = process.env.VUE_APP_COIN_MAIN

export class AuthRepository extends BaseRepository {
  constructor() {
    super('api/v1/user')
  }

  async register(data: Record<string, any>, captcha: string): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/register`, data, {
        headers: {
          'captcha-response': captcha
        }
      })
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async getEmailVerification(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/0/resendCode`, params)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getVisitorId(): Promise<string> {
    try {
      const fpPromise = FingerprintJS.load()
      const fp = await fpPromise
      const result = await fp.get()
      return Promise.resolve(result.visitorId)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getInfoDevice(): Promise<string> {
    const deviceUuid = await this.getVisitorId()

    const deviceDetector = new DeviceDetector()

    const userAgent = window.navigator.userAgent
    const appName = 'Cbex Wallet'
    const appVersion = process.env.VUE_APP_VERSION

    const device = deviceDetector.parse(userAgent)

    const deviceType = device.device?.type
    const deviceOs = device.os?.name
    const deviceOsVersion = (device.os?.name as string) + ' ' + device.os?.version
    const deviceName = (device.client?.name as string) + ' ' + device.client?.version

    return `${appName}&space;${appVersion}&space;1.0.0&space;${deviceType}&space;${deviceOs}&space;${deviceName}&space;${deviceUuid}&space;${deviceOsVersion}`
  }

  async login(data: Record<string, any>): Promise<any> {
    try {
      const device = await this.getInfoDevice()
      delete request.defaults.headers.common['Authorization']
      data.employee = true
      const result = await request.post(`${this.prefix}/login`, data, {
        headers: {
          Device: device
        }
      })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async logout(): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/logout`)
      return Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async get2FA(params: Record<string, any>): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/get2FA`, {
        params: params
      })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async validateUser(data: Record<string, any>, captcha: string): Promise<any> {
    try {
      const device = await this.getInfoDevice()
      data.employee = true
      delete request.defaults.headers.common['Authorization']
      const rs = await request.post(`${this.prefix}/validate`, data, {
        headers: {
          'captcha-response': captcha,
          Device: device
        }
      })
      return Promise.resolve(rs.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async resendCode(data: Record<string, any>, userId = 0): Promise<any> {
    try {
      data.userType = 'EMPLOYEE'
      const rs = await request.post(`${this.prefix}/${userId}/resendCode`, data)
      Promise.resolve(rs.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async verifyCode(type: string | (string | null)[], data: IBodyApiVerify, userId = 0): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/${userId}/verify/${type}`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async verifyPhone(data: IBodyApiVerify): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/phone/verify`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async forgetPassword(data: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/forget-pass`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async resetPassword(data: Record<string, any>, userId = 0): Promise<Array<Record<string, any>>> {
    try {
      const result = await request.post(`${this.prefix}/${userId}/reset-pass`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      console.log(error)

      return Promise.reject(error)
    }
  }

  async changePassword(data: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/password`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async refreshToken(data: { email: string; refreshToken: string }): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/refresh-token`, data, {
        headers: {
          Authorization: ''
        }
      })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getInfo(): Promise<any> {
    try {
      const result = await request.get(`${this.prefix}/info`)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createLogLogin(data: Record<string, any>): Promise<void> {
    try {
      return request.post('log/api/v1/activity', data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
