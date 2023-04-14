<template>
  <base-popup name="popup-filter-crowdsale" class="popup-filter-crowdsale" width="600px" :isShowFooter="true" :open="handleOpen" :close="handleClose">
    <div slot="title">
      <span>{{ $t('crowdsale.popup-filter.title') }}</span>
    </div>
    <div class="content">
      <el-form class="form-filter-crowdsale">
        <div class="box-input-1 be-flex align-center jc-space-between">
          <div class="round">
            <div class="label">{{ $t('crowdsale.popup-filter.round') }}</div>
            <el-form-item prop="roundId" class="box-input">
              <el-select class="select" v-model="form.roundId" :placeholder="$t('crowdsale.popup-filter.planceOderRound')" clearable>
                <div infinite-scroll-delay="500">
                  <el-option v-for="item in optionByRound" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </div>
              </el-select>
            </el-form-item>
          </div>
          <div class="country">
            <div class="label">{{ $t('crowdsale.popup-filter.country') }}</div>
            <el-form-item prop="countryName" class="box-input">
              <el-select
                class="select"
                v-model="form.countryName"
                filterable
                reserve-keyword
                remote
                :remote-method="remoteCountry"
                :placeholder="$t('crowdsale.popup-filter.planceOderCountry')"
                clearable
              >
                <el-option v-for="(country, index) in listCountry" :key="index" :label="country.name" :value="country.name" />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="by-with-wallet">
          <div class="label">{{ $t('crowdsale.popup-filter.buyWithWallet') }}</div>
          <el-form-item prop="paidWallet" class="box-input">
            <el-select class="select" v-model="form.paidWallet" :placeholder="$t('crowdsale.popup-filter.planceOderWallet')" clearable>
              <div infinite-scroll-delay="500">
                <el-option v-for="item in optionByWallet" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </div>
            </el-select>
          </el-form-item>
        </div>
        <div class="by-with-token">
          <div class="label">{{ $t('crowdsale.popup-filter.buyWithToken') }}</div>
          <el-form-item prop="currency" class="box-input">
            <el-select class="select" v-model="form.currency" multiple :placeholder="$t('crowdsale.popup-filter.planceOderToken')">
              <div infinite-scroll-delay="500">
                <el-option v-for="(item, index) in optionByToken" :key="index" :label="item.currency" :value="item.currency">
                  <template>
                    <div class="be-flex wallet-item">
                      <base-icon :icon="renderIcon(item.currency)" size="24" />
                      <span class="d-ib" style="margin-left: 10px">{{ item.currencyName }}</span>
                      <span class="d-ib" style="margin-left: 4px">({{ item.currency.toUpperCase() }})</span>
                    </div>
                  </template>
                </el-option>
              </div>
            </el-select>
          </el-form-item>
        </div>
        <div class="label">{{ $t('crowdsale.popup-filter.transactionDate') }}</div>
        <div class="box-input-2 transaction-date be-flex align-center jc-space-between">
          <el-form-item prop="fromDate" class="box-input">
            <el-date-picker
              class="box-input"
              v-model="form.fromDate"
              value-format="timestamp"
              format="MM/dd/yyyy"
              type="date"
              clearable
              :picker-options="pickerOption2"
              :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateStart')"
            >
            </el-date-picker>
          </el-form-item>

          <div class="line"></div>
          <el-form-item prop="toDate" class="box-input">
            <el-date-picker
              :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateEnd')"
              class="box-input"
              v-model="form.toDate"
              value-format="timestamp"
              format="MM/dd/yyyy"
              type="date"
              clearable
              :picker-options="pickerOption"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="label">{{ $t('crowdsale.popup-filter.transactionAmount') }}</div>
        <div class="box-input-3 transaction-amount be-flex align-center jc-space-between">
          <el-form-item prop="fromAmount" class="box-input">
            <el-input
              :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateStart')"
              v-model="form.fromAmount"
              clearable
              @keypress.native="onlyNumber($event, 'toAmount')"
              @keyup.native="numberFormat($event)"
              type="text"
            ></el-input>
            <div class="dolar fw-400 fs-16">$</div>
          </el-form-item>

          <div class="line"></div>
          <el-form-item prop="toAmount" class="box-input">
            <el-input
              :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateEnd')"
              @keypress.native="onlyNumber($event, 'toAmount')"
              v-model="form.toAmount"
              clearable
              @keyup.native="numberFormat($event)"
              type="text"
            ></el-input>
            <div class="dolar fw-400 fs-16">$</div>
          </el-form-item>
          <div v-if="errorType === 'amount'" class="error-amount">
            <p>{{ $t('notify.amount-invalid') }}</p>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="footer">
      <div @click="handleReset" class="btn-action btn-close">{{ $t('crowdsale.popup-filter.reset') }}</div>
      <div @click="handleSubmit" class="btn-action btn-submit">{{ $t('crowdsale.popup-filter.apply') }}</div>
    </div>
  </base-popup>
