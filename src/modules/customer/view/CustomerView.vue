<template>
  <div class="shadow-md rounded bg-white">
    <base-tab :list-tab="listTab" :tab-active="tabActive" @click="handleClickTab" />
    <base-filter
      ref="refFilter"
      :list-sort="listSort"
      width-popper="518"
      width-dropdown="180"
      :sort-active="filter.orderBy"
      @search="handleSearch"
      @sort="handleSort"
      @reset="handleReset"
      @apply="handleApplyFilter"
    >
      <template #filter>
        <el-form label-position="top">
          <div class="flex justify-between">
            <el-form-item class="flex-1 mr-10" label="Created date">
              <el-date-picker
                v-model="filter.fromCreatedAt"
                format="MM/DD/YYYY"
                value-format="x"
                placeholder="From date"
                type="date"
                :teleported="false"
                :disabled-date="$event => useDisableTime($event, 'from', filter.toCreatedAt)"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="flex-1 hide-label" label="1">
              <el-date-picker
                v-model="filter.toCreatedAt"
                format="MM/DD/YYYY"
                value-format="x"
                placeholder="To date"
                type="date"
                :teleported="false"
                :disabled-date="$event => useDisableTime($event, 'to', filter.fromCreatedAt)"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <div class="flex justify-between">
            <el-form-item label="Status" class="flex-1 mr-10">
              <el-select
                v-model="filter.type"
                :teleported="false"
                placeholder="Status"
                class="w-100"
                clearable
                :disabled="route.params.type === 'verified'"
              >
                <el-option v-for="(type, index) in listStatus" :key="index" :label="type.title" :value="type.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Level" class="flex-1">
              <el-select v-model="filter.level" placeholder="Level" clearable :teleported="false">
                <el-option v-for="(type, index) in listLevel" :key="index" :label="type.title" :value="type.value" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </template>
    </base-filter>

    <div class="px-6">
      <customer-table
        :data="data"
        :query="query"
        @limit-change="handleLimitChange"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
      />
    </div>
  </div>
  <popup-detail-customer :row-data="rowCurrent" />
</template>

<script setup lang="ts">
  import type { ITab, ISort, ICustomer } from '@/interfaces'
  import useDisableTime from '@/composables/disableTime'
  import { apiCustomer } from '@/services'
  import CustomerTable from '../components/table/CustomerTable.vue'
  import PopupDetailCustomer from '../components/popup/PopupDetailCustomer.vue'

  import { useBaseStore } from '@/stores/base'
  const baseStore = useBaseStore()

  const router = useRouter()
  const route = useRoute()

  const listTab = ref<ITab[]>([
    {
      title: 'All Customers',
      value: 'ALL'
    },
    {
      title: 'Verified',
      value: 'VERIFIED'
    }
  ])
  const listSort = ref<ISort[]>([
    {
      title: 'Created date',
      value: '1'
    },
    {
      title: 'Last login',
      value: '2'
    }
  ])
  const listStatus = ref<Record<string, any>>([
    {
      title: 'All status',
      value: ''
    },
    {
      title: 'Verified',
      value: 'VERIFIED'
    }
  ])
  const listLevel = ref<Record<string, any>>([
    {
      title: 'Default',
      value: 'DEFAULT'
    },
    {
      title: 'Level 1',
      value: 'LEVEL_1'
    },
    {
      title: 'Level 2',
      value: 'LEVEL_2'
    },
    {
      title: 'Level 3',
      value: 'LEVEL_3'
    },
    {
      title: 'Level 4',
      value: 'LEVEL_4'
    },
    {
      title: 'Level 5',
      value: 'LEVEL_5'
    },
    {
      title: 'MM',
      value: 'MM'
    }
  ])

  const tabActive = ref('ALL')

  const filter = ref({
    fromCreatedAt: '',
    toCreatedAt: '',
    type: '',
    level: '',
    orderBy: '1',
    search: ''
  })
  const query = ref({
    page: 1,
    limit: 20,
    total: 0
  })

  const data = ref([])
  const refFilter = ref(null)
  const rowCurrent = ref<ICustomer>({} as ICustomer)

  onMounted(async () => {
    filter.value.type = route.params.type === 'all' ? '' : (route.params.type as string).toUpperCase()
    tabActive.value = (route.params.type as string).toUpperCase()
    await getListCustomer()
  })

  const getListCustomer = async () => {
    try {
      const rs = await apiCustomer.getListCustomer({ ...query.value, ...filter.value })
      console.log(rs)
      data.value = rs.content
      query.value.total = rs.totalElements
    } catch (error) {
      data.value = []
    }
  }

  const handleClickTab = (tab: ITab) => {
    tabActive.value = tab.value
    router.push({ params: { type: tab.value.toLowerCase() } })
    filter.value.type = tab.value === 'ALL' ? '' : tab.value
    resetFilter()
    getListCustomer()
  }

  const handleSort = (sort: ISort) => {
    filter.value.orderBy = sort.value as string
    getListCustomer()
  }
  const handleSearch = (text: string) => {
    filter.value.search = text
    getListCustomer()
  }

  const handlePageChange = (page: number) => {
    query.value.page = page
    getListCustomer()
  }
  const handleLimitChange = (limit: number) => {
    query.value.limit = limit
    query.value.page = 1
    getListCustomer()
  }
  const handleRowClick = (row: ICustomer) => {
    rowCurrent.value = row
    baseStore.setOpenPopup(true, 'popup-detail-customer')
  }

  const handleApplyFilter = () => {
    console.log('apply')

    query.value.page = 1
    getListCustomer()
  }
  const handleReset = () => {
    query.value.page = 1
    resetFilter()
    getListCustomer()
  }

  const resetFilter = () => {
    query.value = {
      ...query.value,
      page: 1
    }

    filter.value = {
      ...filter.value,
      fromCreatedAt: '',
      toCreatedAt: '',
      level: '',
      orderBy: '1',
      search: ''
    }
    //@ts-ignore
    refFilter.value!.search = ''
  }
</script>

<style scoped></style>
