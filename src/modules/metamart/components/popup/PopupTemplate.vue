<template>
  <base-popup name="popup-template" class="popup-template" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ title }}</span>
    </div>
    <div class="content">
      <p class="content-title">{{ $t('metamart.template.popup.add-new.content-title') }} <span style="color: #db5454">*</span></p>
      <el-input v-model="template" :placeholder="$t('metamart.template.placeholder.new-template')" @change="validateTemplate" :class="{ alert: notify }"></el-input>
      <p class="content-alert" v-show="notify">{{ $t('metamart.template.popup.add-new.alert') }}</p>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button :class="'passive'" class="btn-default btn-400 btn-h-40 btn-close" @click="handleClose"> {{ $t('metamart.template.popup.add-new.passive-btn') }} </el-button>
          <el-button
            :class="'active'"
            class="btn-default-bg btn-400 btn-h-40 is-none-border"
            :disabled="template === ''"
            @click="handleCreate"
            style="font-size: 14px; font-weight: 600"
          >
            {{ $t('metamart.template.popup.add-new.active-btn') }}
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  @Component
  export default class PopupTemplate extends Mixins(PopupMixin) {
    @Prop({
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    })
    duplicate!: Record<string, any>
    @Prop({ required: true, type: String }) action!: string
    template = ''
    notify = false
    get title(): string {
      if (this.action === 'DUPLICATE') {
        return this.$i18n.t('metamart.template.title-duplicate') + ''
      } else {
        return this.$i18n.t('metamart.template.title-add-template') + ''
      }
    }
    validateTemplate(): void {
      this.notify = this.template === ''
    }
    handleOpen(): void {
      if (this.action === 'DUPLICATE') {
        this.handleInitDuplicate()
      }
    }
    handleInitDuplicate(): void {
      this.template = this.duplicate.templateName
    }
    handleClose(): void {
      this.$emit('close')
      this.setOpenPopup({
        popupName: 'popup-template',
        isOpen: false
      })
    }
    handleCreate(): void {
      if (this.action === 'ADD') {
        this.$emit('create', {
          template: this.template.trim(),
          templateId: null
        })
      } else {
        this.$emit('duplicate', {
          template: this.template.trim(),
          templateId: this.duplicate.templateId
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-template {
    .popup-content {
      padding: 24px;
      .content-title {
        margin-bottom: 4px;
      }
      .content-alert {
        font-size: 12px;
        line-height: 16px;
        font-weight: 400;
        color: #db5454;
        margin-top: 4px;
      }
      .el-input__inner {
        font-size: 16px;
        line-height: 24px;
        height: 48px;
      }
      .alert {
        .el-input__inner {
          border-color: #db5454;
        }
      }
    }
    .popup-footer {
      .active,
      .passive {
        padding: 12px 28px;
      }
    }
  }
</style>
