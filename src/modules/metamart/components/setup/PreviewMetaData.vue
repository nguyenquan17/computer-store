<template>
  <div class="preview">
    <div class="mb-24 tab">
      <p class="text-hyperlink text-base text-semibold">{{ tabName }}</p>
    </div>
    <div class="content">
      <!-- type text -->
      <div class="type-text" v-if="tabActive === 'TEXT'">
        <p v-if="dataPreview.length" class="text-base break-work" v-html="$options.filters.formatMetaText(dataPreview[0].metaValue)" />
        <p v-else class="text-base text-disable">{{ $t('label_long-desc') }}</p>
      </div>

      <!-- type html -->
      <div class="type-html" v-if="tabActive === 'HTML'">
        <div v-html="dataPreview[0].metaValue"></div>
      </div>

      <!-- type map -->
      <div class="type-map" v-if="tabActive === 'MAP'">
        <div v-for="item in dataPreview" :key="item.id" class="be-flex align-center jc-space-between map-item">
          <div class="left">
            <div class="text-base text-overflow-1">{{ item.metaName }}</div>
            <div class="text-sm text-desc text-overflow-1" v-if="item.metaAnnotation">({{ item.metaAnnotation }})</div>
          </div>
          <div class="text-right right">
            <div class="text-base text-desc text-overflow-1">{{ item.metaValue }}</div>
          </div>
        </div>
      </div>

      <!-- type file -->
      <div class="type-file" v-if="tabActive === 'FILE'">
        <div v-for="file in dataPreview" :key="file.id" class="be-flex align-center file">
          <img :src="getIconFile(file)" class="d-iflex" />
          <div class="info">
            <p class="text-overflow-1 text-base text-semibold">{{ file.metaName }}</p>
            <div class="be-flex align-center">
              <span class="text-desc nft-body-small">{{ file.metaStatisValue | bytesToSize }}</span>
              <div class="circle"></div>
              <div class="be-flex align-center">
                <base-icon icon="icon-download-blue" size="24" class="d-iflex cursor" />
                <span class="text-hyperlink nft-body-small cursor" style="padding-left: 6px" @click="handleDownload(file.metaValue)">{{ $t('label_download') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- type boolean -->
      <div class="type-boolean" v-if="tabActive === 'BOOLEAN'">
        <div v-for="item in dataPreview" :key="item.id" class="be-flex align-center feature">
          <base-icon v-if="item.metaValue === 'true'" icon="icon-tick" size="20" class="d-iflex" />
          <base-icon v-else icon="icon-x-red" size="20" class="d-iflex" />
          <p class="text-base text-overflow-1" style="color: #28344b">{{ item.metaName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import filter from 'lodash/filter'
  import includes from 'lodash/includes'

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  @Component
  export default class PreviewMetaData extends Vue {
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number
    @Prop({ required: false, type: String, default: '' }) tabName!: string
    @Prop({ required: false, type: String, default: '' }) tabActive!: string
    @Prop({ required: false, type: Array, default: () => [] }) dataPreview!: Array<Record<string, any>>

    @bcNft.State('metaDatas') metaDatas!: Array<Record<string, any>>

    data: Array<Record<string, any>> | Record<string, any> = []

    // @Watch('idTabActive') watchTabActive(): void {
    //   this.data = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
    // }

    // created(): void {
    //   this.data = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
    // }

    getIconFile(file: Record<string, any>): string {
      const objType = {
        doc: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-doc.png',
        docx: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-doc.png',
        pdf: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-pdf.png',
        xls: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-excel.png',
        xlsx: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-excel.png',
        ppt: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-ppt.png',
        pptx: 'https://lynkey-production.s3.ap-southeast-1.amazonaws.com/blockchain/icon/icon-ppt.png'
      }
      return objType[file.metaAnnotation.toLowerCase()]
    }

    handleDownload(url: string): void {
      window.open(url, '_blank')
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.preview {
    width: 360px;
    padding: 24px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    margin-left: 24px;

    .tab {
      border-bottom: 1px solid #dbdbdb;
      p {
        padding: 0 12px 14px;
        position: relative;
        border-bottom: 2px solid #0151fc;
        // &::after {
        //   content: '';
        //   position: absolute;
        //   width: 100%;
        //   height: 2px;
        //   background: #0151fc;
        //   bottom: 0;
        //   left: 0;
        // }
      }
    }

    .type-html {
      strong {
        font-weight: bold;
      }
      em {
        font-style: italic;
      }
      ul,
      ol {
        padding-left: 20px;
        list-style: initial;
        li {
          list-style: unset;
        }
      }
    }

    .type-map {
      .map-item {
        margin-bottom: 16px;
        .left,
        .right {
          width: 50%;
        }
      }
    }

    .type-file {
      .file {
        margin-bottom: 32px;
        .info {
          margin-left: 16px;
          p {
            margin-bottom: 4px;
          }
          .circle {
            width: 4px;
            height: 4px;
            margin: 0 8px;
            border-radius: 50%;
            background: #dbdbdb;
          }
        }
      }
    }

    .type-boolean {
      .feature {
        margin-bottom: 24px;
        p {
          margin-left: 8px;
        }
      }
    }
  }
</style>
