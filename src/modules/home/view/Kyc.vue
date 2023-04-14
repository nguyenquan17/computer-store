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
    <kyc-filter @filter="handleFilter" :listApproveBy="listApproveBy" />
    <kyc-table v-loading="isLoading" @rowClick="handleRowClick" @sizeChange="handleSizeChange" @pageChange="handlePageChange" :query="query" :data="data" />
    <kyc-detail :detailRow="detailRow" @init="init" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  //@ts-ignore
  import KycTable from '../components/KycTable.vue'
  import KycFilter from '../components/filter/KycFilter.vue'
  import KycDetail from '../components/popup/KycDetail.vue'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { KycRepository } from '@/services/repositories/kyc'
  import EventBus from '@/utils/eventBus'
  import { debounce } from 'lodash'
  import { MODULE_WITH_ROUTENAME } from '@/configs/role'

  import { namespace } from 'vuex-class'
  const bcKyc = namespace('bcKyc')
  const bcAuth = namespace('beAuth')

  const apiKyc: KycRepository = getRepository('kyc')

  interface IQuery {
    page?: number
    limit?: number
    search?: string
    status: string
    kycStatus: string
    orderBy: string
    total: number
  }

  @Component({ components: { KycTable, KycFilter, KycDetail } })
  export default class BOKyc extends Mixins(PopupMixin) {
    @bcKyc.Action('getListReason') getListReason!: () => void
    @bcAuth.Getter('listModuleCanView') listModuleCanView!: Array<Record<string, any>>

    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'Pending',
        routeName: 'KycPending'
      },
      {
        id: 2,
        title: 'Verified',
        routeName: 'KycVerified'
      },
      {
        id: 3,
        title: 'Rejected',
        routeName: 'KycRejected'
      }
    ]
    titlePending = ''
    tabActive = 'Pending'
    isLoading = false

    data: Array<Record<string, any>> = []

    detailRow = {}

    kycStatus = {
      Pending: 'PENDING',
      Verified: 'VERIFIED',
      Rejected: 'REJECTED'
    }

    query: IQuery = {
      status: 'ACTIVE',
      kycStatus: 'PENDING',
      orderBy: 'CREATED_AT',
      page: 1,
      limit: 10,
      total: 10
    }
    listApproveBy: Record<string, any>[] = []

    created(): void {
      if (!this.checkPemission('kyc', ['view'])) {
        const routeName = MODULE_WITH_ROUTENAME[this.listModuleCanView[0].module]
        this.$router.push({ name: routeName })
        return
      }

      this.getListReason()
      apiKyc.getListApprove({ page: 1, limit: 20 }).then(res => {
        this.listApproveBy = res.content || []
      })
      const name = this.$route.name
      this.query.kycStatus = name === 'KycPending' ? 'PENDING' : name === 'KycVerified' ? 'VERIFIED' : 'REJECTED'
    }

    async init(): Promise<void> {
      try {
        this.isLoading = true
        const name = this.$route.name!
        const result = await apiKyc.getListKyc({ ...this.query, total: null }, name)
        this.data = result.content || []
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleChangeTab(tab: Record<string, any>): void {
      // this.data = []
      this.$router.push({ name: tab.routeName }).then(() => {
        this.query.kycStatus = this.kycStatus[tab.title]
        this.resetQuery()
        EventBus.$emit('changeTabKyc')
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
      this.detailRow = row
      this.setOpenPopup({
        popupName: 'popup-kyc-detail',
        isOpen: true
      })
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = {
        ...this.query,
        ...filter,
        page: 1
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
