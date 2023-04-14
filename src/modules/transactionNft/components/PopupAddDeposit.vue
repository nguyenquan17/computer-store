<template>
  <base-popup name="popup-add-deposit" class="popup-member" width="480px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('transaction.popup.add-deposit') }}</span>
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
            @clear="handleClearEmail"
          >
            <div v-infinite-scroll="loadMoreCustomer" infinite-scroll-delay="500">
              <el-option v-for="item in listCustomer" :key="item.id" :label="item.email" :value="item.email"> </el-option>
            </div>
          </el-select>
          <!-- <el-input v-model="form.email" autocomplete="new-password" :readonly="false" :placeholder="$t('placeholder.email')" clearable @input="handleFindCustomer" /> -->
          <!-- <small class="small" v-if="isEmailFailed">{{ $t('notify.not-find-customer') }}</small> -->
        </el-form-item>

        <div class="be-flex jc-space-between">
          <el-form-item :label="$t('label.amount')" class="be-flex-item" prop="amount">
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
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.save') }}</span>
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
  import { TransactionRepository } from '@/services/repositories/transaction'
  import getRepository from '@/services'
  import { namespace } from 'vuex-class'
  import { trim, includes } from 'lodash'

  const crowdsaleBo = namespace('crowdsaleBo')

  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')
  const apiTransaction: TransactionRepository = getRepository('transaction')

  @Component({
    components: {}
  })
  export default class PopupAddDeposit extends Mixins(PopupMixin) {
    @crowdsaleBo.State('roundCurrent') roundCurrent!: Record<string, any>

    form = {
      email: '',
      amount: '',
      currency: 'USDT'
    }
    listRoundChecked: number[] = []

    listCustomer: Record<string, any>[] = []
    listCustomerClone: Record<string, any>[] = []

    isLoading = false
    isEmailFailed = false
    isNotChooseRound = false

    objRound = {}
    numClick = 0

    limit = 20
    emailSearch = ''

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

    // @Watch('form.email') watchEmail(email: string): void {
    //   if (email === '') {
    //     this.isEmailFailed = false
    //   }
    // }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-add-deposit',
        isOpen: false
      })
    }

    handleOpen(): void {
      this.isEmailFailed = false
      this.handleFindCustomer(' ', true)
    }

    handleClose(): void {
      this.listRoundChecked = []
      this.isNotChooseRound = false
      this.form = {
        email: '',
        amount: '',
        currency: 'USDT'
      }
      //@ts-ignore
      this.$refs['setting-round-member'].clearValidate()
    }

    handleInputAmount(): void {
      //@ts-ignore
      this.$refs['setting-round-member']?.fields.find(f => f.prop == 'amount').clearValidate()
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
    }

    handleSubmit(): void {
      this.numClick += 1
      //@ts-ignore
      this.$refs['setting-round-member']?.validate(valid => {
        if (valid && this.numClick === 1) {
          const amount = this.form.amount.replaceAll(',', '')
          apiTransaction.addDeposit({ ...this.form, amount }).then(() => {
            this.handleCancel()
            this.$emit('reload')
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
</style>
