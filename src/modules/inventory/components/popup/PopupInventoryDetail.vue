<template>
  <base-popup name="popup-inventory-detail" class="popup-inventory-detail" width="1040px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ popup_data.header.title }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <div class="content-top mb-24">
        <div class="content-top__divided">
          <img :src="dataAccountSummaryDetail.itemThumb" class="content-top__divided_img" />
          <div class="content-top__divided_text">
            <p class="name">{{ dataAccountSummaryDetail.itemName }}</p>
            <p class="code" v-if="dataAccountSummaryDetail && dataAccountSummaryDetail.integrationItemId">#{{ dataAccountSummaryDetail.integrationItemId }}</p>
            <p class="code" v-else>#{{ dataAccountSummaryDetail.itemCode }}</p>
          </div>
        </div>
        <div class="content-top__divided">
          <img :src="dataAccountSummaryDetail.accountAvatar" class="content-top__divided_img ml-24 circle" />
          <div class="content-top__divided_text">
            <p class="name">{{ dataAccountSummaryDetail.fullName }}</p>
            <p v-if="dataAccountSummaryDetail.accountType === 'INTERNAL'" class="code">
              {{ dataAccountSummaryDetail.email }} | ({{ dataAccountSummaryDetail.countryCode }})
              {{ dataAccountSummaryDetail.phone }}
            </p>
            <p v-if="dataAccountSummaryDetail.accountType === 'EXTERNAL'" class="code">
              {{ dataAccountSummaryDetail.accountAddress | formatTransactionCode }}
            </p>
          </div>
        </div>
      </div>
      <div class="content-mid box-shadow mb-24">
        <p class="content-mid__title">{{ $t('inventory.inventory-detail.inventory') }}</p>
        <table class="inventory-table">
          <tr class="inventory-table__label">
            <th>{{ $t('inventory.inventory-detail.type') }}</th>
            <th>{{ $t('inventory.inventory-detail.quantity') }}</th>
            <th>{{ $t('inventory.inventory-detail.action') }}</th>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.total') }}</td>
            <td>{{ dataSummaryInventoryDetail.totalNft | formatNumber }}</td>
            <td></td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.available') }}</td>
            <td>{{ dataSummaryInventoryDetail.totalAvailable | formatNumber }}</td>
            <td></td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.lock') }}</td>
            <td>{{ dataSummaryInventoryDetail.totalLock | formatNumber }}</td>
            <td>
              <span
                class="btn-action"
                v-if="dataSummaryInventoryDetail.totalLock > 0 && checkPemission('inventory', ['all'])"
                @click="handleUnLock(dataSummaryInventoryDetail.totalLock)"
              >
                {{ $t('inventory.inventory-detail.un-lock') }}
              </span>
              <span
                class="btn-action"
                v-if="dataSummaryInventoryDetail.totalLock > 0 && checkPemission('inventory', ['all'])"
                @click="handleBurn(dataSummaryInventoryDetail.totalLock)"
              >
                {{ $t('inventory.inventory-detail.burn') }}
              </span>
            </td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.on-sale') }}</td>
            <td>{{ dataSummaryInventoryDetail.totalOnSale | formatNumber }}</td>
            <td>
              <span
                class="btn-action"
                v-if="dataSummaryInventoryDetail.totalOnSale > 0 && checkPemission('inventory', ['all'])"
                @click="handleRemoveSale(dataSummaryInventoryDetail.totalOnSale)"
              >
                {{ $t('inventory.inventory-detail.remove-sale') }}
              </span>
            </td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.off-market') }}</td>
            <td>{{ dataSummaryInventoryDetail.totalOffMarket | formatNumber }}</td>
            <td>
              <span
                class="btn-action"
                v-if="dataSummaryInventoryDetail.totalOffMarket > 0 && checkPemission('inventory', ['all'])"
                @click="handleLock(dataSummaryInventoryDetail.totalOffMarket)"
              >
                {{ $t('inventory.inventory-detail.lock-title') }}
              </span>
              <span class="btn-action d-none" v-if="dataSummaryInventoryDetail.totalOffMarket > 0">
                {{ $t('inventory.inventory-detail.put-on-sale') }}
              </span>
            </td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.burn') }}</td>
            <td>{{ dataSummaryInventoryDetail.totalBurn | formatNumber }}</td>
            <td></td>
          </tr>
        </table>
      </div>
      <div class="content-bot box-shadow mb-24">
        <p class="content-bot__title">{{ $t('inventory.inventory-detail.account-statement') }}</p>
        <div class="opening-quantity">
          <span class="opening-quantity__title">{{ $t('inventory.inventory-detail.opening-quantity') }}</span>
          <span class="opening-quantity__number">{{ dataAccountSummaryDetail.openingQuantity }}</span>
        </div>
        <base-table
          :data="dataAccountContentDetail"
          :showPagination="true"
          :paginationInfo="getPaginationInfo"
          :table="query"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
          :isLoading="isLoading"
          :showSummary="true"
          :summaryMethod="summaryMethod"
          class="table-bot"
          @rowClick="handleRowClick($event)"
        >
          <el-table-column :label="$t('inventory.inventory-detail.event-type')" align="left" width="200">
            <template slot-scope="scope">
              <p class="event-type__title">
                {{ scope.row.transactionTypeConvert.toLowerCase().charAt(0).toUpperCase() + scope.row.transactionTypeConvert.slice(1).toLowerCase() }}
              </p>
              <p class="event-type__date">{{ scope.row.transactionDate | formatMMDDYY }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inventory.inventory-detail.increase')" align="right" width="186">
            <template slot-scope="scope">
              <p class="increase" v-if="scope.row.increaseQuantity">+{{ scope.row.increaseQuantity | formatNumber }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inventory.inventory-detail.decrease')" align="right" width="186">
            <template slot-scope="scope">
              <p v-if="scope.row.decreaseQuantity" class="decrease">{{ scope.row.decreaseQuantity | formatNumber }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inventory.inventory-detail.quantity')" align="right" width="186">
            <template slot-scope="scope">
              <p class="quantity">{{ scope.row.activityQuantity | formatNumber }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('inventory.inventory-detail.status')" align="center">
            <template slot-scope="scope">
              <span class="status" v-if="scope.row.activityStatus" :class="getClassStatus(scope.row.activityStatus)">{{
                scope.row.activityStatus.toLowerCase().charAt(0).toUpperCase() + scope.row.activityStatus.slice(1).toLowerCase()
              }}</span>
            </template>
          </el-table-column>
        </base-table>
        <div class="ending-quantity">
          <span class="ending-quantity__title">{{ $t('inventory.inventory-detail.ending-quantity') }}</span>
          <span class="ending-quantity__number">{{ dataAccountSummaryDetail.endingQuantity | formatNumber }}</span>
        </div>
      </div>
    </div>
    <popup-inventory-detail-type ref="detail-type" :inventory-detail-type="inventoryDetailType"></popup-inventory-detail-type>
    <popup-burn :detail="dataAccountSummaryDetail" :number-burn="numberBurn" :itemId="itemId" :accountId="accountId"></popup-burn>
    <popup-remove-for-sale :detail="dataAccountSummaryDetail" :number-remove-sale="numberRemoveSale" :itemId="itemId" :accountId="accountId"></popup-remove-for-sale>
    <popup-lock :detail="dataAccountSummaryDetail" :number-lock="numberLock" :itemId="itemId" :accountId="accountId"></popup-lock>
    <popup-un-lock :detail="dataAccountSummaryDetail" :number-un-lock="numberUnLock" :itemId="itemId" :accountId="accountId"></popup-un-lock>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupInventoryDetailType from './PopupInventoryDetailType.vue'
  import PopupBurn from './PopupBurn.vue'
  import PopupRemoveForSale from './PopupRemoveForSale.vue'
  import PopupLock from './PopupLock.vue'
  import PopupUnLock from './PopupUnLock.vue'
  import BaseTable from '@/components/base/table/BaseTable.vue'
  import forEach from 'lodash/forEach'
  import getRepository from '@/services'
  import { InventoryRepository } from '@/services/repositories/inventory'
  import { namespace } from 'vuex-class'

  const api: InventoryRepository = getRepository('inventory')
  const bcInventory = namespace('bcInventory')

  @Component({ components: { BaseTable, PopupInventoryDetailType, PopupBurn, PopupRemoveForSale, PopupLock, PopupUnLock } })
  export default class PopupInventoryDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    @Prop({ required: true, type: Object, default: {} }) dataAccountSummaryDetail!: Record<string, any>
    @Prop({ required: true, type: Array, default: [] }) dataAccountContentDetail!: Array<Record<string, any>>
    @Prop({ required: true, type: Object, default: {} }) dataSummaryInventoryDetail!: Record<string, any>
    @Prop({ required: true, type: [String, Number], default: '' }) itemId!: string | number
    @Prop({ required: true, type: [String, Number], default: '' }) accountId!: string | number
    @bcInventory.Mutation('SET_TYPE_POPUP') setTypePopup!: (data: string) => void
    isLoading = false
    inventoryDetailType = {}
    numberBurn = 0
    numberRemoveSale = 0
    numberLock = 0
    numberUnLock = 0

    error = {
      quantity: ''
    }

    popup_data = {
      header: {
        title: this.$i18n.t('inventory.inventory-detail.title')
      },
      content: {},
      footer: {
        btnReset: this.$i18n.t('popup-fee.reset'),
        btnContinues: this.$i18n.t('button.apply')
      }
    }

    async handleRowClick(row: Record<string, any>): Promise<void> {
      this.inventoryDetailType = {}
      setTimeout(() => {
        if (row.row.transactionType == 'BURN') {
          if (row) this.inventoryDetailType = row.row
          this.setOpenPopup({
            popupName: 'popup-inventory-detail-type',
            isOpen: true
          })
        }
      }, 200)
    }

    handleBurn(number): void {
      this.setTypePopup('burn')
      this.numberBurn = number
      this.setOpenPopup({
        popupName: 'popup-burn',
        isOpen: true
      })
    }

    handleLock(number): void {
      this.setTypePopup('lock')
      this.numberLock = number
      this.setOpenPopup({
        popupName: 'popup-lock',
        isOpen: true
      })
    }

    handleUnLock(number): void {
      this.numberUnLock = number
      this.setTypePopup('un-lock')
      this.setOpenPopup({
        popupName: 'popup-un-lock',
        isOpen: true
      })
    }

    handleRemoveSale(number): void {
      this.setTypePopup('remove')
      this.numberRemoveSale = number
      this.setOpenPopup({
        popupName: 'popup-remove-for-sale',
        isOpen: true
      })
    }

    get getPaginationInfo(): any {
      return this.$t('paging.events')
    }

    getClassStatus(input: string): string {
      let rs = ''
      switch (input) {
        case 'SUCCESS':
          rs = 'status__success'
          break
        case 'PENDING':
          rs = 'status__pending'
          break
        case 'PROCESSING':
          rs = 'status__processing'
      }
      return rs
    }

    query1: any = {}

    handleCurrentChange(page: number): void {
      this.query1 = this.query
      this.query1.page = page
      this.$emit('page', page)
    }

    handleSizeChange(limit: number): void {
      this.query1 = this.query
      this.query1.limit = limit
      this.query.page = 1
      this.$emit('size', limit)
    }

    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-inventory-detail',
        isOpen: false
      })
      if (this.$route.query) {
        this.$router.replace({ query: undefined })
      }
      this.query1 = {
        page: 1,
        limit: 10,
        total: 0
      }
      this.$emit('resetQuery', this.query1)
    }

    summaryMethod(params: { columns: any; data: Record<string, any>[] }) {
      const { columns, data } = params
      let sums: any = []
      let totalIncrease: any = 0
      let totalDecrease: any = 0
      // forEach(data, (item) => {
      //     totalIncrease = totalIncrease + (item.increaseQuantity !== '' ? +item.increaseQuantity : 0)
      //     totalDecrease = totalDecrease + (item.decreaseQuantity !== '' ? +item.decreaseQuantity : 0)
      // })
      if (this.dataAccountSummaryDetail.totalIncreaseQuantity > 0) {
        totalIncrease = '+' + this.dataAccountSummaryDetail.totalIncreaseQuantity
      } else {
        totalIncrease = this.dataAccountSummaryDetail.totalIncreaseQuantity
      }

      totalDecrease = '' + this.dataAccountSummaryDetail.totalDecreaseQuantity
      forEach(columns, (column, index: number) => {
        if (index < 1) {
          sums[index] = this.$i18n.t('inventory.inventory-detail.total-account')
          return
        }
        if (index === 1) {
          sums[index] = totalIncrease
          return
        }
        if (index === 2) {
          sums[index] = totalDecrease
          return
        }
        // const a = this.round[column.property] || 0

        // //@ts-ignore
        // sums[index] = `${includes(column.property, 'Percent') ? (a * 1000) / 10 + '%' : this.$options.filters.convertAmountDecimal(a, this.coinMain) + ' ' + this.coinMain}`
      })
      return sums
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

  ::v-deep.base-table .cell {
    font-weight: 600;
  }

  ::v-deep.popup-inventory-detail {
    .popup-content {
      background-color: #f6f8fc;

      .content {
        &-top {
          width: 100%;
          height: auto;
          display: flex;
          justify-content: center;
          align-items: center;

          &__divided {
            width: 50%;
            height: auto;
            display: flex;
            justify-content: left;

            &:first-child {
              border-right: 1px solid #dbdbdb;
            }

            &_img {
              width: 48px;
              height: 48px;
              border-radius: 4px;
              margin-right: 24px;
              border: 1px solid #dbdbdb;
              object-fit: cover;
            }

            &_text {
              .name {
                @include text(18px, 24px, 600, #0a0b0d);
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }

        &-mid {
          width: 100%;
          height: auto;
          padding: 24px;
          box-sizing: border-box;
          background-color: #ffffff;

          &__title {
            @include text(24px, 32px, 600, #0a0b0d);
            margin-bottom: 16px;
          }

          .inventory-table {
            &__label {
              th {
                padding: 12px 10px;
                @include text(16px, 24px, 600, #0a0b0d);
                border-bottom: 1px solid #ded0ce;
              }

              th:nth-child(1) {
                text-align: left;
                width: 300px;
              }

              th:nth-child(2) {
                width: 350px;
              }

              th:nth-child(3) {
                text-align: right;
                width: 292px;
                visibility: hidden;
              }
            }

            &__content {
              .btn-action {
                @include text(14px, 16px, 400, #3b3a39);
                padding: 8px 28px;
                border: 1px solid #dbdbdb;
                border-radius: 6px;
                margin-left: 16px;
                cursor: pointer;
                box-sizing: border-box;
                height: 32px;

                &:hover {
                  border: 1px solid #c2bfbf;
                }
              }

              td {
                height: 24px;
                padding: 20px 10px;
                @include text(16px, 24px, 400, #0a0b0d);
                border-bottom: 1px solid #ded0ce;
              }

              td:nth-child(2) {
                text-align: center;
              }

              td:nth-child(3) {
                text-align: right;
              }
            }
          }

          .table-mid {
            .el-table__row {
              height: 64px;
            }

            .type-name,
            .quantity {
              @include text(16px, 24px, 400, #0a0b0d);
            }

            .wrap-button {
              display: flex;
              justify-content: right;
              align-items: center;

              .btn-action {
                display: inline-block;
                width: auto;
                padding: 8px 27.5px;
                @include text(14px, 16px, 400, #3b3a39);
                text-align: center;
                border: 1px solid #dbdbdb;
                border-radius: 6px;

                &:not(:last-child) {
                  margin-right: 16px;
                }
              }
            }
          }
        }

        &-bot {
          padding: 24px;
          background-color: var(--bc-color-white);

          &__title {
            @include text(24px, 32px, 600, #0a0b0d);
            margin-bottom: 16px;
          }

          .opening-quantity,
          .ending-quantity {
            width: 100%;
            height: 48px;
            background-color: var(--bc-color-grey20);
            padding: 0 10px;
            box-sizing: border-box;

            &__title,
            &__number {
              @include text(16px, 48px, 600, #0a0b0d);
            }
          }

          .table-bot {
            .event-type__title {
              @include text(16px, 24px, 400, #0a0b0d);
            }

            .event-type__date {
              @include text(14px, 20px, 400, #5b616e);
            }

            .increase {
              @include text(16px, 24px, 400, #129961);
            }

            .decrease {
              @include text(16px, 24px, 400, #cf202f);
            }

            .quantity {
              @include text(16px, 24px, 400, #0a0b0d);
            }

            .status {
              display: inline-block;
              width: 80px;
              text-align: center;
              padding: 4px;
              border-radius: 4px;

              &__success {
                background-color: var(--bc-bg-success);
                @include text(12px, 16px, 500, #129961);
              }

              &__pending {
                background-color: var(--bc-bg-pending);
                @include text(12px, 16px, 500, #dd7d00);
              }

              &__processing {
                background-color: var(--bc-bg-pending);
                @include text(12px, 16px, 500, #dd7d00);
              }
            }
          }

          .ending-quantity {
            background-color: var(--bc-theme-primary);
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
              display: block;
              color: var(--bc-color-white);
            }

            &__number {
              width: 186px;
              margin-right: 172px;
              text-align: right;
              padding-right: 16px;
            }
          }

          .opening-quantity {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
              display: block;
            }

            &__number {
              width: 186px;
              margin-right: 172px;
              text-align: right;
              padding-right: 16px;
            }
          }
        }
      }
    }

    .ml-24 {
      margin-left: 24px;
    }

    .mb-24 {
      margin-bottom: 24px;
    }

    .circle {
      border-radius: 50% !important;
    }

    .code {
      color: #5b616e;
    }
  }
</style>
