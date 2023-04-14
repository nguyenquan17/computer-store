<template>
  <div class="tab-info">
    <div class="be-scroll-custom list-item">
      <div class="be-flex">
        <div v-for="tab in metaTypes" :key="tab.id" class="item" :class="idTabActive === tab.metaTypeId ? 'active' : null" @click="handleChangeTab(tab)">
          {{ getName(tab.metaTypeName) }}
        </div>
      </div>
    </div>

    <div class="content-about" v-if="tabActive === 'INFO'">
      <div class="content-about1">
        <div class="content-about1-title">{{ $t('label_contract-address') }}</div>
        <div class="text-hyperlink cursor" @click="handleOpenTab">{{ nftItem.contractAddress | formatTransactionCode }}</div>
      </div>
      <div class="content-about1">
        <div class="content-about1-title">{{ $t('label_token-id') }}</div>
        <div class="content-about1-code text-gray1">{{ nftItem.itemCode }}</div>
      </div>
      <div class="content-about1">
        <div class="content-about1-title">{{ $t('label_token-standard') }}</div>
        <div class="content-about1-code text-gray1">{{ nftItem.network }}</div>
      </div>
      <div class="content-about1">
        <div class="content-about1-title">{{ $t('label_blockchain') }}</div>
        <div class="content-about1-code text-gray1">{{ nftItem.networkName }}</div>
      </div>
    </div>

    <div class="content-about view-content-html type-html" v-if="tabActive === 'HTML'">
      <p id="text-description" class="content-header body-base text-regular" v-html="$options.filters.formatMetaHtml(data[0].metaValue)"></p>
    </div>

    <div class="content-about popup-tour-details type-map" v-if="tabActive === 'MAP'">
      <div v-for="item in data" :key="item.id" class="be-flex align-center jc-space-between map-item">
        <div class="left">
          <div class="text-base text-overflow-1">{{ item.metaName }}</div>
          <div class="text-sm text-desc text-overflow-1" v-if="item.metaAnnotation">({{ item.metaAnnotation }})</div>
        </div>
        <div class="text-right right">
          <div class="text-base text-desc text-overflow-1">{{ item.metaValue }}</div>
        </div>
      </div>
    </div>

    <div class="content-about popup-tour-details" v-if="tabActive === 'TEXT'">
      <p id="text-description" class="content-header body-base text-regular" v-html="textTour">description</p>
    </div>

    <div class="content-about type-file" v-if="tabActive === 'FILE'">
      <div v-for="file in data" :key="file.id" class="be-flex align-center file">
        <img :src="file.metaIcon" class="d-iflex" />
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
    <div class="content-about type-boolean" v-if="tabActive === 'BOOLEAN'">
      <div v-for="item in data" :key="item.id" class="be-flex align-center feature">
        <base-icon v-if="item.metaValue === 'true'" icon="icon-tick" size="20" class="d-iflex" />
        <base-icon v-else icon="icon-x-red" size="20" class="d-iflex" />
        <p class="text-base text-overflow-1" style="color: #28344b">{{ item.metaName }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import filter from 'lodash/filter'
  import { Component, Prop, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  import { namespace } from 'vuex-class'

  const beBase = namespace('beBase')

  @Component({ components: {} })
  export default class TabInfo extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) nftItem!: Record<string, any>

    @Prop({ required: false, type: Array, default: () => [] }) metaDatas!: Array<Record<string, any>>
    @Prop({ required: false, type: Array, default: () => [] }) metaTypes!: Array<Record<string, any>>

    tabActive = 'INFO'
    idTabActive = 0
    tabDisplayActive = 'FIXED'
    data: Array<Record<string, any>> = []

    // typeName(metaTypesName: string): string {
    //   const language = window.localStorage.getItem('bc-lang')!
    //   return JSON.parse(metaTypesName)[language].replace(/\\n/g, '<br>')
    // }

    created(): void {
      this.idTabActive = this.metaTypes[0].metaTypeId
      this.tabActive = this.metaTypes[0].typeTab
    }

    get totalCirculating(): number {
      return this.nftItem.circulatingSupply ? (this.nftItem.totalSupply / this.nftItem.circulatingSupply) * 100 : 0
    }

    get textTour(): string {
      const language = window.localStorage.getItem('bc-lang')!
      if (this.data.length) {
        const objDesc = JSON.parse(this.data[0].metaValue)
        return objDesc[language].replace(/\\n/g, '<br>')
      }
      return ''

      // const tour = filter(this.metaDatas, elm => elm.metaTypes === 'TOUR_SCHEDULE')
      // if (tour.length) {
      //   const objDesc = JSON.parse(tour[0].metaDescription)
      //   return objDesc[language].replace(/\\n/g, '<br>')
      // }
      // return ''
    }

    getName(metaTypeName: string): string {
      const language = localStorage.getItem('bc-lang') || ''
      const parseJson = JSON.parse(metaTypeName)
      return parseJson[language]
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.tabActive = tab.typeTab
      this.idTabActive = tab.metaTypeId
      this.data = filter(this.metaDatas, data => data.metaTypeId === tab.metaTypeId)
    }

    handleOpenTab(): void {
      const currency = this.nftItem.currency
      const path = currency === 'BNB' || currency === 'BUSD' ? process.env.VUE_APP_URL_SCAN_ADDRESS_BNB : process.env.VUE_APP_URL_SCAN_ADDRESS_ETH
      window.open(`${path}${this.nftItem.contractAddress}`, '_blank')
    }

    handleTourDetail(): void {
      this.$emit('changeTab', this.data)
    }

    handleDownload(url: string): void {
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.tab-info {
    .list-item {
      list-style: none;
      display: flex;
      border-bottom: 1px solid #dbdbdb;
      margin-top: 16px;
      overflow: auto;
      padding-left: 8px;
      &:hover {
        ::-webkit-scrollbar {
          height: 4px;
        }
      }

      &::-webkit-scrollbar-thumb {
        background: rgb(22 22 26 / 27%);
      }
      &::-webkit-scrollbar {
        height: 4px;
      }

      .item {
        padding: 15px 12px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;
        cursor: pointer;
        position: relative;
        width: max-content;
        &:hover {
          color: #0151fc;
          //   -webkit-background-clip: text;
          //   -webkit-text-fill-color: none;
        }
      }
      .item.active {
        // border-image-source: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
        // border-bottom: 1px solid;
        // border-image-slice: 1;
        // border-width: 2px;
        // background: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        background: var(--bc-menu-active);
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
        color: #0151fc;
        font-weight: 600;
        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background: var(--bc-tab-active);
        }
      }
    }
    .content-about {
      display: block;
      padding: 20px;
      padding-top: 0px;
      &::-webkit-scrollbar {
        width: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #dbdbdb;
      }
      &::-webkit-scrollbar-track {
        max-height: 30px;
        height: 8px;
      }
    }
    .content-attachment {
      img {
        width: 36.2px;
        height: 48px;
      }
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      .info {
        .icon-download {
          margin-right: 2px;
        }
        .header-6 {
          width: 160px;
          padding-bottom: 4px;
        }
        padding-top: 5px;
        margin-left: 16px;
        .data {
          color: #5b616e;
        }
      }
      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #c4c4c4;
        margin: 0 8px;
      }
      .download {
        cursor: pointer;
        span {
          color: var(--bc-text-hyperlink);
        }
      }
    }
    .content-about {
      // height: 205px;
      // overflow-y: auto;
      // border-bottom: 1px solid #dbdbdb;
      // padding-right: 10px;
      .content-title {
        padding-top: 20px;
      }
      .content-about12 {
        .content-about1-title1 {
          display: flex;
          flex-direction: column;
          &-sup {
            color: #89909e;
          }
        }
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        margin-bottom: 16px;
        &-code {
          color: var(--bc-text-discript);
        }
      }
      .is-border-bottom {
        border-bottom: 3px solid #0151fc;
      }
      .content-about1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        margin-bottom: 16px;

        &:first-child {
          margin-top: 20px;
        }
        &:last-child {
          margin-bottom: 0;
        }
        &-title {
          &-sup {
            color: #89909e;
          }
        }
        &-code {
          color: var(--bc-text-discript);
          .price-range {
          }
        }
      }
      .is-border-bottom {
        border-bottom: 3px solid #0151fc;
      }
    }
    .wrap-map {
      .sack-map {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        margin-bottom: 16px;

        &:first-child {
          margin-top: 20px;
        }
        &:last-child {
          padding-bottom: 29px;
          margin-bottom: 0;
        }
        .sack-map-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;

          .sack-map-code {
            color: var(--bc-text-discript);
          }
        }
        .sack-map-desc {
          color: var(--bc-text-disabled);
        }
      }
    }
    .border-content {
      border-bottom: 1px solid #dbdbdb;
      margin-top: 20px;
      margin-bottom: 24px;
      .tour-details {
        margin-top: 5px;
        margin-bottom: 24px;
        color: #0151fc;
      }
    }
    .popup-tour-details {
      h1 {
        font-size: 30px;
        font-weight: 700;
        line-height: 50px;
      }
    }

    .type-file {
      margin-top: 20px;
      .file {
        margin-bottom: 24px;
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

    .type-map {
      margin-top: 20px;
      .map-item {
        margin-bottom: 16px;
        .left,
        .right {
          width: 50%;
        }
      }
    }
    .type-html,
    .type-boolean {
      margin-top: 20px;
    }
  }
</style>
