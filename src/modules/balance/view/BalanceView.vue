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
          <p>Investor</p>
          <base-icon icon="balance-icon-investor" size="19" color="#DD7D00"></base-icon>
        </div>
        <span class="w-full text-[24px] leading-[24px] mt-2 inline-block font-semibold">{{
          dataSummaryBalance.numOfInvestor
        }}</span>
        <p class="text-sm font-normal mt-2 mb-4">of total {{ dataSummaryBalance.numOfUser }}</p>
      </div>
      <div
        class="flex flex-col justify-between basis-[calc(25%-18px)] w-1/5 h-auto border border-solid border-[#dbdbdb] rounded-lg py-0 px-4"
      >
        <div class="flex justify-between mt-1.5">
          <p>Total Available</p>
          <base-icon icon="balance-icon-swap" size="19" color="#129961"></base-icon>
        </div>
        <span class="w-full text-[24px] leading-[24px] mt-2 inline-block font-semibold">
          {{ useFormatCurrency(dataSummaryBalance.totalAvailable, tabActive) }}
          <span class="text-xs font-normal">{{ tabActive }}</span>
        </span>
        <p class="text-sm font-normal mt-2 mb-4">${{ useFormatCurrency(dataSummaryBalance.totalAvailableUSD, 'USD') }}</p>
      </div>
      <div
        class="flex flex-col justify-between basis-[calc(25%-18px)] w-1/5 h-auto border border-solid border-[#dbdbdb] rounded-lg py-0 px-4"
      >
        <div class="flex justify-between mt-1.5">
          <p>Total Locked</p>
          <base-icon icon="balance-icon-lock" size="19"></base-icon>
        </div>
        <span class="w-full text-[24px] leading-[24px] mt-2 inline-block font-semibold">
          {{ useFormatCurrency(dataSummaryBalance.totalLocked, tabActive) }}
          <span class="text-xs font-normal">{{ tabActive }}</span>
        </span>
        <p class="text-sm font-normal mt-2 mb-4">${{ useFormatCurrency(dataSummaryBalance.totalLockedUSD, 'USD') }}</p>
      </div>
      <div
        class="flex flex-col justify-between basis-[calc(25%-18px)] w-1/5 h-auto border border-solid border-[#dbdbdb] rounded-lg py-0 px-4"
      >
        <div class="flex justify-between mt-1.5">
          <p>Balance</p>
          <base-icon icon="balance-icon-wallet" size="19"></base-icon>
        </div>
        <span class="w-full text-[24px] leading-[24px] mt-2 inline-block font-semibold">
          {{ useFormatCurrency(dataSummaryBalance.totalBalance, tabActive) }}
          <span class="text-xs font-normal">{{ tabActive }}</span>
        </span>
        <p class="text-sm font-normal mt-2 mb-4">${{ useFormatCurrency(dataSummaryBalance.totalBalanceUSD, 'USD') }}</p>
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
            <el-form-item class="flex-1 mr-10" label="Available amount">
              <el-input
                placeholder="From"
                v-model="filter.fromAvailableAmount"
                @keypress="useOnlyNumber($event, filter.fromAvailableAmount)"
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
                v-model="filter.toAvailableAmount"
                @keypress="useOnlyNumber($event, filter.toAvailableAmount)"
                @keyup="useFormatNumberInput($event)"
              >
                <template #prefix>
                  <span class="h-full text-base flex items-center text-[#0a0b0d]">$</span>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="flex justify-between">
            <el-form-item class="flex-1 mr-10" label="Locked amount">
              <el-input
                placeholder="From"
                v-model="filter.fromLockedAmount"
                @keypress="useOnlyNumber($event, filter.fromLockedAmount)"
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
                v-model="filter.toLockedAmount"
                @keypress="useOnlyNumber($event, filter.toLockedAmount)"
                @keyup="useFormatNumberInput($event)"
              >
                <template #prefix>
                  <span class="h-full text-base flex items-center text-[#0a0b0d]">$</span>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="flex justify-between">
            <el-form-item class="flex-1 mr-10" label="Balance">
              <el-input
                placeholder="From"
                v-model="filter.fromBalanceAmount"
                @keypress="useOnlyNumber($event, filter.fromBalanceAmount)"
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
                v-model="filter.toBalanceAmount"
                @keypress="useOnlyNumber($event, filter.toBalanceAmount)"
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
      <balance-table
        :isLoading="isLoading"
        :data="dataBalance"
        :query="query"
        @limit-change="handleLimitChange"
        @page-change="handlePageChange"
        @row-click="handleRowClick"
      />
    </div>
    <popup-balance-detail :row-data="detailRowBalance"></popup-balance-detail>
  </div>
</template>

<script lang="ts" setup>
import {storeToRefs} from 'pinia'
import {useBaseStore} from '@/stores/base'
import useFormatCurrency from '@/composables/formatCurrency'
import useOnlyNumber from '@/composables/onlyNumber'
import useFormatNumberInput from '@/composables/formatNumberInput'

