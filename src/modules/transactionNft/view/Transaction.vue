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
      <div class="container wallet-header be-flex card" style="width: calc(100% - 48px); padding: 24px 24px">
        <div v-for="(value, i) in getListCard" :key="i" class="items-card">
          <div class="item be-flex top">
            <span class="text1">
              {{ renderTitleCard(value.transactionType) }}
            </span>
            <div>
              <base-icon :icon="renderIconCard(value.transactionType)" size="24" class="d-iflex" />
            </div>
          </div>
          <div class="item">
            <p class="number2">
              {{ value.amount | convertAmountDecimal(tabHeaderActive) }}
              <a class="tabActiveHeader">{{ tabHeaderActive }}</a>
            </p>
          </div>
          <div class="item-bottom">
            <span class="text3">~${{ value.amountUsd | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 bo-kyc box-shadow">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div class="tab-item cursor" v-for="tab in getTabs" :key="tab.id" :class="$route.params.type === tab.type ? 'tab-active' : null" @click="handleChangeTab(tab)">
              <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div>
      <filter-transaction
        :show-btn-export-excel="true"
        @filter="handleFilter"
        :showBtn="getShowBtn"
        :showBtnCrowdsale="showBtnCrowdsale"
        :showBtnTransfer="showBtnTransfer"
        :type="'transaction-nft'"
        ref="filter"
        @clickButton="handleClickButton"
      />
      <div class="table-transaction">
        <table-transaction
          v-loading="isLoading"
          :listTransaction="propDataTable"
          :tab-active="tabActive"
          :query="query"
          @sizeChange="handleSizeChange"
          @pageChange="handlePageChange"
          @rowClick="handleRowClick"
          @copy="handleCopy"
        />
      </div>
      <popup-filter-transaction
        @filter="handleFilter"
        :tab-active-filter="tabActive"
        :list-account-popup-referral="listAccountPopupReferralCode"
        :type="'transaction'"
        :query-referral="query"
        ref="popup-filter"
      />
      <transaction-nft-detail :detailRow="detailRow" :tab-active-filter="tabActive" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  //@ts-ignore

  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { debounce, filter } from 'lodash'
  import { TransactionRepository } from '@/services/repositories/transaction'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'
  import { NftRepository } from '@/services/repositories/nft'
  import TableTransaction from '../components/table/TableTransactionNft.vue'
  import FilterTransaction from '@/components/filter/FilterTransaction.vue'
  import PopupFilterTransaction from '../components/popup/PopupFilterTransactionNft.vue'
  import TransactionNftDetail from '../components/popup/TransactionNftDetail.vue'
  import PopupAddDeposit from '../components/PopupAddDeposit.vue'
  import PopupAddCrowdsale from '../components/PopupAddCrowdsale.vue'
  import PopupAddTransfer from '../components/PopupAddTransfer.vue'
  import PopupVerify from '@/components/popup/PopupVerify.vue'
  const api: TransactionRepository = getRepository('transaction')
  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')
  const apiNft: NftRepository = getRepository('nft')
  import { namespace } from 'vuex-class'
  import { findIndex } from '@amcharts/amcharts4/.internal/core/utils/Array'
  import EventBus from '@/utils/eventBus'
  const bcAuth = namespace('beAuth')
  interface IDataCard {
    amount: number | null
    transactionType: string | null
    amountUsd: number | null
  }

  @Component({
    components: {
      PopupFilterTransaction,
      TableTransaction,
      FilterTransaction,
      TransactionNftDetail,
      PopupAddDeposit,
      PopupAddCrowdsale,
      PopupVerify,
      PopupAddTransfer
    }
  })
  export default class TransactionNFT extends Mixins(PopupMixin) {
    @bcAuth.State('user') user!: Record<string, any>
    canExport = true
    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'put-on-sale',
        transactionType: 'LIST',
        type: 'put-on-sale'
      },
      // {
      //   id: 5,
      //   title: 'bid',
      //   transactionType: 'BID',
      //   type: 'bid'
      // },
      // {
      //   id: 2,
      //   title: 'offer',
      //   transactionType: 'OFFER',
      //   type: 'offer'
      // },
      {
        id: 3,
        title: 'sale',
        transactionType: 'SALE',
        type: 'sale'
      },
      {
        id: 4,
        title: 'transfer',
        transactionType: 'TRANSFER',
        type: 'transfer'
      },
      {
        id: 6,
        title: 'burn',
        transactionType: 'BURN',
        type: 'burn'
      }
    ]

    tabsHeader: Array<Record<string, any>> = [
      {
        id: 2,
        title: 'BTC',
        routeName: 'TransactionBtc'
      },
      {
        id: 3,
        title: 'ETH',
        routeName: 'TransactionEth'
      },
      {
        id: 4,
        title: 'BNB',
        routeName: 'TransactionBnb'
      },
      {
        id: 5,
        title: 'USDT',
        routeName: 'TransactionUsdt'
      },
      {
        id: 6,
        title: 'USDC',
        routeName: 'TransactionUsdc'
      },
      {
        id: 7,
        title: 'BUSD',
        routeName: 'TransactionBusd'
      }
    ]

    tabHeaderActive = ''
    tabActive = ''
    isLoading = false

    dataHeaderCard: IDataCard[] = [
      {
        amount: 0,
        amountUsd: 0,
        transactionType: 'LIST'
      },
      {
        amount: 0,
        amountUsd: 0,
        transactionType: 'SALE'
      },
      {
        amount: 0,
        amountUsd: 0,
        transactionType: 'DAILY_PROFIT'
      }
      // {
      //   amount: 0,
      //   amountUsd: 0,
      //   transactionType: 'BID'
      // },
      // {
      //   amount: 0,
      //   amountUsd: 0,
      //   transactionType: 'OFFER'
      // }
    ]

    detailRow = {}

    query: Record<string, any> = {
      referralCode: '',
      search: '',
      currency: '',
      transactionType: '',
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      fromAccount: '',
      toAccount: '',
      fromQuantity: '',
      toQuantity: '',
      transactionStatus: 'SUCCESS',
      orderBy: 'DATE_DESC',
      page: 1,
      limit: 10,
      total: 10
    }

    listAccountReferral: Record<string, any>[] = []
    get listAccountPopupReferralCode(): any {
      return this.listAccountReferral.filter(r => r.referralCode !== null)
    }

    get getListCard(): Array<Record<string, any>> {
      if (this.checkPemission('transaction-nft', ['view-all-transaction-nft'])) {
        return this.dataHeaderCard
      }
      return filter(this.dataHeaderCard, elm => elm.transactionType === 'SALE')
    }

    listApproveBy: Record<string, any>[] = []
    type2Fa = ''
    formData: Record<string, any> = {}

    get getTabsHeader(): Array<Record<string, any>> {
      return [
        {
          id: 1,
          title: 'LYNK',
          routeName: 'TransactionLynk'
        },
        ...this.tabsHeader
      ]
    }

    get getTabs(): Array<Record<string, any>> {
      if (this.checkPemission('transaction-nft', ['view-all-transaction-nft'])) {
        return [...this.tabs, { id: 8, title: 'staking', transactionType: 'DAILY_PROFIT', type: 'staking' }]
      } else {
        return [
          {
            id: 3,
            title: 'sale',
            transactionType: 'SALE',
            type: 'sale'
          }
        ]
      }
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
      if (!this.checkPemission('transaction-nft', ['view-all-transaction-nft'])) {
        this.$router.push({ name: 'TransactionNft', params: { token: process.env.VUE_APP_COIN_MAIN, type: 'sale' } })
        this.query.referralCode = this.user.affiliationCode
      }
      this.query = { ...this.query, currency: this.$route.params.token }
      this.tabHeaderActive = this.$route.params.token

      const type = this.$route.params.type
      const elmTab = filter(this.getTabs, elm => elm.title === type)[0]
      this.tabActive = elmTab.transactionType
      await this.init()
      EventBus.$on('start-export', this.handleExport)
    }
    destroyed(): void {
      EventBus.$off('start-export', this.handleExport)
    }
    async handleExport(): Promise<void> {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const params = {
        ...this.query,
        transactionType: this.tabActive,
        currency: this.tabHeaderActive,
        exportFrom: 'NFT_TRANSACTION',
        zoneId: timeZone
      }
      try {
        if (this.canExport) {
          const rs = await apiNft.exportExcel(params)
          const url = window.URL.createObjectURL(new Blob([rs]))
          const link = document.createElement('a')
          link.href = url
          const currentTime = new Date()
          const month = currentTime.getMonth() < 10 ? '0' + (currentTime.getMonth() + 1) : currentTime.getMonth() + 1
          const date = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate()
          const year = currentTime.getFullYear()
          const hours = currentTime.getHours() < 10 ? '0' + currentTime.getHours() : currentTime.getHours()
          const minutes = currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()
          const seconds = currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds()
          const fileName = `nft_transactions_${month + '' + date + year}_${hours + '' + minutes + seconds}`
          link.setAttribute('download', `${fileName}.xlsx`)
          document.body.appendChild(link)
          link.click()
        } else {
          throw {
            type: 'CAN_NOT_EXPORT',
            message: this.$i18n.t('fee-nft.can-not-export')
          }
        }
      } catch (error: any) {
        if (error?.type === 'CAN_NOT_EXPORT') {
          this.$message({
            type: 'error',
            message: error.message,
            duration: 1000
          })
        } else {
          console.log(error)
        }
      }
      EventBus.$emit('end-export')
    }

    propDataTable: Record<string, any>[] = []

    async init(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          transactionType: this.tabActive,
          total: null
        }

        const result = this.tabActive === 'DAILY_PROFIT' ? await api.getListTransactionStakingNft(params) : await api.getListTransactionNft(params)
        const index = findIndex(this.dataHeaderCard, elm => elm.transactionType === this.tabActive)
        this.propDataTable = result.pageItem.content
        this.listAccountReferral = result.pageItem.content

        this.query.total = result.pageItem.totalElements
        this.canExport = result.pageItem.totalElements < 1 ? false : true
        this.resetCard()
        const summary = result.total
        this.dataHeaderCard[index] = {
          ...this.dataHeaderCard[index],
          amount: summary.amount,
          amountUsd: summary.amountUSD
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
        this.resetCard()
        this.propDataTable = []
        this.query.total = 0
      }
    }

    resetCard(): void {
      this.dataHeaderCard = [
        {
          amount: 0,
          amountUsd: 0,
          transactionType: 'LIST'
        },
        {
          amount: 0,
          amountUsd: 0,
          transactionType: 'SALE'
        },
        {
          amount: 0,
          amountUsd: 0,
          transactionType: 'DAILY_PROFIT'
        }
      ]
    }

    renderTitleCard(type: 'SALE' | 'BID' | 'OFFER' | 'DAILY_PROFIT'): string {
      switch (type) {
        case 'DAILY_PROFIT':
          return this.$i18n.t(`card_staking`) as string
        case 'SALE':
          return this.$i18n.t(`card_sale`) as string
        case 'BID':
          return this.$i18n.t(`card_bid`) as string
        case 'OFFER':
          return this.$i18n.t(`card_offer`) as string

        default:
          return this.$i18n.t(`card_list`) as string
      }
    }

    renderIconCard(type: 'SALE' | 'BID' | 'OFFER' | 'DAILY_PROFIT'): string {
      switch (type) {
        case 'DAILY_PROFIT':
          return 'icon-staking'
        case 'SALE':
          return 'icon-total-sale'
        case 'BID':
          return 'icon-total-bid'
        case 'OFFER':
          return 'icon-total-offer'

        default:
          return 'icon-total-list'
      }
    }

    handleChangeTabsHeader(tab: Record<string, any>): void {
      this.resetQuery()
      this.$router.push({ params: { token: tab.title, type: this.$route.params.type } })
      // this.query.tabBalance = this.kycStatus[tab.title]
      this.tabHeaderActive = tab.title
      this.query.page = 1
      this.query.limit = 10
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
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.resetQuery()
      this.$router.push({ params: { token: this.$route.params.token, type: tab.type } }).catch(() => {
        return
      })
      // this.query.tabBalance = this.kycStatus[tab.title]
      this.tabActive = tab.transactionType
      this.query.page = 1
      this.query.limit = 10
      this.query.transactionType = tab.transactionType
      this.query.currency = this.tabHeaderActive
      this.query.referralCode = this.tabActive === 'SALE' ? this.query.referralCode : null
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
        orderBy: 'DATE_DESC',
        keywordString: null,
        currency: null,
        status: null,
        fromDate: null,
        toDate: null,
        fromAmount: null,
        toAmount: null,
        bonusType: null,
        fromAccount: null,
        toAccount: null,
        transactionStatus: 'SUCCESS'
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

    async handleRowClick(row: Record<string, any>): Promise<void> {
      if (this.isCopy !== 'copy') {
        if (this.tabActive !== 'DAILY_PROFIT') {
          this.detailRow = await api.getDetailTransactionNft({ activityId: row.id })
        } else {
          const index = findIndex(this.propDataTable, elm => elm.id === row.id)
          this.detailRow = this.propDataTable[index]
        }

        this.setOpenPopup({
          popupName: 'popup-transaction-nft-detail',
          isOpen: true
        })
      } else {
        this.isCopy = ''
      }
    }

    handleFilter(filter: Record<string, any>): void {
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

      console.log('query :', this.query, 'filter : ', filter, 'note')
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
      this.formData = form
      if (this.query.transactionType === 'CROWDSALE') {
        const params: Record<string, any> = {
          email: this.user.email,
          userType: 'EMPLOYEE'
        }
        let apiSendcode: any
        apiSendcode = await apiCrowdsale.sendCodeBuyCrowdsaleLynkey()
        const apiGet2FA = await apiCrowdsale.get2FABuyCrowdsale(params)
        const result = await Promise.all([apiSendcode, apiGet2FA])
        this.type2Fa = result[1]
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
  }
</script>

<style scoped lang="scss">
  .container {
    text-align: justify;
    -ms-text-justify: distribute-all-lines;
    text-justify: distribute-all-lines;
    width: 100%;
    justify-content: space-between;
  }

  .transaction {
    //box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    //border-radius: 4px;
    .kyc-filter {
      background-color: #ffffff !important;
      padding-top: 24px;
      padding-bottom: 24px;
    }
    .card {
      justify-content: unset;
    }

    .items-card {
      width: calc(100% / 4 - 50px);
      background-color: #ffffff;
      //box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
      border-radius: 8px;
      border: 1px solid #dbdbdb !important;
      // margin-right: 24px;
      //margin-bottom: 24px;
      padding: 16px;
      display: flex;
      flex-direction: column;

      margin-right: 24px;
      // flex: 1;
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
              bottom: 0;
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
  }
</style>
