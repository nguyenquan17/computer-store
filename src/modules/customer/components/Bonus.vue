<template>
  <div class="list-bonus">
    <filter-main :sorts="sorts" @filter="handleFilter">
      <div class="filter-item">
        <el-popover :value="isVisible" placement="bottom-start" width="518" trigger="click" popper-class="popper-filter" @show="handleShowPopper">
          <div class="content">
            <el-form>
              <div class="be-flex jc-space-between row">
                <el-form-item class="be-flex-item mr-40" :label="$t('label.trans-type')">
                  <el-select v-model="filter.transactionType" :placeholder="$t('placeholder.select-type')" class="w-100" clearable>
                    <el-option v-for="(type, index) in listType" :key="index" :label="type.name" :value="type.value" />
                  </el-select>
                </el-form-item>
                <el-form-item class="be-flex-item" :label="$t('label.status')">
                  <el-select v-model="filter.status" id-type :placeholder="$t('placeholder.status')" class="w-100" clearable>
                    <el-option v-for="(status, index) in listStatus" :key="index" :label="status.name" :value="status.value" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="be-flex jc-space-between row">
                <el-form-item class="be-flex-item mr-40" :label="$t('label.date')">
                  <el-date-picker
                    class="w-100"
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
                    class="w-100"
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
              <div class="be-flex jc-space-between row" style="position: relative">
                <el-form-item class="be-flex-item mr-40 form-item-line" :label="$t('label.trans-amount')">
                  <el-input
                    v-model="filter.fromAmount"
                    :placeholder="$t('placeholder.from-amount')"
                    @keypress.native="onlyNumber($event, 'fromAmount')"
                    @keyup.native="numberFormat($event)"
                  >
                    <div class="prefix" slot="prefix">$</div>
                  </el-input>
                </el-form-item>

                <el-form-item class="be-flex-item hide-label" label="1">
                  <el-input
                    v-model="filter.toAmount"
                    :placeholder="$t('placeholder.to-amount')"
                    @keypress.native="onlyNumber($event, 'toAmount')"
                    @keyup.native="numberFormat($event)"
                  >
                    <div class="prefix" slot="prefix">$</div>
                  </el-input>
                </el-form-item>
                <div v-if="errorType === 'amount'" class="error-amount">
                  <p>{{ $t('notify.amount-invalid') }}</p>
                </div>
              </div>
            </el-form>
          </div>
          <div class="be-flex jc-flex-end footer">
            <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular" @click="handleReset">
              {{ $t('button.reset') }}
            </el-button>
            <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular" @click="handleApply">
              {{ $t('button.apply') }}
            </el-button>
          </div>
          <div slot="reference" class="cursor text-filter" style="font-size: 16px">
            <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 4px" icon="icon-filter" size="18" /> </span>
            {{ $t('kyc.filter.filter') }}
          </div>
        </el-popover>
        <!-- <div class="cursor text-filter" style="font-size: 16px">
        <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
        {{ $t('kyc.filter.filter') }}
      </div> -->
      </div>
    </filter-main>
    <div class="table" v-loading="isLoading" :class="isLoading ? 'list-loading' : null">
      <base-table
        :data="listBonus"
        :table="query"
        :paginationInfo="getPaginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        class="base-table table-wallet"
      >
        <el-table-column label="#" :index="getIndex" type="index" width="50" />
        <el-table-column :label="$t('customer.table.trans-id')">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <span class="d-ib">{{ scope.row.transactionCode | formatTransactionCode(6) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="45">
          <template slot-scope="scope">
            <span v-if="scope.row.transactionCode" class="icon-copy" @click="handleCopyTransaction(scope.row)">
              <base-icon icon="icon-copy" size="24" />
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.type')" width="210">
          <template slot-scope="scope">
            <span>{{ switchTypeBounus(scope.row.bonusProgramCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.date')" width="180">
          <template slot-scope="scope">
            <span class="text-base">{{ scope.row.transactionDate | formatMMDDYY }} </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.status')" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status" :class="checkTypeClass(scope.row.status)">{{ getTypeStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.amount')" align="right" width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.tokenAmount" class="amount-increase">
              <span>+{{ scope.row.tokenAmount | convertAmountDecimal(scope.row.tokenCurrency) }} {{ scope.row.tokenCurrency }}</span>
              <span class="d-block amount-exchange-small">~${{ scope.row.tokenAmountToUsd | convertAmountDecimal('USD') }}</span>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import FilterMain from '@/components/filter/FilterMain.vue'

  import { namespace } from 'vuex-class'

  import includes from 'lodash/includes'

  import getRepository from '@/services'
  import { CustomerRepository } from '@/services/repositories/customer'

  const apiCustomer: CustomerRepository = getRepository('customer')
  const beBase = namespace('beBase')

  @Component({ components: { FilterMain } })
  export default class CustomerBonus extends Vue {
    @Prop({ required: true, type: Number, default: 0 }) userId!: number

    listBonus: Record<string, any>[] = []
    isLoading = false
    filter: Record<string, any> = {
      fromAmount: '',
      toAmount: '',
      toDate: '',
      fromDate: '',
      status: '',
      transactionType: ''
    }
    errorType = ''
    query: Record<string, any> = {
      page: 1,
      limit: 10,
      total: 0
    }
    sorts: Array<Record<string, any>> = [
      {
        command: 1,
        label: this.$i18n.t('customer.sort.date'),
        divided: false,
        i18n: 'customer.sort.date'
      },
      {
        command: 2,
        label: this.$i18n.t('customer.sort.amount'),
        divided: false,
        i18n: 'customer.sort.amount'
      }
    ]

    listType: Array<Record<string, any>> = [
      {
        id: 0,
        name: 'Sign Up Bonus',
        value: 'BONUS_SIGN_UP'
      },
      {
        id: 1,
        name: 'First Transaction Bonus',
        value: 'BONUS_FIRST_TRANS'
      },
      {
        id: 2,
        name: 'Crowdsale Bonus',
        value: 'BONUS_CROWDSALE'
      },
      {
        id: 3,
        name: 'Big Backers Bonus',
        value: 'BONUS_BIG_BACKER'
      }
    ]
    listStatus: Array<Record<string, any>> = [
      {
        id: 0,
        name: 'Pending',
        value: 'PENDING'
      },
      {
        id: 1,
        name: 'Paid',
        value: 'PAID'
      }
    ]

    isVisible = false

    created(): void {
      this.handleGetListBonus()
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

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    get getPaginationInfo(): any {
      return this.$t('paging.transaction')
    }

    async handleGetListBonus(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          total: null,
          userId: this.userId,
          fromDate: this.fromDate,
          toDate: this.toDate
        }
        const result = await apiCustomer.getlistBonus(params)
        this.listBonus = result.content
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleSizeChange(value: number): void {
      this.query.limit = value
      this.handleGetListBonus()
    }

    handleCurrentChange(value: number): void {
      this.query.page = value
      this.handleGetListBonus()
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = { ...this.query, ...filter }
      this.handleGetListBonus()
    }
    fromDate = ''
    toDate = ''
    handleApply(): void {
      this.fromDate = ''
      this.toDate = ''
      this.query = { ...this.query, ...this.filter, page: 1 }
      if (this.filter.fromDate) {
        this.fromDate = this.$options.filters?.formatReferral(this.filter.fromDate)
      }
      if (this.filter.toDate) {
        this.toDate = this.$options.filters?.formatReferral(this.filter.toDate + 86399000)
      }
      this.handleGetListBonus()
      this.isVisible = false
    }

    handleReset(): void {
      this.filter = {
        fromAmount: '',
        toAmount: '',
        toDate: '',
        fromDate: '',
        status: '',
        transactionType: ''
      }
      this.fromDate = ''
      this.toDate = ''
      this.query = { ...this.query, ...this.filter }
      this.handleGetListBonus()
      this.isVisible = false
    }

    handleCopyTransaction(row: Record<string, any>): void {
      let message: any = ''
      const el = document.createElement('input')
      el.value = row.transactionCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }

    checkTypeClass(status: string): string {
      if (status === 'PENDING') {
        return 'status-pending'
      } else {
        return 'status-success'
      }
    }

    getTypeStatus(status: string): any {
      if (status === 'PENDING') {
        return this.$t('customer.table.pending')
      } else {
        return this.$t('customer.table.paid')
      }
    }
    switchTypeBounus(type: string): any {
      switch (type) {
        case 'BONUS_SIGN_UP':
          return this.$t('customer.table.bonus-signup')
        case 'BONUS_CROWDSALE':
          return this.$t('customer.table.bonus-crowdsale')
        case 'BONUS_FIRST_TRANS':
          return this.$t('customer.table.bonus-first-trans')
        case 'BONUS_AFFILIATE':
          return this.$t('customer.table.bonus-affilicate')
        case 'BONUS_BIG_BACKER':
          return this.$t('customer.table.bonus-big-backer')
        case 'BONUS_SIGN_UP_REFERRAL':
          return this.$i18n.t('customer.table.bonus-sign-up-referral')
        default:
          return this.$t('customer.table.bonus-early-backer')
      }
    }

    handleShowPopper(): void {
      this.isVisible = true
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
  .list-bonus {
    .input-search {
      width: 400px;
      margin-right: 30px;
    }

    .sort {
      cursor: pointer;
      color: #0a0b0d;
    }

    .list-loading {
      min-height: 200px;
    }

    .table {
      padding: 0 24px;

      .small {
        font-size: 14px !important;
        line-height: 16px;
        color: #5b616e;
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
</style>
