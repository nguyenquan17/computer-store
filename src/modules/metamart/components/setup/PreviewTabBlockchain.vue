<template>
  <div class="preview">
    <div class="mb-24 tab">
      <p class="text-hyperlink text-base text-semibold">{{ $t('tab_nft-info') }}</p>
    </div>
    <div class="list">
      <div class="be-flex align-center jc-space-between list-item">
        <p class="text-base">{{ $t('label_contract-address') }}</p>
        <p class="text-hyperlink text-base">{{ initBlockchain.contractAddress | formatTransactionCode(5) }}</p>
      </div>
      <div v-if="typePopup === 'edit'" class="be-flex align-center jc-space-between list-item">
        <p class="text-base">{{ $t('label_token-id') }}</p>
        <p class="text-desc text-base">{{ initBlockchain.tokenId }}</p>
      </div>
      <div class="be-flex align-center jc-space-between list-item">
        <p class="text-base">{{ $t('label_blockchain') }}</p>
        <p class="text-desc text-base">{{ initBlockchain.networkName }}</p>
      </div>
      <div class="be-flex align-center jc-space-between list-item">
        <p class="text-base">{{ $t('label_token-standard') }}</p>
        <p class="text-desc text-base">{{ initBlockchain.network }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const bcNft = namespace('bcNft')
  @Component
  export default class PreviewTabBlockchain extends Vue {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: 'add' | 'edit'

    @bcNft.State('initBlockchain') initBlockchain!: Record<string, any>
  }
</script>

<style scoped lang="scss">
  .preview {
    width: 360px;
    padding: 24px;
    border: 1px solid #dbdbdb;
    border-radius: 8px;

    .tab {
      border-bottom: 1px solid #dbdbdb;
      p {
        padding: 0 12px 14px;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          background: #0151fc;
          bottom: 0;
          left: 0;
        }
      }
    }
    .list {
      .list-item:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
</style>
