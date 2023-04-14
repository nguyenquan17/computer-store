<template>
  <div class="w-full">
    <base-filter
      ref="refFilter"
      :list-sort="listSort"
      :popper="false"
      width-dropdown="230"
      :popup-name="'popup-filter-transaction'"
      :sort-active="query.orderBy"
      @sort="handleSort"
      @search="handleSearch"
    >
    </base-filter>
    <table-transaction
      class="table-transaction px-6"
      :is-loading="isLoading"
      :data="data"
      :query="query"
      module="CUSTOMER"
      @limit-change="handleLimitChange"
      @page-change="handlePageChange"
    ></table-transaction>

    <popup-filter-transaction
      :list-transaction-type="listTransactionType"
      :is-show-footer="true"
      :transaction-type="query.transactionType"
      module="CUSTOMER"
      @reset="handleResetFilter"
      @apply="handleApplyFilter"
      @search="handleSearch"
    ></popup-filter-transaction>
  </div>
</template>

<script setup lang="ts">
  import type { ICustomer, IQuery, ISort } from '@/interfaces'
  import TableTransaction from '@/modules/transaction/components/TableTransaction.vue'
  import PopupFilterTransaction from '@/modules/transaction/components/popup/PopupFilterTransaction.vue'
  import { apiCustomer, apiTransaction } from '@/services'
  import { useBaseStore } from '@/stores/base'
  import { forEach } from 'lodash-es'

  interface IProps {
    rowData: ICustomer
  }
  interface ITransactionType {
    typeName: string | any
    displayName: string | any
    id: number
    position: number
    status: string | any
    module: string | any
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })
  const baseStore = useBaseStore()

  const isLoading = ref(false)
  const data = ref<Array<Record<string, any>>>([])
  const query = ref<IQuery>({
    page: 1,
    limit: 20,
    total: 0,
    transactionType: '',
    status: '',
    fromTransactionDate: '',
    toTransactionDate: '',
    fromTransactionAmount: '',
    toTransactionAmount: '',
    search: '',
    orderBy: '1'
  })
  const listSort = ref<ISort[]>([
    {
      title: 'Transaction date',
      value: '1'
    },
    {
      title: 'Transaction amount',
      value: '2'
    },
    {
      title: 'Status',
      value: '3'
    }
  ])
  const listTransactionType = ref<ITransactionType[]>([])

  onMounted(async () => {
    await getListTransactionType()
    firstTransactionType()
    await getListTransaction()
  })

  const firstTransactionType = () => {
    if (!query.value.transactionType) {
      query.value.transactionType = listTransactionType.value[0].typeName
    }
  }
  const getListTransaction = async () => {
    try {
      const result = await apiCustomer.getListTransactionCustomer(props.rowData.userId, query.value)
      console.log(result)
      data.value = result.content
      query.value.total = result.totalElements
    } catch (error) {
      isLoading.value = false
      data.value = []
    }
  }

  const getListTransactionType = async () => {
    try {
      const params = {
        module: 'transaction'
      }
      listTransactionType.value = await apiTransaction.getListTransactionType(params)
    } catch (e) {
      listTransactionType.value = []
    }
  }

  const handleLimitChange = (limit: number) => {
    query.value.page = 1
    query.value.limit = limit
    getListTransaction()
  }
  const handlePageChange = (page: number) => {
    query.value.page = page
    getListTransaction()
  }
  const handleSort = (sort: ISort) => {
    query.value.orderBy = sort.value as string
    getListTransaction()
  }
  const handleSearch = (text: string) => {
    query.value.search = text
    getListTransaction()
  }

  const handleResetFilter = () => {
    resetFilter()
    baseStore.setOpenPopup(false, 'popup-filter-transaction')
    getListTransaction()
  }
  const handleApplyFilter = (filter: Record<string, any>) => {
    query.value = { ...query.value, ...filter.value }
    baseStore.setOpenPopup(false, 'popup-filter-transaction')
    getListTransaction()
  }

  const resetFilter = () => {
    query.value = {
      ...query.value,
      page: 1,
      transactionType: listTransactionType.value[0].typeName,
      status: '',
      fromTransactionDate: '',
      toTransactionDate: '',
      fromTransactionAmount: '',
      toTransactionAmount: '',
      search: '',
      orderBy: '1'
    }
  }
</script>

<style scoped lang="scss">
  :deep(.table-transaction) {
    .column-tx {
      .flex {
        justify-content: space-between;
        span:first-child {
          width: 50%;
          margin: 0;
        }
        span:last-child {
          flex: 1;
        }
      }
    }
  }
</style>
