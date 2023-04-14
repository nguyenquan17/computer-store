<template>
  <base-popup name="popup-filter-request-nft" class="popup-filter-request-nft" width="600px">
    <div class="title-popup" slot="title">
      <span>{{ $t('popup_filter') }}</span>
    </div>

    <div class="content">
      <el-form>
        <div class="be-flex jc-space-between align-center">
          <el-form-item class="be-flex-item form-item-line" :label="$t('label_date')">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              value-format="timestamp"
              :placeholder="$t('label.from-date')"
              v-model="filter.fromCreatedAt"
              type="date"
              :picker-options="pickerOption2"
            >
            </el-date-picker>
          </el-form-item>
          <div class="line" />
          <el-form-item class="be-flex-item hide-label" label="1">
            <el-date-picker
              class="w-100 date-picker"
              format="MM/dd/yyyy"
              :placeholder="$t('label.to-date')"
              value-format="timestamp"
              v-model="filter.toCreatedAt"
              type="date"
              :picker-options="pickerOption"
            >
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="be-flex jc-space-between align-center filter-quantity">
          <el-form-item class="be-flex-item" :label="$t('label_quantity')">
            <el-input type="number" v-model="filter.fromQuantity" :placeholder="$t('label.from')" clearable @keypress.native="onlyNumber($event)" />
          </el-form-item>
          <div class="line" />
          <el-form-item class="be-flex-item hide-label" label="1">
            <el-input type="number" v-model="filter.toQuantity" :placeholder="$t('label.to')" clearable @keypress.native="onlyNumber($event)" />
          </el-form-item>
          <p class="nft-body-caption text-error" v-if="isErrorQuantity">{{ $t('notify_validate-quantity') }}</p>
        </div>
      </el-form>
    </div>

    <div class="footer" slot="footer">
      <div class="be-flex jc-flex-end wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.reset') }}</el-button>
          <el-button type="button" class="btn-default-bg text-sm ml-auto add-member btn-h-40" :class="getDisabledBtn ? 'btn--disabled' : null" @click="handleSubmit">
            <span>{{ $t('button.apply') }}</span>
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import FormatInputMixin from '@/mixins/formatInput'
  @Component
  export default class PopupFilterRequestNft extends Mixins(PopupMixin, FormatInputMixin) {
    filter: Record<string, any> = {
      fromCreatedAt: '',
      toCreatedAt: '',
      fromQuantity: '',
      toQuantity: ''
    }

    isErrorQuantity = false

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

    get getDisabledBtn(): boolean {
      return this.isErrorQuantity || (this.filter.fromQuantity === '0' && this.filter.toQuantity === '0') || this.filter.toQuantity === '0'
    }

    @Watch('$route.params.type') watchUrl(): void {
      this.resetFilter()
    }

    @Watch('filter.fromQuantity') watchFromQuantity(): void {
      this.validateQuantity()
    }

    @Watch('filter.toQuantity') watchToQuantity(): void {
      this.validateQuantity()
    }

    validateQuantity(): void {
      const from = Number(this.filter.fromQuantity) || 0
      const to = Number(this.filter.toQuantity) || 0
      console.log(from, to)

      if ((from && to) || (from && this.filter.toQuantity === '0')) {
        this.isErrorQuantity = from > to
      } else {
        this.isErrorQuantity = false
      }
    }

    resetFilter(): void {
      this.filter = {
        fromCreatedAt: '',
        toCreatedAt: '',
        fromQuantity: '',
        toQuantity: ''
      }
      this.isErrorQuantity = false
    }

    disableTime(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.filter.fromCreatedAt) {
          return time.getTime() / 1000 < new Date(this.filter.fromCreatedAt).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.filter.toCreatedAt) {
          return time.getTime() / 1000 > new Date(this.filter.toCreatedAt).getTime() / 1000
        }
      }
    }

    handleSubmit(): void {
      const filter = { ...this.filter }
      filter.fromCreatedAt = this.$options.filters?.formatReferral(filter.fromCreatedAt)
      filter.toCreatedAt = this.$options.filters?.formatReferral(new Date(filter.toCreatedAt).getTime() + 86399000)
      this.$emit('filter', filter)
      this.setOpenPopup({
        popupName: 'popup-filter-request-nft',
        isOpen: false
      })
    }

    handleCancel(): void {
      this.filter = {
        fromCreatedAt: '',
        toCreatedAt: '',
        fromQuantity: '',
        toQuantity: ''
      }
      this.$emit('filter', this.filter)
      this.setOpenPopup({
        popupName: 'popup-filter-request-nft',
        isOpen: false
      })
    }
  }
</script>

<style scoped lang="scss">
  .popup-filter-request-nft {
    .line {
      width: 8px;
      height: 2px;
      background-color: #dbdbdb;
      margin: 0 16px;
    }
    .filter-quantity {
      position: relative;
      .text-error {
        position: absolute;
        bottom: 7px;
      }
    }

    .footer {
      .wrap-button {
        .add-member {
          width: 100px;
          height: 40px;
          font-weight: 400;
          padding: 0 8px;
          margin-left: 0;
          &:hover {
            border: 1px solid transparent;
          }
        }
      }
    }
  }
</style>
