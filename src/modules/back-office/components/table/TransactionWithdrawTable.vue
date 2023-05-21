<template>
  <base-table
    :loading="isLoading"
    :data="dataTransactionWithdraw"
    :query="query"
    label="requests"
    @limit-change="emits('limit-change', $event)"
    @page-change="emits('page-change', $event)"
    @row-click="handleRowClick"
  >
    <el-table-column label="#" type="index" :index="indexMethod" align="center" width="80" />
    <el-table-column label="request date" align="left">
      <template #default="scope">
        <p class="">{{ useFormatDateHourMs(scope.row.transactionMillisecond) }}</p>
      </template>
    </el-table-column>
    <el-table-column label="name" prop="fullName" align="left"> </el-table-column>
    <el-table-column label="email" prop="email" align="left"> </el-table-column>
    <el-table-column label="status" prop="status" align="center">
      <template #default="scope">
        <p :class="checkColorStatus(scope.row.status)">{{ scope.row.status }}</p>
      </template>
    </el-table-column>
    <el-table-column label="amount" prop="payoutAmount" align="right">
      <template #default="scope">
        <p class="">{{ useFormatCurrency(scope.row.amountDisplay, scope.row.currency) }} {{ scope.row.currency }}</p>
        <p class="text-sm text-[#5B616E]">~${{ useFormatCurrency(scope.row.amountToUsd, 'USD') }}</p>
      </template>
    </el-table-column>
  </base-table>
</template>

<script lang="ts" setup>
  import type { ITransactionWithdraw, IQuery } from '@/interfaces'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
  import useFormatCurrency from '@/composables/formatCurrency'
  interface IProps {
    dataTransactionWithdraw: ITransactionWithdraw[]
    query: IQuery
    isLoading: boolean
  }

  const props = withDefaults(defineProps<IProps>(), {
    dataTransactionWithdraw: () => [],
    query: () => ({} as IQuery),
    isLoading: () => false
  })

  const emits = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'limit-change', limit: number): void
    (e: 'row-click', row: ITransactionWithdraw): void
  }>()

  const indexMethod = (index: number) => {
    return (props.query.page - 1) * props.query.limit + index + 1
  }

  const handleRowClick = (row: ITransactionWithdraw) => {
    emits('row-click', row)
  }

  const checkColorStatus = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'w-[80px] h-[24px] bg-[#fff3e2] text-[#dd7d00] rounded my-0 mx-auto'
      case 'REJECTED':
        return 'w-[80px] h-[24px] bg-[#fbedee] text-[#cf202f] rounded my-0 mx-auto'
      default:
        return 'w-[80px] h-[24px] bg-[#e4f9e2] text-[#129961] rounded my-0 mx-auto'
    }
  }
</script>

<style scoped></style>
