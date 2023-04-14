<template>
  <base-table
    :data="data"
    :showPagination="true"
    :table="query"
    paginationInfo="transactions"
    @sizeChange="handleSizeChange"
    @currentChange="handleCurrentChange"
    @rowClick="handleRowClick"
    class="base-table table-trans-nft"
  >
    <el-table-column :label="$t('transaction.table.date')" width="150">
      <template slot-scope="scope">
        <div class="transaction-col">
          <div class="time">
            <span class="text-base text-primary text-regular">{{ scope.row.date | formatMMDDYYWithoutHour }}</span>
          </div>
          <div class="time">
            <span class="text-body-small text-desc text-regular">{{ new Date(scope.row.date).toLocaleTimeString('vi-VN') }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="SALES" width="220">
      <template slot-scope="scope">
        <p class="text-base text-primary text-regular">{{ scope.row.salesName }}</p>
        <p class="text-body-small text-desc text-regular">{{ scope.row.salesRefCode }}</p>
      </template>
    </el-table-column>
    <el-table-column label="ITEM" width="200">
      <template slot-scope="scope">
        <div class="wrap-item">
          <img :src="scope.row.itemAvatar" alt="" class="item-img" width="40px" height="40px" />
          <div class="item-text">
            <p class="item-text__name text-overflow-1">{{ scope.row.itemName }}</p>
            <p class="text-body-small text-desc text-regular text-overflow-1">#{{ scope.row.itemCode }}</p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('transaction.table.amount')" align="right">
      <template slot-scope="scope">
        <div class="amount-col">
          <p class="text-base text-overflow-1 text-primary text-regular">${{ scope.row.amount | convertAmountDecimal('USD') }}</p>
          <p class="text-body-small text-desc">{{ scope.row.quantity | formatNumber }} pieces</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="% USDT" align="right">
      <template slot-scope="scope">
        <div class="amount-col">
          <p class="text-base text-overflow-1 text-primary text-regular">{{ scope.row.usdtCommission | convertAmountDecimal('USDT') }} USDT</p>
          <p class="text-body-small text-desc">~ ${{ scope.row.usdtCommissionUsd | convertAmountDecimal('USD') }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="% LYNK" align="right">
      <template slot-scope="scope">
        <div class="amount-col">
          <p class="text-base text-overflow-1">{{ scope.row.lynkCommission | convertAmountDecimal('LYNK') }} LYNK</p>
          <p class="text-body-small text-desc">~ ${{ scope.row.lynkCommissionUsd | convertAmountDecimal('USD') }}</p>
        </div>
      </template>
    </el-table-column>
  </base-table>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class TableCommission extends Vue {
    @Prop({ required: false, type: Array, default: () => [] }) data!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>
    @Prop({ required: false, type: String, default: '' }) tabActive!: string

    isConflictClick = false

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    handleCopyTransaction(row: Record<string, any>): void {
      this.isConflictClick = true
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

    handleSizeChange(value: number): void {
      this.$emit('sizeChange', value)
    }

    handleCurrentChange(value: number): void {
      this.$emit('pageChange', value)
    }

    handleRowClick(row: Record<string, any>): void {
      if (this.isConflictClick) {
        this.isConflictClick = false
        return
      }
      this.$emit('rowClick', row.row)
    }
  }
</script>

<style scoped lang="scss">
  .wrap-item {
    display: flex;
    align-items: center;
    gap: 8px;
    .item-img {
      border-radius: 4px;
      object-fit: cover;
    }
    .item-text {
    }
  }
</style>
