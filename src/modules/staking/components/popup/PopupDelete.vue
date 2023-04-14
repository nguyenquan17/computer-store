<template>
  <base-popup name="popup-staking-delete" class="popup-delete" width="400px">
    <div class="title-popup" slot="title">
      <span>{{ $t('button.delete') }}</span>
    </div>
    <div class="content" style="padding-bottom: 24px">
      <p class="text-base text-desc break-work">
        Are you sure you want to delete this <span class="text-semibold text-primary">{{ row.planName }}</span
        >?
      </p>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex jc-flex-end">
        <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
        <el-button class="btn-default delete-btn" @click="handleSubmit">{{ $t('button.confirm') }}</el-button>
      </div>
    </div>
    <popup-verify @submit="handleSubmitDelete" />
  </base-popup>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupVerify from './PopupVerify.vue'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'
  import StakingRepository from '@/services/repositories/staking'
  const apiSetting: SettingRepository = getRepository('setting')
  const apiStaking: StakingRepository = getRepository('staking')

  @Component({ components: { PopupVerify } })
  export default class PopupStakingDelete extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) row!: Record<string, any>
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-staking-delete',
        isOpen: false
      })
    }
    handleCancel(): void {
      this.handleClose()
    }
    handleSubmit(): void {
      const data = {
        email: this.$store.state.beAuth.user.email,
        type: 'EMAIL',
        userType: 'EMPLOYEE'
      }
      apiSetting.resendCode(data).then(() => {
        this.setOpenPopup({
          popupName: 'popup-staking-verify-email',
          isOpen: true
        })
      })
    }

    async handleSubmitDelete(verifyCode: string): Promise<void> {
      try {
        await apiStaking.deleteStaking({ verifyCode }, this.row.id)
        this.$message.success({ message: 'Delete successfully', duration: 5000 })
        this.setOpenPopup({
          popupName: 'popup-staking-verify-email',
          isOpen: false
        })
        this.setOpenPopup({
          popupName: 'popup-staking-delete',
          isOpen: false
        })
        this.$emit('reload')
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-delete {
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
    }
  }
</style>
