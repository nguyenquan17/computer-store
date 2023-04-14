<template>
  <base-popup name="popup-fee-detail" class="popup-fee-detail" width="480px" :isShowFooter="false" :open="handleOpen" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ handleRenderTitleDetail(detailRow.transactionType) }} {{ detailRow.currency }}</span>
    </div>
    <div class="w-100 fluctuating">
      <div class="text-center">
        <div class="icon" :class="checkTypeStatusIcon(detailRow.status)">
          <base-icon :className="'icon-pending'" :icon="checkTypeIcon(detailRow.transactionType, detailRow.status)" size="64" />
        </div>
        <p :class="checkValueFeeDisplay(detailRow.transactionFee)">{{ detailRow.transactionFee | convertAmountDecimal(detailRow.currency) }} {{ detailRow.currency }}</p>
        <p class="usd">~${{ detailRow.transactionFeeToUsd | convertAmountDecimal('USD') }}</p>
      </div>
    </div>
    <div class="transaction-detail">
      <p class="title">{{ $t('transaction.popup.transaction-detail') }}</p>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.transaction-id') }}</p>
        <div class="be-flex align-center">
          <p class="text-detail-2">{{ detailRow.transactionHash | formatTransactionCode(10) }}</p>
          <span v-if="detailRow.transactionHash" style="margin-left: 8px" class="icon-copy" @click="handleCopyTransaction(detailRow.transactionHash)">
            <base-icon icon="icon-copy" size="24" />
          </span>
        </div>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.date') }}</p>
        <p class="text-detail-2">{{ detailRow.transactionMillisecond | formatMMDDYY }}</p>
      </div>
      <div v-if="checkFromType(detailRow.transactionType)" class="item be-flex">
        <p>{{ $t('transaction.detail.from') }}</p>
        <div class="be-flex align-center">
          <base-icon :icon="renderIconCurrency(detailRow.currency)" size="28" />
          <p class="text-detail-2" style="margin-left: 8px">{{ detailRow.fromAddress | formatTransactionCode(10) }}</p>
          <span v-if="detailRow.fromAddress" style="margin-left: 8px" class="icon-copy" @click="handleCopyTransaction(detailRow.fromAddress)">
            <base-icon icon="icon-copy" size="24" />
          </span>
        </div>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.to') }}</p>
        <div class="be-flex align-center">
          <base-icon :icon="renderIconCurrency(detailRow.currency)" size="28" />
          <p class="text-detail-2" style="margin-left: 8px">
            <span v-if="detailRow.toAddress !== undefined && detailRow.toAddress.length > 25">
              {{ detailRow.toAddress | formatTransactionCode(10) }}
            </span>
            <span v-else>
              {{ detailRow.toAddress }}
            </span>
          </p>
          <span v-if="detailRow.toAddress" style="margin-left: 8px" class="icon-copy" @click="handleCopyTransaction(detailRow.toAddress)">
            <base-icon icon="icon-copy" size="24" />
          </span>
        </div>
      </div>
      <div v-if="checkFeeType(detailRow.transactionType)" class="item be-flex">
        <p>{{ $t('transaction.detail.fees') }}</p>
        <div class="be-flex">
          <p v-if="detailRow.transactionFee > 0" class="add">{{ detailRow.transactionFee | convertAmountDecimal(detailRow.currency) }} {{ detailRow.currency }}</p>
          <p v-if="detailRow.transactionFee < 0" class="sub">{{ detailRow.transactionFee | convertAmountDecimal(detailRow.currency) }} {{ detailRow.currency }}</p>
          <p class="convert" style="margin-left: 4px">(~${{ detailRow.transactionFeeToUsd | convertAmountDecimal('USD') }})</p>
        </div>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.status') }}</p>
        <p :class="checkType(detailRow.status)">{{ checkTransactionStatus(detailRow.status) }}</p>
      </div>
    </div>
    <div class="customer-info">
      <p class="title">{{ $t('transaction.popup.customer-info') }}</p>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.full-name') }}</p>
        <p class="text-detail-2">{{ detailRow.fullName }}</p>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.phone-number') }}</p>
        <p v-if="detailRow.phone" class="text-detail-2">({{ detailRow.phoneCode }}) {{ detailRow.phone }}</p>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.email') }}</p>
        <p class="text-detail-2">{{ detailRow.email }}</p>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  @Component({ components: {} })
  export default class FeeDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: {} }) detailRow!: Record<string, any>
    @Prop({ required: true, type: String, default: '' }) tabActiveFilter!: string
    isLoading = false
    tabActive = 0

    async handleOpen(): Promise<void> {
      console.log('open')
    }

    handleClose(): void {
      this.tabActive = 0
      this.setOpenPopup({
        popupName: 'popup-fee-detail',
        isOpen: false
      })
    }

    checkTransactionStatus(status: string): any {
      switch (status) {
        case 'SUCCESS':
          return this.$i18n.t('transaction.table.succsess')
        case 'PENDING':
          return this.$i18n.t('transaction.table.pending')
        case 'PROCESSING':
          return this.$i18n.t('transaction.table.processing')
        case 'REJECTED':
          return this.$i18n.t('transaction.table.rejected')
        case 'LOCKED':
          return this.$i18n.t('transaction.table.locked')
        case 'WAITING':
          return this.$i18n.t('transaction.table.waiting')
        case 'EXPIRED':
          return this.$i18n.t('transaction.table.expired')
        default:
          return this.$i18n.t('transaction.table.failed')
      }
    }

    checkType(type: string): string {
      return type === 'PENDING'
        ? 'status status-pending'
        : type === 'FAILED' || type === 'LOCKED' || type === 'EXPIRED' || type === 'WAITING'
        ? 'status status-error'
        : type === 'PROCESSING'
        ? 'status status-warning'
        : type === 'REJECTED'
        ? 'status status-rejected'
        : 'status status-success'
    }

    checkFeeType(type: string | undefined): boolean {
      if (type) {
        return !(type.indexOf('BONUS') !== -1 || type === 'DEPOSIT')
      } else return false
    }
    checkFromType(type: string | undefined): boolean {
      if (type) {
        return !(type.indexOf('BONUS') !== -1 || type === 'DEPOSIT')
      } else return false
    }

    checkTypeIcon(type: string | undefined, status: string | undefined): string {
      if (type && status) {
        type.toUpperCase()
        status.toUpperCase()
        if (status === 'PENDING' || status === 'PROCESSING') {
          if (type.indexOf('BONUS') !== -1) {
            return `icon-bonus-pending`
          } else {
            return type === 'WITHDRAW' ? 'icon-withdraw-pending' : type === 'TRANSFER' ? 'icon-transfer-pending' : ''
          }
        } else if (type.indexOf('BONUS') !== -1) {
          return `icon-bonus-success`
        } else {
          return type === 'WITHDRAW' ? 'icon-withdraw-success' : type === 'TRANSFER' ? 'icon-transfer-success' : ''
        }
      } else return ''
    }

    renderIconCurrency(type: string | undefined | null): string {
      type = type?.toLowerCase()
      return type === 'lynk'
        ? 'icon-lynk'
        : type === 'clm'
        ? 'icon-clm'
        : type === 'hub'
        ? 'icon-hub'
        : type === 'btc'
        ? 'icon-btc'
        : type === 'eth'
        ? 'icon-eth'
        : type === 'usdt'
        ? 'icon-usdt'
        : type === 'bnb'
        ? 'icon-bnb'
        : type === 'usdc'
        ? 'icon-usdc'
        : type === 'busd'
        ? 'icon-busd'
        : 'icon-lynk'
    }

    checkTypeStatusIcon(type: string): string {
      return type === 'PENDING' ? 'icon-pending' : type === 'FAILED' ? 'icon-failed' : type === 'PROCESSING' ? 'icon-pending' : type === 'REJECTED' ? 'icon-failed' : 'icon-success'
    }

    // checkValueAmountDisplay(value: string | null): string {
    //   if (value) {
    //     if (value.indexOf('+') !== -1) {
    //       return 'add'
    //     } else {
    //       return 'sub'
    //     }
    //   } else return ''
    // }
    checkValueFeeDisplay(value: number | null): string {
      if (value) {
        return value >= 0 ? 'add' : 'sub'
      } else {
        return ''
      }
    }

    handleCopyTransaction(code: string): void {
      let message: any = ''
      const el = document.createElement('input')
      el.value = code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }

    handleRenderTitleDetail(type: string | null | undefined): any {
      if (type) {
        let typeCheck = type.replaceAll('_', ' ')
        switch (typeCheck) {
          case 'WITHDRAW':
            return this.$i18n.t('fee.withdraw')
          case 'TRANSFER':
            return this.$i18n.t('fee.transfer')
          case 'TRADING NFT':
            return this.$i18n.t('fee.trading')
          case 'EXCHANGE':
            return this.$i18n.t('fee.exchange')
        }
        return typeCheck
      } else return ''
    }
  }
