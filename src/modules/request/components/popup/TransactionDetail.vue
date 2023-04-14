<template>
  <div class="content-transaction be-flex jc-space-between">
    <div class="box-left">
      <div class="be-flex align-center" style="margin-bottom: 20px">
        <base-icon class="icon" icon="icon-document" size="24"></base-icon>
        <span class="big-title fw-600 fs-16">{{ $t('request.popup.transaction.bigTitle1') }}</span>
      </div>
      <div class="mini-box be-flex align-center jc-space-between">
        <div class="left">{{ $t('request.popup.transaction.label1') }}</div>
        <div class="right fs-16">{{ data.transactionDate | formatMMDDYY }}</div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between">
        <div class="left">{{ $t('request.popup.transaction.label2') }}</div>
        <div class="right">
          <base-icon :icon="getIcon(data.currency)" size="20" class="mini-icon"></base-icon>
          <span style="margin-right: 9px" class="fs-16">{{ data.fromAddress | formatTransactionCode }}</span
          ><span class="icon-copy" @click="handleCopyTransaction(data.fromAddress)">
            <base-icon icon="icon-copy" size="20" />
          </span>
        </div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between">
        <div class="left">{{ $t('request.popup.transaction.label3') }}</div>
        <div class="right">
          <base-icon :icon="getIcon(data.currency)" size="20" class="mini-icon"></base-icon>
          <span style="margin-right: 9px" class="fs-16">{{ data.toAddress | formatTransactionCode }}</span
          ><span class="icon-copy" @click="handleCopyTransaction(data.toAddress)">
            <base-icon icon="icon-copy" size="20" />
          </span>
        </div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between">
        <div class="left">{{ $t('request.popup.transaction.label4') }}</div>

        <div class="right">
          <span class="fee">-{{ data.transactionFee | convertAmountDecimal(data.currency) }} {{ data.currency }} </span>
          <span class="dolar">(~${{ (data.tokenUsdExchangeRate * data.transactionFee) | convertAmountDecimal('USD') }})</span>
        </div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between">
        <div class="left">{{ $t('request.popup.transaction.label5') }}</div>
        <div class="right">
          <div class="status" :class="data.status != 'PENDING' ? 'rejected' : null">{{ getStatus(data.status) }}</div>
        </div>
      </div>
      <!-- <div v-if="this.data.rejectedReason" class="line"></div> -->
      <div
        v-if="data.rejectedReason"
        :style="data.rejectedReason && data.rejectedReason.length > 38 ? 'padding:12px 0' : ''"
        class="mini-box be-flex align-center jc-space-between mini-box--reason"
      >
        <div class="left">{{ $t('request.popup.transaction.label12') }}</div>
        <div class="right">
          {{ data.rejectedReason }}
        </div>
      </div>
    </div>
    <div class="box-right">
      <div class="be-flex align-center" style="margin-bottom: 20px">
        <base-icon class="icon" icon="icon-user" size="24"></base-icon>
        <span class="big-title fw-600 fs-16">{{ $t('request.popup.transaction.bigTitle2') }}</span>
      </div>
      <div class="mini-box be-flex align-center jc-space-between mini-box1">
        <div class="left">{{ $t('request.popup.transaction.label6') }}</div>
        <div class="right fs-16">{{ dataUser.fullName }}</div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between mini-box2">
        <div class="left">{{ $t('request.popup.transaction.label7') }}</div>
        <div class="right">
          <span class="plus" v-if="dataUser.countryCode">({{ dataUser.countryCode }})</span> {{ dataUser.phone }}
        </div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between mini-box3">
        <div class="left">{{ $t('request.popup.transaction.label8') }}</div>
        <div class="right">{{ dataUser.email }}</div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between mini-box4">
        <div class="left">{{ $t('request.popup.transaction.label9') }}</div>
        <div class="right">{{ dataUser.country }}</div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between mini-box5">
        <div class="left">{{ $t('request.popup.transaction.label10') }}</div>
        <div class="right">{{ getLevelCurrent }}</div>
      </div>

      <div class="mini-box be-flex align-center jc-space-between">
        <div class="left">{{ $t('request.popup.transaction.label11') }}</div>
        <div class="right">{{ dataUser.createdDate | formatMMDDYY }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class TransactionDetail extends Mixins(PopupMixin) {
    @Prop() data!: any
    @Prop() dataUser!: any

    get getLevelCurrent(): string {
      const name = this.dataUser?.level
      if (name && name !== 'Default') {
        return this.$t('customer.level', { level: name.match(/\d+/)[0] }) as string
      }
      return this.$t('customer.default') as string
    }

    getIcon(currency: string): void {
      let icon: any = ''
      if (currency) {
        icon = `icon-${currency.toLowerCase()}`
      }
      return icon
    }
    getLavel(level: string | any): void {
      let name: any = ''
      if (level) {
        name = level.toLowerCase()
      }
      return name
    }
    handleCopyTransaction(string: any): void {
      if (string) {
        let message: any = ''
        const el = document.createElement('input')
        el.value = string
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        message = this.$t('notify.copy')
        this.$message.success(message)
      }
    }
    getStatus(status: string): string {
      let string: any = ''
      if (status === 'PENDING') {
        string = this.$t('request.filter.pending')
      }
      if (status === 'REJECTED') {
        string = this.$t('request.filter.rejected')
      }
      return string
    }
  }
</script>

<style scoped lang="scss">
  .content-transaction .mini-box .left {
    /* color: red; */
    width: 150px;
    margin-right: 10px;
    word-break: break-word;
  }
  .content-transaction .mini-box .right {
    font-size: 16px;
    word-break: break-word;
  }
  .content-transaction {
    min-height: 316px;
    .icon {
      position: absolute;
      top: -7px;
      left: 0px;
    }
    .mini-box {
      height: 48px;
      border-bottom: 1px solid #dbdbdb;
      .left {
        color: #5b616e;
      }
      .status {
        width: 80px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        background: #fff3e2;
        color: #dd7d00;
        font-weight: 400;
        font-size: 12px;
        border-radius: 4px;
      }
      .rejected {
        background: #fbedee;
        color: #cf202f;
      }
      .right {
        font-size: 16px;
        .fee {
          color: #cf202f;
          font-weight: 400;
          font-size: 14px;
        }
        .dolar {
          font-size: 12px;
          font-weight: 400;
          color: #5b616e;
        }
        .mini-icon {
          margin-right: 8px;
        }
        .icon-copy {
          cursor: pointer;
        }
      }
    }
    .line {
      border-bottom: 1px solid #dbdbdb;
      margin-bottom: 16px;
    }
    .box-left {
      position: relative;
      min-width: 369px;
      padding-left: 28px;
      padding-right: 28px;
      min-height: 316px;
    }
    .box-right {
      padding-left: 28px;
      padding-right: 28px;
      min-width: 369px;
      position: relative;
      min-height: 316px;
      // .mini-box1 {
      //   margin-bottom: 13px;
      // }
      // .mini-box2 {
      //   margin-top: 22px;
      //   margin-bottom: 13px;
      // }
      // .mini-box3 {
      //   margin-top: 20px;
      //   margin-bottom: 18px;
      // }
      // .mini-box4 {
      //   margin-bottom: 10px;
      // }
      // .mini-box5 {
      //   margin-bottom: 17px;
      // }
    }
  }
  .mini-box--reason {
    min-height: 48px;
    height: auto !important;
    // padding: 12px 0;
    .left {
      flex-basis: 20% !important;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
