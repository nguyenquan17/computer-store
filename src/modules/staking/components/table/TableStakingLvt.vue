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
    <el-table-column label="#" :index="getIndex" type="index" align="center" width="80" />
    <el-table-column :label="$t('transaction.table.trans-id')" width="180">
      <template slot-scope="scope">
        <div class="transaction-col">
          <div class="be-flex align-center">
            <span class="transaction-code text-hyperlink d-ib mr-2">{{ scope.row.transactionCode | formatTransactionCode(5) }}</span>
            <span v-if="scope.row.transactionCode" class="icon-copy" @click="handleCopyTransaction(scope.row)" ref="buttonCopy">
              <base-icon icon="icon-copy" size="24" />
            </span>
          </div>
          <div class="time">
            <span class="text-body-small text-desc">{{ scope.row.transactionDate | formatMMDDYY }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="INVESTOR" width="250">
      <template slot-scope="scope">
        <p class="text-base text-overflow-1">{{ scope.row.userFullName }}</p>
        <p class="nft-body-small text-overflow-1">{{ scope.row.userEmail }}</p>
      </template>
    </el-table-column>
    <el-table-column label="PACKAGE NAME" width="220">
      <template slot-scope="scope">
        <p class="text-base text-overflow-1">{{ scope.row.planName }}</p>
      </template>
    </el-table-column>
    <el-table-column label="DURATION" width="120">
      <template slot-scope="scope">
        <p class="text-base text-overflow-1">{{ scope.row.durations }} {{ scope.row.durationType | convertTextLowerCase }}{{ scope.row.durations > 1 ? 's' : '' }}</p>
      </template>
    </el-table-column>
    <el-table-column label="APR" width="80">
      <template slot-scope="scope">
        <p class="text-base">{{ scope.row.aprPercent }}%</p>
      </template>
    </el-table-column>

    <el-table-column :label="$t('transaction.table.amount')" align="right">
      <template slot-scope="scope">
        <div class="amount-col">
          <p class="text-base text-overflow-1">{{ scope.row.amount | convertAmountDecimal(scope.row.currency) }} {{ scope.row.currency }}</p>
          <p class="text-body-small text-desc">~${{ scope.row.amountUsd | convertAmountDecimal('USD') }}</p>
        </div>
      </template>
    </el-table-column>
  </base-table>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class TableStakingLvt extends Vue {
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

<style scoped></style>
