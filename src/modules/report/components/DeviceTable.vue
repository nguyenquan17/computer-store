<template>
  <div class="w-100 bg-white wallet-table">
    <!-- <div class="wallet-table__below">
      <base-table
        :data="responseList"
        :table="query"
        :paginationInfo="getPaginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        class="base-table table-wallet"
      >
        <el-table-column label="#" type="index" :index="indexMethod" align="center" width="100" />
        <el-table-column :label="$t('report.table.fullName')" min-width="200">
          <template class="flex-center-vert" slot-scope="scope">
            <div>
              <span>{{ scope.row.fullName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('report.table.email')" prop="username" min-width="220"> </el-table-column>
        <el-table-column :label="$t('report.table.device')" prop="device" width="330"> </el-table-column>
        <el-table-column :label="$t('report.table.totalLogin')" prop="totalLogin" align="right" width="200"></el-table-column>
      </base-table>
    </div> -->
    <div class="wallet-table__below">
      <base-table
        :data="responseList"
        :table="query"
        :paginationInfo="getPaginationInfo"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        class="base-table table-wallet device-table"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <sub-device-table :id="scope.row.userId" :deviceType="scope.row.device" :propDataQuery="propDataQuery" />
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" :index="indexMethod" align="center" width="100" />
        <el-table-column :label="$t('report.table.fullName')" min-width="200">
          <template class="flex-center-vert" slot-scope="scope">
            <div>
              <span>{{ scope.row.fullName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('report.table.email')" prop="username" min-width="220"> </el-table-column>
        <el-table-column :label="$t('report.table.device')" prop="device" min-width="100"> </el-table-column>
        <el-table-column :label="$t('report.table.totalLogin')" prop="totalLogin" align="right" width="200"></el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Mixins } from 'vue-property-decorator'
  import SubDeviceTable from './sub/SubDeviceTable.vue'

  import EventBus from '@/utils/eventBus'
  import { size, sortBy, findIndex, find } from 'lodash'
  import getRepository from '@/services'
  import ReportRepository from '@/services/repositories/report'
  const api: ReportRepository = getRepository('report')
  @Component({ components: { SubDeviceTable } })
  export default class DeviceTable extends Vue {
    @Prop({ required: true, type: Array, default: [] }) data!: Array<Record<string, any>>
    @Prop({ required: true }) propFilterDevice!: any
    query: Record<string, any> = {
      search: '',
      limit: 10,
      page: 1,
      orderBy: 'TOTAL_LOGIN',
      total: 0
    }
    propDataQuery: any = {}
    get getPaginationInfo(): any {
      return this.$t('paging.times')
    }
    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleCurrentChange(value: number): void {
      console.log('size', value)
      this.query.page = value
      this.getListDevice()
    }
    handleSizeChange(value: number): void {
      console.log('size', value)
      this.query.page = 1
      this.query.limit = value
      this.getListDevice()

      // this.$emit('sizeChange', value)
    }
    responseList: Array<Record<string, any>> = [
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        device: '',
        totalLogin: '2'
      }
    ]
    detailList: Array<Record<string, any>> = []
    async handleExpandChange(data: { row: any; expandedRows: any[] }): Promise<void> {
      console.log('abc')

      // try {
      //   if (size(data.row.childrens) === 0) {
      //     const result = await this.reportRes?.getPl9defghReport(
      //       {
      //         type: 'PL9D',
      //         zone: 'branch',
      //         areaId: data.row.area_id
      //       },
      //       {
      //         ...this.filters,
      //         year: this.filters.year,
      //         month: this.filters.month,
      //         limit: 10000,
      //         page: 1
      //       }
      //     )
      //     data.row.childrens = result?.contents || []
      //   }
      // } catch (error) {
      //   console.log(error)
      // }
    }
    async getListDevice(): Promise<void> {
      const params = {
        ...this.query,
        total: ''
      }
      this.propDataQuery = params
      console.log('params', params)
      const result = await api.getListDeviceReport(params)
      this.responseList = result.content
      this.query.total = result.totalElements
    }
    async getDetailDeviceList(): Promise<void> {
      const params = {
        ...this.query,
        userId: 11,
        deviceType: 'Android'
      }
      console.log('123', params)
      const result = await api.getDeviceListByUserID(params)
      this.detailList = result.content
    }
    checkTimeFromDate(day: number): string {
      const time = new Date(Date.now() - day * 24 * 60 * 60 * 1000).setHours(0, 0, 0)
      return this.formatTimestampFromDate(time)
    }
    checkTimeToDate(): string {
      const time = new Date(Date.now()).setHours(0, 0, 0)
      return this.formatTimestampToDate(time)
    }
    formatTimestampToDate(value: number): string {
      if (!value) {
        return ''
      }
      // const gmt = new Date().getTimezoneOffset() / -60
      // const ago = value - gmt * 60 * 60 * 1000
      const date = new Date(value)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        '23' +
        ':' +
        '59' +
        ':' +
        '59'
      )
    }
    formatTimestampFromDate(value: number): string {
      if (!value) {
        return ''
      }
      // const gmt = new Date().getTimezoneOffset() / -60
      // const ago = value - gmt * 60 * 60 * 1000
      const date = new Date(value)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        '00' +
        ':' +
        '00' +
        ':' +
        '00'
      )
    }
    async created(): Promise<void> {
      console.log("test prop device", this.propFilterDevice)
      // this.query.fromDate = this.checkTime(7)
      // this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      // this.getListDevice()
      // this.getDetailDeviceList()
      if (this.propFilterDevice.date) {
        await this.handleFilterByDay(this.propFilterDevice.date)
        await this.getDetailDeviceList()
      } else {
        this.query.fromDate = this.checkTime(7)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
        await this.getListDevice()
        await this.getDetailDeviceList()
      }
      // this.getFromDateTodate()
      EventBus.$on('deviceTableSearch', this.handleFilterReport)
      EventBus.$on('deviceTableFilter', this.handleFilterByDay)
      EventBus.$on('sort', this.handleSortDevice)
    }
    handleSortDevice(value: string): void {
      console.log('1', value)
      this.query.orderBy = value
      this.getListDevice()
    }
    handleFilterByDay(value: string | number): void {
      // console.log('2323', this.checkTime(2))
      console.log("vao device", value)
      if (value == 'yesterday') {
        // this.query.fromDate = this.checkTimeFromDate(1)
        // this.query.toDate = this.checkTimeToDate()
        this.query.fromDate = this.checkTime(1)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      } else if (value == 'last7Days') {
        // this.query.fromDate = this.checkTimeFromDate(7)
        // this.query.toDate = this.checkTimeToDate()
        this.query.fromDate = this.checkTime(7)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      } else if (value == 'last14Days') {
        this.query.fromDate = this.checkTime(14)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      } else if (value == 'last30Days') {
        this.query.fromDate = this.checkTime(30)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      } else if (value == 'last90Days') {
        this.query.fromDate = this.checkTime(90)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      }
      this.query.page = 1
      // console.log('query', this.query)
      this.getListDevice()
    }
    checkTime(day: number): string {
      const time = new Date(Date.now() - day * 24 * 60 * 60 * 1000).setHours(0, 0, 0)
      return this.formatTimestamp(time)
    }
    formatTimestamp(value: number): string {
      if (!value) {
        return ''
      }
      const gmt = new Date().getTimezoneOffset() / -60
      const ago = value - gmt * 60 * 60 * 1000
      const date = new Date(ago)
      return (
        date.getFullYear() +
        '-' +
        (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
        '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    }
    handleFilterReport(value: any): void {
      console.log('value', value)
      this.query.page = 1
      this.query.orderBy = 'TOTAL_LOGIN'
      this.query.search = value.search
      this.getListDevice()
      // this.query.searchd =
    }
  }
</script>

<style lang="scss" scoped>
  .abc {
    display: flex;
    align-items: center;
  }
  img {
    width: 30px;
    border-radius: 50%;
    height: 30px;
    margin-right: 10px;
  }
  .device-table {
    max-width: 1753px;
    width: 100%;
  }
  .wallet-table {
    .cards {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .card {
        color: #fff;
        margin: 12px 12px;
        width: 33.33333%;
        display: flex;
        flex-direction: column;
        box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
        border-radius: 15px;
        background: linear-gradient(90deg, #e13635, #eb6651 80%, #eb6651);
        .card-title {
          margin: 12px 12px;
          display: flex;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: center;
          p {
            font-size: 14.26px;
          }
        }
        .card-value {
          margin: 12px 12px;
          font-size: 30px;
          line-height: 48px;
          font-weight: 700;
        }
      }
    }
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
