<template>
  <div class="social">
    <div class="table">
      <base-table :data="listSocial" :showPagination="false" class="base-table table-wallet">
        <el-table-column label="#" type="index" width="50" />
        <el-table-column label="Social">
          <template slot-scope="scope">
            <span class="d-ib">{{ scope.row.social }}</span>
          </template>
        </el-table-column>
        <el-table-column label="User">
          <template slot-scope="scope">
            <span class="d-ib">{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center" width="160">
          <template slot-scope="scope">
            <span :class="checkType(scope.row.socialId)">{{ checkStatus(scope.row.socialId) }}</span>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Social extends Vue {
    @Prop({ required: false, type: Array, default: () => [] }) listSocial!: Array<Record<string, any>>

    checkType(type: string): string {
      return type ? 'status-verified' : 'status-not-verified'
    }

    checkStatus(status: string): any {
      return status ? 'Verified' : 'Unverified'
    }
  }
</script>

<style scoped lang="scss">
  .social {
    .table {
      padding: 0 24px;
    }
  }
</style>
