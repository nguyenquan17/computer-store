<template>
  <base-popup name="popup-verify-email" class="popup-verify-email" width="480px" :isShowFooter="false">
    <div class="title-popup" slot="title">
      <span>{{ $t('customer.setting.verify') }}</span>
    </div>
    <div class="bc-verify">
      <h3 class="text-3xl text-center text-semibold title-form" style="justify-content: center">
        {{ $t('verify.title-email') }}
      </h3>
      <div class="be-flex verify-code">
        <base-icon icon="verify-email" size="80" />
        <div class="ml-1 w-100 input-code">
          <el-form @submit.prevent.native="handleApply">
            <el-form-item prop="phone">
              <div class="be-flex label" slot="label">{{ $t('label.enter-verify-code') }}</div>
              <el-input type="number" maxlength="6" :placeholder="$t('label.verify-code')" v-model.trim="value"> </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-button
        class="none-focus"
        :loading="isLoading"
        :class="disableSubmit ? 'btn w-100 is-none-border btn-h-40 cursor backgroundDisable' : 'btn w-100 is-none-border btn-h-40 cursor'"
        :disabled="disableSubmit"
        style="height: 40px"
        @click="handleApply"
        type="button"
        @keyup.enter.native="handleApply"
        >{{ $t('verify.submit') }}
      </el-button>
      <div class="text-base be-flex jc-space-center mt-24 text-grey-130">
        {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCode"> {{ $t('verify.re-send') }} </span>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupInventoryDetailType from './PopupInventoryDetailType.vue'
  import BaseTable from '@/components/base/table/BaseTable.vue'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'
  const api: SettingRepository = getRepository('setting')

  @Component({ components: { BaseTable, PopupInventoryDetailType } })
  export default class PopupVerifyEmail extends Mixins(PopupMixin) {
    isLoading = false
    value = ''
    disableSubmit = true

    @Watch('value') watchSubmit(value: string): void {
      this.disableSubmit = value.length == 6 ? false : true
      if (value) {
        this.value = value.substring(0, 6) + ''
      }
    }
    handleResendCode() {
      this.value = ''
      const data = {
        email: this.$store.state.beAuth.user.email,
        type: 'EMAIL',
        userType: 'EMPLOYEE'
      }
      api.resendCode(data).then(() => {
        let message: any = this.$t('verified.resendCodeMess')
        this.$message.success(message)
      })
    }
    handleApply() {
      this.$emit('submit', this.value)
      this.value = ''
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-verify-email',
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
  ::v-deep.popup-verify-email {
    color: var(--bc-text-primary);
    .title-popup {
      span {
        color: #0a0b0d;
      }
    }
    .popup-content {
      background-color: #f6f8fc;
      padding-bottom: 24px;
      .title-form {
        @include text(24px, 32px, 600, #0a0b0d);
      }
      .verify-code {
        margin-top: 24px;
        .span-icon {
          display: flex;
        }
      }
      .content {
        &__header {
          .avatar {
            img {
              width: 80px;
              height: 80px;
              border-radius: 100px;
              object-fit: cover;
            }
          }

          .info-below {
            &__left {
              width: 316px;
              margin-right: 160px;
            }

            &__right {
              width: 316px;
            }

            .info-item {
              // margin-bottom: 12px;
              position: relative;
              height: 24px;
              line-height: 24px;
              align-items: center;
              margin-bottom: 4px;

              &:last-child {
                margin-bottom: 0;
              }

              .label {
                color: #5b616e;
              }

              .status-verified {
                background-color: transparent;
                position: absolute;
                right: -80px;
                bottom: -2px;
              }
            }
          }
        }

        &__bottom {
          background-color: #fff;
          box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
          border-radius: 4px;

          .tabs {
            border-bottom: 1px solid #d2d0ce;

            .tab-item {
              padding: 16px 12px;
              position: relative;
              color: #5b616e;

              &:hover {
                color: var(--bc-tab-active);
              }
            }

            .tab-active {
              color: var(--bc-tab-active);
              font-weight: 600;

              &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 2px;
                bottom: 0;
                left: 0;
                background-color: var(--bc-tab-active);
              }
            }
          }

          .main-content-loading {
            min-height: 200px;
          }
        }
      }
    }
  }
</style>
