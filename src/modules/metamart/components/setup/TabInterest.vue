<template>
  <div class="tab-interest">
    <p class="nft-header5 text-medium mb-24">{{ $t('labe_tab-interest') }}</p>
    <el-form>
      <el-form-item :label="$t('label_package-qty')" class="is-required">
        <el-input v-model="form.nftMinQuantity" placeholder="Quantity" @keypress.native="onlyNumber($event, 'nftMinQuantity')" @keyup.native="numberFormat($event)" />
      </el-form-item>
      <el-form-item :label="$t('label_beneficial-price')" class="is-required price">
        <el-input v-model="form.nftInterestPrice" placeholder="Price" @keypress.native="onlyNumber($event, 'nftInterestPrice')" @keyup.native="numberFormat($event)">
          <p class="text-base text-desc" slot="suffix">USD</p>
        </el-input>
      </el-form-item>
      <div class="be-flex jc-space-between row">
        <el-form-item class="be-flex-item mr-40 form-item-line is-required" :label="$t('label_duration')">
          <el-date-picker
            class="w-100 date-picker"
            format="MM/dd/yyyy"
            value-format="timestamp"
            :placeholder="$t('label.from-date')"
            v-model="form.startDate"
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
            v-model="form.endDate"
            type="date"
            :picker-options="pickerOption"
          >
          </el-date-picker>
        </el-form-item>
      </div>

      <p class="nft-header5 text-medium mb-24 mt-8">Interest</p>
      <div class="wrap-year">
        <el-form-item v-for="number in 10" :key="number" :label="`Year ${number} interest (%)`">
          <el-input
            v-model="$store.state.bcNft['initInterRest']['interestYear' + number]"
            @keypress.native="onlyNumber($event, `year${number}`)"
            @keyup.native="numberFormat($event)"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { includes } from 'lodash'
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import { ITabInterest } from '../../interface'
  const bcNft = namespace('bcNft')
  @Component
  export default class TabInterest extends Vue {
    @bcNft.State('initInterRest') form!: ITabInterest

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
        if (this.form.startDate) {
          const date = new Date()
          date.setFullYear(new Date(this.form.startDate).getFullYear() + 10)
          date.setMonth(new Date(this.form.startDate).getMonth())
          date.setDate(new Date(this.form.startDate).getDate())
          date.setHours(0, 0, 0, 0)
          return time.getTime() / 1000 < new Date(this.form.startDate).getTime() / 1000 || time.getTime() / 1000 > new Date(date).getTime() / 1000
        }
      } else {
        if (this.form.endDate) {
          const date = new Date()
          date.setFullYear(new Date(this.form.endDate).getFullYear() - 10)
          date.setMonth(new Date(this.form.endDate).getMonth())
          date.setDate(new Date(this.form.endDate).getDate())
          date.setHours(0, 0, 0, 0)
          return time.getTime() / 1000 < new Date(date).getTime() / 1000 || time.getTime() / 1000 > new Date(this.form.endDate).getTime() / 1000
        }
      }
    }

    created(): void {
      console.log(this.$store.state)
    }

    onlyNumber(event: KeyboardEvent, type: string): void {
      const keyCode = event.keyCode ? event.keyCode : event.which
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.form[type], '.')) {
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
  ::v-deep.tab-interest {
    width: 648px;
    .el-form {
      &-item {
        &__label {
          font-size: 16px;
          font-weight: 600;
        }
      }
      .price {
        .el-input__suffix {
          position: absolute;
          right: 8px;
          top: 12px;
        }
      }
      .wrap-year {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
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
    }
  }
</style>
