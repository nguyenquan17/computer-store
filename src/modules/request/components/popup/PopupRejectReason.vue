<template>
  <base-popup name="popup-reject-reason" class="popup-reject-reason" width="480px" :open="handleOpen" :close="handleClose">
    <div slot="title">{{ $t('request.popup.reason.bigTitle') }}</div>
    <div class="content">
      <el-form class="form" :model="params" :rules="rules" ref="formReject">
        <div class="label">{{ $t('request.popup.reason.label') }}</div>
        <div class="text-area">
          <el-form-item prop="reason">
            <el-input type="textarea" :autosize="{ minRows: 4 }" :placeholder="$t('request.popup.reason.planceOder')" v-model="params.reason" :maxlength="200" show-word-limit>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="footer be-flex align-center">
      <div class="btn-action btn-close" @click="handleCancel">{{ $t('request.popup.reason.btn1') }}</div>
      <el-button class="btn-action btn-submit" @click="handleSubmit" :loading="loadingBtn">{{ $t('request.popup.reason.btn2') }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import getRepository from '@/services'
  import { RequestRepository } from '@/services/repositories/request'
  import { debounce } from 'lodash'

  const api: RequestRepository = getRepository('request')

  @Component
  export default class PopupRejectReason extends Mixins(PopupMixin) {
    @Prop() transactionId!: any
    params: any = {
      reason: '',
      action: 'REJECT',
      transactionId: ''
    }
    loadingBtn = false
    rules: Record<string, any> = {
      reason: [
        {
          required: true,
          message: this.$t('request.popup.reason.wrong-reason'),
          trigger: 'change'
        }
      ]
    }
    handleReset(): void {
      this.params = {
        reason: '',
        action: 'REJECT',
        transactionId: ''
      }
      if (this.$refs.formReject) {
        //@ts-ignore
        this.$refs.formReject.clearValidate()
      }
    }
    handleOpen(): void {
      this.params.transactionId = this.transactionId
    }
    handleClose(): void {
      this.handleReset()
    }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-reject-reason',
        isOpen: false
      })
    }
    validateForm(): boolean {
      let formReject: any = this.$refs.formReject
      let valid = false
      formReject.validate((_valid: boolean) => {
        valid = _valid
      })
      return valid
    }
    handleSubmit(): void {
      const valid = this.validateForm()
      if (valid) {
        this.debounceFilter('handleSubmit')
      }
    }
    async submit(): Promise<void> {
      this.loadingBtn = true
      await api.updateRequest(this.params.transactionId, this.params.action, this.params.reason).then(() => {
        let message: any = ''
        message = this.$t('request.popup.RejectMessage')
        this.$message.success({ message, duration: 5000 })
        this.loadingBtn = false
        this.$emit('reLoadTable')
        this.setOpenPopup({
          popupName: 'popup-reject-reason',
          isOpen: false
        })
      })
    }
    // debounce chan doble click
    debounceFilter = debounce((nameAction: any) => {
      if (nameAction == 'handleSubmit') {
        this.submit()
      }
    }, 400)
  }
</script>

<style scoped lang="scss">
  .popup-reject-reason {
    .content {
      min-height: 126px;
      margin-bottom: 24px;
      .label {
        margin-bottom: 8px;
      }
      .el-textarea__inner {
        min-height: 98px;
      }
    }
    .footer {
      justify-content: right;
      .btn-action {
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
      }
      .btn-close {
        background: var(--bc-color-white);
        border: 1px solid var(--bc-color-grey50);
        color: var(--bc-color-grey150);
        margin-right: 16px;
      }
      .btn-submit {
        color: var(--bc-color-white);
        background: var(--bc-btn-bg-default);
        border: none;
        padding: unset;
        line-height: 43px;
        &:hover {
          border: none;
          color: var(--bc-color-white);
          background: var(--bc-btn-bg-default-hover);
        }
      }
    }
  }
</style>
