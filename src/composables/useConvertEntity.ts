import type { IAttribute, ILaptop, IMonitor, IProductDetail, IProductDetailConvert } from '@/interfaces'

export default function useConvertEntity() {
  const mapToLaptop = (data: IProductDetail): ILaptop => {
    return {
      battery: data.battery,
      brand: data.brand,
      categoryId: data.categoryId,
      color: data.color,
      cpuModel: data.cpuModel,
      cpuSeries: data.cpuSeries,
      description: data.description,
      shortDescription: data.shortDescription,
      featured: data.featured,
      imageList: data.imageList,
      keyboardModel: data.keyboardModel,
      laptopConnectionPort: data.laptopConnectionPort,
      laptopMaxNumberOfStoragePorts: data.laptopMaxNumberOfStoragePorts,
      laptopOperatingSystem: data.laptopConnectionPort,
      laptopOutputPort: data.laptopOutputPort,
      laptopSeries: data.laptopSeries,
      laptopStorage: data.laptopStorage,
      latestPrice: data.latestPrice,
      monitorModel: data.monitorModel,
      monitorSize: data.monitorSize,
      name: data.productName,
      categoryName: data.categoryName,
      productId: data.productId,
      quantity: data.quantity,
      ramModel: data.ramModel,
      retailPrice: data.retailPrice,
      sizeDescription: data.sizeDescription,
      vgaModel: data.vgaModel,
      warranty: data.warranty,
      weight: data.weight
    }
  }
  const mapToMonitor = (data: IProductDetail): IMonitor => {
    return {
      brand: data.brand,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      description: data.description,
      featured: data.featured,
      imageList: data.imageList,
      latestPrice: data.latestPrice,
      monitorBrightness: data.monitorBrightness,
      monitorPanel: data.monitorPanel,
      monitorRefreshRate: data.monitorRefreshRate,
      monitorResolution: data.monitorResolution,
      monitorResponseTime: data.monitorResponseTime,
      monitorSize: data.monitorSize,
      monitorType: data.monitorType,
      name: data.productName,
      productId: data.productId,
      quantity: data.quantity,
      retailPrice: data.retailPrice,
      shortDescription: data.shortDescription,
      sizeDescription: data.sizeDescription,
      warranty: data.warranty,
      weight: data.weight
    }
  }
  const mapToLaptopAttribute = (data: IProductDetail) => {
    const selectedKeys = [
      'brand',
      'color',
      'battery',
      'laptopSeries',
      'cpuSeries',
      'cpuModel',
      'ramModel',
      'vgaModel',
      'monitorSize',
      'monitorModel',
      'laptopStorage',
      'sizeDescription',
      'keyboardModel',
      'laptopConnectionPort',
      'laptopMaxNumberOfStoragePorts',
      'laptopOperatingSystem',
      'laptopOutputPort',
      'warranty',
      'weight'
    ]
    const keyMap = {
      brand: 'Thương hiệu',
      color: 'Màu sắc',
      battery: 'Pin',
      laptopSeries: 'Series Laptop',
      cpuSeries: 'Series CPU',
      cpuModel: 'CPU',
      ramModel: 'RAM',
      vgaModel: 'Chip đồ họa',
      monitorSize: 'Kích thước màn hình',
      monitorModel: 'Màn hình',
      laptopStorage: 'Lưu trữ',
      sizeDescription: 'Mô tả kích thước',
      keyboardModel: 'Bàn phím',
      laptopConnectionPort: 'Cổng kết nối',
      laptopMaxNumberOfStoragePorts: 'Số cổng lưu trữ tối đa',
      laptopOperatingSystem: 'Hệ điều hành',
      laptopOutputPort: 'Cổng xuất hình',
      warranty: 'Bảo hành',
      weight: 'Khối lượng'
    }
    const convertObjectByAttribute = Object.fromEntries(Object.entries(data).filter(([key]) => selectedKeys.includes(key)))
    return Object.keys(convertObjectByAttribute).reduce((acc, key) => {
      const updatedKey = keyMap[key] || key // Use the new key if it exists in the key map, otherwise use the original key
      acc[updatedKey] = convertObjectByAttribute[key]
      return acc
    }, {})
  }

  const mapToMonitorAttribute = (data: IProductDetail) => {
    const selectedKeys = [
      'brand',
      'color',
      'monitorBrightness',
      'monitorPanel',
      'monitorRefreshRate',
      'monitorResolution',
      'monitorResponseTime',
      'monitorSize',
      'monitorType',
      'sizeDescription',
      'warranty',
      'weight'
    ]
    console.log(Object.fromEntries(Object.entries(data).filter(([key]) => selectedKeys.includes(key))))
    const keyMap = {
      brand: 'Thương hiệu',
      color: 'Màu sắc',
      monitorBrightness: 'Độ sáng',
      monitorPanel: 'Tấm nền',
      monitorRefreshRate: 'Tần số quét',
      monitorResolution: 'Độ phân giải',
      monitorResponseTime: 'Thời gian phản hồi',
      monitorSize: 'Kích thước màn hình',
      monitorType: 'Loại màn hình',
      sizeDescription: 'Mô tả kích thước',
      warranty: 'Bảo hành',
      weight: 'Khối lượng'
    }

    const convertObjectByAttribute = Object.fromEntries(Object.entries(data).filter(([key]) => selectedKeys.includes(key)))
    return Object.keys(convertObjectByAttribute).reduce((acc, key) => {
      const updatedKey = keyMap[key] || key // Use the new key if it exists in the key map, otherwise use the original key
      acc[updatedKey] = convertObjectByAttribute[key]
      return acc
    }, {})
  }

  const convertProductDetail = (data: IProductDetail): IProductDetailConvert => {
    let objAttribute: IAttribute = {} as IAttribute
    if (data.categoryName === 'Laptop') {
      // @ts-ignore
      objAttribute = mapToLaptopAttribute(data)
    } else if (data.categoryName === 'Màn hình') {
      // @ts-ignore
      objAttribute = mapToMonitorAttribute(data)
    }
    const entries = Object.entries(objAttribute)
    const mappedArray = entries.map(([key, value]) => {
      return { attribute: key, value: value }
    })
    return {
      categoryId: data.categoryId,
      productName: data.productName,
      categoryName: data.categoryName,
      productId: data.productId,
      quantity: data.quantity,
      description: data.description,
      shortDescription: data.shortDescription,
      imageList: data.imageList,
      latestPrice: data.latestPrice,
      retailPrice: data.retailPrice,
      sold: data.sold,
      status: data.status,
      discount: data.discount,
      attributes: mappedArray
    }
  }

  return {
    mapToLaptop,
    mapToMonitor,
    mapToMonitorAttribute,
    mapToLaptopAttribute,
    convertProductDetail
  }
}
// objAttribute = {
//   brand: data.brand,
//   color: data.color,
//   cpuModel: data.cpuModel,
//   cpuSeries: data.cpuSeries,
//   keyboardModel: data.keyboardModel,
//   laptopConnectionPort: data.laptopConnectionPort,
//   laptopMaxNumberOfStoragePorts: data.laptopMaxNumberOfStoragePorts,
//   laptopOperatingSystem: data.laptopConnectionPort,
//   laptopOutputPort: data.laptopOutputPort,
//   laptopSeries: data.laptopSeries,
//   laptopStorage: data.laptopStorage,
//   latestPrice: data.latestPrice,
//   monitorModel: data.monitorModel,
//   monitorSize: data.monitorSize,
//   ramModel: data.ramModel,
//   sizeDescription: data.sizeDescription,
//   vgaModel: data.vgaModel,
//   warranty: data.warranty,
//   weight: data.weight
// }

// objAttribute = {
//   brand: data.brand,
//   color: data.color,
//   monitorBrightness: data.monitorBrightness,
//   monitorPanel: data.monitorPanel,
//   monitorRefreshRate: data.monitorRefreshRate,
//   monitorResolution: data.monitorResolution,
//   monitorResponseTime: data.monitorResponseTime,
//   monitorSize: data.monitorSize,
//   monitorType: data.monitorType,
//   sizeDescription: data.sizeDescription,
//   warranty: data.warranty,
//   weight: data.weight
// }
