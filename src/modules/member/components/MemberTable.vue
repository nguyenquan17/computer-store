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
        <el-table-column :label="$t('kyc.table.fullName')" min-width="200">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <span class="d-ib mr-2">{{ scope.row.fullName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('kyc.table.email')" prop="email" width="330"></el-table-column>
        <el-table-column :label="$t('kyc.table.role')" prop="roles" width="230">
          <template slot-scope="scope">
            <span>{{ getRole(scope.row.roles) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('kyc.table.date')" prop="createdDate" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | formatDateHourMs }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="kycStatus" align="center" width="80">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.row)">
              <base-icon icon="icon-edit" size="24" />
            </span>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { forEach } from 'lodash'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class MemberTable extends Vue {
    @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    @Prop({ required: true, type: Array, default: [] }) data!: Array<Record<string, any>>

    isConflickClick = false

    get getPaginationInfo(): any {
      return this.$t('paging.member')
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
      if (this.isConflickClick) {
        this.isConflickClick = false
        return
      }
      this.$emit('rowClick', row.row)
    }

    handleEdit(row: Record<string, any>): void {
      this.isConflickClick = true
      this.$emit('edit', row)
    }

    getRole(roles: string[]): string {
      if (roles.length) {
        let roleArr: string[] = []
        forEach(roles, (role: string) => {
          roleArr.push(this.switchRole(role))
        })
        return roleArr.join('; ')
      }
      return ''
    }

    switchRole(role: string): string {
      switch (role) {
        case 'SUPERADMIN':
          return this.$t('member.sort.spadmin') as string
        case 'ADMIN':
          return this.$t('member.sort.admin') as string
        case 'SUPPORT':
          return this.$t('member.sort.support') as string
        case 'MARKETING':
          return this.$t('member.sort.mkt') as string
        case 'BOOKING':
          return this.$t('member.sort.booking') as string
        case 'SETUPNFT':
          return this.$t('member.sort.setupNft') as string
        case 'MARKETPLACEADMIN':
          return this.$t('member.sort.marketplaceAdmin') as string
        default:
          return this.$t('member.sort.accountant') as string
      }
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
</style>
