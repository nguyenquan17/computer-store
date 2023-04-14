<template>
  <div class="bo-request-withdraw">
    <div class="box-filter be-flex align-center">
      <div class="box-search">
        <el-input class="input-search" :placeholder="$t('placeholder.search')" v-model="querry.keywordString" clearable>
          <div slot="prefix" class="prefix-search">
            <base-icon icon="icon-search" size="24" />
          </div>
        </el-input>
      </div>
      <el-popover :value="isVisible" placement="bottom-start" width="518" trigger="click" popper-class="popper-filter-request-withdraw" @show="handleShowPopper">
        <!-- <el-button slot="reference">Click to activate</el-button> -->
        <div class="content">
          <div class="label">{{ $t('request.filter.label1') }}</div>
          <div class="be-flex jc-space-between row box">
            <el-select v-model="filter.status" multiple :placeholder="$t('request.filter.planceOder1')" clearable>
              <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </div>
          <div class="label">{{ $t('request.filter.label2') }}</div>
          <div class="be-flex jc-space-between align-center row box">
            <el-date-picker
              v-model="filter.fromDate"
              value-format="timestamp"
              format="MM/dd/yyyy"
              type="date"
              :placeholder="$t('request.filter.planceOder2')"
              class="box-input-request-date"
              :picker-options="pickerOption2"
            >
            </el-date-picker>
            <div class="line"></div>
            <el-date-picker
              v-model="filter.toDate"
              value-format="timestamp"
              format="MM/dd/yyyy"
              type="date"
              :placeholder="$t('request.filter.planceOder3')"
              class="box-input-request-date"
              :picker-options="pickerOption"
            >
            </el-date-picker>
          </div>
          <div class="label">{{ $t('request.filter.label3') }}</div>
          <div style="position: relative">
            <div class="be-flex jc-space-between align-center row box" :class="errorType === 'amount' && 'error-amount-border-popup-transaction'">
              <el-input
                v-model="filter.fromAmount"
                :placeholder="$t('request.filter.planceOder2')"
                class="box-input-request-date"
                @keypress.native="onlyNumber($event)"
                @keyup.native="numberFormat($event)"
                @blur="clickOutSide"
              >
                <div class="prefix" slot="prefix">$</div>
              </el-input>
              <div class="line"></div>
              <el-input
                v-model="filter.toAmount"
                :placeholder="$t('request.filter.planceOder3')"
                class="box-input-request-date"
                @keypress.native="onlyNumber($event)"
                @keyup.native="numberFormat($event)"
                @blur="clickOutSide"
              >
                <div class="prefix" slot="prefix">$</div>
              </el-input>
            </div>
            <div v-if="errorType === 'amount'" class="error-amount">
              <p>{{ $t('notify.amount-invalid') }}</p>
            </div>
          </div>
          <div class="be-flex jc-flex-end footer">
            <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular" @click="handleResetFilter">
              {{ $t('button.reset') }}
            </el-button>
            <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular" @click="handleApply" :disabled="errorType === 'amount'">
              {{ $t('button.apply') }}
            </el-button>
          </div>
        </div>
        <div slot="reference" class="btn-filter be-flex align-center cursor">
          <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="16" /> <span class="fs-16">{{ $t('crowdsale.filter') }}</span>
        </div>
      </el-popover>
      <el-dropdown class="cursor" trigger="click" @command="handleSort">
        <div class="sort be-flex align-center">
          <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="16" class="icon" /> <span class="fs-16">{{ $t('crowdsale.sortBy') }}</span>
        </div>
        <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown" style="width: 232px">
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
    <div class="table">
      <base-table
        :data="dataTable"
        :table="query"
        :paginationInfo="getPaginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        v-loading="loadingTable"
        @rowClick="handleRowClick"
        class="base-table table-request"
      >
        <el-table-column label="#" type="index" :index="indexMethod" align="center" width="80" />
        <el-table-column :label="this.$t('request.table.label2')" prop="transactionMillisecond" align="left" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.transactionMillisecond | formatDateHourMs }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('request.table.label1')" prop="fullName" align="left" width="250" />
        <el-table-column :label="this.$t('request.table.label3')" prop="email" align="left" />
        <el-table-column :label="this.$t('request.table.label4')" prop="status" align="center" width="144">
          <template slot-scope="scope">
            <div v-if="scope.row.status === 'REJECTED'" class="box-status-tabel locked">
              <span class="fs-12 fw-500">{{ $t('request.filter.rejected') }}</span>
            </div>
            <div v-else-if="scope.row.status === 'PENDING'" class="box-status-tabel failed">
              <span class="fs-12 fw-500">{{ $t('request.filter.pending') }}</span>
            </div>
            <div v-else class="box-status-tabel">
              <span class="fs-12 fw-500">{{ scope.row.status.toLowerCase() }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('request.table.label5')" align="right" width="200">
          <template slot-scope="scope">
            <div class="box-paid">
              <p class="text-paid fw-400 fs-16">{{ scope.row.amountDisplay }}</p>
              <p class="avi fw-400 fs-14">~${{ scope.row.amountToUsd | convertAmountDecimal('USD') }}</p>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <popup-withdraw-request :data="dataProp" @reLoadTable="init" />
  </div>
</template>
<script lang="ts">
  import { Mixins, Component, Watch, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupWithdrawRequest from '../components/popup/PopupWithdrawRequest.vue'
  // import firebase from '@/utils/firebase'
  import getRepository from '@/services'
  import { RequestRepository } from '@/services/repositories/request'
  import { debounce } from 'lodash'

  const api: RequestRepository = getRepository('request')
  @Component({ components: { PopupWithdrawRequest } })
  export default class BORequestWithdraw extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String, default: '' }) tabCoin!: string
    querry: any = {
      currency: '',
      keywordString: '',
      limit: 10,
      page: 1,
      orderBy: 1,
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      status: ''
    }
    dataProp: any = {}
    query: any = {
      page: 1,
      limit: 10,
      total: 10
    }
    dataTable: any = []
    sorts: Array<Record<string, any>> = [
      {
        command: 'REQUEST_DATE',
        label: this.$i18n.t('request.sortBy.requestDate'),
        divided: false,
        i18n: 'request.sortBy.requestDate'
      },
      {
        command: 'AMOUNT',
        label: this.$i18n.t('request.sortBy.amount'),
        divided: false,
        i18n: 'request.sortBy.amount'
      },
      {
        command: 'STATUS',
        label: this.$i18n.t('request.sortBy.status'),
        divided: false,
        i18n: 'request.sortBy.status'
      },
      {
        command: 'NAME',
        label: this.$i18n.t('request.sortBy.name'),
        divided: false,
        i18n: 'request.sortBy.name'
      }
    ]
    filter: any = {
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      status: ''
    }
    optionStatus: any = [
      {
        value: 'locked',
        label: this.$i18n.t('request.filter.pending')
      },
      {
        value: 'rejected',
        label: this.$i18n.t('request.filter.rejected')
      }
    ]
    sortActive = 'REQUEST_DATE'
    orderBy = 'REQUEST_DATE'
    loadingTable = true
    errorType = ''
    get pickerOption(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'from-to')
        }
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
    get getPaginationInfo(): any {
      return this.$t('paging.request')
    }
    handleSizeChange(value: number): void {
      if (value) {
        this.querry.page = 1
        this.query.page = 1
        this.querry.limit = value
        this.query.limit = value
        this.getDataTable()
      }
    }
    handleCurrentChange(value: number): void {
      if (value) {
        this.querry.page = value
        this.query.page = value
        this.getDataTable()
      }
    }
    async getDataTable(): Promise<void> {
      this.loadingTable = true
      await api
        .getDataTable({ ...this.querry, currency: this.tabCoin })
        .then((res: any) => {
          this.loadingTable = false
          this.dataTable = res.transactions.content
          this.query.total = res.totalElements
          this.query.total = res.transactions.totalElements
          this.$emit('summary', res.summaryRequest[0])
        })
        .catch(error => {
          console.log(error)
          this.loadingTable = false
        })
    }
    async init(): Promise<void> {
      await this.getDataTable()
    }
    created(): void {
      this.init()
    }
    @Watch('querry.keywordString')
    handleSearch(): void {
      this.searchText()
    }
    @Watch('tabCoin')
    handleChangeTabCoin(tab: Record<string, any>): void {
      if (tab) {
        this.resetQuery()
        this.handleResetFilter()
        this.getDataTable()
      }
    }

    searchText = debounce(() => {
      this.getDataTable()
    }, 500)

    resetQuery(): void {
      this.querry = {
        ...this.querry,
        currency: '',
        keywordString: '',
        limit: 10,
        page: 1,
        orderBy: 1,
        fromDate: '',
        toDate: '',
        fromAmount: '',
        toAmount: '',
        status: ''
      }
    }
    handleSort(command: string): void {
      this.sortActive = command
      if (command == 'REQUEST_DATE') {
        this.querry.orderBy = 1
      }
      if (command == 'AMOUNT') {
        this.querry.orderBy = 2
      }
      if (command == 'STATUS') {
        this.querry.orderBy = 3
      }
      if (command == 'NAME') {
        this.querry.orderBy = 4
      }
      this.getDataTable()
      this.orderBy = command
    }
    isVisible = false
    handleShowPopper(): void {
      console.log('vao day')
      // switch (this.$route.name) {
      //   case 'CustomerVerified':
      //     this.filter.type = 'Verified'
      //     break
      //   case 'CustomerLocked':
      //     this.filter.type = 'Locked'
      //     break
      //   case 'CustomerNotVerified':
      //     this.filter.type = 'Not verified'
      //     break
      //   case 'CustomerProcessing':
      //     this.filter.type = 'KYC processing'
      //     break
      // }
      this.isVisible = true
    }
    handleResetFilter(): void {
      this.filter = {
        fromDate: '',
        toDate: '',
        fromAmount: '',
        toAmount: '',
        status: ''
      }
    }
    handleApply(): void {
      let filter: any = { ...this.filter }
      if (this.filter.status.length > 0) {
        filter.status = this.filter.status.join()
      }
      if (filter) {
        this.querry.fromDate = filter.fromDate
        this.querry.toDate = filter.toDate
        this.querry.fromAmount = filter.fromAmount.replace(/,/g, '')
        this.querry.toAmount = filter.toAmount.replace(/,/g, '')
        this.querry.status = filter.status
      }

      let fromDate = ''
      let toDate = ''
      if (this.filter.fromDate) {
        fromDate = this.$options.filters?.formatReferral(this.filter.fromDate)
      }
      if (this.filter.toDate) {
        toDate = this.$options.filters?.formatReferral(this.filter.toDate + 86399000)
      }
      this.querry.page = 1
      this.query.page = 1
      this.query = {
        ...this.query,
        fromDate,
        toDate
      }
      this.querry = {
        ...this.querry,
        fromDate,
        toDate
      }
      this.getDataTable()
      this.isVisible = false
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
    handleRowClick(row: Record<string, any>): void {
      this.dataProp = row.row
      this.setOpenPopup({
        popupName: 'popup-withdraw-request',
        isOpen: true
      })
    }
    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
  }
