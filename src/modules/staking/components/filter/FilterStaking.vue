<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input v-model="search" class="input-search" :placeholder="$t('placeholder.search')" @input="handleSearch">
      <span slot="prefix" class="prefix-search">
        <base-icon icon="icon-search" size="24" />
      </span>
    </el-input>
    <div class="filter-item">
      <div class="cursor text-filter" style="font-size: 16px" @click="handleOpenPopupFilter">
        <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 4px" icon="icon-filter" size="18" /> </span>
        {{ $t('kyc.filter.filter') }}
      </div>
    </div>
    <div>
      <el-dropdown class="sort" trigger="click" @command="handleSort">
        <span class="abicon sort-title" style="font-size: 16px">
          <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="18" class="icon" /> {{ $t('kyc.filter.sort') }}</span
        >
        <el-dropdown-menu class="header-downloadapp dropdown-sort sort-staking" slot="dropdown">
          <el-dropdown-item
            v-for="(value, index) in getSort"
            :key="index"
            :class="filter.orderBy === value.command ? 'active' : null"
            :command="value.command"
            :divided="value.divided"
          >
            <span class="be-flex">
              <span class="be-flex-item">
                {{ value.label }}
              </span>
              <base-icon v-if="filter.orderBy === value.command" icon="icon-tick-dropdown" size="16" />
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-button v-if="$route.name === 'StakingSetup'" class="add-btn add-staking ml-auto" @click="$emit('openSetupStaking')">{{ $t('button.add-new') }}</el-button>
    <popup-filter-staking @filter="handleApplyFilter" />
    <popup-filter-staking-lvt ref="filter" @filter="handleApplyFilter" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupFilterStaking from '../popup/PopupFilterStaking.vue'
  import PopupFilterStakingLvt from '../popup/PopupFilterStakingLvt.vue'
  import { forEach, trim, debounce } from 'lodash'

  @Component({ components: { PopupFilterStaking, PopupFilterStakingLvt } })
  export default class FilterStaking extends Mixins(PopupMixin) {
    filter = {
      orderBy: ''
    }
    search = ''
    sorts: Array<Record<string, any>> = [
      {
        command: 'PLAN_NAME',
        label: this.$i18n.t('sort_package-name'),
        divided: false,
        i18n: 'sort_package-name'
      },
      {
        command: 'DURATION',
        label: this.$i18n.t('sort_duration'),
        divided: false,
        i18n: 'sort_duration'
      },
      {
        command: 'APR_PERCENT',
        label: this.$i18n.t('sort_apr'),
        divided: false,
        i18n: 'sort_apr'
      }
    ]
    sortsLvt: Array<Record<string, any>> = [
      {
        command: 'USER_ASC',
        label: this.$i18n.t('sort_investor'),
        divided: false,
        i18n: 'sort_investor'
      },
      {
        command: 'PLAN_ASC',
        label: this.$i18n.t('sort_package-name'),
        divided: false,
        i18n: 'sort_package-name'
      },
      {
        command: 'AMOUNT_DESC',
        label: this.$i18n.t('sort_amount'),
        divided: false,
        i18n: 'sort_amount'
      },
      {
        command: 'DATE_DESC',
        label: this.$i18n.t('sort_tx-date'),
        divided: false,
        i18n: 'sort_tx'
      },
      {
        command: 'END_DATE_DESC',
        label: this.$i18n.t('sort_end-stake-date'),
        divided: false,
        i18n: 'sort_end-stake-date'
      }
    ]

    get getSort(): Array<Record<string, any>> {
      return this.$route.name === 'StakingSetup' ? this.sorts : this.sortsLvt
    }

    created(): void {
      if (this.$route.name === 'StakingLVT') {
        this.filter.orderBy = 'DATE_DESC'
      }
    }

    handleSearch(value: string): void {
      this.searchText(value)
    }

    searchText = debounce((value: string) => {
      const filters = {
        ...this.filter,
        search: trim(value)
      }
      this.$emit('filter', filters)
    }, 500)

    handleSort(command: string): void {
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }

    handleOpenPopupFilter(): void {
      if (this.$route.name === 'StakingSetup') {
        this.setOpenPopup({
          popupName: 'popup-filter-staking',
          isOpen: true
        })
      } else {
        this.setOpenPopup({
          popupName: 'popup-filter-staking-lvt',
          isOpen: true
        })
      }
    }

    handleApplyFilter(form: Record<string, any>): void {
      const filters = {
        ...this.filter,
        search: trim(this.search),
        ...form
      }
      if (this.$route.name === 'StakingSetup') {
        this.setOpenPopup({
          popupName: 'popup-filter-staking',
          isOpen: false
        })
      } else {
        this.setOpenPopup({
          popupName: 'popup-filter-staking-lvt',
          isOpen: false
        })
      }
      this.$emit('filter', filters)
    }

    // khi chuyển tab ở staking LVT thì reset lại filter
    handleReset(): void {
      this.search = ''
      if (this.$route.name === 'StakingLVT') {
        this.filter.orderBy = 'DATE_DESC'
      } else {
        this.filter.orderBy = ''
      }

      //@ts-ignore
      this.$refs['filter']?.resetFilterWhenChangeTab()
    }
  }
</script>

<style scoped lang="scss">
  .error-validate {
    margin-top: -20px;
    margin-bottom: 10px;
    color: #cf202f;
  }
  .dash {
    text-align: center;
  }
  .prefix {
    height: 100%;
    font-size: 16px;
    color: #0a0b0d;
    position: absolute;
    left: 8px;
    top: 4px;
  }
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
          color: #0151fc;
          .span-icon {
            color: #0151fc !important;
          }
        }
      }
    }
    ::v-deep .sort {
      &:hover {
        .el-dropdown-selfdefine {
          color: #0151fc;
          .span-icon {
            color: #0151fc !important;
          }
        }
      }
      .sort-title {
        &:focus {
          color: #0151fc;
          .span-icon {
            color: #0151fc !important;
          }
        }
      }
    }
  }
  .add-btn {
    color: var(--bc-color-white);
    background-color: var(--bc-theme-primary);
  }
  .add-staking {
    width: 106px;
    height: 48px;
    margin-right: 24px;
    border-radius: 6px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
</style>
