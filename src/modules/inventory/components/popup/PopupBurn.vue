<template>
  <base-popup name="popup-burn" class="popup-burn" width="480px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('inventory.inventory-detail.burn').toUpperCase() }}</span>
    </div>
    <div class="content">
      {{ $t('inventory.inventory-detail.title-burn') }}
      <span class="text-semibold"
        >{{ detail.itemName }} <span v-if="detail && detail.integrationItemId">#{{ detail.integrationItemId }}</span> <span v-else>#{{ detail.itemCode }}</span></span
      >
      {{ $t('inventory.inventory-detail.of') }}
      <span class="text-semibold">{{ detail.fullName }}</span>
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
    <popup-verify-email v-if="type_popup == 'burn'" @submit="handleBurn"></popup-verify-email>
    <popup-success type="burn"></popup-success>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupSuccess from './PopupSuccess.vue'
  import PopupVerifyEmail from './PopupVerifyEmail.vue'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'
  import { InventoryRepository } from '@/services/repositories/inventory'
  const api: SettingRepository = getRepository('setting')
  const apiInventory: InventoryRepository = getRepository('inventory')
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  import includes from 'lodash/includes'
  const bcInventory = namespace('bcInventory')
  @Component({ components: { PopupVerifyEmail, PopupSuccess } })
  export default class PopupBurn extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Number, default: 0 }) numberBurn!: number
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
    loading = false
    options: any[] = []
    isLoading = false
    value = 1
    isDisabled = false
    created(): void {
      this.initOption()
    }
    @Watch('numberBurn') watchNumber() {
      this.initOption()
    }
    initOption() {
      this.options = []
      for (let i = 1; i <= this.numberBurn; i++) {
        this.options.push(i)
        if (this.options.length > 20) break
      }
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
      this.value = 1
      this.filterMethod(1)
    }

    filterMethod(value) {
      this.options = []
      for (let i = 1; i <= this.numberBurn; i++) {
        if ((i + '').includes(value)) {
          this.options.push(i)
        }
        if (this.options.length > 20) break
      }
      if (value > this.numberBurn) {
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
      for (let i = this.options[this.options.length - 1] + 1; i <= this.numberBurn; i++) {
        this.options.push(i)
        if (this.options.length > length + 20) break
      }
    }
    handleBurn(code) {
      //@ts-ignore
      const params = {
        itemId: this.itemId,
        accountId: this.accountId,
        quantity: this.value,
        verificationCode: code
      }
      apiInventory
        .burnNft(params)
        .then(data => {
          this.$message.success(this.$t('inventory.inventory-detail.burn-success') as string)
          this.setOpenPopup({
            popupName: 'popup-verify-email',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-burn',
            isOpen: false
          })

          this.setOpenPopup({
            popupName: 'popup-success',
            isOpen: true
          })
          EventBus.$emit('reload-data-inventory', { ownerId: this.accountId, itemId: this.itemId }, 'BURN')
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
        popupName: 'popup-burn',
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

  ::v-deep.popup-burn {
    .popup-content {
      padding-bottom: 24px;
      .content {
        @include text(16px, 24px, 400, #5b616e);
        .text-semibold {
          @include text(16px, 24px, 600, #0a0b0d);
        }
        .content-filter {
          margin-top: 24px;
          &__title {
            @include text(14px, 20px, 400, #0a0b0d);
            text-transform: none;
            margin-bottom: 4px;
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
