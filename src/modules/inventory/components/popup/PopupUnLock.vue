<template>
  <base-popup name="popup-un-lock" class="popup-un-lock" width="480px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('inventory.inventory-detail.un-lock').toUpperCase() }}</span>
    </div>
    <div class="content">
      {{ $t('inventory.inventory-detail.title-unlock') }}
      <span class="text-semibold"
        >{{ detail.itemName }} <span v-if="detail && detail.integrationItemId">#{{ detail.integrationItemId }}</span> <span v-else>#{{ detail.itemCode }}</span>
      </span>
      {{ $t('inventory.inventory-detail.of') }} <span class="text-semibold">{{ detail.fullName }}</span>
      <div class="content-filter">
        <div class="content-filter__title">{{ $t('inventory.inventory-detail.inventory-detail-type.quantity') }}</div>
        <el-select
          :filter-method="filterMethod"
          filterable
          @keypress.native="onlyNumber($event)"
          v-model="value"
          :placeholder="$t('inventory.inventory-detail.select') + ' ' + $t('inventory.inventory-detail.inventory-detail-type.quantity').toLowerCase()"
        >
          <div v-infinite-scroll="loadMore" infinite-scroll-delay="500">
            <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
          </div>
        </el-select>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleReset">
            {{ popup_data.footer.btnReset }}
          </el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" :disabled="!value || isDisabled" @click="handleApply">
            {{ popup_data.footer.btnContinues }}
          </el-button>
        </div>
      </div>
    </div>
    <popup-verify-email v-if="type_popup == 'un-lock'" type="un-lock" @submit="handleUnLock"></popup-verify-email>
    <popup-success type="unlock"></popup-success>
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
  import { namespace } from 'vuex-class'
  const bcInventory = namespace('bcInventory')
  @Component({ components: { PopupVerifyEmail, PopupSuccess } })
  export default class PopupUnLock extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Number, default: 0 }) numberUnLock!: number
    @Prop({ required: true, type: [String, Number], default: '' }) itemId!: string | number
    @Prop({ required: true, type: [String, Number], default: '' }) accountId!: string | number
    @bcInventory.State('type_popup') type_popup!: string
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
    options: any[] = []
    isDisabled = false

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
    created(): void {
      this.initOption()
    }
    @Watch('numberUnLock') watchNumber() {
      this.initOption()
    }
    initOption() {
      this.options = []
      for (let i = 1; i <= this.numberUnLock; i++) {
        this.options.push(i)
        if (this.options.length > 20) break
      }
    }

    filterMethod(value) {
      this.options = []
      for (let i = 1; i <= this.numberUnLock; i++) {
        if ((i + '').includes(value)) {
          this.options.push(i)
        }
        if (this.options.length > 20) break
      }
      if (value > this.numberUnLock) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
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
    loadMore() {
      let length = this.options.length
      for (let i = this.options[this.options.length - 1] + 1; i <= this.numberUnLock; i++) {
        this.options.push(i)
        if (this.options.length > length + 20) break
      }
    }

    handleReset() {
      this.value = 1
      this.filterMethod(1)
    }
    handleUnLock(code) {
      const params = {
        itemId: this.itemId,
        accountId: this.accountId,
        quantity: this.value,
        verificationCode: code
      }
      apiInventory
        .unLockNft(params)
        .then(data => {
          this.setOpenPopup({
            popupName: 'popup-verify-email',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-un-lock',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-success',
            isOpen: true
          })
          EventBus.$emit('reload-data-inventory', { ownerId: this.accountId, itemId: this.itemId }, 'UNLOCK')
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
      this.value = 1
      this.setOpenPopup({
        popupName: 'popup-un-lock',
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

  ::v-deep.popup-un-lock {
    .popup-content {
      .el-input.is-disabled .el-input__inner {
        color: initial;
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
