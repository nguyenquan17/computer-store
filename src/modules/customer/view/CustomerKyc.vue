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
    <customer-filter @filter="handleFilter" :is-change-tab="isChangeTab" />
    <customer-table @copy="handleCopy" v-loading="isLoading" @rowClick="handleRowClick" @sizeChange="handleSizeChange" @pageChange="handlePageChange" :query="query" :data="data" />
    <customer-detail :detailRow="detailRow" @init="init" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  //@ts-ignore
  import CustomerTable from '../components/CustomerTable.vue'
  import CustomerFilter from '../components/filter/CustomerFilter.vue'
  import CustomerDetail from '../components/popup/CustomerDetail.vue'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { CustomerRepository } from '@/services/repositories/customer'
  import EventBus from '@/utils/eventBus'
  import { debounce } from 'lodash'
  import { MODULE_WITH_ROUTENAME } from '@/configs/role'

  import { namespace } from 'vuex-class'
  import { SettingRepository } from '@/services/repositories/setting'
  const bcKyc = namespace('bcKyc')
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')

  const apiCustomer: CustomerRepository = getRepository('customer')
  interface IQuery {
    page?: number
    limit?: number
    search?: string
    orderBy: string | number
    total: number
    type?: string | null | undefined
  }

  @Component({ components: { CustomerTable, CustomerFilter, CustomerDetail } })
  export default class BOCustomer extends Mixins(PopupMixin) {
    @bcKyc.Action('getListReason') getListReason!: () => void
    @bcAuth.Getter('listModuleCanView') listModuleCanView!: Array<Record<string, any>>
    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'customer-all',
        routeName: 'CustomerAll'
      },
      {
        id: 2,
        title: 'customer-verified',
        routeName: 'CustomerVerified'
      }
      // {
      //   id: 3,
      //   title: 'customer-processing',
      //   routeName: 'CustomerProcessing'
      // },
      // {
      //   id: 4,
      //   title: 'customer-not-verified',
      //   routeName: 'CustomerNotVerified'
      // },
      // {
      //   id: 5,
      //   title: 'customer-locked',
      //   routeName: 'CustomerLocked'
      // }
    ]
    titlePending = ''
    tabActive = 'Pending'
    isLoading = false
    isChangeTab = false

    data: Array<Record<string, any>> = []

    detailRow = {}

    query: IQuery = {
      orderBy: 1,
      page: 1,
      limit: 10,
      total: 10,
      type: null
    }

    objType: Record<string, any> = {
      CustomerAll: null,
      CustomerVerified: 'VERIFIED',
      CustomerProcessing: 'KYC',
      CustomerNotVerified: 'NOT_VERIFIED',
      CustomerLocked: 'LOCKED'
    }

    isCopy = ''
    isConflickClick = false

    created(): void {
      const name = this.$route.name!
      this.query.type = this.objType[name]
    }

    async init(): Promise<void> {
      try {
        this.isLoading = true
        if (!this.query.type) {
          const routeName = this.$route.name!
          this.query.type = this.objType[routeName]
        }
        const result = await apiCustomer.getListCustomer({ ...this.query, total: null })
        this.data = result.content || []
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.isChangeTab = tab.id !== 1
      this.$router.push({ name: tab.routeName }).then(() => {
        this.resetQuery()
        EventBus.$emit('changeTabCustomer')
      })
    }

    resetQuery(): void {
      this.query = {
        ...this.query,
        page: 1,
        limit: 10,
        search: '',
        orderBy: 'CREATED_AT'
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
      if (this.isConflickClick) {
        this.isConflickClick = false
        return
      }
      if (this.checkPemission('customer', ['view-detail-customer'])) {
        this.detailRow = row
        this.setOpenPopup({
          popupName: 'popup-customer-detail',
          isOpen: true
        })
      }
    }

    // async handleRowClick(row: Record<string, any>): Promise<void> {
    //   if (this.checkPemission('customer', ['view-detail-customer'])) {
    //     if (this.isCopy !== 'copy') {
    //       if (this.tabActive !== 'DAILY_PROFIT') {
    //         this.detailRow = await api.getDetailTransactionNft({ activityId: row.id })
    //       } else {
    //         const index = findIndex(this.propDataTable, elm => elm.id === row.id)
    //         this.detailRow = this.propDataTable[index]
    //       }

    //       this.setOpenPopup({
    //         popupName: 'popup-transaction-nft-detail',
    //         isOpen: true
    //       })
    //     } else {
    //       this.isCopy = ''
    //     }
    //   }
    // }

    handleCopy(data: any): void {
      this.isConflickClick = true
      this.isCopy = data
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
            // .text-base {
            //   color: #5b616e;
            // }
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
</style>
