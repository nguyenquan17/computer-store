<template>
  <base-popup name="popup-nft-detail" class="popup-nft-detail" width="1040px" :open="handleOpen" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.collection.popup.nft-detail') }}</span>
    </div>
    <div class="content">
      <div class="detail-nft-left">
        <img :src="mediaLink && mediaLink.mediaUrl" v-if="mediaLink && mediaLink.mediaType === 'IMAGE'" class="content-media-avatar" alt="" />
        <video v-else :src="mediaLink && mediaLink.mediaUrl" playsinline :autoplay="true" loop muted></video>
        <!-- <bc-media :isShow="isShow" :url="mediaLink.mediaUrl" :radius="16" class="content-media-avatar isPc" /> -->
        <div class="slide-scroll-detail isPc">
          <swiper v-if="mediaList.length" :options="swiperOption" class="row-nft" ref="swiperRef">
            <swiper-slide v-for="(item, index) in mediaList" :key="index" class="item">
              <div :class="ClickActive === item.id ? 'border-active-img' : null" @click="handleShowMedia(item)">
                <img :src="item.mediaUrl" v-if="item.mediaType == 'IMAGE'" class="img-slide" :alt="item.mediaUrl" />
                <div v-else class="img-slide video-slide">
                  <video ref="video" :src="item.mediaUrl"></video>
                  <img src="../../../../assets/images/icon-play.png" alt="" />
                </div>
              </div>
            </swiper-slide>
          </swiper>
          <div v-if="mediaList.length > 4" class="btn-crousel cursor prev" @click="handleClickArrow('prev')">
            <base-icon icon="icon-prev" size="32" class="d-iflex" />
            <!-- <base-icon v-else icon="icon-prev-clm" size="32" class="d-iflex" /> -->
          </div>
          <div v-if="mediaList.length > 4" class="btn-crousel cursor next" @click="handleClickArrow('next')">
            <base-icon icon="icon-next" size="32" class="d-iflex" />
            <!-- <base-icon v-else icon="icon-next-clm" size="32" class="d-iflex" /> -->
          </div>
        </div>
      </div>
      <div class="ml-auto detail-nft-right">
        <div class="wrap-fixed-top">
          <div class="detail-nft-folder text-overflow-2">
            {{ nftItem && nftItem.itemName }}
            <div v-if="checkPemission('NFT', ['all-action-nft'])">
              <span @click="handleEdit(rowData)">
                <base-icon icon="icon-edit" size="24" />
              </span>

              <el-popover trigger="click" placement="bottom-start" v-model="visible">
                <i class="el-icon-more" style="padding: 5px; margin-right: 14px; color: #5b616e" slot="reference"></i>
                <span class="text-overflow-2" @click="handleDelete(rowData)" style="cursor: pointer"> {{ $t('button.delete') }} </span>
              </el-popover>
            </div>
          </div>

          <div class="ck-text-description detail-nft-des view-content-html" v-if="textDescription">
            <div id="text-description" :class="showClass ? 'text-overflow-2' : null" style="line-height: 24px" v-html="textDescription"></div>
            <div v-if="numOfLine > 2" style="margin-top: 5px" :class="!showClass ? 'text-rotate' : null" @click="showClass = !showClass">
              <div>
                <span class="nft-body-base text-hyperlink cursor text-medium read-more">{{ showClass ? $t('read-more') : $t('hide-more') }}</span>
                <base-icon icon="icon-down" class="icon-rotate" style="padding-left: 4px" />
              </div>
            </div>
          </div>
          <!-- Code from here -->
          <div class="isPc">
            <div class="sack-owner-create">
              <div class="sack-create">
                <div class="sack-create-title text-desc">
                  {{ $t('label_creator') }}
                </div>
                <div class="sack-create-icon">
                  <div>
                    <!-- <bc-media v-if="nftItem && nftItem.creatorAvatar" :url="nftItem && nftItem.creatorAvatar" :radius="100" :size="12" /> -->
                    <img v-if="nftItem && nftItem.creatorAvatar" :src="nftItem.creatorAvatar" />

                    <base-icon v-else icon="default-avatar" size="48" style="display: inline-flex" />
                  </div>

                  <div class="text-overflow-1 text-hyperlink" @click="handleViewCreator(nftItem.creatorId)">
                    <span v-if="nftItem && nftItem.creatorName && nftItem.creatorName.length > 15">{{ nftItem && nftItem.creatorName | formatTransactionCode(5) }}</span>
                    <span v-else>{{ nftItem && nftItem.creatorName }}</span>
                  </div>
                  <div v-if="nftItem && nftItem.creatorIsVerified === 'YES'" class="verified">
                    <base-icon icon="icon-verified" size="16" class="d-iflex" />
                  </div>
                  <div v-if="nftItem && nftItem.creatorIsNew === 'YES'" class="new-circle"></div>
                </div>
              </div>
            </div>
          </div>

          <tab-info v-if="isShowTabInfo" :nftItem="nftItem" :metaDatas="metaData" :metaTypes="metaType" ref="tabInfo" />
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import NftDetail from './NftDetail.vue'
  import { SwiperOptions } from 'swiper'
  import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
  import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
  import TabInfo from './TabInfo.vue'
  SwiperClass.use([Pagination])
  Vue.use(getAwesomeSwiper(SwiperClass))
  const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
  import 'swiper/swiper-bundle.css'
  import { namespace } from 'vuex-class'
  import PopupDelete from './PopupDelete.vue'
  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')
  @Component({ components: { NftDetail, Swiper, SwiperSlide, TabInfo, PopupDelete } })
  export default class PopupNftDetail extends Mixins(PopupMixin) {
    // @Prop({ required: false, type: Object }) nftItem!: Record<string, any>
    @Prop({ required: true, type: Object, default: () => ({}) }) creator!: Record<string, any>
    @Prop({ required: true, type: Array, default: () => [] }) owners!: Array<Record<string, any>>
    @Prop({ required: true, type: Array, default: () => [] }) medias!: Array<Record<string, any>>
    @Prop({ required: true, type: Array, default: () => [] }) policies!: Array<Record<string, any>>
    @Prop() nftItem!: any
    @Prop() detailNft!: any
    @Prop() rowData!: any
    // @Prop() medias: any
    @Prop({ required: false, type: Array, default: () => [] }) metaData!: Array<Record<string, any>>
    @Prop({ required: false, type: Array, default: () => [] }) metaType!: Array<Record<string, any>>
    deleteData: Record<string, any> = {}
    @bcNft.Mutation('SET_DETAIL_NFT') setDetailNft!: (PopupNftDetail: Record<string, any>) => void
    textDescription = ''
    ClickActive = 0
    showClass = false
    typePopupCreateNft = 'edit'
    numOfLine = 0
    isShowTabInfo = false
    visible = false

    get mediaList(): Array<Record<string, any>> {
      if (this.nftItem) {
        return [{ id: Math.random(), mediaType: this.nftItem.mediaType, mediaUrl: this.nftItem.avatar }, ...this.medias]
      }
      return []
    }
    mediaLink = {}
    get isShow(): boolean {
      return false
    }
    swiperOption: SwiperOptions = {
      slidesPerView: 4,
      spaceBetween: 12,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    }

    handleOpen(): void {
      console.log('handleOpen')

      this.isShowTabInfo = true
    }

    handleClose(): void {
      this.numOfLine = 0
      this.showClass = false
      this.isShowTabInfo = false
    }

    handleShowMedia(item: Record<string, any>): void {
      this.ClickActive = item.id
      this.mediaLink = { ...item }
    }
    checkLengthText(text: string): void {
      let el = document.getElementById(`${text}`) as HTMLElement
      let divHeight = el.offsetHeight
      let lineHeight = parseInt(el.style.lineHeight)
      let lines = divHeight / lineHeight
      if (lines > 3) {
        this.showClass = true
        this.numOfLine = lines
      }
    }
    handleEdit(row: Record<string, any>): void {
      this.$emit('edit', row)
      setTimeout(() => {
        this.setOpenPopup({
          popupName: 'popup-nft-detail',
          isOpen: false
        })
      }, 200)
    }
    handleDelete(row: Record<string, any>): void {
      this.visible = false
      this.$emit('delete', row)
      setTimeout(() => {
        this.setOpenPopup({
          popupName: 'popup-nft-detail',
          isOpen: false
        })
      }, 200)
    }
    reload(): void {
      this.$emit('reload')
    }
    handleClickArrow(type: string): void {
      if (type === 'next') {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slideNext()
      } else {
        //@ts-ignore
        this.$refs['swiperRef']?.$swiper.slidePrev()
      }
    }
    @Watch('medias', { deep: true, immediate: true }) handleWatchMedias(item: Record<string, any>): void {
      this.mediaLink = this.mediaList[0]
      this.ClickActive = this.mediaList[0]?.id
    }
    @Watch('nftItem', { deep: true, immediate: true }) handleWatchItemNft(item: Record<string, any>): void {
      if (item?.description) {
        const language = window.localStorage.getItem('bc-lang')!
        if (item.description) {
          const objDesc = JSON.parse(this.nftItem.description)
          this.textDescription = objDesc[language]
          this.$nextTick(() => {
            this.checkLengthText('text-description')
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-nft-detail {
    display: flex;
    justify-content: space-between;
    min-width: 800px;
    @media (max-height: 720px) {
      transform: scale(0.8);
      top: -28px;
      bottom: -36px;
      height: unset;
    }
    .popup-content {
      padding: 20px;
      min-height: 620px;
    }
  }
  ::v-deep.base-popup .el-dialog__footer {
    display: none;
  }

  .content {
    display: flex;
    border-radius: 0px 0px 8px 8px;
  }
  ::v-deep.base-popup .el-dialog__body {
    background: #f6f8fc;
  }
  ::v-deep.detail-nft-left {
    width: 471px;
    height: auto;
    overflow: hidden;
    video {
      height: auto;
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
      width: auto;
      border-radius: 8px !important;
    }
    .swiper-slide {
      width: 97px !important;
    }
    img {
      // width: 630px;
      // height: 630px;
      width: 471px;
      height: 471px;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      border-radius: 8px !important;
      @media (max-width: 767px) {
        border-radius: unset !important;
      }
    }
    .img-slide {
      width: 85px;
      height: 85px;
      margin: 4px;
      overflow: hidden;
    }
    .video-slide {
      position: relative;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
      }
    }
    .wrap-media {
      .empty {
        width: 471px;
        height: 471px;
      }
    }

    .el-dropdown-menu__item {
      p {
        font-size: 16px !important;
      }
    }
    .el-dropdown-menu__item--divided {
      padding: 0 15px;
    }
  }
  .dropdown-dot-nft {
    .text-drop-nft {
      color: #000;
      font-weight: 400;
    }
    .line-drop {
      text-align: center;
    }
  }
  .one-collection-fire {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f2f1;
  }
  ::v-deep.detail-nft-right {
    height: fit-content;
    max-width: 508px;
    width: 100%;
    position: relative;
    background: #fff;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    .wrap-fixed-top {
      overflow: auto;
      // border-bottom: 1px solid #dbdbdb;
      &::-webkit-scrollbar-thumb {
        background: rgb(22 22 26 / 27%);
      }

      @media screen and (max-width: 375px) {
        height: auto;
        overflow: hidden;
      }
    }
    .detail-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-address {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: var(--bc-theme-dark);
      }
    }
    .detail-nft-folder {
      font-weight: 600;
      font-size: 24px;
      line-height: 32px;
      padding: 20px 0 0 20px;
      display: flex;
      justify-content: space-between;
      :hover {
        cursor: pointer;
      }
    }
    .detail-nft-des {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      margin-top: 16px;
      margin-bottom: 24px;
      padding: 0px 20px;

      .btn-change {
        color: #115bfc;
        cursor: pointer;
      }
    }

    .sack-owner-create {
      display: flex;
    }
    .sack-owner-title,
    .sack-create-title {
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      margin-bottom: 12px;
    }
    .sack-owner,
    .sack-create {
      width: 50%;
      padding-left: 20px;
    }
    .sack-owner-icon,
    .sack-create-icon {
      cursor: pointer;
      display: flex;
      align-items: center;
      position: relative;
      span {
        margin-left: 12px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
      }
      img {
        width: 48px;
        height: 48px;
        border-radius: 100%;
        object-fit: cover;
      }
      .wrap-media {
        width: 48px;
        height: 48px;
        .span-icon {
          margin-left: 0;
        }
      }
      .verified {
        position: absolute;
        height: 14px;
        bottom: 0;
        left: 32px;

        span {
          margin-left: 0;
        }
      }
      .new-circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #129961;
        border: 1px solid #ffffff;
        position: absolute;
        left: 36px;
        top: 2px;
      }
      .span-icon {
        margin-left: 0;
      }
      .block-name {
        margin-left: 12px;
      }
    }

    .content-about {
      display: block;

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
      padding-right: 10px;
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
          padding-bottom: 29px;
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
    .detail-nft-bottom {
      display: flex;
      &-left {
        width: 50%;
      }
      &-right {
        width: 50%;
        .time-sales {
          display: flex;
          .time-sales1 {
            width: 25%;
            &-number {
              font-size: 16px;
              line-height: 24px;
              font-weight: 600;
              color: #0e0b23;
            }
            &-des {
              font-size: 14px;
              line-height: 24px;
              font-weight: 400;
              color: #5b616e;
            }
          }
        }
      }
      .sack-avatar-monney {
        display: flex;
        img {
          margin-right: 12px;
        }
        .sack-monney {
          .sack-money1 {
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
            color: var(--bc-text-market-primary);
          }
          .sack-money2 {
            font-size: 14px;
            line-height: 24px;
            font-weight: 400;
            color: var(--bc-text-discript);
          }
        }
      }
      .detail-nft-by {
        font-size: 16px;
        line-height: 24px;
        font-weight: 400;
        color: var(--bc-text-discript);
        margin-bottom: 12px;
        border-top: 3px solid #0151fc;
        padding-top: 20px;
        span {
          color: #0151fc !important;
        }
      }
    }
    .detail-money {
      margin-top: 28px;
      // margin-bottom: 16px;
      display: flex;
      align-items: center;
      img {
        width: 48px;
        height: 48px;
        border: 10px solid #f3f2f1;
        border-radius: 50%;
        margin-right: 8px;
      }
      &-price {
        font-size: 32px;
        line-height: 48px;
        font-weight: 600;
        margin-right: 8px;
      }
      &-nearly {
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
        color: #5b616e;
        transform: translateY(4px);
      }
    }

    ::v-deep.highest-bid {
      margin-top: 24px;
      &__title {
        margin-bottom: 12px;
      }
      &__content {
        border-radius: 8px;
        border: 1px solid #dbdbdb;
        padding: 16px;
        .left {
          display: flex;
          align-items: center;
          position: relative;
          max-width: 54%;
          .wrap-media {
            width: 48px;
            height: 48px;
            margin-right: 8px;
            img {
              object-fit: cover;
            }
          }
          .name {
            flex: 1;
          }

          .verified {
            height: 16px;
            position: absolute;
            bottom: -1px;
            left: 32px;
          }
          .new-circle {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #129961;
            border: 1px solid #ffffff;
            position: absolute;
            left: 36px;
            top: 2px;
          }
        }
        .right {
          text-align: right;
        }
      }
    }

    .time-sale {
      margin-top: 12px;
      .text-red {
        color: var(--bc-required);
      }
    }

    .detail-button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.russian {
        flex-wrap: wrap;
        .detail-button-one:not(:last-child) {
          margin: 0 0 8px 0 !important;
        }
      }
      // margin-bottom: 56px;
      margin-top: 16px;
      &-one {
        // width: calc((100% - 24px) / 2);
        margin-right: 24px;
      }
      &-one:last-child {
        margin-right: 0;
      }
      &-default {
        cursor: pointer;
        width: 242px;
        height: 48px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        color: #5b616e;
        border: 1px solid #dbdbdb;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .buynow {
        padding: 12px 0 !important;
        width: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;
        .arrow {
          margin-left: 16px;
        }
      }
      .bid {
        padding: 11px 0 !important;
        width: 100% !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .el-button-custom {
        font-size: 16px !important;
        line-height: 24px !important;
        padding: 11px 6px !important;
      }
    }

    .text-pending {
      p {
        margin-left: 5px;
        color: #dd7d00;
        cursor: pointer;
      }
    }
  }
  .btn-action {
    height: 48px;
    padding: 12px;
    border: 1px solid #dbdbdb;
  }
  .border-right {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .border-left {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  .color-code {
    color: #0151fc !important;
  }
  .favourite {
    border-right: none;
    // border-top-right-radius: 6px;
    // border-bottom-right-radius: 6px;
  }
  ::v-deep.text-rotate {
    .icon-rotate {
      padding-right: 4px;
      .svg-icon {
        transform: rotate(180deg);
      }
    }
  }
  .tour-details {
    margin-top: 5px;
    margin-bottom: 24px;
    color: #0151fc;
  }
  .border-content {
    border-bottom: 1px solid #dbdbdb;
    margin-top: 20px;
    margin-bottom: 24px;
  }
  .isPc {
    display: block !important;
  }
  .isMobile {
    display: none !important;
  }
  .asking-price-title {
    display: flex;
    margin-bottom: 8px;
    justify-content: space-around;
    .title-one {
      position: relative;
      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 2px;
        bottom: -10px;
        opacity: 0.8;
        left: 50%;
        background: var(--bc-menu-active);
        border-radius: 50%;
        transform: translateX(-50%);
      }
      &::after {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        bottom: -13px;
        left: 50%;
        background: var(--bc-menu-active);
        border-radius: 50%;
        transform: translateX(-50%);
        opacity: 0.3;
      }
    }
  }
  .asking-price-line {
    width: 100%;
    height: 2px;
    background: var(--bc-menu-active);
    opacity: 0.2;
  }
  .isNormal {
    display: block;
  }
  .isLinear {
    display: none;
  }
  .checkHover:hover {
    .isNormal {
      display: none;
    }
    .isLinear {
      display: block;
    }
  }
  @media (max-width: 767px) {
    .isPc {
      display: none !important;
    }
    .isMobile {
      display: block !important;
    }
    .border-left,
    .border-right {
      border-radius: 4px;
    }
    .favourite {
      border-right: 1px solid #dbdbdb;
    }
    .btn-action {
      height: 27px;
      padding: unset;
      margin-left: 10px;
    }
  }

  ::v-deep.sack-detail-nft {
    @media screen and (max-width: 767px) {
      flex-direction: column;
      .detail-nft-left {
        width: 100%;
        height: 100%;
        .wrap-media {
          .content-media {
            img {
              border-radius: 0 !important;
            }
          }
        }
      }
      .detail-nft-right {
        // max-width: calc(100% - 40px);
        margin: 16px auto 0;

        .detail-heading {
          &-address {
            font-size: 14px;
            line-height: 20px;
            color: var(--bc-theme-primary);
          }
          &-interative {
            // display: none;
          }
        }
        .detail-nft-folder {
          margin: 18px 0 8px;
          font-size: 20px;
          line-height: 24px;
        }
        .detail-nft-des {
          margin-bottom: 12px;
          #text-description {
            font-size: 14px;
          }
          .read-more {
            font-size: 14px;
          }
        }
        .sack-owner-create {
          flex-direction: column;
          .sack-owner,
          .sack-create {
            width: 100%;
            .sack-owner-title,
            .sack-create-title {
              font-size: 14px;
              line-height: 20px;
              margin-bottom: -9px;
              margin-right: 3px;
              margin-left: 12px;
            }
            .user-style {
              margin-bottom: -9px;
            }
            .sack-owner-icon,
            .sack-create-icon {
              .wrap-media {
                width: 34px;
                height: 34px;
                .content-media {
                  img {
                    width: 34px;
                    height: 34px;
                  }
                }
              }
              .verified {
                left: 20px;
                .span-icon {
                  font-size: 14px !important;
                }
              }
              .new-circle {
                left: 25px;
              }
            }
          }
          .sack-create {
            margin-top: 12px;
            display: flex;
            align-items: center;
          }
        }

        .list-item {
          .item {
            font-size: 14px;
            line-height: 20px;
          }
        }
        .content-about {
          // height: 160px;
          .content-about1 {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 12px;
            &:last-child {
              padding-bottom: 24px;
              margin-bottom: 0;
            }
          }
        }
        .highest-bid {
          &__content {
            padding: 15px 16px;
            .left {
              .wrap-media {
                width: 34px;
                height: 34px;
              }
              .span-icon {
                font-size: 34px !important;
              }
              .verified {
                left: 20px;
                .span-icon {
                  font-size: 14px !important;
                }
              }
              .new-circle {
                left: 25px;
              }
            }
            .right {
              .highest-bid-price {
                font-size: 14px;
                line-height: 20px;
              }
              .nft-body-small {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
        }

        .time-sale {
          font-size: 14px;
          line-height: 20px;
        }
        .detail-button {
          margin-top: 12px;
        }
      }
      .detail-nft-price {
        padding-bottom: 12px;
        align-items: center;
        .minimum-bid {
          font-size: 14px;
          line-height: 20px;
        }
        .dot {
          margin: 10px 8px;
        }
        .quantity {
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
  .detail-nft-price {
    display: flex;
    // justify-content: space-between;
    // max-width: 400px;
    width: 100%;
    // padding-top: 8px;
    padding-bottom: 16px;
    .price-value {
      font-weight: 600;
    }
    .price {
      // margin-right: -100px;
      color: #5b616e;
    }
    .minimum-bid {
      // margin-right: -100px;
      color: #5b616e;
      font-weight: 400;
    }
    .quantity {
      // margin-left: -100px;
      color: #5b616e;
    }
    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #c4c4c4;
      margin: 10px 12px;
    }
  }
  .content-media-avatar {
    .content-media {
      display: unset !important;
    }
  }
  .slide-scroll-detail {
    position: relative;
    margin-top: 12px;
  }
  .btn-crousel {
    top: 50%;
    z-index: 2;
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
    transform: translateY(-50%);
  }
  .prev {
    left: -22px;
  }
  .next {
    right: -22px;
  }
  .border-active-img {
    border: 2px solid;
    // border-image-source: linear-gradient(52.87deg, #9d3ef2 40.29%, #3036f4 97.93%);
    // border-image-slice: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    position: relative;

    // padding: 30% 2em;
    box-sizing: border-box;
    color: #fff;
    background: #fff;
    background-clip: padding-box;
    border: solid 2px transparent;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      margin: -2px;
      border-radius: 12px;
      background: var(--bc-tab-active);
    }
  }
  @media (max-width: 1200px) {
    .detail-nft {
      padding-top: 90px;
    }
    .sack-detail-nft {
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .detail-nft-right {
      max-width: 630px;
      width: 100%;
      position: relative;
      margin: 0 auto;
      margin-top: 40px;
    }
  }
</style>
