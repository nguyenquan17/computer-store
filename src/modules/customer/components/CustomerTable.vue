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
        <el-table-column key="1" label="#" type="index" :index="indexMethod" align="center" width="80" />
        <el-table-column key="2" label="name">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <span class="d-ib mr-2 text-overflow-1">{{ scope.row.fullName }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- email address / wallet address -->

        <el-table-column key="3" :label="$t('kyc.table.email')" prop="email" :width="isSmallScreen ? 230 : 300">
          <template slot-scope="scope">
            <p class="text-overflow-1">{{ scope.row.email }}</p>
          </template>
        </el-table-column>
        <el-table-column key="4" label="Address" prop="address" :width="isSmallScreen ? 200 : 300">
          <template slot-scope="scope">
            <div class="flex align-center jc-space-between">
              <div class="text-add">{{ scope.row.username | formatTransactionCode(isSmallScreen ? 5 : 10, isSmallScreen ? 5 : 10) }}</div>
              <div class="cursor icon-copy" @click="handleCopyTransaction(scope.row.username)">
                <base-icon icon="icon-copy" size="24" />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column key="5" label="level" prop="level" :width="isSmallScreen ? 100 : 150">
          <template slot-scope="scope">
            <span>{{ getLevelCurrent(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column key="6" :label="$t('kyc.table.date')" prop="createdDate" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateHourMs }}</span>
          </template>
        </el-table-column>
        <el-table-column key="7" label="status" prop="emailVerified" align="center" :width="isSmallScreen ? 140 : 160">
          <template slot-scope="scope">
            <span :class="checkType(scope.row.emailVerified)">{{ checkStatus(scope.row.emailVerified) }}</span>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')

  @Component
  export default class CustomerTable extends Vue {
    @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    @Prop({ required: true, type: Array, default: [] }) data!: Array<Record<string, any>>

    get getPaginationInfo(): any {
      return this.$t('paging.customers')
    }

    get isSmallScreen(): boolean {
      return window.innerWidth < 1400
    }

    getLevelCurrent(row: Record<string, any>): string {
      try {
        if (row.level && row.level === 'MM') {
          return 'MM'
        } else if (row.level !== 'Default') {
          return this.$t('customer.level', { level: row.level.match(/\d+/)[0] }) as string
        } else {
          return this.$t('customer.default') as string
        }
      } catch (error) {
        console.log('error', row.level)
        return ''
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

    checkType(type: string): string {
      switch (type) {
        case '1':
          return 'status-verified'
        default:
          return 'status-not-verified'
      }
    }

    checkStatus(status: string): any {
      switch (status) {
        case '1':
          return this.$t('status.verified')

        default:
          return this.$t('status.unverified')
      }
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
  }
</script>

<style scoped lang="scss">
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
  .icon-copy {
    margin-right: 40px;
  }
</style>
