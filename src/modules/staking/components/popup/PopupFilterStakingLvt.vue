<template>
  <base-popup name="popup-filter-staking-lvt" class="popup-filter-staking" width="600px" :isShowFooter="true" :open="handleOpen" :close="handleClose">
    <div slot="title">
      <span>{{ $t('crowdsale.popup-filter.title') }}</span>
    </div>
    <div class="content">
      <el-form class="form">
        <el-form-item label="Package">
          <el-select class="w-100" clearable v-model="form.planId">
            <el-option v-for="item in allStaking" :key="item.id" :label="item.planName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Duration type">
          <el-select class="w-100" clearable v-model="form.durationType">
            <el-option v-for="item in listDurationType" :key="item.id" :label="item.value" :value="item.key"> </el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.durationType" class="be-flex jc-space-between amount">
          <el-form-item class="be-flex-item mr-40 form-item-line" :class="errorDuration ? 'error-amount-border-popup-transaction' : null" label="Duration">
            <el-input v-model="form.fromDuration" placeholder="From" @keypress.native="onlyNumber($event, 'fromDuration')" @keyup.native="numberFormat($event)">
              <div class="prefix-amount" slot="prefix">{{ getTextStart }}</div>
            </el-input>
          </el-form-item>

          <el-form-item class="be-flex-item hide-label" label="1" :class="errorDuration ? 'error-amount-border-popup-transaction' : null">
            <el-input v-model="form.toDuration" placeholder="To" @keypress.native="onlyNumber($event, 'toDuration')" @keyup.native="numberFormat($event)">
              <div class="prefix-amount" slot="prefix">{{ getTextEnd }}</div>
            </el-input>
          </el-form-item>
          <div v-if="errorDuration" class="error-amount">
            <p>{{ $t('error_amount_invalid') }}</p>
          </div>
        </div>
        <div class="be-flex jc-space-between amount">
          <el-form-item class="be-flex-item mr-40 form-item-line" :class="errorApr ? 'error-amount-border-popup-transaction' : null" label="APR">
            <el-input v-model="form.fromAPRPercent" placeholder="From" @keypress.native="onlyNumber($event, 'fromAPRPercent')" @keyup.native="numberFormat($event)">
              <div class="prefix-amount" slot="prefix">%</div>
            </el-input>
          </el-form-item>

          <el-form-item class="be-flex-item hide-label" label="1" :class="errorApr ? 'error-amount-border-popup-transaction' : null">
            <el-input v-model="form.toAPRPercent" placeholder="To" @keypress.native="onlyNumber($event, 'toAPRPercent')" @keyup.native="numberFormat($event)">
              <div class="prefix-amount" slot="prefix">%</div>
            </el-input>
          </el-form-item>
          <div v-if="errorApr" class="error-amount">
            <p>{{ $t('error_amount_invalid') }}</p>
          </div>
        </div>
        <el-form-item label="Distribution type">
          <el-select class="w-100" clearable v-model="form.interestType">
            <el-option v-for="item in listInterestType" :key="item.id" :label="item.value" :value="item.key"> </el-option>
          </el-select>
        </el-form-item>

        <div class="be-flex jc-space-between row">
          <el-form-item class="be-flex-item mr-40 form-item-line" label="Transaction date">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              value-format="timestamp"
              :placeholder="$t('label.from-date')"
              v-model="form.fromTransactionDate"
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
              v-model="form.toTransactionDate"
              type="date"
              :picker-options="pickerOption"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="be-flex jc-space-between row">
          <el-form-item class="be-flex-item mr-40 form-item-line" label="End stake date">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              value-format="timestamp"
              :placeholder="$t('label.from-date')"
              v-model="form.fromEndStakeDate"
              type="date"
              :picker-options="pickerOptionEndStake2"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item class="be-flex-item hide-label" label="1">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              :placeholder="$t('label.to-date')"
              value-format="timestamp"
              v-model="form.toEndStakeDate"
              type="date"
              :picker-options="pickerOptionEndStake"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="be-flex footer">
      <div @click="handleReset" class="btn-action btn-close">{{ $t('crowdsale.popup-filter.reset') }}</div>
      <div @click="handleSubmit" class="btn-action btn-submit">{{ $t('crowdsale.popup-filter.apply') }}</div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { IAssetNetwork, IQueryStakingLvt, IQueryStakingSetup } from '@/interface'
  import getRepository from '@/services'
  import StakingRepository from '@/services/repositories/staking'

  import { includes } from 'lodash'
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  const beStaking = namespace('beStaking')

  const apiStaking: StakingRepository = getRepository('staking')

  @Component
  export default class PopupFilterStakingLvt extends Vue {
    @beBase.State('listAssetToken') listAssetToken!: IAssetNetwork[]
    @beStaking.State('listDurationType') listDurationType!: Array<Record<string, any>>
    @beStaking.State('listInterestType') listInterestType!: Array<Record<string, any>>

    form: IQueryStakingLvt = {
      planId: '',
      fromDuration: '',
      toDuration: '',
      fromAPRPercent: '',
      toAPRPercent: '',
      interestType: '',
      fromTransactionDate: '',
      toTransactionDate: '',
      fromEndStakeDate: '',
      toEndStakeDate: ''
    }
    errorDuration = false
    errorApr = false

    allStaking: Array<Record<string, any>> = []

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
    get pickerOptionEndStake(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTimeStake(time, 'from-to')
        }
      }
    }

    get pickerOptionEndStake2(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTimeStake(time, 'to-from')
        }
      }
    }

    disableTime(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.form.fromTransactionDate) {
          return time.getTime() / 1000 < new Date(this.form.fromTransactionDate).getTime() / 1000
        }
      } else {
        if (this.form.toTransactionDate) {
          return time.getTime() / 1000 > new Date(this.form.toTransactionDate).getTime() / 1000
        }
      }
    }
    disableTimeStake(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.form.fromEndStakeDate) {
          return time.getTime() / 1000 < new Date(this.form.fromEndStakeDate).getTime() / 1000
        }
      } else {
        if (this.form.toEndStakeDate) {
          return time.getTime() / 1000 > new Date(this.form.toEndStakeDate).getTime() / 1000
        }
      }
    }

    get getTextStart(): string {
      if (this.form.fromDuration) {
        return Number(this.form.fromDuration.replaceAll(',', '')) > 1 ? this.form.durationType?.toLowerCase() + 's' : this.form.durationType!.toLowerCase()
      }
      return ''
    }
    get getTextEnd(): string {
      if (this.form.toDuration) {
        return Number(this.form.toDuration.replaceAll(',', '')) > 1 ? this.form.durationType?.toLowerCase() + 's' : this.form.durationType!.toLowerCase()
      }
      return ''
    }

    async handleOpen(): Promise<void> {
      if (!this.allStaking.length) {
        const result = await apiStaking.getListStakingInvestor({ page: 1, limit: 10000 })
        this.allStaking = result.content || []
      }
    }
    handleClose(): void {
      //
    }
    handleReset(): void {
      this.form = {
        planId: '',
        fromDuration: '',
        toDuration: '',
        fromAPRPercent: '',
        toAPRPercent: '',
        interestType: '',
        fromTransactionDate: '',
        toTransactionDate: '',
        fromEndStakeDate: '',
        toEndStakeDate: ''
      }
      this.$emit('filter', this.form)
    }
    handleSubmit(): void {
      if (this.errorDuration || this.errorApr) {
        return
      }
      const filter = {
        ...this.form,
        fromDuration: Number(this.form.fromDuration.replaceAll(',', '')),
        toDuration: Number(this.form.toDuration.replaceAll(',', '')),
        fromAPRPercent: Number(this.form.fromAPRPercent.replaceAll(',', '')),
        toAPRPercent: Number(this.form.toAPRPercent.replaceAll(',', '')),
        fromTransactionDate: this.$options.filters?.formatDateInGMT(this.form.fromTransactionDate, 'from'),
        toTransactionDate: this.$options.filters?.formatDateInGMT(this.form.toTransactionDate, 'to'),
        fromEndStakeDate: this.$options.filters?.formatDateInGMT(this.form.fromEndStakeDate, 'from'),
        toEndStakeDate: this.$options.filters?.formatDateInGMT(this.form.toEndStakeDate, 'to')
      }
      this.$emit('filter', filter)
    }

    resetFilterWhenChangeTab(): void {
      this.form = {
        planId: '',
        fromDuration: '',
        toDuration: '',
        fromAPRPercent: '',
        toAPRPercent: '',
        interestType: '',
        fromTransactionDate: '',
        toTransactionDate: '',
        fromEndStakeDate: '',
        toEndStakeDate: ''
      }
    }

    renderIcon(type: string): string {
      type = type.toLowerCase()
      return `icon-${type}`
    }

    checkValidDuration(): void {
      let fromAmount = parseFloat(this.form.fromDuration.replaceAll(',', ''))
      let toAmount = parseFloat(this.form.toDuration.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorDuration = true
      } else {
        this.errorDuration = false
      }
    }

    checkValidApr(): void {
      let fromAmount = parseFloat(this.form.fromAPRPercent.replaceAll(',', ''))
      let toAmount = parseFloat(this.form.toAPRPercent.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorApr = true
      } else {
        this.errorApr = false
      }
    }

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      this.checkValidDuration()
      this.checkValidApr()
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
      if (keyCode === 46 && includes(this.form[type], '.')) {
        event.preventDefault()
      }
    }
  }
</script>

<style scoped lang="scss">
  .popup-filter-staking {
    ::v-deep.form {
      .selected {
        .el-input {
          &__inner {
            padding-left: 44px;
          }
          &__prefix {
            top: 4px;
            left: 12px;
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
      .amount {
        position: relative;
        .el-input {
          &__inner {
            padding-left: 15px;
            padding-right: 50px;
          }
          &__prefix {
            right: 12px;
            left: unset;
            top: 4px;
          }
        }
        .error-amount {
          position: absolute;
          bottom: 0;
          left: 0;

          p {
            font-size: 12px;
            line-height: 20px;
            color: #cf202f;
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
        color: var(--bc-color-white);
        background: var(--bc-btn-bg-default);
        border: none;

        &:hover {
          border: none;
          color: var(--bc-color-white);
          background: var(--bc-btn-bg-default-hover);
        }
      }
    }
  }
</style>
