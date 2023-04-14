<template>
  <base-table
    :loading="isLoading"
    :data="data"
    :query="query"
    :label="data.length > 1 ? 'transactions' : 'transaction'"
    @limit-change="emits('limit-change', $event)"
    @page-change="emits('page-change', $event)"
    @row-click="handleRowClick"
  >
    <el-table-column key="1" label="#" type="index" :index="indexMethod" align="center" width="80" />

    <el-table-column key="2" label="transaction id" class-name="column-tx" :width="isSmallScreen ? 260 : ''" min-width="260">
      <template #default="scope">
        <div>
          <div class="flex">
            <span v-if="isSmallScreen" class="mr-4 !w-[170px]">{{ useFormatTxCode(scope.row.transactionCode, 8) }}</span>
            <span v-else class="mr-4 w-[210px]">{{ useFormatTxCode(scope.row.transactionCode, 10) }}</span>
            <span @click="useCopy(scope.row.transactionCode), (isConflictClick = true)">
              <base-icon icon="icon-copy" size="24" color="#A19F9D" />
            </span>
          </div>
          <p class="text-sm text-[#5b616e]">{{ useFormatDateHourMs(scope.row.transactionMillisecond) }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column key="3" label="type" :width="module === 'CUSTOMER' ? 200 : isSmallScreen ? 130 : 180">
      <template #default="scope">
        <span>{{ useCapitalizeFirstLetter(scope.row.transactionType) }}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column v-if="module === 'TRANSACTION'" key="4" label="game" :width="isSmallScreen ? 100 : 150">
      <template #default="scope">
        <span>{{ scope.row.marketName }}</span>
      </template>
    </el-table-column>  -->
    <el-table-column v-if="module === 'TRANSACTION'" key="6" label="customer" :width="isSmallScreen ? 180 : 250">
      <template #default="scope">
        <div>
          <p>{{ scope.row.fullName }}</p>
          <p class="text-sm font-normal text-[#5b616e]">{{ scope.row.email }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column key="7" label="status" align="center" :width="isSmallScreen ? 120 : 140">
      <template #default="scope">
        <span :class="checkType(scope.row.status)">{{ useCapitalizeFirstLetter(scope.row.status) }}</span>
      </template>
    </el-table-column>
    <el-table-column key="8" label="amount" align="right" :width="isSmallScreen ? '' : 240">
      <template #default="scope">
        <div v-if="module === 'CUSTOMER'">
          <div v-if="scope.row.creditAmount" class="text-increase">
            <p>+{{ useFormatCurrency(scope.row.transactionAmount, scope.row.creditCurrency) }} {{ scope.row.creditCurrency }}</p>
            <p class="text-sm text-description">~${{ useFormatCurrency(scope.row.transactionAmountToUsd, 'USD') }}</p>
          </div>
          <div v-else class="text-decrease">
            <p>-{{ useFormatCurrency(scope.row.transactionAmount, scope.row.debitCurrency) }} {{ scope.row.debitCurrency }}</p>
            <p class="text-sm text-description">~${{ useFormatCurrency(scope.row.transactionAmountToUsd, 'USD') }}</p>
          </div>
        </div>
        <div v-else>
          <p :class="checkValueAmountDisplay(scope.row.amountDisplay)">{{ scope.row.amountDisplay }}</p>
          <p class="text-sm text-[#5b616e]">~${{ scope.row.amountToUsd.toFixed(2) }}</p>
        </div>
      </template>
    </el-table-column>
  </base-table>
</template>

<script setup lang="ts">
  import type { IQuery, ITransaction } from '@/interfaces'
  import useCopy from '@/composables/copy'
  import useFormatTxCode from '@/composables/formatTxCode'
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'
  import useFormatCurrency from '@/composables/formatCurrency'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
  interface IProps {
    data: Array<Record<string, any>>
    query: IQuery
    isLoading: boolean
    module?: 'CUSTOMER' | 'TRANSACTION'
  }

  const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
    query: () => ({
      page: 1,
      limit: 20,
      total: 0
    }),
    isLoading: () => false,
    module: 'TRANSACTION'
  })
  const emits = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'limit-change', limit: number): void
    (e: 'row-click', row: ITransaction): void
  }>()

  const isConflictClick = ref(false)

  const isSmallScreen = computed(() => {
    return window.innerWidth < 1400
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

  const indexMethod = (index: number) => {
    return (props.query.page - 1) * props.query.limit + index + 1
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

  const handleRowClick = (row: Record<string, any>) => {
    if (isConflictClick.value) {
      isConflictClick.value = false
      return
    }
    emits('row-click', row as ITransaction)
  }
</script>

<style lang="scss"></style>
