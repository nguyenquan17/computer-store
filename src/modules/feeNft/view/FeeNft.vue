<template>
  <div class="fee-nft">
    <div class="fee-nft-header box-shadow">
      <div class="fee-nft-header__tabs jc-space-between">
        <div class="list-tab">
          <span class="tab-item cursor" v-for="(tab, index) in getTab" :key="index" :class="{ 'tab-active': getTabActive === tab.title }" @click="handleChangeTab(tab)">{{
            tab.title
          }}</span>
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

      <div class="fee-nft-header__summaries">
        <swiper ref="swiperRef" :options="swiperOption">
          <swiper-slide class="summary-item">
            <div class="summary">
              <div class="summary-title">
                <span class="summary-title__text">{{ $t('fee-nft.service-fee') }}</span>
                <base-icon icon="icon-service-fee" size="24" />
              </div>
              <div class="summary-number">
                {{ (typeActive.value === 'NFT_SALE' ? summaries[0].totalFeeDisplay : 0) | convertAmountDecimal(tabActive) }} {{ tabActive }}
                <!-- {{(getSummary[0].transactionType === 'NFT_SALE' ? getSummary[0].totalFeeDisplay : 0 )| convertAmountDecimal(tabActive)}} {{tabActive}} -->
              </div>
              <div class="summary-approximate">~ ${{ (typeActive.value === 'NFT_SALE' ? summaries[0].totalFeeUSD : 0) | convertAmountDecimal('USD') }}</div>
            </div>
          </swiper-slide>
          <swiper-slide class="summary-item">
            <div class="summary">
              <div class="summary-title">
                <span class="summary-title__text">{{ $t('fee-nft.royalty-fee') }}</span>
                <base-icon icon="icon-loyalties" size="24" />
              </div>
              <div class="summary-number">{{ (typeActive.value === 'ROYALTIES_FEE' ? summaries[0].totalFeeDisplay : 0) | convertAmountDecimal(tabActive) }} {{ tabActive }}</div>
              <div class="summary-approximate">~ ${{ (typeActive.value === 'ROYALTIES_FEE' ? summaries[0].totalFeeUSD : 0) | convertAmountDecimal('USD') }}</div>
            </div>
          </swiper-slide>
          <swiper-slide class="summary-item">
            <div class="summary">
              <div class="summary-title">
                <span class="summary-title__text">{{ $t('fee-nft.transfer-fee') }}</span>
                <base-icon icon="icon-transfer-fee" size="24" />
              </div>
              <div class="summary-number">{{ (typeActive.value === 'NFT_TRANSFER' ? summaries[0].totalFeeDisplay : 0) | convertAmountDecimal(tabActive) }} {{ tabActive }}</div>
              <div class="summary-approximate">~ ${{ (typeActive.value === 'NFT_TRANSFER' ? summaries[0].totalFeeUSD : 0) | convertAmountDecimal('USD') }}</div>
            </div>
          </swiper-slide>
          <!-- <div class="summary-item">
          <div class="summary" style="visibility: hidden">
            <div class="summary-title">
              <span class="summary-title__text">Total Burn Fee</span>
              <base-icon icon="icon-burn" size="24" />
            </div>
            <div class="summary-number">47,444.01 {{ coinMain }}</div>
            <div class="summary-approximate">~ $1,253.66</div>
          </div>
        </div> -->
        </swiper>
      </div>
    </div>
    <div class="fee-nft-body box-shadow">
      <div class="fee-nft-body__types">
        <span
          class="type-item cursor"
          v-for="(type, index) in getFilterTypes"
          :key="index"
          @click="handleChangeType(type)"
          :class="typeActive.typeId === type.typeId ? 'tab-active' : null"
          >{{ type.title }}</span
        >
      </div>
      <div class="fee-nft-body__content">
        <div class="wrap-filter">
          <fee-nft-filter @filters="handleFilter($event)" />
        </div>
        <div class="wrap-table">
          <base-table
            :data="propdataTable"
            class="table-fee-nft"
            :paginationInfo="selectLanguage() === 'en' ? 'transactions' : $t('header.transaction')"
            :table="queryTable"
            @rowClick="handleRowClick"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
            :loading="isLoading"
          >
            <el-table-column label="#" type="index" :index="indexMethod" width="70" />
            <el-table-column :label="$t('fee-nft.table.trans-id')" width="280" align="left">
              <template slot-scope="scope">
                <p class="trans-id">
                  <span>
                    {{ scope.row.transactionCode | formatTransactionCode(10) }}
                  </span>
                  <base-icon icon="icon-copy" size="20px" style="margin-left: 8px" @click.native="handleCopy($event, scope.row.transactionCode)" />
                </p>
                <p class="trans-date">{{ scope.row.transactionDate | formatMMDDYY }}</p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fee-nft.table.item')" align="left">
              <template slot-scope="scope">
                <div class="wrap-item-col">
                  <img :src="scope.row.itemThumb" class="item-img" width="40px" height="40px" />
                  <div class="item-text">
                    <p class="item-text__name" :class="classResponsive">{{ scope.row.itemName }}</p>
                    <p class="item-text__code" v-if="scope.row.integrationItemId">#{{ scope.row.integrationItemId }}</p>
                    <p class="item-text__code" v-else>#{{ scope.row.itemCode }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fee-nft.table.from')" align="left">
              <template slot-scope="scope">
                <div class="wrap-from-col">
                  <p class="wrap-from-col__name">{{ scope.row.accountName }}</p>
                  <p class="wrap-from-col__email" :class="classResponsive">{{ scope.row.username }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fee-nft.table.fee')" align="right" width="180">
              <template slot-scope="scope">
                <div class="wrap-fee-col">
                  <p class="wrap-fee-col__coin">{{ scope.row.feeDisplay | convertAmountDecimal(tabActive) }} {{ tabActive }}</p>
                  <p class="wrap-fee-col__usd">~${{ scope.row.feeUSD | convertAmountDecimal('USD') }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('fee-nft.table.status')" align="right" width="150">
              <template slot-scope="scope">
                <span class="status" :class="checkType(scope.row.status)">{{ getTitleStatus(scope.row.status) }}</span>
              </template>
            </el-table-column>
          </base-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch, Vue } from 'vue-property-decorator'
  //@ts-ignore
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { FeeNftRepository } from '@/services/repositories/feenft'
  import FeeNftFilter from '@/modules/feeNft/components/filter/FeeNftFilter.vue'
  import BaseTable from '@/components/base/table/BaseTable.vue'
  import EventBus from '@/utils/eventBus'
  import { debounce } from 'lodash'

  import { SwiperOptions } from 'swiper'
  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  SwiperClass.use([Pagination])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import 'swiper/swiper-bundle.css'

  const api: FeeNftRepository = getRepository('feenft')

  import { namespace } from 'vuex-class'
  import { arcToPoint } from '@amcharts/amcharts4/.internal/core/rendering/Path'

  const beBase = namespace('beBase')
  interface SumFormat {
    transactionType: string
    totalFeeWei: number
    totalFeeDisplay: number
    totalFeeUSD: number
  }
  @Component({ components: { FeeNftFilter, BaseTable } })
  export default class FeeNft extends Mixins(PopupMixin) {
    // query: any = {
    //   search: '',
    //   limit: 10,
    //   page: 1,
    //   orderBy: 1,
    //   total: 0
    // }

    swiperOption: SwiperOptions = {
      slidesPerView: 4,
      spaceBetween: 24,
      loop: false,
      loopFillGroupWithBlank: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: false
      }
    }

    handleClickArrow(type: string): void {
      if (type === 'next') {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slideNext()
      } else {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slidePrev()
      }
    }

    canExport = true
    windowSize: number = window.innerWidth
    summaries = [
      { transactionType: 'NFT_SALE', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
      { transactionType: 'ROYALTIES_FEE', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
      { transactionType: 'NFT_TRANSFER', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
      { transactionType: 'NFT_OPEN_EGG', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
      { transactionType: 'NFT_BREED', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
      { transactionType: 'NFT_CONVERT', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 }
    ]
    isLoading = false
    typeActive = {
      typeId: 1,
      title: this.$i18n.t('fee-nft.service'),
      value: 'NFT_SALE'
    }
    currencyActive = 1
    filterTypes: Array<Record<string, any>> = [
      {
        typeId: 1,
        title: this.$i18n.t('fee-nft.service'),
        value: 'NFT_SALE'
      },
      {
        typeId: 2,
        title: this.$i18n.t('fee-nft.royalty'),
        value: 'ROYALTIES_FEE'
      },
      {
        typeId: 3,
        title: this.$i18n.t('fee-nft.transfer'),
        value: 'NFT_TRANSFER'
      }
    ]
    filterTypesHub: Array<Record<string, any>> = [
      {
        typeId: 1,
        title: this.$i18n.t('fee-nft.sale'),
        value: 'NFT_SALE'
      },
      {
        typeId: 2,
        title: this.$i18n.t('fee-nft.royalty'),
        value: 'ROYALTIES_FEE'
      },
      {
        typeId: 3,
        title: this.$i18n.t('fee-nft.transfer'),
        value: 'NFT_TRANSFER'
      },
      // {
      //   typeId: 4,
      //   title: this.$i18n.t('fee-nft.burn'),
      //   value: 'NFT_BURN'
      // },
      {
        typeId: 5,
        title: this.$i18n.t('fee-nft.open-box'),
        value: 'NFT_OPEN_BOX'
      },
      {
        typeId: 6,
        title: this.$i18n.t('fee-nft.open-egg'),
        value: 'NFT_OPEN_EGG'
      },
      {
        typeId: 7,
        title: this.$i18n.t('fee-nft.breed'),
        value: 'NFT_BREED'
      },
      {
        typeId: 8,
        title: this.$i18n.t('fee-nft.mint-nft'),
        value: 'NFT_CONVERT'
      }
    ]

    tabs: Array<Record<string, any>> = [
      {
        id: 2,
        title: 'BTC',
        routeName: 'FeeNftBtc'
      },
      {
        id: 3,
        title: 'ETH',
        routeName: 'FeeNftEth'
      },
      {
        id: 4,
        title: 'BNB',
        routeName: 'FeeNftBnb'
      },
      {
        id: 5,
        title: 'USDT',
        routeName: 'FeeNftUsdt'
      },
      {
        id: 6,
        title: 'USDC',
        routeName: 'FeeNftUsdc'
      },
      {
        id: 7,
        title: 'BUSD',
        routeName: 'FeeNftBusd'
      }
      // {
      //   id: 8,
      //   title: 'OTHERS',
      //   routeName: 'FeeNftOthers'
      // }
    ]
    titlePending = ''
    tabActive = ''
    isChanged = false

    data: Array<Record<string, any>> = []
    filters: any = {
      fromTransactionAmount: null,
      fromDate: null,
      fromFeeAmount: null,
      orderBy: null,
      search: null,
      status: null,
      toTransactionAmount: null,
      toDate: null,
      toFeeAmount: null
    }
    detailRow = {}
    dataDetail = {}

    query: any = {
      currency: '',
      type: '',
      search: '',
      fromDate: '',
      toDate: '',
      fromFeeAmount: '',
      toFeeAmount: '',
      fromTransactionAmount: '',
      toTransactionAmount: '',
      orderBy: 'DATE',
      status: '',
      page: 1,
      limit: 10,
      total: 10
    }

    withdraw: any = {}
    transfer: any = {}
    listApproveBy: Record<string, any>[] = []
    scope: any
    get classResponsive(): string {
      let rs = ''
      if (this.windowSize >= 1400) {
        rs = ''
      } else if (this.windowSize >= 1300 && this.windowSize < 1400) {
        rs = 'responsive-1'
      } else if (this.windowSize >= 1280 && this.windowSize < 1300) {
        rs = 'responsive-2'
      }
      return rs
    }
    get getTab(): Array<Record<string, any>> {
      return [
        {
          id: 1,
          title: 'LYNK',
          routeName: 'FeeNftLynk'
        },
        ...this.tabs
      ]
    }
    get getTabActive(): string {
      console.log(this.$route.path.split('/')[2])
      return this.$route.path.split('/')[2]
    }
    get queryTable(): any {
      return {
        ...this.query,
        limit: this.query.limit
      }
    }
    get getFilterTypes(): Array<Record<string, any>> {
      return this.filterTypes
    }
    created(): void {
      this.tabActive = this.getTabActive
      console.log('route', this.$route.path.split('/')[2])
      this.query.currency = this.getTabActive
      this.query.status = 'SUCCESS'
      this.query.type = this.typeActive.value
      this.getSummaries()
      this.debounceInit()
      window.addEventListener('resize', this.handleResponsive)
      EventBus.$on('request-export', this.handleExportFeeNft)
    }

    destroyed(): void {
      window.removeEventListener('resize', this.handleResponsive)
      EventBus.$off('request-export', this.handleExportFeeNft)
    }
    propdataTable: Record<string, any>[] = []

    handleResponsive(e) {
      this.windowSize = e.target.innerWidth
    }
    selectLanguage(): string {
      return window.localStorage.getItem('bc-lang') as string
    }
    async init(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          // userId: this.query.userId,
          orderBy: this.query.orderBy,
          limit: this.query.limit,
          page: this.query.page,
          currency: this.tabActive,
          fromDate: this.query.fromDate,
          toDate: this.query.toDate,
          fromTransactionAmount: this.query.fromTransactionAmount,
          toTransactionAmount: this.query.toTransactionAmount,
          fromFeeAmount: this.query.fromFeeAmount,
          toFeeAmount: this.query.toFeeAmount,
          type: this.query.type,
          total: null
        }
        const result = await api.getListFeeNft('fee', params)
        this.propdataTable = result.content
        // this.propdataTable = result.transactions.content
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

        // const summaryWithdraw = result.summary.filter(item => {
        //   return item.transactionType === 'WITHDRAW'
        // })[0]
        // this.withdraw = {
        //   ...summaryWithdraw,
        //   currency: this.tabActive
        // }
        // const summaryTransfer = result.summary.filter(item => {
        //   return item.transactionType === 'TRANSFER'
        // })[0]
        // this.transfer = {
        //   ...summaryTransfer,
        //   currency: this.tabActive
        // }
        this.canExport = result.totalElements < 1 ? false : true
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }
    async getSummaries(): Promise<any> {
      const params = {
        search: this.query.search,
        orderBy: this.query.orderBy,
        currency: this.tabActive,
        fromDate: this.query.fromDate,
        toDate: this.query.toDate,
        fromTransactionAmount: this.query.fromTransactionAmount,
        toTransactionAmount: this.query.toTransactionAmount,
        fromFeeAmount: this.query.fromFeeAmount,
        toFeeAmount: this.query.toFeeAmount,
        type: this.query.type,
        total: null,
        status: this.query.status
      }
      try {
        const rs = await api.getFeeNftSummary('fee/summary', params)
        if (rs.length !== 0) {
          this.summaries = rs
        } else {
          this.summaries = [
            { transactionType: 'NFT_SALE', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
            { transactionType: 'ROYALTIES_FEE', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
            { transactionType: 'NFT_TRANSFER', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
            { transactionType: 'NFT_OPEN_EGG', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
            { transactionType: 'NFT_BREED', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 },
            { transactionType: 'NFT_CONVERT', totalFeeDisplay: 0, totalFeeWei: 0, totalFeeUsd: 0 }
          ]
        }
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    }

    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleChangeType(Type: any): void {
      this.typeActive = Type
      this.resetQuery()
      this.query.currency = this.tabActive
      this.query.page = 1
      this.query.limit = 10
      this.query.orderBy = 'DATE'
      this.query.type = Type.value
      console.log('this', this.typeActive.value)
      if (this.typeActive.value === 'NFT_CONVERT' || this.typeActive.value === 'NFT_BREED' || this.typeActive.value === 'NFT_OPEN_EGG') {
        this.handleClickArrow('next')
      } else {
        this.handleClickArrow('')
      }

      this.getSummaries()
      this.debounceInit()
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.$router.push({ name: tab.routeName }).catch(error => {
        console.log(error)
      })
      this.typeActive = {
        typeId: 1,
        title: 'Service',
        value: 'NFT_SALE'
      }
      this.resetQuery()
      this.tabActive = tab.title
      this.query.currency = tab.title
      this.query.page = 1
      this.query.limit = 10
      this.query.orderBy = 'DATE'
      this.query.type = this.typeActive.value
      this.getSummaries()
      this.debounceInit()
    }
    handleCurrentChange(page: any): void {
      this.query.page = page
      this.init()
    }

    resetQuery(): void {
      this.query = {
        ...this.query,
        page: 1,
        limit: 10,
        orderBy: 'DATE',
        search: this.filters.search,
        currency: null,
        // status: 'SUCCESS',
        fromDate: this.filters.fromDate,
        toDate: this.filters.toDate,
        fromTransactionAmount: this.filters.fromTransactionAmount,
        toTransactionAmount: this.filters.toTransactionAmount,
        fromFeeAmount: this.filters.fromFeeAmount,
        toFeeAmount: this.filters.toFeeAmount
        // bonusType: null
      }
    }
    handlePageChange(page: number): void {
      this.query.page = page
      this.init()
    }

    handleSizeChange(limit: number): void {
      this.query.page = 1
      this.query.limit = limit
      this.init()
    }

    getTitleStatus(input: string): string {
      const lang = window.localStorage.getItem('bc-lang')
      if (lang === 'en') {
        return input === 'SUCCESS' ? 'Success' : input === 'PENDING' ? 'Pending' : input === 'FAILED' ? 'Failed' : 'Processing'
      } else if (lang === 'vi') {
        return input === 'SUCCESS' ? 'Thành công' : input === 'PENDING' ? 'Chưa xử lý' : input === 'FAILED' ? 'Thất bại' : 'Đang xử lý'
      }
      return ''
    }
    handleRowClick(row: Record<string, any>): void {
      // this.detailRow = row
      // this.setOpenPopup({
      //   popupName: 'popup-fee-detail',
      //   isOpen: true
      // })
      // console.log('492...')
    }

    handleFilter(filter: Record<string, any>): void {
      this.filters = filter
      this.query = {
        ...this.query,
        search: this.filters.search,
        currency: '',
        type: this.typeActive.value,
        fromDate: this.filters.fromDate,
        toDate: this.filters.toDate,
        fromTransactionAmount: this.filters.fromTransactionAmount,
        toTransactionAmount: this.filters.toTransactionAmount,
        fromFeeAmount: this.filters.fromFeeAmount,
        toFeeAmount: this.filters.toFeeAmount,
        status: this.filters.status,
        orderBy: this.filters.orderBy,
        page: 1,
        limit: 10
      }
      this.getSummaries()
      this.debounceInit()
    }
    handleCopy(e, data: string): void {
      this.$emit('copy', 'copy')
      e.stopPropagation()
      navigator.clipboard.writeText(data)
      let message: any = ''
      message = this.$t('notify.copy')
      this.$message.success(message)
    }
    debounceInit = debounce(() => {
      this.init()
    }, 100)
    handleNormalize(): void {
      this.isChanged = false
    }
    // getStatus(input: string):string {
    //   let rs = ''
    //   switch(input) {
    //     case 'Success':
    //       rs = 'status__success'
    //       break
    //     case 'Pending':
    //       rs = 'status__pending'
    //       break
    //   }
    //   return rs
    // }
    checkType(typeCheck: string): string {
      const result =
        typeCheck === 'PENDING'
          ? 'status-pending'
          : typeCheck === 'FAILED' || typeCheck === 'LOCKED' || typeCheck === 'WAITING' || typeCheck === 'EXPIRED'
          ? 'status-error'
          : typeCheck === 'PROCESSING'
          ? 'status-pending'
          : typeCheck === 'REJECTED'
          ? 'status-rejected'
          : 'status-success'
      return result
    }
    async handleExportFeeNft(): Promise<void> {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const params = {
        ...this.query,
        // userId: this.query.userId,
        orderBy: this.query.orderBy,
        limit: this.query.limit,
        page: this.query.page,
        currency: this.tabActive,
        fromDate: this.query.fromDate,
        toDate: this.query.toDate,
        fromTransactionAmount: this.query.fromTransactionAmount,
        toTransactionAmount: this.query.toTransactionAmount,
        fromFeeAmount: this.query.fromFeeAmount,
        toFeeAmount: this.query.toFeeAmount,
        type: this.query.type,
        total: null,
        exportFrom: 'NFT_FEE',
        zoneId: timeZone
      }
      try {
        if (this.canExport) {
          const rs = await api.exportExcelNft(params)
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
          const fileName = `nft_fee_${month + '' + date + year}_${hours + '' + minutes + seconds}`
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
      EventBus.$emit('done-export')
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  ::v-deep.fee-nft {
    width: 100%;
    height: auto;
    background-color: transparent;
    &-header {
      background-color: var(--bc-color-white);
      margin-bottom: 24px;
      &__tabs {
        width: 100%;
        height: 56px;
        display: flex;
        align-items: center;
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
        .tab-item {
          display: inline-block;
          @include text(16px, 24px, 400, #5b616e);
          box-sizing: border-box;
          padding: 15px 12px;
          &.tab-active {
            @include text(16px, 24px, 600, #0151fc);
            border-bottom: 2px solid #0151fc;
          }
        }
      }
      &__summaries {
        display: flex;
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
        align-items: center;
        padding: 24px;
        border-top: 1px solid #dbdbdb;
        .swiper-slide {
          width: 240px !important;
        }
        .summary {
          padding: 16px;
          border: 1px solid #dbdbdb;
          border-radius: 8px;
          height: auto;
          box-sizing: border-box;
          &-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            &__text {
              @include text(16px, 24px, 400, #5b616e);
            }
          }
          &-number {
            margin-bottom: 4px;
            @include text(24px, 24px, 600, #0a0b0d);
          }
          &-approximate {
            @include text(14px, 20px, 400, #5b616e);
          }
        }
      }
    }
    &-body {
      background-color: var(--bc-color-white);
      padding: 0;
      &__types {
        display: flex;
        justify-content: left;
        align-items: center;
        .type-item {
          display: inline-block;
          padding: 16px 12px;
          box-sizing: border-box;
          @include text(16px, 24px, 400, #5b616e);
          &.tab-active {
            @include text(16px, 24px, 600, #0151fc);
            border-bottom: 2px solid #0151fc;
          }
        }
      }
      &__content {
        border-top: 1px solid #dbdbdb;
        .wrap-table {
          padding: 0 24px;
          .table-fee-nft {
            .trans-id {
              @include text(16px, 24px, 400, #0151fc);
              span:first-child {
                display: inline-block;
                width: 200px;
              }
            }
            .trans-date {
              @include text(14px, 20px, 400, #5b616e);
            }
            .wrap-item-col {
              display: flex;
              justify-content: left;
              align-items: center;
              .item-img {
                border-radius: 4px;
                margin-right: 8px;
              }
              .item-text {
                width: 100%;
                &__name {
                  @include text(16px, 24px, 400, #0a0b0d);
                  text-overflow: ellipsis;
                  overflow: hidden;
                  width: 190px;
                  height: 24px;
                  white-space: nowrap;
                  &.responsive-1 {
                    width: 160px;
                  }
                  &.responsive-2 {
                    width: 140px;
                  }
                }
                &__code {
                  @include text(14px, 20px, 400, #5b616e);
                }
              }
            }
            .wrap-from-col {
              width: 100%;
              &__name {
                @include text(16px, 24px, 400, #0a0b0d);
                text-overflow: ellipsis;
                overflow: hidden;
                width: 150px;
                height: 24px;
                white-space: nowrap;
              }
              &__email {
                @include text(14px, 20px, 400, #5b616e);
                text-overflow: ellipsis;
                overflow: hidden;
                width: 250px;
                height: 24px;
                white-space: nowrap;
                &.responsive-1 {
                  width: 200px;
                }
                &.responsive-2 {
                  width: 200px;
                }
              }
            }
            .wrap-fee-col {
              &__coin {
                @include text(16px, 24px, 400, #0a0b0d);
              }
              &__usd {
                @include text(14px, 20px, 400, #5b616e);
              }
            }
            .status {
              display: inline-block;
              width: 80px;
              text-align: center;
              border-radius: 4px;
              box-sizing: border-box;
              &.status-success {
                background-color: var(--bc-bg-success);
                @include text(12px, 24px, 500, #129961);
              }
              &.status-pending {
                background-color: var(--bc-bg-warning);
                @include text(12px, 24px, 500, #dd7d00);
              }
              &.status-error {
                background-color: var(--bc-bg-error);
                @include text(12px, 24px, 500, #cf202f);
              }
            }
          }
        }
      }
    }
  }
</style>
