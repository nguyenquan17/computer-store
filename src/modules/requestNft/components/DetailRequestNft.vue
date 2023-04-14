<template>
  <div class="nft-detail">
    <div class="nft-detail-block">
      <p class="text-base text-semibold">{{ $t('popup_nft-detail') }}</p>
      <div class="be-flex align-center jc-space-between row">
        <div class="text-body-small text-desc label">{{ $t('label_category') }}</div>
        <p class="text-base">{{ detailRequest.categoryName }}</p>
      </div>

      <div class="be-flex align-center jc-space-between row">
        <div class="text-body-small text-desc label">{{ $t('label_quantity') }}</div>
        <p class="text-base">{{ detailRequest.quantity | formatNumber }}</p>
      </div>
    </div>
    <div class="line"></div>
    <div class="nft-detail-block">
      <p class="text-base align-center text-semibold">{{ $t('popup_investor-info') }}</p>
      <div class="be-flex jc-space-between row">
        <div class="text-body-small text-desc label">{{ $t('label_name') }}</div>
        <p class="text-base">{{ detailRequest.accountName }}</p>
      </div>
      <div class="be-flex align-center jc-space-between row">
        <div class="text-body-small text-desc label">{{ $t('label_phone') }}</div>
        <p class="text-base">{{ detailRequest.phoneNumber }}</p>
      </div>
      <div class="be-flex align-center jc-space-between row">
        <div class="text-body-small text-desc label">{{ $t('label_email') }}</div>
        <p class="text-base">{{ detailRequest.accountUsername }}</p>
      </div>
      <!-- <div class="be-flex align-center jc-space-between row">
        <div class="text-body-small text-desc label">{{ $t('label_note') }}</div>
        <p class="text-base">{{ detailRequest.note }}</p>
      </div> -->
    </div>
    <div class="line"></div>
    <div class="nft-detail-block--note">
      <p class="text-base align-center text-semibold mb-12">{{ $t('label_investor-note') }}</p>
      <p class="text-base">{{ detailRequest.note }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { IDetailRequestNft } from '@/interface'
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component
  export default class DetailRequestNft extends Vue {
    @Prop({ required: false, type: Object, default: () => ({}) }) detailRequest!: IDetailRequestNft
  }
</script>

<style scoped lang="scss">
  .nft-detail {
    .nft-detail-block {
      padding: 24px 24px 12px;

      .row {
        padding: 14px 0;
        border-bottom: 1px solid #dbdbdb;

        .label {
          width: 30%;
        }
        p {
          flex: 1;
          text-align: right;
        }
      }
      .row:last-child {
        border-bottom: none;
      }
    }
    .nft-detail-block--note {
      padding: 24px;
    }
    .line {
      border-bottom: 8px solid #f6f8fc;
    }
  }
</style>
