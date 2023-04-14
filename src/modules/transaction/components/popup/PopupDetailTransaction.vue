<template>
  <base-popup name="popup-detail-transaction" width="480px" class="popup-detail-transaction" :is-show-footer="false">
    <template #title>{{ detailTransaction.transactionType?.replaceAll('_', ' ') }} {{ detailTransaction.currency }}</template>
    <div>
      <div class="mb-2 pt-8 pb-4 bg-[#fff] text-center">
        <img
          class="mb-6 mx-auto"
          :src="checkTypeImg(detailTransaction.transactionType, detailTransaction.status)"
          width="64"
          height="64"
        />
        <p class="text-[20px] leading-6 font-semibold" :class="checkValueAmountDisplay(detailTransaction.amountDisplay)">
          {{ detailTransaction.amountDisplay }}
        </p>
        <p class="text-sm font-normal text-[#5b616e]">~${{ useFormatCurrency(detailTransaction.amountToUsd, 'USD') }}</p>
      </div>
    </div>
    <div class="bg-[#fff] p-6 mb-2">
      <p class="text-base font-semibold">Transaction Details</p>
      <div class="flex justify-between border-b py-[14px] border-solid border-[#dbdbdb]">
        <p class="text-sm font-normal text-[#5b616e]">Transaction ID</p>
        <div class="flex text-base text-[#0a0b0d]">
          <span>{{ useFormatTxCode(detailTransaction.transactionCode, 10) }}</span>
          <span class="ml-2" @click="useCopy(detailTransaction.transactionCode)">
            <base-icon icon="icon-copy" size="24" color="#A19F9D" />
          </span>
        </div>
      </div>
      <div class="flex justify-between border-b py-[14px] border-solid border-[#dbdbdb]">
        <p class="text-sm font-normal text-[#5b616e]">Date</p>
        <div class="flex text-base text-[#0a0b0d]">
          <span>{{ useFormatDateHourMs(detailTransaction.transactionMillisecond) }}</span>
        </div>
      </div>
      <div class="flex justify-between border-b py-[14px] border-solid border-[#dbdbdb]">
        <p class="text-sm font-normal text-[#5b616e]">To</p>
        <div class="flex text-base text-[#0a0b0d]">
          <span>{{ useFormatTxCode(detailTransaction.toAddress, 10) }}</span>
          <span class="ml-2" @click="useCopy(detailTransaction.toAddress)">
            <base-icon icon="icon-copy" size="24" color="#A19F9D" />
          </span>
        </div>
      </div>
      <div class="flex justify-between py-[14px]">
        <p class="text-sm font-normal text-[#5b616e]">Status</p>
        <div class="flex text-base text-[#0a0b0d]">
          <span :class="checkType(detailTransaction.status)">{{ useCapitalizeFirstLetter(detailTransaction.status) }}</span>
        </div>
      </div>
    </div>
    <div class="bg-[#fff] p-6">
      <p class="text-base font-semibold">Customer Info</p>
      <div class="flex justify-between border-b py-[14px] border-solid border-[#dbdbdb]">
        <p class="text-sm font-normal text-[#5b616e]">Full name</p>
        <div class="flex text-base text-[#0a0b0d]">
          <span>{{ detailTransaction.fullName }}</span>
        </div>
      </div>
      <div class="flex justify-between border-b py-[14px] border-solid border-[#dbdbdb]">
        <p class="text-sm font-normal text-[#5b616e]">Phone number</p>
        <div class="flex text-base text-[#0a0b0d]">
          <span v-if="detailTransaction.phoneCode">({{ detailTransaction.phoneCode }}) {{ detailTransaction.phone }}</span>
        </div>
      </div>
      <div class="flex justify-between py-[14px]">
        <p class="text-sm font-normal text-[#5b616e]">Email</p>
        <div class="flex text-base text-[#0a0b0d]">
          <span>{{ detailTransaction.email }}</span>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script setup lang="ts">
  import type { ITransaction } from '@/interfaces'
  import useFormatCurrency from '@/composables/formatCurrency'
  import useCopy from '@/composables/copy'
  import useFormatTxCode from '@/composables/formatTxCode'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'

  interface IProps {
    detailTransaction: ITransaction
  }
  const props = withDefaults(defineProps<IProps>(), {
    detailTransaction: () => ({} as ITransaction)
  })
  const checkValueAmountDisplay = (value: string | null) => {
    if (value) {
      if (value.indexOf('+') !== -1) {
        return 'text-[#129961]'
      } else {
        return 'text-[#cf202f]'
      }
    } else return ''
  }

  const checkType = (type: string) => {
    return type === 'PENDING'
      ? 'status status-pending'
      : type === 'FAILED'
      ? 'status status-error'
      : type === 'PROCESSING'
      ? 'status status-warning'
      : type === 'REJECTED'
      ? 'status status-rejected'
      : 'status status-success'
  }

  const checkTypeImg = (type: string | undefined, status: string | undefined) => {
    if (type && status) {
      if (status === 'PENDING' || status === 'PROCESSING') {
        if (type.split('_').includes('BONUS'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_814738761_1680838607456.png'
        if (type.split('_').includes('WITHDRAW') || type.split('_').includes('PLACE'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_1068752010_1680838604125.png'
        if (type.split('_').includes('TRANSFER') || type.split('_').includes('BUY'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_1951104486_1680838605112.png'
        if (type.split('_').includes('DEPOSIT') || type.split('_').includes('WIN'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_1029639176_1680838605884.png'
      }
      if (status === 'SUCCESS') {
        if (type.split('_').includes('BONUS'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_888851594_1680836903973.png'
        if (type.split('_').includes('WITHDRAW') || type.split('_').includes('PLACE'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_938716523_1680838353894.png'
        if (type.split('_').includes('TRANSFER') || type.split('_').includes('BUY'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_207145455_1680837707458.png'
        if (type.split('_').includes('DEPOSIT') || type.split('_').includes('WIN'))
          return 'https://s3.cloud.cmctelecom.vn/bework-production/task/district/1/2023/4/7/15344_1687546300_1680837629094.png'
      }
    }
  }
</script>

<style lang="scss">
  .popup-detail-transaction {
    --el-dialog-margin-top: 15vh !important;
    .popup-content {
      background: #f6f8fc;
      padding: 0 !important;
    }
  }
</style>
