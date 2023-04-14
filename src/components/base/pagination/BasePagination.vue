<template>
  <div class="base-pagination">
    <div class="flex items-center justify-between">
      <div class="text-sm text-[#5b616e]">
        Show
        {{ userFormatNumber(props.query.total == 0 ? 0 : (props.query.page - 1) * props.query.limit + 1) }}
        -
        {{
          userFormatNumber(
            props.query.page * props.query.limit > props.query.total ? props.query.total : props.query.page * props.query.limit
          )
        }}
        /
        {{ userFormatNumber(props.query.total) }} {{ props.label }}
      </div>
      <div class="list-paging">
        <el-pagination
          :current-page="props.query.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="props.query.limit"
          :total="props.query.total"
          :pager-count="5"
          popper-class="select-pagination"
          background
          layout="sizes, prev, pager, next"
          @size-change="emits('limit-change', $event)"
          @current-change="emits('page-change', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IQuery } from '@/interfaces'
  import userFormatNumber from '@/composables/formatNumber'

  interface IProps {
    query: IQuery
    label: string
  }

  const props = withDefaults(defineProps<IProps>(), {
    query: () => ({
      page: 1,
      limit: 20,
      total: 0
    }),
    label: ''
  })

  const emits = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'limit-change', limit: number): void
  }>()
</script>

<style scoped></style>
