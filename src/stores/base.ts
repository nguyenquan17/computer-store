import type { IAssetToken } from '@/interfaces'
import { filter, forEach, union } from 'lodash-es'
import { defineStore } from 'pinia'

export const useBaseStore = defineStore('base', () => {
  const systemParams = ref({})
  const listAssetToken = ref<IAssetToken[]>([])
  const listRounding = ref<Record<string, number>>({})
  const siteKey = import.meta.env.VITE_SITEKEY_CAPTCHA
  const popup = ref<string[]>([])

  const setSystemParams = (data: Record<string, any>) => {
    systemParams.value = data
  }

  const setListAssetToken = (list: IAssetToken[]) => {
    listAssetToken.value = list
  }
  const setListRounding = (list: IAssetToken[]) => {
    forEach(list, token => {
      listRounding.value[token.currency] = token.rounding
    })
    listRounding.value['USD'] = 2
    listRounding.value['PERCENT'] = 2
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
    listAssetToken,
    siteKey,
    listRounding,
    popup,
    setSystemParams,
    setListAssetToken,
    setListRounding,
    setOpenPopup
  }
})
