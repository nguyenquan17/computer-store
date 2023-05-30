import { defineStore } from 'pinia'
import { filter } from 'lodash-es'
import { apiProduct } from '@/services'
import { useBaseStore } from '@/stores/base'
import type { IProduct } from '@/interfaces'

export const useProductStore = defineStore('product', () => {
  const route = useRoute()
  const baseStore = useBaseStore()

  const brandList: Ref<Record<string, any>> = ref([])
  const colorList: Ref<Record<string, any>> = ref([])
  const laptopSeriesList: Ref<Record<string, any>> = ref([])
  const ramCapacityList: Ref<Record<string, any>> = ref([])
  const listProduct: Ref<IProduct[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const getProductList = async () => {
    try {
      isLoading.value = true
      const body = {
        page: 0,
        size: 20,
        sort: 'desc',
        order: 'productId',
        categoryId: filter(baseStore.listAssetCategory, item => item.path === route.params.category)[0].id,
        brandList: brandList.value,
        colorList: colorList.value,
        laptopSeriesList: laptopSeriesList.value,
        ramCapacityList: ramCapacityList.value
      }
      const result = await apiProduct.getAllProductByCategory(body)
      if (result) {
        listProduct.value = result.data.content
      }
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      console.log(e)
    }
  }
  return { brandList, colorList, laptopSeriesList, ramCapacityList, listProduct, isLoading, getProductList }
})
