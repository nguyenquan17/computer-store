<template>
  <base-popup name="popup-delete-banner" class="popup-delete-banner" width="400px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.banner.popup.delete') }}</span>
    </div>
    <div class="content">
      {{ $t('metamart.banner.popup.delete-message-first') }}
      <span class="banner">
        {{ banner.objectName }}
      </span>
      {{ $t('metamart.banner.popup.delete-message-second') }}
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button :class="'passive'" class="btn-default btn-400 btn-h-40 btn-close" @click="handleCancel"> {{ $t('metamart.template.popup.add-new.passive-btn') }} </el-button>
          <el-button :class="'active'" class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" @click="handleConfirm">
            {{ $t('metamart.banner.popup.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { AuthRepository } from '@/services/repositories/auth'
  import getRepository from '@/services'
  import { namespace } from 'vuex-class'
  import { NftRepository } from '@/services/repositories/nft'
  const apiNft: NftRepository = getRepository('nft')
  const apiUser: AuthRepository = getRepository('auth')
  const beAuth = namespace('beAuth')
  @Component
  export default class PopupDeleteBanner extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object }) banner!: Record<string, any>
    @beAuth.State('user') userInfo!: Record<string, any>
    handleOpen(): void {
      console.log('open')
    }
    handleClose(): void {
      console.log('close')
    }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-delete-banner',
        isOpen: false
      })
    }
    handleConfirm(): void {
      this.sendVerifyCode()
    }
    async sendVerifyCode(): Promise<void> {
      const params = {
        email: this.userInfo.email,
        type: 'EMAIL',
        userType: 'EMPLOYEE'
      }
      try {
        await apiUser.getEmailVerification(params)
        this.setOpenPopup({
          popupName: 'popup-delete-banner',
          isOpen: false
        })
        this.$message({
          message: '' + this.$i18n.t('metamart.banner.sent-code'),
          duration: 3500,
          type: 'success'
        })
        this.$emit('confirm')
      } catch (error) {
        this.setOpenPopup({
          popupName: 'popup-delete-banner',
          isOpen: false
        })
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    font-weight: $weight;
    line-height: $height;
    color: $color;
  }
  ::v-deep.popup-delete-banner {
    .popup-content {
      padding-bottom: 24px;
      .content {
        @include text(14px, 24px, 400, #5b616e);
        word-break: break-word;
        .banner {
          @include text(16px, 24px, 600, #0a0b0d);
        }
      }
    }
  }
</style>
