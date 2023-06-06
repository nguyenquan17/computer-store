<template>
  <base-table
      :data="dataTransactionWithdraw"
      :loading="isLoading"
      :query="query"
      label="requests"
      @limit-change="emits('limit-change', $event)"
      @page-change="emits('page-change', $event)"
      @row-click="handleRowClick"
  >
    <el-table-column :index="indexMethod" align="center" label="#" type="index" width="80"/>
    <el-table-column align="left" label="request date">
      <template #default="scope"></template>
    </el-table-column>
    <el-table-column align="left" label="name" prop="fullName"></el-table-column>
    <el-table-column align="left" label="email" prop="email"></el-table-column>
    <el-table-column align="center" label="status" prop="status">
      <template #default="scope">
        <p :class="checkColorStatus(scope.row.status)">{{ scope.row.status }}</p>
      </template>
    </el-table-column>
    <el-table-column align="right" label="amount" prop="payoutAmount">
      <template #default="scope"></template>
    </el-table-column>
  </base-table>
</template>

<script lang="ts" setup>
import type {IQuery} from '@/interfaces'
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
  (e: 'row-click', row: Record<string, any>): void
}>()

const indexMethod = (index: number) => {
  return (props.query.page - 1) * props.query.limit + index + 1
}

const handleRowClick = (row: Record<string, any>) => {
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