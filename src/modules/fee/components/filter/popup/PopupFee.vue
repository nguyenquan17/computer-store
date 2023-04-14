<template>
  <base-popup name="popup-fee" class="popup-fee" width="600px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{popup_data.header.title}}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <div class="content-block">
          <p class="content-block__title">{{popup_data.content.date.title}}</p>
          <div class="content-block__inputs">
              <el-date-picker :placeholder="popup_data.content.date.input.placeholder1" 
                format="MM/dd/yyyy"
                value-format="timestamp"
                v-model="popup_data.content.date.input.value1" 
                prefix-icon="el-icon-date"
                type="date"
                class="input-small"
                :picker-options="pickerOption2"
              ></el-date-picker>
              <span style="display:block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
              <el-date-picker :placeholder="popup_data.content.date.input.placeholder2" 
                format="MM/dd/yyyy"
                value-format="timestamp"
                v-model="popup_data.content.date.input.value2" 
                prefix-icon="el-icon-date"
                type="date"
                class="input-small"
                :picker-options="pickerOption"
              ></el-date-picker>
          </div>
      </div>
      <div class="content-block">
          <p class="content-block__title">{{popup_data.content.amount.title}}</p>
          <div class="content-block__inputs">
              <el-input :placeholder="popup_data.content.amount.input.placeholder1" 
              v-model="popup_data.content.amount.input.value1"
              class="input-small money" :class="{'input-error': !!(error.amount || '')}"
              @keypress.native="onlyNumber($event)"
              @keyup.native="numberFormat($event, 'amount')"
              ></el-input>
              <span style="display:block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
              <el-input :placeholder="popup_data.content.amount.input.placeholder2" 
              v-model="popup_data.content.amount.input.value2"
              class="input-small money" :class="{'input-error': !!(error.amount || '')}"
              @keypress.native="onlyNumber($event)"
              @keyup.native="numberFormat($event, 'amount')"
              ></el-input>
          </div>
          <p class="content-block__alert" v-if="this.error.amount === 'amount'">{{popup_data.content.amount.alert}}</p>
      </div>
      <div class="content-block">
          <p class="content-block__title">{{popup_data.content.fee.title}}</p>
          <div class="content-block__inputs">
              <el-input :placeholder="popup_data.content.fee.input.placeholder1" 
              v-model="popup_data.content.fee.input.value1"
              class="input-small money" :class="{'input-error': !!(error.fee || '')}"
              @keypress.native="onlyNumber($event)"
              @keyup.native="numberFormat($event, 'fee')"
              ></el-input>
              <span style="display:block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
              <el-input :placeholder="popup_data.content.fee.input.placeholder2" 
              v-model="popup_data.content.fee.input.value2"
              class="input-small money" :class="{'input-error': !!(error.fee || '')}"
              @keypress.native="onlyNumber($event)"
              @keyup.native="numberFormat($event, 'fee')"
              ></el-input>
          </div>
          <p class="content-block__alert" v-if="this.error.fee === 'fee'">{{popup_data.content.fee.alert}}</p>
      </div>
      <div class="content-block">
          <p class="content-block__title">{{popup_data.content.status.title}}</p>
          <div class="content-block__inputs">
              <el-select v-model="popup_data.content.status.value" placeholder="Select" class="input-lg" clearable>
                <el-option
                v-for="item in popup_data.content.status.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          </div>
      </div>
    </div>
    
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleReset">
              {{popup_data.footer.btnReset}}
          </el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" @click="handleFilters"
          style="font-size: 14px; font-weight: 600;"
          :disabled="!!(error.amount || error.fee || '')"
          >
              {{popup_data.footer.btnContinues}}
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { times } from 'lodash'
  // import { namespace } from 'vuex-class'
  // const bcKyc = namespace('bcKyc')
  @Component
  export default class PopupFee extends Mixins(PopupMixin) {
    // @bcKyc.State('listReason') listReason!: Array<Record<string, any>>
    // checkList = []
    // reason = ''
    isLoading = false
    // isStopDbClick = false
    //begin
  @Prop({ required: true, type: Object, default: [] }) resetFilter!: Record<string, any>
  
    error = {
        amount: '',
        fee: ''
    }
    
    popup_data = {
        header: {
            title: this.$i18n.t('popup-fee.title'),
        },
        content: {
            date: {
                title: this.$i18n.t('popup-fee.date'),
                input: {
                    placeholder1: this.$i18n.t('popup-fee.placeholder.date1'),
                    placeholder2: this.$i18n.t('popup-fee.placeholder.date2'),
                    value1: '',
                    value2: ''
                }
            },
            amount: {
                title: this.$i18n.t('popup-fee.amount'),
                input: {
                    placeholder1: this.$i18n.t('popup-fee.placeholder.amount1'),
                    placeholder2: this.$i18n.t('popup-fee.placeholder.amount2'),
                    value1: '',
                    value2: ''
                },
                alert: this.$i18n.t('popup-fee.alert.amount')
            },
            fee: {
                title: this.$i18n.t('popup-fee.fee'),
                input: {
                    placeholder1: this.$i18n.t('popup-fee.placeholder.fee1'),
                    placeholder2: this.$i18n.t('popup-fee.placeholder.fee2'),
                    value1: '',
                    value2: ''
                },
                alert: this.$i18n.t('popup-fee.alert.fee')
            },
            status: {
                title: this.$i18n.t('popup-fee.status'),
                options: [
                    {
                        value: "SUCCESS",
                        label: this.$i18n.t('popup-fee.success')
                    },
                    {
                        value: "PENDING",
                        label: this.$i18n.t('popup-fee.pending')
                    },
                    {
                        value: "FAILED",
                        label: this.$i18n.t('popup-fee.failed')
                    },
                    {
                        value: "REJECTED",
                        label: this.$i18n.t('popup-fee.reject')
                    },
                    {
                        value: "PROCESSING",
                        label: this.$i18n.t('popup-fee.processing')
                    }
                ],
                value: 'SUCCESS'
            }
        },
        footer: {
            btnReset: this.$i18n.t('popup-fee.reset'),
            btnContinues: this.$i18n.t('popup-fee.continues')
        }
    }
    $i18n: any
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
        if (this.popup_data.content.date.input.value1) {
          return time.getTime() / 1000 < new Date(this.popup_data.content.date.input.value1).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.popup_data.content.date.input.value2) {
          return time.getTime() / 1000 > new Date(this.popup_data.content.date.input.value2).getTime() / 1000
        }
      }
    }

    @Watch('resetFilter') handleDeleteCache(value: Record<string, any>): void {
      if(this.resetFilter.deleteCache === true)
      {
        this.handleReset()
        this.$emit('filterReseted')

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
        checkValid(field: string): boolean {
          let to = parseFloat(this.popup_data.content[field].input.value2.replaceAll(',', ''))
          let from = parseFloat(this.popup_data.content[field].input.value1.replaceAll(',', ''))
          if (from > to) {
            this.error[field] = field
            return false
          } else {
            this.error[field] = ''
            return true
          }
        }
    numberFormat(event: FocusEvent, field: string): void {
      const _event: any = event
      this.checkValid(field)
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        // fnumber = parseInt(fnumber)
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }
    handleReset(): void {
        this.popup_data.content.date.input.value1 = ''
        this.popup_data.content.date.input.value2 = ''
        this.popup_data.content.amount.input.value1 = ''
        this.popup_data.content.amount.input.value2 = ''
        this.popup_data.content.fee.input.value1 = ''
        this.popup_data.content.fee.input.value2 = ''
        this.popup_data.content.status.value = 'SUCCESS'
        this.checkValid('amount')
        this.checkValid('fee')
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-fee',
        isOpen: false
      })
    }
    handleFilters():void {
        let fromDate = ''
        let toDate = ''
        if (this.popup_data.content.date.input.value1) {
          fromDate = this.$options.filters?.formatReferral(this.popup_data.content.date.input.value1)
        }
        if (this.popup_data.content.date.input.value2) {
          toDate = this.$options.filters?.formatReferral(this.popup_data.content.date.input.value2 + 86399000)
        }
        const filters = {
            fromDate : fromDate,
            toDate : toDate,
            fromAmount: this.popup_data.content.amount.input.value1 !== ''? parseFloat(this.popup_data.content.amount.input.value1.replaceAll(',', '')) : '',
            toAmount: this.popup_data.content.amount.input.value2 !== ''? parseFloat(this.popup_data.content.amount.input.value2.replaceAll(',', '')) : '',
            fromFee:  this.popup_data.content.fee.input.value1 !== ''? parseFloat(this.popup_data.content.fee.input.value1.replaceAll(',', '')) : '',
            toFee: this.popup_data.content.fee.input.value2 !== ''? parseFloat(this.popup_data.content.fee.input.value2.replaceAll(',', '')) : '',
            status: this.popup_data.content.status.value === '' ? null : this.popup_data.content.status.value
        }
        this.$emit('feeFilterBark', filters)
        this.handleClose()
    }
  }
</script>

<style scoped lang="scss">
  .popup-fee {
      .content {
          &-block {
              width: 100%;
              height: auto;
              margin-bottom: 24px;
              &__title {
                  font-size: 14px;
                  line-height: 20px;
                  margin-bottom: 8px;
                  color: #0a0b0d;
              }
              &__inputs {
                  width: 100%;
                  height: 48px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
              }
              &__alert {
                  font-size: 14px;
                  line-height: 20px;
                  color: #cf202f;
                  margin-top: 4px;
              }
          }
      }
    .btn-400 {
      font-weight: 400;
      &:hover {
        border: 1px solid var(--bc-btn-default-border-hover);
      }
    }
    .checkbox {
      ::v-deep .el-checkbox {
        margin-bottom: 12px;
        width: fit-content;
      }
      ::v-deep .el-checkbox__label {
        color: #0a0b0d;
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

    ::v-deep .el-textarea {
      .el-textarea__inner {
        color: var(--bc-text-primary);
      }
    }
    .footer {
      button[disabled] {
        opacity: 0.2;
        cursor: not-allowed;
        background-color: var(--bc-btn-bg-default) !important;
      }
    }
  }
</style>
