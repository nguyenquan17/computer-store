import type { ICategory } from '@/interfaces'
import { filter, union } from 'lodash-es'
import { defineStore } from 'pinia'

export const useBaseStore = defineStore('base', () => {
  const systemParams = ref({})
  const listAssetCategory = ref<ICategory[]>([])
  const popup = ref<string[]>([])

  // const setSystemParams = (data: Record<string, any>) => {
  //   systemParams.value = data
  // }

  const setListAssetCategory = (list: ICategory[]) => {
    listAssetCategory.value = list
  }

  const setOpenPopup = (isOpen: boolean, popupName: string) => {
    if (isOpen) {
      popup.value = union(popup.value, [popupName])
    } else {
      popup.value = filter(popup.value, value => {
        return value !== popupName
      })
    }
  }

  return {
    systemParams,
    listAssetCategory,
    popup,

    setListAssetCategory,
    setOpenPopup
  }
})
