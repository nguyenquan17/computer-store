<template>
  <div class="p-6">
    <div class="py-6 text-[#0a0b0d] text-2xl font-semibold">
      <span>Account Statement</span>
    </div>
    <div class="flex justify-between px-3 py-4 bg-[#f3f2f1] text-base font-semibold text-[#0a0b0d]">
      <p>OPENING BALANCE</p>
      <p class="basis-[205px]">{{ summaryTable.openBalance }} {{ getCurrency }}</p>
    </div>
    <div class="">
      <base-table
        :loading="isLoading"
        :data="dataTable"
        :query="query"
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
      >
        <el-table-column label="type" prop="transactionType">
          <template #default="scope">
            <p>{{ checkRowType(scope.row.transactionType) }}</p>
            <p>{{ useFormatDateHourMs(scope.row.transactionMillisecond) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="credit" align="right" prop="creditAmountDisplay">
          <template #default="scope">
            <span v-if="scope.row.creditAmount === 0"> </span>
            <span v-else class="text-[#129961] text-base">+{{ scope.row.creditAmountDisplay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="debit" align="right" prop="debitAmountDisplay">
          <template #default="scope">
            <span v-if="scope.row.debitAmount === 0"></span>
            <span v-else class="text-[#cf202f] text-base">{{ scope.row.debitAmountDisplay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="balance" align="right" prop="balanceDisplay"></el-table-column>
        <el-table-column label="status" align="center" width="144" prop="status">
          <template #default="scope">
            <span v-if="scope.row.status !== 'FAILED'" :class="checkType(scope.row.status)">{{
              checkStatus(scope.row.status)
            }}</span>
            <span v-else class="status-locked">fail</span>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <div class="flex justify-between px-3 py-4 bg-[#f3f2f1] text-base font-semibold text-[#0a0b0d] pr-[calc(100%-717px)]">
      <div class="">TOTAL</div>
      <div class="flex justify-between">
        <p class="w-[238px] text-right" v-if="summaryTable.totalCreditAmount === '0'">0 {{ getCurrency }}</p>
        <p class="w-[238px] text-right" v-else>
          +{{ useFormatCurrency(summaryTable.totalCreditAmount, getCurrency) }}
          {{ getCurrency }}
        </p>
        <p class="w-[238px] text-right" v-if="summaryTable.totalDebitAmount === '0'">0 {{ getCurrency }}</p>
        <p class="w-[238px] text-right" v-else>
          -{{ useFormatCurrency(summaryTable.totalDebitAmount, getCurrency) }}
          {{ getCurrency }}
        </p>
      </div>
    </div>
    <div
      class="rounded bg-[#0151fc] px-3 py-3 mt-2 font-semibold text-base text-[#fff] flex justify-between pr-[calc(100%-955px)]"
    >
      <p>ENDING BALANCE</p>
      <p v-if="summaryTable.closeBalance === '0'">0 {{ getCurrency }}</p>
      <p v-else>{{ useFormatCurrency(summaryTable.closeBalance, getCurrency) }} {{ getCurrency }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useBaseStore } from '@/stores/base'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
  import useAbbreviateNumber from '@/composables/abbreviateNumber'
  import numberWithCommas from '@/composables/formatNumberInput'
  import useFormatCurrency from '@/composables/formatCurrency'
  import type { IBalanceDetail, IQueryBalanceDetail, ISummaryBalanceDetail } from '@/interfaces'
  interface IProps {
    summaryTable: ISummaryBalanceDetail
    dataTable: IBalanceDetail[]
    query: IQueryBalanceDetail
    isLoading: boolean
  }
  const route = useRoute()
  const baseStore = useBaseStore()
  const props = withDefaults(defineProps<IProps>(), {
    summaryTable: () => ({} as ISummaryBalanceDetail),
    dataTable: () => [] as IBalanceDetail[],
    query: () => ({} as IQueryBalanceDetail),
    isLoading: () => false
  })
  const emit = defineEmits<{
    (e: 'page-change', value: number): void
    (e: 'limit-change', value: number): void
  }>()

  const checkType = (type: string): string => {
    switch (type) {
      case 'PENDING':
        return 'status-pending'
      case 'SUCCESS':
        return 'status-verified'
      case 'PROCESSING':
        return 'status-pending'

      default:
        return 'status-rejected'
    }
  }

  const checkStatus = (status: string): string => {
    switch (status) {
      case 'SUCCESS':
        return 'Success'
      case 'PENDING':
        return 'Pending'
      case 'PROCESSING':
        return 'Processing'
      default:
        return 'Failed'
    }
  }

  const checkRowType = (type: string): string => {
    switch (type) {
      case 'WITHDRAW':
        return 'Withdraw'
      case 'DEPOSIT':
        return 'Deposit'
      case 'TRANSFER':
        return 'Transfer'
      case 'CROWDSALE':
        return 'Crowdsale'
      case 'BONUS_EARLY_BACKER':
        return 'Bonus early backer'
      case 'BONUS_BIG_BACKER':
        return 'Bonus big backer'
      case 'BONUS_AFFILIATE':
        return 'Bonus affiliate'
      case 'BONUS_FIRST_TRANS':
        return 'Bonus first transaction'
      case 'BONUS_CROWDSALE':
        return 'Bonus crowdsale'
      case 'BONUS_SIGN_UP':
        return 'Bonus sign up'
      case 'NFT_SALE':
        return 'NFT Sale'
      case 'NFT_TRANSFER':
        return 'NFT Transfer'
      case 'ROYALTIES_FEE':
        return 'Royalties Fee'
      default:
        return type.charAt(0).toUpperCase() + type.toLocaleLowerCase().slice(1)
    }
  }

  const getCurrency = computed<string>(() => {
    return route.params.currency as string
  })

  const handleLimitChange = (limit: number) => {
    emit('limit-change', limit)
  }
  const handlePageChange = (page: number) => {
    emit('page-change', page)
  }
</script>

<style scoped></style>
