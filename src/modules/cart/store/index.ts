import { defineStore } from 'pinia'
import { apiCart } from '@/services'
import { useAuthStore } from '@/modules/auth/store'

export const useCartStore = defineStore('cart', () => {
  const useAuth = useAuthStore()

  const cartItemSelected: Ref<Record<string, any>[]> = ref([])
  const detailCart: Ref<Record<string, any>> = ref({})
  const setDataCartItem = (list: Record<string, any>[]) => {
    cartItemSelected.value = list
  }

  const getDetailCart = async () => {
    try {
      const userId = useAuth.user.userId as number
      console.log(userId)
      const params = {
        userId: userId
      }
      const rs = await apiCart.getCartDetail(params)
      console.log(rs)
      detailCart.value = rs.data
    } catch (e) {
      console.log(e)
    }
  }
  return { cartItemSelected, detailCart, setDataCartItem, getDetailCart }
})
