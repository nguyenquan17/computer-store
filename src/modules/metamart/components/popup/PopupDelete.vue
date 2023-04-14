<template>
  <base-popup name="popup-metamart-delete" class="popup-delete" width="400px" :open="handleOpen" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('button.delete') }}</span>
    </div>
    <div class="content" style="padding-bottom: 24px" v-loading="isLoading">
      <span v-if="this.$route.name === 'Collection'" class="content-text">
        {{ $t('metamart.collection.delete.confirmation-1') }} <span class="content-text__item">{{ this.collectionDelete.collectionName }}</span>
        {{ $t('metamart.collection.delete.confirmation-2') }}
      </span>
      <span v-else-if="this.$route.name === 'Nft'" class="content-text">
        {{ $t('metamart.nft.delete.confirmation-1') }} <span class="content-text__item">{{ this.itemDelete.itemName }}</span>
        {{ $t('metamart.nft.delete.confirmation-2') }}
      </span>
      <span v-else class="content-text"> {{ $t('popup_category-delete') }} </span>
      <div v-if="isHaveNft" class="notification">
        <div class="notification-title">
          <div class="notification-title__icon">
            <img src="../../../../icons/png/alert.png" alt="icon alert" />
          </div>
          <p class="notification-title__text">{{ $t('metamart.collection.delete.warning-label') }}</p>
        </div>
        <p class="notification-subtitle">{{ $t('metamart.collection.delete.warning-description') }}</p>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex jc-flex-end">
        <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
        <el-button class="btn-default delete-btn" :disabled="isHaveNft || isNftInvalid || isLoading" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
      </div>
    </div>
    <popup-verify-email @submit="handleDelete"></popup-verify-email>
    <popup-success :type="deleteType"></popup-success>
  </base-popup>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins, Prop, Emit } from 'vue-property-decorator'
  import PopupVerifyEmail from './PopupVerifyEmail.vue'
  import PopupSuccess from './PopupSuccess.vue'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  const beAuth = namespace('beAuth')
  import getRepository from '@/services'
  import { AuthRepository } from '@/services/repositories/auth'
  import { NftRepository } from '@/services/repositories/nft'

  const apiUser: AuthRepository = getRepository('auth')
  const apiNft: NftRepository = getRepository('nft')

  @Component({
    components: { PopupVerifyEmail, PopupSuccess }
  })
  export default class PopupDelete extends Mixins(PopupMixin) {
    @beAuth.State('user') user!: Record<string, any>
    @Prop() idDelete!: any
    @Prop({ required: false, type: Object, default: () => ({}) }) collectionDelete!: Record<string, any>
    @Prop({ required: false, type: Object, default: () => ({}) }) itemDelete!: Record<string, any>

    isLoading = false
    value = ''
    deleteType = ''
    emailVerification = {
      email: this.user?.email,
      type: 'EMAIL',
      userType: 'EMPLOYEE'
    }

    isHaveNft = false
    isNftInvalid = false

    async checkValidNft(): Promise<void> {
      this.isLoading = true
      await apiNft
        .checkValidDeleteNft(this.itemDelete.id)
        .then(res => {
          this.isNftInvalid = false
          this.isLoading = false
        })
        .catch(e => {
          this.isNftInvalid = true
          this.isLoading = false
        })
    }

    async checkValidCollection(): Promise<void> {
      this.isLoading = true
      await apiNft
        .checkValidDeleteCollection(this.collectionDelete.id)
        .then(res => {
          this.isHaveNft = false
          this.isLoading = false
        })
        .catch(e => {
          this.isHaveNft = true
          this.isLoading = false
        })
    }

    async getEmailVerification(): Promise<void> {
      let params = {
        email: this.user.email,
        type: 'EMAIL',
        userType: 'EMPLOYEE'
      }
      await apiUser
        .getEmailVerification(params)
        .then((res: any) => {
          this.$message.success(`${this.$t('notify.send-code')}`)
          console.log(res)
        })
        .catch(e => {
          console.log(e)
        })
    }
    async deleteCategory(): Promise<void> {
      let params = {
        verificationCode: this.value,
        type: 'EMAIL',
        email: this.user.email
      }
      console.log(params, 'params xoa category')
      await apiNft
        .deleteCategory(this.idDelete, params)
        .then((res: any) => {
          this.setOpenPopup({
            popupName: 'popup-metamart-verify-email',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-metamart-success',
            isOpen: true
          })
          this.$emit('load')
        })
        .catch(e => {
          console.log(e)
        })
    }
    async deleteCollection(): Promise<void> {
      let params = {
        verificationCode: this.value
      }
      console.log('params xoa collection', params)
      await apiNft
        .deleteCollection(this.collectionDelete.id, params)
        .then((res: any) => {
          this.deleteType = 'delete-collection'
          this.setOpenPopup({
            popupName: 'popup-metamart-verify-email',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-metamart-success',
            isOpen: true
          })
          this.$emit('reload')
        })
        .catch((e: any) => {
          console.log('Fail RES:', e.response)
        })
    }
    async deleteNftItem(): Promise<void> {
      let params = {
        verificationCode: this.value
      }
      await apiNft
        .deleteNft(this.itemDelete.id, params)
        .then((res: any) => {
          this.deleteType = 'delete-nft'
          this.setOpenPopup({
            popupName: 'popup-metamart-verify-email',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-metamart-success',
            isOpen: true
          })
          this.$emit('reload')
        })
        .catch((e: any) => {
          console.log('Fail RES:', e.response)
        })
    }

    created(): void {
      EventBus.$on('closePopup', this.handleCancel)
    }
    destroyed(): void {
      EventBus.$off('closePopup', this.handleCancel)
    }
    handleOpen(): void {
      // if (this.$route.name === 'Collection') {
      //   this.checkValidCollection()
      // }
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-metamart-delete',
        isOpen: false
      })
      this.isHaveNft = false
      this.isNftInvalid = false
      this.deleteType = ''
    }
    handleCancel(): void {
      this.handleClose()
    }
    handleSubmit(): void {
      if (this.$route.name === 'Collection') {
        if (this.isHaveNft) {
          return
        } else {
          this.setOpenPopup({
            popupName: 'popup-metamart-verify-email',
            isOpen: true
          })
          this.getEmailVerification()
        }
      }
      if (this.$route.name === 'Nft') {
        if (this.isNftInvalid) {
          return
        } else {
          this.setOpenPopup({
            popupName: 'popup-metamart-verify-email',
            isOpen: true
          })
          this.getEmailVerification()
        }
      }
      if (this.$route.name === 'Category') {
        this.getEmailVerification()
        this.setOpenPopup({
          popupName: 'popup-metamart-verify-email',
          isOpen: true
        })
      }
    }
    handleDelete(value: any): void {
      if (this.$route.name === 'Category') {
        this.value = value
        this.deleteCategory()
      } else if (this.$route.name === 'Collection') {
        this.value = value
        this.deleteCollection()
      } else if (this.$route.name === 'Nft') {
        this.value = value
        this.deleteNftItem()
      }
      //if success
      // Tạm đóng cái này
      // this.setOpenPopup({
      //   popupName: 'popup-metamart-verify-email',
      //   isOpen: false
      // })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-delete {
    .content {
      &-text {
        word-break: break-word;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: var(--bc-text-discript);
        &__item {
          color: var(--bc-text-primary);
          font-weight: 600;
        }
      }
    }
    .notification {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 24px;
      padding: 12px 24px;
      background-color: var(--bc-bg-error);
      border-radius: 6px;
      &-title {
        display: flex;
        align-items: center;
        gap: 10px;
        &__icon {
          width: 22px;
          height: 22px;
        }
        &__text {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
          color: var(--bc-status-error);
        }
      }
      &-subtitle {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: var(--bc-text-discript);
      }
    }
    .footer {
      .delete-btn {
        width: 100px;
        margin: 0;
        background-color: var(--bc-theme-primary);
        color: var(--bc-color-white);
        border: none;
        &:hover {
          background-color: var(--bc-btn-bg-default-hover);
        }
      }
      .is-disabled {
        background-color: var(--bc-color-grey20);
        color: var(--bc-status-neutral);
        &:hover {
          background-color: var(--bc-color-grey20);
        }
      }
    }
  }
</style>
