<template>
  <div>
    <div class="shadow-md rounded bg-white mb-6">
      <base-tab :list-tab="tabsHeader" :tab-active="tabActiveHeader" @click="handleClickTabHeader">
        <template #more-tab>
          <MoreToken @select="handleClickTabMore"></MoreToken>
        </template>
      </base-tab>

      <div ref="wrapCard" class="p-6 flex overflow-hidden carousel-transaction">
        <div
          v-for="(value, index) in dataHeaderCard"
          :key="index"
          class="p-4 border border-solid border-[#dbdbdb] mr-6 rounded-lg min-w-[300px]"
        >
          <div class="flex justify-between">
            <span class="text-[#5b616e] text-base">{{ renderTitleCard(value.transactionType) }}</span>
            <div>
              <base-icon
                :color="value.transactionType === 'TOTAL' ? '#DD7D00' : ''"
                :icon="renderIconCard(value.transactionType)"
                size="24"
              />
            </div>
          </div>
          <div class="my-2 text-[#0a0b0d] font-semibold break-all">
            <span class="text-[24px] leading-6">{{ useFormatCurrency(value.totalTransactionFee, tabActiveHeader) }}</span>
            <span class="text-xs font-normal ml-1">{{ tabActiveHeader }}</span>
          </div>
          <div>
            <span class="text-sm text-[#5b616e] break-all">~${{ useFormatCurrency(value.totalTransactionFeeUsd, 'USD') }}</span>
          </div>
        </div>
      </div>
      <base-filter
        ref="refFilter"
        :list-sort="listSort"
        :popper="false"
        width-dropdown="230"
        :popup-name="'popup-filter-fee'"
        :sort-active="searchParams.orderBy"
        @sort="handleSort"
        @search="handleSearch"
      >
      </base-filter>
      <table-fee
        class="px-6"
        :is-loading="isLoading"
        :data="data"
        :query="query"
        @limit-change="handleLimitChange"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
      ></table-fee>
    </div>
    <popup-filter-fee
      :transaction-type="searchParams.transactionType"
      :status="searchParams.status"
      :list-transaction-type="listTransactionType"
      :is-show-footer="true"
      @reset="handleResetFilter"
      @apply="handleApplyFilter"
      @search="handleSearch"
    ></popup-filter-fee>
    <popup-detail-fee :detail-transaction="detailRowTransaction"></popup-detail-fee>
  </div>
</template>