</template>
<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { trim, filter, debounce } from 'lodash'
  import getRepository from '@/services'
  import countryJson from '@/utils/country/index.json'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'
  import { formatType } from '@/configs'
  import includes from 'lodash/includes'

  interface IListCountry {
    name: string
    dial_code: string
    code: string
  }

  const api: CrowdsaleRepository = getRepository('crowdsale')
  @Component({ components: {} })
  export default class PopupFilterCrowdsale extends Mixins(PopupMixin) {
    form: any = {
      roundId: '',
      countryName: '',
      paidWallet: '',
      currency: [],
      fromDate: null,
      toDate: null,
      fromAmount: '',
      toAmount: ''
    }
    listCountry: IListCountry[] = countryJson

    optionByToken: any = {}
    optionByWallet: any = [
      {
        value: 'Metamask',
        label: 'Metamask'
      },
      {
        value: 'Binance',
        label: 'Binance'
      }
      // {
      //   value: 'Ethereum',
      //   label: 'Ethereum'
      // }
    ]
    optionByRound: any = {}

    formatCurrencyName(name: string): string {
      if (name === 'USDC' || name === 'USDT') {
        return name
      } else if (name === 'LYNKEY') {
        return 'LynKey'
      } else {
        return formatType(name)
      }
    }

    renderIcon(type: string): string {
      type = type.toLowerCase()
      return type === 'lynk'
        ? 'icon-lynk'
        : type === 'hub'
        ? 'icon-hub'
        : type === 'clm'
        ? 'icon-clm'
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
        : 'icon-locker'
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
        if (this.form.fromDate) {
          return time.getTime() / 1000 < new Date(this.form.fromDate).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.form.toDate) {
          return time.getTime() / 1000 > new Date(this.form.toDate).getTime() / 1000
        }
      }
    }

    handleReset(): void {
      this.form = {
        roundId: '',
        countryName: '',
        paidWallet: '',
        currency: [],
        fromDate: '',
        toDate: '',
        fromAmount: '',
        toAmount: ''
      }
      if (this.$refs.filterCrowdsale) {
        //@ts-ignore
        this.$refs.filterCrowdsale.clearValidate()
      }
    }

    async handleSubmit(): Promise<void> {
      let form2: any = { ...this.form }
      if (this.form.fromAmount) {
        form2.fromAmount = this.form.fromAmount.replaceAll(',', '')
      }
      if (this.form.toAmount) {
        form2.toAmount = this.form.toAmount.replaceAll(',', '')
      }
      if (this.form.currency.length > 0) {
        form2.currency = this.form.currency.join()
      }

      if (this.form.fromDate) {
        form2.fromDate = this.$options.filters?.formatReferral(form2.fromDate)
      }
      if (this.form.toDate) {
        form2.toDate = this.$options.filters?.formatReferral(this.form.toDate + 86399000)
      }
      // form2 = {
      //   ...form2,
      //   fromDate,
      //   toDate
      // }
      this.$emit('apply', form2)
      this.setOpenPopup({
        popupName: 'popup-filter-crowdsale',
        isOpen: false
      })
    }

    async handleOpen(): Promise<void> {
      await this.getListRound()
      await this.getListAssetNetwork()
    }

    async handleClose(): Promise<void> {
      console.log('close')
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
    errorType = ''
    checkValid(): boolean {
      let toAmount = parseFloat(this.form.toAmount.replaceAll(',', ''))
      let fromAmount = parseFloat(this.form.fromAmount.replaceAll(',', ''))
      if (fromAmount > toAmount) {
        this.errorType = 'amount'
        return false
      } else {
        this.errorType = ''
        return true
      }
    }

    numberFormat(event: FocusEvent): void {
      this.checkValid()
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        // fnumber = parseInt(fnumber)
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }

    @Watch('form.countryName')
    clearCountry(value: any) {
      if (!value) {
        this.listCountry = countryJson
      }
    }

    remoteCountry(query: string): void {
      console.log('query: ', query)
      if (query) {
        const currentCountry = filter(
          this.listCountry,
          country => trim(country.code).toUpperCase().includes(query.toUpperCase()) || trim(country.name).toUpperCase().includes(query.toUpperCase())
        )
        if (currentCountry.length > 0) {
          this.listCountry = currentCountry
        }
      } else if (!query) {
        this.listCountry = countryJson
      }
    }

    async getListRound(): Promise<void> {
      await api.getListRound().then((res: any) => {
        if (res) {
          this.optionByRound = res
        }
      })
    }

    async getListAssetNetwork(): Promise<void> {
      await api.getListAssetNetwork().then((res: any) => {
        if (res) {
          this.optionByToken = filter(res, item => item.currency !== 'LYNK' && item.currency !== 'CLM' && item.currency !== 'HUB')
        }
      })
    }

    created(): void {
      const currentCountry = filter(this.listCountry, country => country.code === 'VN')[0]
      this.form.country = currentCountry.name
    }
  }
</script>
<style scoped lang="scss">
  .popup-filter-crowdsale {
    .content {
      .select {
        width: 100%;
      }

      color: var(--bc-text-primary);

      .box-input-1,
      .box-input-2,
      .box-input-3 {
        margin-bottom: 24px;
        .box-input {
          width: 256px;
        }
      }

      .box-input-3 {
        position: relative;
        .box-input {
          position: relative;
        }

        .dolar {
          position: absolute;
          top: 0;
          left: 12px;
          height: 100%;
          line-height: 48px;
        }
      }

      .by-with-wallet,
      .by-with-token {
        margin-bottom: 24px;
      }

      .label {
        font-weight: 400;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .box-input {
        margin-top: 8px;
        height: 48px;
        margin-bottom: unset !important;
        margin-top: unset !important;
      }

      .line {
        width: 8px;
        height: 2px;
        background: #dbdbdb;
      }
    }
    .error-amount {
      position: absolute;
      bottom: -25px;
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
