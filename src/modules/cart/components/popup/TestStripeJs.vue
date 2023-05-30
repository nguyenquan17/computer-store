<template>
  <div>
    <button @click="submit">Redirect to Checkout</button>
  </div>
</template>

<script lang="ts" setup>
  import { loadStripe } from '@stripe/stripe-js'
  import { apiOrder } from '@/services'

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  const stripe = ref(null)
  stripePromise.then(stripeInstance => {
    console.log(stripeInstance)
    stripe.value = stripeInstance
    console.log(stripe.value)
  })
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
  const submit = async () => {
    try {
      const session = await apiOrder.createCheckoutSession(lineItems.value)
      stripe.value.redirectToCheckout({ sessionId: session })
    } catch (error) {
      // Handle errors
      console.error(error)
    }
  }
</script>

<style scoped></style>
