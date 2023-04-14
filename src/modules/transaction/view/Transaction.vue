<template>
  <div class="w-100 transaction">
    <div class="bg-white box-shadow" style="margin-bottom: 24px">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div
              class="tab-item cursor"
              v-for="(tab, index) in getTabBaseToken"
              :key="index"
              :class="$route.params.token === tab.currency ? 'tab-active' : null"
              @click="handleChangeTabsHeader(tab)"
            >
              <span class="text-base">{{ tab.currency }}</span>
            </div>
            <more-token @select="handleChangeTabsHeader" />
          </div>
          <div class="be-flex">
            <div class="btn-crousel cursor prev" @click="handleClickArrow('prev')">
              <base-icon icon="icon-prev" size="32" class="d-iflex" />
              <!-- <base-icon v-else icon="icon-prev-clm" size="32" class="d-iflex" /> -->
            </div>
            <div class="btn-crousel cursor next" @click="handleClickArrow('next')">
              <base-icon icon="icon-next" size="32" class="d-iflex" />
              <!-- <base-icon v-else icon="icon-next-clm" size="32" class="d-iflex" /> -->
            </div>
          </div>
        </div>
      </div>
      <!-- style="width: calc(100% - 48px); -->
      <!-- :class="dataHeaderCard.length < 5 ? 'flex-start' : ''" -->
      <div class="container wallet-header be-flex" style="padding: 24px 24px">
        <div class="be-flex wrap" ref="wrap-card">
          <div v-for="(value, i) in dataHeaderCard" :key="i" class="items-card">
            <div class="item be-flex top">
              <span class="text1">
                {{ renderTitleCard(value.transactionType) }}
              </span>
              <div>
                <base-icon :icon="renderIconCard(value.transactionType)" size="24" />
              </div>
            </div>
            <div class="item">
              <p class="number2">
                {{ value.totalAmount | convertAmountDecimal(tabHeaderActive) }}
                <!-- <a class="tabActiveHeader">{{ tabHeaderActive }}</a> -->
              </p>
            </div>
            <div class="item-bottom">
              <span class="text3">~${{ value.totalAmountUsd | convertAmountDecimal('USD') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 bo-kyc box-shadow">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div class="tab-item cursor" v-for="tab in getTabs" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
              <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div>
      <filter-transaction
        @filter="handleFilter"
        :type="'transaction'"
        :showBtn="getShowBtn"
        :showBtnCrowdsale="showBtnCrowdsale"
        :showBtnTransfer="showBtnTransfer"
        ref="filter"
        @clickButton="handleClickButton"
      />
      <div class="table-transaction">
        <table-transaction
          v-loading="isLoading"
          :listTransaction="propDataTable"
          :query="query"
          :tabActive="tabActive"
          @sizeChange="handleSizeChange"
          @pageChange="handlePageChange"
          :type="'transaction'"
          @rowClick="handleRowClick"
          @copy="handleCopy"
        />
      </div>
      <popup-filter-transaction @filter="handleFilter" :currency="tabHeaderActive" :tab-active-filter="tabActive.toLowerCase()" :type="'transaction'" ref="popup-filter" />
      <transaction-detail :detail-row="detailRow" :tab-active-filter="tabActive" />
      <popup-add-deposit @reload="init" @confirm="handleConfirm" :currency="tabHeaderActive" />
      <!-- <popup-add-crowdsale-lynkey @confirm="handleConfirm" :currency="tabHeaderActive" /> -->
      <popup-add-crowdsale-hub @confirm="handleConfirm" :currency="'BUSD'" />
      <popup-add-transfer @confirm="handleConfirm" />
      <popup-verify :type="type2Fa" :data="formData" @reload="init" :transactionType="query.transactionType" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  //@ts-ignore

  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { debounce, filter, includes } from 'lodash'
  import { TransactionRepository } from '@/services/repositories/transaction'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'

  import TableTransaction from '@/components/table/TableTransaction.vue'
  import FilterTransaction from '@/components/filter/FilterTransaction.vue'
  import PopupFilterTransaction from '@/components/popup/PopupFilterTransaction.vue'
  import TransactionDetail from '@/modules/transaction/components/transactionDetail/TransactionDetail.vue'
  import PopupAddDeposit from '../components/PopupAddDeposit.vue'
  import PopupAddCrowdsaleHub from '../components/PopupAddCrowdsaleHub.vue'
  import PopupAddCrowdsaleLynkey from '../components/PopupAddCrowdsaleLynkey.vue'
  import PopupAddTransfer from '../components/PopupAddTransfer.vue'
  import MoreToken from '@/components/MoreToken.vue'
  import PopupVerify from '@/components/popup/PopupVerify.vue'
  const api: TransactionRepository = getRepository('transaction')
  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')

  import { namespace } from 'vuex-class'
  import { IAssetToken } from '@/interface'
  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  interface IDataCard {
    numOfTransaction: number | any
    totalAmount: number | any
    transactionType: string | any
    totalAmountUsd: number | any
  }

  @Component({
    components: {
      PopupFilterTransaction,
      TableTransaction,
      FilterTransaction,
      TransactionDetail,
      PopupAddDeposit,
      PopupAddCrowdsaleHub,
      PopupAddCrowdsaleLynkey,
      PopupVerify,
      PopupAddTransfer,
      MoreToken
    }
  })
  export default class Transaction extends Mixins(PopupMixin) {
    @bcAuth.State('user') user!: Record<string, any>
    @beBase.State('listAssetToken') listAssetToken!: IAssetToken[]
    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'deposit',
        routeName: 'TransactionDeposit'
      },
      {
        id: 5,
        title: 'crowdsale',
        routeName: 'TransactionCrowdsale'
      },
      {
        id: 2,
        title: 'withdraw',
        routeName: 'TransactionWithdraw'
      },
      {
        id: 3,
        title: 'transfer',
        routeName: 'TransactionTransfer'
      },
      {
        id: 4,
        title: 'bonus',
        routeName: 'TransactionBonus'
      },
      {
        id: 6,
        title: 'swap',
        routeName: 'TransactionSwap'
      }
    ]

    tabsHeader: Array<Record<string, any>> = [
      {
        currency: 'MAGIC'
      },
      {
        currency: 'ETH'
      },
      {
        currency: 'BNB'
      },
      {
        currency: 'USDT'
      },
      {
        currency: 'BUSD'
      }
    ]

    tabHeaderActive = ''
    tabActive = ''
    isLoading = false

    dataHeaderCard: IDataCard[] = []

    detailRow = {}
    query: any = {
      // userId: null,
      // keywordString: '',
      currency: '',
      transactionType: '',
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      orderBy: '1',
      page: 1,
      limit: 10,
      total: 10
    }
    listApproveBy: Record<string, any>[] = []
    type2Fa = ''
    formData: Record<string, any> = {}

    get getTabs(): Array<Record<string, any>> {
      return this.tabs.filter(tab => tab.title !== 'crowdsale')
    }

    get getTabBaseToken(): Array<Record<string, any>> {
      return this.tabsHeader
    }
    get getTabTokenMore(): IAssetToken[] {
      return filter(this.listAssetToken, token => !includes(['MAGIC', 'ETH', 'BNB', 'USDT', 'BUSD'], token.currency))
    }

    get getShowBtn(): boolean {
      return this.$route.name === 'TransactionDeposit' && this.checkPemission('transaction', ['add-deposit'])
    }
    get showBtnCrowdsale(): boolean {
      return this.$route.name === 'TransactionCrowdsale' && this.checkPemission('transaction', ['add-crowdsale'])
    }
    get showBtnTransfer(): boolean {
      return this.$route.name === 'TransactionTransfer' && this.checkPemission('transaction', ['add-transfer'])
    }

    async created(): Promise<void> {
      this.query = { ...this.query, currency: this.coinMain }
      this.tabHeaderActive = this.$route.path.split('/')[2]
      await this.init()

      this.tabActive = this.$route.path.split('/')[3]

      const name = this.$route.name
      console.log(name)
      this.tabs.map((value, i) => {
        if (value.routeName === name) {
          this.query.transactionType = value.title.toUpperCase()
          this.tabActive = value.title
        }
      })
      await this.init()
    }

    propDataTable: Record<string, any>[] = []

    async init(): Promise<void> {
      console.log('tabactive', this.tabActive)
      console.log('tabHeaderActive', this.tabHeaderActive)
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          // userId: this.query.userId,
          transactionType: this.tabActive,
          orderBy: this.query.orderBy,
          limit: this.query.limit,
          page: this.query.page,
          currency: this.query.currency,
          fromDate: this.query.fromDate,
          toDate: this.query.toDate,
          fromAmount: this.query.fromAmount,
          toAmount: this.query.toAmount,
          total: null
        }
        const result = await api.getListTransaction('search', params)
        this.propDataTable = result.transactions.content

        const deposit = result.summary.filter(item => {
          return item.transactionType === 'DEPOSIT'
        })
        // const crowdsale = result.summary.filter(item => {
        //   return item.transactionType === 'CROWDSALE'
        // })
        const withdraw = result.summary.filter(item => {
          return item.transactionType === 'WITHDRAW'
        })
        const transfer = result.summary.filter(item => {
          return item.transactionType === 'TRANSFER'
        })
        const bonus = result.summary.filter(item => {
          return item.transactionType === 'BONUS'
        })
        const swap = result.summary.filter(item => {
          return item.transactionType === 'SWAP'
        })
        this.dataHeaderCard = [...deposit, ...withdraw, ...transfer, ...bonus, ...swap]

        this.query.total = result.transactions.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    renderTitleCard(type: 'BONUS' | 'DEPOSIT' | 'TRANSFER' | 'WITHDRAW' | 'SWAP'): string {
      switch (type) {
        case 'BONUS':
          return this.$i18n.t(`transaction.table.total-bonus`) as string
        case 'DEPOSIT':
          return this.$i18n.t(`transaction.table.total-deposit`) as string
        case 'TRANSFER':
          return this.$i18n.t(`transaction.table.total-transfer`) as string
        case 'WITHDRAW':
          return this.$i18n.t(`transaction.table.total-withdraw`) as string
        case 'SWAP':
          return this.$i18n.t(`transaction.table.total-swap`) as string
        default:
          return this.$i18n.t(`transaction.table.total-crowdsale`) as string
      }
    }

    renderIconCard(type: 'BONUS' | 'DEPOSIT' | 'TRANSFER' | 'WITHDRAW' | 'SWAP'): string {
      switch (type) {
        case 'BONUS':
          return 'icon-gift'
        case 'DEPOSIT':
          return 'icon-download'
        case 'TRANSFER':
          return 'icon-swap-2'
        case 'SWAP':
          return 'icon-swap-2'
        case 'WITHDRAW':
          return 'icon-upload'
        default:
          return 'icon-crowdsale'
      }
    }
    handleChangeTabsHeader(tab: Record<string, any>): void {
      this.resetQuery()
      this.$router.push({ params: { token: tab.currency } })
      // this.query.tabBalance = this.kycStatus[tab.title]
      this.tabHeaderActive = tab.currency
      this.query.page = 1
      this.query.limit = 10
      this.query.orderBy = 1
      this.query.currency = tab.currency
      let refs2: any = this.$refs['filter']
      if (refs2) {
        refs2.handleReset()
      }
      this.init()
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.resetQuery()
      this.$router.push({ name: tab.routeName })
      // this.query.tabBalance = this.kycStatus[tab.title]
      this.tabActive = tab.title
      this.query.page = 1
      this.query.limit = 10
      this.query.orderBy = 1
      this.query.transactionType = tab.title.toUpperCase()
      this.query.currency = this.tabHeaderActive
      let refs: any = this.$refs['popup-filter']
      if (refs) {
        refs.handleReset()
      }
      let refs2: any = this.$refs['filter']
      if (refs2) {
        refs2.handleReset()
      }

      this.init()

      // EventBus.$emit('selectTabBalance')
    }

    resetQuery(): void {
      this.query = {
        ...this.query,
        page: 1,
        limit: 10,
        search: null,
        orderBy: '1',
        keywordString: null,
        currency: null,
        status: null,
        fromDate: null,
        toDate: null,
        fromAmount: null,
        toAmount: null,
        bonusType: null,
        fromAddress: null,
        toAddress: null
      }
    }
    isCopy = ''

    handlePageChange(page: number): void {
      this.query.page = page
      this.init()
    }

    handleSizeChange(limit: number): void {
      this.query.limit = limit
      this.init()
    }

    handleCopy(data: any): void {
      this.isCopy = data
    }

    handleRowClick(row: Record<string, any>): void {
      if (this.isCopy !== 'copy') {
        this.detailRow = row
        this.setOpenPopup({
          popupName: 'popup-transaction-detail',
          isOpen: true
        })
      } else {
        this.isCopy = ''
      }
    }

    handleFilter(filter: Record<string, any>): void {
      let data = { ...filter }
      const _transactionType = this.query.transactionType
      const _currency = this.query.currency
      this.query = {
        ...this.query,
        ...filter,
        currency: _currency,
        transactionType: _transactionType,
        page: 1,
        limit: 10
      }
      console.log(this.query, filter, 'note')
      this.debounceInit()
    }

    debounceInit = debounce(() => {
      this.init()
    }, 300)

    handleClickButton(popupName: string): void {
      this.setOpenPopup({
        popupName,
        isOpen: true
      })
    }

    async handleConfirm(form: Record<string, any>): Promise<void> {
      console.log('>>> / file: Transaction.vue / line 469 / form', form)
      this.formData = form
      if (this.query.transactionType === 'CROWDSALE') {
        let apiSendcode: any
        let apiGet2FA: any
        let results: any = []
        const params: Record<string, any> = {
          email: this.user.email,
          userType: 'EMPLOYEE'
        }
        apiGet2FA = apiCrowdsale.get2FABuyCrowdsale(params)
        results = await Promise.all([apiSendcode, apiGet2FA])
        this.type2Fa = results[1]

        this.setOpenPopup({
          popupName: 'popup-base-verify',
          isOpen: true
        })
      } else {
        apiCrowdsale.sendCodeAndGet2FATransferLynkey().then(res => {
          this.type2Fa = res.type
          this.setOpenPopup({
            popupName: 'popup-base-verify',
            isOpen: true
          })
        })
      }
    }
    handleClickArrow(type: 'prev' | 'next'): void {
      const elm = this.$refs['wrap-card'] as Element
      const left = type === 'prev' ? 0 : 200
      elm.scrollTo({
        top: 0,
        left,
        behavior: 'smooth'
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
    //box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    //border-radius: 4px;
    .kyc-filter {
      background-color: #ffffff !important;
      padding-top: 24px;
      padding-bottom: 24px;
    }
    .wrap {
      overflow: hidden;
      .items-card {
        // width: calc(100% / 4 - 50px);
        min-width: 240px;
        margin-right: 24px;
        // width: 100%;
        background-color: #ffffff;
        //box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
        border-radius: 8px;
        border: 1px solid #dbdbdb !important;
        // margin-right: 24px;
        //margin-bottom: 24px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        // flex: 1;
        &:last-child {
          margin-right: 0;
        }
        .item-bottom {
          margin-top: auto;
        }

        &:last-of-type {
          margin-right: 0;
        }

        .top {
          justify-content: space-between;
          align-items: center;
        }

        .number2 {
          font-family: Open Sans;
          font-style: normal;
          font-weight: 600;
          font-size: 24px;
          line-height: 24px;
          color: #0a0b0d;
          word-break: break-all;
          margin: 8px 0;
          .tabActiveHeader {
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
          }
        }

        .text3 {
          font-family: Open Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
          color: #5b616e;
        }

        .text1 {
          font-family: Open Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 24px;
          color: #5b616e;
        }
      }
    }
    .wrap::-webkit-scrollbar-thumb {
      height: 5px;
    }
    .wrap::-webkit-scrollbar {
      height: 5px;
    }

    .table-transaction {
      padding: 0 24px;
      background-color: #ffffff;

      .cell {
        .customer {
          p:first-of-type {
            font-family: Open Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            color: #0a0b0d;
          }

          p:last-of-type {
            font-family: Open Sans;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            color: #5b616e;
          }
        }
      }
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
    .flex-start {
      justify-content: flex-start !important;
      .items-card {
        margin-right: 48px;
      }
    }

    .btn-crousel {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
    }
    .next {
      margin: 0 12px 0 16px;
    }
  }
</style>
