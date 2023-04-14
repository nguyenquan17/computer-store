<template>
  <div id="chartdiv"></div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'
  import forEach from 'lodash/forEach'
  import getRepository from '@/services'
  import ReportRepository from '@/services/repositories/report'

  import EventBus from '@/utils/eventBus'

  const api: ReportRepository = getRepository('report')
  @Component
  export default class lineChart extends Vue {
    @Prop({ required: true, type: Array, default: () => [] }) lines!: Array<Record<string, any>>
    @Prop({ required: true }) propFilterDevice!: any
    isLoading = false
    data: any = []
    chartData: any = []
    chartReportData() {
      const result: any = []
      for (let i = 0; i < this.chartData.numOfWebLoginByDay.length; i++) {
        result.push({
          date: this.chartData.numOfWebLoginByDay[i].date,
          Web: this.chartData.numOfWebLoginByDay[i].value,
          Android: this.chartData.numOfAndroidLoginByDay[i].value,
          IOS: this.chartData.numOfIOSLoginByDay[i].value
        })
      }
      return result
    }
    async getDataChart(): Promise<void> {
      const params = {
        fromDate: this.query.fromDate,
        toDate: this.query.toDate,
        timezone: new Date().getTimezoneOffset() / -60 > 0 ? '+' + new Date().getTimezoneOffset() / -60 : '-' + new Date().getTimezoneOffset() / -60
      }
      const result = await api.getDataChart(params)
      EventBus.$emit('dataHeaderUser', result)
      this.data = result.numOfUserLoginByDay
      this.renderChart()
    }
    getDataChartDevice(): void {
      try {
        const params = {
          fromDate: this.query.fromDate,
          toDate: this.query.toDate,
          timezone: new Date().getTimezoneOffset() / -60 > 0 ? '+' + new Date().getTimezoneOffset() / -60 : '-' + new Date().getTimezoneOffset() / -60
        }
        api.getDataChartDevice(params).then(result => {
          this.chartData = result
          this.data = this.chartReportData()
          EventBus.$emit('dataHeaderDevice', result)

          console.log('this.chartReportData()', this.chartReportData())
          this.renderChart()
        })
      } catch (error) {
        this.isLoading = false
      }
    }
    query: Record<string, any> = {
      fromDate: this.checkTimeFromDate(7),
      toDate: this.checkTimeToDate()
    }

    async created(): Promise<void> {
      console.log('propFilterDevice', this.propFilterDevice)
      EventBus.$on('filterDeviceChart', this.handleFilterDeviceChart)
      // this.handleFilterDeviceChart('last7Days')

      this.propFilterDevice.date ? this.handleFilterDeviceChart(this.propFilterDevice.date) : this.handleFilterDeviceChart('last7Days')
    }

    destroyed(): void {
      console.log('destroyed')
      EventBus.$off('filterDeviceChart')
    }
    checkTime(day: number): string {
      const time = new Date(Date.now() - day * 24 * 60 * 60 * 1000).setHours(0, 0, 0)
      return this.formatTimestamp(time)
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

    handleFilterDeviceChart(value: string | number): void {
      if (value == 'yesterday') {
        this.query.fromDate = this.checkTimeFromDate(1)
        this.query.toDate = this.checkTimeToDate()
      } else if (value == 'last7Days') {
        this.query.fromDate = this.checkTimeFromDate(7)
        this.query.toDate = this.checkTimeToDate()
      } else if (value == 'last14Days') {
        this.query.fromDate = this.checkTimeFromDate(14)
        this.query.toDate = this.checkTimeToDate()
      } else if (value == 'last30Days') {
        this.query.fromDate = this.checkTimeFromDate(30)
        this.query.toDate = this.checkTimeToDate()
      } else if (value == 'last90Days') {
        this.query.fromDate = this.checkTimeFromDate(90)
        this.query.toDate = this.checkTimeToDate()
      }
      this.getDataChartDevice()
    }
    renderChart(): void {
      am4core.useTheme(am4themes_animated)
      let chart = am4core.create('chartdiv', am4charts.XYChart)
      chart.paddingRight = 30
      // Add data
      chart.data = this.data

      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.grid.template.location = 0
      dateAxis.renderer.minGridDistance = 50
      dateAxis.startLocation = 0.5
      dateAxis.endLocation = 0.5
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())

      // Create series
      // let series = chart.series.push(new am4charts.LineSeries())
      // series.dataFields.valueY = 'value'
      // series.dataFields.dateX = 'date'
      // series.strokeWidth = 3
      // series.fillOpacity = 0.5
      forEach(this.lines, value => {
        const series = chart.series.push(new am4charts.LineSeries())
        series.dataFields.valueY = value.key
        series.dataFields.dateX = 'date'
        series.name = value.label
        series.strokeWidth = 2
        // let bullet = series.bullets.push(new am4charts.CircleBullet())
        // bullet.circle.radius = 4
        series.fill = am4core.color(value.color)
        series.stroke = am4core.color(value.color)
        series.tooltipText = '{name}: {valueY}'
        series.tooltip!.fontSize = 14
        series.tooltip!.autoTextColor = false
        series.tooltip!.label.fill = am4core.color('#FFFFFF')
        series.legendSettings.valueText = '{valueY}'
        series.visible = true
        series.fillOpacity = 0.1
        series.tensionX = 0.8
        series.legendSettings.valueText = ''
      })

      // Add vertical scrollbar
      // chart.scrollbarY = new am4core.Scrollbar()
      // chart.scrollbarY.marginLeft = 0

      // Add cursor
      chart.cursor = new am4charts.XYCursor()
      chart.cursor.behavior = 'zoomY'
      chart.cursor.lineX.disabled = true
    }
  }
</script>

<style scoped lang="scss">
  #chartdiv {
    width: 100%;
    height: 500px;
  }
</style>
