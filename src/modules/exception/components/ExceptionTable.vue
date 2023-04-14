<template>
  <div class="w-100 bg-white wallet-table">
    <div class="wallet-table__below">
      <base-table
        :data="data"
        :table="query"
        :paginationInfo="getPaginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        @rowClick="handleRowClick"
        class="base-table table-wallet"
      >
        <el-table-column label="#" type="index" :index="indexMethod" align="center" width="60" />
        <!-- <el-table-column :label="$t('kyc.table.fullName')" min-width="200">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <span class="d-ib mr-2">{{ scope.row.fullName + '&nbsp;' + scope.row.lastName }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('transaction.table.trans-id')">
          <template slot-scope="scope">
            <!-- transactionCode -->
            <div class="be-flex align-center">
              <span v-if="scope.row.transactionType === 'CROWDSALE'" class="transaction-code d-ib mr-2">{{ scope.row.transactionCode | formatTransactionCode(10) }}</span>
              <span v-else class="transaction-code d-ib mr-2">{{ scope.row.transactionHash | formatTransactionCode(10) }}</span>

              <span v-if="scope.row.transactionHash || scope.row.transactionCode" class="icon-copy" @click="handleCopyTransaction(scope.row)">
                <base-icon icon="icon-copy" size="24" />
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('transaction.table.date')" prop="transactionDate" :width="type !== 'customer' ? 220 : 200">
          <template slot-scope="scope">
            <span>{{ scope.row.transactionMillisecond | formatMMDDYY }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('transaction.table.CUSTOMER')" width="260">
          <!-- paidAddress -->
          <template slot-scope="scope">
            <div v-if="scope.row.transactionType === 'CROWDSALE'" class="customer">
              <p>{{ scope.row.paidAddress | formatTransactionCode(10) }}</p>
            </div>
            <div v-else class="customer">
              <p>{{ scope.row.fullName }}</p>
              <p style="color: #5b616e; font-size: 14px">{{ scope.row.email }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('transaction.table.status')" prop="status" width="160" align="center">
          <template slot-scope="scope">
            <span class="text-xs" v-if="scope.row.transactionType === 'CROWDSALE'" :class="scope.row.status == 'LOCKED' ? 'status-locked' : 'status-fail'">{{
              checkTransactionStatusCrowdSale(scope.row.status)
            }}</span>
            <span class="text-xs" v-else :class="scope.row.status == 'LOCKED' ? 'status-locked' : 'status-fail'">{{ checkTransactionStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('transaction.table.amount')" width="220" align="right">
          <!-- paidAmountDisplay -->
          <!-- paidAmountToUsd -->
          <template slot-scope="scope">
            <div v-if="scope.row.transactionType === 'CROWDSALE'">
              <div class="amount-increase">
                <span style="color: #cf202f">-{{ scope.row.paidAmountDisplay }} {{ scope.row.paidCurrency }}</span>
                <span class="d-block amount-exchange-small">~${{ scope.row.paidAmountToUsd }}</span>
              </div>
            </div>

            <div v-else>
              <div class="amount-increase">
                <span style="color: #cf202f">-{{ scope.row.amountDisplay }} {{ scope.row.currency }}</span>
                <span class="d-block amount-exchange-small">~${{ scope.row.amountToUsdDisplay }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  @Component
  export default class KycTable extends Vue {
    @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    @Prop({ required: true, type: Array, default: [] }) data!: Array<Record<string, any>>
    get getPaginationInfo(): any {
      return this.$t('paging.transaction')
    }
    checkTabActive = ''
    checkType(type: string): string {
      return type === 'Not verified' ? 'status-not-verified' : type === 'PENDING' ? 'status-pending' : type === 'VERIFIED' ? 'status-verified' : 'status-rejected'
    }
    getDataSelectTab(): void {
      console.log('1')
    }
    // created(): void {
    //   console.log("route", this.$route.name)
    // }

    checkStatus(status: string): any {
      switch (status) {
        case 'PENDING':
          return this.$t('status.pending')
        case 'VERIFIED':
          return this.$t('status.verified')
        default:
          return this.$t('status.rejected')
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
        case 'LOCKED':
          return this.$i18n.t('transaction.table.locked')
        case 'FAILED':
          return this.$i18n.t('exception.fail-ex')
        default:
          return this.$i18n.t('exception.failed-tranfer')
      }
    }
    checkTransactionStatusCrowdSale(status: string): any {
      switch (status) {
        case 'SUCCESS':
          return this.$i18n.t('transaction.table.succsess')
        case 'PENDING':
          return this.$i18n.t('transaction.table.pending')
        case 'PROCESSING':
          return this.$i18n.t('transaction.table.processing')
        case 'REJECTED':
          return this.$i18n.t('transaction.table.rejected')
        case 'LOCKED':
          return this.$i18n.t('transaction.table.locked')
        case 'FAILED':
          return this.$i18n.t('exception.failed-tranfer')
        default:
          return this.$i18n.t('exception.failed-tranfer')
      }
    }
    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    created(): void {
      EventBus.$on('checkRowClick', this.handlecheckRowClick)
    }
    handlecheckRowClick(): void {
      this.coppy = 0
    }
    handleSizeChange(value: number): void {
      this.$emit('sizeChange', value)
    }
    handleCurrentChange(value: number): void {
      this.$emit('pageChange', value)
    }

    handleRowClick(row: Record<string, any>): void {
      this.$emit('coppy', this.coppy)
      this.$emit('rowClick', row)
    }
    coppy = 0
    handleCopyTransaction(row: Record<string, any>): void {
      const copy_data = row.transactionCode
      let message: any = ''
      const el = document.createElement('input')
      el.value = copy_data
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
      this.coppy++
      this.$emit('coppy', this.coppy)
    }
  }
</script>

<style scoped lang="scss">
  .status-fail {
    border-radius: 4px;
    font-size: 12px;
    width: 96px;
    height: 24px;
    line-height: 24px;
    vertical-align: middle;
    display: inline-block;
    text-align: center;
    color: var(--bc-status-reject);
    background-color: var(--bc-bg-reject);
  }
  .status-locked {
    border-radius: 4px;
    font-size: 12px;
    width: 96px;
    height: 24px;
    line-height: 24px;
    vertical-align: middle;
    display: inline-block;
    text-align: center;
    color: #5b616e;
    background-color: #f3f2f1;
  }
  .wallet-table {
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
  }
  .transaction-code {
    min-width: 200px;
  }
</style>
