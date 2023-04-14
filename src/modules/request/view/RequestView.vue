<template>
  <div class="layout-balance shadow-md rounded bg-white">
    <base-tab :list-tab="getTabBaseToken" :tab-active="tabActive" @click="handleClickTab">
      <template #more-tab>
        <MoreToken @select="handleClickTabMore"></MoreToken>
      </template>
    </base-tab>

    <div class="flex justify-between p-6">
      <div
        class="flex flex-col justify-between basis-[calc(25%-18px)] w-1/5 h-auto border border-solid border-[#dbdbdb] rounded-lg py-0 px-4"
      >
        <div class="flex justify-between mt-1.5">
          <p>Total Available</p>
          <base-icon icon="request-icon-withdraw" size="19" color="#CF202F"></base-icon>
        </div>
        <span class="w-full text-[24px] leading-[24px] mt-2 inline-block font-semibold">
          {{ useFormatCurrency(dataSummaryRequest.totalAmount, tabActive) }}
          <span class="text-xs font-normal">{{ tabActive }}</span>
        </span>
        <p class="text-sm font-normal mt-2 mb-4">${{ useFormatCurrency(dataSummaryRequest.totalAmountUsd, 'USD') }}</p>
      </div>
    </div>
    <base-filter
      width-popper="518"
      width-dropdown="180"
      :sort-active="filter.orderBy"
      :list-sort="listSort"
      @search="handleSearch"
      @sort="handleSort"
      @reset="handleReset"
      @apply="handleApplyFilter"
      ref="refFilter"
    >
      <template #filter>
        <el-form label-position="top">
          <div class="flex justify-between">
            <el-form-item label="Status" class="flex-1">
              <el-select v-model="filter.status" placeholder="Status" clearable :teleported="false" class="w-full">
                <el-option v-for="(type, index) in listStatus" :key="index" :label="type.title" :value="type.value" />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex justify-between">
            <el-form-item class="flex-1 mr-10" label="Request date">
              <el-date-picker
                v-model="filter.fromDate"
                format="MM/DD/YYYY"
                value-format="x"
                placeholder="From date"
                type="date"
                :teleported="false"
                :disabled-date="$event => useDisableTime($event, 'from', filter.toDate)"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="flex-1 hide-label" label="1">
              <el-date-picker
                v-model="filter.toDate"
                format="MM/DD/YYYY"
                value-format="x"
                placeholder="To date"
                type="date"
                :teleported="false"
                :disabled-date="$event => useDisableTime($event, 'to', filter.fromDate)"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="flex justify-between">
            <el-form-item class="flex-1 mr-10" label="Amount">
              <el-input
                placeholder="From"
                v-model="filter.fromAmount"
                @keypress="useOnlyNumber($event, filter.fromAmount)"
                @keyup="useFormatNumberInput($event)"
              >
                <template #prefix>
                  <span class="h-full text-base flex items-center text-[#0a0b0d]">$</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="flex-1 mt-5" label=" ">
              <el-input
                placeholder="To"
                v-model="filter.toAmount"
                @keypress="useOnlyNumber($event, filter.toAmount)"
                @keyup="useFormatNumberInput($event)"
              >
                <template #prefix>
                  <span class="h-full text-base flex items-center text-[#0a0b0d]">$</span>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </template>
    </base-filter>
    <div class="px-6">
      <transaction-withdraw-table
        :isLoading="isLoading"
        :data="dataTransactionWithDraw"
        :query="query"
        @limit-change="handleLimitChange"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
      ></transaction-withdraw-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import useFormatCurrency from '@/composables/formatCurrency'
  import useDisableTime from '@/composables/disableTime'
  import useOnlyNumber from '@/composables/onlyNumber'
  import useFormatNumberInput from '@/composables/formatNumberInput'
  import type { ITab, IQuery, ISort, ITransactionWithdraw, ISummaryRequest } from '@/interfaces'
  import { apiRequest } from '@/services'
  import TransactionWithdrawTable from '@/modules/request/components/table/TransactionWithdrawTable.vue'

  const route = useRoute()
  const router = useRouter()

  const dataTransactionWithDraw: Ref<ITransactionWithdraw[]> = ref([
    {
      id: 31576,
      transactionType: "WITHDRAW",
      transactionDate: "2022-12-29T08:54:36.000+00:00",
      transactionDay: "2022-12-29",
      transactionMillisecond: 1672304076365,
      currency: "LYNK",
      currencyName: "LynKey",
      network: "ERC20",
      networkName: "Ethereum",
      userId: 4,
      fromAddress: "0xbbdcb6b53f1fd934bf6e6ff7da8648cc0a90b0f9",
      toAddress: "hshdhdhd",
      transactionHash: null,
      amount: 2000,
      amountDisplay: "-2,109.70 LYNK",
      transactionFee: 109.7,
      amountToUsd: 53.4176848406832,
      nonce: 0,
      description: "",
      status: "PENDING",
      accountTransactionId: null,
      tokenUsdExchangeRate: 0.02532,
      createdAt: "2022-12-29T08:54:36.000+00:00",
      updatedAt: null,
      rejectedAt: null,
      rejectedReason: null,
      isLimitAmount: 0,
      username: "huetransky@gmail.com",
      fullName: "Trần Thị Huế",
      email: "huetransky@gmail.com"
    }
  ])
  const dataSummaryRequest: Ref<ISummaryRequest> = ref({
    totalAmount: 0,
    transactionType: '',
    totalAmountUsd: 0
  })
  const dataRowTransactionWithdraw: Ref<ITransactionWithdraw> = ref({} as ITransactionWithdraw)
  const tabs: Ref<ITab[]> = ref([
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
  const tabActive: Ref<string> = ref('MAGIC')
  const listSort: Ref<ISort[]> = ref([
    {
      title: 'Request date',
      value: '1'
    },
    {
      title: 'Amount',
      value: '2'
    },
    {
      title: 'Status',
      value: '3'
    },
    {
      title: 'Name',
      value: '4'
    }
  ])
  const filter: Ref<Record<string, any>> = ref({
    status: '',
    fromDate: '',
    toDate: '',
    fromAmount: '',
    toAmount: '',
    orderBy: '1',
    keywordString: ''
  })
  const listStatus: Ref<Record<string, any>> = ref([
    {
      title: 'Pending',
      value: 'PENDING'
    },
    {
      title: 'Rejected',
      value: 'REJECTED'
    }
  ])
  const query: Ref<IQuery> = ref({
    page: 1,
    limit: 10,
    total: 0
  })
  const isLoading: Ref<boolean> = ref(false)

  const getTabBaseToken = computed<ITab[]>(() => {
    return tabs.value
  })
  const handleClickTab = (tab: ITab) => {
    tabActive.value = tab.value
    router.push({ params: { currency: tab.value } })
    resetFilter()
    getListWithDraw()
  }
  const handleClickTabMore = (tab: string) => {
    tabActive.value = tab
    router.push({ params: { currency: tab } })
    resetFilter()
    getListWithDraw()
  }

  onMounted(() => {
    tabActive.value = route.params.currency as string
    getListWithDraw()
  })

  const getListWithDraw = async (): Promise<void> => {
    try {
      isLoading.value = true
      const result = await apiRequest.getListWithDraw({ ...query.value, ...filter.value, currency: tabActive.value })
      // dataTransactionWithDraw.value = result.transactions.content
      dataSummaryRequest.value = result.summaryRequest[0]
      query.value.total = result.transactions.totalElements
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
    }
  }

  const handleLimitChange = (limit: number) => {
    query.value.page = 1
    query.value.limit = limit
    getListWithDraw()
  }
  const handlePageChange = (page: number) => {
    query.value.page = page
    getListWithDraw()
  }
  const handleRowClick = (row: ITransactionWithdraw) => {
    dataRowTransactionWithdraw.value = row
    // baseStore.setOpenPopup(true, 'popup-detail-balance')
  }

  const handleSort = (sort: ISort) => {
    filter.value.orderBy = sort.value as string
    getListWithDraw()
  }
  const handleSearch = (text: string) => {
    filter.value.search = text
    getListWithDraw()
  }

  const handleApplyFilter = (): void => {
    query.value.page = 1
    getListWithDraw()
  }
  const handleReset = (): void => {
    resetFilter()
    getListWithDraw()
  }
  const resetFilter = (): void => {
    query.value = {
      ...query.value,
      page: 1
    }

    filter.value = {
      ...filter.value,
      status: '',
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      orderBy: '1',
      keywordString: ''
    }
  }
</script>

<style scoped></style>
