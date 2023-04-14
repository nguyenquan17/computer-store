<template>
  <base-popup name="popup-request-nft-detail" class="popup-request-nft-detail" :width="getWidth" :open="handleOpen" :isShowFooter="isShowFooter">
    <div class="title-popup" slot="title">
      <span>{{ $t('popup_request-detail') }}</span>
    </div>
    <div class="content" :class="$route.params.type !== 'pending' ? 'be-flex content--full' : null">
      <!-- Left -->
      <div class="content__left">
        <div class="wrap">
          <div class="header">
            <img :src="detailRequest.itemThumb" alt="" />
            <p class="text-overflow-1 nft-body-large text-semibold">{{ detailRequest.itemName }}</p>
            <p class="nft-body-small text-desc">#{{ detailRequest.itemCode }}</p>
          </div>

          <detail-request-nft :detailRequest="detailRequest" />
          <div v-if="$route.params.type === 'pending'" class="line"></div>
          <div v-if="$route.params.type === 'pending'" class="mb-24 wrap-editor">
            <p class="nft-body-caption text-error" v-if="isRequiredEmployeeNote">{{ $t('popup_employee-note-required') }}</p>
            <p class="text-base text-semibold mb-12">{{ $t('popup_employee-note') }}</p>
            <jodit-editor :config="config" v-model="description" />
          </div>
        </div>
      </div>

      <!-- Right -->
      <div v-if="$route.params.type !== 'pending'" class="content__right">
        <div class="wrap">
          <div class="employee">
            <p class="text-base text-semibold mb-12">{{ $t('popup_employee-note') }}</p>
            <div v-if="description" class="view-content-html" v-html="description"></div>
          </div>

          <div v-if="!isShowFooter" class="line"></div>

          <div class="reply">
            <p class="text-base text-semibold mb-12">{{ $t('popup_reply-email') }}</p>
            <jodit-editor v-if="$route.params.type === 'pending' || $route.params.type === 'processing'" :config="configReply" v-model="emailContent" />
            <p v-else class="view-content-html" v-html="detailRequest.emailContent"></p>
            <p class="nft-body-caption text-error" v-if="isRequiredEmailContent">{{ $t('popup_reply-email-required') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer" slot="footer">
      <div class="be-flex jc-flex-end wrap-button">
        <div class="btn-right">
          <el-button v-if="$route.params.type === 'pending'" class="btn-default btn-400 btn-h-40 btn-close" @click="handleClose">{{ $t('button.cancel') }}</el-button>
          <el-button v-if="$route.params.type === 'processing'" class="btn-default btn-h-40 btn-cancel" @click="sendCode(true)">{{ $t('button.cancel-order') }} </el-button>
          <el-button type="button" class="btn-default-bg text-sm submit is-none-border btn-h-40 h-40" @click="sendCode(false)">
            <span v-if="$route.params.type === 'pending'">{{ $t('button.process') }}</span>
            <span v-else>{{ $t('button.complete') }}</span>
          </el-button>
        </div>
      </div>
    </div>
    <popup-verify-email @submit="handleSubmitCode" />
  </base-popup>
</template>

<script lang="ts">
  import { IDetailRequestNft } from '@/interface'
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import DetailRequestNft from './DetailRequestNft.vue'
  import PopupVerifyEmail from '@/modules/metamart/components/popup/PopupVerifyEmail.vue'

  import { JoditEditor } from 'jodit-vue'
  import 'jodit/build/jodit.min.css'
  import Cookies from 'js-cookie'
  import { API_URL } from '@/configs'
  const USERID = Cookies.get('user_id')

  import getRepository from '@/services'
  import { NftRepository } from '@/services/repositories/nft'
  import { SettingRepository } from '@/services/repositories/setting'

  const apiSetting: SettingRepository = getRepository('setting')
  const apiNft: NftRepository = getRepository('nft')

  @Component({ components: { DetailRequestNft, JoditEditor, PopupVerifyEmail } })
  export default class PopupRequestNftDetail extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) detailRequest!: IDetailRequestNft
    @Prop({ required: false, type: String, default: '' }) tabActive!: string

    description = ''
    emailContent = ''
    isCancel = false
    isRequiredEmployeeNote = false
    isRequiredEmailContent = false
    config = {
      spellcheck: false,
      showCharsCounter: false,
      showWordsCounter: false,
      autofocus: false,
      showXPathInStatusbar: false,
      language: 'en',
      minHeight: 200,
      removeButtons: ['about', 'print', 'selectall', 'video', 'file', 'preview', 'copyformat'],
      i18n: {
        vi: {
          'Type something': 'Nhập mô tả',
          'Search for': 'Nhập tìm kiếm',
          'Open in new tab': 'Mở tab mới',
          'No follow': 'Theo dõi liên kết',
          Insert: 'Thêm',
          Text: 'Tiêu đề',
          Upload: 'Tải lên',
          'Drop image': 'Kéo thả ảnh',
          'or click': 'hoặc chọn từ máy tính',
          'Alternative text': 'Văn bản thay thế'
          // URL: 'Liên kết'
        },
        en: {
          'Type something': 'Type something...'
        }
      },
      uploader: {
        url: `${API_URL}/file/api/v1/user/upload`,
        prepareData: function (formdata) {
          formdata.append('type', 'DESCRIPTION_NFT')
          formdata.append('userId', USERID)
        },
        format: 'json',
        headers: {
          Authorization: `Bearer ${this.$store.state.beAuth.access_token}`
        },
        isSuccess: function (resp: Record<string, any>): any {
          return !resp.error
        },
        getMessage: function (resp: Record<string, any>): string {
          return resp.msg
        },
        filesVariableName: function (e: any): string {
          return 'files'
        },
        process: function (resp: Record<string, any>): Record<string, any> {
          return {
            files: resp.data || []
          }
        },
        defaultHandlerSuccess: function (data: Record<string, any>): void {
          const field = 'files'

          if (data[field] && data[field]['success'].length) {
            for (let i = 0; i < data[field]['success'].length; i += 1) {
              //@ts-ignore
              this.s.insertImage(data[field]['success'][i].url)
            }
          }
        },
        error: function (e: any): void {
          console.error(e)
        }
      }
    }
    configReply = {
      spellcheck: false,
      showCharsCounter: false,
      showWordsCounter: false,
      autofocus: false,
      showXPathInStatusbar: false,
      language: 'en',
      minHeight: 200,
      removeButtons: ['about', 'print', 'selectall', 'video', 'file', 'preview', 'copyformat', 'image'],
      i18n: {
        vi: {
          'Type something': 'Nhập mô tả',
          'Search for': 'Nhập tìm kiếm',
          'Open in new tab': 'Mở tab mới',
          'No follow': 'Theo dõi liên kết',
          Insert: 'Thêm',
          Text: 'Tiêu đề',
          Upload: 'Tải lên',
          'Drop image': 'Kéo thả ảnh',
          'or click': 'hoặc chọn từ máy tính',
          'Alternative text': 'Văn bản thay thế'
          // URL: 'Liên kết'
        },
        en: {
          'Type something': 'Type something...'
        }
      },
      uploader: {
        url: `${API_URL}/file/api/v1/user/upload`,
        prepareData: function (formdata) {
          formdata.append('type', 'DESCRIPTION_NFT')
          formdata.append('userId', USERID)
        },
        format: 'json',
        headers: {
          Authorization: `Bearer ${this.$store.state.beAuth.access_token}`
        },
        isSuccess: function (resp: Record<string, any>): any {
          return !resp.error
        },
        getMessage: function (resp: Record<string, any>): string {
          return resp.msg
        },
        filesVariableName: function (e: any): string {
          return 'files'
        },
        process: function (resp: Record<string, any>): Record<string, any> {
          return {
            files: resp.data || []
          }
        },
        defaultHandlerSuccess: function (data: Record<string, any>): void {
          const field = 'files'

          if (data[field] && data[field]['success'].length) {
            for (let i = 0; i < data[field]['success'].length; i += 1) {
              //@ts-ignore
              this.s.insertImage(data[field]['success'][i].url)
            }
          }
        },
        error: function (e: any): void {
          console.error(e)
        }
      }
    }

    get getWidth(): string {
      return this.$route.params.type === 'pending' ? '600px' : '1200px'
    }

    get isShowFooter(): boolean {
      return this.$route.params.type === 'pending' || this.$route.params.type === 'processing'
    }

    handleOpen(): void {
      const type = this.$route.params.type
      this.isCancel = false
      this.emailContent = ''
      if (type === 'pending') {
        this.description = ''
      } else {
        this.description = this.detailRequest.description
      }
    }

    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-request-nft-detail',
        isOpen: false
      })
    }

    async sendCode(status: boolean): Promise<void> {
      const type = this.$route.params.type
      if (type === 'pending' && (!this.description || this.description === '<p><br></p>')) {
        this.isRequiredEmployeeNote = true
        return
      }
      if (type === 'processing' && (!this.emailContent || this.emailContent === '<p><br></p>')) {
        this.isRequiredEmailContent = true
        return
      }
      this.isRequiredEmployeeNote = false
      this.isRequiredEmailContent = false
      this.isCancel = status
      await apiSetting.resendCode({
        email: this.$store.state.beAuth.user.email,
        type: 'EMAIL',
        userType: 'EMPLOYEE'
      })
      this.setOpenPopup({
        popupName: 'popup-metamart-verify-email',
        isOpen: true
      })
    }

    async handleSubmitCode(verificationCode: string): Promise<void> {
      const type = this.$route.params.type
      if (type === 'pending') {
        await apiNft.updateProcessRequest({ usedNftId: this.detailRequest.id, nftDescription: this.description, verificationCode })
      } else {
        if (this.isCancel) {
          await apiNft.cancelRequest({
            usedNftId: this.detailRequest.id,
            verificationCode,
            emailContent: this.emailContent
          })
          this.isCancel = false
        } else {
          await apiNft.completeRequest({
            usedNftId: this.detailRequest.id,
            verificationCode,
            emailContent: this.emailContent
          })
        }
      }

      this.setOpenPopup({
        popupName: 'popup-request-nft-detail',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-metamart-verify-email',
        isOpen: false
      })
      const message = this.$t('notify_update-success') as string
      this.$message.success({ message, duration: 5000 })
      this.$emit('reload')
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-request-nft-detail {
    .popup-content {
      padding: 0;
      overflow: hidden;
      .content {
        &__left {
          max-height: 75vh;
          overflow-y: auto;
          visibility: hidden;

          .header {
            text-align: center;
            padding-top: 24px;
            padding-bottom: 16px;
            border-bottom: 8px solid #f6f8fc;
            img {
              width: 64px;
              height: 64px;
              object-fit: cover;
              margin-bottom: 12px;
              border-radius: 8px;
            }
          }
          .line {
            border-bottom: 8px solid #f6f8fc;
          }
          .wrap-editor {
            padding: 24px 24px 0;
          }
        }
        &__right {
          max-height: 75vh;
          overflow-y: auto;
          visibility: hidden;
          flex: 1;
          padding: 0 24px;
          padding-bottom: 24px;
          .employee,
          .reply {
            margin-top: 24px;
            max-width: 545px;
          }
          .line {
            border-bottom: 8px solid #f6f8fc;
            margin-top: 24px;
          }
        }

        .wrap {
          visibility: visible;
        }
        &__left:hover,
        &__right:hover {
          visibility: visible;
        }
      }
      .content--full {
        .content__left {
          width: 600px;
          border-right: 8px solid #f6f8fc;
          padding-bottom: 24px;
        }
      }
    }
    .footer {
      .btn-cancel {
        border-color: var(--bc-status-error);
        color: var(--bc-status-error);
        &:hover {
          background-color: transparent;
        }
      }
    }
  }
</style>
