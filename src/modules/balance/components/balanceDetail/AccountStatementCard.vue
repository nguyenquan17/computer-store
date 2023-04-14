<template>
  <div class="w-100 bg-white wallet-table-balance">
    <div class="title-popup" slot="title">
      <span style="font-weight: 600">{{ $t('balance.popup.account-statement') }}</span>
    </div>
    <div class="opening-balance be-flex jc-space-between">
      <p>{{ $t('balance.popup.opening-balance') }}</p>
      <p>{{ summary.openBalance }} {{ this.tabActiveFilter.toUpperCase() }}</p>
    </div>
    <div v-loading="isLoading" class="wallet-table-balance__below">
      <base-table
        :data="data"
        :table="query"
        :paginationInfo="getPaginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        @rowClick="handleRowClick"
        class="base-table table-wallet"
      >
        <el-table-column :label="$t('balance.popup.type')" :width="language === 'vi' ? '220' : '200'" prop="transactionType">
          <template slot-scope="scope">
            <p style="font-size: 16px">{{ checkRowType(scope.row.transactionType) }}</p>
            <p style="color: #5b616e; font-size: 14px">{{ scope.row.transactionMillisecond | formatMMDDYY }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('balance.popup.credit')" align="right" prop="creditAmountDisplay">
          <template slot-scope="scope">
            <span v-if="scope.row.creditAmount === 0" style="color: #129961; font-size: 16px"> </span>
            <span v-else style="color: #129961; font-size: 16px">+{{ scope.row.creditAmountDisplay }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('balance.popup.debit')" align="right" prop="debitAmountDisplay">
          <template slot-scope="scope">
            <span v-if="scope.row.debitAmount === 0" style="color: #cf202f; font-size: 16px"></span>
            <span v-else style="color: #cf202f; font-size: 16px">{{ scope.row.debitAmountDisplay }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('balance.popup.balance')" align="right" prop="balanceDisplay"></el-table-column>
        <el-table-column :label="$t('balance.popup.status')" align="center" width="144" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status !== 'FAILED'" :class="checkType(scope.row.status)">{{ checkStatus(scope.row.status) }}</span>
            <span v-else class="status-locked">{{ $t('status.failed') }}</span>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <div class="total be-flex">
      <div class="total-title" v-bind:style="language === 'vi' ? 'width:204px' : 'width:186px'">
        {{ $t('balance.popup.total') }}
      </div>
      <p class="credit" v-if="summary.totalCreditAmount === '0'">0 {{ this.tabActiveFilter.toUpperCase() }}</p>
      <p class="credit" v-else>+ {{ summary.totalCreditAmount | abbreviateNumberWithCurrency(1, 10 ** 6, this.tabActiveFilter) }} {{ this.tabActiveFilter.toUpperCase() }}</p>
      <p v-if="summary.totalDebitAmount === '0'">0 {{ this.tabActiveFilter.toUpperCase() }}</p>
      <p v-else>-{{ summary.totalDebitAmount | abbreviateNumberWithCurrency(1, 10 ** 6, this.tabActiveFilter) }} {{ this.tabActiveFilter.toUpperCase() }}</p>
    </div>
    <div class="ending-balance be-flex jc-space-between">
      <p>{{ $t('balance.popup.ending-balance') }}</p>
      <p v-if="summary.closeBalance === '0'">0 {{ this.tabActiveFilter.toUpperCase() }}</p>
      <p v-else>{{ summary.closeBalance | numberWithCommas }} {{ this.tabActiveFilter.toUpperCase() }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { formatType } from '@/configs'
  import { namespace } from 'vuex-class'

  const beBase = namespace('beBase')
  @Component
  export default class AccountStatementCard extends Vue {
    @Prop({ required: true, type: Array, default: [] }) data!: Array<Record<string, any>>
    @Prop({ required: true }) summary!: Record<string, any>
    @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    @Prop({}) isLoading!: boolean
    @Prop({ required: true }) tabActiveFilter!: string

    get getPaginationInfo(): any {
      return this.$t('paging.transaction')
    }

    language = ''

    created() {
      if (window.localStorage.getItem('bc-lang')) {
        this.language = window.localStorage.getItem('bc-lang') as string
      }
    }

    checkType(type: string): string {
      switch (type) {
        case 'PENDING':
          return 'status-pending'
        case 'SUCCESS':
          return 'status-verified'
        case 'PROCESSING':
          return 'status-pending'

        default:
          return 'status-rejected'
      }
    }

    getDataSelectTab(): void {
      console.log('1')
    }

    checkRowType(type: string) {
      switch (type) {
        case 'WITHDRAW':
          return this.$i18n.t('balance.popup.crow-type.withdraw')
        case 'DEPOSIT':
          return this.$i18n.t('balance.popup.crow-type.deposit')
        case 'TRANSFER':
          return this.$i18n.t('balance.popup.crow-type.transfer')
        case 'CROWDSALE':
          return this.$i18n.t('balance.popup.crow-type.crowdsale')
        case 'BONUS_EARLY_BACKER':
          return this.$i18n.t('balance.popup.crow-type.bonus-early-backers')
        case 'BONUS_BIG_BACKER':
          return this.$i18n.t('balance.popup.crow-type.bonus-big-backers')
        case 'BONUS_AFFILIATE':
          return this.$i18n.t('balance.popup.crow-type.bonus-affiliate')
        case 'BONUS_FIRST_TRANS':
          return this.$i18n.t('balance.popup.crow-type.bonus-first-trans')
        case 'BONUS_CROWDSALE':
          return this.$i18n.t('balance.popup.crow-type.bonus-crowdsale')
        case 'BONUS_SIGN_UP':
          return this.$i18n.t('balance.popup.crow-type.bonus-sign-up')
        case 'NFT_SALE':
          return this.$i18n.t('balance.popup.crow-type.nft-sale')
        case 'NFT_TRANSFER':
          return this.$i18n.t('balance.popup.crow-type.nft-transfer')
        case 'ROYALTIES_FEE':
          return this.$i18n.t('balance.popup.crow-type.royalties-fee')
        default:
          return type.charAt(0).toUpperCase() + type.toLocaleLowerCase().slice(1)
      }
    }

    checkStatus(status: string): any {
      switch (status) {
        case 'SUCCESS':
          return this.$i18n.t('status.success')
        case 'PENDING':
          return this.$i18n.t('status.pending')
        case 'PROCESSING':
          return this.$i18n.t('status.processing')
        default:
          return this.$i18n.t('status.failed')
      }
    }

    // indexMethod(index: number): number {
    //   return (this.query.page - 1) * this.query.limit + index + 1
    // }

    handleSizeChange(value: number): void {
      this.$emit('sizeChange', value)
    }

    handleCurrentChange(value: number): void {
      this.$emit('pageChange', value)
    }

    handleRowClick(row: Record<string, any>): void {
      this.$emit('rowClick', row.row)
    }
  }
</script>

<style scoped lang="scss">
  .wallet-table-balance {
    padding-bottom: 24px;

    &__above {
      border-bottom: 1px solid var(--bc-border-primary);

      &-tabs {
        .tab-item {
          padding: 16px 12px;
          position: relative;

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
      padding: 0 24px;

      .table-wallet {
        .amount-decrease {
          color: var(--bc-status-error);
        }

        .amount-increase {
          color: var(--bc-status-success);
        }
      }
    }

    .title-popup {
      padding: 24px;
      font-size: 24px;
      color: #0a0b0d;
    }

    .opening-balance {
      background-color: #f3f2f1;
      padding: 12px 16px;
      margin: 0 24px;

      p {
        font-size: 16px;
        color: #0a0b0d;
        font-weight: 600;
      }

      p:last-of-type {
        margin-right: 144px;
      }
    }

    .total {
      margin: 0 24px;
      background-color: #f3f2f1;
      padding: 12px 16px;

      .total-title {
        width: 188px;
        font-size: 16px;
        color: #0a0b0d;
        font-weight: 600;
      }

      p {
        width: 194px;
        font-size: 16px;
        color: #0a0b0d;
        font-weight: 600;
        text-align: right;
        word-wrap: break-word;
        word-break: break-word;
      }

      .credit {
        width: 186px !important;
      }

      p:last-of-type {
        margin-right: 144px;
      }
    }

    .ending-balance {
      margin: 8px 24px 0 24px;
      border-radius: 4px;
      background-color: #0151fc;
      padding: 12px 16px;

      p {
        font-size: 16px;
        color: #ffffff;
        font-weight: 600;
      }

      p:last-of-type {
        margin-right: 144px;
      }
    }
  }
</style>
