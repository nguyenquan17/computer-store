<template>
  <base-popup name="popup-transaction-nft-detail" class="popup-transaction-detail" width="480px" :isShowFooter="false" :open="handleOpen" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ handleRenderTitleDetail(tabActiveFilter) }}</span>
    </div>
    <div class="w-100 fluctuating">
      <div class="align-center be-flex-column">
        <div class="icon">
          <img :src="detailRow.itemAvatar" alt="" />
        </div>
        <p class="text-overflow-1" style="padding: 0 24px">{{ detailRow.itemName }}</p>
        <p class="usd" v-if="detailRow && detailRow.integrationItemId">#{{ detailRow.integrationItemId }}</p>
        <p class="usd" v-else>#{{ detailRow.itemCode }}</p>
      </div>
    </div>
    <div class="transaction-detail">
      <p class="title">{{ $t('transaction.popup.transaction-detail') }}</p>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.transaction-id') }}</p>
        <div class="be-flex align-center">
          <p class="text-detail-2">{{ detailRow.transactionCode | formatTransactionCode(10) }}</p>
          <span v-if="detailRow.transactionCode" style="margin-left: 8px" class="icon-copy" @click="handleCopyTransaction(detailRow.transactionCode)">
            <base-icon icon="icon-copy" size="24" />
          </span>
        </div>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.date') }}</p>
        <p class="text-detail-2">{{ detailRow.transactionDate | formatMMDDYY }}</p>
      </div>
      <div v-if="checkFromType(detailRow.transactionType)" class="item be-flex">
        <p>{{ $t('transaction.detail.from') }}</p>
        <div class="be-flex align-center">
          <div class="wrap-detail">
            <p class="text-detail-2 text-right">{{ detailRow.fromUsername }}</p>
            <p class="text-body-small text-desc text-overflow-1 text-right" style="margin-left: 8px">{{ detailRow.fromAddress | formatTransactionCode(10) }}</p>
          </div>
          <span v-if="detailRow.fromAddress" style="margin-left: 8px" class="icon-copy" @click="handleCopyTransaction(detailRow.fromAddress)">
            <base-icon icon="icon-copy" size="24" />
          </span>
        </div>
      </div>
      <div v-if="detailRow.toAddress" class="item be-flex">
        <p>{{ $t('transaction.detail.to') }}</p>
        <div class="be-flex align-center">
          <div class="wrap-detail">
            <p class="text-detail-2 text-right">{{ detailRow.toUsername }}</p>
            <p class="text-body-small text-desc text-overflow-1 text-right" style="margin-left: 8px">{{ detailRow.toAddress | formatTransactionCode(10) }}</p>
          </div>
          <span v-if="detailRow.toAddress" style="margin-left: 8px" class="icon-copy" @click="handleCopyTransaction(detailRow.toAddress)">
            <base-icon icon="icon-copy" size="24" />
          </span>
        </div>
      </div>
      <div v-if="tabActiveFilter !== 'BREED' && detailRow.transactionType !== 'DAILY_PROFIT'" class="item be-flex">
        <p>{{ $t('transaction.detail.price') }}</p>
        <div class="be-flex align-center">
          <p class="text-detail-2">
            {{ detailRow.price | convertAmountDecimal(detailRow.currency) }} {{ detailRow.currency }}
            <span class="text-body-small text-desc">(~${{ detailRow.priceUSD | convertAmountDecimal('USD') }})</span>
          </p>
        </div>
      </div>
      <div v-if="detailRow.transactionType !== 'DAILY_PROFIT'" class="item be-flex">
        <p>{{ $t('transaction.detail.quantity') }}</p>
        <div class="be-flex align-center">
          <p class="text-detail-2">
            {{ detailRow.quantity | formatNumber }}
          </p>
        </div>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.amount') }}</p>
        <div class="be-flex align-center">
          <p class="text-detail-2">
            {{ detailRow.amount | convertAmountDecimal(detailRow.currency) }} {{ detailRow.currency }}
            <span class="text-body-small text-desc">(~${{ detailRow.amountUSD | convertAmountDecimal('USD') }})</span>
          </p>
        </div>
      </div>
      <div v-if="detailRow.transactionType !== 'DAILY_PROFIT'" class="item be-flex">
        <p>{{ $t('transaction.detail.service-fee') }}</p>
        <div class="be-flex align-center">
          <p class="text-detail-2">
            <span class="amount-decrease">
              - {{ getFee }}
              <span class="text-body-small text-desc">{{ getFeeUSD }}</span>
            </span>
          </p>
        </div>
      </div>
      <div
        class="item be-flex"
        v-if="tabActiveFilter !== 'DAILY_PROFIT' && tabActiveFilter !== 'BREED' && tabActiveFilter !== 'TRANSFER' && tabActiveFilter !== 'BID' && tabActiveFilter !== 'OFFER'"
      >
        <p>{{ $t('transaction.detail.royal-fee') }}</p>
        <div class="be-flex align-center">
          <p class="text-detail-2">
            <span class="amount-decrease"> - {{ detailRow.royaltyFee | convertAmountDecimal(detailRow.currency) }} {{ detailRow.currency }}</span>
            <span class="text-body-small text-desc"> (~${{ detailRow.royaltyFeeUSD | convertAmountDecimal('USD') }})</span>
          </p>
        </div>
      </div>

      <div class="item be-flex">
        <p>{{ $t('transaction.detail.status') }}</p>
        <p :class="checkType(detailRow.status)">{{ checkTransactionStatus(detailRow.status) }}</p>
      </div>
    </div>
    <div class="customer-info">
      <div class="be-flex align-center jc-space-between">
        <p class="title">{{ $t('transaction.popup.customer-info') }}</p>
        <div v-if="checkPemission('transaction-nft', ['view-all-transaction-nft'])" class="text-sm view" @click="handleView">
          {{ $t('view-inventory') }}
        </div>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.full-name') }}</p>
        <p class="text-detail-2">{{ detailRow.transactionType !== 'DAILY_PROFIT' ? detailRow.fromUserFullName : detailRow.toFullName }}</p>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.phone-number') }}</p>
        <p v-if="detailRow.fromUserPhone" class="text-detail-2">({{ detailRow.fromCountryCode }}) {{ detailRow.fromUserPhone }}</p>
        <p v-if="detailRow.toPhone" class="text-detail-2">({{ detailRow.countryCode }}) {{ detailRow.toPhone }}</p>
      </div>
      <div class="item be-flex">
        <p>{{ $t('transaction.detail.email') }}</p>
        <p class="text-detail-2">{{ detailRow.transactionType !== 'DAILY_PROFIT' ? detailRow.fromUserEmail : detailRow.toUsername }}</p>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { includes } from 'lodash'

  @Component({ components: {} })
  export default class TransactionNFTDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: {} }) detailRow!: Record<string, any>
    @Prop({ required: true, type: String, default: '' }) tabActiveFilter!: string
    isLoading = false
    tabActive = 0

    get getFee(): string {
      if (this.tabActiveFilter) {
        const arr = ['LIST', 'SALE', 'TRANSFER', 'BURN', 'BREED']
        if (includes(arr, this.tabActiveFilter)) {
          if (this.tabActiveFilter === 'BREED') {
            return `${this.$options.filters?.convertAmountDecimal(this.detailRow.sellerServiceFee, this.detailRow.feeCurrency)} ${this.detailRow.feeCurrency} `
          }
          return `${this.$options.filters?.convertAmountDecimal(this.detailRow.sellerServiceFee, this.detailRow.currency)} ${this.detailRow.currency} `
        } else {
          return `${this.$options.filters?.convertAmountDecimal(this.detailRow.buyerServiceFee, this.detailRow.currency)} ${this.detailRow.currency}`
        }
      }
      return ''
    }
    get getFeeUSD(): string {
      if (this.tabActiveFilter) {
        const arr = ['LIST', 'SALE', 'TRANSFER', 'BURN', 'BREED']
        if (includes(arr, this.tabActiveFilter)) {
          return `(~$${this.$options.filters?.convertAmountDecimal(this.detailRow.sellerServiceFeeUSD, 'USD')})`
        } else {
          return `(~$${this.$options.filters?.convertAmountDecimal(this.detailRow.buyerServiceFeeUSD, 'USD')})`
        }
      }
      return ''
    }

    async handleOpen(): Promise<void> {
      console.log('open', this.tabActiveFilter)
    }

    handleClose(): void {
      this.tabActive = 0
      this.setOpenPopup({
        popupName: 'popup-transaction-nft-detail',
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

        default:
          return this.$i18n.t('transaction.table.failed')
      }
    }

    checkType(type: string): string {
      return type === 'PENDING'
        ? 'status status-pending'
        : type === 'FAILED'
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
      if (type === 'DAILY_PROFIT') return false
      return true
    }

    checkTypeIcon(type: string | undefined, status: string | undefined): string {
      if (type && status) {
        type.toUpperCase()
        status.toUpperCase()
        if (status === 'PENDING' || status === 'PROCESSING') {
          if (type.indexOf('BONUS') !== -1) {
            return `icon-bonus-pending`
          } else return `icon-${type.toLowerCase()}-pending`
        } else if (type.indexOf('BONUS') !== -1) {
          return `icon-bonus-success`
        } else return `icon-${type.toLowerCase()}-success`
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

    checkValueAmountDisplay(value: string | null): string {
      if (value) {
        if (value.indexOf('+') !== -1) {
          return 'add'
        } else {
          return 'sub'
        }
      } else return ''
    }

    handleCopyTransaction(row: any): void {
      let message: any = ''
      const el = document.createElement('input')
      el.value = row
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }

    handleRenderTitleDetail(type: string | null | undefined): string {
      switch (type) {
        case 'SALE':
          return this.$i18n.t(`title_sale`) as string
        case 'DAILY_PROFIT':
          return this.$i18n.t(`title_staking`) as string
        case 'BID':
          return this.$i18n.t(`title_bid`) as string
        case 'OFFER':
          return this.$i18n.t(`title_offer`) as string
        case 'TRANSFER':
          return this.$i18n.t(`title_transfer`) as string
        case 'BURN':
          return this.$i18n.t(`title_burn`) as string
        case 'BREED':
          return this.$i18n.t(`title_breed`) as string

        default:
          return this.$i18n.t(`title_list`) as string
      }
    }

    handleView(): void {
      if (this.tabActiveFilter === 'DAILY_PROFIT') {
        this.$router.push({ name: 'MainInventory', query: { ownerId: this.detailRow.accountId, itemId: this.detailRow.itemId } })
      } else {
        this.$router.push({ name: 'MainInventory', query: { ownerId: this.detailRow.fromId, itemId: this.detailRow.itemId } })
      }
      this.setOpenPopup({
        popupName: 'popup-transaction-nft-detail',
        isOpen: false
      })
    }
  }
</script>

<style scoped lang="scss">
  .popup-transaction-detail {
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
        width: 64px;
        height: 64px;
        img {
          border-radius: 8px;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
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

        .wrap-detail {
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 282px;
          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

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
      .view {
        padding: 8px 20px;
        border: 1px solid #89909e;
        color: #3b3a39;
        border-radius: 6px;
        cursor: pointer;
      }
    }

    .customer-info {
      margin-bottom: 0;
    }
  }
  .icon-copy {
    &:hover {
      cursor: pointer;
    }
  }
</style>
