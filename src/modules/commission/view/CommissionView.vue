<template>
  <div class="w-100 transaction">
    <div class="bg-white box-shadow" style="margin-bottom: 24px">
      <!-- <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div
              class="tab-item cursor"
              v-for="tab in getTabsHeader"
              :key="tab.id"
              :class="$route.params.token === tab.title ? 'tab-active' : null"
              @click="handleChangeTabsHeader(tab)"
            >
              <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div> -->

      <div class="container wallet-header be-flex" style="padding: 24px 24px">
        <card-commission :summary="summary" />
      </div>
    </div>
    <div class="w-100 bo-kyc box-shadow">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div class="tab-item cursor" v-for="tab in tabs" :key="tab.id" :class="tabActive === tab.value ? 'tab-active' : null" @click="handleChangeTab(tab)">
              <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div>
      <filter-commission ref="filter" @filter="handleFilter" />
      <div class="table-transaction">
        <table-commission
          v-loading="isLoading"
          :data="data"
          :query="query"
          :tabActive="tabActive"
          @sizeChange="handleSizeChange"
          @pageChange="handlePageChange"
          @rowClick="handleRowClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'

  import CardCommission from '../components/card/CardCommission.vue'
  import FilterCommission from '../components/filter/FilterCommission.vue'
  import TableCommission from '../components/table/TableCommission.vue'

  const beAuth = namespace('beAuth')

  import getRepository from '@/services'
  import CommissionRepository from '@/services/repositories/commission'
  const apiCommission: CommissionRepository = getRepository('commission')

  interface ITableData {
    salesName: string
    salesRefCode: string
    date: string
    itemCode: string
    itemName: string
    amount: number
    quantity: number
    usdtCommission: 15
    itemAvatar: string
    lynkCommission: number
  }

  @Component({ components: { CardCommission, FilterCommission, TableCommission } })
  export default class CommissionView extends Mixins(PopupMixin) {
    @beAuth.State('role') role!: Record<string, any>
    @beAuth.State('user') user!: Record<string, any>

    summary: Record<string, any> = {
      totalSaleUsd: 0,
      commissionUsdt: 0,
      commissionUsdtToUsd: 0,
      commissionLynk: 0,
      commissionLynkToUsd: 0
    }

    tabActive = 'transactions'
    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'Transactions',
        value: 'transactions'
      }
    ]

    isLoading = false
    data: Array<ITableData> = []
    query: Record<string, any> = {
      search: '',
      orderBy: 'DATE_DESC',
      page: 1,
      limit: 20,
      total: 0
    }
    detailRow: Record<string, any> = {}

    async init(): Promise<void> {
      try {
        this.isLoading = true
        const result = await apiCommission.getListCommission(this.query)
        console.log('>>> / file: CommissionView.vue:135 / result', result)
        this.data = result.pageItem?.content || []
        this.query.total = result.pageItem.totalElements || 0
        this.summary = {
          totalSaleUsd: result.total.totalUSD,
          commissionUsdt: result.total.totalUSDT,
          commissionUsdtToUsd: result.total.totalUSDTUSD,
          commissionLynk: result.total.totalLYNK,
          commissionLynkToUsd: result.total.totalLYNKUSD
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleFilter(filters: Record<string, any>): void {
      this.query = {
        ...this.query,
        ...filters,
        page: 1
      }
      this.init()
    }

    handleChangeTab(tab: Record<string, any>): void {
      if (tab.value === this.tabActive) return
    }

    handlePageChange(page: number): void {
      this.query.page = page
      this.init()
    }

    handleSizeChange(limit: number): void {
      this.query.limit = limit
      this.query.page = 1
      this.init()
    }
    handleRowClick(row: Record<string, any>): void {
      this.detailRow = row
      // this.setOpenPopup({
      //   popupName: 'popup-detail-staking-tx',
      //   isOpen: true
      // })
    }

    // lifecycle-fnc
    created(): void {
      //
      const tab = this.$route.params.tab
      this.tabActive = tab ? tab : 'TRANSACTIONS'
      if (this.role.userRole.length === 1 && this.role.userRole[0] === 'MARKETING') {
        this.query.salesMember = this.user.userId
      }
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .transaction {
    .table-transaction {
      padding: 0 24px;
      background-color: #ffffff;
    }

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
            color: var(--bc-tab-active) !important;
            font-weight: 600 !important;

            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 2px;
              bottom: -1px;
              left: 0;
              background-color: var(--bc-tab-active);
            }
          }

          .tab-item {
            font-family: Open Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            color: #5b616e;
          }
        }
      }
    }
    .flex-start {
      justify-content: flex-start !important;
      .items-card {
        margin-right: 48px;
      }
    }
  }
</style>
