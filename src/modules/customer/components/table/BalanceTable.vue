<template>
  <div>
    <base-filter
      :list-sort="sorts"
      :show-filter="false"
      :sort-active="filter.orderBy"
      :width-dropdown="210"
      @sort="handleSort"
      @search="handleSearch"
    />
    <base-table :data="data" :show-pagination="false" :loading="loading" class="p-6 pt-0">
      <el-table-column label="#" type="index" align="center" width="40" />
      <el-table-column label="Asset" width="144">
        <template #default="scope">
          <div class="flex items-center">
            <img :src="getIcon(scope.row.asset)" alt="" class="w-6" />
            <span class="pl-2">{{ getAssetTitle(scope.row.asset) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="price" align="right" width="160">
        <template #default="scope">
          <span>${{ useFormatCurrency(scope.row.price, 'USD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="available" align="right" width="200">
        <template #default="scope">
          <span class="text-base">{{ useFormatCurrency(scope.row.available, scope.row.asset) }} {{ scope.row.asset }}</span>
          <span class="block text-sm text-description">~${{ useFormatCurrency(scope.row.availableUSD, 'USD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="locked amount" align="right" width="200">
        <template #default="scope">
          <span class="text-base"
            >{{ useFormatCurrency(scope.row.totalLockedAmount, scope.row.asset) }} {{ scope.row.asset }}</span
          >
          <span class="block text-sm text-description">~${{ useFormatCurrency(scope.row.totalLockedAmountUSD, 'USD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="balance" align="right">
        <template #default="scope">
          <span class="text-base">{{ useFormatCurrency(scope.row.totalBalance, scope.row.asset) }} {{ scope.row.asset }}</span>
          <span class="block text-sm text-description">~${{ useFormatCurrency(scope.row.totalBalanceUSD, 'USD') }}</span>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import type { ISort, ICustomer } from '@/interfaces'
  import { filter as filterLodash } from 'lodash-es'
  import { useBaseStore } from '@/stores/base'
  import useFormatCurrency from '@/composables/formatCurrency'
  import { apiCustomer } from '@/services'
  const baseStore = useBaseStore()
  interface IProps {
    rowData: ICustomer
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })
  const sorts = ref<ISort[]>([
    {
      value: 1,
      title: 'Price'
    },
    {
      value: 2,
      title: 'Available amount'
    },
    {
      value: 3,
      title: 'Locked amount'
    },
    {
      value: 4,
      title: 'Balance amount'
    }
  ])
  const loading = ref(false)
  const data = ref([])
  const filter = ref({
    orderBy: '',
    search: ''
  })

  onMounted(() => {
    handleGetListBalance()
  })

  const handleGetListBalance = async () => {
    try {
      loading.value = true
      data.value = await apiCustomer.getListBalance(props.rowData.userId, filter.value)
      loading.value = false
    } catch (error) {
      loading.value = false
    }
  }

  const handleSort = (command: ISort) => {
    filter.value.orderBy = command.value as string
    handleGetListBalance()
  }

  const handleSearch = (text: string) => {
    filter.value.search = text
    handleGetListBalance()
  }

  const getIcon = (currency: string) => {
    const token = filterLodash(baseStore.listAssetToken, elm => elm.currency === currency)
    return token.length ? token[0].iconUrl : ''
  }

  const getAssetTitle = (currency: string) => {
    const token = filterLodash(baseStore.listAssetToken, elm => elm.currency === currency)
    return token.length ? token[0].currencyName : ''
  }
</script>

<style scoped></style>
