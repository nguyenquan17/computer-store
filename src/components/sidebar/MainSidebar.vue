<template>
  <div class="main-side-bar be-flex-column align-center">
    <router-link :to="{ name: 'CustomerMain' }" class="style_router_home router_center router-home" exact>
      <div class="sack_avatar logo-home">
        <!-- <base-icon icon="logo-lienviet" style="font-size: 40px; display: block; height: 40px" class="style_avatar_home" /> -->
        <!-- <base-icon icon="logo-login" size="32" /> -->
        <!-- <base-icon icon="logo-login" size="32" /> -->
        <img src="../../assets/images/logo-70.png" alt="" width="32px" />
        <p>{{ $t('leftMenu.home') }}</p>
      </div>
    </router-link>
    <!-- <router-link :to="{ name: 'Crowdsale' }" v-if="checkPemission('crowd-sale', ['view'])" class="router_center">
      <div class="sack_avatar">
        <base-icon :icon="'menu-crowdsale-active'" class="menu-active" size="32" />
        <base-icon icon="menu-crowdsale" class="menu" size="32" />
        <p>{{ $t('leftMenu.crowdsale') }}</p>
      </div>
    </router-link>
    <router-link :to="{ name: 'Kyc' }" v-if="checkPemission('kyc', ['view'])" class="router_center">
      <div class="sack_avatar">
        <base-icon :icon="'menu-kyc-active'" class="menu-active" size="32" />
        <base-icon icon="menu-kyc" class="menu" size="32" />
        <p>{{ $t('leftMenu.kyc') }}</p>
      </div>
    </router-link> -->
    <router-link :to="{ name: 'CustomerMain' }" v-if="checkPemission('customer', ['view'])" class="router_center">
      <div class="sack_avatar">
        <base-icon :icon="'menu-customer-active'" class="menu-active" size="32" />
        <base-icon icon="menu-customer" class="menu" size="32" />
        <p>{{ $t('leftMenu.customer') }}</p>
      </div>
    </router-link>

    <!-- Popper STAKING -->
    <!-- <el-popover
      v-if="checkPemission('staking-tvl', ['view']) || checkPemission('staking-setup', ['view'])"
      trigger="hover"
      v-model="isOpenPopperStaking"
      placement="right"
      popper-class="menu-nft"
      style="min-width: 80px"
    >
      <div class="popper-add-menu-content">
        <ul v-if="checkPemission('staking-tvl', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopperStaking = false">
            <router-link :to="{ name: 'StakingLVT', params: { token: coinMain, type: 'stake' } }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'transaction-active'" class="menu-active" size="32" />
                <base-icon icon="transaction" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.tvl') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
        <ul v-if="checkPemission('staking-setup', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopperStaking = false">
            <router-link :to="{ name: 'StakingSetup' }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'menu-staking-active'" class="menu-active" size="32" />
                <base-icon icon="menu-staking" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.setup') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <el-button slot="reference" class="is-create-color is-white is-none-border icon-btn p-0 m-0 button-add" style="height: 100%; position: relative; width: 100%">
        <base-icon :icon="'menu-staking'" class="menu" size="32" />
        <span style="font-size: 10px; display: block; margin-top: 7px; color: var(--bc-color-grey190)">{{ $t('leftMenu.staking') }}</span>
      </el-button>
    </el-popover> -->

    <!-- Popper NFT -->
    <!-- <el-popover trigger="hover" v-if="checkShowNft" v-model="isOpenPopupNft" placement="right" popper-class="menu-nft" style="min-width: 80px">
      <div class="popper-add-menu-content">
        <ul v-if="checkPemission('inventory', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopupNft = false">
            <router-link :to="{ name: 'Inventory' }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'inventory-active'" class="menu-active" size="32" />
                <base-icon icon="inventory" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.inventory') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
        <ul v-if="checkPemission('transaction-nft', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopupNft = false">
            <router-link :to="{ name: 'TransactionNftMain', params: { token: coinMain } }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'transaction-active'" class="menu-active" size="32" />
                <base-icon icon="transaction" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.transaction') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
        <ul v-if="checkPemission('fee-nft', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopupNft = false">
            <router-link :to="{ name: 'FeeNft' }">
              <div class="sack_avatar">
                <base-icon :icon="'fee-active'" class="menu-active" size="32" />
                <base-icon icon="fee" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.fee-nft') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
        <ul v-if="checkPemission('NFT', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopupNft = false">
            <router-link :to="{ name: 'NftMain' }">
              <div class="sack_avatar">
                <base-icon :icon="'menu-metamart-active'" class="menu-active" size="32" />
                <base-icon icon="menu-metamart" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.nft') }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <ul v-if="checkPemission('request-nft', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopup = false">
            <router-link :to="{ name: 'RequestNFT', params: { type: 'pending' } }" class="router_center">
              <div class="sack_avatar">
                <base-icon icon="menu-request-active" class="menu-active" size="32" />
                <base-icon icon="menu-request" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.request') }} NFT</p>
              </div>
            </router-link>
          </li>
        </ul>
        <ul v-if="checkPemission('commission', ['view'])" class="module">
          <li class="module-item" @click="isOpenPopup = false">
            <router-link :to="{ name: 'CommissionTransactions', params: { tab: 'transactions' } }" class="router_center">
              <div class="sack_avatar">
                <base-icon icon="icon-commission-active" class="menu-active" size="32" />
                <base-icon icon="icon-commission" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">Commission</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <el-button slot="reference" class="is-create-color is-white is-none-border icon-btn p-0 m-0 button-add" style="height: 100%; position: relative; width: 100%">
        <base-icon :icon="'menu-metamart'" class="menu" size="32" />
        <span style="font-size: 10px; display: block; margin-top: 7px; color: var(--bc-color-grey190)">{{ $t('leftMenu.nft') }}</span>
      </el-button>
    </el-popover> -->

    <router-link :to="{ name: 'Balance' }" v-if="checkPemission('balance', ['view'])" class="router_center">
      <div class="sack_avatar">
        <base-icon :icon="'icon-wallet-bo-active'" class="menu-active" size="32" />
        <base-icon icon="icon-wallet-bo" class="menu" size="32" />
        <p>{{ $t('leftMenu.balance') }}</p>
      </div>
    </router-link>

    <router-link :to="{ name: 'Transaction', params: { token: coinMain } }" v-if="checkPemission('transaction', ['view'])" class="router_center">
      <div class="sack_avatar">
        <base-icon :icon="'menu-swap-active'" class="menu-active" size="32" />
        <base-icon icon="menu-swap-active-clm" class="menu" size="32" />
        <p>{{ $t('leftMenu.transaction') }}</p>
      </div>
    </router-link>

    <!-- <el-popover
      trigger="hover"
      v-if="checkPemission('exception', ['view']) || checkPemission('member', ['view'])"
      v-model="isOpenPopup"
      placement="right"
      popper-class="p-0 poper popper-add-menu"
      style="min-width: 80px"
    >
      <div class="popper-add-menu-content">
        <ul class="module" v-if="checkPemission('fee', ['view'])">
          <li class="module-item" @click="isOpenPopup = false">
            <router-link :to="{ name: 'Fee' }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'fee-active'" class="menu-active" size="32" />
                <base-icon icon="fee" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.fee') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
        <ul class="module" v-if="checkPemission('request', ['view'])">
          <li class="module-item" @click="isOpenPopup = false">
            <router-link :to="{ name: 'Request', params: { token: coinMain } }" class="router_center">
              <div class="sack_avatar">
                <base-icon icon="menu-request-active" class="menu-active" size="32" />
                <base-icon icon="menu-request" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.request') }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <ul class="module" v-if="checkPemission('exception', ['view'])">
          <li class="module-item" @click="isOpenPopup = false">
            <router-link :to="{ name: 'Exception' }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'icon-exception-bo-active'" class="menu-active" size="32" />

                <base-icon icon="icon-exception-bo" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.exception') }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <ul class="module" v-if="checkPemission('member', ['view'])">
          <li class="module-item" @click="isOpenPopup = false">
            <router-link :to="{ name: 'MemberMain' }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'menu-member-active'" class="menu-active" size="32" />

                <base-icon icon="menu-member" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.member') }}</p>
              </div>
            </router-link>
          </li>
        </ul>

        <ul class="module" v-if="checkPemission('report', ['view'])">
          <li class="module-item" @click="isOpenPopup = false">
            <router-link :to="{ name: 'Report' }" class="router_center">
              <div class="sack_avatar">
                <base-icon :icon="'menu-report-active'" class="menu-active" size="32" />

                <base-icon icon="menu-report" class="menu" size="32" />
                <p class="color-add-menu" style="font-size: 11px">{{ $t('leftMenu.report') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <el-button slot="reference" class="is-create-color is-white is-none-border icon-btn p-0 m-0 button-add" style="height: 100%; position: relative; width: 100%">
        <base-icon icon="icon-more" class="menu" size="32" />
        <span style="font-size: 10px; display: block; margin-top: 7px; color: var(--bc-color-grey190)">{{ $t('leftMenu.more') }}</span>
      </el-button>
    </el-popover> -->

    <!-- <router-link :to="{ name: 'Wallet' }" class="router_center" exact>
      <div class="sack_avatar">
        <base-icon icon="menu-contract" size="32" />
        <p>{{ $t('leftMenu.contract') }}</p>
      </div>
    </router-link>
    <router-link :to="{ name: 'report' }" class="router_center" exact>
      <div class="sack_avatar">
        <base-icon icon="menu-report" size="32" />
        <p>{{ $t('leftMenu.report') }}</p>
      </div>
    </router-link>
    <router-link :to="{ name: 'Profile' }" class="router_center router_setting" exact>
      <div class="sack_avatar">
        <base-icon icon="menu-setting" size="32" />
        <p>{{ $t('leftMenu.setting') }}</p>
      </div>
    </router-link> -->
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const beBase = namespace('beBase')
  @Component({ components: {} })
  export default class MainSidebar extends Vue {
    @beBase.State('coinMain') coinMain!: string

    isOpenPopup = false
    isOpenPopupNft = false
    isOpenPopperStaking = false
    isOpenPopupContract = false
    searchModule = ''
    moduleContract = [
      {
        id: 4,
        name: 'Fee',
        routerName: 'contract',
        icon: 'icon-hop-dong',
        title: 'Thu phí'
      },
      {
        id: 5,
        name: 'Brief',
        routerName: 'pending',
        icon: 'icon-ho-so',
        title: 'Hồ sơ'
      },
      {
        id: 6,
        name: 'Lapse',
        routerName: 'lapse',
        icon: 'contractLaspe',
        title: 'Mất hiệu lực'
      }
    ]
    moreModules = [
      {
        id: 1,
        name: 'Program',
        routerName: 'programOrigin',
        icon: 'program',
        title: 'CTTĐ'
      },
      {
        id: 2,
        name: 'Employee',
        routerName: 'employee',
        icon: 'icon-KH',
        title: 'Nhân sự'
      },
      {
        id: 3,
        name: 'Product',
        routerName: 'productePage',
        icon: 'product',
        title: 'Sản phẩm'
      },
      // {
      //   id: 4,
      //   name: 'Deal',
      //   routerName: 'deals',
      //   icon: 'icon-luong',
      //   title: 'Cơ hội'
      // }
      {
        id: 5,
        name: 'Offer',
        routerName: 'offerOrigin',
        icon: 'menu-offer',
        title: 'CTƯĐ'
      }
    ]

    get checkShowNft(): boolean {
      return (
        this.checkPemission('NFT', ['view']) ||
        this.checkPemission('inventory', ['view']) ||
        this.checkPemission('request-nft', ['view']) ||
        this.checkPemission('fee-nft', ['view']) ||
        this.checkPemission('transaction-nft', ['view']) ||
        this.checkPemission('commission', ['view'])
      )
    }
  }
</script>
<style lang="scss" scoped>
  .main-side-bar {
    position: relative;
    background: #ffffff;
    height: 100vh;
    width: 80px;
    overflow-y: auto;
    overflow-x: hidden;

    .style_router_home {
      margin: 0px 10px 10px 10px;

      .style_avatar_home {
        color: #ef7524;
        text-align: center;
      }
    }

    .setting {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 38px;
      color: #6b6b6b;
    }

    .style_avatar {
      text-align: center;
      line-height: 1;
      font-size: 32px;
    }

    .router_center {
      text-align: center;
      width: 100%;
      height: 80px;
      color: #6b6b6b;

      .sack_avatar {
        padding: 12px 0;

        p {
          font-size: 10px;
          margin-top: 3px;
          color: var(--bc-color-grey190);
          font-weight: 400;
          line-height: 12px;
        }

        &:hover {
          background: var(--bc-color-grey20);
          color: var(--bc-theme-primary);

          p {
            color: var(--bc-theme-primary) !important;
          }

          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }

      &:hover {
        .menu-active {
          display: block;
        }

        .menu {
          display: none;
        }
      }
    }

    .router_setting {
      position: absolute;
      bottom: 0;
      // margin-top: calc(100vh - 600px);
    }

    .filter_avatar {
      opacity: 0.65;
    }
  }

  a {
    text-decoration: none;
  }

  .router-link-exact-active,
  .router-link-active {
    background: #e9e9e9;
    width: 80px;

    .sack_avatar {
      color: var(--bc-theme-primary);

      p {
        color: var(--bc-theme-primary) !important;
        font-weight: 600 !important;
      }

      .menu {
        display: none;
      }

      .menu-active {
        display: block;
      }
    }

    .child-item {
      color: #f07525;
      background: #e9e9e9;
    }
  }

  .router-home {
    margin-bottom: 0 !important;

    .logo-home {
      height: 100%;
      padding-top: 10px !important;

      .style_avatar_hom {
        font-size: 40px;
        display: block;
      }

      p {
        margin-top: 6px !important;
      }
    }
  }

  .style_special {
    margin-left: 11px;
  }

  .button-add {
    // background: #f3f3f3;

    &:hover {
      background: var(--bc-color-grey20);
      color: var(--bc-theme-primary);
    }

    &:focus {
      border: none;
      color: #6b6b6b !important;
    }
  }

  .module {
    list-style-type: none;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;

    &-item {
      color: #65676b;
      text-align: center;
      height: 68px;
      cursor: pointer;
      flex-basis: 32%;

      &:hover {
        color: #0078d4;
        background: #e9e9e9;
      }

      &.menu-active {
        color: #0078d4;
        background: #e9e9e9;
      }
    }

    .child-item {
      height: 100%;
    }
  }

  .module-item {
    margin: 1px;
  }

  .menu-active {
    display: none;
  }
  // ::v-deep .popper-add-menu {
  //   display: flex !important;
  // }
  .popper-add-menu-content {
    display: flex;
    max-width: 212px;
    flex-wrap: wrap;
  }
  .module {
    display: unset;
    flex-wrap: unset;
    padding: 12px;
    width: 106px;
  }
  .color-add-menu {
    color: var(--bc-color-grey190);
  }
</style>
