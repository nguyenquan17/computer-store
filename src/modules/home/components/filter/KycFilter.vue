<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input v-model="filter.search" class="input-search" :placeholder="$t('placeholder.search')">
      <span slot="prefix" class="prefix-search">
        <base-icon icon="icon-search" size="24" />
      </span>
    </el-input>
    <div class="filter-item">
      <el-popover :value="isVisible" placement="bottom-start" width="518" trigger="click" popper-class="popper-filter" @show="handleShowPopper">
        <div class="content">
          <el-form>
            <div class="be-flex jc-space-between row">
              <!-- <el-form-item class="be-flex-item mr-40" :label="$t('label.keyword')">
                <el-input :placeholder="$t('label.placehoderkeyword')" v-model="filter.keyword" clearable />
              </el-form-item> -->
              <el-form-item class="be-flex-item mr-40" :label="$t('label.nationality')">
                <el-select v-model="filter.nationality" filterable :placeholder="$t('label.placehoderNationality')" class="w-100" clearable>
                  <el-option v-for="(country, index) in listCountry" :key="index" :label="country.name" :value="country.name" />
                </el-select>
              </el-form-item>

              <el-form-item class="be-flex-item" :label="$t('label.id-type')">
                <el-select v-model="filter.identificationType" id-type :placeholder="$t('label.placehoderidType')" class="w-100" clearable>
                  <el-option v-for="(type, index) in identificationType" :key="index" :label="type.type" :value="type.value" />
                </el-select>
              </el-form-item>
            </div>
            <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item mr-40" :label="$t('label.from-date')">
                <el-date-picker
                  class="w-100"
                  format="MM/dd/yyyy"
                  :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateStart')"
                  value-format="timestamp"
                  v-model="filter.fromCreatedAt"
                  type="date"
                  :picker-options="pickerOption2"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item class="be-flex-item" :label="$t('label.to-date')">
                <el-date-picker
                  class="w-100"
                  format="MM/dd/yyyy"
                  :placeholder="$t('crowdsale.popup-filter.planceOderTransactionDateEnd')"
                  value-format="timestamp"
                  v-model="filter.toCreatedAt"
                  type="date"
                  :picker-options="pickerOption"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item" :label="$t('label.approve-by')">
                <el-select
                  v-model="filter.approvedBy"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  :placeholder="$t('label.placehoderApprove')"
                  :remote-method="handleSearchApprove"
                  :loading="loading"
                >
                  <div v-infinite-scroll="loadMoreApprove" infinite-scroll-delay="500">
                    <el-option v-for="item in listApprove" :key="item.id" :label="item.fullName" :value="item.userId"> </el-option>
                  </div>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="be-flex jc-flex-end footer">
          <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular" @click="handleReset">{{ $t('button.reset') }}</el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular" @click="handleApply">{{ $t('button.apply') }}</el-button>
        </div>
        <div slot="reference" class="cursor text-filter" style="font-size: 16px">
          <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
          {{ $t('kyc.filter.filter') }}
        </div>
      </el-popover>
      <!-- <div class="cursor text-filter" style="font-size: 16px">
        <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
        {{ $t('kyc.filter.filter') }}
      </div> -->
    </div>
    <div>
      <el-dropdown class="sort" trigger="click" @command="handleSort">
        <span class="abicon sort-title" style="font-size: 16px">
          <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="18" class="icon" /> {{ $t('kyc.filter.sort') }}</span
        >
        <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown">
          <el-dropdown-item v-for="(value, index) in sorts" :key="index" :class="sortActive === value.command ? 'active' : null" :command="value.command" :divided="value.divided">
            <span class="be-flex">
              <span class="be-flex-item">
                {{ value.label }}
              </span>
              <base-icon v-if="sortActive === value.command" icon="icon-tick-dropdown" size="16" />
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'
  import { forEach, trim, debounce } from 'lodash'
  import getRepository from '@/services'
  import { KycRepository } from '@/services/repositories/kyc'
  const apiKyc: KycRepository = getRepository('kyc')

  import countryJson from '@/utils/country/index.json'
  interface IListCountry {
    name: string
    dial_code: string
    code: string
  }
  @Component
  export default class KycFilter extends Vue {
    @Prop({ required: true, type: Array, default: [] }) listApproveBy!: Array<Record<string, any>>
    filter = {
      search: '',
      orderBy: 'CREATED_AT',
      fromCreatedAt: '',
      toCreatedAt: '',
      nationality: '',
      identificationType: '',
      approvedBy: ''
    }
    loading = false
    listApprove: Array<Record<string, any>> = []
    queryApprove = {
      page: 1,
      limit: 20,
      search: '',
      roles: 'SUPERADMIN,ADMIN,SUPPORT'
    }

    sorts: Array<Record<string, any>> = [
      {
        command: 'CREATED_AT',
        label: this.$i18n.t('kyc.sort.date'),
        divided: false,
        i18n: 'kyc.sort.date'
      },
      {
        command: 'nationality',
        label: this.$i18n.t('kyc.sort.country'),
        divided: false,
        i18n: 'kyc.sort.country'
      }
    ]
    sortActive = 'CREATED_AT'
    listCountry: IListCountry[] = countryJson
    identificationType: Array<Record<string, any>> = [
      {
        id: 0,
        type: 'Id Card',
        value: 'ID_CARD'
      },
      {
        id: 1,
        type: 'Passport',
        value: 'PASSPORT'
      },
      {
        id: 2,
        type: 'Driver’s License',
        value: 'DRIVER_LICENSE'
      }
    ]
    isVisible = false

    @Watch('filter.search') handleSearch(value: string): void {
      this.searchText(value)
    }

    searchText = debounce((value: string) => {
      let fromDate = ''
      let toDate = ''
      if (this.filter.fromCreatedAt) {
        fromDate = this.$options.filters?.formatReferral(this.filter.fromCreatedAt)
      }
      if (this.filter.toCreatedAt) {
        toDate = this.$options.filters?.formatReferral(this.filter.toCreatedAt + 86399000)
      }
      this.$emit('filter', {
        ...this.filter,
        fromCreatedAt: fromDate,
        toCreatedAt: toDate,
        search: trim(value)
      })
      // this.$emit('filter', {
      //   ...this.filter,
      //   search: trim(value)
      // })
    }, 500)

    created(): void {
      // EventBus.$on('changeLang', () => {
      //   console.log('a', window.localStorage.getItem('bc-lang'))
      //   forEach(this.sorts, elm => {
      //     elm.label = this.$i18n.t(elm.i18n)
      //   })
      //   this.$forceUpdate()
      // })
      this.handleChangeTextSort()
      EventBus.$on('changeTabKyc', this.handleChangeTab)
      this.$emit('filter', this.filter)
    }
    get pickerOption(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'from-to')
        }
      }
    }

    get pickerOption2(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'to-from')
        }
      }
    }

    disableTime(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.filter.fromCreatedAt) {
          return time.getTime() / 1000 < new Date(this.filter.fromCreatedAt).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.filter.toCreatedAt) {
          return time.getTime() / 1000 > new Date(this.filter.toCreatedAt).getTime() / 1000
        }
      }
    }
    destroyed(): void {
      EventBus.$off('changeLang')
      // EventBus.$off('changeTab')
    }

    handleChangeTextSort(): void {
      const routeName = this.$route.name!

      if (routeName === 'KycPending') {
        this.sorts[0].label = this.$i18n.t('kyc.sort.date')
      }
      if (routeName === 'KycVerified') {
        this.sorts[0].label = this.$i18n.t('kyc.sort.approve-at')
      }
      if (routeName === 'KycRejected') {
        this.sorts[0].label = this.$i18n.t('kyc.sort.reject-at')
      }
    }

    handleShowPopper(): void {
      this.isVisible = true
      this.listApprove = [...this.listApproveBy]
    }

    handleSearchApprove(query: string): void {
      if (query !== '') {
        this.loading = true
        this.queryApprove.page = 1
        this.queryApprove.search = trim(query)
        apiKyc.getListApprove(this.queryApprove).then(res => {
          this.listApprove = res.content || []
          this.loading = false
        })
      } else {
        this.listApprove = this.listApproveBy
      }
    }

    loadMoreApprove(): void {
      this.queryApprove.page += 1
      apiKyc.getListApprove(this.queryApprove).then(res => {
        this.listApprove = [...this.listApprove, ...res.content]
      })
    }

    resetFilter(): void {
      this.filter = {
        search: '',
        orderBy: 'CREATED_AT',
        fromCreatedAt: '',
        toCreatedAt: '',
        nationality: '',
        identificationType: '',
        approvedBy: ''
      }
    }

    handleChangeTab(): void {
      console.log('change tab')
      this.handleChangeTextSort()
      this.sortActive = 'CREATED_AT'
      this.queryApprove = {
        page: 1,
        limit: 20,
        search: '',
        roles: 'SUPERADMIN,ADMIN,SUPPORT'
      }

      if (this.filter.search) {
        this.resetFilter()
      } else {
        this.$emit('filter', { ...this.filter, orderBy: 'CREATED_AT', fromCreatedAt: '', toCreatedAt: '', nationality: '', identificationType: '', approvedBy: '' })
        this.filter = {
          ...this.filter,
          orderBy: 'CREATED_AT',
          fromCreatedAt: '',
          toCreatedAt: '',
          nationality: '',
          identificationType: '',
          approvedBy: ''
        }
      }
    }

    handleSort(command: string): void {
      this.sortActive = command
      this.filter.orderBy = command

      this.sortActive = command
      this.filter.orderBy = command

      let fromDate = ''
      let toDate = ''
      if (this.filter.fromCreatedAt) {
        fromDate = this.$options.filters?.formatReferral(this.filter.fromCreatedAt)
      }
      if (this.filter.toCreatedAt) {
        toDate = this.$options.filters?.formatReferral(this.filter.toCreatedAt + 86399000)
      }
      this.$emit('filter', {
        ...this.filter,
        fromCreatedAt: fromDate,
        toCreatedAt: toDate,
        orderBy: command
      })
      // this.$emit('filter', this.filter)
    }

    handleApply(): void {
      let fromDate = ''
      let toDate = ''
      if (this.filter.fromCreatedAt) {
        fromDate = this.$options.filters?.formatReferral(this.filter.fromCreatedAt)
      }
      if (this.filter.toCreatedAt) {
        toDate = this.$options.filters?.formatReferral(this.filter.toCreatedAt + 86399000)
      }
      // this.filter = {
      //   ...this.filter,
      //   fromCreatedAt: fromDate,
      //   toCreatedAt: toDate
      // }
      const filter = {
        ...this.filter,
        fromCreatedAt: fromDate,
        toCreatedAt: toDate
      }
      this.$emit('filter', filter)

      this.isVisible = false
    }

    handleReset(): void {
      this.filter = {
        ...this.filter,
        fromCreatedAt: '',
        toCreatedAt: '',
        nationality: '',
        identificationType: '',
        approvedBy: ''
      }
      this.$emit('filter', this.filter)
      this.isVisible = false
    }
  }
</script>

<style scoped lang="scss">
  .kyc-filter {
    background-color: #fff;
    .input-search {
      width: 400px;
      margin-right: 30px;
    }
    .sort {
      margin-left: 30px;
      cursor: pointer;
      color: #0a0b0d;
    }
    ::v-deep .filter-item {
      &:hover {
        .text-filter {
          color: var(--bc-theme-primary);
          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }
    }
    ::v-deep .sort {
      &:hover {
        .el-dropdown-selfdefine {
          color: var(--bc-theme-primary);
          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }
      .sort-title {
        &:focus {
          color: var(--bc-theme-primary) !important;
          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }
    }
  }
</style>
