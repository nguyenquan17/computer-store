<template>
  <div class="card-lvt">
    <div class="card">
      <div class="be-flex align-center mb-12 top jc-space-between">
        <div class="">
          <p class="text-base text-regular text-desc">Total Sales</p>
        </div>
        <base-icon icon="card-chart" size="24" class="d-iflex" />
      </div>
      <div class="text-nft-24-24 text-primary text-semibold">${{ summary.totalSaleUsd | convertAmountDecimal('USD') }}</div>
    </div>
    <div class="card">
      <div class="be-flex align-center mb-12 top jc-space-between">
        <div class="">
          <p class="text-base text-regular text-desc">Total Commission</p>
        </div>
        <base-icon icon="icon-usdt" size="24" class="d-iflex" />
      </div>
      <div class="text-nft-24-24 text-primary text-semibold">{{ summary.commissionUsdt | convertAmountDecimal('USDT') }} USDT</div>
      <div class="text-body-small text-desc text-regular mt-4">~ ${{ summary.commissionUsdtToUsd | convertAmountDecimal('USD') }}</div>
    </div>
    <div class="card">
      <div class="be-flex align-center mb-12 top jc-space-between">
        <div class="">
          <p class="text-base text-regular text-desc">Total Commission</p>
        </div>
        <base-icon icon="icon-lynk" size="24" class="d-iflex" />
      </div>
      <div class="text-nft-24-24 text-primary text-semibold">{{ summary.commissionLynk | convertAmountDecimal('LYNK') }} LYNK</div>
      <div class="text-body-small text-desc text-regular mt-4">~ ${{ summary.commissionLynkToUsd | convertAmountDecimal('USD') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  @Component
  export default class CardCommission extends Vue {
    @Prop({ required: false, type: Object, default: () => ({}) }) summary!: Record<string, any>
  }
</script>

<style scoped lang="scss">
  .card-lvt {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    .card {
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      padding: 16px;
    }
  }
  .mt-4 {
    margin-top: 4px;
  }
</style>
