<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input v-model="filter.search" class="input-search" :placeholder="$t('placeholder.search')" @input="handleSearch">
      <span slot="prefix" class="prefix-search">
        <base-icon icon="icon-search" size="24" />
      </span>
    </el-input>
    <div class="filter-item">
      <div class="cursor text-filter" style="font-size: 16px" @click="handleOpenFilter">
        <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
        {{ $t('kyc.filter.filter') }}
      </div>
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
          <el-dropdown-item v-for="(value, index) in sorts" :key="index" :class="filter.orderBy === value.command ? 'active' : null" :command="value.command">
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
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import { trim, debounce } from 'lodash'
  import PopupMixin from '@/mixins/popup'

  @Component
  export default class FilterRequestNft extends Mixins(PopupMixin) {
    filter = {
      search: '',
      orderBy: ''
    }
    loading = false

    sorts: Array<Record<string, any>> = [
      {
        command: 'OWNER_DESC',
        label: this.$i18n.t('sort_owner-az')
      },
      {
        command: 'OWNER_ASC',
        label: this.$i18n.t('sort_owner-za')
      },
      {
        command: 'QUANTITY',
        label: this.$i18n.t('sort_quantity')
      },
      {
        command: 'STATUS',
        label: this.$i18n.t('sort_status')
      }
    ]

    @Watch('$route.params.type') watchUrl(): void {
      this.resetFilter()
    }

    handleSearch = debounce((value: string) => {
      this.$emit('filter', {
        ...this.filter,
        search: trim(value)
      })
    }, 500)

    resetFilter(): void {
      this.filter = {
        search: '',
        orderBy: ''
      }
    }

    handleSort(command: string): void {
      this.filter.orderBy = command

      this.$emit('filter', {
        ...this.filter,
        orderBy: command
      })
    }

    handleOpenFilter(): void {
      this.setOpenPopup({
        popupName: 'popup-filter-request-nft',
        isOpen: true
      })
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
