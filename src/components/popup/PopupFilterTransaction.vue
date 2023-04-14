<template>
  <base-popup name="popup-filter-transaction" class="popup-filter-transaction" width="600px">
    <div class="title-popup" slot="title">
      <span>{{ $t('transaction.popup.title-filter') }}</span>
    </div>
    <div class="content">
      <el-form>
        <!--        <el-form-item :label="$t('label.buy-token')">-->
        <!--          <el-select v-model="filter.currency" multiple clearable class="w-100">-->
        <!--            <el-option v-for="wallet in getListWallet" :key="wallet.id" :value="wallet.symbol" :label="wallet.name">-->
        <!--              <template>-->
        <!--                <div class="be-flex wallet-item">-->
        <!--                  <base-icon :icon="wallet.icon" size="24" />-->
        <!--                  <span class="d-ib" style="margin-left: 10px">{{ wallet.name }}</span>-->
        <!--                  <span class="d-ib" style="margin-left: 4px">({{ wallet.symbol.toUpperCase() }})</span>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
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
        <div class="transaction-address-form" v-if="type == 'transaction' && tabActiveFilter !== 'staking' && tabActiveFilter !== 'swap'">
          <div class="be-flex jc-space-between row">
            <el-form-item
              v-if="tabActiveFilter != 'bonus' && tabActiveFilter != 'crowdsale'"
              class="be-flex-item mr-40 form-item-line"
              :class="errorType === 'address' && 'error-address-border-popup-transaction'"
              :label="$t('label.from')"
            >
              <el-select
                v-if="tabActiveFilter != 'deposit'"
                v-model="filter.fromAddress"
                filterable
                class="w-100"
                popper-class="filter-address-transaction"
                :placeholder="$t('label.from')"
                :filter-method="remoteMethodFrom"
                :loading="loading"
                clearable
                @clear="handleClearAddress('from')"
                @blur="handleBlur"
              >
                <div v-infinite-scroll="loadMoreCustomerFrom" infinite-scroll-delay="500">
                  <el-option v-for="item in optionAddressFrom" :key="item.address" :value="renderValueAddress(item, 'from')" @click.native="selectFromAddress = item">
                    <div class="option-item">
                      <div class="option-item__label" v-if="item.username.length > 24">
                        {{ item.username | formatTransactionCode(8) }}
                      </div>
                      <div class="option-item__label" v-else>{{ item.username }}</div>
                      <div class="option-item__description">{{ item.address | formatTransactionCode(5) }}</div>
                    </div>
                  </el-option>
                </div>
              </el-select>
              <el-input
                v-else
                v-model="filter.fromAddress"
                @change="selectFromAddress = { address: filter.fromAddress }"
                class="w-100"
                reserve-keyword
                :placeholder="$t('label.from')"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              class="be-flex-item"
              :class="errorType === 'amount' && 'error-amount-border-popup-transaction'"
              :label="tabActiveFilter == 'bonus' || tabActiveFilter == 'crowdsale' ? $t('balance.investor') : $t('label.to')"
            >
              <el-select
                v-if="tabActiveFilter != 'withdraw'"
                v-model="filter.toAddress"
                filterable
                clearable
                popper-class="filter-address-transaction"
                class="w-100"
                :placeholder="tabActiveFilter == 'bonus' || tabActiveFilter == 'crowdsale' ? $t('balance.investor') : $t('label.to')"
                :filter-method="remoteMethodTo"
                :loading="loading"
                @clear="handleClearAddress('to')"
                @blur="handleBlur"
              >
                <div v-infinite-scroll="loadMoreCustomerTo" infinite-scroll-delay="500">
                  <el-option v-for="item in optionAddressTo" :key="item.address" :value="renderValueAddress(item, 'to')" @click.native="selectToAddress = item">
                    <div class="option-item">
                      <div class="option-item__label" v-if="item.username.length > 24">
                        {{ item.username | formatTransactionCode(8) }}
                      </div>
                      <div class="option-item__label" v-else>{{ item.username }}</div>
                      <div class="option-item__description">{{ item.address | formatTransactionCode(5) }}</div>
                    </div>
                  </el-option>
                </div>
              </el-select>
              <el-input v-else v-model="filter.toAddress" @change="selectToAddress = { address: filter.toAddress }" class="w-100" reserve-keyword :placeholder="$t('label.to')">
              </el-input>
            </el-form-item>
          </div>
          <div v-if="errorType === 'amount'" class="error-amount">
            <p>{{ $t('notify.amount-invalid') }}</p>
          </div>
        </div>
        <div class="transaction-amount-form">
          <div class="be-flex jc-space-between row">
            <el-form-item class="be-flex-item mr-40 form-item-line" :class="errorType === 'amount' && 'error-amount-border-popup-transaction'" :label="$t('label.trans-amount')">
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

            <el-form-item class="be-flex-item hide-label" label="1" :class="errorType === 'amount' && 'error-amount-border-popup-transaction'">
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
          <div v-if="errorType === 'amount'" class="error-amount">
            <p>{{ $t('notify.amount-invalid') }}</p>
          </div>
        </div>
        <div v-if="tabActiveFilter === 'bonus'" class="be-flex jc-space-between">
          <el-form-item :label="$t('label.status')" class="be-flex-item mr-40">
            <el-select v-model="filter.status" clearable class="w-100">
              <el-option v-for="status in listStatus" :key="status.id" :value="status.value" :label="status.label">
                <template>
                  <span class="d-ib">{{ status.label }}</span>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.bonus-type')" class="be-flex-item">
            <el-select v-model="filter.bonusType" clearable class="w-100">
              <el-option v-for="status in listBonusType" :key="status.id" :value="status.value" :label="status.label">
                <template>
                  <span class="d-ib">{{ status.label }}</span>
                </template>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item v-if="type === 'customer'" :label="$t('label.trans-type')">
            <el-select v-model="filter.transactionType" :placeholder="$t('placeholder.select-type-1')" class="w-100" clearable>
              <el-option v-for="(type, index) in listType" :key="index" :label="type.name" :value="type.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('label.status')">
            <el-select v-model="filter.status" clearable claslistStatuss="w-100" class="w-100">
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
      <button class="btn-default-bg text-regular btn-h40" @click="handleApply" :disabled="errorType === 'amount'">
        {{ $t('button.continue') }}
      </button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import includes from 'lodash/includes'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  import { TransactionRepository } from '@/services/repositories/transaction'
  import getRepository from '@/services'
  import { formatTransactionCode } from '@/configs'
  import { cloneDeep, debounce, trim } from 'lodash'

  const beBase = namespace('beBase')
  const api: TransactionRepository = getRepository('transaction')

  @Component
  export default class PopupFilterTransaction extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: '' }) tabActiveFilter!: string
    @Prop({ required: false, type: String, default: 'customer' }) type!: string
    @Prop({ required: false, type: String, default: '' }) currency!: string
    loading = false
    optionAddressFrom: Record<string, any>[] = []
    optionAddressTo: Record<string, any>[] = []
    keyword = ''
    filter: Record<string, any> = {
      currency: '',
      fromDate: null,
      toDate: null,
      fromAmount: '',
      fromAddress: '',
      toAddress: '',
      toAmount: '',
      status: '',
      bonusType: '',
      transactionType: ''
    }
    filterAddressFrom: Record<string, any> = {
      currency: this.currency,
      page: 1,
      limit: 20,
      search: ''
    }
    filterAddressTo: Record<string, any> = {
      currency: this.currency,
      page: 1,
      limit: 20,
      search: ''
    }
    selectFromAddress = {
      address: ''
    }
    selectToAddress = {
      address: ''
    }

    listType: Array<Record<string, any>> = [
      {
        id: 0,
        name: this.$t('transaction.filter.sign-up'),
        value: 'BONUS_SIGN_UP'
      },
      {
        id: 1,
        name: this.$t('transaction.filter.first-tran'),
        value: 'BONUS_FIRST_TRANS'
      },
      {
        id: 2,
        name: this.$t('transaction.filter.bonus-crowdsale'),
        value: 'BONUS_CROWDSALE'
      },
      {
        id: 3,
        name: this.$t('transaction.filter.big-backer'),
        value: 'BONUS_BIG_BACKER'
      },
      {
        id: 4,
        name: this.$t('transaction.filter.affitiate'),
        value: 'BONUS_AFFILIATE'
      },
      {
        id: 5,
        name: this.$t('transaction.filter.early-backer'),
        value: 'BONUS_EARLY_BACKER'
      },
      {
        id: 6,
        name: this.$t('transaction.filter.sign-up-ref'),
        value: 'BONUS_SIGN_UP_REFERRAL'
      },
      {
        id: 7,
        name: this.$t('transaction.filter.crowdsale'),
        value: 'CROWDSALE'
      },
      {
        id: 8,
        name: this.$t('transaction.filter.deposit'),
        value: 'DEPOSIT'
      },
      {
        id: 9,
        name: this.$t('transaction.filter.transfer'),
        value: 'TRANSFER'
      },
      {
        id: 10,
        name: this.$t('transaction.filter.withdraw'),
        value: 'WITHDRAW'
      }
    ]

    handleBlur(value) {
      console.log('d')
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

    @Watch('currency') watchCurrency() {
      this.handleReset()
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

    handleClearAddress(status) {
      if (status == 'from') {
        this.filterAddressFrom.search = ''
        this.selectFromAddress = {
          address: ''
        }
      } else {
        this.filterAddressTo.search = ''
        this.selectToAddress = {
          address: ''
        }
      }
      this.getListAddress(this, status)
    }

    renderValueAddress(item, status) {
      item = cloneDeep(item)
      item.address = formatTransactionCode(item.address, 6)
      if (item.username.length > 24 && this.tabActiveFilter != 'bonus' && this.tabActiveFilter != 'crowdsale') item.username = formatTransactionCode(item.username, 8)

      if (status == 'from') {
        if (this.tabActiveFilter == 'deposit') return item.address
        else if (this.tabActiveFilter == 'crowdsale') return item.address
        else if (this.tabActiveFilter == 'withdraw') return item.username
        else if (this.tabActiveFilter == 'transfer') return item.username
      } else {
        if (this.tabActiveFilter == 'deposit') return item.username
        else if (this.tabActiveFilter == 'crowdsale') return item.username
        else if (this.tabActiveFilter == 'withdraw') return item.address
        else if (this.tabActiveFilter == 'transfer') return item.username
        else if (this.tabActiveFilter == 'bonus') return item.username
      }
    }

    remoteMethodFrom(value) {
      this.filterAddressFrom = {
        page: 1,
        limit: 20,
        currency: this.currency,
        search: value
      }
      this.getListAddress(this, 'from')
    }

    remoteMethodTo(value) {
      this.filterAddressTo = {
        page: 1,
        limit: 20,
        currency: this.currency,
        search: value
      }
      this.getListAddress(this, 'to')
    }

    mounted(): void {
      this.getListAddress(this, null)
    }

    getListAddress = debounce(async (_this, status) => {
      _this.optionAddress = []
      _this.loading = true
      if (!status) {
        const resultFrom = await api.getListAddress(_this.filterAddressFrom)
        const resultTo = await api.getListAddress(_this.filterAddressTo)
        _this.optionAddressFrom = resultFrom?.content
        _this.optionAddressTo = resultTo?.content
      } else if (status == 'from') {
        const resultFrom = await api.getListAddress(_this.filterAddressFrom)
        _this.optionAddressFrom = resultFrom?.content
      } else {
        const resultTo = await api.getListAddress(_this.filterAddressTo)
        _this.optionAddressTo = resultTo?.content
      }
      _this.loading = false
    }, 500)

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

    listWallet: Array<Record<string, any>> = [
      {
        id: 0,
        name: 'Bitcoin',
        symbol: 'btc',
        icon: 'icon-btc'
      },
      {
        id: 1,
        name: 'Ethereum',
        symbol: 'eth',
        icon: 'icon-eth'
      },
      {
        id: 2,
        name: 'Tether',
        symbol: 'usdt',
        icon: 'icon-usdt',
        disabled: true
      },
      {
        id: 3,
        name: 'USDC',
        symbol: 'usdc',
        icon: 'icon-usdc',
        disabled: true
      },
      {
        id: 4,
        name: 'Binance',
        symbol: 'bnb',
        icon: 'icon-bnb',
        disabled: true
      },
      {
        id: 4,
        name: 'Binance USD',
        symbol: 'busd',
        icon: 'icon-busd',
        disabled: true
      }
    ]

    listStatus: Array<Record<string, any>> = [
      {
        id: 0,
        label: 'Pending',
        value: 'PENDING'
      },
      {
        id: 1,
        label: 'Processing',
        value: 'PROCESSING'
      },
      {
        id: 2,
        label: 'Success',
        value: 'SUCCESS'
      }
      // {
      //   id: 3,
      //   label: 'Failed',
      //   value: 'FAILED'
      // },
      // {
      //   id: 4,
      //   label: 'Rejected',
      //   value: 'REJECTED'
      // }
    ]

    listBonusType: Array<Record<string, any>> = [
      {
        id: 0,
        label: 'Sign Up',
        value: 'BONUS_SIGN_UP'
      },
      {
        id: 1,
        label: 'Crowdsale',
        value: 'BONUS_CROWDSALE'
      },
      {
        id: 2,
        label: 'First Transaction',
        value: 'BONUS_FIRST_TRANS'
      },
      {
        id: 3,
        label: 'Affiliate',
        value: 'BONUS_AFFILIATE'
      },
      {
        id: 4,
        label: 'Big Backers',
        value: 'BONUS_BIG_BACKER'
      },
      {
        id: 5,
        label: 'Early Backers',
        value: 'BONUS_EARLY_BACKER'
      }
    ]
    errorType = ''

    get getListWallet(): Array<Record<string, any>> {
      return [
        {
          id: 5,
          name: 'LynKey',
          symbol: 'lynk',
          icon: 'icon-lin'
        },
        ...this.listWallet
      ]
    }

    async loadMoreCustomerFrom(): Promise<void> {
      this.filterAddressFrom.limit += 10
      const result = await api.getListAddress(this.filterAddressFrom)
      this.optionAddressFrom = result?.content
    }

    async loadMoreCustomerTo(status): Promise<void> {
      this.filterAddressTo.limit += 10
      const result = await api.getListAddress(this.filterAddressTo)
      this.optionAddressTo = result?.content
    }

    public handleReset(): void {
      this.filter = {
        currency: '',
        fromDate: '',
        toDate: '',
        fromAmount: '',
        fromAddress: '',
        toAddress: '',
        toAmount: '',
        status: null,
        bonusType: null,
        transactionType: ''
      }

      this.errorType = ''
      this.selectToAddress = {
        address: ''
      }
      this.selectFromAddress = {
        address: ''
      }

      this.filterAddressFrom = {
        page: 1,
        limit: 20,
        currency: this.currency,
        search: ''
      }

      this.filterAddressTo = {
        page: 1,
        limit: 20,
        currency: this.currency,
        search: ''
      }

      this.getListAddress(this, null)
      // this.setOpenPopup({
      //   popupName: 'popup-filter-transaction',
      //   isOpen: false
      // })
      // this.$emit('filter', this.filter)
    }

    checkValid(): boolean {
      let toAmount = parseFloat(this.filter.toAmount.replaceAll(',', ''))
      let fromAmount = parseFloat(this.filter.fromAmount.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorType = 'amount'
        return false
      } else {
        this.errorType = ''
        return true
      }
    }

    handleApply(): void {
      if (this.checkValid()) {
        this.setOpenPopup({
          popupName: 'popup-filter-transaction',
          isOpen: false
        })
        let _currency = ''
        let _fromAmount = ''
        let _toAmount = ''
        if (this.filter.currency) {
          _currency = this.filter.currency.join(',')
        }
        if (this.filter.fromAmount) {
          _fromAmount = this.filter.fromAmount.replaceAll(',', '')
        }
        if (this.filter.toAmount) {
          _toAmount = this.filter.toAmount.replaceAll(',', '')
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
          fromAddress: this.selectFromAddress?.address,
          toAddress: this.selectToAddress?.address
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
  .filter-address-transaction {
    .el-select-dropdown__item {
      padding: 8px 12px;
      height: 58px !important;
      font-weight: 400;

      .option-item {
        .option-item__label {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: #0a0b0d;
        }

        .option-item__description {
          font-size: 12px !important;
          line-height: 16px !important;
          color: #5b616e !important;
        }
      }

      &.selected {
        .option-item__label {
          color: var(--bc-tab-active);
        }
      }
    }
  }

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
