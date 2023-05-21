import { apiCategory } from '@/services'
import { toSlug } from '@/util'
import { useBaseStore } from '@/stores/base'

const baseStore = useBaseStore()

export default function useCategoryProduct() {
  const getListAssetCategory = async () => {
    try {
      let convertData = []
      const result = await apiCategory.getAllCategory()
      if (result) {
        convertData = result.data.map(elm => {
          return {
            ...elm,
            path: toSlug(elm.name)
          }
        })
      }
      baseStore.setListAssetCategory(convertData)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return {
    getListAssetCategory
  }
}
