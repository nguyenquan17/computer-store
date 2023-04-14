<template>
  <base-popup name="popup-filter-transaction" class="popup-filter-transaction" width="600px" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('transaction.popup.title-filter') }}</span>
    </div>
    <div class="content">
      <el-form>
        <div v-if="tabActiveFilter === 'SALE'" class="referralCode">
          <el-form-item class="be-flex-item" :label="$t('label.referral_code')">
            <el-input
              :disabled="!checkPemission('transaction-nft', ['view-all-transaction-nft'])"
              v-model="queryReferral.referralCode"
              clearable
              :placeholder="$t('label.referral_code')"
            />
            <!-- <el-select
              v-model="queryReferral.referralCode"
              class="w-100 refferal__popup"
              popper-class="popper-refferal-code"
              filterable
              remote
              clearable
              reserve-keyword
              :placeholder="$t('placeholder.referral_code')"
            >
              <div v-infinite-scroll="loadMoreAccountTo" infinite-scroll-delay="500">
                <el-option v-for="item in listAccountPopupReferral" :key="item.id" :label="item.referralCode" :value="item.referralCode">
                  <template>
                    <div class="account">
                      <p class="text-base text-regular account-name" style="color: #0a0b0d">{{ item.referralCode }}</p>
                      <div class="text-xs text-regular text-desc be-flex desc">
                        <p class="line">{{ item.toFullName }} |</p>
                        <p v-if="coinMain === 'HUB' || item.accountType === 'INTERNAL'" class="email-account">{{ item.toUsername | formatTransactionCode(5) }}</p>
                        <p v-else class="email-account">{{ item.toUsername | formatTransactionCode(10) }}</p>
                      </div>
                    </div>
                  </template>
                </el-option>
              </div>
            </el-select> -->
          </el-form-item>
        </div>
        <div class="be-flex jc-space-between row">
          <el-form-item class="be-flex-item mr-40 form-item-line" :label="$t('label.trans-date')">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              value-format="timestamp"
              :placeholder="$t('label.from-date')"
              v-model="filter.fromDate"
              type="date"
              :picker-options="pickerOption2"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item class="be-flex-item hide-label" label="1">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              :placeholder="$t('label.to-date')"
              value-format="timestamp"
              v-model="filter.toDate"
              type="date"
              :picker-options="pickerOption"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-if="tabActiveFilter !== 'DAILY_PROFIT'" class="transaction-amount-form">
          <div class="be-flex jc-space-between row">
            <el-form-item class="be-flex-item mr-40 form-item-line" :label="$t('label.from')">
              <el-select
                v-model="filter.fromAccount"
                class="w-100"
                popper-class="popper-trans-account"
                filterable
                remote
                clearable
                reserve-keyword
                :placeholder="$t('placeholder.from')"
                :remote-method="handleFindCustomerFrom"
                @clear="handleClearCustomerFrom"
              >
                <div v-infinite-scroll="loadMoreAccountFrom" infinite-scroll-delay="500">
                  <el-option v-for="item in listAccountFrom" :key="item.id" :label="item.fullName" :value="item.id">
                    <template>
                      <div class="account">
                        <p class="text-base account-name">{{ item.fullName }}</p>
                        <div class="text-xs text-desc be-flex desc">
                          <p class="line" v-if="item.accountType === 'INTERNAL'">
                            {{ item.accountName }}
                          </p>
                          <p v-if="item.accountType === 'INTERNAL'">{{ item.address | formatTransactionCode(5) }}</p>
                          <p v-else>{{ item.address | formatTransactionCode(10) }}</p>
                        </div>
                      </div>
                    </template>
                  </el-option>
                </div>
              </el-select>
            </el-form-item>

            <el-form-item class="be-flex-item" :label="$t('label.to')">
              <el-select
                v-model="filter.toAccount"
                class="w-100"
                popper-class="popper-trans-account"
                filterable
                remote
                clearable
                reserve-keyword
                :placeholder="$t('placeholder.to')"
                :remote-method="handleFindCustomerTo"
                @clear="handleClearCustomerTo"
              >
                <div v-infinite-scroll="loadMoreAccountTo" infinite-scroll-delay="500">
                  <el-option v-for="item in listAccountTo" :key="item.id" :label="item.fullName" :value="item.id">
                    <template>
                      <div class="account">
                        <p class="text-base account-name">{{ item.fullName }}</p>
                        <div class="text-xs text-desc be-flex desc">
                          <p class="line" v-if="item.accountType === 'INTERNAL'">
                            {{ item.accountName }}
                          </p>
                          <p v-if="item.accountType === 'INTERNAL'">{{ item.address | formatTransactionCode(5) }}</p>
                          <p v-else>{{ item.address | formatTransactionCode(10) }}</p>
                        </div>
                      </div>
                    </template>
                  </el-option>
                </div>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="transaction-amount-form" v-if="tabActiveFilter !== 'TRANSFER'">
          <div class="be-flex jc-space-between row">
            <el-form-item class="be-flex-item mr-40 form-item-line" :class="errorType && 'error-amount-border-popup-transaction'" :label="$t('label.trans-amount')">
              <el-input
                v-model="filter.fromAmount"
                :placeholder="$t('placeholder.from-amount')"
                @keypress.native="onlyNumber($event, 'fromAmount')"
                @keyup.native="numberFormat($event)"
                @blur="clickOutSide"
              >
                <div class="prefix" slot="prefix">$</div>
              </el-input>
            </el-form-item>

            <el-form-item class="be-flex-item hide-label" label="1" :class="errorType && 'error-amount-border-popup-transaction'">
              <el-input
                v-model="filter.toAmount"
                :placeholder="$t('placeholder.to-amount')"
                @keypress.native="onlyNumber($event, 'toAmount')"
                @keyup.native="numberFormat($event)"
                @blur="clickOutSide"
              >
                <div class="prefix" slot="prefix">$</div>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="errorType" class="error-amount">
            <p>{{ $t('notify.amount-invalid') }}</p>
          </div>
        </div>
        <div v-if="tabActiveFilter !== 'DAILY_PROFIT'" class="transaction-amount-form">
          <div class="be-flex jc-space-between row">
            <el-form-item class="be-flex-item mr-40 form-item-line" :class="errorTypeQuantity && 'error-amount-border-popup-transaction'" :label="$t('label.quantity')">
              <el-input
                v-model="filter.fromQuantity"
                :placeholder="$t('placeholder.from-quantity')"
                @keypress.native="onlyNumber($event, 'fromAmount')"
                @keyup.native="numberFormat($event)"
                @blur="clickOutSideQuantity"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="be-flex-item hide-label" label="1" :class="errorTypeQuantity && 'error-amount-border-popup-transaction'">
              <el-input
                v-model="filter.toQuantity"
                :placeholder="$t('placeholder.to-quantity')"
                @keypress.native="onlyNumber($event, 'toAmount')"
                @keyup.native="numberFormat($event)"
                @blur="clickOutSideQuantity"
              >
              </el-input>
            </el-form-item>
          </div>
          <div v-if="errorTypeQuantity" class="error-amount">
            <p>{{ $t('notify.quantity-invalid') }}</p>
          </div>
        </div>
        <div class="be-flex jc-space-between">
          <el-form-item :label="$t('label.status')" class="be-flex-item">
            <el-select v-model="filter.transactionStatus" clearable class="w-100">
              <el-option v-for="status in listStatus" :key="status.id" :value="status.value" :label="status.label">
                <template>
                  <span class="d-ib">{{ status.label }}</span>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="footer">
      <button class="btn-default mr-15 text-regular btn-h40" @click="handleReset">{{ $t('button.reset') }}</button>
      <!-- <button class="btn-default-bg text-regular btn-h40"  disabled  @click="handleConfirm">{{ $t('button.continue') }}</button> -->
      <button class="btn-default-bg text-regular btn-h40" @click="handleApply" :disabled="errorType || errorTypeQuantity">
        {{ $t('button.continue') }}
      </button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import includes from 'lodash/includes'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  import getRepository from '@/services/index'
  import { NftRepository } from '@/services/repositories/nft'

  import trim from 'lodash/trim'

  const apiNft: NftRepository = getRepository('nft')

  const beBase = namespace('beBase')

  @Component
  export default class PopupFilterTransactionNft extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String, default: '' }) tabActiveFilter!: string
    @Prop({ required: true, type: String, default: 'customer' }) type!: string
    @Prop({ required: false, type: Object }) queryReferral!: Record<string, any>
    @Prop({ required: false, type: Array }) listAccountPopupReferral!: Array<Record<string, any>>[]

    listAccountFrom: Array<Record<string, any>> = []
    listAccountTo: Array<Record<string, any>> = []
    listAccountClone: Array<Record<string, any>> = []

    filter: Record<string, any> = {
      fromDate: null,
      toDate: null,
      fromAmount: '',
      toAmount: '',
      fromQuantity: '',
      toQuantity: '',
      fromAccount: '',
      transactionStatus: 'SUCCESS',
      transactionType: ''
    }

    queryFrom: Record<string, any> = {
      page: 1,
      limit: 20,
      search: ''
    }
    queryTo: Record<string, any> = {
      page: 1,
      limit: 20,
      search: ''
    }

    get pickerOption(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'from-to')
        }
      }
    }

    get pickerOption2(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'to-from')
        }
      }
    }

    disableTime(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.filter.fromDate) {
          return time.getTime() / 1000 < new Date(this.filter.fromDate).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.filter.toDate) {
          return time.getTime() / 1000 > new Date(this.filter.toDate).getTime() / 1000
        }
      }
    }

    clickOutSide() {
      this.checkValid()
    }
    clickOutSideQuantity() {
      this.checkValidQuantity()
    }

    listStatus: Array<Record<string, any>> = [
      {
        id: 0,
        label: this.$t('filter_pending'),
        value: 'PENDING'
      },
      {
        id: 1,
        label: this.$t('filter_processing'),
        value: 'PROCESSING'
      },
      {
        id: 2,
        label: this.$t('filter_success'),
        value: 'SUCCESS'
      },
      {
        id: 3,
        label: this.$t('filter_failed'),
        value: 'FAILED'
      }
      // {
      //   id: 4,
      //   label: 'Rejected',
      //   value: 'REJECTED'
      // }
    ]

    errorType = false
    errorTypeQuantity = false

    async handleOpen(): Promise<void> {
      this.queryFrom = {
        page: 1,
        limit: 20,
        search: ''
      }
      this.queryTo = {
        page: 1,
        limit: 20,
        search: ''
      }
      const result = await apiNft.getListAccount({ page: 1, limit: 20 })
      this.listAccountFrom = [...result]
      this.listAccountTo = [...result]
      this.listAccountClone = [...result]
    }

    handleFindCustomerFrom(query: string): void {
      if (query !== '') {
        this.queryFrom.search = trim(query)
        this.queryFrom.limit = 20
        this.queryFrom.page = 1

        apiNft.getListAccount(this.queryFrom).then(res => {
          this.listAccountFrom = res
        })
      } else {
        this.queryFrom.search = ''
        this.queryFrom.limit = 20
        this.queryFrom.page = 1

        this.listAccountFrom = [...this.listAccountClone]
      }
    }

    async loadMoreAccountFrom(): Promise<void> {
      this.queryFrom.page += 1
      const rs = await apiNft.getListAccount(this.queryFrom)
      this.listAccountFrom = [...this.listAccountFrom, ...rs]
    }

    async loadMoreAccountTo(): Promise<void> {
      this.queryTo.page += 1
      const rs = await apiNft.getListAccount(this.queryTo)
      this.listAccountTo = [...this.listAccountTo, ...rs]
    }
    handleFindCustomerTo(query: string): void {
      if (query !== '') {
        this.queryTo.search = trim(query)
        this.queryTo.limit = 20
        this.queryTo.page = 1

        apiNft.getListAccount(this.queryTo).then(res => {
          this.listAccountTo = res
        })
      } else {
        this.queryTo.search = ''
        this.queryTo.limit = 20
        this.queryTo.page = 1
        this.listAccountTo = [...this.listAccountClone]
      }
    }

    handleClearCustomerFrom(): void {
      this.queryFrom.limit = 20
      this.queryFrom.page = 1
      this.queryFrom.search = ''
      this.listAccountFrom = [...this.listAccountClone]
    }
    handleClearCustomerTo(): void {
      this.queryTo.limit = 20
      this.queryTo.page = 1
      this.queryTo.search = ''
      this.listAccountTo = [...this.listAccountClone]
    }

    public handleReset(): void {
      if (this.checkPemission('transaction-nft', ['view-all-transaction-nft'])) {
        this.queryReferral.referralCode = ''
      }

      this.filter = {
        currency: '',
        fromDate: '',
        toDate: '',
        fromAmount: '',
        toAmount: '',
        fromAccount: '',
        toAccount: '',
        bonusType: null,
        transactionType: '',
        transactionStatus: 'SUCCESS'
      }

      this.errorType = false
      this.errorTypeQuantity = false
      // this.setOpenPopup({
      //   popupName: 'popup-filter-transaction',
      //   isOpen: false
      // })
      // this.$emit('filter', this.filter)
    }

    checkValid(): void {
      let toAmount = parseFloat(this.filter.toAmount.replaceAll(',', ''))
      let fromAmount = parseFloat(this.filter.fromAmount.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorType = true
      } else {
        this.errorType = false
      }
    }

    checkValidQuantity(): void {
      let toAmount = parseFloat(this.filter.toQuantity.replaceAll(',', ''))
      let fromAmount = parseFloat(this.filter.fromQuantity.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorTypeQuantity = true
      } else {
        this.errorTypeQuantity = false
      }
    }

    handleApply(): void {
      if (!this.errorType && !this.errorTypeQuantity) {
        let _currency = ''
        let _fromAmount = ''
        let _toAmount = ''
        let _fromQuantity = ''
        let _toQuantity = ''
        if (this.filter.currency) {
          _currency = this.filter.currency.join(',')
        }
        if (this.filter.fromAmount) {
          _fromAmount = this.filter.fromAmount.replaceAll(',', '')
        }
        if (this.filter.toAmount) {
          _toAmount = this.filter.toAmount.replaceAll(',', '')
        }
        if (this.filter.fromQuantity) {
          _fromQuantity = this.filter.fromQuantity.replaceAll(',', '')
        }
        if (this.filter.toQuantity) {
          _toQuantity = this.filter.toQuantity.replaceAll(',', '')
        }
        let fromDate = ''
        let toDate = ''

        if (this.filter.fromDate) {
          fromDate = this.$options.filters?.formatReferral(this.filter.fromDate)
        }
        if (this.filter.toDate) {
          toDate = this.$options.filters?.formatReferral(this.filter.toDate + 86399000)
        }
        this.$emit('filter', {
          ...this.filter,
          fromAmount: _fromAmount,
          toAmount: _toAmount,
          currency: _currency,
          fromDate,
          toDate,
          fromQuantity: _fromQuantity,
          toQuantity: _toQuantity
        })
        this.setOpenPopup({
          popupName: 'popup-filter-transaction',
          isOpen: false
        })
      }
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.filter[type], '.')) {
        event.preventDefault()
      }
    }

    numberFormat(event: FocusEvent): void {
      this.checkValid()
      this.checkValidQuantity()
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }
  }
