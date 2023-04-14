<template>
  <base-table
    :data="props.data"
    :query="query"
    label="Customers"
    @limit-change="emits('limit-change', $event)"
    @page-change="emits('page-change', $event)"
    @row-click="handleRowClick"
  >
    <el-table-column key="1" label="#" type="index" :index="indexMethod" align="center" width="80" />
    <el-table-column key="2" label="name" :width="isSmallScreen ? 190 : 200">
      <template #default="scope">
        <div class="be-flex align-center">
          <span class="d-ib mr-2 line-clamp-1">{{ scope.row.fullName }}</span>
        </div>
      </template>
    </el-table-column>
    <!-- email address / wallet address -->

    <el-table-column key="3" label="email" prop="email">
      <template #default="scope">
        <p class="line-clamp-1">{{ scope.row.email }}</p>
      </template>
    </el-table-column>
    <el-table-column key="4" label="Address" prop="address" :width="isSmallScreen ? 250 : 300">
      <template #default="scope">
        <div class="flex items-center justify-between">
          <div class="text-add">
            {{ useFormatTxCode(scope.row.username, isSmallScreen ? 8 : 10) }}
          </div>
          <div class="cursor h-6 mr-10" @click="useCopy(scope.row.username), (isConflictClick = true)">
            <base-icon icon="copy" size="24" color="#A19F9D" />
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column key="5" label="level" prop="level" :width="isSmallScreen ? 120 : 150">
      <template #default="scope">
        <span>{{ getLevelCurrent(scope.row) }}</span>
      </template>
    </el-table-column>
    <el-table-column key="6" label="date" prop="createdDate" width="140">
      <template #default="scope">
        <p>{{ useFormatDateMDY(scope.row.createdDate) }}</p>
        <p class="text-sm text-description">{{ useFormatDateHMS(scope.row.createdDate) }}</p>
      </template>
    </el-table-column>
    <el-table-column key="7" label="status" prop="emailVerified" align="center" :width="isSmallScreen ? 140 : 160">
      <template #default="scope">
        <span :class="checkType(scope.row.emailVerified)">{{ checkStatus(scope.row.emailVerified) }}</span>
      </template>
    </el-table-column>
  </base-table>
</template>

<script setup lang="ts">
  import useCopy from '@/composables/copy'
  import useFormatTxCode from '@/composables/formatTxCode'
  import useFormatDateHMS from '@/composables/formatDateHMS'
  import useFormatDateMDY from '@/composables/formatDateMDY'

  import type { ICustomer, IQuery } from '@/interfaces'
  interface IProps {
    data: Array<Record<string, any>>
    query: IQuery
  }

  const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
    query: () => ({
      page: 1,
      limit: 20,
      total: 0
    })
  })

  const emits = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'limit-change', limit: number): void
    (e: 'row-click', row: ICustomer): void
  }>()

  const isConflictClick = ref(false)

  const isSmallScreen = computed(() => {
    return window.innerWidth < 1440
  })

  const indexMethod = (index: number) => {
    return (props.query.page - 1) * props.query.limit + index + 1
  }

  const getLevelCurrent = (row: Record<string, any>) => {
    try {
      if (row.level && row.level === 'MM') {
        return 'MM'
      } else if (row.level !== 'Default') {
        return `Level ${row.level.match(/\d+/)[0]}`
      } else {
        return 'Default'
      }
    } catch (error) {
      return ''
    }
  }

  const checkType = (type: string) => {
    return type === '1' ? 'status-verified' : 'status-not-verified'
  }

  const checkStatus = (status: string) => {
    return status === '1' ? 'Verified' : 'Unverified'
  }

  const handleRowClick = (row: Record<string, any>) => {
    if (isConflictClick.value) {
      isConflictClick.value = false
      return
    }
    emits('row-click', row as ICustomer)
  }
</script>

<style scoped></style>
