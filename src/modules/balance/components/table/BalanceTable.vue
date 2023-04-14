<template>
  <base-table
    :loading="isLoading"
    :data="data"
    :query="query"
    label="investors"
    @limit-change="emits('limit-change', $event)"
    @page-change="emits('page-change', $event)"
    @row-click="handleRowClick"
  >
    <el-table-column label="#" type="index" :index="indexMethod" align="center" width="80" />
    <el-table-column label="name" prop="fullName"> </el-table-column>
    <el-table-column label="email" prop="email"> </el-table-column>

    <el-table-column label="available" align="right">
      <template #default="scope">
        <div class="">
          <p class="">{{ useFormatCurrency(scope.row.availableBalance, scope.row.currency) }} {{ scope.row.currency }}</p>
          <p class="text-sm text-[#5B616E]">~${{ useFormatCurrency(scope.row.availableBalanceUSD, 'USD') }}</p>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="locked amount" align="right">
      <template #default="scope">
        <div class="">
          <p class="">{{ useFormatCurrency(scope.row.totalLockedAmount, scope.row.currency) }} {{ scope.row.currency }}</p>
          <p class="text-sm text-[#5B616E]">~${{ useFormatCurrency(scope.row.totalLockedAmountUSD, 'USD') }}</p>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="balance" align="right">
      <template #default="scope">
        <div class="">
          <p class="">{{ useFormatCurrency(scope.row.balance, scope.row.currency) }} {{ scope.row.currency }}</p>
          <p class="text-sm text-[#5B616E]">~${{ useFormatCurrency(scope.row.balanceUSD, 'USD') }}</p>
        </div>
      </template>
    </el-table-column>
  </base-table>
</template>

<script setup lang="ts">
  import type { IQuery, IBalance } from '@/interfaces'
  import useFormatCurrency from '@/composables/formatCurrency'

  interface IProps {
    data: Array<Record<string, any>>
    query: IQuery
    isLoading: boolean
  }

  const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
    query: () => ({
      page: 1,
      limit: 20,
      total: 0
    }),
    isLoading: () => false
  })

  const emits = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'limit-change', limit: number): void
    (e: 'row-click', row: IBalance): void
  }>()

  const indexMethod = (index: number) => {
    return (props.query.page - 1) * props.query.limit + index + 1
  }

  const handleRowClick = (row: IBalance) => {
    emits('row-click', row)
  }
</script>

<style scoped lang="scss"></style>
