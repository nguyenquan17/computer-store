<template>
  <base-popup name="popup-feature-actions" class="popup-feature-actions" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ getTitle }} </span>
    </div>
    <div class="content" v-if="action !== 'DELETE'">
      <div class="feature-name">
        <p class="feature-name__title">{{ $t('metamart.template.name') }} <span style="color: #cf202f">*</span></p>
        <el-input v-model="name" :placeholder="$t('metamart.template.placeholder.enter-name')" class="feature-name__value"></el-input>
      </div>
      <div class="feature-switch">
        <span class="feature-switch__title">{{ $t('metamart.template.feature-status') }}</span>
        <el-switch v-model="swValue" class="feature-switch__btn" active-color="#13ce66"></el-switch>
      </div>
    </div>
    <div class="content" v-else>
      <span class="delete-message">
        {{ $t('metamart.template.delete-feature-message-first') }}
        <span class="feature-delete"> “{{ feature.metaName }}” </span>
        {{ $t('metamart.template.delete-feature-message-second') }}
      </span>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button :class="'passive'" class="btn-default btn-400 btn-h-40 btn-close" @click="handleCancel"> {{ $t('metamart.template.popup.meta-data.passive-btn') }} </el-button>
          <el-button
            :class="'active'"
            class="btn-default-bg btn-400 btn-h-40 is-none-border"
            style="font-size: 14px; font-weight: 600"
            :disabled="name === '' && action !== 'DELETE'"
            @click="handleAction"
          >
            {{ getTitleButton }}
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { NftRepository } from '@/services/repositories/nft'
  import getRepository from '@/services'
  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class PopupFeatureActions extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String }) action!: string
    @Prop({
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    })
    feature!: Record<string, any>
    name = ''
    swValue = false
    get getTitle(): string {
      let title = this.action.toLowerCase()
      let rs = ''
      if (title === 'add') {
        rs = this.$i18n.t('metamart.template.popup.title-add') + ''
      } else if (title === 'edit') {
        rs = this.$i18n.t('metamart.template.popup.title-edit') + ''
      } else if (title === 'delete') {
        rs = this.$i18n.t('metamart.template.popup.title-delete') + ''
      }
      return rs
    }
    get getTitleButton(): string {
      let title = this.action.toLowerCase()
      let rs = ''
      if (title === 'add') {
        rs = this.$i18n.t('metamart.template.title-btn-add') + ''
      } else if (title === 'edit') {
        rs = this.$i18n.t('metamart.template.title-btn-edit') + ''
      } else if (title === 'delete') {
        rs = this.$i18n.t('metamart.template.title-btn-delete') + ''
      }
      return rs
    }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-feature-actions',
        isOpen: false
      })
    }
    handleAction(): void {
      this.$emit('change', {
        action: this.action === 'ADD' ? 1 : this.action === 'EDIT' ? 2 : 3,
        name: this.name,
        value: this.swValue
      })
      this.setOpenPopup({
        popupName: 'popup-feature-actions',
        isOpen: false
      })
    }
    handleOpen(): void {
      if (this.action === 'EDIT') {
        console.log('73...')

        this.name = this.feature.metaName
        this.swValue = this.feature.metaValue === 'TRUE'
      }
    }
    handleClose(): void {
      this.name = ''
      this.swValue = false
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
  ::v-deep.popup-feature-actions {
    .popup-content {
      padding: 24px;
      .feature {
        &-name {
          margin-bottom: 24px;
          &__title {
            @include text(14px, 20px, 400, #0a0b0d);
            margin-bottom: 8px;
          }
          &__value {
            .el-input__inner {
              font-size: 16px;
              line-height: 24px;
              height: 48px;
            }
          }
        }
        &-switch {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
      }
      .content {
        .delete-message {
          @include text(16px, 24px, 400, #5b616e);
          .feature-delete {
            @include text(16px, 24px, 600, #0a0b0d);
          }
        }
      }
    }
  }
</style>
