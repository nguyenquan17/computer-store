<template>
  <div class="device-chart bg-white">
    <div class="chart w-100">
      <div class="cards bg-white">
        <div class="card web">
          <div class="card-title">
            <base-icon class="icon" icon="web" size="40" />
            <p>Web</p>
          </div>
          <div class="card-value">
            <p>{{ this.dataChartDevice.totalWebLogin | formatNumber }}</p>
            <p>{{ this.dataChartDevice.percentWebLogin }}%</p>
          </div>
        </div>
        <div class="card android">
          <div class="card-title">
            <base-icon class="icon" icon="android" size="40" />
            <p>Android</p>
          </div>
          <div class="card-value">
            <p>{{ this.dataChartDevice.totalAndroidLogin | formatNumber }}</p>
            <p>{{ this.dataChartDevice.percentAndroidLogin }}%</p>
          </div>
        </div>
        <div class="card ios">
          <div class="card-title">
            <base-icon class="icon" icon="apple" size="40" />
            <p>iOS</p>
          </div>
          <div class="card-value">
            <p>{{ this.dataChartDevice.totalIOSLogin | formatNumber }}</p>
            <p>{{ this.dataChartDevice.percentIOSLogin }}%</p>
          </div>
        </div>
      </div>
      <div class="detail wallet-table bg-white">
        <div class="detail-title">
          <p>{{ $t('report.chart.deviceUsageChart') }}</p>
        </div>
        <!-- <div class="detail-line">
          <base-icon class="icon" icon="menu-member" size="40" />
          <p>Số lần đăng nhập</p>
        </div> -->

        <div class="line-chart bg-white">
          <line-chart-device :lines="lines" :propFilterDevice="this.propFilterDevice" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import LineChartDevice from './lineChartDevice.vue'
  import EventBus from '@/utils/eventBus'
  @Component({ components: { LineChartDevice } })
  export default class DeviceChart extends Vue {
    @Prop({ required: true, type: Array, default: [] }) dataChartDevice!: Array<Record<string, any>>
    @Prop({ required: true }) propFilterDevice!: any
    lines: Array<Record<string, any>> = [
      {
        label: 'Web',
        color: '#E34537',
        key: 'Web'
      },
      {
        label: 'Android',
        color: '#1068da',
        key: 'Android'
      },
      {
        label: 'iOS',
        color: '#3f9d2e',
        key: 'IOS'
      }
    ]
    created(): void {
      EventBus.$on('dataHeaderDevice', this.getDataHeader)
    }
    getDataHeader(value: any): void {
      this.dataChartDevice = value
      console.log('vla', value)
    }
  }
</script>

<style lang="scss" scoped>
  .device-chart {
    padding: 0 12px;
    .chart {
      .cards {
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-radius: 15px;
        .card {
          color: #fff;
          margin: 0px 12px 12px;
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
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 12px 12px;
            font-size: 30px;
            line-height: 48px;
            font-weight: 700;
            padding: 0 12px;
          }
        }
        .web {
          background: linear-gradient(90deg, #e13635, #eb6651 80%, #eb6651);
        }
        .android {
          background: linear-gradient(90deg, #0f68da, #0f68da 30%, #318bff);
        }
        .ios {
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
  .web {
    background: linear-gradient(90deg, #e13635, #eb6651 80%, #eb6651);
  }
  .android {
    background: linear-gradient(90deg, #0f68da, #0f68da 30%, #318bff);
  }
  .ios {
    background-image: linear-gradient(90deg, #3f9d2e, #4fc43a);
  }
</style>
