<template>
  <div class="base-table">
    <el-table
      ref="table"
      v-loading="props.loading"
      :data="props.data"
      :empty-text="props.emptyText"
      :show-summary="props.showSummary"
      :sum-text="props.sumText"
      class="base-custom-table be-flex-item"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <template #append>
        <slot name="append" />
      </template>
      <template #empty>
        <empty-block :empty-text="emptyText" :show="!props.data.length" />
      </template>
      <slot />
    </el-table>
    <base-pagination
      v-if="showPagination"
      :label="label"
      :query="query"
      @limit-change="emits('limit-change', $event)"
      @page-change="emits('page-change', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { IQuery } from '@/interfaces'

  interface IProp {
    loading?: boolean
    emptyText?: string
    data: Array<Record<string, any>>
    showSummary?: boolean
    sumText?: string
    // summaryMethod(data: Record<string, any>): any[]
    query?: IQuery
    label?: string
    showPagination?: boolean
  }

  const props = withDefaults(defineProps<IProp>(), {
    loading: false,
    emptyText: 'There are no data',
    data: () => [],
    showSummary: false,
    sumText: 'Total',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // summaryMethod: (_data: Record<string, any>) => [],
    label: '',
    showPagination: true,
    query: () => ({
      page: 1,
      limit: 20,
      total: 0
    })
  })

  const emits = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'limit-change', limit: number): void
    (e: 'row-click', row: Record<string, any>): void
    (e: 'selection-change', row: Record<string, any>): void
  }>()

  const handleRowClick = (row: Record<string, any>) => {
    emits('row-click', row)
  }
  const handleSelectionChange = (val: Record<string, any>) => {
    emits('selection-change', val)
  }
</script>

<style scoped></style>
