<template>
  <base-table
    :data="listTransaction"
    :showPagination="true"
    :table="query"
    :paginationInfo="getPaginationInfo"
    @sizeChange="handleSizeChange"
    @currentChange="handleCurrentChange"
    @rowClick="handleRowClick"
    class="base-table"
  >
    <el-table-column label="#" :index="getIndex" type="index" align="center" :width="type !== 'customer' ? 80 : 60" />
    <el-table-column :label="$t('transaction.table.trans-id')">
      <template slot-scope="scope">
        <div class="be-flex align-center">
          <span v-if="type === 'customer'" class="d-ib mr-2">{{ scope.row.transactionCode | formatTransactionCode(6) }}</span>
          <span v-else class="transaction-code d-ib mr-2">{{ scope.row.transactionCode | formatTransactionCode(10) }}</span>
          <span v-if="scope.row.transactionCode" class="icon-copy" @click="handleCopyTransaction(scope.row)" ref="buttonCopy">
            <base-icon icon="icon-copy" size="24" />
          </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column v-if="type === 'customer'" :label="$t('transaction.table.type')" prop="transactionType" width="154">
      <template slot-scope="scope">
        <span>{{ checkTransactionType(scope.row.transactionType) }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.table.date')" prop="transactionDate" :width="type !== 'customer' ? 220 : 200">
      <template slot-scope="scope">
        <span>{{ scope.row.transactionMillisecond | formatMMDDYY }}</span>
      </template>
    </el-table-column>
    <!-- && this.tabActive !== 'staking' -->
    <el-table-column v-if="type !== 'customer'" :label="$t('transaction.table.CUSTOMER')" prop="transactionDate" width="260">
      <template slot-scope="scope">
        <div class="customer">
          <p>{{ scope.row.fullName }}</p>
          <p>{{ scope.row.email }}</p>
        </div>
      </template>
    </el-table-column>
    <!-- <el-table-column v-if="type !== 'customer' && this.tabActive === 'staking'" :label="$t('transaction.table.NFT')" prop="transactionDate" width="260">
      <template slot-scope="scope">
        <div class="customer">
          <p>{{ scope.row.fullName }}</p>
          <p>{{ scope.row.email }}</p>
        </div>
      </template>
    </el-table-column> -->
    <el-table-column :label="$t('transaction.table.status')" prop="status" :width="type !== 'customer' ? 144 : 120" align="center">
      <template slot-scope="scope">
        <span class="text-xs" :class="checkType(scope.row.status)">{{ checkTransactionStatus(scope.row.status) }}</span>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.table.amount')" align="right" :width="type !== 'customer' ? 200 : 190">
      <template slot-scope="scope">
        <div v-if="type === 'customer'">
          <div v-if="scope.row.creditAmount" class="amount-increase">
            <span>+{{ scope.row.transactionAmount | convertAmountDecimal(scope.row.creditCurrency) }} {{ scope.row.creditCurrency }}</span>
            <span class="d-block amount-exchange-small">~${{ scope.row.transactionAmountToUsd | convertAmountDecimal('USD') }}</span>
          </div>
          <div v-else class="amount-decrease">
            <span>-{{ scope.row.debitAmount | convertAmountDecimal(scope.row.debitCurrency) }} {{ scope.row.debitCurrency }}</span>
            <span class="d-block amount-exchange-small">~${{ scope.row.debitAmountToUsd | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
        <div v-else>
          <div class="amount-increase">
            <span :class="checkValueAmountDisplay(scope.row.amountDisplay)">{{ scope.row.amountDisplay }}</span>
            <span class="d-block amount-exchange-small">~${{ scope.row.amountToUsd | convertAmountDecimal('USD') }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
  </base-table>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class TableTransaction extends Vue {
    @Prop({ required: false, type: Array, default: [] }) listTransaction!: Record<string, any>[]
    @Prop({ required: false, type: Object, default: {} }) query!: Record<string, any>
    @Prop({ required: false, type: String, default: 'deposit' }) tabActive!: string
    @Prop({ required: false, type: String, default: 'customer' }) type!: string

    get getPaginationInfo(): any {
      return this.$t('paging.transaction')
    }

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    checkTransactionType(type: string): any {
      switch (type) {
        case 'DEPOSIT':
          return this.$i18n.t('transaction.table.deposit')
        case 'WITHDRAW':
          return this.$i18n.t('transaction.table.withdraw')
        case 'TRANSFER':
          return this.$i18n.t('transaction.table.transfer')
        case 'CROWDSALE':
          return this.$i18n.t('transaction.table.crowdsale')
        case 'BUY':
          return this.$i18n.t('transaction.table.buy')
        case 'BONUS_SIGN_UP':
          return this.$i18n.t('transaction.table.bonus-sign-up')
        case 'BONUS_CROWDSALE':
          return this.$i18n.t('transaction.table.bonus-crowdsale')
        case 'BONUS_FIRST_TRANS':
          return this.$i18n.t('transaction.table.bonus-first-trans')
        case 'BONUS_AFFILIATE':
          return this.$i18n.t('transaction.table.bonus-affiliate')
        case 'BONUS_BIG_BACKER':
          return this.$i18n.t('transaction.table.bonus-big-backer')
        case 'BONUS_EARLY_BACKER':
          return this.$i18n.t('transaction.table.bonus-early-backer')
        case 'BONUS_SIGN_UP_REFERRAL':
          return this.$i18n.t('transaction.table.bonus-sign-up-referral')
        case 'NFT_SALE':
          return this.$i18n.t('transaction.table.nft-sale')
        case 'NFT_TRANSFER':
          return this.$i18n.t('transaction.table.nft-transfer')
        case 'ROYALTIES_FEE':
          return this.$i18n.t('transaction.table.royalties-fee')
        default:
          // return this.$i18n.t('transaction.table.sell')
          return this.$options.filters?.capitalizeFirstLetter(type)
      }
    }

    checkTransactionStatus(status: string): any {
      switch (status) {
        case 'SUCCESS':
          return this.$i18n.t('transaction.table.succsess')
        case 'PENDING':
          return this.$i18n.t('transaction.table.pending')
        case 'PROCESSING':
          return this.$i18n.t('transaction.table.processing')
        case 'REJECTED':
          return this.$i18n.t('transaction.table.rejected')
        // case 'FAILED':
        //   return this.$i18n.t('transaction.table.failed')

        default:
          return this.$i18n.t('transaction.table.failed')
      }
    }

    checkType(type: string): string {
      return type === 'PENDING'
        ? 'status status-pending'
        : type === 'FAILED'
        ? 'status status-error'
        : type === 'PROCESSING'
        ? 'status status-warning'
        : type === 'REJECTED'
        ? 'status status-rejected'
        : 'status status-success'
    }

    handleCopyTransaction(row: Record<string, any>): void {
      this.$emit('copy', 'copy')
      let message: any = ''
      const el = document.createElement('input')
      el.value = row.transactionCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }

    checkValueAmountDisplay(value: string | null): string {
      if (value) {
        if (value.indexOf('+') !== -1) {
          return 'add'
        } else {
          return 'sub'
        }
      } else return ''
    }

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
  .status {
    // padding: 4px 7px;
    border-radius: 4px;
  }

  .add {
    color: #129961;
  }

  .sub {
    color: #cf202f;
  }

  .customer {
    p:first-of-type {
      font-family: Open Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      color: #0a0b0d;
    }

    p:last-of-type {
      font-family: Open Sans;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: #5b616e;
      border-bottom: none;
    }
  }

  .transaction-code {
    min-width: 200px;
  }
</style>
