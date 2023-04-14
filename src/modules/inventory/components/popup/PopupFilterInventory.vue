<template>
  <base-popup name="popup-filter-inventory" class="popup-filter-inventory" width="600px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ popup_data.header.title }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <div class="content-block">
        <p class="content-block__title">Network</p>
        <el-select v-model="filterInventory.network" placeholder="Network">
          <el-option v-for="(option, index) in listDataNetwork" :label="option.networkName" :value="option.networkName" :key="index"></el-option>
        </el-select>
      </div>
      <div class="content-block">
        <p class="content-block__title">{{ $t('inventory.inventory-filter.quantity') }}</p>
        <div class="content-block__inputs">
          <el-input
            v-model="filterInventory.fromQuantity"
            :class="{ 'input-error': !!(error.quantity || '') }"
            :placeholder="$t('inventory.inventory-filter.from')"
            clearable
            @keypress.native="onlyNumber($event)"
            @keyup.native="numberFormat($event, 'fromQuantity')"
            @clear="numberFormat($event, 'fromQuantity')"
          >
          </el-input>
          <div class="delimiter"></div>
          <el-input
            v-model="filterInventory.toQuantity"
            :class="{ 'input-error': !!(error.quantity || '') }"
            :placeholder="$t('inventory.inventory-filter.to')"
            clearable
            @keypress.native="onlyNumber($event)"
            @keyup.native="numberFormat($event, 'toQuantity')"
            @clear="numberFormat($event, 'toQuantity')"
          ></el-input>
        </div>
        <p class="content-block__alert" v-if="error.quantity === 'quantity'">{{ popup_data.content.quantity.alert }}</p>
      </div>
    </div>

    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleReset">
            {{ popup_data.footer.btnReset }}
          </el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" :disabled="!!(error.quantity || '')" @click="handleApply">
            {{ popup_data.footer.btnContinues }}
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

  @Component
  export default class PopupFilterInventory extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array, default: [] }) listDataNetwork!: Array<Record<string, any>>
    // @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    // @bcKyc.State('listReason') listReason!: Array<Record<string, any>>
    // checkList = []
    // reason = ''
    filterInventory = {
      network: '',
      fromQuantity: '',
      toQuantity: ''
    }
    isLoading = false
    // isStopDbClick = false
    //begin
    //   @Prop({ required: true, type: Object, default: [] }) resetFilter!: Record<string, any>

    error = {
      quantity: ''
    }

    popup_data = {
      header: {
        title: this.$i18n.t('popup-fee.title')
      },
      content: {
        quantity: {
          from: {
            placeholder: 'From',
            value: ''
          },
          to: {
            placeholder: 'To',
            value: ''
          },
          alert: 'From quantity must be less than To quantity'
        }
      },
      footer: {
        btnReset: this.$i18n.t('popup-fee.reset'),
        btnContinues: this.$i18n.t('button.apply')
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
      let to = parseFloat(this.filterInventory.fromQuantity.replaceAll(',', ''))
      let from = parseFloat(this.filterInventory.toQuantity.replaceAll(',', ''))
      if (from > to) {
        console.log('193')
        this.error[field] = field
        return false
      } else {
        console.log('197')
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
      this.filterInventory = {
        network: '',
        fromQuantity: '',
        toQuantity: ''
      }
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-filter-inventory',
        isOpen: false
      })
    }

    handleApply(): void {
      this.setOpenPopup({
        popupName: 'popup-filter-inventory',
        isOpen: false
      })
      let network = ''
      let fromQuantity = ''
      let toQuantity = ''
      if (this.filterInventory.fromQuantity) {
        fromQuantity = this.filterInventory.fromQuantity.replaceAll(',', '')
      }
      if (this.filterInventory.toQuantity) {
        toQuantity = this.filterInventory.toQuantity.replaceAll(',', '')
      }
      this.$emit('filterInventory', { ...this.filterInventory, fromQuantity: fromQuantity, toQuantity: toQuantity })
    }
    // handleFilters():void {
    //     let fromDate = ''
    //     let toDate = ''
    //     if (this.popup_data.content.date.input.value1) {
    //       fromDate = this.$options.filters?.formatReferral(this.popup_data.content.date.input.value1)
    //     }
    //     if (this.popup_data.content.date.input.value2) {
    //       toDate = this.$options.filters?.formatReferral(this.popup_data.content.date.input.value2 + 86399000)
    //     }
    //     const filters = {
    //         fromDate : fromDate,
    //         toDate : toDate,
    //         fromAmount: this.popup_data.content.amount.input.value1,
    //         toAmount: this.popup_data.content.amount.input.value2,
    //         fromFee: this.popup_data.content.fee.input.value1,
    //         toFee: this.popup_data.content.fee.input.value2,
    //         status: this.popup_data.content.status.value === '' ? null : this.popup_data.content.status.value
    //     }
    //     this.$emit('feeFilterBark', filters)
    //     this.handleClose()
    // }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  ::v-deep.popup-filter-inventory {
    .content {
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content-block {
          .el-input__inner {
            width: 256px;
          }
          &:last-child {
            .content-block__label {
              padding-left: 20px;
            }
            .content-block__wrap {
              text-align: right;
            }
          }
        }
      }
      &-block {
        width: 100%;
        height: auto;
        margin-bottom: 24px;
        &:first-child {
          .el-select {
            width: 100%;
          }
        }
        .input-error {
          .el-input__inner {
            border-color: #cf202f;
          }
        }
        &__title {
          @include text(14px, 20px, 400, #0a0b0d);
          margin-bottom: 8px;
        }

        &__alert {
          margin-top: 4px;
          @include text(14px, 20px, 400, #cf202f);
        }
        &__inputs {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .el-input {
            width: 256px;
            .el-input__inner {
              width: 100%;
            }
          }
          .delimiter {
            width: 8px;
            height: 2px;
            background-color: #dbdbdb;
          }
        }
      }
    }
  }
</style>
