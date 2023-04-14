<template>
  <base-popup name="popup-public-onchain" class="popup-public-onchain" width="400px">
    <div class="title-popup" slot="title">
      <span>PUBLIC ON-CHAIN</span>
    </div>
    <div class="content">
      <span class="content__text mb-24">
        You are making this <span class="content__text-item">The Myth Virtual Tour #33</span> item public on-chain.
      </span>
      <div class="content__quantity">
        <el-form>
          <el-form-item label="Quantity">
            <el-input type="number" v-model="quantity" placeholder="Enter your quantity" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close">{{ $t('button.cancel') }}</el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600">{{ $t('button.confirm') }}</el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  @Component({ components: {} })
  export default class PopupPublicOnchain extends Mixins(PopupMixin) {
    // @Prop({required: true, type: Object}) dataDetail!: Record<string, any>
    quantity = ''
  }
</script>

<style lang="scss" scoped>
  ::v-deep.popup-public-onchain {
    .content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      &__text {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: var(--bc-text-discript);
        &-item {
          color: var(--bc-text-primary);
          font-weight: 600;
        }
      }
    }
  }
</style>
