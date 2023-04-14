<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input v-model="filterException.search" class="input-search" :placeholder="$t('placeholder.search')">
      <span slot="prefix" class="prefix-search">
        <base-icon icon="icon-search" size="24" />
      </span>
    </el-input>
    <div class="filter-item">
      <el-popover :value="isVisible" placement="bottom-start" width="518" trigger="click" popper-class="popper-filter" @show="handleShowPopper">
        <div class="content">
          <el-form>
            <el-form-item :label="$t('label.buy-token')">
              <el-select v-model="filterException.currency" multiple clearable class="w-100">
                <el-option v-for="wallet in getListWallet" :key="wallet.id" :value="wallet.symbol" :label="wallet.name">
                  <template>
                    <div class="be-flex wallet-item">
                      <base-icon :icon="wallet.icon" size="24" />
                      <span class="d-ib" style="margin-left: 10px">{{ wallet.name }}</span>
                      <span class="d-ib" style="margin-left: 4px">({{ wallet.symbol.toUpperCase() }})</span>
                    </div>
                  </template>
                </el-option>
              </el-select>
            </el-form-item>

            <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item mr-40 form-item-line" :label="$t('label.trans-date')">
                <el-date-picker
                  class="w-100 date-picker"
                  format="MM/dd/yyyy"
                  value-format="timestamp"
                  :placeholder="$t('label.from-date')"
                  v-model="filterException.fromDate"
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
                  v-model="filterException.toDate"
                  type="date"
                  :picker-options="pickerOption"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <!-- <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item mr-40 form-item-line" :label="$t('label.trans-amount')">
                <el-input
                  v-model="filterException.fromAmount"
                  :placeholder="$t('placeholder.from-amount')"
                  @keypress.native="onlyNumber($event, 'fromAmount')"
                  @keyup.native="numberFormat($event)"
                >
                  <div class="prefix" slot="prefix">$</div>
                </el-input>
              </el-form-item>

              <el-form-item class="be-flex-item hide-label" label="1">
                <el-input
                  v-model="filterException.toAmount"
                  :placeholder="$t('placeholder.to-amount')"
                  @keypress.native="onlyNumber($event, 'toAmount')"
                  @keyup.native="numberFormat($event)"
                >
                  <div class="prefix" slot="prefix">$</div>
                </el-input>
              </el-form-item>
            </div> -->
            <div class="transaction-amount-form">
              <div class="be-flex jc-space-between row">
                <el-form-item
                  class="be-flex-item mr-40 form-item-line"
                  :class="errorType === 'amount' && 'error-amount-border-popup-transaction'"
                  :label="$t('label.trans-amount')"
                >
                  <el-input
                    v-model="filterException.fromAmount"
                    :placeholder="$t('placeholder.from-amount')"
                    @keypress.native="onlyNumber($event, 'fromAmount')"
                    @keyup.native="numberFormat($event)"
                  >
                    <div class="prefix" slot="prefix">$</div>
                  </el-input>
                </el-form-item>

                <el-form-item class="be-flex-item hide-label" label="1" :class="errorType === 'amount' && 'error-amount-border-popup-transaction'">
                  <el-input
                    v-model="filterException.toAmount"
                    :placeholder="$t('placeholder.to-amount')"
                    @keypress.native="onlyNumber($event, 'toAmount')"
                    @keyup.native="numberFormat($event)"
                  >
                    <div class="prefix" slot="prefix">$</div>
                  </el-input>
                </el-form-item>
              </div>
              <div v-if="errorType === 'amount'" class="error-amount">
                <p>{{ $t('notify.amount-invalid') }}</p>
              </div>
            </div>
            <el-form-item v-if="$route.name === 'ExceptionCrowdsale'" :label="$t('label.status')" class="be-flex-item">
              <el-select v-model="filterException.status" clearable class="w-100">
                <el-option v-for="status in listStatus" :key="status.id" :value="status.value" :label="status.label">
                  <template>
                    <span class="d-ib">{{ status.label }}</span>
                  </template>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="be-flex jc-flex-end footer">
          <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular" @click="handleReset">{{ $t('button.reset') }}</el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular" @click="handleApply">{{ $t('button.apply') }}</el-button>
        </div>
        <div slot="reference" class="cursor text-filter" style="font-size: 16px">
          <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
          {{ $t('kyc.filter.filter') }}
        </div>
      </el-popover>
      <!-- <div class="cursor text-filter" style="font-size: 16px">
        <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
        {{ $t('kyc.filter.filter') }}
      </div> -->
    </div>
    <div>
      <el-dropdown class="sort" trigger="click" @command="handleSort">
        <span class="abicon sort-title" style="font-size: 16px">
          <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="18" class="icon" /> {{ $t('kyc.filter.sort') }}</span
        >
        <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown">
          <el-dropdown-item v-for="(value, index) in sorts" :key="index" :class="sortActive === value.command ? 'active' : null" :command="value.command" :divided="value.divided">
            <span class="be-flex">
              <span class="be-flex-item">
                {{ value.label }}
              </span>
              <base-icon v-if="sortActive === value.command" icon="icon-tick-dropdown" size="16" />
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'
  import { forEach, trim, debounce, includes } from 'lodash'
  import getRepository from '@/services'
  import { KycRepository } from '@/services/repositories/kyc'
  import { namespace } from 'vuex-class'
  const apiKyc: KycRepository = getRepository('kyc')
  const beBase = namespace('beBase')
  import countryJson from '@/utils/country/index.json'
  interface IListCountry {
    name: string
    dial_code: string
    code: string
  }
  @Component
  export default class KycFilter extends Vue {
    @Prop({ required: true, type: Array, default: [] }) listApproveBy!: Array<Record<string, any>>
    filterException: Record<string, any> = {
      search: '',
      currency: '',
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      status: '',
      orderBy: '1'
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
        name: 'BNB',
        symbol: 'bnb',
        icon: 'icon-bnb',
        disabled: true
      },
      {
        id: 4,
        name: 'BUSD',
        symbol: 'busd',
        icon: 'icon-busd',
        disabled: true
      }
    ]

    listStatus: Array<Record<string, any>> = [
      {
        id: 0,
        label: this.$i18n.t('exception.locked'),
        value: 'LOCKED'
      },
      {
        id: 1,
        label: this.$i18n.t('exception.failed-tranfer'),
        value: 'FAILED_TRANSFER'
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
    loading = false
    listApprove: Array<Record<string, any>> = []
    queryApprove = {
      page: 1,
      limit: 20,
      search: ''
    }

    sorts: Array<Record<string, any>> = [
      {
        command: '1',
        label: this.$i18n.t('kyc.sort.date'),
        divided: false,
        i18n: 'kyc.sort.date'
      },
      {
        command: '2',
        label: this.$i18n.t('exception.amount'),
        divided: false,
        i18n: 'exception.amount'
      }
    ]
    errorType = ''
    sortActive = '1'
    listCountry: IListCountry[] = countryJson
    identificationType: Array<Record<string, any>> = [
      {
        id: 0,
        type: 'Id Card',
        value: 'ID_CARD'
      },
      {
        id: 1,
        type: 'Passport',
        value: 'PASSPORT'
      },
      {
        id: 2,
        type: 'Driver’s License',
        value: 'DRIVER_LICENSE'
      }
    ]
    isVisible = false

    @Watch('filterException.search') handleSearch(value: string): void {
      this.searchText(value)
    }
    @Watch('filterException.fromAvailableAmount') availabelAmount(value: string): void {
      console.log('value', '$ ' + value)
      // this.filterException.fromAvailableAmount = "$ " + value
    }
    @Watch('filterException.fromAmout') watchFromAmount(value: string | number): void {
      if (value == '') {
        this.errorType = ''
      } else {
        this.errorType = 'amount'
      }
      // this.filterException.fromAvailableAmount = "$ " + value
    }
    @Watch('filterException.toAmount') watchToAmount(value: string | number): void {
      const a = value.toString().replaceAll(',', '')
      const b = this.filterException.fromAmount.toString().replaceAll(',', '')
      if (parseFloat(a) >= parseFloat(b) || value == '') {
        this.errorType = ''
      } else {
        this.errorType = 'amount'
      }
      // this.filterException.fromAvailableAmount = "$ " + value
    }
    searchText = debounce((value: string) => {
      let _currency = ''
      if (this.filterException.currency) {
        _currency = this.filterException.currency.join(',')
      }
      let fromDate = ''
      let toDate = ''
      if (this.filterException.fromDate) {
        fromDate = this.$options.filters?.formatReferral(this.filterException.fromDate)
      }
      if (this.filterException.toDate) {
        toDate = this.$options.filters?.formatReferral(this.filterException.toDate + 86399000)
      }
      this.$emit('filterException', {
        ...this.filterException,
        fromDate: fromDate,
        toDate: toDate,
        search: trim(value),
        currency: _currency
      })
      // this.$emit('filterException', {
      //   ...this.filterException,
      //   search: trim(value),
      //   currency: _currency
      // })
    }, 500)
    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }
    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.filterException[type], '.')) {
        event.preventDefault()
      }
    }
    // clickOutSide() {
    //   this.checkValid()
    // }

    // checkValid(): boolean {
    //   let toAmount = parseInt(this.filterException.toAmount.replaceAll(',', ''))
    //   let fromAmount = parseInt(this.filterException.fromAmount.replaceAll(',', ''))
    //   if (fromAmount > toAmount) {
    //     this.errorType = 'amount'
    //     return false
    //   } else {
    //     this.errorType = ''
    //     return true
    //   }
    // }
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
        if (this.filterException.fromDate) {
          return time.getTime() / 1000 < new Date(this.filterException.fromDate).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.filterException.toDate) {
          return time.getTime() / 1000 > new Date(this.filterException.toDate).getTime() / 1000
        }
      }
    }
    created(): void {
      this.errorType = ''
      EventBus.$on('changeLang', () => {
        console.log('a', window.localStorage.getItem('bc-lang'))
        forEach(this.sorts, elm => {
          elm.label = this.$i18n.t(elm.i18n)
        })
        this.$forceUpdate()
      })
      EventBus.$on('changeTabException', this.handleChangeTab)
      // this.$emit('filterException', this.filterException)
    }
    destroyed(): void {
      EventBus.$off('changeLang')
      EventBus.$off('changeTab')
    }

    handleShowPopper(): void {
      let toAmount = parseInt(this.filterException.toAmount.replaceAll(',', ''))
      let fromAmount = parseInt(this.filterException.fromAmount.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorType = 'amount'
      } else {
        this.errorType = ''
      }
      this.isVisible = true
      this.listApprove = [...this.listApproveBy]
    }

    handleSearchApprove(query: string): void {
      if (query !== '') {
        this.loading = true
        this.queryApprove.page = 1
        this.queryApprove.search = trim(query)
        apiKyc.getListApprove(this.queryApprove).then(res => {
          this.listApprove = res.content || []
          this.loading = false
        })
      } else {
        this.listApprove = this.listApproveBy
      }
    }

    loadMoreApprove(): void {
      this.queryApprove.page += 1
      apiKyc.getListApprove(this.queryApprove).then(res => {
        this.listApprove = [...this.listApprove, ...res.content]
      })
    }

    resetFilter(): void {
      console.log('k')
    }
    tabActive = ''
    handleChangeTab(value: string): void {
      this.tabActive = value
      ;(this.filterException.search = ''),
        (this.filterException.currency = ''),
        (this.filterException.fromDate = ''),
        (this.filterException.toDate = ''),
        (this.filterException.fromAmount = ''),
        (this.filterException.toAmount = ''),
        (this.filterException.status = ''),
        (this.filterException.orderBy = '1'),
        (this.errorType = ''),
        (this.sortActive = '1')
    }

    handleSort(command: string): void {
      this.sortActive = command
      this.filterException.orderBy = command

      let fromDate = ''
      let toDate = ''
      if (this.filterException.fromDate) {
        fromDate = this.$options.filters?.formatReferral(this.filterException.fromDate)
      }
      if (this.filterException.toDate) {
        toDate = this.$options.filters?.formatReferral(this.filterException.toDate + 86399000)
      }
      this.$emit('filterException', {
        ...this.filterException,
        fromDate: fromDate,
        toDate: toDate,
        orderBy: command
      })
    }

    handleApply(): void {
      if (this.errorType == '') {
        this.isVisible = false
        let _currency = ''
        if (this.filterException.currency) {
          _currency = this.filterException.currency.join(',')
        }

        let fromDate = ''
        let toDate = ''
        if (this.filterException.fromDate) {
          fromDate = this.$options.filters?.formatReferral(this.filterException.fromDate)
        }
        if (this.filterException.toDate) {
          toDate = this.$options.filters?.formatReferral(this.filterException.toDate + 86399000)
        }
        const filters = {
          ...this.filterException,
          fromAmount: this.filterException.fromAmount.replaceAll(',', ''),
          toAmount: this.filterException.toAmount.replaceAll(',', ''),
          currency: _currency,
          fromDate: fromDate,
          toDate: toDate
        }
        this.$emit('filterException', filters)
      }
    }
    resetFilters(): void {
      ;(this.filterException.search = ''),
        (this.filterException.currency = ''),
        (this.filterException.fromDate = ''),
        (this.filterException.toDate = ''),
        (this.filterException.fromAmount = ''),
        (this.filterException.toAmount = ''),
        (this.filterException.status = ''),
        (this.filterException.orderBy = '1'),
        (this.errorType = '')
    }
    handleReset(): void {
      ;(this.filterException.search = ''),
        (this.filterException.currency = ''),
        (this.filterException.fromDate = ''),
        (this.filterException.toDate = ''),
        (this.filterException.fromAmount = ''),
        (this.filterException.toAmount = ''),
        (this.filterException.status = ''),
        (this.filterException.orderBy = '1'),
        (this.errorType = '')
      this.$emit('filterException', this.filterException)
      this.isVisible = false
    }
  }