<script setup lang="ts">
  import type { ITab, ISort } from '@/interfaces'
  import PopupFilterFee from '../components/popup/PopupFilterFee.vue'
  import PopupDetailFee from '../components/popup/PopupDetailFee.vue'
  import { apiFee, apiTransaction } from '@/services'
  import { useBaseStore } from '@/stores/base'
  import type { IFee } from '@/interfaces'
  import TableFee from '../components/TableFee.vue'
  import useFormatCurrency from '@/composables/formatCurrency'
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'
  const baseStore = useBaseStore()

  const router = useRouter()
  const route = useRoute()
  const isLoading: Ref<boolean> = ref(false)

  interface IDataCard {
    totalTransactionFee: number | any
    transactionType: string | any
    totalTransactionFeeUsd: number | any
  }
  interface ITransactionType {
    typeName: string | any
    displayName: string | any
    id: number
    position: number
    status: string | any
    module: string | any
  }
  const searchParams = ref({
    transactionType: '',
    status: '',
    fromTransactionDate: '',
    toTransactionDate: '',
    fromTransactionAmount: '',
    toTransactionAmount: '',
    fromTransactionFee: '',
    toTransactionFee: '',
    search: '',
    orderBy: '1'
  })

  const tabsHeader = ref<ITab[]>([
    {
      title: 'MAGIC',
      value: 'MAGIC'
    },
    {
      title: 'ETH',
      value: 'ETH'
    },
    {
      title: 'BNB',
      value: 'BNB'
    },
    {
      title: 'USDT',
      value: 'USDT'
    },
    {
      title: 'BUSD',
      value: 'BUSD'
    }
  ])

  const query = ref({
    page: 1,
    limit: 20,
    total: 0
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
  const detailRowTransaction: Ref<IFee> = ref({} as IFee)
  const dataHeaderCard = ref<IDataCard[]>([])
  const data = ref([])
  const listTransactionType = ref<ITransactionType[]>([])
  const tabActiveHeader = ref('MAGIC')

  const renderTitleCard = (transactionType: string) => {
    if (transactionType === 'TOTAL') return 'Total Fee'
    else return `Total Fee ${useCapitalizeFirstLetter(transactionType)}`
  }
  const renderIconCard = (transactionType: string) => {
    if (transactionType === 'DEPOSIT') return 'icon-deposit'
    if (transactionType === 'WITHDRAW') return 'icon-withdraw'
    if (transactionType === 'TOTAL') return 'icon-total-fee'
    else return 'icon-default'
  }

  const handleClickTabHeader = (tab: ITab) => {
    tabActiveHeader.value = tab.value
    router.push({ params: { currency: tab.value } })
    getListFee()
  }

  const handleClickTabMore = (tab: string) => {
    tabActiveHeader.value = tab
    router.push({ params: { currency: tab } })
    getListFee()
  }

  onMounted(async () => {
    tabActiveHeader.value = (route.params.currency as string).toUpperCase()
    await getListTransactionType()
    firstTransactionType()
    await getListFee()
  })
  const firstTransactionType = () => {
    if (!searchParams.value.transactionType) {
      searchParams.value.transactionType = listTransactionType.value[0].typeName
    }
    if (!searchParams.value.status) {
      searchParams.value.status = 'SUCCESS'
    }
  }

  const getListTransactionType = async () => {
    try {
      const params = {
        module: 'fee'
      }
      const result = await apiTransaction.getListTransactionType(params)
      listTransactionType.value = result
    } catch (e) {
      listTransactionType.value = []
    }
  }

  const getListFee = async () => {
    try {
      isLoading.value = true
      const params = {
        status: searchParams.value.status,
        transactionType: searchParams.value.transactionType,
        orderBy: searchParams.value.orderBy,
        currency: tabActiveHeader.value,
        fromDate: searchParams.value.fromTransactionDate,
        toDate: searchParams.value.toTransactionDate,
        fromAmount: searchParams.value.fromTransactionAmount.replaceAll(',', ''),
        toAmount: searchParams.value.toTransactionAmount.replaceAll(',', ''),
        fromTransactionFee: searchParams.value.fromTransactionFee.replaceAll(',', ''),
        toTransactionFee: searchParams.value.toTransactionFee.replaceAll(',', ''),
        keywordString: searchParams.value.search,
        ...query.value
      }
      const result = await apiFee.getListFee(params)
      data.value = result.transactions.content
      query.value.total = result.transactions.totalElements
      dataHeaderCard.value = result.summary
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      data.value = []
    }
  }
  const handleSort = (sort: ISort) => {
    searchParams.value.orderBy = sort.value as string
    getListFee()
  }
  const handleSearch = (text: string) => {
    searchParams.value.search = text
    getListFee()
  }

  const handleLimitChange = (limit: number) => {
    query.value.page = 1
    query.value.limit = limit
    getListFee()
  }
  const handlePageChange = (page: number) => {
    query.value.page = page
    getListFee()
  }
  const handleRowClick = (row: IFee) => {
    detailRowTransaction.value = row
    baseStore.setOpenPopup(true, 'popup-detail-fee')
  }

  const resetFilter = () => {
    query.value = {
      ...query.value,
      page: 1
    }
    searchParams.value = {
      transactionType: listTransactionType.value[0].typeName,
      status: 'SUCCESS',
      fromTransactionDate: '',
      toTransactionDate: '',
      fromTransactionAmount: '',
      toTransactionAmount: '',
      fromTransactionFee: '',
      toTransactionFee: '',
      search: '',
      orderBy: '1'
    }
  }

  const handleResetFilter = () => {
    resetFilter()
    baseStore.setOpenPopup(false, 'popup-filter-fee')
    getListFee()
  }
  const handleApplyFilter = (filter: Record<string, any>) => {
    searchParams.value.transactionType = filter.value.transactionType
    searchParams.value.status = filter.value.status
    searchParams.value.fromTransactionDate = filter.value.fromTransactionDate
    searchParams.value.toTransactionDate = filter.value.toTransactionDate
    searchParams.value.fromTransactionAmount = filter.value.fromTransactionAmount
    searchParams.value.toTransactionAmount = filter.value.toTransactionAmount
    searchParams.value.fromTransactionFee = filter.value.fromTransactionFee
    searchParams.value.toTransactionFee = filter.value.toTransactionFee
    baseStore.setOpenPopup(false, 'popup-filter-fee')
    getListFee()
  }
</script>

<style scoped>
  .btn-carousel {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
  }

  .carousel-transaction {
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
