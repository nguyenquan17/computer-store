<template>
  <div>
    <div class="shadow-md rounded bg-white mb-6">
      <base-tab :list-tab="tabsHeader" :tab-active="tabActiveHeader" @click="handleClickTabHeader">
        <template #more-tab>
          <MoreToken @select="handleClickTabMore"></MoreToken>
          <div class="flex right-0 ml-auto">
            <div class="btn-carousel cursor-pointer" @click="handleClickArrow(-1)">
              <base-icon icon="icon-prev" size="32" />
            </div>
            <div class="btn-carousel cursor-pointer mr-3 ml-4" @click="handleClickArrow(1)">
              <base-icon icon="icon-next" size="32" />
            </div>
          </div>
        </template>
      </base-tab>

      <div ref="wrapCard" class="p-6 flex overflow-hidden carousel-transaction">
        <div
          v-for="(value, index) in listSortedTransactionType"
          :key="index"
          class="p-4 border border-solid border-[#dbdbdb] mr-6 rounded-lg min-w-[240px]"
        >
          <div class="flex justify-between">
            <span class="text-[#5b616e] text-base">{{ renderTitleCard(value.transactionType) }}</span>
            <div><base-icon :icon="renderIconCard(value.transactionType)" size="24" /></div>
          </div>
          <div class="my-2 text-[#0a0b0d] font-semibold">
            <p class="text-[24px] leading-6 break-all">{{ useFormatCurrency(value.totalAmount, tabActiveHeader) }}</p>
          </div>
          <div>
            <span class="text-sm text-[#5b616e] break-all">~${{ useFormatCurrency(value.totalAmountUsd, 'USD') }}</span>
          </div>
        </div>
      </div>
      <base-filter
        ref="refFilter"
        :list-sort="listSort"
        :popper="false"
        width-dropdown="230"
        :popup-name="'popup-filter-transaction'"
        :sort-active="searchParams.orderBy"
        @sort="handleSort"
        @search="handleSearch"
      >
      </base-filter>
      <table-transaction
        class="px-6"
        :is-loading="isLoading"
        :data="data"
        :query="query"
        @limit-change="handleLimitChange"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
      ></table-transaction>
    </div>
    <popup-filter-transaction
      :transaction-type="searchParams.transactionType"
      :list-transaction-type="listTransactionType"
      :is-show-footer="true"
      @reset="handleResetFilter"
      @apply="handleApplyFilter"
      @search="handleSearch"
    ></popup-filter-transaction>
    <popup-detail-transaction :detail-transaction="detailRowTransaction"></popup-detail-transaction>
  </div>
</template>

