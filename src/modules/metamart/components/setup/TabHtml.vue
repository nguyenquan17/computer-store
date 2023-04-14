<template>
  <div class="tab-html">
    <jodit-editor :config="config" v-model="content" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
  import { JoditEditor } from 'jodit-vue'
  import 'jodit/build/jodit.min.css'

  import filter from 'lodash/filter'
  import debounce from 'lodash/debounce'
  import findIndex from 'lodash/findIndex'

  import { namespace } from 'vuex-class'
  import {API_URL} from "@/configs";
  const bcNft = namespace('bcNft')
  const USERID = Cookies.get('user_id')
  import Cookies from 'js-cookie'
  @Component({ components: { JoditEditor } })
  export default class TabHtml extends Vue {
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number

    @bcNft.State('metaDatas') metaDatas!: Array<Record<string, any>>

    content = '<p><br></p>'

    config = {
      spellcheck: false,
      showCharsCounter: false,
      showWordsCounter: false,
      autofocus: false,
      showXPathInStatusbar: false,
      language: 'en',
      minHeight: 300,
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
          formdata.append('type', 'METADATA_NFT');
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

    @Watch('content') watchContent(_new: string): void {
      this.debounceInput(_new, this)
    }
    @Watch('idTabActive') watchIdTabActive(_new: number): void {
      const content = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)[0].metaValue
      this.content = content
    }

    created(): void {
      const language = localStorage.getItem('bc-lang') || ''
      this.config.language = language
      const content = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)[0].metaValue
      this.content = content
    }

    debounceInput = debounce((text: string, _this: any) => {
      // const language = localStorage.getItem('bc-lang') || ''

      let data = filter(_this.metaDatas, elm => elm.metaTypeId === _this.idTabActive)[0]
      // let parseJson: Record<string, any> = JSON.parse(data.metaValue)

      // parseJson = {
      //   ...parseJson,
      //   [language]: _this.content
      // }

      data = {
        ...data,
        metaValue: text
      }

      const index = findIndex(_this.metaDatas, (elm: Record<string, any>) => elm.metaTypeId === _this.idTabActive)

      _this.metaDatas[index] = data

      _this.$emit('update')
    }, 500)
  }
</script>

<style scoped lang="scss">
  ::v-deep.tab-html {
    .jodit-toolbar-editor-collection.jodit-toolbar-editor-collection_mode_horizontal.jodit-toolbar-editor-collection_size_middle {
      flex: 1;
    }
    width: 667px;
    .jodit-container {
      .jodit-toolbar-editor-collection.jodit-toolbar-editor-collection_mode_horizontal.jodit-toolbar-editor-collection_size_middle {
        background-color: #dadada;
      }
      min-height: 180px !important;
      .jodit-toolbar__box {
        background: transparent;
      }
    }
  }
</style>
