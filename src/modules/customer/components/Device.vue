<template>
  <div class="device">
    <div class="table" v-loading="isLoading" :class="isLoading ? 'list-loading' : null">
      <base-table :data="listDevice" :showPagination="false" class="base-table table-wallet">
        <el-table-column label="#" :index="getIndex" type="index" width="50" />
        <el-table-column :label="$t('customer.table.device-os')" width="220">
          <template slot-scope="scope">
            <span class="d-ib">{{ scope.row.devicesOsVersion }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.device-name')">
          <template slot-scope="scope">
            <span class="d-ib">{{ scope.row.deviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.device-ver')" width="130">
          <template slot-scope="scope">
            <span class="d-ib">{{ scope.row.appVersion }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.last-login')" width="200">
          <template slot-scope="scope">
            <span class="d-ib">{{ scope.row.lastLogin | formatDateHourMs }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.2fa-status')" width="150" align="center">
          <template slot-scope="scope">
            <span class="text-base">{{ scope.row.twoFactorStatus }} </span>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import { CustomerRepository } from '@/services/repositories/customer'
  import getRepository from '@/services'
  const apiCustomer: CustomerRepository = getRepository('customer')
  @Component
  export default class Device extends Vue {
    @Prop({ required: true, type: Number, default: 0 }) userId!: number

    listDevice: Array<Record<string, any>> = []
    isLoading = false
    query: Record<string, any> = {
      page: 1,
      limit: 10,
      total: 0
    }

    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    mounted(): void {
      this.init()
    }

    async init(): Promise<void> {
      try {
        this.isLoading = true
        this.listDevice = await apiCustomer.getListDevice(this.userId)
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  .device {
    .table {
      padding: 0 24px;
    }
  }
</style>
