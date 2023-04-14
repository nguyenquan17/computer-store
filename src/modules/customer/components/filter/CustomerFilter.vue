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
              <el-form-item class="be-flex-item mr-40" :label="$t('label.create-date')">
                <el-date-picker
                  class="w-100"
                  format="MM/dd/yyyy"
                  value-format="timestamp"
                  :placeholder="$t('label.from-date')"
                  v-model="filter.fromCreatedAt"
                  type="date"
                  :picker-options="pickerOption2"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item class="be-flex-item hide-label" label="1">
                <el-date-picker
                  class="w-100"
                  format="MM/dd/yyyy"
                  :placeholder="$t('label.to-date')"
                  value-format="timestamp"
                  v-model="filter.toCreatedAt"
                  type="date"
                  :picker-options="pickerOption"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="be-flex jc-space-between row">
              <el-form-item class="be-flex-item mr-40" :label="$t('label.kyc-status')">
                <el-select v-model="filter.type" id-type :placeholder="$t('label.placehoder-kyc-status')" class="w-100" clearable :disabled="isChangeTab">
                  <el-option v-for="(type, index) in identificationType" :key="index" :label="type.type" :value="type.value" />
                </el-select>
              </el-form-item>
              <el-form-item class="be-flex-item" label="Level">
                <el-select v-model="filter.level" id-type placeholder="Level" class="w-100" clearable>
                  <el-option v-for="(type, index) in listLevel" :key="index" :label="type.title" :value="type.value" />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="be-flex jc-flex-end footer">
          <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular" @click="handleReset">
            {{ $t('button.reset') }}
          </el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular" @click="handleApply">
            {{ $t('button.apply') }}
          </el-button>
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
    @Prop({ required: true }) isChangeTab!: boolean
    filter = {
      search: '',
      orderBy: 1,
      fromCreatedAt: '',
      toCreatedAt: '',
      nationality: '',
      type: '',
      approvedBy: '',
      level: ''
    }
    loading = false
    queryApprove = {
      page: 1,
      limit: 20,
      search: ''
    }

    listLevel: Array<Record<string, any>> = [
      {
        title: 'Default',
        value: 'DEFAULT'
      },
      {
        title: 'Level 1',
        value: 'LEVEL_1'
      },
      {
        title: 'Level 2',
        value: 'LEVEL_2'
      },
      {
        title: 'Level 3',
        value: 'LEVEL_3'
      },
      {
        title: 'Level 4',
        value: 'LEVEL_4'
      },
      {
        title: 'Level 5',
        value: 'LEVEL_5'
      },
      {
        title: 'MM',
        value: 'MM'
      }
    ]

    sorts: Array<Record<string, any>> = [
      {
        command: 1,
        label: 'Created date',
        divided: false,
        i18n: 'Created date'
      },
      {
        command: 2,
        label: 'Last login',
        divided: false,
        i18n: 'Last login'
      }
      // {
      //   command: 3,
      //   label: this.$i18n.t('kyc.sort.full-name'),
      //   divided: false,
      //   i18n: 'kyc.sort.full-name'
      // },
      // {
      //   command: 4,
      //   label: this.$i18n.t('kyc.sort.transaction'),
      //   divided: false,
      //   i18n: 'kyc.sort.transaction'
      // }
    ]
    sortActive = 1
    listCountry: IListCountry[] = countryJson
    identificationType: Array<Record<string, any>> = [
      {
        id: 0,
        type: this.$i18n.t('kyc.filter.all-status'),
        value: ''
      },
      // {
      //   id: 1,
      //   type: this.$i18n.t('kyc.filter.kyc-processing'),
      //   value: 'KYC'
      // },
      // {
      //   id: 2,
      //   type: this.$i18n.t('kyc.filter.not-verified'),
      //   value: 'NOT_VERIFIED'
      // },
      {
        id: 3,
        type: this.$i18n.t('kyc.filter.verified'),
        value: 'VERIFIED'
      }
      // {
      //   id: 4,
      //   type: this.$i18n.t('kyc.filter.locked'),
      //   value: 'LOCKED'
      // }
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
    }, 500)

    created(): void {
      EventBus.$on('changeTabCustomer', this.handleChangeTab)
      this.$emit('filter', this.filter)
    }

    destroyed(): void {
      EventBus.$off('changeLang')
      EventBus.$off('changeTab')
    }

    handleShowPopper(): void {
      switch (this.$route.name) {
        case 'CustomerVerified':
          this.filter.type = this.$i18n.t('kyc.tabFilter.verified') as string
          break
        case 'CustomerLocked':
          this.filter.type = this.$i18n.t('kyc.tabFilter.locked') as string
          break
        case 'CustomerNotVerified':
          this.filter.type = this.$i18n.t('kyc.tabFilter.not-verified') as string
          break
        case 'CustomerProcessing':
          this.filter.type = this.$i18n.t('kyc.tabFilter.kyc-processing') as string
          break
      }
      this.isVisible = true
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

    resetFilter(): void {
      this.filter = {
        search: '',
        orderBy: 1,
        fromCreatedAt: '',
        toCreatedAt: '',
        nationality: '',
        type: '',
        approvedBy: '',
        level: ''
      }
    }

    handleChangeTab(): void {
      this.sortActive = 1
      this.queryApprove = {
        page: 1,
        limit: 20,
        search: ''
      }

      if (this.filter.search) {
        this.resetFilter()
      } else {
        this.$emit('filter', {
          ...this.filter,
          orderBy: 1,
          fromCreatedAt: '',
          toCreatedAt: '',
          nationality: '',
          type: '',
          approvedBy: '',
          level: ''
        })
        this.filter = {
          ...this.filter,
          orderBy: 1,
          fromCreatedAt: '',
          toCreatedAt: '',
          nationality: '',
          type: '',
          approvedBy: '',
          level: ''
        }
      }
    }

    handleSort(command: number): void {
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

      console.log('trrr', this.filter)
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
        type: '',
        approvedBy: '',
        level: ''
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
          color: var(--bc-theme-primary);

          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }
    }
  }
</style>
