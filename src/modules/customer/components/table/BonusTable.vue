<template>
  <div class="w-full">
    <base-filter
      ref="refFilter"
      :list-sort="sorts"
      :sort-active="query.orderBy"
      :width-dropdown="210"
      :width-popper="520"
      @sort="handleSort"
      @search="handleSearch"
      @reset="handleReset"
      @apply="handleApply"
    >
      <template #filter>
        <el-form label-position="top">
          <div class="flex">
            <el-form-item label="Transaction type" class="flex-1 mr-10">
              <el-select v-model="query.transactionType" :teleported="false" placeholder="Status" class="w-full" clearable>
                <el-option v-for="(type, index) in listType" :key="index" :label="type.name" :value="type.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Status" class="flex-1">
              <el-select v-model="query.status" :teleported="false" placeholder="Status" class="w-full" clearable>
                <el-option v-for="(type, index) in listStatus" :key="index" :label="type.name" :value="type.value" />
              </el-select>
            </el-form-item>
          </div>

          <div class="flex">
            <el-form-item label="Date" class="flex-1 mr-10">
              <el-date-picker
                v-model="query.fromDate"
                format="MM/DD/YYYY"
                value-format="x"
                placeholder="From date"
                type="date"
                class="!w-full"
                :teleported="false"
                :disabled-date="$event => useDisableTime($event, 'from', query.toDate)"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item class="flex-1 hide-label" label="To date">
              <el-date-picker
                v-model="query.toDate"
                format="MM/DD/YYYY"
                value-format="x"
                placeholder="To date"
                type="date"
                class="!w-full"
                :teleported="false"
                :disabled-date="$event => useDisableTime($event, 'to', query.fromDate)"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <div class="flex">
            <el-form-item label="Transaction amount" class="flex-1 mr-10">
              <el-input
                v-model="query.fromAmount"
                placeholder="From amount"
                @keypress="useOnlyNumber($event, query.fromAmount)"
                @keyup="useFormatNumberInput($event)"
              ></el-input>
            </el-form-item>

            <el-form-item class="flex-1 hide-label" label="To">
              <el-input
                v-model="query.toAmount"
                placeholder="To amount"
                @keypress="useOnlyNumber($event, query.toAmount)"
                @keyup="useFormatNumberInput($event)"
              ></el-input>
            </el-form-item>
          </div>
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
      <el-table-column label="#" :index="getIndex" type="index" width="50" />
      <el-table-column label="transaction id" width="280">
        <template #default="scope">
          <div class="flex items-center justify-between">
            <span class="d-ib">{{ useFormatTxCode(scope.row.transactionCode) }}</span>
            <div class="cursor h-6 mr-8" @click="useCopy(scope.row.transactionCode)">
              <base-icon icon="copy" size="24" color="#A19F9D" />
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="type" width="210">
        <template #default="scope">
          <span>{{ useCapitalizeFirstLetter(scope.row.bonusProgramCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="date" width="180">
        <template #default="scope">
          <p class="text-base">{{ useFormatDateMDY(scope.row.transactionDate) }}</p>
          <p class="text-sm text-description">{{ useFormatDateHMS(scope.row.transactionDate) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="status" align="center" width="120">
        <template #default="scope">
          <span v-if="scope.row.status" :class="scope.row.status === 'PENDING' ? 'status-pending' : 'status-success'">{{
            useCapitalizeFirstLetter(scope.row.status)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="amount" align="right">
        <template #default="scope">
          <div v-if="scope.row.tokenAmount" class="text-increase">
            <span>+{{ useFormatCurrency(scope.row.tokenAmount, scope.row.tokenCurrency) }} {{ scope.row.tokenCurrency }}</span>
            <span class="block text-sm text-description">~${{ useFormatCurrency(scope.row.tokenAmountToUsd, 'USD') }}</span>
          </div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import useDisableTime from '@/composables/disableTime'
  import useOnlyNumber from '@/composables/onlyNumber'
  import useFormatNumberInput from '@/composables/formatNumberInput'
  import type { ICustomer, ISort } from '@/interfaces'
  import useFormatTxCode from '@/composables/formatTxCode'
  import useCopy from '@/composables/copy'
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
  import useFormatCurrency from '@/composables/formatCurrency'
  import { apiCustomer } from '@/services'
  import useFormatDateHMS from '@/composables/formatDateHMS'
  import useFormatDateMDY from '@/composables/formatDateMDY'

  interface IProps {
    rowData: ICustomer
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })
  const refFilter = ref(null)
  const sorts = ref<ISort[]>([
    {
      value: '1',
      title: 'Created date'
    },
    {
      value: '2',
      title: 'Amount'
    }
  ])

  const listType = ref([
    {
      id: 0,
      name: 'Sign Up Bonus',
      value: 'BONUS_SIGN_UP'
    },
    {
      id: 1,
      name: 'First Transaction Bonus',
      value: 'BONUS_FIRST_TRANS'
    }
  ])
  const listStatus = ref([
    {
      id: 0,
      name: 'Pending',
      value: 'PENDING'
    },
    {
      id: 1,
      name: 'Paid',
      value: 'PAID'
    }
  ])

  const loading = ref(false)
  const data = ref<Array<Record<string, any>>>([])
  const query = ref({
    orderBy: '',
    search: '',
    status: '',
    transactionType: '',
    fromAmount: '',
    toAmount: '',
    toDate: '',
    fromDate: '',
    page: 1,
    limit: 10,
    total: 0
  })

  const getIndex = computed(() => {
    return query.value.limit * (query.value.page - 1) + 1
  })

  onMounted(() => {
    handleGetListBonus()
  })

  const handleGetListBonus = async () => {
    try {
      loading.value = true
      const rs = await apiCustomer.getListBonus({ ...query.value, userId: props.rowData.userId })
      data.value = rs.content
      query.value.total = rs.totalElements
      loading.value = false
    } catch (error) {
      loading.value = false
    }
  }

  const handleSort = (command: ISort) => {
    query.value.orderBy = command.value as string
    handleGetListBonus()
  }

  const handleSearch = (text: string) => {
    query.value.search = text
    query.value.page = 1
    handleGetListBonus()
  }
  const handleApply = () => {
    query.value.page = 1
    handleGetListBonus()
  }

  const handleReset = () => {
    query.value = {
      orderBy: '',
      search: '',
      status: '',
      transactionType: '',
      fromAmount: '',
      toAmount: '',
      toDate: '',
      fromDate: '',
      page: 1,
      limit: 10,
      total: 0
    }
    //@ts-ignore
    refFilter.value!.search = ''
    handleGetListBonus()
  }

  const handlePageChange = (page: number) => {
    query.value.page = page
    handleGetListBonus()
  }
  const handleLimitChange = (limit: number) => {
    query.value.limit = limit
    query.value.page = 1
    handleGetListBonus()
  }
</script>

<style scoped></style>
