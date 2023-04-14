<template>
  <div class="w-100 bo-request">
    <div class="bg-white box-shadow" style="margin-bottom: 24px">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div
              class="tab-item cursor"
              v-for="tab in getTabsHeader"
              :key="tab.id"
              :class="$route.params.token === tab.title ? 'tab-active' : null"
              @click="handleChangeTabsHeader(tab)"
            >
              <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="container wallet-header be-flex" style="width: calc(100% - 48px); padding: 24px 24px">
        <div class="items-card">
          <div class="item be-flex top">
            <span class="text1">
              {{ 'Total Withdraw' }}
            </span>
            <div>
              <base-icon icon="icon-upload" size="24" />
            </div>
          </div>
          <div class="item">
            <p class="number2">
              {{ this.dataCardSummary.totalAmount | convertAmountDecimal(tabHeaderActive) }}
              <a class="tabActiveHeader">{{ tabHeaderActive }}</a>
            </p>
          </div>
          <div class="item-bottom">
            <span class="text3">~${{ this.dataCardSummary.totalAmountUsd | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box-content bg-white box-shadow">
      <div class="table bg-white box-shadow">
        <div class="wallet-header">
          <div class="be-flex align-center jc-space-between wallet-header__above">
            <div class="wallet-header__above-tabs be-flex">
              <div class="tab-item cursor" v-for="tab in tabs" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
                <span class="text-base">{{ $t(`request.${tab.title}`) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="box-table">
          <!--          <router-view />-->
          <withdraw :tabCoin="tabHeaderActive" v-if="$route.name === 'RequestWithdraw'" @summary="handleReceiveSummary" />
          <!--          <transfer v-if="$route.name === 'RequestTransfer'"/>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { MODULE_WITH_ROUTENAME } from '@/configs/role'
  import { namespace } from 'vuex-class'
  import Withdraw from '@/modules/request/view/Withdraw.vue'
  import Transfer from '@/modules/request/view/Transfer.vue'
  import firebase from '@/utils/firebase'
  import { filter } from 'lodash'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  interface IDataCard {
    totalAmount: number | null
    transactionType: string | null
    totalAmountUsd: number | null
  }
  @Component({
    components: { Transfer, Withdraw }
  })
  export default class BORequest extends Vue {
    @bcAuth.Getter('listModuleCanView') listModuleCanView!: Array<Record<string, any>>
    @beBase.State('coinMain') coinMain!: string
    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'withdraw',
        routeName: 'RequestWithdraw'
      }
      // {
      //   id: 2,
      //   title: 'transfer',
      //   routeName: 'RequestTransfer'
      // }
    ]
    tabsHeader: Array<Record<string, any>> = [
      {
        id: 2,
        title: 'BTC',
        routeName: 'RequestBtc'
      },
      {
        id: 3,
        title: 'ETH',
        routeName: 'RequestEth'
      },
      {
        id: 4,
        title: 'BNB',
        routeName: 'RequestBnb'
      },
      {
        id: 5,
        title: 'USDT',
        routeName: 'RequestUsdt'
      },
      {
        id: 6,
        title: 'USDC',
        routeName: 'RequestUsdc'
      },
      {
        id: 7,
        title: 'BUSD',
        routeName: 'RequestBusd'
      }
    ]
    tabActive = 'withdraw'
    tabHeaderActive = ''
    dataCardSummary: IDataCard = {
      totalAmount: null,
      transactionType: null,
      totalAmountUsd: null
    }
    exchangeRate: Array<Record<string, any>> = []
    listener: any = null

    get getTabsHeader(): Array<Record<string, any>> {
      return [
        {
          id: 1,
          title: 'LYNK',
          routeName: 'RequestLynk'
        },
        ...this.tabsHeader
      ]
    }

    handleReceiveSummary(data: Record<string, any>) {
      this.dataCardSummary.totalAmount = data?.totalAmount
      this.dataCardSummary.totalAmountUsd = data?.totalAmountUsd
    }

    created(): void {
      // if (!this.checkPemission('crowd-sale', ['view'])) {
      //   const routeName = MODULE_WITH_ROUTENAME[this.listModuleCanView[0].module]
      //   this.$router.push({ name: routeName })
      //   return
      // }
      // this.$router.push({ params: {token: this.coinMain} })
      // this.tabActive = this.$route.path.split('/')[3]
      this.tabHeaderActive = this.$route.path.split('/')[2]
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.$router.push({ name: tab.routeName })
    }

    handleChangeTabsHeader(tab: Record<string, any>): void {
      this.$router.push({ params: { token: tab.title } })
      this.tabHeaderActive = tab.title
    }
  }
</script>
<style scoped lang="scss">
  .bo-request {
    color: var(--bc-text-primary);
    .box-content {
      // tab active
      .table {
        .box-table {
          padding: 24px;
          min-height: 240px;
          overflow-y: auto;
        }
      }
    }
    .items-card {
      width: calc(100% / 4 - 50px);
      background-color: #ffffff;
      //box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
      border-radius: 8px;
      border: 1px solid #dbdbdb !important;
      // margin-right: 24px;
      //margin-bottom: 24px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      // flex: 1;
      .item-bottom {
        margin-top: auto;
      }

      &:last-of-type {
        margin-right: 0;
      }

      .top {
        justify-content: space-between;
        align-items: center;
      }

      .number2 {
        font-family: Open Sans;
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
        line-height: 24px;
        color: #0a0b0d;
        word-break: break-all;
        margin: 8px 0;
        .tabActiveHeader {
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
        }
      }

      .text3 {
        font-family: Open Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #5b616e;
      }

      .text1 {
        font-family: Open Sans;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        color: #5b616e;
      }
    }
    .wallet-header {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);
        &-tabs {
          .tab-item {
            padding: 16px 12px;
            position: relative;
            color: var(--bc-text-discript);
            &:hover {
              color: var(--bc-tab-active);
            }
          }
          .tab-active {
            color: var(--bc-tab-active);
            font-weight: 600;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 2px;
              bottom: 0;
              left: 0;
              background-color: var(--bc-tab-active);
            }
          }
        }
      }

      &__below {
        padding: 24px;
        &-amount {
          .amount-wallet,
          .amount-lock {
            flex: 1;
            .title {
              margin-left: 16px;
              .title-coin {
                color: #201f1e;
              }
            }
            .amount {
              margin-top: 10px;

              .amount-btc {
                color: var(--bc-amount-btc);
              }
              .amount-lyn {
                color: var(--bc-amount-lin);
              }
              .amount-lock {
                color: var(--bc-amount-lock);
              }
            }
          }
          .amount-wallet {
            border-right: 1px solid var(--bc-border-primary);
          }
        }
      }
    }
  }
</style>
