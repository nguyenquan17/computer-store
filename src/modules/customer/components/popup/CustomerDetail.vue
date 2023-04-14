<template>
  <base-popup name="popup-customer-detail" class="popup-customer-detail" width="1200px" :isShowFooter="false" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('customer.popup.title') }}</span>
    </div>
    <div class="content">
      <div class="be-flex mb-24 content__header">
        <div class="avatar">
          <img v-if="detailRow.avatar" :src="detailRow.avatar" altdetailRow.avatar />
          <base-icon v-else icon="default-avatar" size="80" style="display: inline-flex" />
        </div>
        <div class="ml-24 w-100 info">
          <div class="full-name mb-12 text-l text-bold">{{ detailRow.fullName }}</div>
          <div class="be-flex info-below">
            <div class="info-below__left">
              <div class="be-flex jc-space-between info-item">
                <span class="text-xs label">{{ $t('label.referral-code') }}:</span>
                <span class="text-base">{{ detailRow.affiliationCode }}</span>
              </div>
              <div class="be-flex jc-space-between info-item">
                <span class="text-xs label">Username:</span>
                <div class="be-flex align-center">
                  <span class="text-base">{{ detailRow.username | formatTransactionCode(7, 7) }}</span>
                  <div class="cursor icon-copy square-icon" @click="handleCopyTransaction(detailRow.username)">
                    <base-icon icon="icon-copy" size="22" class="square-icon" />
                  </div>
                </div>
              </div>
              <div class="be-flex jc-space-between info-item">
                <span class="text-xs label">{{ $t('label.email') }}:</span>
                <span class="text-base">{{ detailRow.email }}</span>
                <span style="width: fit-content" class="status-verified" :style="lang === 'en' ? 'right:-50px' : 'right:-75px'" v-if="detailRow.emailVerified === '1'">{{
                  $t('customer.verified')
                }}</span>
              </div>
            </div>
            <div class="info-below__right">
              <div class="be-flex jc-space-between info-item">
                <span class="text-xs label">{{ $t('label.level') }}:</span>
                <span class="text-base">{{ getLevelCurrent }}</span>
              </div>
              <div class="be-flex jc-space-between info-item">
                <span class="text-xs label">{{ $t('label.create-date') }}:</span>
                <span class="text-base">{{ detailRow.createdDate | formatMMDDYY }}</span>
              </div>
              <div class="be-flex jc-space-between info-item">
                <span class="text-xs label">{{ $t('label.last-login') }}:</span>
                <span class="text-base">{{ detailRow.lastTimeLogin | formatMMDDYY }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content__bottom">
        <div class="be-flex mb-24 tabs">
          <div class="tab-item cursor" v-for="tab in getTabs" :key="tab.id" :class="tabActive === tab.value ? 'tab-active' : null" @click="handleChangeTab(tab)">
            <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
          </div>
        </div>
        <div v-loading="isLoading" :class="isLoading ? 'main-content-loading' : null" class="main-content">
          <info-customer v-if="tabActive === 'INFO'" :info="detailRow" />
          <Kyc-customer-detail v-if="tabActive === 'KYC'" :detailRow="detailRow" />
          <customer-address v-if="tabActive === 'ADDRESS'" :userId="detailRow.userId" />
          <customer-balance v-if="tabActive === 'BALANCE'" :userId="detailRow.userId" />
          <customer-transaction v-if="tabActive === 'TRANSACTION'" :userId="detailRow.userId" />
          <vesting-list v-if="tabActive === 'VESTING'" :userId="detailRow.userId" />
          <customer-referral v-if="tabActive === 'REFERRAL'" :userId="detailRow.userId" />
          <customer-bonus v-if="tabActive === 'BONUS'" :userId="detailRow.userId" />
          <statistic v-if="tabActive === 'STATISTICS'" :userId="detailRow.userId" />
          <setting v-if="tabActive === 'SETTING'" :userId="detailRow.userId" :dataDetail="detailRow" :summary="summary" />
          <device v-if="tabActive === 'DEVICE' && checkPemission('customer', ['view-detail-device'])" :userId="detailRow.userId" />
          <social v-if="tabActive === 'SOCIAL'" :listSocial="listSocial" />
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import InfoCustomer from '../Info.vue'
  import CustomerBalance from '../Balance.vue'
  import CustomerTransaction from '../CustomerTransaction.vue'
  import PopupMixin from '@/mixins/popup'
  import KycCustomerDetail from '@/modules/customer/components/Kyc.vue'
  import CustomerReferral from '../Referral.vue'
  import CustomerAddress from '../Address.vue'
  import CustomerBonus from '../Bonus.vue'
  import Statistic from '@/modules/customer/components/Statistic.vue'
  import Setting from '@/modules/customer/components/Setting.vue'
  import VestingList from '@/modules/customer/components/Vesting.vue'
  import Device from '../Device.vue'
  import Social from '../Social.vue'

  export interface IStatistics {
    transactionType: string | null
    numOfTransaction: number | null
    lastTransaction: string | null
    totalAmount: number | null
    avgAmount: number | null
  }

  export interface ISummary {
    totalWithdraw: number | null
    totalTrade: number | null
    totalBalance: number | null
    totalDeposit: number | null
  }

  @Component({
    components: {
      InfoCustomer,
      CustomerBalance,
      KycCustomerDetail,
      CustomerTransaction,
      CustomerReferral,
      CustomerAddress,
      CustomerBonus,
      Statistic,
      Setting,
      VestingList,
      Device,
      Social
    }
  })
  export default class CustomerDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: {} }) detailRow!: Record<string, any>

    detail: Record<string, any> = {}
    isLoading = false
    // listStatistics: IStatistics[] = []
    // summary: ISummary = {} as ISummary
    tabs: Record<string, any>[] = [
      // {
      //   id: 0,
      //   title: 'info',
      //   value: 'INFO'
      // },
      // {
      //   id: 1,
      //   title: 'kyc',
      //   value: 'KYC'
      // },
      // {
      //   id: 2,
      //   title: 'address',
      //   value: 'ADDRESS'
      // },
      {
        id: 3,
        title: 'balance',
        value: 'BALANCE'
      },
      {
        id: 4,
        title: 'transaction',
        value: 'TRANSACTION'
      },
      // {
      //   id: 5,
      //   title: 'vesting',
      //   value: 'VESTING'
      // },
      {
        id: 6,
        title: 'referral',
        value: 'REFERRAL'
      },
      {
        id: 7,
        title: 'bonus',
        value: 'BONUS'
      },
      {
        id: 8,
        title: 'statistics',
        value: 'STATISTICS'
      },
      {
        id: 9,
        title: 'setting',
        value: 'SETTING'
      },
      {
        id: 10,
        title: 'device',
        value: 'DEVICE'
      },
      {
        id: 11,
        title: 'social',
        value: 'SOCIAL'
      }
    ]
    tabActive = 'BALANCE'
    lang = 'en'

    listSocial: Array<Record<string, any>> = []

    //balance
    listBlance: Record<string, any>[] = []

    get getTabs(): Array<Record<string, any>> {
      if (this.checkPemission('customer', ['view-kyc-customer-detail'])) {
        return this.tabs
      }
      return [
        // {
        //   id: 0,
        //   title: 'info',
        //   value: 'INFO'
        // },
        // {
        //   id: 2,
        //   title: 'address',
        //   value: 'ADDRESS'
        // },
        {
          id: 3,
          title: 'balance',
          value: 'BALANCE'
        },
        {
          id: 4,
          title: 'transaction',
          value: 'TRANSACTION'
        },
        {
          id: 6,
          title: 'referral',
          value: 'REFERRAL'
        },
        {
          id: 7,
          title: 'bonus',
          value: 'BONUS'
        },
        {
          id: 8,
          title: 'statistics',
          value: 'STATISTICS'
        }
      ]
    }

    get getLevelCurrent(): string {
      const name = this.detailRow?.level
      if (name && name === 'MM') {
        return 'MM'
      } else if (name && name !== 'Default') {
        return this.$t('customer.level', { level: name.match(/\d+/)[0] }) as string
      } else {
        return this.$t('customer.default') as string
      }
    }

    handleOpen(): void {
      this.tabActive = 'BALANCE'
      console.log(window.localStorage.getItem('bc-lang')!)
      this.lang = window.localStorage.getItem('bc-lang')!
      this.listSocial = [
        { social: 'Twitter', userName: this.detailRow.twitter, socialId: this.detailRow.twitter },
        { social: 'Telegram', userName: this.detailRow.telegram, socialId: this.detailRow.telegramId },
        { social: 'Discord', userName: this.detailRow.discord, socialId: this.detailRow.discordId }
      ]
    }

    handleClose(): void {
      this.tabActive = ''
      this.setOpenPopup({
        popupName: 'popup-customer-detail',
        isOpen: false
      })
    }

    async initStatistics(): Promise<any> {
      // this.isLoading = true
      // try {
      //   const result = await apiCustomer.getStatistics(this.detailRow.userId)
      //   this.listStatistics = result.statistics
      //   this.summary = result.summary
      //   this.isLoading = false
      // } catch (e) {
      //   console.log(e)
      // }
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.tabActive = tab.value
      if (tab.value === 'STATISTICS') {
        this.initStatistics()
      }
    }

    handleCopyTransaction(address: string): void {
      this.$emit('copy', 'copy')
      let message: any = ''
      const el = document.createElement('input')
      el.value = address
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }
  }
