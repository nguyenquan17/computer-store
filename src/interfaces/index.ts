
export interface ICategory {
  id: number
  name: string
  description: string
  status: number
  createdAt: string
  updatedAt: string

  [x: string]: any
}

export interface IImage {
  image_link: string
}

export interface IProduct {
  brand: string
  categoryId: string | number | any
  discount: number
  imageList: IImage[]
  latestPrice: number
  productId: number
  productName: string
  retailPrice: number
  warranty: number
}

// export interface IProductDetail {
//   productId: number
//   categoryId: number
//   categoryName: string
//   productName: string
//   imageList: IImage[]
//   brand: string
//   retailPrice: number
//   latestPrice: number
//   discount: number
//   quantity: number
//   sold: number
//   status: number
//   featured: number
//   warranty: number
//   createdAt: string
//   color: null
//   sizeDescription: null
//   battery: null
//   weight: null
//   numberOfButtons: null
//   mouseType: null
//   mouseHandType: null
//   mouseConnectionType: null
//   cpuModel: null
//   cpuSeries: null
//   cpuSpeed: null
//   cpuSocket: null
//   cpuNumberOfProcessors: null
//   cpuNumberOfProcessingThreads: null
//   ramModel: null
//   ramSeries: null
//   ramBus: null
//   ramTiming: null
//   ramVoltage: null
//   ramCapacity: null
//   monitorModel: null
//   monitorSize: null
//   monitorResolution: null
//   monitorPanel: null
//   monitorType: null
//   monitorBrightness: null
//   monitorRefreshRate: null
//   monitorResponseTime: null
//   hardDiskModel: null
//   hardDiskSeries: null
//   hardDiskType: null
//   hardDiskCapacity: null
//   hardDiskConnectionType: null
//   hardDiskReadingSpeed: null
//   hardDiskWritingSpeed: null
//   vgaModel: null
//   keyboardModel: null
//   laptopStorage: null
//   laptopOperatingSystem: null
//   laptopSeries: null
//   laptopMaxNumberOfStoragePorts: null
//   laptopConnectionPort: null
//   laptopOutputPort: null
// }

export interface IUser {
  userId: number
  firstName: string
  lastName: string
  fullName: string
  displayName: string
  email: string
  login2faEnabled: number
  avatar: string
  userType: string
  phoneVerified: number
  emailVerified: number
  roles: string[]
  roundsUserCanBuy: number[]
  affiliationCode: string
}

export interface ITab {
  title: string
  value: string
}

export interface ISort {
  title: string
  value: string | number
}

export interface IQuery {
  page: number
  limit: number
  total: number

  [x: string]: any
}

export interface IFormShipping {
  consigneeName: string
  consigneePhoneNumber: string | number
  deliveryAddress: string
}
