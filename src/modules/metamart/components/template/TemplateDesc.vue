<template>
  <div class="template-desc">
    <div class="block">
      <div class="block-row">
        <p class="block-row__title">{{ $t('metamart.template.title') }} <span style="color: #cf202f">*</span></p>
        <el-input v-model="title" @input="changeTitle" :placeholder="$t('metamart.template.placeholder.enter-title')" class="block-row__input" :disabled="disabled"></el-input>
      </div>
      <div class="block-row">
        <p class="block-row__title">{{ $t('metamart.template.description') }}</p>
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="$t('metamart.template.placeholder.description')"
          v-model="textarea"
          class="block-row__input"
          :disabled="disabled"
          maxlength="200"
          show-word-limit
        >
        </el-input>
      </div>
    </div>
    <div class="block">
      <div class="block-header">
        <span class="block-header__title">{{ title }}</span>
      </div>
      <div class="block-content">
        <p class="block-content__detail">{{ textarea }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  @Component
  export default class TemplateDesc extends Vue {
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @Prop({ required: true, type: Number }) collection!: number
    @bcNft.Getter('templateDatas') templateDatas!: Array<Record<string, any>>
    @bcNft.Getter('getTabs') tabs!: Array<Record<string, any>>
    @bcNft.Mutation('CHANGE_TYPE_NAME') changeTypeName!: (payload: { type: string; value: string }) => void
    @bcNft.Mutation('CHANGE_META_DATA') changeMetaData!: (Payload: Record<string, any>) => void
    @bcNft.Mutation('BUILD_BODY') buildBody!: () => void
    @bcNft.Mutation('CHANGE_DATAS') changeDatas!: (payload: Record<string, any>) => void
    idOfDatas = 0
    title = 'Description'
    textarea = ''
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
          metaType: 'DESCRIPTION',
          metaTypeAvatar: null,
          metaTypeId: null,
          metaTypePosition: null,
          metaValue: '',
          metaValueType: 'TEXT'
        }
        //@ts-ignore
        const metaData = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'DESCRIPTION'
        }, this)
        this.idOfDatas = metaData ? metaData.id : NaN
        format.id = this.idOfDatas
        format.metaName = to
        format.metaValue = this.textarea
        this.changeDatas({
          action: 'EDIT',
          data: format
        })
      }
      this.buildBody()
    }
    @Watch('textarea') watchDescription(to: string, from: string): void {
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
          metaType: 'DESCRIPTION',
          metaTypeAvatar: null,
          metaTypeId: null,
          metaTypePosition: null,
          metaValue: '',
          metaValueType: 'TEXT'
        }
        //@ts-ignore
        const metaData = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'DESCRIPTION'
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
        return tab.metaType === 'DESCRIPTION'
      })
      this.title = active ? active.metaTypeName : ''
    }
    get disabled(): boolean {
      return !(this.$route.query.status === 'NEW' || this.$route.query.status === 'DUPLICATE' || (this.$route.query.status === 'EDIT' && this.collection < 1))
    }
    created(): void {
      if (this.$route.query.status !== 'NEW') {
        this.textarea = this.data[0].metaValue
      }
    }
    emitChange(): Record<string, any> {
      const metaData = {
        metaType: 'DESCRIPTION',
        metaName: this.title,
        metaDatas: [
          {
            metaName: this.title,
            metaValueType: 'TEXT',
            metaIcon: null,
            metaValue: this.textarea,
            metaStaticValue: null,
            metaAnnotation: null,
            metaMinimum: null,
            metaMaximum: null,
            metaDescription: null
          }
        ]
      }
      return metaData
    }
    changeTitle(): void {
      this.changeTypeName({
        type: 'DESCRIPTION',
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
  ::v-deep.template-desc {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 24px;
    .block {
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      padding: 24px;
      &-row {
        width: 100%;
        height: auto;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        &__title {
          @include text(16px, 24px, 600, #0a0b0d);
          margin-bottom: 8px;
        }
        &__input {
          .el-input__inner {
            font-size: 16px;
            line-height: 24px;
            height: 48px;
          }
          .el-textarea__inner {
            height: 132px;
            &[disabled='disabled'] {
              background-color: rgba($color: #dbdbdb, $alpha: 0.5);
              color: #5b616e;
            }
          }
          &.is-disabled {
            .el-input__inner {
              color: #5b616e;
              background-color: rgba($color: #dbdbdb, $alpha: 0.5);
            }
          }
        }
      }
      &-header {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #dbdbdb;
        &__title {
          display: inline-block;
          padding: 16px 12px 14px;
          @include text(16px, 24px, 600, #0151fc);
          border-bottom: 2px solid currentColor;
        }
      }
      &-content {
        padding: 24px 0;
        &__detail {
          @include text(16px, 24px, 400, #0a0b0d);
          word-break: break-word;
        }
      }
    }
  }
</style>
