<template>
  <div class="fee-nft-filter">
    <div class="wrapper">
      <el-input v-model="filterFeeNft.search" class="input-search" :placeholder="$t('placeholder.search')">
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
          <span class="abicon sort-title cursor text-grey-190" style="font-size: 16px">
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
    </div>
    <!-- <el-button type="button" class="export-excel cursor" @click="handleExport" :loading="isLoading">
      <base-icon icon="icon-excel" size="22" />
    </el-button> -->
    <popup-fee-nft @feeFilterBark="handleCatchBark($event)" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'
  import { forEach, trim, debounce } from 'lodash'
  import PopupFeeNft from '@/modules/feeNft/components/popup/PopupFeeNft.vue'
  import PopupMixin from '@/mixins/popup'

  @Component({ components: { PopupFeeNft } })
  export default class FeeNftFilter extends Mixins(PopupMixin) {
    // @Prop({ required: true, type: Array, default: [] }) listApproveBy!: Array<Record<string, any>>
    // @Prop({ required: false, type: Object, default: [] }) reseted!: Record<string, any>
    isLoading = false
    isOpen = false
    filterFeeNft = {
      search: '',
      fromDate: '',
      toDate: '',
      fromFeeAmount: '',
      toFeeAmount: '',
      fromTransactionAmount: '',
      toTransactionAmount: '',
      status: 'SUCCESS',
      orderBy: 'DATE'
    }
    popupFeeBark: any
    loading = false
    isChanged = false
    // listApprove: Array<Record<string, any>> = []
    // queryApprove = {
    //   page: 1,
    //   limit: 20,
    //   search: ''
    // }

    sorts: Array<Record<string, any>> = [
      {
        command: 'DATE',
        label: this.$i18n.t('fee-nft.fee-nft-filter.trans-date'),
        divided: false,
        i18n: 'fee-nft.fee-nft-filter.trans-date'
      },
      {
        command: 'FEE',
        label: this.$i18n.t('fee-nft.fee-nft-filter.fee'),
        divided: false,
        i18n: 'fee-nft.fee-nft-filter.fee'
      },
      {
        command: 'STATUS',
        label: this.$i18n.t('fee-nft.fee-nft-filter.status'),
        divided: false,
        i18n: 'fee-nft.fee-nft-filter.status'
      },
      {
        command: 'ITEM',
        label: this.$i18n.t('fee-nft.fee-nft-filter.item'),
        divided: false,
        i18n: 'fee-nft.fee-nft-filter.item'
      },
      {
        command: 'FROM',
        label: this.$i18n.t('fee-nft.fee-nft-filter.from'),
        divided: false,
        i18n: 'fee-nft.fee-nft-filter.from'
      }
    ]
    sortActive = 'DATE'
    // listCountry: IListCountry[] = countryJson
    // identificationType: Array<Record<string, any>> = [
    //   {
    //     id: 0,
    //     type: 'Id Card',
    //     value: 'ID_CARD'
    //   },
    //   {
    //     id: 1,
    //     type: 'Passport',
    //     value: 'PASSPORT'
    //   },
    //   {
    //     id: 2,
    //     type: 'Driver’s License',
    //     value: 'DRIVER_LICENSE'
    //   }
    // ]
    isVisible = false
    // get getSign(): any {
    //   return {deleteCache: this.reseted.deleteCache}
    // }
    @Watch('filterFeeNft.search') handleSearch(value: string): void {
      console.log('146....', this.filterFeeNft)
      this.searchText(this, value)
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
    searchText = debounce((_this: any, value: string) => {
      console.log('158...search', this.filterFeeNft)
      // _this.filterFeeNft = {
      //   ..._this.filterFeeNft,
      //   search: trim(value)
      // }
      // this.filterFeeNft.search = trim(value)
      this.$emit('filters', {
        ..._this.filterFeeNft,
        search: trim(value)
      })
      console.log('160...search', _this.filterFeeNft)
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
      EventBus.$on('done-export', this.handleDoneExport)
      // EventBus.$on('selectTabBalance', this.handleChangeTab)
      // this.$emit('filterFee', this.filterFee)
    }

    destroyed(): void {
      EventBus.$off('changeLang')
      EventBus.$off('done-export', this.handleDoneExport)
    }
    handleDoneExport(): void {
      this.isLoading = false
    }
    handleCatchBark(filtersData: any): void {
      console.log('196... catchbark', this.filterFeeNft)
      console.log('197...', filtersData)
      const filterFeeNft = {
        ...this.filterFeeNft,
        ...filtersData,
        search: this.filterFeeNft.search,
        orderBy: this.filterFeeNft.orderBy
      }
      this.$emit('filters', filterFeeNft)
      this.filterFeeNft = filterFeeNft
      console.log('203...catchbark', this.filterFeeNft)
    }
    handleOpen(): void {
      console.log('184')
      this.setOpenPopup({
        popupName: 'popup-fee-nft',
        isOpen: true
      })
    }

    // handleShowPopper(): void {
    //   this.isVisible = true
    //   this.listApprove = [...this.listApproveBy]
    // }

    resetFilter(): void {
      this.filterFeeNft = {
        search: '',
        fromDate: '',
        toDate: '',
        fromTransactionAmount: '',
        toTransactionAmount: '',
        fromFeeAmount: '',
        toFeeAmount: '',
        status: '',
        orderBy: ''
      }
    }

    handleSort(command: string): void {
      this.sortActive = command
      this.filterFeeNft.orderBy = command
      this.$emit('filters', this.filterFeeNft)
    }

    handleReset(): void {
      this.filterFeeNft = {
        search: '',
        fromDate: '',
        toDate: '',
        fromTransactionAmount: '',
        toTransactionAmount: '',
        fromFeeAmount: '',
        toFeeAmount: '',
        status: '',
        orderBy: 'DATE'
      }
      this.isVisible = false
    }
    handleNormalize(): void {
      this.isChanged = false
    }
    handleExport(): void {
      this.isLoading = true
      const timeOut = setTimeout(() => {
        EventBus.$emit('request-export')
        clearTimeout(timeOut)
      }, 1000)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.fee-nft-filter {
    width: 100%;
    height: auto;
    padding: 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .wrapper {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      .input-search {
        width: 400px;
        margin-right: 22px;
        .el-input__inner {
          width: 400px;
          // box-sizing: unset;
          padding-top: 4px;
          padding-bottom: 4px;
          padding-left: 45px;
          box-sizing: border-box;
          height: 48px;
          font-size: 16px;
        }
        .el-input__prefix {
          left: 12px;
        }
        .span-icon {
          line-height: 48px;
        }
      }
      .filter-item {
        padding: 8px;
        margin-right: 20px;
      }
    }
    .export-excel {
      width: 48px;
      // min-width: 48px;
      transition: 0.1s;
      height: 48px;
      border: 1px solid #dbdbdb;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.is-loading {
        width: 84px;
        transition: 0.1s;
      }
    }
  }
</style>
