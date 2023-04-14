<template>
  <div class="w-100 bg-white wallet-table user-table">
    <div class="wallet-table__below">
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
        <el-table-column :label="$t('report.table.email')" prop="username" min-width="200"> </el-table-column>
        <el-table-column :label="$t('report.table.lastTimeLogin')" prop="lastLoginDate" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.lastLoginDate | formatDateHourMs }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('report.table.totalLogin')" prop="totalLogin" align="right" width="200"></el-table-column>
      </base-table>
    </div>
    <!-- <report-chart /> -->
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Mixins } from 'vue-property-decorator'
  import getRepository from '@/services'
  import ReportRepository from '@/services/repositories/report'
  import EventBus from '@/utils/eventBus'
  // import ReportChart from './chart/ReportChart.vue'
  const api: ReportRepository = getRepository('report')
  @Component({ components: {} })
  export default class ReportTable extends Vue {
    // @Prop({ required: true, type: Object, default: {} }) query!: Record<string, any>
    @Prop({ required: true, type: Array, default: [] }) data!: Array<Record<string, any>>
    @Prop({ required: true }) propFilterUser!: any
    query: Record<string, any> = {
      search: '',
      limit: 10,
      page: 1,
      orderBy: 'TOTAL_LOGIN',
      total: 0
    }
    get getPaginationInfo(): any {
      return this.$t('paging.user')
    }
    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleCurrentChange(value: number): void {
      console.log('size', value)
      this.query.page = value
      this.getListUser()
    }
    handleSizeChange(value: number): void {
      console.log('size', value)
      this.query.page = 1
      this.query.limit = value
      this.getListUser()

      // this.$emit('sizeChange', value)
    }
    responseList: Array<Record<string, any>> = [
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      },
      {
        fullName: 'lamvb',
        username: 'lamvb@gmail.com',
        lastLoginDate: '03/29/2021 13:11:24',
        totalLogin: '2'
      }
    ]

    async getListUser(): Promise<void> {
      const params = {
        ...this.query,
        total: ''
        // fromDate: '2022-01-04 08:12:17',
        // toDate: '2022-12-11 08:12:17'
      }
      console.log('params', params)
      const result = await api.getListUserReport(params)
      this.responseList = result.content
      this.query.total = result.totalElements
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
      console.log('test prop', this.propFilterUser)
      // this.query.fromDate = this.checkTime(7)
      // this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      if (this.propFilterUser.date) {
        await this.handleFilterUserTableByDay(this.propFilterUser.date)
      } else {
        this.query.fromDate = this.checkTime(7)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
        await this.getListUser()
      }

      // this.getFromDateTodate()
      EventBus.$on('filterUserTable', this.handleFilterUserTable)
      EventBus.$on('filterUserTableByDay', this.handleFilterUserTableByDay)
      EventBus.$on('sort', this.handleSortUser)
    }
    handleSortUser(value: string): void {
      console.log('1', value)
      this.query.orderBy = value
      this.getListUser()
    }
    handleFilterUserTableByDay(value: string | number): void {
      console.log('vao', value)

      if (value == 'yesterday') {
        this.query.fromDate = this.checkTime(1)
        this.query.toDate = this.formatTimestamp(new Date().setHours(0, 0, 0) + 86399000)
      } else if (value == 'last7Days') {
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
      this.getListUser()
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
    handleFilterUserTable(value: any): void {
      this.query.page = 1
      this.query.orderBy = 'TOTAL_LOGIN'
      this.query.search = value.search
      console.log('value', this.query)
      this.getListUser()
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
  .user-table {
    width: 1777px;
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
