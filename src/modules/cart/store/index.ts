import { defineStore } from 'pinia'
import { apiCart, apiOrder } from '@/services'
import { useAuthStore } from '@/modules/auth/store'

export const useCartStore = defineStore('cart', () => {
  const useAuth = useAuthStore()

  const isLoading: Ref<boolean> = ref(false)
  const cartItemSelected: Ref<Record<string, any>[]> = ref([])
  const detailCart: Ref<Record<string, any>> = ref({})
  const setDataCartItem = (list: Record<string, any>[]) => {
    cartItemSelected.value = list
  }

  const getDetailCart = async () => {
    try {
      isLoading.value = true
      const userId = useAuth.user.userId as number
      console.log(userId)
      const params = {
        userId: userId
      }
      const rs = await apiCart.getCartDetail(params)
      detailCart.value = rs.data
      isLoading.value = false
    } catch (e) {
      console.log(e)
      isLoading.value = false
    }
  }
  return { cartItemSelected, detailCart, setDataCartItem, getDetailCart, isLoading }
})
