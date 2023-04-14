<template>
  <div class="inventory box-shadow">
    <h1 class="inventory-title">{{ $t('inventory.summary.summary') }}</h1>
    <el-carousel :autoplay="false" arrow="always" :loop="false" @change="changeCarousel">
      <el-carousel-item>
        <div class="wrap-summaries mb-24">
          <div class="summary">
            <div class="summary-header">
              <span class="summary-header__title">{{ $t('inventory.summary.owners') }}</span>
              <base-icon icon="icon-two-users" size="24" />
            </div>
            <div class="summary-content">{{ summaryInventoryData.totalOwner | formatNumber }}</div>
          </div>
          <div class="summary">
            <div class="summary-header">
              <span class="summary-header__title">{{ $t('inventory.summary.NFTs') }}</span>
              <base-icon icon="icon-img-inventory" size="24" />
            </div>
            <div class="summary-content">{{ summaryInventoryData.totalNft | formatNumber }}</div>
          </div>
          <div class="summary">
            <div class="summary-header">
              <span class="summary-header__title">{{ $t('inventory.summary.available') }}</span>
              <base-icon icon="icon-available" size="24" />
            </div>
            <div class="summary-content">{{ summaryInventoryData.totalAvailable | formatNumber }}</div>
          </div>
          <div class="summary">
            <div class="summary-header">
              <span class="summary-header__title">{{ $t('inventory.summary.lock') }}</span>
              <base-icon icon="icon-lock-inventory" size="24" />
            </div>
            <div class="summary-content">{{ summaryInventoryData.totalLock | formatNumber }}</div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="wrap-summaries mb-24">
          <div class="summary">
            <div class="summary-header">
              <span class="summary-header__title">{{ $t('inventory.summary.on-sale') }}</span>
              <base-icon icon="onsale-inventory" size="24" />
            </div>
            <div class="summary-content">{{ summaryInventoryData.totalOnSale | formatNumber }}</div>
          </div>
          <div class="summary">
            <div class="summary-header">
              <span class="summary-header__title">{{ $t('inventory.summary.off-market') }}</span>
              <base-icon icon="offmarket-inventory" size="24" />
            </div>
            <div class="summary-content">{{ summaryInventoryData.totalOffMarket | formatNumber }}</div>
          </div>
          <div class="summary">
            <div class="summary-header">
              <span class="summary-header__title">{{ $t('inventory.summary.burn') }}</span>
              <base-icon icon="icon-burn" size="24" />
            </div>
            <div class="summary-content">{{ summaryInventoryData.totalBurn | formatNumber }}</div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="wrap-filter mb-24">
      <inventory-filter @filterInventory="handleFilter" :listDataNetwork="listDataNetwork" :isShowExport="true"></inventory-filter>
    </div>
    <div class="wrap-table">
      <base-table
        :data="listDataItem"
        :showPagination="true"
        :paginationInfo="getPaginationInfo"
        :table="query"
        :isLoading="isLoading"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        class="inventory-table"
        @rowClick="handleRowClick($event)"
      >
        <el-table-column label="#" type="index" align="center" width="80" :index="indexMethod" />
        <el-table-column :label="$t('inventory.table.owner')" align="left" width="350">
          <template slot-scope="scope">
            <p class="owner-name">{{ scope.row.ownerUserFullName }}</p>
            <p class="owner-email" v-if="scope.row.ownerAccountType === 'EXTERNAL'">
              {{ scope.row.username | formatTransactionCode }}
            </p>
            <p class="owner-email" v-if="scope.row.ownerAccountType === 'INTERNAL'">{{ scope.row.username }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('inventory.table.item')" align="left">
          <template slot-scope="scope">
            <div class="wrap-item">
              <img :src="scope.row.itemThumb" alt="" class="item-img" width="40px" height="40px" />
              <div class="item-text">
                <p class="item-text__name">{{ scope.row.itemName }}</p>
                <p class="item-text__code" v-if="scope.row.integrationItemId">#{{ scope.row.integrationItemId }}</p>
                <p class="item-text__code" v-else>#{{ scope.row.itemCode }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('inventory.table.network')" align="left" width="270">
          <template slot-scope="scope">
            <p class="network-name">{{ scope.row.networkName }}</p>
            <p class="network-code">{{ scope.row.network }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('inventory.table.quantity')" align="right" width="150">
          <template slot-scope="scope">
            <span class="quantity">{{ scope.row.originQuantity | formatNumber }}</span>
          </template>
        </el-table-column>
        <!--      <el-table-column :label="$t('inventory.table.status')" align="center" width="185">-->
        <!--        <template slot-scope="scope">-->
        <!--          <span class="status" :class="getClassStatus(scope.row.status)">{{getTextStatus(scope.row.status)}}</span>-->
        <!--        </template>-->
        <!--      </el-table-column>-->
      </base-table>
    </div>
    <popup-inventory-detail
      @resetQuery="handleResetQuery"
      :query="queryAccountState"
      @page="handleCurrentChangeAccount"
      @size="handleSizeChangeAccount"
      :dataAccountSummaryDetail="dataAccountSummaryDetail"
      :dataAccountContentDetail="dataAccountContentDetail"
      :dataSummaryInventoryDetail="dataSummaryInventoryDetail"
      :itemId="itemId"
      :accountId="accountId"
    />
    <popup-filter-inventory @filterInventory="handleFilter" :listDataNetwork="listDataNetwork" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import getRepository from '@/services'
  import { InventoryRepository } from '@/services/repositories/inventory'
  //@ts-ignore
  import PopupMixin from '@/mixins/popup'
  import InventoryFilter from '@/modules/inventory/components/filter/InventoryFilter.vue'
  import PopupInventoryDetail from '../components/popup/PopupInventoryDetail.vue'
  import BaseTable from '@/components/base/table/BaseTable.vue'
  import { debounce } from 'lodash'
  const apiNft: NftRepository = getRepository('nft')

  import { namespace } from 'vuex-class'
  import firebase from '@/utils/firebase'
  import PopupFilterInventory from '@/modules/inventory/components/popup/PopupFilterInventory.vue'
  import EventBus from '@/utils/eventBus'
  import { NftRepository } from '@/services/repositories/nft'

  const api: InventoryRepository = getRepository('inventory')
  const beBase = namespace('beBase')

  @Component({ components: { PopupFilterInventory, BaseTable, InventoryFilter, PopupInventoryDetail } })
  export default class Inventory extends Mixins(PopupMixin) {
    isLoading: any = false

    summaryInventoryData: Record<string, any> = {}
    listDataItem: Record<string, any>[] = []
    rowData: Record<string, any> = {}
    dataAccountSummaryDetail = {}
    dataAccountContentDetail = []
    dataSummaryInventoryDetail = {}
    listener: any = null
    listDataNetwork = []
    itemId = ''
    accountId = ''

    query: Record<string, any> = {
      search: '',
      network: '',
      fromQuantity: '',
      toQuantity: '',
      orderBy: 'QUANTITY_DESC',
      page: 1,
      limit: 10,
      total: 0
    }

    async created(): Promise<void> {
      if (this.$route.query.ownerId && this.$route.query.itemId) {
        await this.getDetailAccountStatement(this.$route.query)
        await this.getDetailSummaryInventory(this.$route.query)
        this.setOpenPopup({
          popupName: 'popup-inventory-detail',
          isOpen: true
        })
      }

      const listNetworkRef = firebase.database().ref('nft_assets')
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      this.listener = listNetworkRef.on('value', function (snapshot) {
        _this.listDataNetwork = snapshot.val()
        _this.listDataNetwork = _this.listDataNetwork.filter((item: Record<string, any>) => item.type === 'NFT')
      })
      this.init()
      this.getDataTable()
    }

    destroyed(): void {
      const listNetworkRef = firebase.database().ref('nft_assets')
      listNetworkRef.off('value', this.listener)
      EventBus.$off('start-export', this.handleExport)
    }

    async init(): Promise<void> {
      try {
        const response = await api.getSummaryData(this.query)
        this.summaryInventoryData = response
      } catch (error) {
        console.log(error)
      }
    }

    async getDataTable(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          orderBy: this.query.orderBy,
          page: this.query.page,
          limit: this.query.limit,
          total: null
        }
        const response = await api.getListInventoryDataTable(params)
        this.listDataItem = response.content
        this.query.total = response.totalElements
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    }

    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }

    get getPaginationInfo(): any {
      return this.$t('paging.results')
    }

    getClassStatus(input: string): string {
      let rs = ''
      switch (input) {
        case 'ONSALE':
          rs = 'status__success'
          break
        case 'OFFMARKET':
          rs = 'status__dark'
          break
        case 'BURN':
          rs = 'status__error'
          break
        case 'ONAUCTION':
          rs = 'status__info'
          break
      }
      return rs
    }

    getTextStatus(input: string): string {
      let rs = ''
      switch (input) {
        case 'ONSALE':
          rs = 'On sale'
          break
        case 'OFFMARKET':
          rs = 'Off market'
          break
        case 'BURN':
          rs = 'Burn'
          break
        case 'ONAUCTION':
          rs = 'On action'
          break
      }
      return rs
    }

    handleCurrentChange(page: number): void {
      this.query.page = page
      this.init()
      this.getDataTable()
    }

    handleSizeChange(limit: number): void {
      this.query.limit = limit
      this.init()
      this.getDataTable()
    }

    async getDetailAccountStatement(row): Promise<void> {
      try {
        const queryDetail = {
          ...this.queryAccountState,
          page: this.queryAccountState.page,
          limit: this.queryAccountState.limit,
          accountId: row.ownerId,
          itemId: row.itemId,
          total: null
        }
        const response = await api.getDetailItem(queryDetail)
        this.dataAccountSummaryDetail = response.summary
        this.dataAccountContentDetail = response.events.content
        this.queryAccountState.total = response.events.totalElements
        let parsedObj = JSON.parse(JSON.stringify(this.dataAccountContentDetail))
      } catch (e) {
        console.log(e)
      }
    }

    async getDetailSummaryInventory(row): Promise<void> {
      try {
        const querySummary = {
          accountId: row.ownerId,
          itemId: row.itemId
        }
        this.accountId = row.ownerId
        this.itemId = row.itemId

        const response = await api.getSummaryData(querySummary)
        this.dataSummaryInventoryDetail = response
        // this.dataConvertSummaryInventory = _.map(this.dataSummaryInventoryDetail, (val: Record<string, any>, id) => {
        //   return { ...val, type: id, total: val }
        // })
      } catch (e) {
        console.log(e)
      }
    }

    queryAccountState = {
      page: 1,
      limit: 10,
      total: 0
    }

    handleCurrentChangeAccount(page: number): void {
      this.queryAccountState.page = page
      this.getDetailAccountStatement(this.rowData?.row)
      if (this.$route.query.ownerId && this.$route.query.itemId) {
        this.getDetailAccountStatement(this.$route.query)
      }
    }

    handleSizeChangeAccount(size: number): void {
      this.queryAccountState.limit = size
      // this.queryAccountState.page = 1;
      this.getDetailAccountStatement(this.rowData?.row)
      if (this.$route.query.ownerId && this.$route.query.itemId) {
        this.getDetailAccountStatement(this.$route.query)
      }
    }

    async handleRowClick(row: Record<string, any>): Promise<void> {
      if (row) this.rowData = row
      await this.getDetailSummaryInventory(row.row)
      await this.getDetailAccountStatement(row.row)

      this.setOpenPopup({
        popupName: 'popup-inventory-detail',
        isOpen: true
      })
    }

    handleResetQuery(queryPopupDetail): void {
      this.queryAccountState = {
        ...queryPopupDetail,
        page: 1,
        limit: 10
      }
    }

    changeCarousel(event) {
      let element1 = document.querySelector('.el-carousel__arrow--right')
      let element2 = document.querySelector('.el-carousel__arrow--left')
      if (event == 1) {
        //@ts-ignore
        element1.style.opacity = 0.7
        //@ts-ignore
        element2.style.opacity = 1
      } else {
        //@ts-ignore
        element2.style.opacity = 0.7
        //@ts-ignore
        element1.style.opacity = 1
      }
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

    mounted(): void {
      EventBus.$on('start-export', this.handleExport)
      this.changeCarousel(0)
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      EventBus.$on('reload-data-inventory', async function (query, type) {
        await _this.init()
        await _this.getDetailSummaryInventory(query)
        await _this.getDetailAccountStatement(query)
        await _this.getDataTable()
      })
    }

    async handleExport(): Promise<void> {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const params = {
        ...this.query,
        exportFrom: 'NFT_INVENTORY',
        zoneId: timeZone
      }
      try {
        if (this.listDataItem.length > 0) {
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
          const fileName = `nft_inventory_${month + '' + date + year}_${hours + '' + minutes + seconds}`
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

    debounceInit = debounce(() => {
      this.init()
      this.getDataTable()
    }, 300)
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }

  ::v-deep.inventory {
    width: 100%;
    background-color: var(--bc-color-white);
    border-radius: 4px;
    height: 100%;
    padding: 24px 24px 0 24px;

    &-title {
      margin-bottom: 16px;
      @include text(24px, 32px, 600, #0a0b0d);
    }

    .wrap-summaries {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 0 24px;
      justify-content: space-between;

      .summary {
        border: 1px solid var(--bc-table-border);
        border-radius: 8px;
        padding: 16px;

        &-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;

          &__title {
            @include text(16px, 24px, 400, #5b616e);
          }

          .span-icon {
            line-height: 24px;
          }
        }

        &-content {
          margin-bottom: 24px;
          @include text(24px, 24px, 600, #0a0b0d);
        }
      }
    }

    .wrap-filter {
      .kyc-filter {
        padding: 0;
      }
    }

    .wrap-table {
      .inventory-table {
        .owner-name {
          @include text(16px, 24px, 400, #0a0b0d);
        }

        .owner-email {
          @include text(14px, 20px, 400, #5b616e);
        }

        .wrap-item {
          display: flex;
          justify-content: left;
          align-items: center;

          .item-img {
            margin-right: 8px;
            border-radius: 4px;
            object-fit: cover;
          }

          .item-text {
            &__name {
              @include text(16px, 24px, 400, #0a0b0d);
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            &__code {
              @include text(14px, 20px, 400, #5b616e);
            }
          }
        }

        .network-name {
          @include text(16px, 24px, 400, #0a0b0d);
        }

        .network-code {
          @include text(14px, 20px, 400, #5b616e);
        }

        .quantiy {
          @include text(16px, 24px, 400, #0a0b0d);
        }

        .status {
          display: inline-block;
          width: 80px;
          height: 24px;
          border-radius: 4px;

          &__success {
            background-color: var(--bc-bg-accept);
            @include text(12px, 24px, 500, #129961);
          }

          &__dark {
            background-color: var(--bc-bg-neutral);
            @include text(12px, 24px, 500, #5b616e);
          }

          &__info {
            background-color: var(--bc-bg-warning);
            @include text(12px, 24px, 500, #dd7d00);
          }

          &__error {
            background-color: var(--bc-bg-reject);
            @include text(12px, 24px, 500, #cf202f);
          }
        }
      }
    }
  }

  ::v-deep.el-carousel--horizontal {
    overflow-x: clip;
    display: flow-root;

    .el-carousel__container {
      height: 143px;

      .el-carousel__arrow {
        transition: 0s ease-out;
        display: block !important;
        width: 32px;
        height: 32px;
        color: #292d32;
        border: 1px solid #ececec;
        background-color: #fff;
      }

      .el-carousel__arrow i {
        font-size: 16px;
        font-weight: 600;
      }

      .el-carousel__arrow--left {
        top: -32px;
        right: 60px;
        left: calc(100% - 24px - 32px - 24px);
      }

      .el-carousel__arrow--right {
        top: -32px;
        right: 0;
      }

      .el-carousel__item.is-animating {
        transition: transform 0.6s ease-in-out;
      }
    }
  }

  .mb-24 {
    margin-bottom: 24px;
  }
</style>
