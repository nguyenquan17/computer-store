<template>
  <base-popup name="popup-add-transfer" class="popup-member" width="480px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('transaction.popup.add-transfer') }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <el-form class="form-item" :model="form" :rules="rules" ref="setting-round-member" autocomplete="off">
        <el-form-item :label="$t('label.from')" :class="isEmailFailed ? 'is-error' : null" prop="fromUser">
          <el-select
            v-model="form.fromUser"
            class="w-100"
            filterable
            remote
            clearable
            reserve-keyword
            :placeholder="$t('placeholder.email')"
            :remote-method="handleGetUserFrom"
            @clear="handleClearEmail"
          >
            <div v-infinite-scroll="loadMoreUserFrom" infinite-scroll-delay="500">
              <el-option v-for="item in listCustomerUserFrom" :key="item.id" :label="item.username" :value="item.username"> </el-option>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('label.to')" :class="isEmailFailed ? 'is-error' : null" prop="toUserId">
          <el-select
            v-model="form.toUserId"
            class="w-100"
            filterable
            remote
            clearable
            reserve-keyword
            :placeholder="$t('placeholder.email')"
            :remote-method="handleFindCustomer"
            @clear="handleClearEmail"
          >
            <div v-infinite-scroll="loadMoreCustomer" infinite-scroll-delay="500">
              <el-option v-for="item in listCustomerUserTo" :key="item.id" :label="item.email" :value="item.userId"> </el-option>
            </div>
          </el-select>
        </el-form-item>

        <div class="be-flex jc-space-between">
          <el-form-item :label="$t('label.amount')" class="be-flex-item" prop="amount">
            <el-input
              v-model="form.amount"
              @input="handleInputAmount"
              :placeholder="`Amount`"
              @keypress.native="onlyNumber($event, 'amount')"
              @keyup.native="numberFormat($event)"
              clearable
            >
              <template slot="append">{{ coinMain }}</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item :label="$t('label.vesting')" class="be-flex-item" prop="vestingMonth">
          <el-input
            v-model="form.vestingMonth"
            @input="handleInputVesting"
            @keypress.native="onlyNumber($event, 'vestingMonth')"
            :placeholder="$t('placeholder.vesting')"
            clearable
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.transfer') }}</span>
          </button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'
  import getRepository from '@/services'
  import { namespace } from 'vuex-class'
  import { trim, includes } from 'lodash'

  const crowdsaleBo = namespace('crowdsaleBo')
  const beBase = namespace('beBase')

  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')

  @Component({
    components: {}
  })
  export default class PopupAddTransfer extends Mixins(PopupMixin) {
    @crowdsaleBo.State('roundCurrent') roundCurrent!: Record<string, any>

    form = {
      fromUser: '',
      toUserId: '',
      amount: '',
      vestingMonth: ''
    }
    listRoundChecked: number[] = []
    tabAmount: number[] = [25, 50, 75, 100]
    tabActive: any = null

    listCustomerUserTo: Record<string, any>[] = []
    listCustomerUserToClone: Record<string, any>[] = []

    listCustomerUserFrom: Record<string, any>[] = []
    listCustomerUserFromClone: Record<string, any>[] = []

    isLoading = false
    isEmailFailed = false
    isNotChooseRound = false

    objRound = {}
    numClick = 0

    limit = 20
    emailSearchUserTo = ''
    emailSearchUserFrom = ''

    rules: Record<string, any> = {
      fromUser: [
        {
          required: true,
          message: this.$t('member.validate.wrong-email'),
          trigger: 'blur'
        }
      ],
      toUserId: [
        {
          required: true,
          message: this.$t('member.validate.wrong-email'),
          trigger: 'blur'
        }
      ],
      amount: [
        {
          required: true,
          message: 'Please enter amount',
          trigger: 'blur'
        }
      ],
      vestingMonth: [
        {
          required: true,
          message: this.$t('member.validate.wrong-vesting'),
          trigger: 'blur'
        }
      ]
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-add-transfer',
        isOpen: false
      })
    }

    handleOpen(): void {
      this.isEmailFailed = false
      this.handleFindCustomer(' ', true)
      this.handleGetUserFrom(' ', true)
    }

    handleClose(): void {
      this.listRoundChecked = []
      this.isNotChooseRound = false
      this.form = {
        fromUser: '',
        toUserId: '',
        amount: '',
        vestingMonth: ''
      }
      this.tabActive = null
      //@ts-ignore
      this.$refs['setting-round-member'].clearValidate()
    }

    handleInputAmount(): void {
      //@ts-ignore
      this.$refs['setting-round-member']?.fields.find(f => f.prop == 'amount').clearValidate()
    }
    handleInputVesting(): void {
      //@ts-ignore
      this.$refs['setting-round-member']?.fields.find(f => f.prop == 'vestingMonth').clearValidate()
    }
    // handleFindCustomer(): void {
    //   this.debouneFindCustomer(this)
    // }

    // debouneFindCustomer = debounce(_this => {
    //   //@ts-ignore
    //   _this.$refs['setting-round-member']?.fields.find(f => f.prop == 'email').clearValidate()
    //   if (_this.form.email) {
    //     apiCrowdsale.findCustomerByEmail(_this.form.email).then(res => {
    //       if (res) {
    //         _this.isEmailFailed = false
    //       } else {
    //         _this.isEmailFailed = true
    //       }
    //     })
    //   }
    // }, 500)

    loadMoreCustomer(): void {
      this.limit += 20
      const params = {
        email: this.emailSearchUserTo,
        limit: this.limit,
        isTransferFund: 1
      }
      apiCrowdsale.findCustomerByEmail(params).then(res => {
        this.listCustomerUserTo = res
      })
    }

    handleFindCustomer(query: string, isFirst = false): void {
      if (query !== '') {
        this.emailSearchUserTo = trim(query)
        this.limit = 20
        const params = {
          email: this.emailSearchUserTo,
          limit: 20,
          isTransferFund: 1
        }
        apiCrowdsale.findCustomerByEmail(params).then(res => {
          this.listCustomerUserTo = res
          if (isFirst) {
            this.listCustomerUserToClone = res
          }
        })
      } else {
        this.limit = 20
        this.emailSearchUserTo = ''
        this.listCustomerUserTo = [...this.listCustomerUserToClone]
      }
    }

    handleClearEmail(): void {
      this.listCustomerUserTo = [...this.listCustomerUserToClone]
      this.limit = 20
      this.emailSearchUserTo = ''
    }

    handleGetUserFrom(query: string, isFirst = false): void {
      if (query !== '') {
        this.emailSearchUserFrom = trim(query)
        this.limit = 20
        const params = {
          email: this.emailSearchUserFrom,
          limit: 20
        }
        apiCrowdsale.getListUserFrom(params).then(res => {
          this.listCustomerUserFrom = res
          if (isFirst) {
            this.listCustomerUserFromClone = res
          }
        })
      } else {
        this.limit = 20
        this.emailSearchUserFrom = ''
        this.listCustomerUserFrom = [...this.listCustomerUserFromClone]
      }
    }

    loadMoreUserFrom(): void {
      this.limit += 20
      const params = {
        email: this.emailSearchUserFrom,
        limit: this.limit
      }
      apiCrowdsale.getListUserFrom(params).then(res => {
        this.listCustomerUserFrom = res
      })
    }

    handleSubmit(): void {
      this.numClick += 1
      //@ts-ignore
      this.$refs['setting-round-member']?.validate(valid => {
        if (valid && this.numClick === 1) {
          const _amount = Number(this.form.amount.replaceAll(',', ''))
          const _form = { ...this.form, amount: _amount }
          apiCrowdsale
            .transferToUser(_form)
            .then(() => {
              // this.handleCancel()
              this.$emit('confirm', _form)
              setTimeout(() => {
                this.numClick = 0
              }, 1000)
            })
            .catch(() => {
              setTimeout(() => {
                this.numClick = 0
              }, 1000)
            })
        } else {
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
</style>
