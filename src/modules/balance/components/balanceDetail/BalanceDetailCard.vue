<template>
  <div class="balance-card-detail be-flex">
    <div class="card-item">
      <div class="title be-flex align-center">
        <!-- <base-icon :icon="checkTypeIcon(tabActiveFilter.toLowerCase())" size="40" /> -->
        <img :src="getLogoToken" alt="" width="40px" />
        <div class="content-card">
          <p>{{ tabActiveFilter }} Wallet</p>
          <p>{{ $t('balance.balance') }}</p>
        </div>
      </div>
      <div class="value-card" :class="checkType(tabActiveFilter.toLowerCase())">
        <p class="current">{{ dataCard.balance | convertAmountDecimal(this.tabActiveFilter.toUpperCase()) }} {{ this.tabActiveFilter.toUpperCase() }}</p>
        <p class="last">~${{ dataCard.balanceUSD | convertAmountDecimal('USD') }}</p>
      </div>
    </div>
    <div class="card-item">
      <div class="title be-flex align-center">
        <img :src="getLogoToken" alt="" width="40px" />
        <div class="content-card">
          <p>{{ $t('balance.popup.available-amount') }}</p>
          <p>{{ $t('balance.popup.available-amount') }}</p>
        </div>
      </div>
      <div class="value-card" :class="checkType(tabActiveFilter.toLowerCase())">
        <p class="current">{{ dataCard.availableBalance | convertAmountDecimal(this.tabActiveFilter.toUpperCase()) }} {{ this.tabActiveFilter.toUpperCase() }}</p>
        <p class="last">~${{ dataCard.availableBalanceUSD | convertAmountDecimal('USD') }}</p>
      </div>
    </div>
    <div class="card-item">
      <div class="title be-flex align-center">
        <base-icon icon="icon-lock" size="40" class="square-icon" />
        <div class="content-card">
          <p>{{ $t('balance.popup.locked-amount') }}</p>
          <p>{{ $t('balance.popup.withdrawal-request') }}</p>
        </div>
      </div>
      <div class="value-card amount-locker">
        <p class="current">{{ dataCard.totalLockedAmount | convertAmountDecimal(this.tabActiveFilter.toUpperCase()) }} {{ this.tabActiveFilter.toUpperCase() }}</p>
        <p class="last">~${{ dataCard.totalLockedAmountUSD | convertAmountDecimal('USD') }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { IAssetToken } from '@/interface'
  import { filter } from 'lodash'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')

  @Component
  export default class BalanceDetailCard extends Vue {
    @Prop({ required: true, type: Object, default: {} }) dataCard!: Record<string, any>
    @Prop({ required: true }) tabActiveFilter!: string

    @beBase.State('listAssetToken') listAssetToken!: IAssetToken[]

    get getLogoToken(): string {
      return filter(this.listAssetToken, elm => elm.currency === this.tabActiveFilter)[0]?.iconUrl || ''
    }

    checkCoin(type: string): string {
      return type === 'lynk'
        ? (this.$i18n.t('balance.popup.wallet.lynk-wallet') as string)
        : type === 'btc'
        ? (this.$i18n.t('balance.popup.wallet.bitcoin-wallet') as string)
        : type === 'eth'
        ? (this.$i18n.t('balance.popup.wallet.eth-wallet') as string)
        : type === 'usdt'
        ? (this.$i18n.t('balance.popup.wallet.usdt-wallet') as string)
        : type === 'bnb'
        ? (this.$i18n.t('balance.popup.wallet.bnb-wallet') as string)
        : type === 'usdc'
        ? (this.$i18n.t('balance.popup.wallet.usdc-wallet') as string)
        : type === 'busd'
        ? (this.$i18n.t('balance.popup.wallet.busd-wallet') as string)
        : type === 'hub'
        ? (this.$i18n.t('balance.popup.wallet.hub-wallet') as string)
        : (this.$i18n.t('balance.popup.wallet.clm-wallet') as string)
    }

    checkType(type: string): string {
      return type === 'lynk'
        ? 'amount-lynk'
        : type === 'hub'
        ? 'amount-hub'
        : type === 'btc'
        ? 'amount-btc'
        : type === 'eth'
        ? 'amount-eth'
        : type === 'usdt'
        ? 'amount-usdt'
        : type === 'bnb'
        ? 'amount-bnb'
        : type === 'usdc'
        ? 'amount-usdc'
        : type === 'busd'
        ? 'amount-busd'
        : 'amount-locker'
    }

    checkTypeIcon(type: string): string {
      return type === 'lynk'
        ? 'icon-lynk'
        : type === 'hub'
        ? 'icon-hub'
        : type === 'clm'
        ? 'icon-clm'
        : type === 'btc'
        ? 'icon-btc'
        : type === 'eth'
        ? 'icon-eth'
        : type === 'usdt'
        ? 'icon-usdt'
        : type === 'bnb'
        ? 'icon-bnb'
        : type === 'usdc'
        ? 'icon-usdc'
        : type === 'busd'
        ? 'icon-busd'
        : 'icon-locker'
    }
  }
</script>
<style scoped lang="scss">
  .balance-card-detail {
    padding: 16px 24px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
    margin-bottom: 24px;

    .card-item {
      width: 311px;
      margin-right: 24px;
      border-right: 1px solid #dbdbdb;

      .title {
        margin-bottom: 16px;

        .content-card {
          margin-left: 16px;

          p:first-of-type {
            font-weight: 600;
            font-size: 18px;
            color: #0a0b0d;
            font-family: 'Open Sans';
          }

          p:last-of-type {
            font-size: 12px;
            color: #5b616e;
            font-family: 'Open Sans';
          }
        }
      }

      .value-card {
        .current {
          font-weight: 600;
          font-size: 24px;
          word-wrap: break-word;
          word-break: break-word;
        }

        .last {
          font-size: 14px;
          color: #5b616e;
        }
      }

      &:last-child {
        border: none;
      }
    }
  }
</style>