import type {IBalance, IQuery, ISort, ITab} from '@/interfaces'
import type {Ref} from 'vue'
import BalanceTable from '../components/table/BalanceTable.vue'
import PopupBalanceDetail from '../components/popup/PopupBalanceDetail.vue'
import {apiBalance} from '@/services'

const route = useRoute()
  const router = useRouter()
  const { listAssetToken } = storeToRefs(useBaseStore())
  const baseStore = useBaseStore()
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
      title: 'Created date',
      value: '1'
    },
    {
      title: 'Last changed',
      value: '2'
    },
    {
      title: 'Balance',
      value: '3'
    },
    {
      title: 'Locked amount',
      value: '4'
    },
    {
      title: 'Available amount',
      value: '5'
    },
    {
      title: 'Name',
      value: '6'
    }
  ])
  const filter: Ref<Record<string, any>> = ref({
    toBalanceAmount: '',
    fromBalanceAmount: '',
    toLockedAmount: '',
    fromLockedAmount: '',
    toAvailableAmount: '',
    fromAvailableAmount: '',
    orderBy: '3',
    search: ''
  })
  const query: Ref<IQuery> = ref({
    page: 1,
    limit: 10,
    total: 0
  })
  const dataBalance: Ref<IBalance[]> = ref([])
  const dataSummaryBalance: Ref<Record<string, number | string | any>> = ref({
    numOfInvestor: '',
    numOfUser: '',
    totalAvailable: '',
    totalBalance: '',
    totalLocked: '',
    totalAvailableUSD: '',
    totalLockedUSD: '',
    totalBalanceUSD: ''
  })
  const detailRowBalance: Ref<IBalance> = ref({} as IBalance)
  const isLoading: Ref<boolean> = ref(false)
  onMounted(() => {
    tabActive.value = route.params.currency as string
    getListBalance()
  })

  const getListBalance = async (): Promise<void> => {
    try {
      isLoading.value = true
      const convertFilter = {
        ...filter.value,
        toBalanceAmount: filter.value.toBalanceAmount.replaceAll(',', ''),
        fromBalanceAmount: filter.value.fromBalanceAmount.replaceAll(',', ''),
        toLockedAmount: filter.value.toLockedAmount.replaceAll(',', ''),
        fromLockedAmount: filter.value.fromLockedAmount.replaceAll(',', ''),
        toAvailableAmount: filter.value.toAvailableAmount.replaceAll(',', ''),
        fromAvailableAmount: filter.value.fromAvailableAmount.replaceAll(',', '')
      }
      const response = await apiBalance.getListBalance(tabActive.value, { ...convertFilter, ...query.value })
      dataBalance.value = response.balances || []
      query.value.total = response.totalElement
      dataSummaryBalance.value.numOfInvestor = response.numOfInvestor
      dataSummaryBalance.value.numOfUser = response.numOfUser
      dataSummaryBalance.value.totalAvailable = response.totalAvailable
      dataSummaryBalance.value.totalBalance = response.totalBalance
      dataSummaryBalance.value.totalLocked = response.totalLocked
      dataSummaryBalance.value.totalBalance = response.totalBalance
      dataSummaryBalance.value.totalAvailableUSD = response.totalAvailableUSD
      dataSummaryBalance.value.totalLockedUSD = response.totalLockedUSD
      dataSummaryBalance.value.totalBalanceUSD = response.totalBalanceUSD
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      console.log(e)
    }
  }

  const handleClickTab = (tab: ITab): void => {
    tabActive.value = tab.value
    router.push({ params: { currency: tab.value } })
    resetFilter()
    getListBalance()
  }
  const handleClickTabMore = (tab: string): void => {
    tabActive.value = tab
    router.push({ params: { currency: tab } })
    resetFilter()
    getListBalance()
  }

  const getTabBaseToken = computed<ITab[]>(() => {
    return tabs.value
  })

  const handleSort = (sort: ISort): void => {
    filter.value.orderBy = sort.value as string
    getListBalance()
  }
  const handleSearch = (text: string): void => {
    filter.value.search = text
    getListBalance()
  }

  const handleApplyFilter = (): void => {
    query.value.page = 1
    getListBalance()
  }
  const handleReset = (): void => {
    query.value.page = 1
    resetFilter()
    getListBalance()
  }

  const handleLimitChange = (limit: number): void => {
    query.value.page = 1
    query.value.limit = limit
    getListBalance()
  }
  const handlePageChange = (page: number): void => {
    query.value.page = page
    getListBalance()
  }
  const handleRowClick = (row: IBalance): void => {
    detailRowBalance.value = row
    baseStore.setOpenPopup(true, 'popup-detail-balance')
  }

  const resetFilter = (): void => {
    query.value = {
      ...query.value,
      page: 1
    }

    filter.value = {
      ...filter.value,
      toBalanceAmount: '',
      fromBalanceAmount: '',
      toLockedAmount: '',
      fromLockedAmount: '',
      toAvailableAmount: '',
      fromAvailableAmount: '',
      orderBy: '3',
      search: ''
    }
    //@ts-ignore
    // refFilter.value!.search = ''
  }
</script>

<style scoped lang="scss"></style>
