<template>
  <div class="ebrochure">
    <div class="ebrochure-block">
      <div class="ebrochure-block__row">
        <p class="ebrochure-block__row--title">{{ $t('metamart.template.title') }} <span style="color: #cf202f">*</span></p>
        <el-input
          v-model="title"
          :placeholder="$t('metamart.template.placeholder.enter-title')"
          class="ebrochure-block__row--input"
          :disabled="disabled"
          @input="changeTitle"
        ></el-input>
      </div>
      <div class="ebrochure-block__row">
        <base-table :data="eBrochures" :showPagination="false" class="e-brochures-table">
          <el-table-column label="#" type="index" align="center" width="40" />
          <el-table-column :label="$t('metamart.template.name')" width="283px">
            <template slot-scope="sc">
              <p class="e-brochures-table__name">{{ sc.row.metaName }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('metamart.template.type')">
            <template slot-scope="sc">
              <p class="e-brochures-table__type">{{ sc.row.metaAnnotation }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('metamart.template.size')" align="right">
            <template slot-scope="sc">
              <p class="e-brochures-table__size">{{ sc.row.metaStaticValue | convertSize }}</p>
            </template>
          </el-table-column>
        </base-table>
      </div>
    </div>
    <div class="ebrochure-block">
      <div class="ebrochure-block__header">
        <span class="ebrochure-block__header--title">{{ title }}</span>
      </div>
      <div class="ebrochure-block__content">
        <div class="item" v-for="(ebrochure, index) in eBrochures" :key="index">
          <img :src="ebrochure.metaIcon" class="item-left" />
          <!--           <base-icon icon="icon-pdf" v-if="ebrochure.metaAnnotation === 'PDF'" size="48" class="item-left" />
          <base-icon icon="icon-word" v-if="ebrochure.metaAnnotation === 'Docx'" size="48" class="item-left" /> -->
          <div class="item-right">
            <p class="item-right__top">{{ ebrochure.metaName }}</p>
            <p class="item-right__bottom">
              <span class="size">{{ ebrochure.metaStaticValue | convertSize }}</span>
              <span class="download cursor">
                <base-icon icon="icon-download-blue" size="24" />
                Download</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  @Component({
    filters: {
      convertSize(size: number): string {
        let i = -1
        let byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB']
        do {
          size /= 1024
          i++
        } while (size > 1024)
        return Math.max(size, 0.1).toFixed(1) + byteUnits[i]
      }
    }
  })
  export default class TemplateEbrochure extends Vue {
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @Prop({ required: true, type: Number }) collection!: number
    @bcNft.Getter('getTabs') tabs!: Array<Record<string, any>>
    @bcNft.Mutation('CHANGE_TYPE_NAME') changeTypeName!: (payload: { type: string; value: string }) => void
    @bcNft.Mutation('CHANGE_META_DATA') changeMetaData!: (Payload: Record<string, any>) => void
    @bcNft.Mutation('BUILD_BODY') buildBody!: () => void

    title = 'eBrochures'
    eBrochures: Array<Record<string, any>> = [
      {
        metaName: 'eBrochures PDF',
        metaAnnotation: 'PDF',
        metaStaticValue: 10485760,
        metaIcon: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-pdf.png'
      },
      {
        metaName: 'SoundCloud',
        metaAnnotation: 'XLSX',
        metaStaticValue: 1048576,
        metaIcon: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-excel.png'
      },
      {
        metaName: 'BBC Music',
        metaAnnotation: 'PDF',
        metaStaticValue: 20971520,
        metaIcon: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-pdf.png'
      },
      {
        metaName: 'Beatport',
        metaAnnotation: 'Docx',
        metaStaticValue: 10485760,
        metaIcon: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-doc.png'
      },
      {
        metaName: 'AllMusic',
        metaAnnotation: 'PPT',
        metaStaticValue: 1048576,
        metaIcon: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-ppt.png'
      }
    ]
    @Watch('title', { immediate: true }) watchTitle(): void {
      this.changeMetaData(this.emitChange())
      this.buildBody()
    }
    @Watch('tabs', { immediate: true, deep: true }) watchTabChange(): void {
      const active = this.tabs.find((tab: Record<string, any>): boolean => {
        return tab.metaType === 'EBROCHURES'
      })
      this.title = active ? active.metaTypeName : ''
    }
    get disabled(): boolean {
      return !(this.$route.query.status === 'NEW' || this.$route.query.status === 'DUPLICATE' || (this.$route.query.status === 'EDIT' && this.collection < 1))
    }
    emitChange(): Record<string, any> {
      const metaData: Record<string, any> = {
        metaType: 'EBROCHURES',
        metaName: this.title,
        metaDatas: []
      }
      metaData.metaDatas = this.eBrochures.map((item: Record<string, any>): Record<string, any> => {
        return {
          metaName: item.metaName,
          metaValueType: 'FILE',
          metaIcon: item.metaIcon,
          metaValue: null,
          metaStaticValue: item.metaStaticValue,
          metaAnnotation: item.metaAnnotation,
          metaMinimum: null,
          metaMaximum: null,
          metaDescription: null
        }
      })
      return metaData
    }
    changeTitle(): void {
      this.changeTypeName({
        type: 'EBROCHURES',
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
  ::v-deep.ebrochure {
    height: auto;
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 24px;
    &-block {
      border: 1px solid #dbdbdb;
      border-radius: 16px;
      padding: 24px;
      &__row {
        height: auto;
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
          &.is-disabled {
            .el-input__inner {
              background-color: rgba($color: #dbdbdb, $alpha: 0.5);
              color: #5b616e;
            }
          }
        }
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        .el-table__row {
          height: 64px;
        }
      }
      &__header {
        height: auto;
        border-bottom: 1px solid #dbdbdb;
        margin-bottom: 24px;
        &--title {
          display: inline-block;
          padding: 16px 12px 14px;
          @include text(16px, 24px, 600, #0151fc);
          border-bottom: 2px solid currentColor;
        }
      }
      &__content {
        .item {
          display: flex;
          justify-content: left;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 36px;
          }
          &-left {
            margin-right: 16px;
            width: 36px;
          }
          &-right {
            &__top {
              @include text(16px, 24px, 600, #0a0b0d);
            }
            &__bottom {
              display: inline-flex;
              justify-content: left;
              align-items: center;
              .size {
                @include text(14px, 24px, 400, #5b616e);
                display: inline-block;
                min-width: 60px;
                margin-right: 20px;
              }
              .download {
                display: inline-flex;
                justify-content: left;
                align-items: center;
                color: #0151fc;
              }
            }
          }
        }
      }
    }
  }
</style>