</script>
<style scoped lang="scss">
  .bo-request-withdraw {
    .box-filter {
      margin-bottom: 24px;
    }
    .box-search {
      .input-search {
        width: 400px;
        margin-right: 29px;
        //.prefix-search {
        //  margin-top: 9px;
        //  margin-left: 3px;
        //}
      }
    }
    .btn-filter,
    .sort {
      margin-right: 27.5px;
      color: var(--bc-text-primary);
      .span-icon {
        color: var(--bc-text-primary) !important;
      }
      &:hover {
        color: var(--bc-theme-primary);
        .span-icon {
          color: var(--bc-theme-primary) !important;
        }
      }
    }
    .dropdown-sort {
      min-width: 250px !important;
    }
    .table {
      .table-request {
        .box-status-tabel {
          width: 80px;
          height: 24px;
          background: #e4f9e2;
          color: #129961;
          border-radius: 4px;
          margin: 0 auto;
        }
        .failed {
          background: #fff3e2;
          color: #dd7d00;
        }
        .locked {
          background: #fbedee;
          color: #cf202f;
        }
        .text-paid {
          color: #cf202f;
        }
        .text-amount {
          color: #129961;
        }
        .avi {
          color: #5b616e;
        }
      }
    }
  }
  .error-amount {
    position: absolute;
    bottom: -24px;
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
  .prefix {
    height: 100%;
    font-size: 16px;
    color: #0a0b0d;
    position: absolute;
    left: 8px;
    top: 11px;
  }
  .footer {
    button[disabled] {
      opacity: 0.5;
      background-color: var(--bc-btn-bg-default);
      cursor: not-allowed;
    }
  }
</style>
