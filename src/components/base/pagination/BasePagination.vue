<template>
  <div class="base-pagination">
    <div class="flex items-center justify-between">
      <div class="text-sm text-[#5b616e]">
        Hiển thị
        {{ userFormatNumber(props.query.total == 0 ? 0 : props.query.page * props.query.size + 1) }}
        -
        {{
          userFormatNumber(
            props.query.page + props.query.size > props.query.total ? props.query.total : props.query.page + props.query.size
          )
        }}
        /
        {{ userFormatNumber(props.query.total) }} {{ props.label }}
      </div>
      <div class="list-paging">
        <el-pagination
          :page-size="props.query.size"
          :page-sizes="[10, 20, 50, 100]"
          :pager-count="5"
          :total="props.query.total"
          background
          layout="sizes, prev, pager, next"
          popper-class="select-pagination"
          @size-change="emits('limit-change', $event)"
          @current-change="emits('page-change', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IQuery } from '@/interfaces'
  import userFormatNumber from '@/composables/formatNumber'

  interface IProps {
    query: IQuery
    label: string
  }

  const props = withDefaults(defineProps<IProps>(), {
    query: () => ({
      page: 0,
      size: 20,
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
