<template>
  <base-popup name="popup-remove-for-sale" class="popup-remove-for-sale" width="480px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('inventory.inventory-detail.remove-from-sale').toUpperCase() }}</span>
    </div>
    <div class="content">
      {{ $t('inventory.inventory-detail.title-remove-sale') }}
      <div class="content-filter">
        <div class="content-filter__title">{{ $t('inventory.inventory-detail.inventory-detail-type.quantity') }}</div>
        <el-select
          :disabled="true"
          filterable
          v-model="value"
          :placeholder="$t('inventory.inventory-detail.select') + ' ' + $t('inventory.inventory-detail.inventory-detail-type.quantity').toLowerCase()"
        >
          <el-option :key="numberRemoveSale" :label="numberRemoveSale" :value="numberRemoveSale"> </el-option>
        </el-select>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" :disabled="!value" @click="handleApply">
            {{ popup_data.footer.btnContinues }}
          </el-button>
        </div>
      </div>
    </div>
    <popup-verify-email v-if="type_popup == 'remove'" @submit="handleRemoveForSale"></popup-verify-email>
    <popup-success type="remove-sale"></popup-success>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupVerifyEmail from './PopupVerifyEmail.vue'
  import PopupSuccess from './PopupSuccess.vue'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'
  import { InventoryRepository } from '@/services/repositories/inventory'
  const api: SettingRepository = getRepository('setting')
  const apiInventory: InventoryRepository = getRepository('inventory')
  import EventBus from '@/utils/eventBus'
  import {namespace} from "vuex-class";
  const bcInventory = namespace('bcInventory')
  @Component({ components: { PopupVerifyEmail, PopupSuccess } })
  export default class PopupRemoveForSale extends Mixins(PopupMixin) {
    @bcInventory.State('type_popup') type_popup!: string
    @Prop({ required: true, type: Number, default: 0 }) numberRemoveSale!: number
    @Prop({ required: true, type: [String, Number], default: '' }) itemId!: string | number
    @Prop({ required: true, type: [String, Number], default: '' }) accountId!: string | number
    @Prop({
      required: true,
      type: Object,
      default: () => {
        return {}
      }
    })
    detail!: Record<string, any>
    isLoading = false
    value = 1

    @Watch('numberRemoveSale') watchNumberRemoveSale(number) {
      this.value = number
    }

    popup_data = {
      header: {
        title: this.$i18n.t('inventory.inventory-detail.title')
      },
      content: {},
      footer: {
        btnReset: this.$i18n.t('popup-fee.reset'),
        btnContinues: this.$i18n.t('button.confirm')
      }
    }
    handleReset() {
      this.value = this.numberRemoveSale
    }
    handleRemoveForSale(code) {
      const params = {
        itemId: this.itemId,
        accountId: this.accountId,
        quantity: this.value,
        verificationCode: code
      }
      apiInventory
        .removeForSaleNft(params)
        .then(data => {
          this.$message.success(this.$t('inventory.inventory-detail.remove-sale-success') as string)
          this.setOpenPopup({
            popupName: 'popup-verify-email',
            isOpen: false
          })

          this.setOpenPopup({
            popupName: 'popup-remove-for-sale',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-success',
            isOpen: true
          })
          EventBus.$emit('reload-data-inventory', { ownerId: this.accountId, itemId: this.itemId }, 'REMOVE_SALE')
        })
        .catch(error => {
          if (error.response.data.status == 'EXPIRED_VERIFICATION' || error.response.data.status == 'INVALID_VERIFICATION') {
            console.log(error)
          } else {
            this.setOpenPopup({
              popupName: 'popup-verify-email',
              isOpen: false
            })
          }
        })
    }
    handleApply() {
      const data = {
        email: this.$store.state.beAuth.user.email,
        type: 'EMAIL',
        userType: 'EMPLOYEE'
      }
      api.resendCode(data).then(() => {
        let message: any = this.$t('verified.sendCodeMess')
        this.$message.success(message)
        setTimeout(() => {
          this.setOpenPopup({
            popupName: 'popup-verify-email',
            isOpen: true
          })
        }, 500)
      })
    }
    handleClose(): void {
      this.value = this.numberRemoveSale
      this.setOpenPopup({
        popupName: 'popup-remove-for-sale',
        isOpen: false
      })
      if (this.$route.query) {
        this.$router.replace({ query: undefined })
      }
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  ::v-deep.base-table .cell {
    font-weight: 600;
  }

  ::v-deep.popup-remove-for-sale {
    .popup-content {
      .el-input.is-disabled .el-input__inner {
        color: initial;
        background-color: #F3F2F1;
      }
      padding-bottom: 24px;
      .content {
        @include text(16px, 24px, 400, #5b616e);
        .text-semibold {
          @include text(16px, 24px, 600, #0a0b0d);
        }
        .content-filter {
          margin-top: 24px;
          &__title {
            margin-bottom: 4px;
            @include text(14px, 20px, 400, #0a0b0d);
            text-transform: none;
          }
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .ml-24 {
      margin-left: 24px;
    }
    .mb-24 {
      margin-bottom: 24px;
    }
    .circle {
      border-radius: 50% !important;
    }
    .code {
      color: #5b616e;
    }
  }
</style>