<script setup lang="ts">
  import type { ITab, ISort } from '@/interfaces'
  import PopupFilterTransaction from '../components/popup/PopupFilterTransaction.vue'
  import PopupDetailTransaction from '../components/popup/PopupDetailTransaction.vue'
  import { apiTransaction } from '@/services'
  import { useBaseStore } from '@/stores/base'
  import type { ITransaction } from '@/interfaces'
  import TableTransaction from '../components/TableTransaction.vue'
  import useFormatCurrency from '@/composables/formatCurrency'
  import { orderBy } from 'lodash'
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'
  const baseStore = useBaseStore()

  const router = useRouter()
  const route = useRoute()
  const isLoading: Ref<boolean> = ref(false)

  interface IDataCard {
    totalAmount: number | any
    transactionType: string | any
    totalAmountUsd: number | any
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
  const detailRowTransaction: Ref<ITransaction> = ref({} as ITransaction)
  const dataHeaderCard = ref<IDataCard[]>([])
  const data = ref([])
  const listTransactionType = ref<ITransactionType[]>([])
  const tabActiveHeader = ref('MAGIC')

  const wrapCard = ref(null)

  const handleClickArrow = (delta: number): void => {
    const carousel = document.querySelector('.carousel-transaction') as HTMLElement
    carousel.scrollTo(carousel.scrollLeft + 264 * delta, 0)
  }
  const renderTitleCard = (transactionType: string) => {
    if (transactionType === 'BUY_TOKEN') return 'Total Buy'
    if (transactionType === 'PLACE_BET') return 'Total Bet'
    if (transactionType === 'WIN') return 'Total Prize'
    if (transactionType === 'REF') return 'Total Referral'
    else return `Total ${useCapitalizeFirstLetter(transactionType)}`
  }
  const renderIconCard = (transactionType: string) => {
    if (transactionType === 'DEPOSIT') return 'icon-deposit'
    if (transactionType === 'BONUS') return 'icon-bonus'
    if (transactionType === 'TRANSFER') return 'icon-transfer'
    if (transactionType === 'WITHDRAW') return 'icon-withdraw'
    if (transactionType === 'BUY_TOKEN') return 'icon-buy-token'
    if (transactionType === 'WIN') return 'icon-win'
    if (transactionType === 'PLACE_BET') return 'icon-place-bet'
    if (transactionType === 'BURN') return 'icon-burn'
    if (transactionType === 'COMMISSION') return 'icon-commission'
    if (transactionType === 'REF') return 'icon-referral'
    else return 'icon-default'
  }

  const handleClickTabHeader = (tab: ITab) => {
    tabActiveHeader.value = tab.value
    router.push({ params: { currency: tab.value } })
    getListTransaction()
  }

  const handleClickTabMore = (tab: string) => {
    tabActiveHeader.value = tab
    router.push({ params: { currency: tab } })
    getListTransaction()
  }
  const listSortedTransactionType = computed(() => {
    let sortedTransactionType: Array<Record<string, any>> = []
    const listSortedTransactionType = orderBy(listTransactionType.value, ['position', 'asc'])
    listSortedTransactionType.forEach(rule => {
      let filter: Array<Record<string, any>> = dataHeaderCard.value.filter(item => item.transactionType === rule.typeName)
      sortedTransactionType = [...sortedTransactionType, ...filter]
    })
    return sortedTransactionType
  })

  onMounted(async () => {
    tabActiveHeader.value = (route.params.currency as string).toUpperCase()
    await getListTransactionType()
    firstTransactionType()
    await getListTransaction()
  })

  const firstTransactionType = () => {
    if (!searchParams.value.transactionType) {
      searchParams.value.transactionType = listTransactionType.value[0].typeName
    }
  }

  const getListTransactionType = async () => {
    try {
      const params = {
        module: 'transaction'
      }
      const result = await apiTransaction.getListTransactionType(params)
      listTransactionType.value = result
    } catch (e) {
      listTransactionType.value = []
    }
  }

  const getListTransaction = async () => {
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
        search: searchParams.value.search,
        ...query.value
      }
      const result = await apiTransaction.getListTransaction('search', params)
      data.value = result.transactions.content
      query.value.total = result.transactions.totalElements
      const arrTransactionType = listTransactionType.value.map(elm => elm.typeName)
      dataHeaderCard.value = result.summary.filter(item => arrTransactionType.includes(item.transactionType))
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      data.value = []
    }
  }
  const handleSort = (sort: ISort) => {
    searchParams.value.orderBy = sort.value as string
    getListTransaction()
  }
  const handleSearch = (text: string) => {
    searchParams.value.search = text
    getListTransaction()
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
  const handleRowClick = (row: ITransaction) => {
    detailRowTransaction.value = row
    baseStore.setOpenPopup(true, 'popup-detail-transaction')
  }

  const resetFilter = () => {
    query.value = {
      ...query.value,
      page: 1
    }
    searchParams.value = {
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

  const handleResetFilter = () => {
    resetFilter()
    baseStore.setOpenPopup(false, 'popup-filter-transaction')
    getListTransaction()
  }
  const handleApplyFilter = (filter: Record<string, any>) => {
    searchParams.value.transactionType = filter.value.transactionType
    searchParams.value.status = filter.value.status
    searchParams.value.fromTransactionDate = filter.value.fromTransactionDate
    searchParams.value.toTransactionDate = filter.value.toTransactionDate
    searchParams.value.fromTransactionAmount = filter.value.fromTransactionAmount
    searchParams.value.toTransactionAmount = filter.value.toTransactionAmount
    baseStore.setOpenPopup(false, 'popup-filter-transaction')
    getListTransaction()
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
