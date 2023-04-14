<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input v-model="search" class="input-search" :placeholder="$t('placeholder.search')">
      <span slot="prefix" class="prefix-search">
        <base-icon icon="icon-search" size="24" />
      </span>
    </el-input>
    <div class="filter-item">
      <el-popover :value="isVisible" placement="bottom-start" width="518" trigger="click" popper-class="popper-filter" @show="handleShowPopper">
        <div class="content">
          <el-form>
            <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item mr-40" :label="$t('label.available-amount')">
                <el-row class="flex_line">
                  <el-col :span="11">
                    <el-input
                      v-model="filterBalance.fromAvailableAmount"
                      @keypress.native="onlyNumber($event)"
                      @keyup.native="numberFormat($event)"
                      type="text"
                      :placeholder="$t('placeholder.from')"
                      ><div class="prefix" slot="prefix">$</div></el-input
                    >
                  </el-col>
                  <el-col :span="11" style="float: right">
                    <el-input
                      v-model="filterBalance.toAvailableAmount"
                      @keypress.native="onlyNumber($event)"
                      @keyup.native="numberFormat($event)"
                      type="text"
                      :placeholder="$t('placeholder.to')"
                      ><div class="prefix" slot="prefix">$</div></el-input
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
            <p class="error-validate" v-if="checkAvailabelAmout">{{ $t('notify.amount-invalid') }}</p>
            <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item mr-40" :label="$t('label.locked-amount')">
                <!-- <el-input :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateStart')" clearable></el-input> -->
                <el-row class="flex_line">
                  <el-col :span="11">
                    <el-input
                      v-model="filterBalance.fromLockedAmount"
                      @keypress.native="onlyNumber($event)"
                      @keyup.native="numberFormat($event)"
                      type="text"
                      :placeholder="$t('placeholder.from')"
                      ><div class="prefix" slot="prefix">$</div></el-input
                    >
                  </el-col>
                  <!-- <span class="dash"><i class="el-icon-minus icon-dash"></i></span> -->
                  <el-col :span="11" style="float: right">
                    <el-input
                      v-model="filterBalance.toLockedAmount"
                      @keypress.native="onlyNumber($event)"
                      @keyup.native="numberFormat($event)"
                      type="text"
                      :placeholder="$t('placeholder.to')"
                      ><div class="prefix" slot="prefix">$</div></el-input
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
            <p v-if="checkLockedAmount" class="error-validate">{{ $t('notify.amount-invalid') }}</p>
            <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item mr-40" :label="$t('label.balance')">
                <!-- <el-input :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateStart')" clearable></el-input> -->
                <el-row class="flex_line">
                  <el-col :span="11">
                    <el-input
                      v-model="filterBalance.fromBalanceAmount"
                      @keypress.native="onlyNumber($event)"
                      @keyup.native="numberFormat($event)"
                      type="text"
                      :placeholder="$t('placeholder.from')"
                      ><div class="prefix" slot="prefix">$</div></el-input
                    >
                  </el-col>
                  <!-- <span class="dash"><i class="el-icon-minus icon-dash"></i></span> -->
                  <el-col :span="11" style="float: right">
                    <el-input
                      v-model="filterBalance.toBalanceAmount"
                      @keypress.native="onlyNumber($event)"
                      @keyup.native="numberFormat($event)"
                      type="text"
                      :placeholder="$t('placeholder.to')"
                      ><div class="prefix" slot="prefix">$</div></el-input
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
            <p v-if="checkBalance" class="error-validate">{{ $t('notify.amount-invalid') }}</p>
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
  import { forEach, trim, debounce } from 'lodash'
  import getRepository from '@/services'
  import { KycRepository } from '@/services/repositories/kyc'
  const apiKyc: KycRepository = getRepository('kyc')

  import countryJson from '@/utils/country/index.json'
  interface IListCountry {
    name: string
    dial_code: string
    code: string
  }
  @Component
  export default class KycFilter extends Vue {
    @Prop({ required: true, type: Array, default: [] }) listApproveBy!: Array<Record<string, any>>
    filterBalance = {
      toBalanceAmount: '',
      fromBalanceAmount: '',
      toLockedAmount: '',
      fromLockedAmount: '',
      toAvailableAmount: '',
      fromAvailableAmount: '',
      orderBy: '3'
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
        label: this.$i18n.t('balance.lastChange'),
        divided: false,
        i18n: 'balance.lastChange'
      },
      {
        command: '3',
        label: this.$i18n.t('balance.balance'),
        divided: false,
        i18n: 'balance.balance'
      },
      {
        command: '4',
        label: this.$i18n.t('balance.lockedAmount'),
        divided: false,
        i18n: 'balance.lockedAmount'
      },
      {
        command: '5',
        label: this.$i18n.t('balance.availableAmout'),
        divided: false,
        i18n: 'balance.availableAmout'
      },
      {
        command: '6',
        label: this.$i18n.t('balance.name'),
        divided: false,
        i18n: 'balance.name'
      }
    ]
    sortActive = '3'
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
    checkAvailabelAmout = false
    checkLockedAmount = false
    checkBalance = false
    isVisible = false
    @Watch('filterBalance.toAvailableAmount') watchToAmount(value: string | number): void {
      const a = value.toString().replaceAll(',', '')
      const b = this.filterBalance.fromAvailableAmount.toString().replaceAll(',', '')
      if (parseFloat(a) >= parseFloat(b) || value == '') {
        this.checkAvailabelAmout = false
      } else {
        this.checkAvailabelAmout = true
      }
    }
    @Watch('filterBalance.toLockedAmount') watchLocked(value: string | number): void {
      const a = value.toString().replaceAll(',', '')
      const b = this.filterBalance.fromLockedAmount.toString().replaceAll(',', '')
      if (parseFloat(a) >= parseFloat(b) || value == '') {
        this.checkLockedAmount = false
      } else {
        this.checkLockedAmount = true
      }
    }
    @Watch('filterBalance.toBalanceAmount') watchBalance(value: string | number): void {
      const a = value.toString().replaceAll(',', '')
      const b = this.filterBalance.fromBalanceAmount.toString().replaceAll(',', '')
      if (parseFloat(a) >= parseFloat(b) || value == '') {
        this.checkBalance = false
      } else {
        this.checkBalance = true
      }
    }
    @Watch('search') handleSearch(value: string): void {
      this.searchText(value)
    }
    @Watch('filterBalance.fromAvailableAmount') availabelAmount(value: string): void {
      console.log('value', '$ ' + value)
      // this.filterBalance.fromAvailableAmount = "$ " + value
    }
    searchText = debounce((value: string) => {
      console.log('3', this.filterBalance)
      const filters = {
        ...this.filterBalance,
        fromAvailableAmount: this.filterBalance.fromAvailableAmount.replaceAll(',', ''),
        fromBalanceAmount: this.filterBalance.fromBalanceAmount.replaceAll(',', ''),
        fromLockedAmount: this.filterBalance.fromLockedAmount.replaceAll(',', ''),
        toAvailableAmount: this.filterBalance.toAvailableAmount.replaceAll(',', ''),
        toBalanceAmount: this.filterBalance.toBalanceAmount.replaceAll(',', ''),
        toLockedAmount: this.filterBalance.toLockedAmount.replaceAll(',', ''),
        search: trim(value)
      }
      this.$emit('filterBalance', filters)
    }, 500)
    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        // fnumber = parseInt(fnumber)
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }
    onlyNumber(event: KeyboardEvent): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
    }
    created(): void {
      EventBus.$on('changeLang', () => {
        console.log('a', window.localStorage.getItem('bc-lang'))
        forEach(this.sorts, elm => {
          elm.label = this.$i18n.t(elm.i18n)
        })
        this.$forceUpdate()
      })
      EventBus.$on('selectTabBalance', this.handleChangeTab)
      // this.$emit('filterBalance', this.filterBalance)
      console.log('filter', this.filterBalance)
    }
    destroyed(): void {
      EventBus.$off('changeLang')
      EventBus.$off('changeTab')
    }

    handleShowPopper(): void {
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
      ;(this.filterBalance.toBalanceAmount = ''), (this.filterBalance.fromBalanceAmount = ''), (this.filterBalance.toLockedAmount = '')
      this.filterBalance.fromLockedAmount = ''
      this.filterBalance.toAvailableAmount = ''
      this.filterBalance.fromAvailableAmount = ''
    }

    handleChangeTab(): void {
      ;(this.search = ''),
        (this.filterBalance.toBalanceAmount = ''),
        (this.filterBalance.fromBalanceAmount = ''),
        (this.filterBalance.toLockedAmount = ''),
        (this.filterBalance.fromLockedAmount = ''),
        (this.filterBalance.toAvailableAmount = ''),
        (this.filterBalance.fromAvailableAmount = ''),
        (this.filterBalance.orderBy = '3')
      this.sortActive = '3'
      // this.$emit('filterBalance', params);
    }

    handleSort(command: string): void {
      this.sortActive = command
      this.filterBalance.orderBy = command
      const filters = {
        ...this.filterBalance,
        fromAvailableAmount: this.filterBalance.fromAvailableAmount.replaceAll(',', ''),
        fromBalanceAmount: this.filterBalance.fromBalanceAmount.replaceAll(',', ''),
        fromLockedAmount: this.filterBalance.fromLockedAmount.replaceAll(',', ''),
        toAvailableAmount: this.filterBalance.toAvailableAmount.replaceAll(',', ''),
        toBalanceAmount: this.filterBalance.toBalanceAmount.replaceAll(',', ''),
        toLockedAmount: this.filterBalance.toLockedAmount.replaceAll(',', '')
      }
      this.$emit('filterBalance', filters)
    }

    handleApply(): void {
      if (this.checkAvailabelAmout || this.checkLockedAmount || this.checkBalance) {
        console.log('validate')
      } else {
        this.isVisible = false
        console.log('a', this.filterBalance)
        const filters = {
          ...this.filterBalance,
          fromAvailableAmount: this.filterBalance.fromAvailableAmount.replaceAll(',', ''),
          fromBalanceAmount: this.filterBalance.fromBalanceAmount.replaceAll(',', ''),
          fromLockedAmount: this.filterBalance.fromLockedAmount.replaceAll(',', ''),
          toAvailableAmount: this.filterBalance.toAvailableAmount.replaceAll(',', ''),
          toBalanceAmount: this.filterBalance.toBalanceAmount.replaceAll(',', ''),
          toLockedAmount: this.filterBalance.toLockedAmount.replaceAll(',', '')
        }
        console.log('âs', filters)
        this.$emit('filterBalance', filters)
      }
    }
    search = ''
    handleReset(): void {
      ;(this.filterBalance.toBalanceAmount = ''), (this.filterBalance.fromBalanceAmount = ''), (this.filterBalance.toLockedAmount = '')
      this.filterBalance.fromLockedAmount = ''
      this.filterBalance.toAvailableAmount = ''
      this.filterBalance.fromAvailableAmount = ''
      console.log('thanh', this.filterBalance)

      // this.$emit('filterBalance', this.filterBalance)
      // this.isVisible = false
    }
  }
</script>

<style scoped lang="scss">
  .error-validate {
    margin-top: -20px;
    margin-bottom: 10px;
    color: #cf202f;
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
</style>
