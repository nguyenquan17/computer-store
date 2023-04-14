<template>
  <div class="form-info">
    <el-form>
      <el-form-item :label="$t('label_collection')" class="is-required hide-suffix">
        <el-select
          v-model="form.collectionId"
          filterable
          remote
          reserve-keyword
          :remote-method="handleFindCollection"
          class="w-100"
          :placeholder="$t('label_collection')"
          @change="handleSelectCollection"
        >
          <el-option v-for="item in listCollection" :key="item.id" :label="item.collectionName" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('label_category')" class="is-required">
        <el-select v-model="form.categoryId" class="w-100" popper-class="popper-explore-select-category" clearable :placeholder="$t('label_category')">
          <el-option
            v-for="item in listCategory"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
            :class="!item.levelDepth ? 'item-parent' : item.levelDepth > 1 ? 'item-child-last' : 'item-child'"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('label_product-code')" class="is-required">
        <el-input v-model="form.productCode" :placeholder="$t('label_product-code')" />
      </el-form-item>

      <el-form-item :label="$t('label_nft-name')" class="is-required">
        <el-input v-model="form.itemName" :placeholder="$t('label_nft-name')" />
      </el-form-item>

      <!-- thumbnail -->
      <el-form-item :label="$t('label_thumbnail')" class="is-required">
        <div class="text-disable text-xs">PNG, JPG, JPEG, GIF</div>

        <el-upload
          v-show="!form.thumb"
          class="upload-demo upload-thumbnail"
          drag
          action=""
          :show-file-list="true"
          :auto-upload="false"
          list-type="picture"
          accept=".jpg, .jpeg, .png, .gif"
          :on-change="handleChangeThumbnail"
        >
          <div class="el-upload__text text-base">
            {{ $t('label_upload-desc') }} <span class="text-hyperlink">{{ $t('label_click-to-upload') }}</span>
          </div>
        </el-upload>
        <div v-if="form.thumb" class="list-thumbnail">
          <div class="wrap-img">
            <img :src="form.thumb" alt="" />
            <span class="cursor icon-x" @click="form.thumb = ''">
              <base-icon icon="icon-delete-circle" size="20" />
            </span>
          </div>
          <!-- <div class="add-thumbnail"><base-icon icon="icon-plus-square" size="40" /></div> -->
        </div>
      </el-form-item>

      <!-- list file -->
      <el-form-item :label="$t('label_upload-file')" class="is-required">
        <div class="text-disable text-xs">PNG, JPG, JPEG, GIF, MP4</div>

        <el-upload
          v-show="!form.medias.length"
          class="upload-demo upload-thumbnail"
          drag
          action=""
          :show-file-list="true"
          :auto-upload="false"
          :file-list="form.medias"
          list-type="picture"
          accept=".jpg, .jpeg, .png, .gif,.mp4"
          :on-change="handleChangeListFile"
        >
          <div class="el-upload__text text-base">
            {{ $t('label_upload-desc') }} <span class="text-hyperlink">{{ $t('label_click-to-upload') }}</span>
          </div>
        </el-upload>
        <div v-if="form.medias.length" class="list-thumbnail">
          <div v-for="file in form.medias" :key="file.id" class="wrap-img">
            <img v-if="file.mediaType === 'IMAGE'" :src="file.mediaUrl" alt="" />
            <video v-else :src="file.mediaUrl" />
            <span class="cursor icon-x" @click="removeFile(file.id)">
              <base-icon icon="icon-delete-circle" size="20" />
            </span>
            <el-progress v-if="file.percentage < 100" type="circle" :percentage="file.percentage" class="progress-file" status="success"></el-progress>
          </div>
          <el-upload
            class="avatar-uploader"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            list-type="picture"
            accept=".jpg, .jpeg, .png, .gif,.mp4"
            :on-change="handleAddMoreFile"
          >
            <div class="add-thumbnail"><base-icon icon="icon-plus-square" size="40" /></div>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item :label="$t('label_short-desc')" class="is-required">
        <el-input type="textarea" :rows="3" :placeholder="$t('label_short-desc')" v-model="form.shortDescription" maxlength="200" show-word-limit> </el-input>
      </el-form-item>

      <div class="mb-24 wrap-editor">
        <div class="text-base text-semibold label">{{ $t('label_long-desc') }}</div>
        <jodit-editor :config="config" v-model="form.description" />
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import filter from 'lodash/filter'
  import debounce from 'lodash/debounce'
  import findIndex from 'lodash/findIndex'

  import { JoditEditor } from 'jodit-vue'
  import 'jodit/build/jodit.min.css'
  import Cookies from 'js-cookie'

  import getRepository from '@/services'
  import { ITabInfo } from '../../interface'
  import UploadRepository from '@/services/repositories/upload'
  import { includes } from 'lodash'
  const apiUpload: UploadRepository = getRepository('upload')
  import { API_URL } from '@/configs'
  const bcNft = namespace('bcNft')
  const bcAuth = namespace('beAuth')

  const USERID = Cookies.get('user_id')
  @Component({ components: { JoditEditor } })
  export default class FormInfo extends Vue {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: 'add' | 'edit'

    @bcNft.Mutation('SET_INIT_NFT') setInitInfo!: (data: Record<string, any>) => void
    @bcNft.State('listCollection') listCollection!: Array<Record<string, any>>
    @bcNft.State('listCategory') listCategory!: Array<Record<string, any>>
    @bcNft.State('initInfo') form!: ITabInfo

    @bcAuth.State('user') user!: Record<string, any>

    config = {
      spellcheck: false,
      showCharsCounter: false,
      showWordsCounter: false,
      autofocus: false,
      showXPathInStatusbar: false,
      language: 'en',
      minHeight: 180,
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
          formdata.append('type', 'DESCRIPTION_NFT');
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

    shortDescription = ''
    description = ''

    // @Watch('description') watchContent(_new: string): void {
    //   this.debounceInputHtml(_new, this)
    // }

    async created(): Promise<void> {
      // this.$root.$refs.FormInfo = this
      // const language = localStorage.getItem('bc-lang') || ''
      // if (this.typePopup === 'edit') {
      //   this.config.language = language
      //   const parseJsonShortDescription = JSON.parse(this.form.shortDescription)
      //   const parseJsonDescription = JSON.parse(this.form.description)
      //   this.shortDescription = parseJsonShortDescription[language]
      //   this.description = parseJsonDescription[language]
      // } else {
      //   this.shortDescription = this.form.shortDescription
      //   this.description = this.form.description
      // }
    }

    debounceInputHtml = debounce((text: string, _this: any) => {
      const language = localStorage.getItem('bc-lang') || ''

      if (_this.typePopup === 'edit') {
        let parseJson: Record<string, any> = JSON.parse(_this.form.description)

        parseJson = {
          ...parseJson,
          [language]: _this.description
        }
        _this.form.description = JSON.stringify(parseJson)
      } else {
        _this.form.description = text
      }
    }, 500)

    // handleInput(text: string): void {
    //   this.debounceInput(text, this)
    // }

    debounceInput = debounce((text: string, _this: any) => {
      const language = localStorage.getItem('bc-lang') || ''

      if (_this.typePopup === 'edit') {
        let parseJson: Record<string, any> = JSON.parse(_this.form.shortDescription)

        parseJson = {
          ...parseJson,
          [language]: _this.shortDescription
        }
        _this.form.shortDescription = JSON.stringify(parseJson)
      } else {
        _this.form.shortDescription = text
      }
    }, 500)

    getFileType(file: Record<string, any>): string {
      const IMAGE = ['png', 'jpg', 'jpeg', 'gif']
      const lastDot = file.name.lastIndexOf('.')
      const fileType = file.name.substring(lastDot + 1).toLowerCase()
      return includes(IMAGE, fileType) ? 'IMAGE' : 'VIDEO'
    }

    async handleChangeThumbnail(file: Record<string, any>): Promise<void> {
      if (!this.$options.filters?.validateFormatFile(file, 'THUMB_NFT')) {
        const message = this.$t('notify_invalid-file-type') as string
        this.$message.error(message)
        return
      }

      this.form.thumb = file.url
      const formData = new FormData()
      formData.append('files', file.raw)
      formData.append('type', 'THUMB_NFT')
      formData.append('userId', this.user.userId)
      const result = await apiUpload.uploadImage(formData)
      console.log(result)
      if (result.success.length) {
        this.form.thumb = result.success[0].url
      } else {
        const message = this.$t('notify_upload-fail') as string
        this.$message.error(message)
      }
    }

    async handleChangeListFile(rawFile: Record<string, any>): Promise<void> {
      try {
        if (!this.$options.filters?.validateFormatFile(rawFile, 'MEDIA_NFT')) {
          const message = this.$t('notify_invalid-file-type') as string
          this.$message.error(message)
          return
        }

        rawFile.percentage = 1

        const processFunction = function (progressEvent) {
          let progress = (progressEvent.loaded / progressEvent.total) * 100
          rawFile.percentage = progress
        }

        rawFile = {
          ...rawFile,
          mediaUrl: rawFile.url,
          id: rawFile.uid,
          mediaType: this.getFileType(rawFile)
        }

        this.form.medias = [...this.form.medias, rawFile]
        const data: Record<string, any> = {}
        const formData = new FormData()
        formData.append('files', rawFile.raw)
        formData.append('type', 'MEDIA_NFT')
        formData.append('userId', this.user.userId)

        data.data = formData
        data.progress = processFunction
        const result = await apiUpload.uploadFileCreateNft(data)
        console.log(result)

        if (result.success.length) {
          const indexFile = findIndex(this.form.medias, elm => elm.id === rawFile.uid)
          this.form.medias[indexFile].mediaUrl = result.success[0].url
          // this.form.medias[this.form.medias.length - 1].mediaUrl = result.success[0].url
        } else {
          this.form.medias = filter(this.form.medias, elm => elm.id !== rawFile.uid)
          const message = this.$t('notify_upload-fail') as string
          this.$message.error(message)
        }
      } catch (error) {
        this.form.medias = filter(this.form.medias, elm => elm.id !== rawFile.uid)
        const message = this.$t('notify_upload-fail') as string
        this.$message.error(message)
      }
    }

    handleAddMoreFile(file: Record<string, any>): void {
      this.handleChangeListFile(file)
    }

    removeFile(id: number): void {
      this.form.medias = filter(this.form.medias, file => file.id !== id)
    }

    handleSelectCollection(collectionId: number): void {
      this.form.categoryId = null
      const collection = filter(this.listCollection, elm => elm.id === collectionId)[0]
      this.$emit('selectCollection', collection)
    }

    handleFindCollection(text: string): void {
      this.$emit('findCollection', text)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.form-info {
    flex: 1;
    margin-right: 24px;
    .upload-thumbnail {
      margin-top: 8px;
      .el-upload {
        &-dragger {
          height: 148px;
          .el-upload__text {
            font-size: 16px;
          }
        }
        &-list {
          display: none;
        }
      }
    }
    .list-thumbnail {
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;

      .wrap-img {
        margin-right: 12px;
        position: relative;
        margin-bottom: 12px;
        &:hover {
          .icon-x {
            display: inline-flex;
          }
        }
        img,
        video {
          width: 72px;
          height: 72px;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        }
        .icon-x {
          position: absolute;
          top: -10px;
          right: -10px;
          display: none;
          .span-icon {
            display: inline-flex;
          }
        }

        .progress-file {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .el-progress-circle {
            height: 60px !important;
            width: 60px !important;
          }
        }
      }

      .add-thumbnail {
        width: 72px;
        height: 72px;
        border-radius: 8px;
        border: 1px dashed #dbdbdb;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .el-form {
      &-item {
        &__label {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
        }
      }
      .hide-suffix {
        .el-input__suffix {
          display: none;
        }
      }
    }

    .wrap-editor {
      max-width: 643px;
      .label {
        margin-bottom: 8px;
        position: relative;
        &::after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
          font-size: 10px;
          position: absolute;
        }
      }
      .jodit-container {
        min-height: 180px !important;
        .jodit-toolbar-editor-collection.jodit-toolbar-editor-collection_mode_horizontal.jodit-toolbar-editor-collection_size_middle {
          background-color: #dadada;
        }
        .jodit-toolbar__box {
          background: transparent;
        }
      }
    }
  }
</style>