</script>

<style scoped lang="scss">
  .popup-fee-detail {
    .popup-content {
      background-color: #f6f8fc;
    }

    .add {
      color: #129961 !important;
    }

    .sub {
      color: #cf202f !important;
    }

    .fluctuating {
      display: inline-flex;
      justify-content: center;
      padding: 24px 0 16px 0;
      background-color: #ffffff;
      margin-bottom: 8px;

      p {
        font-family: Open Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
      }

      .usd {
        font-family: Open Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #5b616e;
      }

      .icon {
        margin-bottom: 12px;
      }
    }

    .icon-success {
      color: #129961;
    }

    .icon-failed {
      color: #cf202f;
    }

    .icon-pending {
      color: #f3f2f1;
    }

    .transaction-detail,
    .customer-info {
      background-color: #ffffff;
      margin-bottom: 8px;
      padding: 24px;

      .title {
        font-family: Open Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: #0a0b0d;
        //margin-bottom: 14px;
      }

      .item {
        justify-content: space-between;
        border-bottom: 1px solid #dbdbdb;
        padding-bottom: 14px;
        padding-top: 14px;
        //margin-bottom: 14px;
        align-items: center;

        p:first-of-type,
        .convert {
          font-family: Open Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
          color: #5b616e;
        }

        .text-detail-2 {
          font-size: 16px !important;
          line-height: 24px !important;
          color: #0a0b0d !important;
        }

        &:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }
      }
    }

    .customer-info {
      margin-bottom: 0;
    }
  }
</style>
