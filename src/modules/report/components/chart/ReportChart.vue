<template>
  <div class="report-chart bg-white">
    <div class="chart w-100">
      <div class="cards bg-white">
        <div class="card user">
          <div class="card-title">
            <base-icon class="icon" icon="user2" size="40" />
            <p>{{ $t('report.card.user') }}</p>
          </div>
          <div class="card-value">
            <p>{{ this.dataHeader.totalUser | formatNumber }}</p>
          </div>
        </div>
        <div class="card number-of-user">
          <div class="card-title">
            <base-icon class="icon" icon="user-login" size="40" />
            <p>{{ $t('report.card.totalUserLogin') }}</p>
          </div>
          <div class="card-value">
            <p>{{ this.dataHeader.totalUserLogin | formatNumber }}</p>
          </div>
        </div>
        <div class="card percentage-login">
          <div class="card-title">
            <base-icon class="icon" icon="chart-report" size="40" />
            <p>{{ $t('report.card.percentUserLogin') }}</p>
          </div>
          <div class="card-value">
            <p>{{ this.dataHeader.percentUserLogin }}%</p>
          </div>
        </div>
      </div>
      <div class="detail wallet-table bg-white">
        <div class="detail-title">
          <p>{{ $t('report.chart.systemLoginChart') }}</p>
        </div>
        <!-- <div class="detail-line">
          <base-icon class="icon" icon="menu-member" size="40" />
          <p>Số lần đăng nhập</p>
        </div> -->

        <div class="line-chart bg-white">
          <line-chart-user :lines="lines" :propFilterUser="this.propFilterUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import LineChartUser from './lineChartUser.vue'
  import EventBus from '@/utils/eventBus'
  import getRepository from '@/services'
  import ReportRepository from '@/services/repositories/report'
  const api: ReportRepository = getRepository('report')
  @Component({ components: { LineChartUser } })
  export default class ReportChart extends Vue {
    @Prop({ required: true, type: Array, default: [] }) dataChart!: Array<Record<string, any>>
    @Prop({ required: true }) propFilterUser!: any
    // dataChart = []
    lines: Array<Record<string, any>> = [
      {
        label: this.$i18n.t('report.chart.loginTimes'),
        color: '#E34537',
        key: 'value'
      }
    ]
    query: Record<string, any> = {
      fromDate: '',
      toDate: ''
    }

    created(): void {
      EventBus.$on('dataHeaderUser', this.getdataHeaderUser)
      // this.getDataChart()
      console.log('hhh', this.dataChart)
    }
    dataHeader: any = {}
    getdataHeaderUser(value: any) {
      this.dataHeader = value
      console.log('fdfd', value)
    }
  }
</script>

<style lang="scss" scoped>
  .report-chart {
    padding: 0 12px;
    .chart {
      .cards {
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-radius: 15px;
        .card {
          color: #fff;
          margin: 12px 12px;
          width: 33.33333%;
          display: flex;
          flex-direction: column;
          box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
          border-radius: 15px;
          height: 150px;
          .card-title {
            margin: 12px 12px;
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            align-items: center;
            p {
              font-size: 20px;
              padding-left: 12px;
            }
            .icon {
              padding-right: 12px;
            }
          }
          .card-value {
            margin: 12px 12px;
            font-size: 30px;
            line-height: 48px;
            font-weight: 700;
            p {
              padding-left: 12px;
            }
          }
        }
        .user {
          background: linear-gradient(90deg, #e13635, #eb6651 80%, #eb6651);
        }
        .number-of-user {
          background: linear-gradient(90deg, #0f68da, #0f68da 30%, #318bff);
        }
        .percentage-login {
          background-image: linear-gradient(90deg, #3f9d2e, #4fc43a);
        }
      }
      .detail {
        margin: 12px;
        box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
        .detail-title {
          p {
            font-size: 18px;
            padding: 10px;
            color: #363636;
            font-weight: 600;
          }
        }
        .detail-line {
          display: flex;
          align-items: center;
          justify-content: center;
          .icon {
            padding-right: 10px;
          }
        }
      }
    }
  }
</style>
