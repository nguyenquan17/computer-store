import { apiAttribute } from '@/services'
import { forEach } from 'lodash-es'

export default function useAttributeProduct() {
  // const brandProduct: Ref<Record<string, any>> = ref([])
  // const colorProduct: Ref<Record<string, any>> = ref([])
  // const laptopSeries: Ref<Record<string, any>> = ref([])
  // const hardDiskCapacity: Ref<Record<string, any>> = ref([])
  // const hardDiskConnectionType: Ref<Record<string, any>> = ref([])
  // const hardDiskType: Ref<Record<string, any>> = ref([])
  // const hardDiskSeries: Ref<Record<string, any>> = ref([])
  // const monitorRefreshRate: Ref<Record<string, any>> = ref([])
  // const monitorPanel: Ref<Record<string, any>> = ref([])
  // const monitorResolution: Ref<Record<string, any>> = ref([])
  // const monitorSize: Ref<Record<string, any>> = ref([])
  // const ramCapacity: Ref<Record<string, any>> = ref([])
  // const ramSeries: Ref<Record<string, any>> = ref([])
  // const cpuSocket: Ref<Record<string, any>> = ref([])
  // const cpuSeries: Ref<Record<string, any>> = ref([])
  // const mouseType: Ref<Record<string, any>> = ref([])

  const dataList: Record<string, any> = reactive({})

  const getAttributeProduct = async (arrAttribute: Array<string>): Promise<void> => {
    try {
      const promises = forEach(arrAttribute, async item => {
        const result = await apiAttribute.getAttribute(item)
        if (result) {
          // dataList[`${item}`] = []
          dataList[`${item}`] = result.data
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  return {
    dataList,
    getAttributeProduct
  }
}
