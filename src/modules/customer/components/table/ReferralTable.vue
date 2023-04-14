<template>
  <div class="w-full">
    <base-filter
      ref="refFilter"
      :list-sort="sorts"
      :sort-active="query.orderBy"
      :width-dropdown="210"
      :width-popper="330"
      @sort="handleSort"
      @search="handleSearch"
      @reset="handleReset"
      @apply="handleApply"
    >
      <template #filter>
        <el-form label-position="top">
          <el-form-item label="Status" class="w-full">
            <el-select v-model="query.status" :teleported="false" placeholder="Status" class="w-full" clearable>
              <el-option v-for="(type, index) in listStatus" :key="index" :label="type.name" :value="type.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="From date" class="w-full">
            <el-date-picker
              v-model="query.fromCreatedAt"
              format="MM/DD/YYYY"
              value-format="x"
              placeholder="From date"
              type="date"
              class="!w-full"
              :teleported="false"
              :disabled-date="$event => useDisableTime($event, 'from', query.toCreatedAt)"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item class="w-full" label="To date">
            <el-date-picker
              v-model="query.toCreatedAt"
              format="MM/DD/YYYY"
              value-format="x"
              placeholder="To date"
              type="date"
              class="!w-full"
              :teleported="false"
              :disabled-date="$event => useDisableTime($event, 'to', query.fromCreatedAt)"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </template>
    </base-filter>

    <base-table
      :data="data"
      :query="query"
      label="Investor"
      :loading="loading"
      class="p-6 pt-0"
      @limit-change="handleLimitChange"
      @page-change="handlePageChange"
    >
      <el-table-column label="name" class-name="no-padding-cell">
        <template #default="scope">
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="email" prop="inviteEmail" width="260"> </el-table-column>
      <el-table-column label="tier" prop="tier" width="100" align="center" />
      <el-table-column label="date" width="200">
        <template #default="scope">
          <p class="text-base">{{ useFormatDateMDY(scope.row.inviteDate) }}</p>
          <p class="text-sm text-description">{{ useFormatDateHMS(scope.row.inviteDate) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="status" align="center" width="120">
        <template #default="scope">
          <span v-if="scope.row.status" :class="checkTypeClass(scope.row.status)">{{
            useCapitalizeFirstLetter(scope.row.status)
          }}</span>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import useDisableTime from '@/composables/disableTime'
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'
  import type { ICustomer, ISort } from '@/interfaces'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
  import { apiCustomer } from '@/services'
  import useFormatDateMDY from '@/composables/formatDateMDY'
  import useFormatDateHMS from '@/composables/formatDateHMS'
  interface IProps {
    rowData: ICustomer
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })
  const refFilter = ref(null)
  const sorts = ref<ISort[]>([
    {
      value: '3',
      title: 'Invited date'
    },
    {
      value: '1',
      title: 'Referral name'
    }
  ])
  const listStatus = ref([
    {
      id: 0,
      name: 'Sign up',
      value: 'SIGNED_UP'
    },
    {
      id: 1,
      name: 'Invited',
      value: 'INVITED'
    }
  ])
  const loading = ref(false)
  const data = ref<Array<Record<string, any>>>([])
  const query = ref({
    orderBy: '',
    search: '',
    status: '',
    fromCreatedAt: '',
    toCreatedAt: '',
    page: 1,
    limit: 10,
    total: 0
  })
  onMounted(() => {
    handleGetListReferral()
  })

  const handleGetListReferral = async () => {
    try {
      loading.value = true
      const rs = await apiCustomer.getListReferral({ ...query.value, userId: props.rowData.userId })
      data.value = rs.content
      query.value.total = rs.totalElements
      loading.value = false
    } catch (error) {
      loading.value = false
    }
  }

  const handleSort = (command: ISort) => {
    query.value.orderBy = command.value as string
  }

  const handleSearch = (text: string) => {
    query.value.search = text
    query.value.page = 1
    handleGetListReferral()
  }
  const handleApply = () => {
    query.value.page = 1
    handleGetListReferral()
  }

  const handleReset = () => {
    query.value = {
      orderBy: '',
      search: '',
      status: '',
      fromCreatedAt: '',
      toCreatedAt: '',
      page: 1,
      limit: 10,
      total: 0
    }
    //@ts-ignore
    refFilter.value!.search = ''
    handleGetListReferral()
  }

  const checkTypeClass = (status: string) => {
    return status === 'INVITED' ? 'status-neutral status' : 'status-warning status'
  }

  const handlePageChange = (page: number) => {
    query.value.page = page
    handleGetListReferral()
  }
  const handleLimitChange = (limit: number) => {
    query.value.limit = limit
    query.value.page = 1
    handleGetListReferral()
  }
</script>

<style scoped></style>
