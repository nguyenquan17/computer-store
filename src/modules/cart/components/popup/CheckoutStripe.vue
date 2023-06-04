<template>
  <div>
    <base-button :loading="isLoading" class="mb-4" @click="submit">Thanh toán</base-button>
  </div>
</template>

<script lang="ts" setup>
  import { loadStripe } from '@stripe/stripe-js'
  import { apiOrder } from '@/services'
  import { useCartStore } from '@/modules/cart/store'
  import { useAuthStore } from '@/modules/auth/store'
  import type { IFormShipping } from '@/interfaces'
  import Cookies from 'js-cookie'

  interface IProps {
    formCardShippingInfo: IFormShipping
  }

  const props = withDefaults(defineProps<IProps>(), {
    formCardShippingInfo: () => ({} as IFormShipping)
  })

  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  const stripe = ref<any>(null)
  stripePromise.then(stripeInstance => {
    console.log(stripeInstance)
    stripe.value = stripeInstance
    console.log(stripe.value)
  })
  const lineItems: Ref<Record<string, any>[]> = ref([])
  const listExchangeRate: Ref<Record<string, any>> = ref({})
  const isLoading: Ref<boolean> = ref(false)

  onMounted(() => {
    getExchangeRate()
  })

  const getExchangeRate = async () => {
    try {
      const rs = await apiOrder.getExchangeRate()
      listExchangeRate.value = rs.data
      console.log(listExchangeRate.value)
    } catch (e) {
      console.log(e)
    }
  }

  const getExchangeRateUSDtoVND = computed<number>(() => {
    return listExchangeRate.value['VND'].value || 23000
  })

  const getListLineItem = computed<Record<string, any>[]>(() => {
    if (cartStore.detailCart?.cartItemDetailList.length) {
      return cartStore.detailCart?.cartItemDetailList.map(item => {
        return {
          clientId: authStore.user.userId,
          productName: item.productName,
          imageProduct: item.productImage[0],
          quantity: item.itemQuantity,
          amount: item.totalPricePerProduct / getExchangeRateUSDtoVND.value,
          currency: 'USD'
        }
      })
    }
  })

  const createOrder = async (): Promise<void> => {
    try {
      isLoading.value = true
      const body = {
        cartId: cartStore.detailCart.cartId,
        clientId: authStore.user.userId,
        consigneeName: props.formCardShippingInfo.consigneeName,
        consigneePhoneNumber: props.formCardShippingInfo.consigneePhoneNumber,
        deliveryAddress: props.formCardShippingInfo.deliveryAddress
      }
      const rs = await apiOrder.createOrder(body)
      const orderId = rs.data.toString()
      await createSessionCheckout(orderId)
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      console.log(e)
    }
  }

  const createSessionCheckout = async (orderId: string): Promise<void> => {
    try {
      isLoading.value = true
      const session = await apiOrder.createCheckoutSession(getListLineItem.value, orderId)
      stripe.value.redirectToCheckout({ sessionId: session.id })
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      console.log(e)
    }
  }

  const submit = async () => {
    try {
      await createOrder()
      // await createSessionCheckout()
    } catch (error) {
      // Handle errors
      console.error(error)
    }
  }
</script>

<style scoped></style>
