<template>
  <div class="w-100 transaction">
    <div class="bg-white box-shadow" style="margin-bottom: 24px">
      <div class="bg-white wallet-header">
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
      </div>

      <div class="container wallet-header be-flex" style="padding: 24px 24px">
        <card-lvt :currencyActive="currencyActive" :summary="summary" />
      </div>
    </div>
    <div class="w-100 bo-kyc box-shadow">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div class="tab-item cursor" v-for="tab in tabs" :key="tab.id" :class="$route.params.type === tab.title ? 'tab-active' : null" @click="handleChangeTab(tab)">
              <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div>
      <filter-staking ref="filter" @filter="handleFilter" />
      <div class="table-transaction">
        <table-staking-lvt
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
    <popup-detail-staking-tx :row="detailRow" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  //@ts-ignore

  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { debounce, filter } from 'lodash'

  import CardLvt from '../components/card/CardLVT.vue'
  import TableStakingLvt from '../components/table/TableStakingLvt.vue'
  import FilterStaking from '../components/filter/FilterStaking.vue'
  import PopupDetailStakingTx from '../components/popup/PopupDetailStakingTx.vue'

  import { namespace } from 'vuex-class'
  import StakingRepository from '@/services/repositories/staking'
  import { IQueryStakingLvt } from '@/interface'
  import { ParamsRepository } from '@/services/repositories/params'
  const bcAuth = namespace('beAuth')
  const beStaking = namespace('beStaking')

  const apiStaking: StakingRepository = getRepository('staking')
  const apiParams: ParamsRepository = getRepository('params')

  @Component({
    components: {
      TableStakingLvt,
      FilterStaking,
      PopupDetailStakingTx,
      CardLvt
    }
  })
  export default class StakingLVT extends Mixins(PopupMixin) {
    @bcAuth.State('user') user!: Record<string, any>
    @beStaking.Mutation('SET_LIST_TYPE_STAKING') setListTypeStaking!: (list: Array<Record<string, any>>) => void

    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'stake',
        value: 'STAKE'
      },
      {
        id: 5,
        title: 'unstake',
        value: 'UNSTAKE'
      },
      {
        id: 2,
        title: 'endstake',
        value: 'END_STAKE'
      }
    ]

    tabsHeader: Array<Record<string, any>> = [
      {
        id: 2,
        title: 'BTC',
        routeName: 'StakingLVT'
      },
      {
        id: 3,
        title: 'ETH',
        routeName: 'StakingLVT'
      },
      {
        id: 4,
        title: 'BNB',
        routeName: 'StakingLVT'
      },
      {
        id: 5,
        title: 'USDT',
        routeName: 'StakingLVT'
      },
      {
        id: 6,
        title: 'USDC',
        routeName: 'StakingLVT'
      },
      {
        id: 7,
        title: 'BUSD',
        routeName: 'StakingLVT'
      }
    ]
    summary: Record<string, any> = {}

    currencyActive = ''
    tabActive = 'STAKE'
    isLoading = false

    detailRow = {}
    query: IQueryStakingLvt = {
      search: '',
      currency: '',
      transactionType: '',
      planId: '',
      durationType: '',
      fromDuration: '',
      toDuration: '',
      fromAPRPercent: '',
      toAPRPercent: '',
      interestType: '',
      fromTransactionDate: '',
      toTransactionDate: '',
      fromEndStakeDate: '',
      toEndStakeDate: '',
      orderBy: 'DATE_DESC',
      page: 1,
      limit: 20,
      total: 0
    }

    data: Record<string, any>[] = []

    get getTabsHeader(): Array<Record<string, any>> {
      return [
        {
          id: 1,
          title: 'LYNK',
          routeName: 'StakingLVT'
        },
        ...this.tabsHeader
      ]
    }

    async created(): Promise<void> {
      this.currencyActive = this.$route.params.token
      const type = this.$route.params.type
      const tab = filter(this.tabs, elm => elm.title === type)
      console.log(tab)

      this.tabActive = tab.length ? tab[0].value : 'STAKE'
      this.query.currency = this.currencyActive
      this.query.transactionType = this.tabActive
      this.getTypeStaking()
      this.init()
    }

    async init(): Promise<void> {
      try {
        const result = await apiStaking.getListStakingLvt(this.query)
        console.log(result)
        this.data = result.transactions?.content || []
        this.query.total = result.transactions.totalElements || 0
        this.summary = result.summary
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    async getTypeStaking(): Promise<void> {
      const promiseAll = [apiParams.getTypeStaking({ type: 'INTEREST_TYPE' }), apiParams.getTypeStaking({ type: 'DURATION_TYPE' })]
      const result = await Promise.all(promiseAll)
      this.setListTypeStaking(result)
    }

    handleChangeTabsHeader(tab: Record<string, any>): void {
      if (tab.title === this.currencyActive) return

      this.resetQuery()
      this.$router.push({ params: { token: tab.title, type: this.$route.params.type } })
      this.currencyActive = tab.title
      this.query.currency = tab.title.toUpperCase()
      this.query.transactionType = this.tabActive
      //@ts-ignore
      this.$refs['filter']?.handleReset()
      this.init()
    }

    handleChangeTab(tab: Record<string, any>): void {
      if (tab.value === this.tabActive) return

      this.resetQuery()
      this.$router.push({ params: { token: this.$route.params.token, type: tab.title } })

      this.tabActive = tab.value
      this.query.transactionType = tab.value
      this.query.currency = this.currencyActive
      //@ts-ignore
      this.$refs['filter']?.handleReset()

      this.init()
    }

    resetQuery(): void {
      this.query = {
        search: '',
        currency: '',
        transactionType: '',
        planId: '',
        durationType: '',
        fromDuration: '',
        toDuration: '',
        fromAPRPercent: '',
        toAPRPercent: '',
        interestType: '',
        fromTransactionDate: '',
        toTransactionDate: '',
        fromEndStakeDate: '',
        toEndStakeDate: '',
        orderBy: 'DATE_DESC',
        page: 1,
        limit: 20,
        total: 0
      }
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
      this.setOpenPopup({
        popupName: 'popup-detail-staking-tx',
        isOpen: true
      })
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = {
        ...this.query,
        ...filter,
        page: 1
      }
      this.init()
    }

    handleClickButton(popupName: string): void {
      this.setOpenPopup({
        popupName,
        isOpen: true
      })
    }
  }
</script>

<style scoped lang="scss">
  .container {
    text-align: justify;
    -ms-text-justify: distribute-all-lines;
    text-justify: distribute-all-lines;
    width: 100%;
    // justify-content: space-between;
  }

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
