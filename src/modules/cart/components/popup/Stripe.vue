<template>
  <div>
    <StripeCheckout ref="checkoutRef" :pk="publishableKey" :session-id="sessionId">

    </StripeCheckout>
    <button @click="submit">Checkout!</button>
  </div>
</template>

<script lang="ts" setup>
import {StripeCheckout} from '@vue-stripe/vue-stripe'
import {apiOrder} from '@/services'

const publicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

const checkoutRef = ref(null)
const sessionId: Ref<string> = ref('')
const publishableKey: Ref<string> = ref(publicKey)
const lineItems: Ref<Record<string, any>[]> = ref([
  {
    clientId: 1,
    productName:
        'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
    imageProduct:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw',
    quantity: 3,
    amount: 100,
    currency: 'USD'
  },
  {
    clientId: 1,
    productName:
        'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
    imageProduct:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw',
    quantity: 1,
    amount: 120,
    currency: 'USD'
  }
])
onUnmounted(() => {
  // Callback function executed when the component is unmounted
  console.log('Component unmounted');
  checkoutRef.value = null

  // Perform any cleanup or necessary actions here
});
const submit = async () => {
  sessionId.value = await apiOrder.createCheckoutSession(lineItems.value)
  // You will be redirected to Stripe's secure checkout page
  //@ts-ignore
  checkoutRef.value.redirectToCheckout()
}
</script>

<style scoped></style>
