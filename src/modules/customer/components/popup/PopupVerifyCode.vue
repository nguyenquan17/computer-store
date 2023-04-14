<template>
  <!-- popup verify -->
  <base-popup name="popup-verify-code" class="popup-customer-detail" width="480px" :isShowFooter="false" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('customer.setting.verify') }}</span>
    </div>
    <div class="bc-verify">
      <h3 class="text-3xl text-center text-semibold title-form" style="justify-content: center">{{ $t('verify.title-phone') }}</h3>
      <div class="be-flex verify-code">
        <base-icon icon="verify-phone" size="80" />
        <div class="ml-1 w-100 input-code">
          <el-form ref="form-verify">
            <!-- <el-form-item prop="code" :label="`${$t('verify.label')}`" class="no-require-label">
                <el-input type="text" v-model.trim="twoFaCode" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
              </el-form-item> -->
            <el-form-item prop="phone">
              <div class="be-flex label" slot="label">{{ $t('label.phone-number') }}</div>

              <el-input type="number" :placeholder="$t('placeholder.phone-number')" v-model="form.phone">
                <template style="cursor: pointer" slot="prepend"
                  ><span style="color: #5b616e">{{ phoneDefault }}</span></template
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-button :loading="isLoading" :class="getDisableBtn ? 'btn--disabled' : null" class="btn w-100 is-none-border btn-h-40 cursor" style="height: 40px"
        >{{ $t('verify.submit') }}
      </el-button>
      <div v-if="$route.name !== 'verify-app'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
        {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCode"> {{ $t('verify.re-send') }} </span>
      </div>
      <div v-if="$route.query.reason === 'VERIFY-SMS'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
        <span class="text-hyperlink text-semibold cursor" @click="handleUseOtherPhone"> {{ $t('verify.another-phone') }} </span>
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
  export default class PopupVerifyCode extends Mixins(PopupMixin) {
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
