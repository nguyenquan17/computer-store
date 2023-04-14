<template>
  <base-table
    :data="listRequest"
    :showPagination="true"
    :table="query"
    :paginationInfo="getPaginationInfo"
    @sizeChange="handleSizeChange"
    @currentChange="handleCurrentChange"
    @rowClick="handleRowClick"
    class="base-table table-request-nft"
  >
    <el-table-column label="#" :index="getIndex" type="index" align="center" width="80" />
    <el-table-column :label="$t('table_investor')" width="330">
      <template slot-scope="scope">
        <p class="text-base">{{ scope.row.accountName }}</p>
        <p class="text-desc text-body-small">{{ scope.row.accountUsername }}</p>
      </template>
    </el-table-column>

    <el-table-column :label="$t('table_item')">
      <template slot-scope="scope">
        <div class="be-flex wrap-item">
          <img :src="scope.row.itemThumb" alt="" />
          <div class="ml-8">
            <p class="text-base text-overflow-1">{{ scope.row.itemName }}</p>
            <p class="text-desc text-body-small text-overflow-1">#{{ scope.row.itemCode }}</p>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column :label="$t('table_quantity')" align="right" prop="quantity" width="135" />
    <el-table-column :label="$t('table_note')">
      <template slot-scope="scope">
        <p v-if="$route.params.type === 'pending'" class="text-base text-overflow-2">{{ scope.row.note }}</p>
        <p v-else-if="$route.params.type === 'processing'" class="text-base text-overflow-2" v-html="scope.row.description"></p>
        <p v-else class="text-base text-overflow-2" v-html="scope.row.emailContent"></p>
      </template>
    </el-table-column>
    <el-table-column :label="$t('table_status')" align="center" width="160">
      <template slot-scope="scope">
        <span :class="checkType(scope.row.dispStatus)">{{ checkStatus(scope.row.dispStatus) }}</span>
      </template>
    </el-table-column>
  </base-table>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class TableRequestNft extends Vue {
    @Prop({ required: false, type: Array, default: [] }) listRequest!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>

    get getPaginationInfo(): any {
      return this.$t('paging.request')
    }

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
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

    checkType(type: string): string {
      switch (type) {
        case 'PENDING':
          return 'status-pending'
        case 'COMPLETED':
          return 'status-verified'
        case 'CANCELLED':
          return 'status-rejected'
        default:
          return 'status-progressing'
      }
    }

    checkStatus(status: string): any {
      switch (status) {
        case 'PENDING':
          return this.$t('status.pending')
        case 'COMPLETED':
          return this.$t('status.completed')
        case 'CANCELLED':
          return this.$t('status.canceled')
        default:
          return this.$t('status.processing')
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.table-request-nft {
    padding: 0 24px;
    .wrap-item {
      img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
</style>
