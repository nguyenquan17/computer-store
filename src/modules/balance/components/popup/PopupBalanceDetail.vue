<template>
  <base-popup
    name="popup-detail-balance"
    width="1200px"
    class="popup-detail-balance"
    :is-show-footer="false"
    @open="handleOpen"
    @close="handleClose"
  >
    <template #title>BALANCE DETAIL</template>
    <div class="content pb-6">
      <div class="flex mb-6">
        <div class="avatar">
          <img v-if="rowData.avatar" :src="rowData.avatar" alt="" class="w-20 h-20 object-cover rounded-full" />
          <base-icon v-else icon="default-avatar" size="48" />
        </div>
        <div class="ml-6 w-full">
          <div class="mb-2 font-semibold text-lg">{{ rowData.fullName }}</div>
          <div class="flex items-center">
            <span>{{ rowData.email }}</span>
            <span> | {{ rowData.userName }}</span>
            <div class="cursor-pointer ml-2 flex" @click="handleCopyTransaction(rowData.userName)">
              <base-icon icon="icon-copy" size="20" color="#A19F9D" />
            </div>
          </div>
        </div>
      </div>
      <balance-detail-card :data-card="rowData" />
      <account-statement-card
        :is-loading="isLoading"
        :data-table="dataTable"
        :summary-table="summaryTable"
        :query="query"
        @page-change="handlePageChange"
        @limit-change="handleLimitChange"
      />
    </div>
  </base-popup>
</template>

<script setup lang="ts">
  import type { IBalance, IBalanceDetail, IQueryBalanceDetail, ISummaryBalanceDetail } from '@/interfaces'
  import BalanceDetailCard from '../detail/BalanceDetailCard.vue'
  import AccountStatementCard from '@/modules/balance/components/detail/AccountStatementCard.vue'
  import { apiBalance } from '@/services'
  import { useBaseStore } from '@/stores/base'
  import { ElMessage } from 'element-plus'

  interface IProps {
    rowData: IBalance
  }

  const route = useRoute()
  const baseStore = useBaseStore()
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as IBalance)
  })
  const dataTable: Ref<IBalanceDetail[]> = ref([])
  const summaryTable: Ref<ISummaryBalanceDetail> = ref({} as ISummaryBalanceDetail)
  const query: Ref<IQueryBalanceDetail> = ref({
    currency: '',
    transactionType: '',
    orderBy: 1,
    page: 1,
    limit: 10,
    total: 10,
    userId: 0
  })
  let isLoading: Ref<boolean> = ref(false)

  const init = async (): Promise<void> => {
    try {
      isLoading.value = true
      const params = {
        ...query.value,
        currency: route.params.currency,
        userId: props.rowData.id
      }
      const result = await apiBalance.getListBalanceDetail(params)
      dataTable.value = result.transactions.content
      summaryTable.value = result.summary
      query.value.total = result.transactions.totalElements
      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      console.log(error)
    }
  }

  const handleLimitChange = (limit: number) => {
    query.value.page = 1
    query.value.limit = limit
    init()
  }
  const handlePageChange = (page: number) => {
    query.value.page = page
    init()
  }

  const handleCopyTransaction = (address: string): void => {
    let message: any = ''
    const el = document.createElement('input')
    el.value = address
    document.body.appendChild(el)
    el.select()
    el.setSelectionRange(0, 99999)
    document.execCommand('copy')
    document.body.removeChild(el)
    ElMessage.success({ message: 'Copied', duration: 5000 })
  }

  const handleOpen = () => {
    init()
  }
  const handleClose = () => {
    baseStore.setOpenPopup(false, 'popup-detail-balance')
  }
</script>

<style lang="scss">
  :deep(.popup-detail-balance) {
    .el-dialog__body {
      .popup-content {
        background: #f6f8fc;
      }
    }
  }
  :deep(.el-overlay-dialog .base-popup .el-dialog__body .popup-content) {
    background: #f6f8fc;
  }
</style>
