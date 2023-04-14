<template>
  <base-popup name="popup-add-map" class="popup-add-map" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ getName }}</span>
    </div>
    <div class="content">
      <el-form :model="form" :rules="rules" ref="popup-add-map">
        <el-form-item :label="$t('label_name')" prop="metaName">
          <el-input v-model="form.metaName" :placeholder="$t('label_name')" />
        </el-form-item>
        <el-form-item :label="$t('label_annotate')">
          <el-input v-model="form.metaAnnotation" :placeholder="$t('label_annotate')" />
        </el-form-item>
        <!-- <el-form-item :label="$t('label_type')" prop="type">
          <el-select v-model="form.type" class="w-100">
            <el-option :label="$t('label_number')" value="number" />
            <el-option :label="$t('label_text')" value="text" />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('label_value')" prop="metaStaticValue">
          <el-input v-model="form.metaStaticValue" :placeholder="$t('label_value')" />
        </el-form-item>
        <el-form-item :label="$t('label_long-desc')" prop="metaValue">
          <el-input v-model="form.metaValue" :placeholder="$t('label_long-desc')" />
        </el-form-item>
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
  import { IMetaMap, IMetaTypes } from '../../interface'
  import filter from 'lodash/filter'
  const bcNft = namespace('bcNft')

  @Component({
    components: {}
  })
  export default class PopupAddMap extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: string
    @Prop({ required: false, type: Object, default: () => ({}) }) rowCurrent!: Record<string, any>
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number

    @bcNft.State('metaTypes') metaTypes!: IMetaTypes[]

    form: IMetaMap = {
      metaName: '',
      metaAnnotation: '',
      metaValueType: 'MAP',
      metaDescription: '',
      metaStaticValue: '',
      metaValue: '',
      metaTypeId: 0
    }

    rules: Record<string, any> = {
      metaName: [
        {
          required: true,
          message: this.$t('validate_must-enter-name'),
          trigger: 'blur'
        }
      ],
      metaStaticValue: [
        {
          required: true,
          message: this.$t('validate_must-enter-value'),
          trigger: 'blur'
        }
      ],
      metaValue: [
        {
          required: true,
          message: this.$t('validate_must-enter-desc'),
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
      this.$refs['popup-add-map']?.clearValidate()
    }
    handleOpen(): void {
      if (this.typePopup === 'edit') {
        this.form = { ...this.form, ...this.rowCurrent }
      } else {
        this.form = {
          metaName: '',
          metaAnnotation: '',
          metaValueType: 'MAP',
          metaDescription: '',
          metaValue: '',
          metaTypeId: this.idTabActive
        }
      }
    }
    handleSubmit(): void {
      //@ts-ignore
      this.$refs['popup-add-map']?.validate(valid => {
        if (valid) {
          if (this.typePopup === 'add') {
            this.form.metaDescription = this.form.metaAnnotation
            this.$emit('confirm', this.form)
          } else {
            this.form.metaDescription = this.form.metaAnnotation
            this.$emit('edit', this.form)
          }

          this.handleCancel()
        }
      })
    }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-add-map',
        isOpen: false
      })
    }

    handleDelete(): void {
      this.$emit('confirmDelete')
    }
  }
</script>

<style scoped lang="scss">
  .popup-add-map {
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
