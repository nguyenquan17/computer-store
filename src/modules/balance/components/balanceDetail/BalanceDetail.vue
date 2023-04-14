<template>
  <base-popup name="popup-balance-detail" class="popup-balance-detail" width="1040px" :isShowFooter="false" :open="handleOpen" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('balance.popup.title') }}</span>
    </div>
    <div class="content">
      <div class="be-flex mb-24 content__header">
        <div class="avatar">
          <img v-if="detailRow.avatar" :src="detailRow.avatar" altdetailRow.avatar />
          <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />
        </div>
        <div class="ml-24 w-100 info">
          <div class="full-name text-l text-bold">{{ detailRow.fullName }}</div>
          <div class="be-flex align-center">
            <span>{{ detailRow.email }}</span>
            <span> | {{ detailRow.userName }}</span>
            <div class="cursor icon-copy ml-8" @click="handleCopyTransaction(detailRow.userName)">
              <base-icon icon="icon-copy" size="20" />
            </div>
          </div>
        </div>
      </div>
      <balance-detail-card :data-card="detailRow" :tab-active-filter="tabActiveFilter" />
      <account-statement-card
        :is-loading="isLoading"
        :tab-active-filter="tabActiveFilter"
        :data="dataTable"
        :summary="dataSummary"
        @sizeChange="handleSizeChange"
        @pageChange="handlePageChange"
        :query="query"
      />
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'

  import BalanceDetailCard from '@/modules/balance/components/balanceDetail/BalanceDetailCard.vue'
  import AccountStatementCard from '@/modules/balance/components/balanceDetail/AccountStatementCard.vue'
  import getRepository from '@/services'
  import { TransactionRepository } from '@/services/repositories/transaction'
  interface IContent {
    balance: number
    balanceDisplay: string
    createdAt: string
    createdBy: number
    creditAddress: string
    creditAmount: number
    creditAmountDisplay: string
    creditAmountToUsd: number
    creditCurrency: string
    creditFee: number
    creditNetwork: string
    creditUsdExchangeRate: number
    debitAddress: string
    debitAmount: number
    debitAmountDisplay: string
    debitAmountToUsd: number
    debitCurrency: string
    debitFee: number
    debitNetwork: string
    debitUsdExchangeRate: number
    description: string
    id: number
    locked: number
    lockedDisplay: string
    refTransactionCode: string
    status: string
    transactionCode: string
    transactionDate: string
    transactionDay: string
    transactionMillisecond: number
    transactionType: string
    updatedAt: string
    updatedBy: number
    userId: number
  }

  interface ISummary {
    summary: {
      openBalance: string
      closeBalance: string
      totalCreditAmount: string
      totalDebitAmount: string
    }
  }

  interface IQuery {
    currency?: string
    transactionType?: string
    userId?: number
    page?: number
    limit?: number
    search?: string
    orderBy: string | number
    total: number
    type?: string | null | undefined
  }

  const api: TransactionRepository = getRepository('transaction')
  @Component({ components: { BalanceDetailCard, AccountStatementCard } })
  export default class BalanceDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: {} }) detailRow!: Record<string, any>
    @Prop({ required: true }) tabActiveFilter!: string
    detail: Record<string, any> = {}
    isLoading = false
    query: IQuery = {
      currency: '',
      transactionType: '',
      orderBy: 1,
      page: 1,
      limit: 10,
      total: 10,
      userId: 0
    }
    dataTable: IContent[] = [] as IContent[]
    dataSummary: ISummary = {} as ISummary
    tabActive = 0

    async init(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          currency: this.tabActiveFilter.toUpperCase(),
          userId: this.detailRow.id
        }
        const result = await api.getlistBalanceDetail('request/transactions', params)
        this.dataTable = result.transactions.content
        this.dataSummary = result.summary
        this.query.total = result.transactions.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    async handleOpen(): Promise<void> {
      this.query = {
        ...this.query,
        page: 1,
        limit: 10,
        total: 10
      }
      this.init().then()
    }

    handleClose(): void {
      this.tabActive = 0
      this.setOpenPopup({
        popupName: 'popup-balance-detail',
        isOpen: false
      })
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.tabActive = tab.id
    }

    handlePageChange(page: number): void {
      this.query.page = page
      this.init()
    }

    handleSizeChange(limit: number): void {
      this.query.limit = limit
      this.init()
    }
    handleCopyTransaction(address: string): void {
      this.$emit('copy', 'copy')
      let message: any = ''
      const el = document.createElement('input')
      el.value = address
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }
  }
</script>

<style scoped lang="scss">
  .popup-balance-detail {
    color: var(--bc-text-primary);

    .title-popup {
      span {
        color: #0a0b0d;
      }
    }

    ::v-deep .popup-content {
      background-color: #f6f8fc;

      .content {
        padding-bottom: 24px;

        &__header {
          .avatar {
            img {
              width: 48px;
              height: 48px;
              border-radius: 100px;
              object-fit: cover;
            }
          }
          .info {
            .full-name {
              font-size: 18px;
              color: #0a0b0d;
              font-family: Open Sans;
              margin-bottom: 8px;
            }
            span {
              font-size: 12px;
              color: #5b616e;
              font-family: 'Open Sans';
            }
          }
        }

        &__bottom {
          background-color: #fff;
          box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
          border-radius: 4px;

          .tabs {
            border-bottom: 1px solid #d2d0ce;

            .tab-item {
              padding: 16px 12px;
              position: relative;
              color: #5b616e;

              &:hover {
                color: var(--bc-tab-active);
              }
            }

            .tab-active {
              color: var(--bc-tab-active);
              font-weight: 600;

              &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 2px;
                bottom: 0;
                left: 0;
                background-color: var(--bc-tab-active);
              }
            }
          }

          .main-content-loading {
            min-height: 200px;
          }
        }
      }
    }
  }
</style>
