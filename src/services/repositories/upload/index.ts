import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export default class UploadRepository extends BaseRepository {
  constructor() {
    super('file/api/v1/user')
  }
  async uploadFile(data: Record<string, any>): Promise<any> {
    try {
      // delete request.defaults.headers.common['Authorization']
      const result = await request.post(`${this.prefix}/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: data.progress
      })
      return result.data.data
    } catch (error) {
      console.log(error)
    }
  }
  async uploadImage(data: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/upload`, data)
      return result.data.data
    } catch (error) {
      console.log(error)
    }
  }

  async uploadFileCreateNft(data: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/upload`, data.data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: data.progress
      })
      return result.data.data
    } catch (error) {
      console.log(error)
    }
  }
}
