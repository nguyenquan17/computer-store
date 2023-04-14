<template>
  <base-popup name="popup-banner" class="popup-banner" width="960px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ type === 'add' ? $t('metamart.banner.popup.add-banner') : $t('metamart.banner.popup.edit-banner') }}</span>
    </div>
    <div class="content">
      <div class="content-row">
        <p class="content-row__title">
          <span class="primary">{{ data.displayName.title }}</span>
          <span class="sub"> {{ data.displayName.subtitle }}</span>
          <span class="required" v-if="data.displayName.required" style="color: #cf202f"> *</span>
        </p>
        <el-input
          v-model="data.displayName.value"
          :placeholder="data.displayName.placeholder"
          class="content-row__input"
          :class="{ red: data.displayName.alert === false }"
        ></el-input>
        <p class="content-row__alert" v-if="data.displayName.alert === false">{{ $t('metamart.banner.popup.alert-name') }}</p>
      </div>
      <div class="content-row">
        <p class="content-row__title">
          <span class="primary">{{ data.descript.title }} &nbsp;</span>
          <span class="sub">{{ data.descript.subtitle }}</span>
          <span class="required" v-if="data.descript.required" style="color: #cf202f"> *</span>
        </p>
        <el-input
          v-model="data.descript.value"
          type="textarea"
          :placeholder="data.descript.placeholder"
          class="content-row__input"
          :class="{ red: data.descript.alert === false }"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :maxlength="200"
          :show-word-limit="true"
        ></el-input>
      </div>
      <div class="content-row">
        <p class="content-row__title">
          <span class="primary">{{ data.upload.title }}</span>
          <span class="sub"> {{ data.upload.subtitle }}</span>
          <span class="required" v-if="data.upload.required" style="color: #cf202f"> *</span>
        </p>
        <p class="content-row__tip">{{ data.upload.placeholder }}</p>
        <el-upload
          class="content-row__upload"
          :class="{ red: data.upload.alert === false, expand: data.upload.value !== '' }"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :file-list="fileList"
          :multiple="false"
          :auto-upload="false"
          accept=".png, .jpg, .gif, .mp4"
          :on-change="handleUpload"
        >
          <div class="el-upload__text" v-if="data.upload.value === ''">
            {{ $t('metamart.banner.popup.placeholder.upload-inner') }} <em>{{ $t('metamart.banner.popup.placeholder.upload-inner-em') }}</em>
          </div>
          <div class="preview" v-if="data.upload.value !== '' && uploadType === 'IMAGE'" @click.stop>
            <img :src="data.upload.value" />
            <base-icon icon="icon-delete-circle" class="preview-del" size="40" @click.native.stop="handleDeleteImage" />
          </div>
          <div class="preview" v-if="data.upload.value !== '' && uploadType === 'VIDEO'" @click.stop>
            <video-player :src="data.upload.value" :type="fileType" @click.native.stop />
            <base-icon icon="icon-delete-circle" class="preview-del" size="40" @click.native.stop="handleDeleteImage" />
          </div>
        </el-upload>
        <p class="content-row__alert" v-if="data.upload.alert === false">{{ $t('metamart.banner.popup.alert-upload') }}</p>
      </div>
      <div class="content-row">
        <p class="content-row__title">
          <span class="primary">{{ data.url.title }}</span>
          <span class="sub"> {{ data.url.subtitle }}</span>
          <span class="required" v-if="data.url.required" style="color: #cf202f"> *</span>
        </p>
        <el-input v-model="data.url.value" :placeholder="data.url.placeholder" class="content-row__input" :class="{ red: data.url.alert === false }"></el-input>
        <p class="content-row__alert" v-if="data.url.alert === false">{{ $t('metamart.banner.popup.alert-url') }}</p>
      </div>
      <div class="content-row">
        <p class="content-row__title">
          <span class="primary">{{ data.position.title }}</span>
          <span class="sub"> {{ data.position.subtitle }}</span>
          <span class="required" v-if="data.position.required" style="color: #cf202f"> *</span>
        </p>
        <el-input v-model="data.position.value" :placeholder="data.position.placeholder" class="content-row__input" @keypress.native="onlyNumber($event)"></el-input>
      </div>
      <div class="flex align-center jc-space-between content-row">
        <div class="left">
          <p class="text-base text-semibold">{{ $t('adv') }}</p>
          <p style="margin-top: 4px" class="text-desc nft-body-small break-work">{{ $t('adv-sub') }}</p>
        </div>
        <div class="switch">
          <el-switch v-model="adversimentPopup" active-value="YES" inactive-value="NO" active-color="#129961"> </el-switch>
        </div>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <div class="btn-delete cursor" @click="deleteInPopup" v-if="type === 'edit'">{{ $t('metamart.banner.btn-delete') }}</div>
          <el-button :class="'passive'" class="btn-default btn-400 btn-h-40 btn-close" @click="handleCancel"> {{ $t('metamart.template.popup.add-new.passive-btn') }} </el-button>
          <el-button :class="'active'" class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" @click="handleCreate">
            {{ type === 'add' ? $t('metamart.template.popup.add-new.active-btn') : $t('metamart.banner.save') }}
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import UploadRepository from '@/services/repositories/upload'
  import getRepository from '@/services'
  import { namespace } from 'vuex-class'
  import { NftRepository } from '@/services/repositories/nft'
  import EventBus from '@/utils/eventBus'
  import VideoPlayer from '../video/VideoPlayer.vue'
  const apiUpload: UploadRepository = getRepository('upload')
  const apiNft: NftRepository = getRepository('nft')
  const bcAuth = namespace('bcAuth')
  @Component({ components: { VideoPlayer } })
  export default class PopupBanner extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String }) type!: string
    @Prop({
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    })
    banner!: Record<string, any>
    // bannerCaptured: Record<string, any> = {}
    @bcAuth.State('user') user!: Record<string, any>
    userId = this.$store.state.beAuth.user.userId
    fileList = []
    disabled = false
    uploadType = ''
    fileType = ''
    data = {
      displayName: {
        title: this.$i18n.t('metamart.banner.popup.display-name'),
        subtitle: '',
        value: '',
        placeholder: this.$i18n.t('metamart.banner.popup.placeholder.name'),
        required: true,
        alert: true
      },
      descript: {
        title: this.$i18n.t('metamart.banner.popup.descript.primary'),
        subtitle: this.$i18n.t('metamart.banner.popup.descript.sub'),
        placeholder: this.$i18n.t('metamart.banner.popup.placeholder.description'),
        value: '',
        required: false,
        alert: true
      },
      upload: {
        title: this.$i18n.t('metamart.banner.popup.upload'),
        subtitle: '',
        placeholder: this.$i18n.t('metamart.banner.popup.placeholder.upload'),
        value: '',
        required: true,
        alert: true
      },
      url: {
        title: 'URL',
        subtitle: '',
        placeholder: this.$i18n.t('metamart.banner.popup.placeholder.link'),
        value: '',
        required: true,
        alert: true
      },
      position: {
        title: this.$i18n.t('metamart.banner.popup.position'),
        subtitle: '',
        placeholder: this.$i18n.t('metamart.banner.popup.placeholder.position'),
        value: '',
        required: false,
        alert: true
      }
    }

    adversimentPopup = 'NO'

    onlyNumber(event: KeyboardEvent): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
    }
    handleCancel(): void {
      this.handleReset()
      this.setOpenPopup({
        popupName: 'popup-banner',
        isOpen: false
      })
    }
    handleClose(): void {
      this.handleReset()
      this.setOpenPopup({
        popupName: 'popup-template',
        isOpen: false
      })
      this.$emit('close')
    }
    handleOpen(): void {
      if (this.type === 'edit') {
        this.handleInitBanner()
      }
    }
    async handleUpload(file: Record<string, any>): Promise<void> {
      const patternFilType = /(\.png|\.jpg|\.gif|\.mp4)$/
      console.log(file, '202')
      if (!patternFilType.test(file.name)) {
        this.$message({
          message: '' + this.$i18n.t('metamart.banner.popup.incorrect-file'),
          duration: 3500,
          type: 'error'
        })
      } else {
        this.fileType = file.raw.type
        if (file.raw.type.indexOf('image') !== -1) {
          this.uploadType = 'IMAGE'
        } else if (file.raw.type.indexOf('video') !== -1) {
          this.uploadType = 'VIDEO'
        }
        const formData = new FormData()
        formData.append('files', file.raw)
        formData.append('type', 'BANNER_UNIQUE')
        formData.append('userId', this.userId)
        try {
          const rs = await apiUpload.uploadImage(formData)
          this.data.upload.value = rs.success[0].url
        } catch (error) {
          this.$message({
            message: '' + this.$i18n.t('metamart.banner.popup.upload-failed'),
            duration: 3500,
            type: 'error'
          })
          console.log(error)
        }
      }
    }
    handleDeleteImage(): void {
      this.data.upload.value = ''
      this.uploadType = ''
      this.fileType = ''
    }
    handleValidate(): void {
      const keys = Object.keys(this.data)
      for (let key of keys) {
        if (this.data[key].required) {
          this.data[key].alert = this.data[key].value !== ''
        }
      }
      const values = Object.values(this.data)
      this.disabled = values.some((value: Record<string, any>): boolean => {
        return value.alert === false
      })
    }
    async handleCreate(): Promise<void> {
      this.handleValidate()
      if (!this.disabled) {
        const params: Record<string, any> = {
          displayName: this.data.displayName.value,
          objectId: 0,
          objectType: '',
          url: this.data.url.value,
          description: this.data.descript.value,
          avatar: this.data.upload.value,
          mediaType: this.uploadType,
          position: this.data.position.value !== '' ? +this.data.position.value : 0,
          adversiment: this.adversimentPopup
        }
        const pattern = /\/[0-9]+/g
        const collectionPattern = `${process.env.VUE_APP_URL_MARKETPLACE}/collection/id`
        const nftPattern = `${process.env.VUE_APP_URL_MARKETPLACE}/nft/id`
        let path = this.data.url.value
        path = path.replaceAll(pattern, '/id')
        path = path.replaceAll(/\/$/g, '')
        if (path === collectionPattern) {
          const mock = this.data.url.value
          params.objectId = +mock.replaceAll(`${process.env.VUE_APP_URL_MARKETPLACE}/collection/`, '').replaceAll(/\/$/g, '')
          params.objectType = 'COLLECTION'
        } else if (path === nftPattern) {
          const mock = this.data.url.value
          params.objectId = +mock.replaceAll(`${process.env.VUE_APP_URL_MARKETPLACE}/nft/`, '').replaceAll(/\/$/g, '')
          params.objectType = 'NFT'
        } else {
          params.objectId = null
          params.objectType = null
        }
        try {
          if (this.type === 'add') {
            await apiNft.createBanner(params)
            this.$message({
              message: '' + this.$i18n.t('metamart.banner.popup.create-success'),
              duration: 3500,
              type: 'success'
            })
          } else if (this.type === 'edit') {
            await apiNft.updateBanner(this.banner.id, params)
            this.$message({
              message: '' + this.$i18n.t('metamart.banner.popup.update-success'),
              duration: 3500,
              type: 'success'
            })
          }
          EventBus.$emit('banner-completed')
          this.handleCancel()
        } catch (error) {
          console.log(error)
          this.$message({
            message: '' + (this.type === 'add' ? this.$i18n.t('metamart.banner.popup.create-error') : this.$i18n.t('metamart.banner.popup.update-error')),
            duration: 3500,
            type: 'success'
          })
        }
      }
    }
    handleReset(): void {
      this.data = {
        displayName: {
          title: this.$i18n.t('metamart.banner.popup.display-name'),
          subtitle: '',
          value: '',
          placeholder: this.$i18n.t('metamart.banner.popup.placeholder.name'),
          required: true,
          alert: true
        },
        descript: {
          title: this.$i18n.t('metamart.banner.popup.descript.primary'),
          subtitle: this.$i18n.t('metamart.banner.popup.descript.sub'),
          placeholder: this.$i18n.t('metamart.banner.popup.placeholder.description'),
          value: '',
          required: false,
          alert: true
        },
        upload: {
          title: this.$i18n.t('metamart.banner.popup.upload'),
          subtitle: '',
          placeholder: this.$i18n.t('metamart.banner.popup.placeholder.upload'),
          value: '',
          required: true,
          alert: true
        },
        url: {
          title: 'URL',
          subtitle: '',
          placeholder: this.$i18n.t('metamart.banner.popup.placeholder.link'),
          value: '',
          required: true,
          alert: true
        },
        position: {
          title: this.$i18n.t('metamart.banner.popup.position'),
          subtitle: '',
          placeholder: this.$i18n.t('metamart.banner.popup.placeholder.position'),
          value: '',
          required: false,
          alert: true
        }
      }
      this.adversimentPopup = 'NO'
      this.disabled = false
      this.uploadType = ''
      this.fileType = ''
    }
    handleInitBanner(): void {
      let descript: any = this.banner.objectShortDescription
      descript = JSON.parse(descript)
      const lang = '' + window.localStorage.getItem('bc-lang')
      this.uploadType = this.banner.objectAvatarType
      this.fileType = this.uploadType === 'VIDEO' ? 'video/mp4' : ''
      this.data.descript.value = descript[lang]
      this.data.displayName.value = this.banner.objectName
      this.data.upload.value = this.banner.objectAvatar
      this.data.url.value = this.banner.objectUrl
      this.data.position.value = this.banner.objectPosition
      this.adversimentPopup = this.banner.adversimentPopup
      // this.bannerCaptured = {
      //   displayName: this.data.displayName.value,
      //   description: this.data.descript.value,
      //   upload: this.data.upload.value,
      //   position: this.data.position.value,
      //   url: this.data.url.value
      // }
    }
    deleteInPopup(): void {
      this.setOpenPopup({
        popupName: 'popup-banner',
        isOpen: false
      })
      EventBus.$emit('delete-in-popup', this.banner)
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
  ::v-deep.popup-banner {
    .popup-content {
      padding-bottom: 24px;
      .content {
        &-row {
          width: 100%;
          height: auto;
          &:not(:last-child) {
            margin-bottom: 32px;
          }
          &__title {
            margin-bottom: 8px;
            .primary {
              @include text(16px, 24px, 600, #0a0b0d);
            }
            .sub {
              display: inline-block;
              // margin-left:
              @include text(16px, 24px, 400, #6f7580);
            }
          }
          &__input {
            .el-input__inner {
              height: 48px;
            }
            &.red {
              .el-input__inner,
              .el-textarea__inner {
                border-color: #cf202f;
              }
            }
            &.el-textarea {
              .el-textarea__inner {
                min-height: 89px !important;
                word-break: break-word;
              }
            }
          }
          &__upload {
            .el-upload__text {
              font-size: 16px;
            }
            .el-upload {
              width: 100%;
              &-dragger {
                width: 100%;
                height: 140px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                .preview {
                  width: auto;
                  height: auto;
                  border: 1px solid #dbdbdb;
                  position: absolute;
                  border-radius: 8px;
                  display: flex;
                  justify-content: center;
                  align-content: center;
                  img {
                    object-fit: cover;
                    width: 464px;
                    height: 308px;
                    border-radius: 8px;
                  }
                  video {
                    height: 308px;
                    border-radius: 8px;
                  }
                  &-del {
                    position: absolute;
                    top: -28px;
                    right: -20px;
                    z-index: 10;
                  }
                }
              }
            }
            &.red {
              .el-upload-dragger {
                border-color: #cf202f;
              }
            }
          }
          &__tip {
            @include text(12px, 16px, 400, #89909e);
            margin-bottom: 8px;
          }
          &__alert {
            margin-top: 4px;
            @include text(12px, 16px, 400, #cf202f);
          }
        }
        .switch {
          .el-switch {
            height: 28px;
            line-height: 28px;
            &__core {
              height: 100%;
              width: 46px !important;
              border-radius: 999px;
              &::after {
                width: 24px;
                height: 24px;
              }
            }
          }
          .is-checked {
            .el-switch__core {
              &::after {
                margin-left: -25px;
              }
            }
          }
        }
      }
    }
    .popup-footer {
      .btn-delete {
        display: block;
        float: left;
        width: fit-content;
        padding: 11px 28.5px;
        border-radius: 6px;
      }
    }
  }

  ::v-deep.expand .el-upload .el-upload-dragger {
    height: 380px !important;
  }
</style>
