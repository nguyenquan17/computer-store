<template>
  <base-popup name="popup-filter-staking" class="popup-filter-staking" width="600px" :isShowFooter="true" :open="handleOpen" :close="handleClose">
    <div slot="title">
      <span>{{ $t('crowdsale.popup-filter.title') }}</span>
    </div>
    <div class="content">
      <el-form class="form">
        <el-form-item label="Token">
          <el-select
            class="w-100 select-token"
            :class="form.currency ? 'selected' : null"
            clearable
            v-model="form.currency"
            :placeholder="$t('crowdsale.popup-filter.planceOderToken')"
          >
            <el-option v-for="item in listAssetToken" :key="item.id" :label="item.currencyName" :value="item.currency">
              <template>
                <div class="be-flex wallet-item">
                  <base-icon :icon="renderIcon(item.currency)" size="24" />
                  <span class="d-ib" style="margin-left: 10px">{{ item.currencyName }}</span>
                  <span class="d-ib" style="margin-left: 4px">({{ item.currency.toUpperCase() }})</span>
                </div>
              </template>
            </el-option>
            <div v-if="form.currency" class="prefix" slot="prefix">
              <base-icon :icon="`icon-${form.currency.toLowerCase()}`" size="24" />
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="Duration type">
          <el-select class="w-100" clearable v-model="form.durationType">
            <el-option v-for="item in listDurationType" :key="item.id" :label="item.value" :value="item.key"> </el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.durationType" class="be-flex jc-space-between amount">
          <el-form-item class="be-flex-item mr-40 form-item-line" :class="errorDuration ? 'error-amount-border-popup-transaction' : null" label="Duration">
            <el-input v-model="form.startDuration" placeholder="From" @keypress.native="onlyNumber($event, 'startDuration')" @keyup.native="numberFormat($event)">
              <div class="prefix-amount" slot="prefix">{{ getTextStart }}</div>
            </el-input>
          </el-form-item>

          <el-form-item class="be-flex-item hide-label" label="1" :class="errorDuration ? 'error-amount-border-popup-transaction' : null">
            <el-input v-model="form.endDuration" placeholder="To" @keypress.native="onlyNumber($event, 'endDuration')" @keyup.native="numberFormat($event)">
              <div class="prefix-amount" slot="prefix">{{ getTextEnd }}</div>
            </el-input>
          </el-form-item>
          <div v-if="errorDuration" class="error-amount">
            <p>{{ $t('error_amount_invalid') }}</p>
          </div>
        </div>
        <div class="be-flex jc-space-between amount">
          <el-form-item class="be-flex-item mr-40 form-item-line" :class="errorApr ? 'error-amount-border-popup-transaction' : null" label="APR">
            <el-input v-model="form.startAPRPercent" placeholder="From" @keypress.native="onlyNumber($event, 'startAPRPercent')" @keyup.native="numberFormat($event)">
              <div class="prefix-amount" slot="prefix">%</div>
            </el-input>
          </el-form-item>

          <el-form-item class="be-flex-item hide-label" label="1" :class="errorApr ? 'error-amount-border-popup-transaction' : null">
            <el-input v-model="form.endAPRPercent" placeholder="To" @keypress.native="onlyNumber($event, 'endAPRPercent')" @keyup.native="numberFormat($event)">
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

        <!-- Staking LVT -->
        <div v-if="$route.name === 'StakingLVT'" class="be-flex jc-space-between row">
          <el-form-item class="be-flex-item mr-40 form-item-line" label="Transaction date">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              value-format="timestamp"
              :placeholder="$t('label.from-date')"
              v-model="form.startDuration"
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
              v-model="form.endDuration"
              type="date"
              :picker-options="pickerOption"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-if="$route.name === 'StakingLVT'" class="be-flex jc-space-between row">
          <el-form-item class="be-flex-item mr-40 form-item-line" label="End stake date">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              value-format="timestamp"
              :placeholder="$t('label.from-date')"
              v-model="form.startDuration"
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
              v-model="form.endDuration"
              type="date"
              :picker-options="pickerOption"
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
  import { IAssetNetwork, IQueryStakingSetup } from '@/interface'

  import { includes } from 'lodash'
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  const beStaking = namespace('beStaking')

  @Component
  export default class PopupFilterStaking extends Vue {
    @beBase.State('listAssetToken') listAssetToken!: IAssetNetwork[]
    @beStaking.State('listDurationType') listDurationType!: Array<Record<string, any>>
    @beStaking.State('listInterestType') listInterestType!: Array<Record<string, any>>

    form: IQueryStakingSetup = {
      currency: '',
      startDuration: '',
      endDuration: '',
      startAPRPercent: '',
      endAPRPercent: '',
      durationType: '',
      interestType: ''
    }
    errorDuration = false
    errorApr = false

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
        if (this.form.startDuration) {
          return time.getTime() / 1000 < new Date(this.form.startDuration).getTime() / 1000
        }
      } else {
        if (this.form.endDuration) {
          return time.getTime() / 1000 > new Date(this.form.endDuration).getTime() / 1000
        }
      }
    }

    get getTextStart(): string {
      if (this.form.startDuration) {
        return Number(this.form.startDuration.replaceAll(',', '')) > 1 ? this.form.durationType.toLowerCase() + 's' : this.form.durationType.toLowerCase()
      }
      return ''
    }
    get getTextEnd(): string {
      if (this.form.endDuration) {
        return Number(this.form.endDuration.replaceAll(',', '')) > 1 ? this.form.durationType.toLowerCase() + 's' : this.form.durationType.toLowerCase()
      }
      return ''
    }

    async handleOpen(): Promise<void> {
      //
    }
    handleClose(): void {
      //
    }
    handleReset(): void {
      this.form = {
        currency: '',
        startDuration: '',
        endDuration: '',
        startAPRPercent: '',
        endAPRPercent: '',
        durationType: '',
        interestType: ''
      }
      this.$emit('filter', this.form)
    }
    handleSubmit(): void {
      if (this.errorDuration || this.errorApr) {
        return
      }
      const filter = {
        ...this.form,
        startDuration: Number(this.form.startDuration.replaceAll(',', '')),
        endDuration: Number(this.form.endDuration.replaceAll(',', '')),
        startAPRPercent: Number(this.form.startAPRPercent.replaceAll(',', '')),
        endAPRPercent: Number(this.form.endAPRPercent.replaceAll(',', ''))
      }
      this.$emit('filter', filter)
    }

    resetFilterWhenChangeTab(): void {
      this.form = {
        currency: '',
        startDuration: '',
        endDuration: '',
        startAPRPercent: '',
        endAPRPercent: '',
        durationType: ''
      }
    }

    renderIcon(type: string): string {
      type = type.toLowerCase()
      return `icon-${type}`
    }

    checkValidDuration(): void {
      let toAmount = parseFloat(this.form.endDuration.replaceAll(',', ''))
      let fromAmount = parseFloat(this.form.startDuration.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorDuration = true
      } else {
        this.errorDuration = false
      }
    }

    checkValidApr(): void {
      let toAmount = parseFloat(this.form.endAPRPercent.replaceAll(',', ''))
      let fromAmount = parseFloat(this.form.startAPRPercent.replaceAll(',', ''))
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