</script>

<style scoped lang="scss">
  .popup-customer-detail {
    color: var(--bc-text-primary);

    .title-popup {
      span {
        color: #0a0b0d;
      }
    }

    ::v-deep .popup-content {
      background-color: #f6f8fc;

      .content {
        padding-bottom: 24px;

        &__header {
          .avatar {
            img {
              width: 80px;
              height: 80px;
              border-radius: 100px;
              object-fit: cover;
            }
          }

          .info-below {
            &__left {
              width: 316px;
              margin-right: 160px;
            }

            &__right {
              width: 316px;
            }

            .info-item {
              // margin-bottom: 12px;
              position: relative;
              height: 24px;
              line-height: 24px;
              align-items: center;
              margin-bottom: 4px;

              &:last-child {
                margin-bottom: 0;
              }

              .label {
                color: #5b616e;
              }

              .status-verified {
                background-color: transparent;
                position: absolute;
                right: -80px;
                bottom: -2px;
              }
            }
          }
        }

        &__bottom {
          background-color: #fff;
          box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
          border-radius: 4px;

          .tabs {
            border-bottom: 1px solid #d2d0ce;

            .tab-item {
              padding: 16px 12px;
              position: relative;
              color: #5b616e;

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

          .main-content-loading {
            min-height: 200px;
          }
        }
      }
    }
    .icon-copy {
      // margin-left: 8px;
      position: absolute;
      right: -27px;
    }
  }
</style>
