<template>
  <base-popup name="popup-add-file" class="popup-add-file" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ getName }}</span>
    </div>
    <div class="content">
      <el-form :model="form" :rules="rules" ref="popup-add-file">
        <el-form-item :label="$t('label_name')" prop="metaName">
          <el-input v-model="form.metaName" :placeholder="$t('label_name')" />
        </el-form-item>
        <el-form-item :label="$t('label_file-attach')" prop="fileName">
          <div v-if="isShowUpload" class="text-disable text-xs">DOC, PDF, XLS</div>

          <el-upload
            v-show="isShowUpload"
            class="upload-demo upload-file"
            drag
            action=""
            :show-file-list="true"
            :auto-upload="false"
            accept=".doc,.docx, .pdf, .xls, .xlsx,.ppt,.pptx"
            :on-change="handleChangeFile"
          >
            <div class="el-upload__text text-base">
              {{ $t('label_upload-desc') }} <span class="text-hyperlink">{{ $t('label_click-to-upload') }}</span>
            </div>
          </el-upload>
          <div v-if="!isShowUpload" class="be-flex align-center jc-space-between show-file">
            <div class="be-flex align-center left">
              <img :src="form.metaIcon" />
              <div class="info">
                <p class="text-semibold text-base text-overflow-1">{{ form.fileName }}</p>
                <p class="text-body-small text-desc">{{ form.metaStatisValue | bytesToSize }}</p>
              </div>
            </div>
            <div class="cursor" @click="handleClearFile">
              <base-icon icon="icon-delete-circle-bg" size="24" />
            </div>
            <!-- <el-progress v-else type="circle" :percentage="rawFile.percentage" class="progress-file" status="success"></el-progress> -->
          </div>
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
          <el-button :loading="isLoading" type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.save') }}</span>
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import includes from 'lodash/includes'
  import { namespace } from 'vuex-class'

  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import UploadRepository from '@/services/repositories/upload'

  const bcAuth = namespace('beAuth')

  const apiUpload: UploadRepository = getRepository('upload')

  import { IMetaTypes } from '../../interface'
  import filter from 'lodash/filter'
  import { isEmpty } from 'lodash'
  const bcNft = namespace('bcNft')

  interface IForm {
    metaName?: string
    fileName?: string
    metaAnnotation?: string
    metaStatisValue?: number
    metaValueType?: string
    metaValue?: string
    metaIcon?: string
    [x: string]: any
  }

  @Component
  export default class PopupAddFile extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: string
    @Prop({ required: false, type: Object, default: () => ({}) }) rowCurrent!: Record<string, any>
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number

    @bcAuth.State('user') user!: Record<string, any>
    @bcNft.State('metaTypes') metaTypes!: IMetaTypes[]

    form: IForm = {
      metaName: '',
      fileName: '',
      metaAnnotation: '',
      metaStatisValue: 0,
      metaValueType: 'FILE',
      metaValue: '',
      metaIcon: ''
    }

    isLoading = false
    rawFile: Record<string, any> = {}

    isShowUpload = true

    rules: Record<string, any> = {
      metaName: [
        {
          required: true,
          message: this.$t('validate_must-enter-name'),
          trigger: 'blur'
        }
      ],
      fileName: [
        {
          required: true,
          message: this.$t('validate_must-enter-file'),
          trigger: 'change'
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

    getIconFile(metaAnnotation: string): string {
      const objType = {
        doc: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-doc.png',
        docx: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-doc.png',
        pdf: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-pdf.png',
        xls: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-excel.png',
        xlsx: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-excel.png',
        ppt: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-ppt.png',
        pptx: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-ppt.png'
      }
      return objType[metaAnnotation]
      // const arrFileWord = ['doc', 'docx']
      // const arrFilePdf = ['pdf']
      // return includes(arrFileWord, this.form.metaAnnotation) ? 'icon-word' : includes(arrFilePdf, this.form.metaAnnotation) ? 'icon-pdf' : 'icon-excel'
    }

    getInfoFile(file: Record<string, any>): void {
      const lastDot = file.name.lastIndexOf('.')
      this.form.fileName = file.name.substring(0, lastDot)
      this.form.metaAnnotation = file.name.substring(lastDot + 1).toLowerCase()
      this.form.metaStatisValue = file.size
      this.form.metaIcon = this.getIconFile(this.form.metaAnnotation as string)
    }

    handleClose(): void {
      //@ts-ignore
      this.$refs['popup-add-file']?.clearValidate()
    }
    handleOpen(): void {
      if (this.typePopup === 'edit') {
        this.form = { ...this.rowCurrent, fileName: this.rowCurrent.metaName }
        this.isShowUpload = false
      } else {
        this.form = {
          metaName: '',
          fileName: '',
          metaAnnotation: '',
          metaStatisValue: 0,
          metaValueType: 'FILE',
          metaValue: '',
          metaTypeId: this.idTabActive,
          metaIcon: ''
        }
        this.rawFile = {}
        this.isShowUpload = true
      }
    }

    async handleChangeFile(file: Record<string, any>): Promise<void> {
      try {
        console.log(file)

        if (!this.$options.filters?.validateFormatFile(file, 'METADATA_FILE')) {
          const message = this.$t('notify_invalid-file-type') as string
          this.$message.error(message)
          return
        }

        // file.percentage = 1

        // const processFunction = function (progressEvent) {
        //   let progress = (progressEvent.loaded / progressEvent.total) * 100
        //   file.percentage = progress
        // }

        this.rawFile = file
        this.getInfoFile(file)

        this.isShowUpload = false
      } catch (error) {
        const message = this.$t('notify_upload-fail') as string
        this.$message.error(message)
      }
    }

    handleClearFile(): void {
      this.isShowUpload = true
      this.form = {
        ...this.form,
        fileName: '',
        metaAnnotation: '',
        metaStatisValue: 0,
        metaValue: '',
        metaIcon: ''
      }
    }

    handleSubmit(): void {
      //@ts-ignore
      this.$refs['popup-add-file']?.validate(async valid => {
        if (valid) {
          if (!isEmpty(this.rawFile)) {
            this.isLoading = true
            const data: Record<string, any> = {}
            const formData = new FormData()
            formData.append('files', this.rawFile.raw)
            formData.append('type', 'METADATA_FILE')
            formData.append('userId', this.user.userId)
            data.data = formData
            const result = await apiUpload.uploadFileCreateNft(data)

            if (result.success.length) {
              this.form.metaValue = result.success[0].url
              if (this.typePopup === 'add') {
                this.$emit('confirm', this.form)
              } else {
                this.$emit('edit', this.form)
              }
              this.handleCancel()
            } else {
              const message = this.$t('notify_upload-fail') as string
              this.$message.error(message)
              this.isLoading = false
            }
          } else {
            if (this.typePopup === 'add') {
              this.$emit('confirm', this.form)
            } else {
              this.$emit('edit', this.form)
            }
            this.handleCancel()
          }
        }
      })
    }
    handleCancel(): void {
      this.rawFile = {}
      this.isLoading = false
      this.setOpenPopup({
        popupName: 'popup-add-file',
        isOpen: false
      })
    }
    handleDelete(): void {
      this.$emit('confirmDelete')
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-add-file {
    .upload-file {
      margin-top: 8px;
      .el-upload {
        &-dragger {
          height: 140px;
        }
        &-list {
          display: none;
        }
      }
    }
    .show-file {
      margin-top: 8px;
      padding: 12px;
      border: 1px dashed #dbdbdb;
      border-radius: 4px;
      .left {
        width: 80%;
        .info {
          margin-left: 16px;
          p:last-child {
            margin-top: 4px;
          }
        }
      }
      .progress-file {
        .el-progress-circle {
          width: 60px !important;
          height: 60px !important;
        }
      }
    }

    .footer {
      .wrap-button {
        .add-member {
          height: 40px;
          font-weight: 400;
          padding: 0 8px;
          margin-left: 0;
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
