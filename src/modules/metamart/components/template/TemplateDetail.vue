<template>
  <div class="detail">
    <div class="detail-block">
      <div class="detail-block__row">
        <p class="detail-block__row--title">{{ $t('metamart.template.title') }} <span style="color: #cf202f">*</span></p>
        <el-input
          v-model="title"
          :placeholder="$t('metamart.template.placeholder.enter-title')"
          class="detail-block__row--input"
          :disabled="disabled"
          @input="changeTitle"
        ></el-input>
      </div>
      <div class="detail-block__row editor">
        <p class="detail-block__row--title">{{ $t('metamart.template.description') }}</p>
        <jodit-editor :config="config" :buttons="buttons" v-model="content" class="content-block__row--input" />
      </div>
    </div>
    <div class="detail-block">
      <div class="detail-block__header">
        <span class="detail-block__header--title">{{ title }}</span>
      </div>
      <div class="detail-block__content" v-html="content"></div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { JoditEditor } from 'jodit-vue'
  import 'jodit/build/jodit.min.css'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  @Component({ components: { JoditEditor } })
  export default class TemplateDetail extends Vue {
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @Prop({ required: true, type: Number }) collection!: number
    @bcNft.Getter('templateDatas') templateDatas!: Array<Record<string, any>>
    @bcNft.Getter('getTabs') tabs!: Array<Record<string, any>>
    @bcNft.Mutation('CHANGE_TYPE_NAME') changeTypeName!: (payload: { type: string; value: string }) => void
    @bcNft.Mutation('CHANGE_META_DATA') changeMetaData!: (Payload: Record<string, any>) => void
    @bcNft.Mutation('BUILD_BODY') buildBody!: () => void
    @bcNft.Mutation('CHANGE_DATAS') changeDatas!: (payload: Record<string, any>) => void
    idOfDatas = 0
    title = 'Detail'
    content = ''
    buttons = ['bold', 'italic', 'underline', 'ul', 'ol', 'link']
    config = {
      readonly: false,
      spellcheck: false,
      showCharsCounter: false,
      showWordsCounter: false,
      autofocus: true,
      showXPathInStatusbar: false,
      language: 'vi',
      minHeight: 300,
      i18n: {
        vi: {
          'Type something': 'Nhập mô tả...',
          'Search for': 'Nhập tìm kiếm',
          'Open in new tab': 'Mở tab mới',
          'No follow': 'Theo dõi liên kết',
          Insert: 'Thêm',
          Text: 'Tiêu đề',
          Upload: 'Tải lên',
          'Drop image': 'Kéo thả ảnh',
          'or click': 'hoặc chọn từ máy tính',
          'Alternative text': 'Văn bản thay thế'
        },
        en: {
          'Type something': 'Type something...',
          'Search for': 'Search for',
          'Open in new tab': 'Open in new tab',
          'No follow': 'Follow the link',
          Insert: 'Insert',
          Text: 'Title',
          Upload: 'Upload',
          'Drop image': 'Drag and drop',
          'or click': 'or Click to upload',
          'Alternative text': 'Alternative text'
        }
      }
    }
    @Watch('title') watchTitle(to: string, from: string): void {
      if (this.$route.query.status === 'NEW') {
        this.changeMetaData(this.emitChange())
      } else if (this.$route.query.status === 'EDIT' || this.$route.query.status === 'DUPLICATE') {
        const format = {
          id: 0,
          itemId: null,
          metaAnnotation: null,
          metaDescription: null,
          metaIcon: null,
          metaMaximum: null,
          metaMinimum: null,
          metaName: '',
          metaStaticValue: null,
          metaStatisValue: null,
          metaType: 'DETAIL',
          metaTypeAvatar: null,
          metaTypeId: null,
          metaTypePosition: null,
          metaValue: '',
          metaValueType: 'HTML'
        }
        //@ts-ignore
        const metaData = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'DETAIL'
        }, this)
        this.idOfDatas = metaData ? metaData.id : NaN
        format.id = this.idOfDatas
        format.metaName = to
        format.metaValue = this.content
        this.changeDatas({
          action: 'EDIT',
          data: format
        })
      }
      this.buildBody()
    }
    @Watch('content') watchContent(to: string, from: string): void {
      if (this.$route.query.status === 'NEW') {
        this.changeMetaData(this.emitChange())
      } else if (this.$route.query.status === 'EDIT' || this.$route.query.status === 'DUPLICATE') {
        const format = {
          id: 0,
          itemId: null,
          metaAnnotation: null,
          metaDescription: null,
          metaIcon: null,
          metaMaximum: null,
          metaMinimum: null,
          metaName: '',
          metaStaticValue: null,
          metaStatisValue: null,
          metaType: 'DETAIL',
          metaTypeAvatar: null,
          metaTypeId: null,
          metaTypePosition: null,
          metaValue: '',
          metaValueType: 'HTML'
        }
        //@ts-ignore
        const metaData = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'DETAIL'
        }, this)
        this.idOfDatas = metaData ? metaData.id : NaN
        format.id = this.idOfDatas
        format.metaName = this.title
        format.metaValue = to
        this.changeDatas({
          action: 'EDIT',
          data: format
        })
      }
      this.buildBody()
    }
    @Watch('tabs', { immediate: true, deep: true }) watchTabChange(): void {
      const active = this.tabs.find((tab: Record<string, any>): boolean => {
        return tab.metaType === 'DETAIL'
      })
      this.title = active ? active.metaTypeName : ''
    }
    get disabled(): boolean {
      this.config.readonly = !(this.$route.query.status === 'NEW' || this.$route.query.status === 'DUPLICATE' || (this.$route.query.status === 'EDIT' && this.collection < 1))
      return !(this.$route.query.status === 'NEW' || this.$route.query.status === 'DUPLICATE' || (this.$route.query.status === 'EDIT' && this.collection < 1))
    }
    created(): void {
      this.config.language = window.localStorage.getItem('bc-lang') + ''
      if (this.$route.query.status !== 'NEW') {
        this.content = this.data[0].metaValue
      }
    }
    emitChange(): Record<string, any> {
      return {
        metaType: 'DETAIL',
        metaName: this.title,
        metaDatas: [
          {
            metaName: this.title,
            metaValueType: 'HTML',
            metaIcon: null,
            metaValue: this.content,
            metaStaticValue: null,
            metaAnnotation: null,
            metaMinimum: null,
            metaMaximum: null,
            metaDescription: null
          }
        ]
      }
    }
    changeTitle(): void {
      this.changeTypeName({
        type: 'DETAIL',
        value: this.title
      })
    }
  }
</script>
<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    font-weight: $weight;
    line-height: $height;
    color: $color;
  }
  ::v-deep.detail {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 24px;
    &-block {
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      padding: 24px;
      &__row {
        width: 1005;
        height: auto;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        &--title {
          @include text(16px, 24px, 600, #0a0b0d);
          margin-bottom: 8px;
        }
        &--input {
          .el-input__inner {
            font-size: 16px;
            line-height: 24px;
            height: 48px;
          }
        }
        .el-input.is-disabled {
          .el-input__inner {
            color: #5b616e;
            background-color: rgba($color: #dbdbdb, $alpha: 0.5);
          }
        }
      }
      &__header {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #dbdbdb;
        margin-bottom: 24px;
        &--title {
          @include text(16px, 24px, 600, #0151fc);
          display: inline-block;
          padding: 16px 12px 14px;
          border-bottom: 2px solid currentColor;
        }
      }
      &__content {
        p {
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          color: #151718 !important;
        }
      }
    }
  }
</style>
