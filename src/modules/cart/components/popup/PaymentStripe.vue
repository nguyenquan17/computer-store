<template>
  <div>
    <stripe-checkout ref="checkoutRef" :pk="publishableKey" :session-id="sessionId" />
    <button @click="submit">Checkout!</button>
  </div>
</template>

<script>
  import { StripeCheckout } from '@vue-stripe/vue-stripe'
  import { apiOrder } from '@/services'

  const publicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  export default {
    components: {
      StripeCheckout
    },
    data() {
      // this.publishableKey = import.meta.env.STRIPE_PUBLISHABLE_KEY

      return {
        loading: false,
        sessionId: 'session-id',
        publishableKey: publicKey,
        lineItems: [
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
        ]
      }
    },
    onMounted() {},
    methods: {
      async submit() {
        this.sessionId = await apiOrder.createCheckoutSession(this.lineItems)
        // You will be redirected to Stripe's secure checkout page
        this.$refs.checkoutRef.redirectToCheckout()
      }
    }
  }
</script>
