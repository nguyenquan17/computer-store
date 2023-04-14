<template>
  <div class="bg-white table-setup">
    <base-table
      :data="data"
      paginationInfo="packages"
      :table="query"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      class="collection-table"
      @rowClick="handleRowClick"
    >
      <el-table-column label="#" type="index" :index="indexMethod" align="center" width="50" />
      <el-table-column label="PACKAGE NAME" align="left" prop="planName"> </el-table-column>
      <el-table-column label="TOKEN" align="left" width="190">
        <template slot-scope="scope">
          <div class="be-flex align-center">
            <base-icon :icon="`icon-${scope.row.currency.toLowerCase()}`" size="24" class="d-iflex" />
            <p class="text-base" style="margin-left: 4px">{{ scope.row.currency }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="DURATION" align="left" width="160">
        <template slot-scope="scope">
          <p class="text-base">{{ scope.row.durations }} {{ scope.row.durationType | convertTextLowerCase }}{{ scope.row.durations > 1 ? 's' : '' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="APR" align="righr" width="110">
        <template slot-scope="scope">
          <p>{{ scope.row.aprPercent }}%</p>
        </template>
      </el-table-column>
      <el-table-column label="DISTRIBUTION" width="230">
        <template slot-scope="scope">
          <p>{{ mapType(scope.row.interestType) }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" width="86">
        <template slot-scope="scope">
          <div class="be-flex action">
            <div class="mr-16" @click="handleEdit(scope.row)">
              <base-icon icon="icon-edit" size="24" />
            </div>

            <div @click.stop="handleDelete(scope.row)">
              <base-icon icon="icon-delete-new" size="22" />
            </div>
          </div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script lang="ts">
  import { filter } from 'lodash'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const beStaking = namespace('beStaking')

  @Component
  export default class TableSetupStaking extends Vue {
    @Prop({ required: false, type: Array, default: () => [] }) data!: Array<Record<string, any>>
    @Prop({ required: false, type: Object, default: () => ({}) }) query!: Record<string, any>

    @beStaking.State('listInterestType') listInterestType!: Array<Record<string, any>>

    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }

    handleSizeChange(limit: number): void {
      this.$emit('sizeChange', limit)
    }
    handleCurrentChange(page: number): void {
      this.$emit('currentChange', page)
    }
    handleRowClick(): void {
      //
    }
    handleEdit(row: Record<string, any>): void {
      this.$emit('edit', row)
    }
    handleDelete(row: Record<string, any>): void {
      this.$emit('delete', row)
    }

    mapType(type: string): string {
      const typeItem = filter(this.listInterestType, elm => elm.key === type)
      return typeItem.length ? typeItem[0].value : ''
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.table-setup {
    padding: 0 24px;
    .base-table {
      td {
        padding: 20px 0 !important;
      }
    }
  }
</style>
