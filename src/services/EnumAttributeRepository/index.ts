import request from '@/plugins/request'

export default class EnumAttributeRepository {
  prefix = 'enum'

  async getAttributeMonitor(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/monitorSize`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getBrandProduct(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/brandProduct`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getColorProduct(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/colorProduct`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getLaptopSeries(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/laptopSeries`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getHardDiskCapacity(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/hardDiskCapacity`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getHardDiskConnectionType(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/hardDiskConnectionType`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getHardDiskType(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/hardDiskType`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getHardDiskSeries(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/hardDiskSeries`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getMonitorRefreshRate(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/monitorRefreshRate`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getMonitorPanel(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/monitorPanel`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getMonitorResolution(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/monitorResolution`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getMonitorSize(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/getMonitorSize`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getRamCapacity(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/ramCapacity`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getRamSeries(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/ramSeries`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getCpuSocket(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/cpuSocket`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getCpuSeries(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/cpuSeries`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async getMouseType(): Promise<any> {
    try {
      const rs = await request.get(`${this.prefix}/mouseType`)
      return Promise.resolve(rs.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
