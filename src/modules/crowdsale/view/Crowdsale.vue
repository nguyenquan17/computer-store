<template>
  <div class="w-100 bo-crowdsale" v-loading="isLoading">
    <div class="box-content-1">
      <div class="round bg-white box-shadow">
        <div class="head">
          <div class="fw-600 fs-24 title">{{ getRoundNumber }}</div>
          <div v-if="getStatus === 1" class="box-status">{{ $t('crowdsale.opening') }}</div>
          <div v-if="getStatus !== 1 && isFinish" class="box-status finish">{{ $t('crowdsale.finish') }}</div>
          <div v-if="getStatus !== 1 && !isFinish" class="box-status upcoming">{{ $t('crowdsale.upcoming') }}</div>
        </div>
        <p class="fw-400 fs-16 time-date">
          {{ roundCurrent && roundCurrent.fromDate && roundCurrent.fromDate.time | formatDDMMYY }} -
          {{ roundCurrent && roundCurrent.toDate && roundCurrent.toDate.time | formatDDMMYY }}
        </p>
        <div class="box-ellipse">
          <div class="mini-ellipse">
            <p v-if="getStatus === 1" class="fw-600 fs-24 percentageSold" style="margin-bottom: 2px; margin-top: 24px">
              <span v-if="roundCurrent && roundCurrent.percentageSold"> {{ ((roundCurrent && roundCurrent.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%</span>
              <span v-else>0%</span>
            </p>
            <p v-if="getStatus !== 1 && isFinish" class="fw-600 fs-24 percentageSold percentageSoldFinish" style="margin-bottom: 2px; margin-top: 24px">
              <span v-if="roundCurrent && roundCurrent.percentageSold"> {{ ((roundCurrent && roundCurrent.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%</span>
              <span v-else>0%</span>
            </p>
            <p v-if="getStatus !== 1 && !isFinish" class="fw-600 fs-24 percentageSold percentageSoldUpcoming" style="margin-bottom: 2px; margin-top: 24px">
              <span v-if="roundCurrent && roundCurrent.percentageSold"> {{ ((roundCurrent && roundCurrent.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%</span>
              <span v-else>0%</span>
            </p>
            <p class="fw-400 fs-12" style="color: #5b616e">
              {{ $t('crowdsale.of') }} <span class="fw-600">{{ (roundCurrent && roundCurrent.totalAmount) / 1000000 }}M</span>
            </p>
          </div>
          <el-progress v-if="getStatus === 1" type="circle" :percentage="progressbar" :stroke-width="12" :color="getColor" :show-text="false"></el-progress>
          <el-progress v-if="getStatus !== 1 && isFinish" type="circle" :percentage="progressbar" :stroke-width="12" color="#129961" :show-text="false"></el-progress>
          <el-progress v-if="getStatus !== 1 && !isFinish" type="circle" :percentage="progressbar" :stroke-width="12" color="#5B616E" :show-text="false"></el-progress>
        </div>
      </div>
      <div class="progress bg-white box-shadow">
        <p class="fw-600 fs-24 title">{{ $t('crowdsale.progress') }}</p>
        <p class="fw-400 fs-16 discript">
          {{ $t('crowdsale.from') }} {{ roundCurrent && roundCurrent.fromDate && roundCurrent.fromDate.time | formatDDMMYY }} {{ $t('crowdsale.now') }}
        </p>
        <div class="box-content">
          <div class="box-left fw-400 fs-14">{{ roundCurrent && roundCurrent.totalSold | formatNumber }} {{ $t('crowdsale.sold') }}</div>
          <div class="box-right fw-400 fs-14">{{ roundCurrent && roundCurrent.totalAvailable | formatNumber }} {{ $t('crowdsale.left') }}</div>
        </div>
        <el-progress type="line" :percentage="progressbar" :stroke-width="20" color="#129961" :show-text="false"></el-progress>
        <div class="bottom">
          <div class="box1 box">
            <p class="fw-600 fs-18 price" v-if="roundCurrent && roundCurrent.percentageSold">
              {{ ((roundCurrent && roundCurrent.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%
            </p>
            <p class="fw-600 fs-18 price" v-else>0%</p>
            <p class="fw-400 fs-14">{{ $t('crowdsale.completed') }}</p>
          </div>
          <div class="line"></div>
          <div class="box2 box">
            <p class="fw-600 fs-18 price">${{ roundCurrent && (roundCurrent.totalSold * roundCurrent.price) | convertAmountDecimal('USD') }}</p>
            <p class="fw-400 fs-14">{{ $t('crowdsale.raised') }}</p>
          </div>
          <div class="line"></div>
          <div class="box3 box">
            <p class="fw-600 fs-18 price">{{ roundCurrent && roundCurrent.totalBacker | formatNumber }}</p>
            <p class="fw-400 fs-14">{{ $t('crowdsale.backers') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- box-tab-active -->
    <div class="table bg-white box-shadow">
      <div class="wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div class="tab-item cursor" v-for="tab in getTabs" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
              <span class="text-base">{{ $t(`crowdsale.${tab.title}`) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="box-table">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import firebase from '@/utils/firebase'
  import { filter, findIndex, forEach } from 'lodash'
  import { namespace } from 'vuex-class'
  import { MODULE_WITH_ROUTENAME } from '@/configs/role'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const crowdsaleBo = namespace('crowdsaleBo')
  @Component
  export default class BOCrowdsale extends Vue {
    @bcAuth.Getter('listModuleCanView') listModuleCanView!: Array<Record<string, any>>
    @beBase.State('coinMain') coinMain!: string
    @crowdsaleBo.Action('setRoundCurrent') setRoundCurrent!: (round: Record<string, any>) => void

    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'transactions',
        routeName: 'CrowdsaleTransactions'
      },
      {
        id: 2,
        title: 'round',
        routeName: 'CrowdsaleRound'
      },
      {
        id: 3,
        title: 'setting',
        routeName: 'CrowdsaleSetting'
      }
    ]
    listener: any = null
    listRound: Record<string, any>[] = []
    roundCurrent: Record<string, any> | any = {}
    isEndOn = false
    progressbar = 0
    timing: any = null
    day: string | number = 0
    hour: string | number = 0
    minute: string | number = 0
    second: string | number = 0
    isLoading = true
    countDownDate = 0
    isFinish = false

    get getTabs(): Array<Record<string, any>> {
      return this.tabs
    }

    get getIsEndRound(): boolean {
      const index = findIndex(this.listRound, elm => elm.id === this.roundCurrent.id)
      if (index === this.listRound.length - 1) {
        return true
      }
      return false
    }
    get getRoundNumber(): string {
      return this.roundCurrent?.name
    }
    get getStatus(): string {
      return this.roundCurrent?.isActive
    }

    created(): void {
      console.log(this.checkPemission('crowd-sale', ['view']))

      if (!this.checkPemission('crowd-sale', ['view'])) {
        const routeName = MODULE_WITH_ROUTENAME[this.listModuleCanView[0]?.module]
        console.log('>>> / file: Crowdsale.vue / line 150 / routeName', this.listModuleCanView)
        console.log('routeName', routeName)
        this.$router.push({ name: routeName.name, params: routeName.params })
        return
      }
    }

    mounted(): void {
      this.handleTurnOnFirebase()
    }
    handleTurnOnFirebase(): void {
      const leadsRef = firebase.database().ref('crowd-sales')
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      this.listener = leadsRef.on('value', function (snapshot) {
        _this.listRound = snapshot.val()
        const roundActive = filter(snapshot.val(), round => round.isActive)

        if (!roundActive.length) {
          _this.roundCurrent = null
          _this.isEndOn = false
          _this.isFinish = false
          _this.handleGetRoundNext()
        } else {
          _this.isFinish = false
          _this.roundCurrent = roundActive[0]
          _this.isEndOn = true
          _this.progressbar = (_this.roundCurrent.percentageSold * 1000) / 10
          _this.handleGetData()
        }
      })
    }
    handleGetRoundNext(): void {
      const leadsRef = firebase.database().ref('crowd-sales')
      leadsRef.off('value', this.listener)

      /**
       * Nếu response là round cuối
       * response là null <=> chưa vào round nào => lấy round 1
       */

      if (!this.roundCurrent) {
        const roundFirst = this.listRound[0]
        const roundLast = this.listRound[this.listRound.length - 1]

        const toDay = Date.now()
        const fromTimeRoundFirst = new Date(roundFirst.fromDate.time).getTime()
        const toTimeRoundLast = new Date(roundLast.toDate.time).getTime()

        // Nếu today > time roundLast
        if (toDay > toTimeRoundLast) {
          this.day = '00'
          this.hour = '00'
          this.minute = '00'
          this.second = '00'
          this.roundCurrent = roundLast
          this.progressbar = (this.roundCurrent.percentageSold * 1000) / 10
          this.isEndOn = true
          this.isLoading = false
          this.isFinish = true
        }
        // Nếu today < time roundFirst
        if (toDay < fromTimeRoundFirst) {
          this.roundCurrent = this.listRound[0]
          this.progressbar = (this.roundCurrent.percentageSold * 1000) / 10
          this.handleGetData('from')
        }
        // Nếu fromTimeRoundFirst < today < toTimeRoundLast
        if (toDay > fromTimeRoundFirst && toDay < toTimeRoundLast) {
          forEach(this.listRound, round => {
            const fromTime = new Date(round.fromDate.time).getTime()
            if (toDay < fromTime) {
              this.roundCurrent = round
              return false
            }
          })
          this.isEndOn = false
          this.progressbar = (this.roundCurrent.percentageSold * 1000) / 10
          this.handleGetData('from')
        }
      }
    }
    handleGetData(type = 'to'): void {
      this.setRoundCurrent(this.roundCurrent)
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let _this = this
      this.countDownDate = type === 'to' ? new Date(this.roundCurrent.toDate.time).getTime() : new Date(this.roundCurrent.fromDate.time).getTime()

      this.timing = setInterval(function () {
        let now = new Date().getTime()

        let distance = _this.countDownDate - now

        //case ready start chạy hết time
        if (distance <= 0 && !_this.isEndOn) {
          console.log('vao day 1')
          _this.countDownDate = new Date(_this.roundCurrent.toDate.time).getTime()
          _this.handleTurnOnFirebase()
          _this.isEndOn = true
          _this.isLoading = false
        }

        //case chạy hết time end on và không phải round cuối
        if (distance <= 0 && _this.isEndOn && !_this.getIsEndRound) {
          _this.isLoading = true
          _this.handleTurnOnFirebase()
          _this.isEndOn = true
          _this.isLoading = false
          return
        }

        //case round cuối và hết hạn
        if (distance <= 0 && _this.isEndOn && _this.getIsEndRound) {
          clearInterval(_this.timing)
          const leadsRef = firebase.database().ref('crowd-sales')
          leadsRef.off('value', _this.listener)
          _this.isLoading = false
          return
        }

        _this.day = Math.floor(distance / (1000 * 60 * 60 * 24)) >= 10 ? Math.floor(distance / (1000 * 60 * 60 * 24)) : '0' + Math.floor(distance / (1000 * 60 * 60 * 24))
        _this.hour =
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) >= 10
            ? Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            : '0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        _this.minute =
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) >= 10
            ? Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            : '0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        _this.second = Math.floor((distance % (1000 * 60)) / 1000) >= 10 ? Math.floor((distance % (1000 * 60)) / 1000) : '0' + Math.floor((distance % (1000 * 60)) / 1000)
      }, 1000)
      this.isLoading = false
    }

    destroyed(): void {
      const leadsRef = firebase.database().ref('crowd-sales')
      leadsRef.off('value', this.listener)
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.$router.push({ name: tab.routeName })
    }
    getColor(): string {
      return '#0151fc'
    }
  }
</script>
<style scoped lang="scss">
  .bo-crowdsale {
    color: var(--bc-text-primary);
    .box-content-1 {
      display: flex;
      .round {
        width: 320px;
        // height: 196px;
        margin-right: 24px;
        padding: 24px;
        text-align: center;
        .head {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 4px;
          .title {
            margin-right: 10px;
          }
          .box-status {
            text-align: center;
            width: 57px;
            height: 18px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 600;
            line-height: 18px;
            color: var(--cl-box-status-default);
            background: var(--bg-box-status-default);
          }
          .finish {
            color: var(--cl-box-status-finish);
            background: var(--bg-box-status-finish);
          }
          .upcoming {
            color: var(--cl-box-status-upcoming);
            background: var(--bg-box-status-upcoming);
          }
        }
        .time-date {
          margin-bottom: 16px;
        }
        .box-ellipse {
          position: relative;
          margin: 0 auto;
          .mini-ellipse {
            position: absolute;
            width: 96px;
            height: 96px;
            border-radius: 50%;
            background: #fff;
            margin-left: auto;
            margin-right: auto;
            left: 0;
            right: 0;
            top: 14px;
            z-index: 999;
            .percentageSold {
              color: var(--cl-box-status-default);
            }
            .percentageSoldFinish {
              color: var(--cl-box-status-finish);
            }
            .percentageSoldUpcoming {
              color: var(--cl-box-status-upcoming);
            }
          }
        }
      }
      .progress {
        flex: 1;
        // height: 196px;
        padding: 24px;
        text-align: center;
        width: 66%;
        .title {
          margin-bottom: 4px;
        }
        .discript {
          margin-bottom: 22px;
        }
        .box-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--bc-text-discript);
          margin-bottom: 8px;
        }
        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
          .line {
            height: 32px;
            border-left: 1px solid var(--bc-line);
          }
          .box {
            width: 220px;
            height: 48px;
            .price {
              margin-bottom: 8px;
            }
          }
        }
      }
    }

    // tab active
    .table {
      margin-top: 24px;
      // width: 91vw;
      // .tab-header {
      //   height: 24px;
      //   border-bottom: 1px solid var(--bc-line);
      //   padding: 16px 12px;
      // }
      .wallet-header {
        &__above {
          border-bottom: 1px solid var(--bc-border-primary);
          &-tabs {
            .tab-item {
              padding: 16px 12px;
              position: relative;
              color: var(--bc-text-discript);
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
      .box-table {
        padding: 24px;
        min-height: 240px;
        overflow-y: auto;
      }
    }
  }
</style>
