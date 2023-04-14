<template>
  <div class="w-100 bo-kyc bg-white" style="100vh">
    <div class="bg-white wallet-header">
      <div class="be-flex align-center jc-space-between wallet-header__above">
        <div class="wallet-header__above-tabs be-flex">
          <div class="tab-item cursor" v-for="tab in tabs" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
            <span class="text-base">
              {{ $t(`menu.${tab.title}`) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <user-chart-filter v-if="this.$route.name == 'ReportUser' && this.viewType == 'chart'" :propFilterUser="propFilterUser" @emitFilterUserTable="getDataFilterUserTable" />
    <user-table-filter :propFilterUser="propFilterUser" v-if="this.$route.name == 'ReportUser' && this.viewType == 'table'" @emitFilterUserChartnew="getDataFilterUserTable" />

    <device-chart-filter v-if="this.$route.name == 'ReportDevice' && this.viewType == 'chart'" :propFilterDevice="propFilterDevice" @emitFilterDevice="getDataFilterDevice" />
    <device-table-filter :propFilterDevice="propFilterDevice" v-if="this.$route.name == 'ReportDevice' && this.viewType == 'table'" @emitFilterDiviceChartNew="getDataFilterDevice" />

    <report-table :propFilterUser="propFilterUser" v-if="this.$route.name == 'ReportUser' && this.viewType == 'table'" />
    <report-chart v-else-if="this.$route.name == 'ReportUser' && this.viewType == 'chart'" :dataChart="dataChart" :propFilterUser="propFilterUser" />

    <device-table :propFilterDevice="propFilterDevice" v-else-if="this.$route.name == 'ReportDevice' && this.viewType == 'table'" />
    <device-chart v-else-if="this.$route.name == 'ReportDevice' && this.viewType == 'chart'" :dataChartDevice="dataChartDevice" :propFilterDevice="propFilterDevice" />
  </div>
</template>

<script lang="ts">
  import { Component, Emit, Vue, Watch } from 'vue-property-decorator'
  import ReportTable from '../components/ReportTable.vue'
  import ReportFilter from '../components/filter/ReportFilter.vue'
  import getRepository from '@/services'
  import ReportRepository from '@/services/repositories/report'
  import ReportChart from './../components/chart/ReportChart.vue'
  import EventBus from '@/utils/eventBus'
  import DeviceTable from './../components/DeviceTable.vue'
  import DeviceChart from '../components/chart/DeviceChart.vue'
  import UserTableFilter from '../components/filter/UserTableFIlter.vue'
  import UserChartFilter from '../components/filter/UserChartFilter.vue'
  import DeviceChartFilter from '../components/filter/DeviceChartFilter.vue'
  import DeviceTableFilter from '../components/filter/DeviceTableFilter.vue'
  const api: ReportRepository = getRepository('report')

  @Component({
    components: {
      ReportTable,
      ReportFilter,
      ReportChart,
      DeviceTable,
      DeviceChart,
      UserTableFilter,
      UserChartFilter,
      DeviceChartFilter,
      DeviceTableFilter
    }
  })
  export default class BOCustomer extends Vue {
    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'user',
        routeName: 'ReportUser'
      },
      {
        id: 2,
        title: 'device',
        routeName: 'ReportDevice'
      }
    ]
    dataHeader: any = {}
    dataChart: any = []
    dataChartDevice: any = []
    async getDataChart(): Promise<void> {
      const params = {
        fromDate: '',
        toDate: ''
      }
      const result = await api.getDataChart(params)
      console.log('result', result)
      this.dataHeader = {
        percentUserLogin: result.percentUserLogin,
        totalUserLogin: result.totalUserLogin,
        totalUser: result.totalUser
      }
      this.dataChart = result
    }
    async getDataChartDevice(): Promise<void> {
      const params = {
        fromDate: '',
        toDate: ''
      }
      const result = await api.getDataChartDevice(params)
      console.log('result', result)
      this.dataHeader = {
        percentUserLogin: result.percentUserLogin,
        totalUserLogin: result.totalUserLogin,
        totalUser: result.totalUser
      }
      this.dataChartDevice = result
    }
    @Watch('$route.name') handleSearch(): void {
      this.viewType = 'chart'
    }

    handleChangeTab(tab): void {
      this.viewType == 'chart'
      this.$forceUpdate()
      console.log('tab', this.$route.name)
      this.$router.push({ name: tab.routeName }).then(() => {
        // this.resetQuery()
        // EventBus.$emit('changeTabMember')
      })
      if (tab == 'ReportDevice') {
        this.getDataChartDevice()
      }
    }
    viewType = 'chart'
    async created(): Promise<void> {
      EventBus.$on('changeView', this.changeView)
    }

    propFilterUser: any = {}
    propFilterDevice: any = {}
    getDataFilterUserTable(value: any): void {
      console.log('filterUser', value)
      this.propFilterUser = value
    }
    getDataFilterDevice(value: any): void {
      console.log("filterDevice", value)
      this.propFilterDevice = value
    }
    handleFilterByDay(value: string | number): void {
      console.log('p', value)
    }
    changeView(value: string): void {
      this.viewType = value
    }
  }
</script>

<style lang="scss" scoped>
  .bo-kyc {
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
    .wallet-header {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);
        &-tabs {
          .tab-item {
            padding: 16px 12px;
            position: relative;
            &:hover {
              color: var(--bc-tab-active);
            }
            // .text-base {
            //   color: #5b616e;
            // }
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
        padding: 24px;
        &-amount {
          .amount-wallet,
          .amount-lock {
            flex: 1;
            .title {
              margin-left: 16px;
              .title-coin {
                color: #201f1e;
              }
            }
            .amount {
              margin-top: 10px;

              .amount-btc {
                color: var(--bc-amount-btc);
              }
              .amount-lyn {
                color: var(--bc-amount-lin);
              }
              .amount-lock {
                color: var(--bc-amount-lock);
              }
            }
          }
          .amount-wallet {
            border-right: 1px solid var(--bc-border-primary);
          }
        }
      }
    }
  }
</style>
