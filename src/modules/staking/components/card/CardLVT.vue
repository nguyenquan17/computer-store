<template>
  <div class="card-lvt">
    <div class="card">
      <div class="be-flex align-center mb-16 top">
        <base-icon icon="card-stake" size="40" class="d-iflex" />
        <div class="ml-16">
          <p class="text-base text-semibold">Total staked amount</p>
          <p class="text-xs text-desc">on Cbex</p>
        </div>
      </div>
      <div class="text-2xl text-semibold amount">{{ summary.totalAmount | convertAmountDecimal(this.currencyActive) }} {{ this.currencyActive }}</div>
      <div class="nft-header5 text-desc">~${{ summary.totalAmountUsd | convertAmountDecimal('USD') }}</div>
    </div>
    <div class="card">
      <div class="be-flex align-center mb-16 top">
        <base-icon icon="stake-total" size="40" class="d-iflex" />
        <div class="ml-16">
          <p class="text-base text-semibold">Total stacked investors</p>
          <p class="text-xs text-desc">on Cbex</p>
        </div>
      </div>
      <div class="text-2xl text-semibold amount">{{ summary.numOfInvestor | formatNumber }} Investors</div>
    </div>
    <div class="card">
      <div class="be-flex align-center mb-16 top">
        <base-icon icon="stake-total-tx" size="40" class="d-iflex" />
        <div class="ml-16">
          <p class="text-base text-semibold">Total transactions</p>
          <p class="text-xs text-desc">on Cbex</p>
        </div>
      </div>
      <div class="text-2xl text-semibold amount">{{ summary.numOfTransaction | formatNumber }} transactions</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  @Component
  export default class CardLVT extends Vue {
    @Prop({ required: false, type: String, default: 'LYNK' }) currencyActive!: string
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
</style>
