<template>
  <div class="flex jc-space-between">
    <div class="be-flex align-center kyc-filter">
      <el-input v-model="filterInventory.search" class="input-search" :placeholder="$t('placeholder.search')">
        <span slot="prefix" class="prefix-search">
          <base-icon icon="icon-search" size="24" />
        </span>
      </el-input>
      <div class="filter-item">
        <div class="cursor text-filter" style="font-size: 16px" @click="handleOpen">
          <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
          {{ $t('kyc.filter.filter') }}
        </div>
      </div>
      <div>
        <el-dropdown class="sort" trigger="click" @command="handleSort">
          <span class="abicon sort-title" style="font-size: 16px">
            <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="18" class="icon" /> {{ $t('kyc.filter.sort') }}</span
          >
          <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown" style="width: 230px">
            <el-dropdown-item
              v-for="(value, index) in sorts"
              :key="index"
              :class="sortActive === value.command ? 'active' : null"
              :command="value.command"
              :divided="value.divided"
            >
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
      <popup-filter-inventory :query="filterInventory" :listDataNetwork="listDataNetwork"> </popup-filter-inventory>
      <!-- <popup-fee @feeFilterBark="handleCatchBark($event)" :resetFilter="{deleteCache: isChanged}" @filterReseted="handleNormalize"/> -->
    </div>
    <el-button type="button" class="export-excel" :loading="isExporting" @click="handleExport" v-if="isShowExport">
      <base-icon icon="icon-excel" size="22" />
    </el-button>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'
  import { forEach, trim, debounce } from 'lodash'
  import getRepository from '@/services'
  import { KycRepository } from '@/services/repositories/kyc'
  import PopupFilterInventory from '@/modules/inventory/components/popup/PopupFilterInventory.vue'
  import PopupMixin from '@/mixins/popup'

  const apiKyc: KycRepository = getRepository('kyc')

  import { number } from '@amcharts/amcharts4/core'

  @Component({ components: { PopupFilterInventory } })
  export default class InventoryFilter extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array, default: [] }) listDataNetwork!: Array<Record<string, any>>
    // @Prop({ required: true, type: Array, default: [] }) listApproveBy!: Array<Record<string, any>>
    // @Prop({ required: false, type: Object, default: [] }) reseted!: Record<string, any>
    @Prop({ required: false, type: Boolean, default: false }) isShowExport!: boolean

    filterInventory: Record<string, any> = {
      search: '',
      network: '',
      fromQuantity: '',
      toQuantity: '',
      orderBy: ''
    }
    isExporting = false
    popupFeeBark: any
    loading = false
    isChanged = false
    // listApprove: Array<Record<string, any>> = []
    queryApprove = {
      page: 1,
      limit: 20,
      search: ''
    }

    handleExport(): void {
      this.isExporting = true
      const timeOut = setTimeout(() => {
        EventBus.$emit('start-export')
        clearTimeout(timeOut)
      }, 500)
    }

    handleEndExport(): void {
      this.isExporting = false
    }

    sorts: Array<Record<string, any>> = [
      {
        command: 'QUANTITY_DESC',
        label: this.$i18n.t('inventory.sorts.quantity'),
        divided: false,
        i18n: 'inventory.sorts.quantity'
      },
      {
        command: 'ITEM_ASC',
        label: this.$i18n.t('inventory.sorts.item'),
        divided: false,
        i18n: 'inventory.sorts.item'
      },
      {
        command: 'ACCOUNT_ASC',
        label: this.$i18n.t('inventory.sorts.owner'),
        divided: false,
        i18n: 'inventory.sorts.owner'
      }
    ]
    sortActive = 'QUANTITY_DESC'
    isVisible = false
    // get getSign(): any {
    //   return {deleteCache: this.reseted.deleteCache}
    // }
    @Watch('filterInventory.search') handleSearch(value: string): void {
      this.searchText(value)
    }
    // @Watch('reseted') handleDeleteCache(value: Record<string, any>): void {
    //   if(this.reseted.deleteCache === true)
    //   {
    //     this.handleReset()
    //     this.sortActive = '1'
    //     this.isChanged = true
    //     this.$emit('reseted')
    //   }
    // }
    searchText = debounce((value: string) => {
      this.$emit('filterInventory', {
        ...this.filterInventory,
        orderBy: 'QUANTITY_DESC',
        page: 1,
        limit: 10,
        search: trim(value)
      })
    }, 500)

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = parseInt(fnumber)
        if (!isNaN(fnumber)) {
          fnumber = this.$options.filters?.numberWithCommas(fnumber)
          _event.target.value = fnumber
        } else {
          _event.target.value = 0
        }
      }
    }

    created(): void {
      EventBus.$on('changeLang', () => {
        console.log('a', window.localStorage.getItem('bc-lang'))
        forEach(this.sorts, elm => {
          elm.label = this.$i18n.t(elm.i18n)
        })
        this.$forceUpdate()
      })
      EventBus.$on('end-export', this.handleEndExport)
      // EventBus.$on('selectTabBalance', this.handleChangeTab)
      // this.$emit('filterFee', this.filterFee)
    }

    destroyed(): void {
      EventBus.$off('changeLang')
      EventBus.$off('end-export', this.handleEndExport)
      // EventBus.$off('changeTab')
    }
    // handleCatchBark(filtersData: any):void {
    //   const filterInventory = {
    //     search: this.filterInventory.search,
    //     ...filtersData,
    //     orderBy: this.filterInventory.orderBy
    //   }
    //   this.$emit('filterInventory', filterInventory)
    //   this.filterInventory = filterInventory
    // }
    handleOpen(): void {
      this.setOpenPopup({
        popupName: 'popup-filter-inventory',
        isOpen: true
      })
    }

    // handleShowPopper(): void {
    //   this.isVisible = true
    //   this.listApprove = [...this.listApproveBy]
    // }
    // handleFilter(filter: Record<string, any>): void {
    //   this.query = {
    //     ...this.query,
    //     ...filter,
    //     orderBy: filter.orderBy,
    //     page: 1,
    //     limit: 10
    //   }
    //   console.log('query', this.query.orderBy)
    //   this.debounceInit()
    // }

    resetFilter(): void {
      this.filterInventory = {
        network: '',
        fromQuantity: '',
        toQuantity: '',
        orderBy: ''
      }
    }

    handleSort(command: string): void {
      this.sortActive = command
      this.filterInventory.orderBy = command
      this.$emit('filterInventory', { orderBy: this.sortActive })
    }

    handleReset(): void {
      this.filterInventory = {
        network: '',
        fromQuantity: '',
        toQuantity: '',
        orderBy: ''
      }
      this.isVisible = false
    }
    handleNormalize(): void {
      this.isChanged = false
    }
  }
</script>

<style scoped lang="scss">
  .dash {
    text-align: center;
  }
  .export-excel {
    &.is-loading {
      width: 84px;
      transition: 0.1s;
    }
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
</style>
