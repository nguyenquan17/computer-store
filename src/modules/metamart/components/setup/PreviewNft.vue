<template>
  <div class="preview-nft">
    <div class="content" v-if="isShowNft">
      <div class="content__avatar" :class="!initInfo.thumb ? 'empty-avt' : null">
        <img v-if="initInfo.thumb" :src="initInfo.thumb" alt="" />
        <base-icon v-else icon="icon-no-image" size="24" class="d-iflex" />
      </div>
      <div class="content__info">
        <div style="height: 80px">
          <div class="be-flex align-center jc-space-between title">
            <div class="be-flex align-center">
              <span class="nft-body-small text-desc text-overflow-1">{{ getNameCollection }} </span>
              <base-icon icon="icon-verified" size="12" class="d-iflex" style="padding-left: 2px" />
            </div>
            <base-icon icon="icon-3dot" size="20" class="d-iflex" />
          </div>
          <div class="nft-header6 text-semibold text-overflow-1">{{ initInfo.itemName }}</div>
          <div class="be-flex align-center price">
            <div class="icon"><base-icon :icon="getBaseCurrency" alt="" class="d-block" size="16" /></div>
            <span class="nft-body-small">
              <span class="text-body-small text-desc"> {{ $t('coming-soon') }}</span>
            </span>
          </div>
        </div>
        <div class="line"></div>
        <div class="be-flex align-center jc-space-between footer">
          <div class="text-body-small cursor text-action text-desc">{{ $t('not-for-sale') }}</div>

          <div class="be-flex align-center">
            <span class="cursor" style="height: 28px"><base-icon icon="icon-heart-white" size="28" class="d-iflex" /></span>
            <span class="nft-body-small text-desc">0</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-base text-desc empty">
      {{ $t('setup_empty-nft') }}
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  import isEmpty from 'lodash/isEmpty'
  import filter from 'lodash/filter'
  import { includes } from 'lodash'

  const bcNft = namespace('bcNft')
  @Component
  export default class PreviewNft extends Vue {
    @bcNft.State('initInfo') initInfo!: Record<string, any>
    @bcNft.State('listOriginCollection') listOriginCollection!: Array<Record<string, any>>

    get getNameCollection(): string {
      if (this.initInfo?.collectionId && this.listOriginCollection.length) {
        const collection = filter(this.listOriginCollection, elm => elm.id === this.initInfo.collectionId)[0]
        return collection.collectionName
      }

      return ''
    }
    get getBaseCurrency(): string {
      if (this.initInfo?.collectionId && this.listOriginCollection.length) {
        const baseETH = ['LYNK', 'USDC', 'USDT', 'ETH', 'CLM']
        const collection = filter(this.listOriginCollection, elm => elm.id === this.initInfo.collectionId)[0]
        return includes(baseETH, collection.currency) ? 'icon-eth' : 'icon-bnb'
      }

      return ''
    }

    get isShowNft(): boolean {
      return !isEmpty(this.initInfo)
    }
  }
</script>

<style scoped lang="scss">
  .preview-nft {
    width: 360px;
    padding: 37px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    height: fit-content;
    .content {
      border-radius: 8px;
      border: 1px solid #dbdbdb;
      overflow: hidden;

      .empty-avt {
        background: #dbdbdb;
      }

      &__avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 284px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      &__info {
        padding: 16px;
        .title {
          margin-bottom: 4px;
        }
        .price {
          margin-top: 4px;
          .icon {
            width: 24px;
            height: 24px;
            background: #f3f2f1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
          }
        }
        .line {
          margin: 16px 0;
          width: 100%;
          height: 1px;
          background: #dbdbdb;
        }
      }
    }

    .empty {
      text-align: center;
      padding: 205px 40px;
    }
  }
</style>
