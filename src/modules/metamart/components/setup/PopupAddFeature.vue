<template>
  <base-popup name="popup-add-feature" class="popup-add-feature" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ getName }}</span>
    </div>
    <div class="content">
      <el-form :model="form" :rules="rules" ref="popup-add-feature">
        <el-form-item :label="$t('label_name')" prop="metaName">
          <el-input v-model="form.metaName" :placeholder="$t('label_name')" />
        </el-form-item>
        <div class="be-flex align-center jc-space-between mb-24">
          <div class="text-body-small">{{ $t('label_feature-status') }}</div>
          <el-switch v-model="form.metaValue" active-value="true" inactive-value="false" active-color="#129961"> </el-switch>
        </div>
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button" :class="typePopup === 'add' ? 'jc-flex-end' : 'jc-space-between'">
        <div class="left" v-if="typePopup === 'edit'">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleDelete">{{ $t('button.delete') }}</el-button>
        </div>
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.save') }}</span>
          </button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'

  import { namespace } from 'vuex-class'
  import { IMetaTypes } from '../../interface'
  import filter from 'lodash/filter'
  const bcNft = namespace('bcNft')

  @Component
  export default class PopupAddFeature extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: string
    @Prop({ required: false, type: Object, default: () => ({}) }) rowCurrent!: Record<string, any>
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number

    @bcNft.State('metaTypes') metaTypes!: IMetaTypes[]

    form: Record<string, any> = {
      metaName: '',
      metaValue: 'false',
      metaValueType: 'BOOLEAN',
      metaTypeId: 0
    }

    rules: Record<string, any> = {
      metaName: [
        {
          required: true,
          message: this.$t('validate_must-enter-name'),
          trigger: 'blur'
        }
      ]
    }

    get getName(): string {
      if (this.metaTypes.length) {
        const type = filter(this.metaTypes, elm => elm.metaTypeId === this.idTabActive)
        const language = localStorage.getItem('bc-lang') || ''
        const parseJson = JSON.parse(type[0].metaTypeName)
        return this.typePopup === 'add' ? this.$t('popup_add') + ' ' + parseJson[language] : this.$t('popup_edit') + ' ' + parseJson[language]
      }
      return ''
    }

    handleClose(): void {
      //@ts-ignore
      this.$refs['popup-add-feature']?.clearValidate()
    }
    handleOpen(): void {
      if (this.typePopup === 'edit') {
        this.form = { ...this.rowCurrent }
      } else {
        this.form = {
          metaName: '',
          metaValue: 'false',
          metaValueType: 'BOOLEAN',
          metaTypeId: this.idTabActive
        }
      }
    }

    handleSubmit(): void {
      //@ts-ignore
      this.$refs['popup-add-feature']?.validate(valid => {
        if (valid) {
          if (this.typePopup === 'add') {
            this.$emit('confirm', this.form)
          } else {
            this.$emit('edit', this.form)
          }
          this.handleCancel()
        }
      })
    }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-add-feature',
        isOpen: false
      })
    }
    handleDelete(): void {
      this.$emit('confirmDelete')
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-add-feature {
    .el-switch {
      height: 26px;
      line-height: 26px;
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

    .footer {
      .wrap-button {
        .add-member {
          height: 40px;
          font-weight: 400;
          padding: 0 8px;
          &:hover {
            border: 1px solid transparent;
          }
        }
      }
      .jc-space-between {
        justify-content: space-between;
      }
      .btn-left {
        .btn-close {
          padding: 0;
          height: 40px;
        }
        .btn-delete:hover {
          border: 1px solid var(--bc-btn-bg-reject);
          color: var(--bc-status-error);
        }
      }
      .btn-close:focus {
        color: var(--bc-btn-text);
        background-color: var(--bc-bg-white);
      }
    }
  }
</style>
