<template>
  <base-popup name="popup-detail-staking-tx" class="popup-detail-staking-tx" width="600px" :isShowFooter="false">
    <div slot="title">
      <span>REQUEST DETAILS</span>
    </div>
    <div class="content">
      <div class="box">
        <p class="text-base text-semibold">Transaction Details</p>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Transaction ID</div>
          <div class="be-flex align-center">
            <p class="text-base mr-8">{{ row.transactionCode | formatTransactionCode(5) }}</p>
            <span class="cursor icon-copy" @click="handleCopyTransaction(row.transactionCode)">
              <base-icon icon="icon-copy" size="24" />
            </span>
          </div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Date</div>
          <div class="text-base">{{ row.transactionDate | formatMMDDYY }}</div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">From</div>
          <div class="right">
            <div class="be-flex align-center">
              <p class="text-base">{{ row.userEmail }}</p>
            </div>
          </div>
        </div>

        <div class="be-flex row">
          <div class="text-body-small text-desc title">Package name</div>
          <div class="text-base">{{ row.planName }}</div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Token</div>
          <div class="be-flex align-center">
            <base-icon :icon="`icon-${row && row.currency && row.currency.toLowerCase()}`" size="24" class="d-iflex" />
            <p class="text-base ml-8">{{ row.currency }}</p>
          </div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Amount</div>
          <div class="text-base">
            {{ row.amount | convertAmountDecimal(row.currency) }} {{ row.currency }}
            <span class="text-body-small text-desc">(~${{ row.amountUsd | convertAmountDecimal('USD') }})</span>
          </div>
        </div>
      </div>

      <div class="line"></div>

      <div class="box">
        <p class="text-base text-semibold">Investor Info</p>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Name</div>
          <div class="text-base">{{ row.userFullName }}</div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Phone number</div>
          <div class="text-base">({{ row.userCountryCode }}) {{ row.userPhone }}</div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Email</div>
          <div class="text-base">{{ row.userEmail }}</div>
        </div>
      </div>
      <div class="line"></div>
      <div class="box">
        <p class="text-base text-semibold">Package Info</p>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Name</div>
          <div class="text-base">{{ row.planName }}</div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Token</div>
          <div class="be-flex align-center">
            <base-icon :icon="`icon-${row && row.currency && row.currency.toLowerCase()}`" size="24" class="d-iflex" />
            <p class="text-base ml-8">{{ row.currency }}</p>
          </div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Duration</div>
          <div class="text-base">{{ row.durations }} {{ row.durationType | convertTextLowerCase }}{{ row.durations > 1 ? 's' : '' }}</div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">APR</div>
          <div class="text-base">{{ row.aprPercent }}%</div>
        </div>
        <div class="be-flex row">
          <div class="text-body-small text-desc title">Distribution</div>
          <div class="text-base">{{ mapType(row.interestType) }}</div>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { filter } from 'lodash'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const beStaking = namespace('beStaking')
  @Component
  export default class PopupDetailStakingTx extends Vue {
    @Prop({ required: false, type: Object, default: () => ({}) }) row!: Record<string, any>
    @beStaking.State('listInterestType') listInterestType!: Array<Record<string, any>>

    handleCopyTransaction(transactionCode: string): void {
      let message: any = ''
      const el = document.createElement('input')
      el.value = transactionCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }

    mapType(type: string): string {
      const typeItem = filter(this.listInterestType, elm => elm.key === type)
      return typeItem.length ? typeItem[0].value : ''
    }
  }
</script>

<style scoped lang="scss">
  .popup-detail-staking-tx {
    .content {
      .box {
        padding: 24px 0 12px;
        .row {
          padding: 14px 0;
          border-bottom: 1px solid #dbdbdb;
          justify-content: space-between;
          align-items: center;
          .right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
        }
        // .row:nth-child(4) {
        //   align-items: flex-start;
        // }
        .row:last-child {
          border-bottom: none;
        }
      }
      .box:first-child {
        padding-top: 0;
      }
      .line {
        height: 8px;
        background: #f6f8fc;
        margin: 0 -24px;
      }
    }
  }
</style>
