<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input v-model="filter.search" class="input-search" :placeholder="$t('placeholder.search')">
      <span slot="prefix" class="prefix-search">
        <base-icon icon="icon-search" size="24" />
      </span>
    </el-input>
    <div class="be-flex align-center">
      <div class="filter-role">
        <el-select v-model="filter.filter" @change="handleSelectRole" popper-class="popper-select-role">
          <el-option v-for="item in listRole" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
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
    <button type="button" :class="lang === 'vi' ? 'w-auto' : null" class="btn-default-bg text-sm ml-auto add-member" @click="handleAddMember">
      <span>{{ $t('button.add-member') }}</span>
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'
  import { forEach, trim, debounce } from 'lodash'

  @Component
  export default class KycFilter extends Vue {
    @Prop({ required: true }) isChangeTab!: boolean
    filter = {
      search: '',
      filter: 'ALL',
      orderBy: 3
    }
    lang = 'en'
    loading = false
    queryApprove = {
      page: 1,
      limit: 20,
      search: ''
    }

    listRole: Record<string, any>[] = [
      {
        value: 'ALL',
        label: this.$i18n.t('member.sort.all-role')
      },
      {
        value: 'BOOKING',
        label: this.$i18n.t('member.sort.booking')
      },
      {
        value: 'SUPERADMIN',
        label: this.$i18n.t('member.sort.spadmin')
      },
      {
        value: 'ADMIN',
        label: this.$i18n.t('member.sort.admin')
      },
      {
        value: 'SUPPORT',
        label: this.$i18n.t('member.sort.support')
      },
      {
        value: 'MARKETING',
        label: this.$i18n.t('member.sort.mkt')
      },
      {
        value: 'ACCOUNTANT',
        label: this.$i18n.t('member.sort.accountant')
      },
      {
        value: 'SETUPNFT',
        label: this.$i18n.t('member.sort.setupNft')
      },
      {
        value: 'MARKETPLACEADMIN',
        label: this.$i18n.t('member.sort.marketplaceAdmin')
      }
    ]

    sorts: Array<Record<string, any>> = [
      {
        command: 1,
        label: this.$i18n.t('member.sort.full-name'),
        divided: false,
        i18n: 'member.sort.full-name'
      },
      {
        command: 2,
        label: this.$i18n.t('member.sort.email'),
        divided: false,
        i18n: 'member.sort.email'
      },
      {
        command: 3,
        label: this.$i18n.t('member.sort.create-date'),
        divided: false,
        i18n: 'member.sort.create-date'
      }
      // {
      //   command: 4,
      //   label: this.$i18n.t('kyc.sort.transaction'),
      //   divided: false,
      //   i18n: 'kyc.sort.transaction'
      // }
    ]
    sortActive = 3

    @Watch('filter.search') handleSearch(value: string): void {
      this.searchText(value)
    }

    searchText = debounce((value: string) => {
      this.$emit('filter', {
        ...this.filter,
        search: trim(value)
      })
    }, 500)

    created(): void {
      this.lang = window.localStorage.getItem('bc-lang')!
      EventBus.$on('changeTabMember', this.handleChangeTab)
      this.$emit('filter', this.filter)
    }

    destroyed(): void {
      EventBus.$off('changeLang')
      EventBus.$off('changeTab')
    }

    resetFilter(): void {
      this.filter = {
        search: '',
        filter: 'ALL',
        orderBy: 3
      }
    }

    handleChangeTab(): void {
      this.sortActive = 3
      this.filter.filter = 'ALL'
      if (this.filter.search) {
        this.resetFilter()
      } else {
        this.$emit('filter', {
          ...this.filter,

          orderBy: 3
        })
        this.filter = {
          ...this.filter,
          orderBy: 3
        }
      }
    }

    handleSelectRole(): void {
      this.$emit('filter', this.filter)
    }

    handleSort(command: number): void {
      this.sortActive = command
      this.filter.orderBy = command
      this.$emit('filter', this.filter)
    }

    handleApply(): void {
      this.$emit('filter', this.filter)
    }

    handleReset(): void {
      this.filter = {
        ...this.filter
      }
      this.$emit('filter', this.filter)
    }

    handleAddMember(): void {
      this.$emit('addMember')
    }
  }
</script>

<style scoped lang="scss">
  .kyc-filter {
    background-color: #fff;
    padding: 24px;

    .input-search {
      width: 400px;
      margin-right: 30px;
    }

    .sort {
      margin-left: 30px;
      cursor: pointer;
      color: #0a0b0d;
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

    ::v-deep .filter-role {
      .el-select {
        .el-input__inner {
          height: 48px;
          width: 140px;
          font-size: 16px;
        }
      }
    }

    .add-member {
      height: 40px;
      font-weight: 400;
      padding: 0 8px;
      &:hover {
        border: 1px solid transparent;
      }
    }
  }
</style>
