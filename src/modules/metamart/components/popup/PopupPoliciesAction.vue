<template>
  <base-popup name="popup-policies-action" class="popup-policies-action" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ getTitle }}</span>
    </div>
    <div class="content" v-if="title === 'Delete'">
      <span class="delete-message">
        {{ $t('metamart.template.delete-row-message-first') }}
        <span class="row-delete"> “{{ row.metaName }}” </span>
        {{ $t('metamart.template.delete-row-message-second') }}
      </span>
    </div>
    <div class="content" v-if="title === 'Edit' || title === 'Add'">
      <div class="content-row">
        <p class="content-row__title">{{ $t('metamart.template.name') }} <span style="color: #cf202f">*</span></p>
        <el-input v-model="name" :placeholder="$t('metamart.template.placeholder.enter-name')" class="content-row__input"></el-input>
      </div>
      <div class="content-row">
        <p class="content-row__title">{{ $t('metamart.template.annotate') }}</p>
        <el-input
          v-model="annotate"
          type="textarea"
          :placeholder="$t('metamart.template.placeholder.annotate')"
          class="content-row__input"
          :autosize="{ minRows: 3, maxRows: 5 }"
          maxlength="200"
          show-word-limit
        ></el-input>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button :class="'passive'" class="btn-default btn-400 btn-h-40 btn-close" @click="handlePassive">
            {{ $t('metamart.template.popup.meta-data.passive-btn') }}
          </el-button>
          <el-button
            :class="'active'"
            class="btn-default-bg btn-400 btn-h-40 is-none-border"
            @click="handleActive"
            style="font-size: 14px; font-weight: 600"
            :disabled="name === '' && title !== 'Delete'"
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
  @Component
  export default class PopupPoliciesAction extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String }) title!: string
    @Prop({ required: true, type: Object }) row!: Record<string, any>
    name = ''
    annotate = ''
    handleClose(): void {
      console.log('close')
      this.name = ''
      this.annotate = ''
    }
    get getTitle(): string {
      let title = this.title.toLowerCase()
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
      let title = this.title.toLowerCase()
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
    handleOpen(): void {
      if (this.title === 'Edit') {
        this.handleInitEdit()
      }
    }
    handleInitEdit(): void {
      if (this.title === 'Edit') {
        this.name = this.row.metaName
        this.annotate = this.row.metaAnnotation
      }
    }
    handlePassive(): void {
      console.log('passive')
      this.setOpenPopup({
        popupName: 'popup-policies-action',
        isOpen: false
      })
    }
    handleActive(): void {
      console.log('active')
      this.handlePassive()
      if (this.title === 'Delete') {
        this.$emit('delete')
      } else if (this.title === 'Add') {
        this.$emit('change', {
          action: 1,
          name: this.name,
          annotate: this.annotate
        })
      } else if (this.title === 'Edit') {
        this.$emit('change', {
          action: 2,
          name: this.name,
          annotate: this.annotate
        })
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
  ::v-deep.popup-policies-action {
    .popup-content {
      padding-bottom: 24px;
      .content {
        .delete-message {
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
          color: #5b616e;
          .row-delete {
            font-weight: 600;
            color: #0a0b0d;
          }
        }
        &-row {
          width: 100%;
          height: auto;
          &:not(:last-child) {
            margin-bottom: 24px;
          }
          &__title {
            @include text(14px, 20px, 400, #0a0b0d);
            margin-bottom: 8px;
          }
          &__input {
            .el-input__inner {
              font-size: 16px;
              line-height: 24px;
              height: 48px;
            }
          }
        }
      }
    }
  }
</style>
