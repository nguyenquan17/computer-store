<template>
  <base-popup name="popup-reject" class="popup-reject" width="480px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('kyc.popup.title-reject') }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <div class="checkbox">
        <span class="d-ib mb-16" style="color: #0a0b0d">{{ $t('kyc.popup.title-cb') }}</span>
        <el-checkbox-group v-model="checkList" class="be-flex-column">
          <el-checkbox v-for="item in listReason" :key="item.key" :label="item.id">{{ $t(`params.` + item.key) }}</el-checkbox>
          <!-- 
          <el-checkbox label="Option">{{ $t('kyc.popup.cb1') }}</el-checkbox>
          <el-checkbox label="Option B">{{ $t('kyc.popup.cb2') }}</el-checkbox>
          <el-checkbox label="Option C">{{ $t('kyc.popup.cb3') }}</el-checkbox>
          <el-checkbox label="Option D">{{ $t('kyc.popup.cb4') }}</el-checkbox> -->
        </el-checkbox-group>
      </div>
      <span class="d-ib" style="padding-bottom: 8px">{{ $t('kyc.popup.reason') }}</span>
      <el-input type="textarea" :placeholder="$t('placeholder.reason')" maxlength="250" show-word-limit rows="4" v-model="reason" />
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleClose">{{ $t('button.cancel') }}</el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" @click="handleReject">{{ $t('button.submit') }}</el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'
  const bcKyc = namespace('bcKyc')
  @Component
  export default class PopupReject extends Mixins(PopupMixin) {
    @bcKyc.State('listReason') listReason!: Array<Record<string, any>>
    checkList = []
    reason = ''
    isLoading = false

    handleReject(): void {
      if (!this.checkList.length) {
        let message: any = this.$t('notify.no-select-reject')
        this.$message.warning({ message, duration: 5000 })
        return
      }
      const data = {
        rejectResonIds: this.checkList.join(','),
        reason: this.reason
      }
      this.$emit('reject', data)
      this.handleClose()
    }

    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-reject',
        isOpen: false
      })
      this.checkList = []
      this.reason = ''
    }
  }
</script>

<style scoped lang="scss">
  .popup-reject {
    .content {
      padding-bottom: 24px;
    }
    .btn-400 {
      font-weight: 400;
      &:hover {
        border: 1px solid #0078d4;
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
          background-color: #0151fc;
        }
      }
    }

    ::v-deep .el-textarea {
      .el-textarea__inner {
        color: var(--bc-text-primary);
      }
    }
  }
</style>
