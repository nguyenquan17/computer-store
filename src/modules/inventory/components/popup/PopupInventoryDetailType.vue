<template>
  <base-popup name="popup-inventory-detail-type" class="popup-inventory-detail-type" width="480px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ titlePopup }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <div class="content-top">
        <div class="content-top__divided">
          <img :src="detail.itemAvatar" class="content-top__divided_img" />
          <div class="content-top__divided_text">
            <p class="name">{{ detail.itemName }}</p>
            <p class="code" v-if="detail && detail.integrationItemId">#{{ detail.integrationItemId }}</p>
            <p class="code" v-else>#{{ detail.itemCode }}</p>
          </div>
        </div>
      </div>
      <div class="content-mid box-shadow">
        <p class="content-mid__title">{{ $t('inventory.inventory-detail.inventory-detail-type.transaction-detail') }}</p>
        <table class="inventory-table">
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.inventory-detail-type.date') }}</td>
            <td>{{ detail.transactionDate | formatDateHourMs }}</td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.inventory-detail-type.quantity') }}</td>
            <td>{{ detail.transactionQuantity | convertAmount8digit }}</td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.inventory-detail-type.owner-name') }}</td>
            <td>{{ detail.ownerFullName }}</td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.inventory-detail-type.status') }}</td>
            <td>
              <span class="status" v-if="inventoryDetailType.activityStatus" :class="getClassStatus(detail.transactionStatus)">
                {{ detail.transactionStatus.toLowerCase().charAt(0).toUpperCase() + detail.transactionStatus.slice(1).toLowerCase() }}</span
              >
            </td>
          </tr>
        </table>
      </div>
      <div class="content-mid box-shadow">
        <p class="content-mid__title">{{ $t('inventory.inventory-detail.inventory-detail-type.employee') }}</p>
        <table class="inventory-table">
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.inventory-detail-type.fullname') }}</td>
            <td>{{ detail.employeeFullName }}</td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.inventory-detail-type.email') }}</td>
            <td>{{ detail.employeeEmail }}</td>
          </tr>
          <tr class="inventory-table__content">
            <td>{{ $t('inventory.inventory-detail.inventory-detail-type.role') }}</td>
            <td>{{ detail.employeeRoles }}</td>
          </tr>
        </table>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import BaseTable from '@/components/base/table/BaseTable.vue'
  import { InventoryRepository } from '@/services/repositories/inventory'
  import getRepository from '@/services'
  const api: InventoryRepository = getRepository('inventory')

  @Component({ components: { BaseTable } })
  export default class PopupInventoryDetailType extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: {} }) inventoryDetailType!: Record<string, any>
    isLoading = false
    detail: Record<string, any> = {}

    @Watch('inventoryDetailType', { immediate: true, deep: true }) watchId() {
      this.getDetailRecord()
    }

    async getDetailRecord() {
      if (this.inventoryDetailType.activityId) {
        this.detail = await api.getDetailActivity(this.inventoryDetailType.activityId)
      }
    }

    get titlePopup() {
      let key = 'inventory.inventory-detail.inventory-detail-type.' + this.inventoryDetailType.transactionType?.toLowerCase()
      return this.$i18n.t(key)
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

    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-inventory-detail-type',
        isOpen: false
      })
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

  ::v-deep.popup-inventory-detail-type {
    .el-dialog__footer {
      display: none;
    }
    .popup-content {
      padding: 0;
      background-color: #f6f8fc;
      .content {
        &-top {
          background-color: #ffffff;
          justify-content: center;
          align-items: center;
          padding: 24px 24px 16px 24px;
          box-sizing: content-box;
          &__divided {
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;
            justify-items: center;
            &_img {
              width: 64px;
              height: 64px;
              border-radius: 8px;
              object-fit: cover;
              margin-bottom: 12px;
            }
            &_text {
              text-align: center;
              .name {
                @include text(20px, 24px, 600, #0a0b0d);
                display: block;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 4px;
              }
              .code {
                @include text(14px, 20px, 400, #5b616e);
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
          margin-top: 8px;
          &__title {
            @include text(16px, 24px, 600, #0a0b0d);
            margin-bottom: 16px;
          }
          .inventory-table {
            width: 100%;
            &__content {
              td {
                height: 30px;
                padding: 12px 0px;
                @include text(16px, 24px, 400, #0a0b0d);
                border-bottom: 1px solid #dbdbdb;
              }
              td:nth-child(1) {
                @include text(14px, 30px, 400, #5b616e);
                text-align: left;
              }
              td:nth-child(2) {
                text-align: right;
              }
              &:last-child {
                td {
                  border-bottom: none;
                  padding-bottom: 0px;
                  .status {
                    display: inline-block;
                    width: 80px;
                    text-align: center;
                    padding: 4px;
                    border-radius: 4px;
                    &__success {
                      background-color: var(--bc-bg-success);
                      @include text(12px, 16px, 400, #129961);
                    }
                    &__pending {
                      background-color: var(--bc-bg-pending);
                      @include text(12px, 16px, 400, #dd7d00);
                    }
                    &__processing {
                      background-color: var(--bc-bg-pending);
                      @include text(12px, 16px, 400, #dd7d00);
                    }
                  }
                }
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