</script>

<style scoped lang="scss">
  .jc-space-between {
    justify-content: space-between;
    margin-bottom: 0px !important;
    margin-top: -10px !important;
  }
  .el-popper.popper-filter .content {
    padding: 12px 24px 0;
  }
  .error-amount {
    position: absolute;
    bottom: 0;
    left: 0;

    p {
      font-family: Open Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 20px;
      color: #cf202f;
    }
  }
  .dash {
    text-align: center;
  }
  .prefix {
    height: 100%;
    font-size: 16px;
    color: #0a0b0d;
    position: absolute;
    left: 8px;
    top: 4px;
  }
  .kyc-filter {
    background-color: #fff;
    .input-search {
      width: 400px;
      margin-right: 30px;
    }
    .sort {
      margin-left: 30px;
      cursor: pointer;
      color: #0a0b0d;
    }
    ::v-deep .filter-item {
      &:hover {
        .text-filter {
          color: #0151fc;
          .span-icon {
            color: #0151fc !important;
          }
        }
      }
    }
    ::v-deep .sort {
      &:hover {
        .el-dropdown-selfdefine {
          color: #0151fc;
          .span-icon {
            color: #0151fc !important;
          }
        }
      }
      .sort-title {
        &:focus {
          color: #0151fc;
          .span-icon {
            color: #0151fc !important;
          }
        }
      }
    }
  }
  .transaction-amount-form {
    position: relative;
  }
</style>
