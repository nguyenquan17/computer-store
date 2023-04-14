<template>
  <base-popup name="popup-add-crowdsale" class="popup-member" width="480px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('transaction.popup.add-crowdsale') }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <el-form class="form-item" :model="form" :rules="rules" ref="setting-round-member" autocomplete="off">
        <el-form-item :label="$t('label.email')" :class="isEmailFailed ? 'is-error' : null" prop="email">
          <el-select
            v-model="form.email"
            class="w-100"
            filterable
            remote
            clearable
            reserve-keyword
            :placeholder="$t('placeholder.email')"
            :remote-method="handleFindCustomer"
            @change="handleSelectUser"
            @clear="handleClearEmail"
          >
            <div v-infinite-scroll="loadMoreCustomer" infinite-scroll-delay="500">
              <el-option v-for="item in listCustomer" :key="item.id" :label="item.email" :value="item.email"> </el-option>
            </div>
          </el-select>
          <!-- <el-input v-model="form.email" autocomplete="new-password" :readonly="false" :placeholder="$t('placeholder.email')" clearable @input="handleFindCustomer" /> -->
          <!-- <small class="small" v-if="isEmailFailed">{{ $t('notify.not-find-customer') }}</small> -->
        </el-form-item>

        <el-form-item :label="$t('label.amount-available')" class="be-flex-item" prop="amountAvailable">
          <el-input v-model="getAmountAvailable" :placeholder="$t('placeholder.amount-available')" disabled> </el-input>
          <div class="prefix prefix--amount">
            <span style="color: #5b616e">USDT</span>
          </div>
        </el-form-item>

        <div class="be-flex jc-space-between">
          <el-form-item :label="$t('label.paid-amount')" class="be-flex-item" :class="invalidAmount ? 'is-error' : null" prop="amount">
            <el-input
              v-model="form.amount"
              @input="handleInputAmount"
              :placeholder="$t('placeholder.amount-deposit')"
              @keypress.native="onlyNumber($event, 'amount')"
              @keyup.native="numberFormat($event)"
              clearable
            >
              <template slot="append">USDT</template>
            </el-input>
            <div v-if="invalidAmount" class="error">{{ $t('label.invalid-amount') }}</div>
          </el-form-item>
        </div>
        <div class="be-flex jc-space-between mb-24 tab-amount">
          <div class="text-base cursor amount-item" v-for="tab in tabAmount" :key="tab" :class="tab === tabActive ? 'active' : null" @click="handleSelectTab(tab)">
            <span>{{ tab }}%</span>
          </div>
        </div>
        <el-form-item :label="$t('label.receive')" class="be-flex-item" prop="amountAvailable">
          <el-input v-model="getTokenAmount" :placeholder="$t('placeholder.amount-available')" disabled> </el-input>
          <div class="prefix prefix--amount">
            <span style="color: #5b616e">{{ coinMain }}</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.buy') }}</span>
          </button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'
  import getRepository from '@/services'
  import { namespace } from 'vuex-class'
  import { trim, includes, filter } from 'lodash'
  import { CustomerRepository } from '@/services/repositories/customer'

  const apiCustomer: CustomerRepository = getRepository('customer')
  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')

  const crowdsaleBo = namespace('crowdsaleBo')
  const beBase = namespace('beBase')

  interface IExchangeRate {
    oneSourceToTarget?: number
    oneSourceToUsd?: number
    oneTargetToSource?: number
    oneTargetToUsd?: number
    sourceNetwork?: string
    targetNetwork?: string
  }
  interface IForm {
    email?: string
    amount?: string
    userId?: number
    tokenAmount?: number
    tokenAddress?: string
    tokenCurrency?: string
    tokenNetwork?: string
    tokenUsdExchangeRate?: number
    paidAddress?: string
    paidCurrency?: string
    paidNetwork?: string
    paidAmount?: number
    paidUsdExchangeRate?: number
    paidTokenExchangeRate?: number
    description?: string
    isExternal?: number
    transactionCode?: string | null
    verificationCode?: string
  }
  @Component({
    components: {}
  })
  export default class PopupAddCrowdsale extends Mixins(PopupMixin) {
    @crowdsaleBo.State('roundCurrent') roundCurrent!: Record<string, any>

    form: IForm = {
      email: '',
      amount: '',
      userId: 0,
      tokenAmount: 0
    }
    listRoundChecked: number[] = []
    tabAmount: number[] = [25, 50, 75, 100]
    tabActive: any = null

    listCustomer: Record<string, any>[] = []
    listCustomerClone: Record<string, any>[] = []

    isLoading = false
    isEmailFailed = false
    isNotChooseRound = false

    objRound = {}
    numClick = 0

    limit = 20
    emailSearch = ''

    exchangeRate: IExchangeRate = {}
    timing: any = null
    balance: Record<string, any> = {}
    balanceCoin: Record<string, any> = {}
    invalidAmount = false

    rules: Record<string, any> = {
      email: [
        {
          required: true,
          message: this.$t('member.validate.wrong-email'),
          trigger: 'blur'
        }
      ],
      amount: [
        {
          required: true,
          message: this.$t('member.validate.wrong-deposit'),
          trigger: 'blur'
        }
      ]
    }

    get getAmountAvailable(): string {
      if (this.balance.available) {
        return this.$options.filters?.convertAmountDecimal(this.balance.available, 'USDT')
      }
      return '0'
    }
    get getTokenAmount(): string {
      if (this.form.tokenAmount) {
        return this.$options.filters?.convertAmountDecimal(this.form.tokenAmount, this.coinMain)
      }
      return '0'
    }

    @Watch('form.amount') watchAmount(amount: string): void {
      if (this.form.userId) {
        const _amount = Number(amount.replaceAll(',', ''))
        this.invalidAmount = _amount > this.balance.available
      }
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-add-crowdsale',
        isOpen: false
      })
    }

    handleOpen(): void {
      this.isEmailFailed = false
      this.handleFindCustomer(' ', true)
      this.handleGetExchangeRate()
      this.timing = setInterval(this.handleGetExchangeRate, 30000)
    }

    handleClose(): void {
      clearInterval(this.timing)
      this.invalidAmount = false
      this.listRoundChecked = []
      this.isNotChooseRound = false
      this.balance = {}
      this.form = {
        ...this.form,
        email: '',
        amount: '',
        userId: 0,
        tokenAmount: 0
      }
      this.tabActive = null
      //@ts-ignore
      this.$refs['setting-round-member'].clearValidate()
    }

    handleSelectTab(tab: number): void {
      if (this.tabActive === tab) {
        this.tabActive = null
        this.form.amount = ''
        this.form.tokenAmount = 0
      } else {
        this.tabActive = tab
        const amount = (tab * this.balance.available) / 100
        this.form.amount = this.$options.filters?.convertAmountDecimal(amount, 'USDT')
        this.form.tokenAmount = amount * this.exchangeRate.oneSourceToTarget!
      }
    }

    handleInputAmount(): void {
      if (this.form.userId) {
        //@ts-ignore
        this.$refs['setting-round-member']?.fields.find(f => f.prop == 'amount').clearValidate()
        const _amount = Number(this.form.amount!.replaceAll(',', ''))
        this.form.tokenAmount = _amount * this.exchangeRate.oneSourceToTarget!
      }
    }

    loadMoreCustomer(): void {
      this.limit += 20
      const params = {
        email: this.emailSearch,
        limit: this.limit
      }
      apiCrowdsale.findCustomerByEmail(params).then(res => {
        this.listCustomer = res
      })
    }

    handleFindCustomer(query: string, isFirst = false): void {
      if (query !== '') {
        this.emailSearch = trim(query)
        this.limit = 20
        const params = {
          email: this.emailSearch,
          limit: 20
        }
        apiCrowdsale.findCustomerByEmail(params).then(res => {
          this.listCustomer = res
          if (isFirst) {
            this.listCustomerClone = res
          }
        })
      } else {
        this.limit = 20
        this.emailSearch = ''
        this.listCustomer = [...this.listCustomerClone]
      }
    }

    handleClearEmail(): void {
      this.listCustomer = [...this.listCustomerClone]
      this.limit = 20
      this.emailSearch = ''
      this.form.tokenAmount = 0
      this.form.amount = ''
    }

    handleSelectUser(email: string): void {
      this.form.amount = ''
      this.form.tokenAmount = 0
      this.tabActive = null
      const user = filter(this.listCustomer, user => user.email === email)[0]
      this.form.userId = user ? user.userId : 0
      if (user) {
        this.handleGetListBalance(user.userId)
      }
    }

    async handleGetListBalance(userId): Promise<void> {
      try {
        const result = await apiCustomer.getlistBalance(userId, {})
        this.balance = filter(result, elm => elm.asset === 'USDT')[0]
        this.balanceCoin = filter(result, elm => elm.asset === this.coinMain)[0]
      } catch (error) {
        console.log(error)
      }
    }

    async handleGetExchangeRate(): Promise<void> {
      try {
        this.exchangeRate = await apiCrowdsale.getExchangeRateTwoCoin(this.coinMain)
        if (this.form.amount && this.form.userId) {
          const _amount = Number(this.form.amount!.replaceAll(',', ''))
          this.form.tokenAmount = _amount * this.exchangeRate.oneSourceToTarget!
        }
      } catch (error) {
        console.log(error)
      }
    }

    handleSubmit(): void {
      this.numClick += 1
      //@ts-ignore
      this.$refs['setting-round-member']?.validate(valid => {
        if (valid && this.numClick === 1 && !this.invalidAmount && this.form.amount !== '0') {
          this.form = {
            ...this.form,
            tokenAddress: this.balanceCoin.address,
            tokenCurrency: this.coinMain,
            tokenNetwork: this.balanceCoin.network,
            tokenUsdExchangeRate: this.exchangeRate.oneTargetToUsd,
            paidAddress: this.balance.address,
            paidCurrency: 'USDT',
            paidNetwork: this.balance.network,
            paidAmount: Number(this.form.amount?.replaceAll(',', '')),
            paidUsdExchangeRate: this.exchangeRate.oneSourceToUsd,
            paidTokenExchangeRate: this.exchangeRate.oneSourceToTarget,
            isExternal: 0,
            description: '',
            transactionCode: null
          }
          // this.handleCancel()
          this.$emit('confirm', this.form)
          setTimeout(() => {
            this.numClick = 0
          }, 1000)
        } else {
          if (this.form.amount === '0') {
            this.invalidAmount = true
          }
          this.numClick = 0
        }
      })
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.form.amount, '.')) {
        event.preventDefault()
      }
    }

    numberFormat(event: FocusEvent): void {
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
  .popup-member {
    color: var(--bc-text-primary);

    .title-popup {
      span {
        color: #0a0b0d;
      }
    }

    .content {
      display: block;
      .form-item {
        .icon-show-password {
          cursor: pointer;
          position: absolute;
          bottom: 0;
          right: 14px;
          color: #a19f9d;
        }

        .list-role {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          ::v-deep .el-checkbox {
            // margin-bottom: 12px;
            width: fit-content;
            margin: 0;
          }
          ::v-deep .el-checkbox:nth-child(odd) {
            flex-basis: 52%;
          }
          ::v-deep .el-checkbox__label {
            color: #0a0b0d;
            font-size: 16px;
            font-weight: 400;
          }
          ::v-deep .el-checkbox__input {
            .el-checkbox__inner {
              width: 20px;
              height: 20px;
              &::after {
                // border: 2px solid #fff;
                height: 10px;
                left: 7px;
                top: 2px;
              }
            }
          }
          ::v-deep .el-checkbox__input.is-checked {
            .el-checkbox__inner {
              background-color: var(--bc-cb-bg-checked);
            }
          }
        }
        .bg-line {
          height: 8px;
          background-color: #f6f8fc;
          margin: 0 -24px;
        }

        .status-active {
          padding: 24px 0;
          ::v-deep.switch-status {
            .el-switch__core {
              width: 46px;
              height: 28px;
              border-radius: 33px;
              &::after {
                width: 24px;
                height: 24px;
              }
            }
          }
          ::v-deep.switch-status.is-checked {
            .el-switch__core::after {
              margin-left: -25px;
            }
          }
        }
      }
    }

    .footer {
      .wrap-button {
        justify-content: flex-end;
        .add-member {
          height: 40px;
          font-weight: 400;
          padding: 0 8px;
          &:hover {
            border: 1px solid transparent;
          }
        }
      }
      .jc-space-between {
        justify-content: space-between;
      }
      .btn-left {
        .btn-close {
          padding: 0;
          height: 40px;
        }
        .btn-delete:hover {
          border: 1px solid var(--bc-btn-bg-reject);
          color: var(--bc-status-error);
        }
      }
      .btn-close:focus {
        color: var(--bc-btn-text);
        background-color: var(--bc-bg-white);
      }
    }
  }
  .small {
    color: var(--bc-status-error);
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
  .tab-amount {
    .amount-item {
      padding: 4px 0;
      flex: 1;
      text-align: center;
      margin-right: 8px;
      background-color: #f3f2f1;
      border-radius: 4px;
      border: 1px solid transparent;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        // border: 1px solid var(--bc-tab-buy-border);
        color: var(--bc-text-tab-buy);
        background: var(--bc-bg-tab-hover);
      }
    }
    .active {
      background: var(--bc-tab-active);
      color: #fff;
    }
  }
  .prefix {
    position: absolute;
    z-index: 10;
  }
  .prefix--amount {
    right: 13px;
    top: 41%;
  }
  .error {
    position: absolute;
    color: var(--bc-required);
    font-size: 12px;
    margin-top: -10px;
  }
</style>
