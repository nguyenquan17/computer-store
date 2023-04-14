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
        <el-table-column label="#" type="index" :index="indexMethod" align="center" width="80" />
        <el-table-column :label="$t('transaction.table.trans-id')">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <!-- <span v-if="type === 'customer'" class="d-ib mr-2">{{ scope.row.transactionHash | formatTransactionCode(6) }}</span> -->
              <span class="transaction-code d-ib mr-2">{{ scope.row.transactionHash | formatTransactionCode(10) }}</span>
              <span v-if="scope.row.transactionHash" class="icon-copy" @click.stop="handleCopyTransaction(scope.row)" ref="buttonCopy">
                <base-icon icon="icon-copy" size="24" />
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('transaction.table.date')" prop="transactionDate" :width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.transactionMillisecond | formatMMDDYY }}</span>
          </template>
        </el-table-column>

        <el-table-column  :label="$t('transaction.table.CUSTOMER')" width="260">
          <template slot-scope="scope">
            <div class="customer">
              <p>{{ scope.row.fullName }}</p>
              <p style="font-size: 14px; color: #5b616e; line-height: 20px;">{{ scope.row.email }}</p>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column :label="$t('transaction.table.status')" :width="144" align="center">
          <template slot-scope="scope">
            <span class="text-xs" :class="checkType(scope.row.status)">{{ handleCapitalize(scope.row.status) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('fee.table.fee')" align="right" :width="200" prop="transactionFee">
          <template slot-scope="scope">
            <!-- <div v-if="type === 'customer'">
              <div v-if="scope.row.creditAmount" class="amount-increase">
                <span>+{{ scope.row.creditAmount | convertAmountDecimal(scope.row.creditCurrency) }} {{ scope.row.creditCurrency }}</span>
                <span class="d-block amount-exchange-small">~${{ (scope.row.creditAmount * scope.row.creditUsdExchangeRate) | convertAmountDecimal('USD') }}</span>
              </div>
              <div v-else class="amount-decrease">
                <span>-{{ scope.row.debitAmount | convertAmountDecimal(scope.row.debitCurrency) }} {{ scope.row.debitCurrency }}</span>
                <span class="d-block amount-exchange-small">~${{ (scope.row.debitAmount * scope.row.debitUsdExchangeRate) | convertAmountDecimal('USD') }}</span>
              </div>
            </div> -->
            <div>
              <div class="amount-increase">
                <span :class="checkValueFeeDisplay(scope.row.transactionFee)">
                  {{ scope.row.transactionFeeDisplay.index}}
                  {{ scope.row.transactionFeeDisplay }}
                </span>
                <span class="d-block amount-exchange-small">~${{ scope.row.transactionFeeToUsd | convertAmountDecimal('USD') }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { any } from '@amcharts/amcharts4/.internal/core/utils/Array'
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class FeeTable extends Vue {
    @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    @Prop({ required: true, type: Array, default: [] }) data!: Array<Record<string, any>>
    @Prop() propTabActive!: string

    get getPaginationInfo(): any {
      return this.$t('paging.transaction')
    }

    
    checkType(typeCheck: string): string {
      const result = typeCheck === 'PENDING' ? 'status status-pending'
        : (typeCheck === 'FAILED' || typeCheck === 'LOCKED' || typeCheck === 'WAITING' || typeCheck === 'EXPIRED')
        ? 'status status-error'
        : typeCheck === 'PROCESSING'
        ? 'status status-warning'
        : typeCheck === 'REJECTED'
        ? 'status status-rejected'
        : 'status status-success'
        return result
    }
    getDataSelectTab(): void {
      console.log('1')
    }
    created(): void {
      // EventBus.$on('pushAvatar', url => {
      //   this.image = url
      // })
      
    }
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
     checkValueAmountDisplay(value: string | null): string {
      if (value) {
        if (value.indexOf('+') !== -1) {
          return 'add'
        } else {
          return 'sub'
        }
      } else return ''
    }
    checkValueFeeDisplay(value: number | null): string {
      if(value) {
        return value >= 0 ? 'add' : 'sub'
       }
      else {
        return ''
      }
    }
    handleCopyTransaction(row: Record<string, any>): void {
      this.$emit('copy', 'copy')
      let message: any = ''
      const el = document.createElement('input')
      el.value = row.transactionHash
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }
    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
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
    handleCapitalize(status: string): string {
      let result: string | any = ''
      switch(status) {
        case 'SUCCESS': 
          result = this.$i18n.t('fee.status.success')
          break;
        case 'PENDING':
          result = this.$i18n.t('fee.status.pending')
          break;
        case 'FAILED':
          result = this.$i18n.t('fee.status.failed')
          break;
        case 'REJECTED':
          result =this.$i18n.t('fee.status.reject')
          break;
        case 'PROCESSING':
          result = this.$i18n.t('fee.status.processing')
          break;
        case 'LOCKED':
          result = this.$i18n.t('fee.status.locked')
          break;
        case 'WAITING':
          result =this.$i18n.t('fee.status.waiting')
          break;
        case 'EXPIRED':
          result = this.$i18n.t('fee.status.expired')
          break;
      }
      return result
    }
  }
</script>

<style scoped lang="scss">
  .add {
    color: #129961;
  }

  .sub {
    color: #cf202f;
  }
  .transaction-code {
    width: 200px;
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
</style>
