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

export interface IProductDetail {
  productId: number
  categoryId: number
  categoryName: string
  productName: string
  imageList: IImage[]
  brand: string
  retailPrice: number
  latestPrice: number
  discount: number
  quantity: number
  sold: number
  status: number
  featured: number
  warranty: number
  createdAt: string
  color: number
  sizeDescription: string
  battery: string
  weight: string
  numberOfButtons: number
  mouseType: number
  mouseHandType: number
  mouseConnectionType: string
  cpuModel: string
  cpuSeries: number
  cpuSpeed: number
  cpuSocket: number
  cpuNumberOfProcessors: number
  cpuNumberOfProcessingThreads: number
  ramModel: string
  ramSeries: number
  ramBus: number
  ramTiming: number
  ramVoltage: number
  ramCapacity: number
  monitorModel: string
  monitorSize: number
  monitorResolution: number
  monitorPanel: number
  monitorType: string
  monitorBrightness: string
  monitorRefreshRate: number
  monitorResponseTime: string
  hardDiskModel: string
  hardDiskSeries: number
  hardDiskType: number
  hardDiskCapacity: number
  hardDiskConnectionType: number
  hardDiskReadingSpeed: number
  hardDiskWritingSpeed: number
  vgaModel: string
  keyboardModel: string
  laptopStorage: string
  laptopOperatingSystem: string
  laptopSeries: number
  laptopMaxNumberOfStoragePorts: string
  laptopConnectionPort: string
  laptopOutputPort: string
  //
  description: string
  shortDescription: string
}

export interface ILaptop {
  productId: number
  categoryId: number
  //add
  categoryName?: string
  name: string
  imageList: IImage[]
  brand: string | number
  description: string
  //shortDescription
  shortDescription: string
  retailPrice: number
  latestPrice: number
  quantity: number
  featured: number
  warranty: number
  color: number | string
  sizeDescription: string
  battery: string
  weight: string
  laptopSeries: number | string
  laptopOperatingSystem: number | string
  laptopStorage: number | string
  keyboardModel: number | string
  cpuModel: number | string
  cpuSeries: number | string
  vgaModel: number | string
  ramModel: number | string
  monitorModel: number | string
  monitorSize: number | string
  laptopMaxNumberOfStoragePorts: number | string
  laptopConnectionPort: number | string
  laptopOutputPort: number | string
}

export interface IMonitor {
  productId: number
  categoryId: number
  //add
  categoryName?: string
  name: string
  imageList: IImage[]
  brand: number | string
  description: string
  //shortDescription
  shortDescription: string
  retailPrice: number
  latestPrice: number
  quantity: number
  featured: number
  warranty: number
  sizeDescription: string
  weight: string
  monitorSize: number | string
  monitorResolution: number | string
  monitorPanel: number | string
  monitorType: number | string
  monitorBrightness: number | string
  monitorRefreshRate: number | string
  monitorResponseTime: number | string
}

export interface IAttribute {
  brand: number | string
  color: number | string

  [x: string]: any
}

export interface IProductDetailConvert {
  categoryId: number
  productName: string
  categoryName: string
  productId: number
  quantity: number
  description: string
  shortDescription: string
  latestPrice: number
  retailPrice: number
  sold: number
  status: number
  discount: number
  imageList: IImage[]
  attributes: any
}

export interface IUser {
  userId: number
  email: string
  fullName: string
  phoneNumber: string
  address: string
  dob: string
}

export interface ITab {
  title: string
  value: string

  [x: string]: any
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
