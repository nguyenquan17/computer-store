<template>
  <div class="fee">
    <div class="w-100 bo-kyc">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div class="tab-item cursor" v-for="tab in getTab" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
              <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="container wallet-header-task">
        <div class="col-width col-margin">
          <div class="sack-banlance">
            <span class="text1">
              {{ $t(`fee.total-withdraw`) }}
            </span>
            <div>
              <base-icon icon="icon-upload" size="24" />
            </div>
          </div>
          <span class="number2">
            {{ withdraw.totalTransactionFee | convertAmountDecimal(withdraw.currency) }} <span class="currency">{{ withdraw.currency }} </span>
          </span>
          <div>
            <span class="text3">~${{ withdraw.totalTransactionFeeUsd | convertAmountDecimal('USD') }}</span>
          </div>
        </div>

        <div class="col-width col-margin">
          <div class="sack-banlance">
            <span class="text1">{{ $t(`fee.total-transfer`) }} </span>
            <div>
              <base-icon icon="icon-swap-2" size="24" />
            </div>
          </div>
          <span class="number2">
            {{ transfer.totalTransactionFee | convertAmountDecimal(transfer.currency) }} <span class="currency">{{ transfer.currency }} </span></span
          >
          <span class="text3">~${{ transfer.totalTransactionFeeUsd | convertAmountDecimal('USD') }}</span>
        </div>
        <div class="col-width col-margin">
          <div class="sack-banlance">
            <span class="text1">{{ $t(`fee.total-fee`) }}</span>
            <div>
              <base-icon icon="total-fee" size="24" />
            </div>
          </div>
          <span class="number2">
            {{ (withdraw.totalTransactionFee + transfer.totalTransactionFee) | convertAmountDecimal(withdraw.currency) }}
            <span class="currency">{{ withdraw.currency }} </span></span
          >
          <span class="text3">~${{ (withdraw.totalTransactionFeeUsd + transfer.totalTransactionFeeUsd) | convertAmountDecimal('USD') }} </span>
        </div>
        <div class="col-width col-margin" style="visibility: hidden">
          <div class="sack-banlance">
            <span class="text1"> {{ $t(`fee.total-exchange`) }}</span>
            <div>
              <base-icon icon="icon-gift" size="24" />
            </div>
          </div>
          <!-- <span class="number2"> {{ numOfLyn | convertAmountDecimal(withdraw.currency) }} <span class="currency">{{withdraw.currency}} </span></span>
            <span class="text3">~${{ totalLynAvai | convertAmountDecimal('USD') }} </span> -->
        </div>
      </div>
    </div>
    <div class="w-100 box-shadow" style="height: auto; background-color: white">
      <div class="w-100 filter-header">
        <span
          v-for="type in filterTypes"
          class="filter-type cursor"
          :key="type.typeId"
          :class="typeActive.typeId === type.typeId ? 'tab-active' : null"
          @click="handleChangeType(type)"
        >
          {{ type.title }}
        </span>
      </div>
      <div class="w-100" style="background-color: red">
        <fee-filter @filterFee="handleFilter($event)" @reseted="handleNormalize" :reseted="{ deleteCache: isChanged }" />
        <fee-table
          v-loading="isLoading"
          @rowClick="handleRowClick"
          @sizeChange="handleSizeChange"
          @pageChange="handlePageChange"
          :query="query"
          :propTabActive="tabActive"
          :data="propdataTable"
        />
      </div>
    </div>
    <fee-detail :detail-row="detailRow" :tab-active-filter="tabActive" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  //@ts-ignore
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { FeeRepository } from '@/services/repositories/fee'
  // import EventBus from '@/utils/eventBus'
  import { debounce } from 'lodash'
  import FeeFilter from '../components/filter/FeeFilter.vue'
  import FeeTable from '../components/feeTable.vue'
  import FeeDetail from '../components/feeDetail/FeeDetail.vue'
  const api: FeeRepository = getRepository('fee')

  import { namespace } from 'vuex-class'
  import { number } from '@amcharts/amcharts4/core'

  const beBase = namespace('beBase')

  @Component({ components: { FeeFilter, FeeTable, FeeDetail } })
  export default class Fee extends Mixins(PopupMixin) {
    typeActive = {
      typeId: 1,
      title: this.$i18n.t('fee.withdraw'),
      value: this.$i18n.t('fee.withdraw-value')
    }
    currencyActive = 1
    defaultFilterTypes: Array<Record<string, any>> = [
      {
        typeId: 1,
        title: this.$i18n.t('fee.withdraw'),
        value: this.$i18n.t('fee.withdraw-value')
      },
      {
        typeId: 2,
        title: this.$i18n.t('fee.transfer'),
        value: this.$i18n.t('fee.transfer-value')
      }
      // ,
      // {
      //   typeId: 3,
      //   title: this.$i18n.t('fee.trading'),
      //   value: this.$i18n.t('fee.trading-value')
      // },
      // {
      //   typeId: 4,
      //   title: this.$i18n.t('fee.exchange'),
      //   value: this.$i18n.t('fee.exchange-value')
      // }
    ]

    tabs: Array<Record<string, any>> = [
      {
        id: 2,
        title: 'BTC',
        routeName: 'FeeBtc'
      },
      {
        id: 3,
        title: 'ETH',
        routeName: 'FeeEth'
      },
      {
        id: 4,
        title: 'BNB',
        routeName: 'FeeBnb'
      },
      {
        id: 5,
        title: 'USDT',
        routeName: 'FeeUsdt'
      },
      {
        id: 6,
        title: 'USDC',
        routeName: 'FeeUsdc'
      },
      {
        id: 7,
        title: 'BUSD',
        routeName: 'FeeBusd'
      }
    ]
    titlePending = ''
    tabActive = ''
    isLoading = false
    isChanged = false

    data: Array<Record<string, any>> = []
    filters: any = {
      fromAmount: null,
      fromDate: null,
      fromFee: null,
      orderBy: null,
      search: null,
      status: null,
      toAmount: null,
      toDate: null,
      toFee: null
    }
    detailRow = {}
    dataDetail = {}

    query: any = {
      keywordString: '',
      currency: '',
      transactionType: '',
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      fromTransactionFee: '',
      toTransactionFee: '',
      orderBy: '1',
      status: '',
      page: 1,
      limit: 10,
      total: 10
    }

    withdraw: any = {}
    transfer: any = {}
    listApproveBy: Record<string, any>[] = []

    get filterTypes(): Array<Record<string, any>> {
      return this.defaultFilterTypes
    }

    get getTab(): Array<Record<string, any>> {
      return [
        {
          id: 1,
          title: 'LYNK',
          routeName: 'FeeLynk'
        },
        ...this.tabs
      ]
    }
    get getTabActive(): string {
      console.log(this.$route.path.split('/')[2])

      return this.$route.path.split('/')[2]
    }
    created(): void {
      this.tabActive = this.getTabActive
      console.log('route', this.$route.path.split('/')[2])
      this.query.currency = this.getTabActive
      this.query.status = 'SUCCESS'
      this.query.transactionType = this.typeActive.value
      this.debounceInit()
    }

    propdataTable: Record<string, any>[] = []

    async init(): Promise<void> {
      try {
        this.isLoading = true
        let params = {}
        params = {
          ...this.query,
          // userId: this.query.userId,
          orderBy: this.query.orderBy,
          limit: this.query.limit,
          page: this.query.page,
          currency: this.tabActive,
          fromDate: this.query.fromDate,
          toDate: this.query.toDate,
          fromAmount: this.query.fromAmount,
          toAmount: this.query.toAmount,
          transactionType: this.query.transactionType,
          total: null
        }
        const result = await api.getListFee('', params)
        this.propdataTable = result.transactions.content
        if (this.propdataTable.length > 0) {
          //   this.propdataTable = this.propdataTable.map(
          //   (item) => {
          //     if(this.query.status !== null)
          //     {
          //       item.status = this.query.status
          //     }
          //     return item
          //   }
          // )
          this.propdataTable.forEach(item => {
            item.status =
              item.status === 'PENDING' || item.status === 'SUCCESS' || item.status === 'REJECTED' || item.status === 'PROCESSING' || item.status === 'FAILED'
                ? item.status
                : item.status === 'LOCKED'
                ? 'PENDING'
                : 'PROCESSING'
          })
        }
        const summaryWithdraw = result.summary.filter(item => {
          return item.transactionType === 'WITHDRAW'
        })[0]
        this.withdraw = {
          ...summaryWithdraw,
          currency: this.tabActive
        }
        const summaryTransfer = result.summary.filter(item => {
          return item.transactionType === 'TRANSFER'
        })[0]
        this.transfer = {
          ...summaryTransfer,
          currency: this.tabActive
        }
        this.query.total = result.transactions.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleChangeType(Type: any): void {
      this.resetQuery()
      this.query.currency = this.tabActive
      this.query.page = 1
      this.query.limit = 10
      this.query.orderBy = 1
      this.query.transactionType = Type.value
      this.init()
      this.typeActive = Type
      this.isChanged = false
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.typeActive = {
        typeId: 1,
        title: this.$i18n.t('fee.withdraw'),
        value: this.$i18n.t('fee.withdraw-value')
      }
      this.resetQuery()
      this.$router.push({ name: tab.routeName })
      this.tabActive = tab.title
      this.query.currency = tab.title
      this.query.page = 1
      this.query.limit = 10
      this.query.orderBy = 1
      this.query.transactionType = this.typeActive.value
      this.init()
      this.isChanged = false
    }

    resetQuery(): void {
      this.query = {
        ...this.query,
        page: 1,
        limit: 10,
        orderBy: '1',
        keywordString: this.filters.search,
        currency: null,
        // status: 'SUCCESS',
        fromDate: this.filters.fromDate,
        toDate: this.filters.toDate,
        fromAmount: this.filters.fromAmount,
        toAmount: this.filters.toAmount,
        fromTransactionFee: this.filters.fromFee,
        toTransactionFee: this.filters.toFee,
        bonusType: null
      }
    }
    handlePageChange(page: number): void {
      this.query.page = page
      this.init()
    }

    handleSizeChange(limit: number): void {
      this.query.limit = limit
      this.init()
    }

    handleRowClick(row: Record<string, any>): void {
      this.detailRow = row
      this.setOpenPopup({
        popupName: 'popup-fee-detail',
        isOpen: true
      })
    }

    handleFilter(filter: Record<string, any>): void {
      this.filters = filter
      this.query = {
        ...this.query,
        keywordString: this.filters.search,
        currency: '',
        transactionType: this.typeActive.value,
        fromDate: this.filters.fromDate,
        toDate: this.filters.toDate,
        fromAmount: this.filters.fromAmount,
        toAmount: this.filters.toAmount,
        fromTransactionFee: this.filters.fromFee,
        toTransactionFee: this.filters.toFee,
        status: this.filters.status,
        orderBy: this.filters.orderBy,
        page: 1,
        limit: 10
      }

      this.debounceInit()
    }

    debounceInit = debounce(() => {
      this.init()
    }, 300)
    handleNormalize(): void {
      this.isChanged = false
    }
  }
</script>

<style scoped lang="scss">
  .currency {
    width: auto;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }
  .container {
    text-align: justify;
    -ms-text-justify: distribute-all-lines;
    text-justify: distribute-all-lines;
    width: 100%;
  }
  .filter {
    &-header {
      height: 57px;
      border-bottom: 1px solid var(--bc-border-primary);
      display: flex;
    }
    &-type {
      width: auto;
      display: inline;
      padding: calc(28.5px - 8px) 12px;
      font-size: 16px;
      line-height: 16px;
      &:hover {
        color: var(--bc-tab-active);
      }
      &.tab-active {
        font-weight: 600;
        color: var(--bc-tab-active);
        border-bottom: 3px solid var(--bc-tab-active);
      }
    }
  }
  .bo-kyc .wallet-header__above-tabs .tab-item {
    color: var(--bc-text-discript);
  }

  ::v-deep .container > div {
    width: 100px;
    height: 100px;
    vertical-align: top;
    display: inline-block;
    *display: inline;
    zoom: 1;
    background: #efefef;
    margin-right: -2px !important;
  }

  .sack-banlance {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    //padding: 0 18px;
  }

  .col-width {
    width: 20% !important;
    height: auto !important;
    border-radius: 8px !important;
    border: 1px solid #dbdbdb !important;
    box-sizing: border-box !important;
    padding: 16px !important;
    display: flex !important;
    flex-direction: column;
    justify-content: space-between;
  }

  .tabActive {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }

  .text1 {
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    color: var(--bc-text-discript);
  }

  .number2 {
    width: 100%;
    margin: 8px 0;
    font-weight: 600;
    font-size: 24px;
    line-height: 24px;
    color: #0a0b0d;
    word-break: break-all;
  }

  .text3 {
    font-size: 14px;
    line-height: 19.2px;
    font-weight: 400;
    color: var(--bc-text-discript);
  }

  .col-margin {
    background: #fff !important;
    flex-basis: calc((100% - 24px - 48px) / 4) !important;
  }

  .container > div {
    width: 100px;
    height: 100px;
    vertical-align: top;
    display: inline-block;
    *display: inline;
    zoom: 1;
    background: red;
  }

  span {
    width: 100%;
    display: inline-block;
    font-size: 16px;
    line-height: 24px;
  }

  .bo-kyc {
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;

    .wallet-header {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);

        &-tabs {
          .tab-item {
            padding: 16px 12px;
            position: relative;

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
      }

      &__below {
        padding: 24px;

        &-amount {
          .amount-wallet,
          .amount-lock {
            flex: 1;

            .title {
              margin-left: 16px;

              .title-coin {
                color: #201f1e;
              }
            }

            .amount {
              margin-top: 10px;

              .amount-btc {
                color: var(--bc-amount-btc);
              }

              .amount-lyn {
                color: var(--bc-amount-lin);
              }

              .amount-lock {
                color: var(--bc-amount-lock);
              }
            }
          }

          .amount-wallet {
            border-right: 1px solid var(--bc-border-primary);
          }
        }
      }
    }
  }

  .wallet-header-task {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 24px;
    padding: 24px;
    background-color: var(--bc-color-white);
    margin-bottom: 24px;
    border-radius: 4px;
    .col-width {
      width: 100% !important;
    }
  }
  .hub-active {
    justify-content: flex-start;
    margin-right: 0;
    width: 100%;
    & > div {
      margin-right: 56px;
      margin-left: 25px;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .box-shadow {
    box-shadow: 0px 0.3px 0.9px rgb(0 0 0 / 10%), 0px 1.6px 3.6px rgb(0 0 0 / 13%);
  }
</style>
