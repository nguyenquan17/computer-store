<template>
  <div class="flex px-6 py-4 rounded mb-6 bg-white shadow-[0_1px_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.13)]">
    <div class="w-[33%] mr-6 border-r border-solid border-[#dbdbdb]">
      <div class="flex items-center mb-4">
        <img :src="getLogoToken" alt="" width="40" />
        <div class="ml-4">
          <p class="text-lg font-semibold">{{ getCurrencyRouter }} Wallet</p>
          <p class="text-xs text-[#5b616e]">Balance</p>
        </div>
      </div>
      <div class="" :class="checkType(tabActiveFilter.toLowerCase())">
        <p class="text-2xl font-semibold break-words text-[#a19f9d]">
          {{ useFormatCurrency(dataCard.balance, getCurrencyRouter) }}
          {{ getCurrencyRouter }}
        </p>
        <p class="text-[#5b616e]">~${{ useFormatCurrency(dataCard.balanceUSD, 'USD') }}</p>
      </div>
    </div>
    <div class="w-[33%] mr-6 border-r border-solid border-[#dbdbdb]">
      <div class="flex items-center mb-4">
        <img :src="getLogoToken" alt="" width="40" />
        <div class="ml-4">
          <p class="text-lg font-semibold">Available Amount</p>
          <p class="text-xs text-[#5b616e]">Available Amount</p>
        </div>
      </div>
      <div class="" :class="checkType(tabActiveFilter.toLowerCase())">
        <p class="text-2xl font-semibold break-words text-[#a19f9d]">
          {{ useFormatCurrency(dataCard.availableBalance, getCurrencyRouter) }} {{ getCurrencyRouter }}
        </p>
        <p class="text-[#5b616e]">~${{ useFormatCurrency(dataCard.availableBalanceUSD, 'USD') }}</p>
      </div>
    </div>
    <div class="w-[33%] mr-6">
      <div class="flex items-center mb-4">
        <base-icon icon="balance-detail-icon-lock" size="40" />
        <div class="ml-4">
          <p class="text-lg font-semibold">Locked amount</p>
          <p class="text-xs text-[#5b616e]">Withdrawal Request</p>
        </div>
      </div>
      <div class="">
        <p class="text-2xl font-semibold break-words text-[#a19f9d]">
          {{ useFormatCurrency(dataCard.totalLockedAmount, getCurrencyRouter) }} {{ getCurrencyRouter }}
        </p>
        <p class="text-[#5b616e]">~${{ useFormatCurrency(dataCard.totalLockedAmountUSD, getCurrencyRouter) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { filter } from 'lodash-es'
  import { useBaseStore } from '@/stores/base'
  import useFormatCurrency from '@/composables/formatCurrency'

  const route = useRoute()
  const baseStore = useBaseStore()
  const props = defineProps({
    // tabActiveFilter: { required: true, type: String, default: '' },
    dataCard: { required: true, type: Object, default: () => ({}) }
  })
  const tabActiveFilter = ref('MAGIC')
  const checkType = (type: string) => {
    return type === 'lynk'
      ? 'amount-lynk'
      : type === 'hub'
      ? 'amount-hub'
      : type === 'btc'
      ? 'amount-btc'
      : type === 'eth'
      ? 'amount-eth'
      : type === 'usdt'
      ? 'amount-usdt'
      : type === 'bnb'
      ? 'amount-bnb'
      : type === 'usdc'
      ? 'amount-usdc'
      : type === 'busd'
      ? 'amount-busd'
      : 'amount-locker'
  }

  const getCurrencyRouter = computed<string>(() => {
    return route.params.currency as string
  })

  const getLogoToken = computed<string>(() => {
    return filter(baseStore.listAssetToken, elm => elm.currency === route.params.currency)[0]?.iconUrl || ''
  })
</script>

<style scoped></style>
