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

    <el-table-column key="2" label="transaction id" class-name="column-tx" :width="isSmallScreen ? 260 : 320" min-width="260">
      <template #default="scope">
        <div class="">
          <div class="flex">
            <span v-if="isSmallScreen" class="mr-4 w-[170px]">{{ useFormatTxCode(scope.row.transactionHash, 8) }}</span>
            <span v-else class="mr-4 w-[210px]">{{ useFormatTxCode(scope.row.transactionHash, 10) }}</span>
            <span @click="useCopy(scope.row.transactionHash), (isConflictClick = true)">
              <base-icon icon="icon-copy" size="24" color="#A19F9D" />
            </span>
          </div>
          <p class="text-sm text-[#5b616e]">{{ useFormatDateHourMs(scope.row.transactionMillisecond) }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column key="3" label="customer" :width="isSmallScreen ? 180 : 220">
      <template #default="scope">
        <span>{{ scope.row.fullName }}</span>
        <p class="text-sm text-[#5b616e]">{{ scope.row.email }}</p>
      </template>
    </el-table-column>
    <el-table-column key="6" label="amount" align="right">
      <template #default="scope">
        <div>
          <p :class="checkValueAmountDisplay(scope.row.amountDisplay)">{{ scope.row.amountDisplay }}</p>
          <p class="text-sm font-normal text-[#5b616e]">~${{ useFormatCurrency(scope.row.amountToUsd, 'USD') }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column key="7" label="extra fee" align="right" :width="isSmallScreen ? 200 : ''">
      <template #default="scope">
        <span :class="checkValueAmountDisplay(scope.row.extraFeeDisplay)">{{ scope.row.extraFeeDisplay }}</span>
        <p class="text-sm text-[#5b616e]">~${{ useFormatCurrency(scope.row.extraFeeToUsd, 'USD') }}</p>
      </template>
    </el-table-column>
    <el-table-column key="8" label="total fee" align="right" :width="isSmallScreen ? 200 : ''">
      <template #default="scope">
        <div>
          <p :class="checkValueAmountDisplay(scope.row.totalFeeDisplay)">{{ scope.row.totalFeeDisplay }}</p>
          <p class="text-sm text-[#5b616e]">~${{ useFormatCurrency(scope.row.totalFeeToUsd, 'USD') }}</p>
        </div>
      </template>
    </el-table-column>
  </base-table>
</template>

<script setup lang="ts">
  import type { IQuery, IFee } from '@/interfaces'
  import useCopy from '@/composables/copy'
  import useFormatTxCode from '@/composables/formatTxCode'
  import useFormatCurrency from '@/composables/formatCurrency'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
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
    (e: 'row-click', row: IFee): void
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
  const handleRowClick = (row: Record<string, any>) => {
    if (isConflictClick.value) {
      isConflictClick.value = false
      return
    }
    emits('row-click', row as IFee)
  }
</script>

<style lang="scss"></style>
