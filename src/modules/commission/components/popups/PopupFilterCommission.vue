<template>
  <base-popup name="popup-filter-commission" class="popup-filter-commission" width="600px" :isShowFooter="true" :open="handleOpen" :close="handleClose">
    <div slot="title">
      <span>{{ $t('crowdsale.popup-filter.title') }}</span>
    </div>
    <div class="content mb-24">
      <el-form class="form">
        <div class="content-block">
          <p class="nft-body-base-small text-regular text-primary">{{ $t('Sales member') }}</p>
          <el-select
            :disabled="disabledRefCode"
            class="w-100 mt-8 filter-select"
            autocomplete="off"
            v-model="filterCommission.salesMemberAffiliationCode"
            :placeholder="$t('Search referral code, name, email')"
            filterable
            remote
            @focus="filterMethods.filterSaleRemote('')"
            :remote-method="filterMethods.filterSaleRemote"
            :popper-append-to-body="false"
          >
            <div v-infinite-scroll="filterMethods.loadmoreSalesMember" infinite-scroll-delay="500">
              <el-option v-for="(option, index) in salesMemberSearchList" :value="option.affiliationCode" :key="index" @click.native="filterCommission.salesMember = option.id">
                <div class="filter-select-item">
                  <div class="account-name text-base text-primary text-regular" :class="filterCommission.salesMember === option.id ? 'active' : null">
                    {{ option.affiliationCode }}
                  </div>
                  <div class="text-sm text-regular text-desc">
                    <span>{{ option.fullName }}</span> | <span>{{ option.email }}</span>
                  </div>
                </div>
              </el-option>
            </div>
          </el-select>
        </div>
        <div class="content-block mt-24">
          <p class="content-block__title">{{ $t('Transaction Date') }}</p>
          <div class="content-block__inputs mt-8">
            <el-date-picker
              :placeholder="$t('metamart.nft.filter.from-date')"
              format="MM/dd/yyyy"
              value-format="timestamp"
              v-model="filterCommission.fromDate"
              prefix-icon="el-icon-date"
              type="date"
              class="input-small"
              :picker-options="pickerOption2"
            ></el-date-picker>
            <span style="display: block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
            <el-date-picker
              :placeholder="$t('metamart.nft.filter.to-date')"
              format="MM/dd/yyyy"
              value-format="timestamp"
              v-model="filterCommission.toDate"
              prefix-icon="el-icon-date"
              type="date"
              class="input-small"
              :picker-options="pickerOption"
            ></el-date-picker>
          </div>
        </div>
        <div class="content-block mt-24">
          <p class="nft-body-base-small text-regular text-primary">{{ $t('Investor') }}</p>
          <el-select
            class="w-100 mt-8 filter-select"
            :value="filterCommission.investorName"
            :placeholder="$t('E.g: Newtheman')"
            filterable
            remote
            @focus="filterMethods.filterInvestorRemote('')"
            :remote-method="filterMethods.filterInvestorRemote"
            :popper-append-to-body="false"
          >
            <div v-infinite-scroll="filterMethods.loadmoreInvestor" infinite-scroll-delay="500">
              <el-option v-for="(option, index) in investorSearchList" :value="option.id" :key="index" @click.native="handleSelectInvestor(option)">
                <div class="filter-select-item">
                  <div class="account-name text-base text-primary text-regular" :class="filterCommission.investor === option.id ? 'active' : null">
                    {{ option.accountName }}
                  </div>
                  <div class="text-sm text-regular text-desc">
                    <span>{{ option.username }}</span> | <span>{{ option.address | formatTransactionCode(5, 5) }}</span>
                  </div>
                </div>
              </el-option>
            </div>
          </el-select>
        </div>
        <div class="content-block mt-24">
          <p class="content-block__title">{{ $t('Quantity') }}</p>
          <div class="content-block__inputs mt-8">
            <el-input
              class="input-small"
              v-model="filterCommission.fromQuantity"
              :placeholder="$t('label.from')"
              clearable
              @keypress.native="onlyNumber($event, 'fromQuantity')"
              @keyup.native="numberFormat($event)"
              @blur="checkValidQuantity"
              :class="error.quantity && 'error-amount-border-popup-transaction'"
            >
            </el-input>
            <span style="display: block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
            <el-input
              class="input-small"
              v-model="filterCommission.toQuantity"
              :placeholder="$t('label.to')"
              clearable
              @keypress.native="onlyNumber($event, 'toQuantity')"
              @keyup.native="numberFormat($event)"
              @blur="checkValidQuantity"
              :class="error.quantity && 'error-amount-border-popup-transaction'"
            />
          </div>
        </div>
        <div v-show="error.quantity" class="nft-body-base-small text-regular text-error">
          <p>{{ $t('notify.quantity-invalid') }}</p>
        </div>
        <div class="content-block mt-24">
          <p class="content-block__title">{{ $t('Transaction Amount') }}</p>
          <div class="content-block__inputs mt-8">
            <el-input
              class="input-small"
              v-model="filterCommission.fromAmount"
              :placeholder="$t('label.from')"
              clearable
              @keypress.native="onlyNumber($event, 'fromAmount')"
              @keyup.native="numberFormat($event)"
              @blur="checkValidAmount"
              :class="error.amount && 'error-amount-border-popup-transaction'"
            >
              <div slot="prefix" class="prefix-input text-base text-primary text-regular">$</div>
            </el-input>
            <span style="display: block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
            <el-input
              class="input-small"
              v-model="filterCommission.toAmount"
              :placeholder="$t('label.to')"
              clearable
              @keypress.native="onlyNumber($event, 'toAmount')"
              @keyup.native="numberFormat($event)"
              @blur="checkValidAmount"
              :class="error.amount && 'error-amount-border-popup-transaction'"
            >
              <div slot="prefix" class="prefix-input text-base text-primary text-regular">$</div>
            </el-input>
          </div>
        </div>
        <div v-show="error.amount" class="nft-body-base-small text-regular text-error">
          <p>{{ $t('notify.amount-invalid') }}</p>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="be-flex footer">
      <div @click="handleReset" class="btn-action btn-close">{{ $t('crowdsale.popup-filter.reset') }}</div>
      <div @click="handleSubmit" class="btn-action btn-submit" :class="error.amount || error.quantity ? 'disabled' : null">{{ $t('crowdsale.popup-filter.apply') }}</div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { includes } from 'lodash'
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beAuth = namespace('beAuth')

  interface IFilterSalesMember {
    id?: string | number
    affiliationCode?: string
    fullName?: string
    email?: string
  }

  interface IFilterCommission {
    salesMember?: string | number
    salesMemberAffiliationCode: string | number
    investorName: string | number
    investor: string | number
    fromDate: string | number
    toDate: string | number
    fromQuantity: string
    toQuantity: string
    fromAmount: string
    toAmount: string
  }

  @Component
  export default class PopupFilterCommission extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Array, default: () => [] }) salesMemberSearchList!: Array<IFilterSalesMember>
    @Prop({ required: false, type: Array, default: () => [] }) investorSearchList!: Array<Record<string, any>>

    @beAuth.State('role') role!: Record<string, any>
    @beAuth.State('user') user!: Record<string, any>

    public filterCommission: IFilterCommission = {
      salesMember: '',
      salesMemberAffiliationCode: '',
      investorName: '',
      investor: '',
      fromDate: '',
      toDate: '',
      fromQuantity: '',
      toQuantity: '',
      fromAmount: '',
      toAmount: ''
    }

    public error: Record<string, any> = {
      amount: false,
      quantity: false
    }

    get pickerOption(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'from-to')
        }
      }
    }
    get pickerOption2(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'to-from')
        }
      }
    }

    get disabledRefCode(): boolean {
      if (this.role.userRole.length === 1 && this.role.userRole[0] === 'MARKETING') {
        return true
      }
      return false
    }

    get investorPlaceholder(): string {
      return this.filterCommission.investorName as string
    }

    public filterMethods = {
      filterSaleRemote: (query: string): void => {
        this.$emit('filter-sale-remote', query)
      },
      loadmoreSalesMember: (): void => {
        this.$emit('loadmore-sale-member')
      },
      filterInvestorRemote: (query: string): void => {
        this.$emit('filter-investor-remote', query)
      },
      loadmoreInvestor: (): void => {
        this.$emit('loadmore-investor')
      }
    }
    public handleSelectInvestor(option: Record<string, any>): void {
      this.filterCommission.investorName = option.accountName
      this.filterCommission.investor = option.id
    }
    public handleReset(): void {
      this.filterCommission = {
        salesMember: '',
        salesMemberAffiliationCode: '',
        investorName: '',
        investor: '',
        fromDate: '',
        toDate: '',
        fromQuantity: '',
        toQuantity: '',
        fromAmount: '',
        toAmount: ''
      }
      if (this.role.userRole.length === 1 && this.role.userRole[0] === 'MARKETING') {
        this.filterCommission.salesMember = this.user.userId
        this.filterCommission.salesMemberAffiliationCode = this.user.affiliationCode
      }
      this.$emit('filter', this.filterCommission)
      this.handleClose()
    }
    public handleSubmit(): void {
      if (this.error.amount || this.error.quantity) return
      this.$emit('filter', this.filterCommission)
      this.handleClose()
    }
    public handleOpen(): void {
      if (this.role.userRole.length === 1 && this.role.userRole[0] === 'MARKETING') {
        this.filterCommission.salesMember = this.user.userId
        this.filterCommission.salesMemberAffiliationCode = this.user.affiliationCode
      }
    }
    public handleClose(): void {
      this.$emit('reset-filter')
      this.setOpenPopup({
        popupName: 'popup-filter-commission',
        isOpen: false
      })
    }

    public onlyNumber(event: KeyboardEvent, type: string): void {
      const keyCode = event.keyCode ? event.keyCode : event.which
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.filterCommission[type], '.')) {
        event.preventDefault()
      }
    }

    public numberFormat(event: FocusEvent): void {
      this.checkValidAmount()
      this.checkValidQuantity()
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }

    public checkValidAmount(): void {
      let toAmount = parseFloat(this.filterCommission.toAmount.replaceAll(',', ''))
      let fromAmount = parseFloat(this.filterCommission.fromAmount.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.error.amount = true
      } else {
        this.error.amount = false
      }
    }

    public checkValidQuantity(): void {
      let toAmount = parseFloat(this.filterCommission.toQuantity.replaceAll(',', ''))
      let fromAmount = parseFloat(this.filterCommission.fromQuantity.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.error.quantity = true
      } else {
        this.error.quantity = false
      }
    }

    private disableTime(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.filterCommission.fromDate) {
          return time.getTime() / 1000 < new Date(this.filterCommission.fromDate).getTime() / 1000
        }
      } else {
        if (this.filterCommission.toDate) {
          return time.getTime() / 1000 > new Date(this.filterCommission.toDate).getTime() / 1000
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .popup-filter-commission {
    ::v-deep.form {
      .content-block {
        .content-block__inputs {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .input-small {
            width: 256px;
            .prefix-input {
              height: 100%;
              display: flex;
              align-items: center;
              margin-left: 7px;
            }
          }
        }
        &:last-child {
          .content-block__label {
            padding-left: 20px;
          }
          .content-block__wrap {
            text-align: right;
          }
        }

        .filter-select {
          .el-select-dropdown__item {
            height: 58px;
            padding: 8px 12px;
            .filter-select-item {
              display: flex;
              flex-direction: column;
              .account-name {
                height: 24px;
              }
              .active {
                color: #0151fc;
              }
            }
          }
        }
      }
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .btn-action {
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        border-radius: 6px;

        &:hover {
          color: var(--bc-btn-default-text-hover);
          border: 1px solid var(--bc-btn-default-border-hover);
        }
      }

      .btn-close {
        background: var(--bc-color-white);
        border: 1px solid var(--bc-color-grey50);
        color: var(--bc-color-grey150);
        margin-right: 16px;
      }

      .btn-submit {
        user-select: none;
        color: var(--bc-color-white);
        background: var(--bc-btn-bg-default);
        border: none;

        &:hover {
          border: none;
          color: var(--bc-color-white);
          background: var(--bc-btn-bg-default-hover);
        }

        &.disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }
      }
    }
  }
</style>
