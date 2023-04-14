<template>
  <div class="tab-setting">
    <el-form class="form-setting">
      <div class="content-left">
        <el-form-item :label="$t('label_service-fee')">
          <el-input v-model="form.serviceFee" :placeholder="$t('label_service-fee')" @keypress.native="onlyNumberService($event, 'serviceFee')">
            <div class="suffix" slot="suffix">%</div>
          </el-input>
        </el-form-item>
        <div class="be-flex align-center jc-space-between switch-item">
          <div class="left">
            <p class="text-base text-semibold">{{ $t('label_top-nft') }}</p>
            <p class="nft-body-small text-desc" style="margin-top: 4px">{{ $t('label_top-nft-desc') }}</p>
          </div>
          <div class="right">
            <el-switch v-model="form.isTop" active-value="YES" inactive-value="NO" active-color="#129961" @change="handleChangeSwitch($event, 'TOP')"> </el-switch>
          </div>
        </div>
        <div class="be-flex align-center jc-space-between switch-item">
          <div class="left">
            <p class="text-base text-semibold">{{ $t('label_hot-nft') }}</p>
            <p class="nft-body-small text-desc" style="margin-top: 4px">{{ $t('label_hot-nft-desc') }}</p>
          </div>
          <div class="right">
            <el-switch v-model="form.isHot" active-value="YES" inactive-value="NO" active-color="#129961" @change="handleChangeSwitch($event, 'HOT')"> </el-switch>
          </div>
        </div>
        <div class="be-flex align-center jc-space-between switch-item">
          <div class="left">
            <p class="text-base text-semibold">{{ $t('label_nft-voucher') }}</p>
            <p class="nft-body-small text-desc" style="margin-top: 4px">{{ $t('label_nft-voucher-desc') }}</p>
          </div>
          <div class="right">
            <el-switch v-model="form.isNftVoucher" active-value="YES" inactive-value="NO" active-color="#129961"> </el-switch>
          </div>
        </div>
      </div>

      <div class="content-right">
        <el-form-item :label="$t('label_royal-fee')">
          <el-input v-model="form.creatorFee" :placeholder="$t('label_royal-fee')" @keypress.native="onlyNumberService($event, 'creatorFee')">
            <div class="suffix" slot="suffix">%</div>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('label_position-top-nft')">
          <el-input v-model="form.topPosition" :disabled="form.isTop === 'NO'" :placeholder="$t('label_position-top-nft')" @keypress.native="onlyNumber($event)" />
        </el-form-item>
        <el-form-item :label="$t('label_position-hot-nft')">
          <el-input v-model="form.hotPosition" :disabled="form.isHot === 'NO'" :placeholder="$t('label_position-hot-nft')" @keypress.native="onlyNumber($event)" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins } from 'vue-property-decorator'
  import FormatInputMixin from '@/mixins/formatInput'
  import includes from 'lodash/includes'

  import { ITabSetting } from '../../interface'

  import { namespace } from 'vuex-class'

  const bcNft = namespace('bcNft')

  @Component
  export default class TabSetting extends Mixins(FormatInputMixin) {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: 'add' | 'edit'
    @bcNft.State('initSetting') form!: ITabSetting

    onlyNumberService(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.form[type], '.')) {
        event.preventDefault()
      }
    }

    handleChangeSwitch(status: string, type: string): void {
      if (status === 'NO' && type === 'TOP') {
        this.form.topPosition = ''
      }
      if (status === 'NO' && type === 'HOT') {
        this.form.hotPosition = ''
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.tab-setting {
    .form-setting {
      display: flex;
      .content-left {
        flex: 1;
        margin-right: 24px;
        .switch-item {
          margin-bottom: 28px;
          padding-right: 8px;
          .el-switch {
            &__core {
              width: 44px !important;
              height: 26px;
              border-radius: 40px;
              &::after {
                width: 22px;
                height: 22px;
              }
            }
          }
          .is-checked {
            .el-switch__core {
              &::after {
                margin-left: -23px;
              }
            }
          }
        }
      }
      .content-right {
        flex: 1;
      }
    }
    .el-form {
      &-item {
        &__label {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
        .el-input__suffix {
          display: flex;
          align-items: center;
          right: 12px;
        }
      }
    }
  }
</style>
