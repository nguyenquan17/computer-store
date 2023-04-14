<template>
  <div class="w-100 bo-kyc">
    <div class="bg-white wallet-header">
      <div class="be-flex align-center jc-space-between wallet-header__above">
        <div class="wallet-header__above-tabs be-flex">
          <div class="tab-item cursor" v-for="tab in tabs" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
            <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- <balance-filter @filterBalance="handleFilter" :listApproveBy="listApproveBy" /> -->
    <exception-filter @filterException="handleFilter" />
    <div class="ending-balance be-flex jc-space-between" style="justify-content: end">
      <p style="width: 160px; text-align: center">{{ $t('exception.total') }}</p>
      <p style="width: 210px; text-align: right">${{ totalAmount }}</p>
    </div>
    <exception-table
      v-loading="isLoading"
      @coppy="handleCoppy"
      @rowClick="handleRowClick"
      @sizeChange="handleSizeChange"
      @pageChange="handlePageChange"
      :query="query"
      :data="propdataTable"
    />
    <exception-detail :detail-row="detailRow" :tab-active-filter="tabActive"></exception-detail>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  //@ts-ignore
  import ExceptionTable from '../components/ExceptionTable.vue'
  import ExceptionFilter from '../components/filter/ExceptionFilter.vue'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { ExceptionRepository } from '@/services/repositories/exception'
  import { debounce } from 'lodash'
  import EventBus from '@/utils/eventBus'
  import ExceptionDetail from '../components/exceptionDetail/ExceptionDetail.vue'
  const api: ExceptionRepository = getRepository('exception')

  import { namespace } from 'vuex-class'

  const beBase = namespace('beBase')

  @Component({ components: { ExceptionTable, ExceptionDetail, ExceptionFilter } })
  export default class Exception extends Mixins(PopupMixin) {
    tabs: Array<Record<string, any>> = [
      // {
      //   id: 1,
      //   title: 'deposit',
      //   routeName: 'ExceptionDeposit'
      // },
      {
        id: 2,
        title: 'withdraw',
        routeName: 'ExceptionWithdraw'
      },
      {
        id: 3,
        title: 'crowdsales',
        routeName: 'ExceptionCrowdsale'
      }
    ]
    titlePending = ''
    tabActive = 'withdraw'
    isLoading = false

    data: Array<Record<string, any>> = []

    detailRow: any = {}
    dataDetail = {}
    query: any = {
      search: '',
      orderBy: 1,
      page: 1,
      limit: 10,
      total: 10
    }
    proptabActive = ''
    totalAmount = ''
    listApproveBy: Record<string, any>[] = []

    created(): void {
      this.$router.push({ name: 'ExceptionWithdraw' })
      this.init()
    }
    propdataTable: Record<string, any>[] = []

    async init(): Promise<void> {
      this.data = []
      this.propdataTable = []
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          search: this.query.search,
          orderBy: this.query.orderBy,
          limit: this.query.limit,
          page: this.query.page,
          total: null
        }
        const result = await api.getListException(this.tabActive, params)
        if (this.$route.name === 'ExceptionWithdraw') {
          this.totalAmount = result.totalAmount
          this.data = result.withdrawPage.content || []
          this.propdataTable = result.withdrawPage.content || []
          this.query.total = result.withdrawPage.totalElements
        } else if (this.$route.name === 'ExceptionCrowdsale') {
          this.totalAmount = result.totalTokenAmount
          this.data = result.crowdsales.content || []
          this.propdataTable = result.crowdsales.content || []
          this.query.total = result.crowdsales.totalElements
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.$router.push({ name: tab.routeName })
      // this.query.tabBalance = this.kycStatus[tab.title]
      this.tabActive = tab.title
      this.query.page = 1
      this.query.limit = 10
      this.query.orderBy = 1
      ;(this.query.search = ''),
        (this.query.currency = ''),
        (this.query.fromDate = ''),
        (this.query.toDate = ''),
        (this.query.fromAmount = ''),
        (this.query.toAmount = ''),
        (this.query.status = ''),
        (this.query.orderBy = '1')

      this.init()
      this.resetQuery()
      EventBus.$emit('changeTabException', this.$route.name)
    }

    resetQuery(): void {
      this.query = {
        ...this.query,
        page: 1,
        limit: 10,
        search: '',
        orderBy: '1'
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
    checkCoppy = ''
    handleCoppy(value: string | number): void {
      console.log('value', value)
      this.checkCoppy = value.toString()
    }
    handleRowClick(row: Record<string, any>): void {
      this.detailRow = row.row
      if (this.checkCoppy == '1') {
        this.setOpenPopup({
          popupName: 'popup-exception-detail',
          isOpen: false
        })
      } else {
        this.setOpenPopup({
          popupName: 'popup-exception-detail',
          isOpen: true
        })
      }
      EventBus.$emit('checkRowClick')
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = {
        ...this.query,
        ...filter,
        page: 1,
        limit: 10
      }
      this.debounceInit()
    }
    debounceInit = debounce(() => {
      this.init()
    }, 300)
  }
</script>

<style scoped lang="scss">
  .ending-balance {
    margin: 8px 24px 0 24px;
    border-radius: 4px;
    background-color: #0151fc;
    padding: 12px 10px;
    p {
      font-size: 16px;
      color: #ffffff;
      font-weight: 600;
    }
    p:last-of-type {
      // margin-right: 144px;
    }
  }
  .container {
    text-align: justify;
    -ms-text-justify: distribute-all-lines;
    text-justify: distribute-all-lines;
    width: 100%;
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
    padding: 0 18px;
  }
  .col-width {
    width: 20% !important;
    height: 112px !important;
    border-radius: 8px !important;
    border: 1px solid #dbdbdb !important;
    box-sizing: border-box !important;
  }
  .tabActive {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }
  .text1 {
    // margin-top: 16px;
    // margin-left: 18px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: var(--bc-text-discript);
  }
  .number2 {
    margin-top: 8px;
    margin-left: 18px;
    font-weight: 600;
    font-size: 24px;
    line-height: 24px;
    color: #0a0b0d;
  }
  .text3 {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    margin-top: 6px;
    margin-left: 18px;
    margin-bottom: 16px;
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
    display: flex;
    justify-content: space-between;
    padding: 24px;
  }
</style>