</script>

<style scoped lang="scss">
  .prefix {
    height: 100%;
    font-size: 16px;
    color: #0a0b0d;
    position: absolute;
    left: 8px;
    top: 4px;
  }

  .transaction-amount-form {
    position: relative;
    .error-amount {
      position: absolute;
      bottom: 0;
      left: 0;

      p {
        font-family: Open Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #cf202f;
      }
    }
  }

  .form-item-line {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      height: 2px;
      width: 8px;
      background: #dbdbdb;
      top: 52px;
      right: -25px;
    }
  }
  .footer {
    button[disabled] {
      opacity: 0.2;
      cursor: not-allowed;
    }
  }
</style>
<style lang="scss">
  .popper-refferal-code {
    margin-top: 8px !important;
    min-width: 256px !important;
    .popper__arrow {
      display: none;
    }
    .el-select-dropdown__wrap {
      max-height: 240px !important;
      padding-top: 4px;
      .el-select-dropdown__list {
        padding: 0;
      }
      .el-select-dropdown__item {
        height: 58px !important;
      }
    }
    .el-select-dropdown__item {
      padding: 8px 26px 8px 12px !important;
      .account {
        max-width: 218px;
        .account-name {
          padding-bottom: 2px;
          overflow-x: hidden;
          text-overflow: ellipsis;
        }
      }

      .email-account {
        padding-left: 4px;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
