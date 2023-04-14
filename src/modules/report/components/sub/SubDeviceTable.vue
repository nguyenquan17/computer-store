<template>
  <div class="sub-device-table">
    <div v-for="(item, key) in data" :key="key" class="item">
      <span>{{ item.createdAt | formatDateHourMs }}</span>

      <span>{{ item.devicesOsVersion }}</span>

      <span>{{ item.deviceName }}</span>
    </div>
    <div>
      <base-pagination class="pagination" :table="query" :info="paginationInfo" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import getRepository from '@/services'
  import ReportRepository from '@/services/repositories/report'
  const api: ReportRepository = getRepository('report')
  @Component
  export default class SubDeviceTable extends Vue {
    @Prop() id!: any
    @Prop() propDataQuery!: any
    @Prop() deviceType!: string
    data: any = []
    query: any = {
      page: 1,
      limit: 10,
      total: 100
    }
    get paginationInfo(): string {
      return this.$t('paging.times') as string
    }
    handleSizeChange(val: number): void {
      this.query.page = 1
      this.query.limit = val
      this.getDetailDeviceList()
      // console.log('size change', val)
    }

    handleCurrentChange(val: number): void {
      console.log('currenchange', val)
      this.query.page = val
      this.getDetailDeviceList()
    }
    created(): void {
      console.log('id', this.propDataQuery)
      if (this.propDataQuery) {
        this.getDetailDeviceList()
      }
    }
    //   query: any = {
    //     fromDate: '2021-03-04 08:12:17',
    //     toDate: '2022-09-04 08:12:17',
    //     page: 1,
    //     limit: 10
    //   }
    async getDetailDeviceList(): Promise<void> {
      const params = {
        page: this.query.page,
        limit: this.query.limit,
        fromDate: this.propDataQuery.fromDate,
        toDate: this.propDataQuery.toDate,
        userId: this.id,
        deviceType: this.deviceType
      }

      const result = await api.getDeviceListByUserID(params)
      this.data = result.content
      this.query.total = result.totalElements
      console.log('result', result)
    }
  }
</script>

<style lang="scss" scoped>
  .sub-device-table {
    .pagination {
      margin: 0 20px;
      font-size: 14px;
    }
    .item {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #eee;
      margin-left: 143px;
      margin-right: 143px;
      &:last-child {
        border-bottom: none;
      }
      span {
        word-break: break-word;
        display: block;
        color: #363636;
      }
      span:nth-child(1) {
        width: 37.7%;
      }
      span:nth-child(2) {
        width: 41%;
        text-align: left;
        display: block;
      }
      span:nth-child(3) {
        width: 21.3%;
        text-align: left;
        display: block;
      }
    }
  }
</style>
