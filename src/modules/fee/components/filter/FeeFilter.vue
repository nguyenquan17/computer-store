<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input v-model="filterFee.search" class="input-search" :placeholder="$t('placeholder.search')">
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
        <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown" style="width: 230px;">
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
    <popup-fee @feeFilterBark="handleCatchBark($event)" :resetFilter="{deleteCache: isChanged}" @filterReseted="handleNormalize"/>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import EventBus from '@/utils/eventBus'
  import { forEach, trim, debounce } from 'lodash'
  import getRepository from '@/services'
  import { KycRepository } from '@/services/repositories/kyc'
  import PopupFee from './popup/PopupFee.vue'
  import PopupMixin from '@/mixins/popup'

  const apiKyc: KycRepository = getRepository('kyc')

  import countryJson from '@/utils/country/index.json'
  import { number } from '@amcharts/amcharts4/core'

  // interface IListCountry {
  //   name: string
  //   dial_code: string
  //   code: string
  // }

  @Component({ components: { PopupFee } })
  export default class FeeFilter extends Mixins(PopupMixin) {
    // @Prop({ required: true, type: Array, default: [] }) listApproveBy!: Array<Record<string, any>>
    @Prop({ required: true, type: Object, default: [] }) reseted!: Record<string, any>
    
    filterFee = {
      search: '',
      fromDate: '',
      toDate: '',
      fromAmount: '',
      toAmount: '',
      fromFee: '',
      toFee: '',
      status: 'SUCCESS',
      orderBy: '1'
    }
    popupFeeBark:any
    loading = false
    isChanged = false
    // listApprove: Array<Record<string, any>> = []
    queryApprove = {
      page: 1,
      limit: 20,
      search: ''
    }

    sorts: Array<Record<string, any>> = [
      {
        command: '1',
        label: this.$i18n.t('fee-filter.transaction-date'),
        divided: false,
        i18n: 'fee-filter.transaction-date'
      },
      {
        command: '2',
        label: this.$i18n.t('fee-filter.transaction-amount'),
        divided: false,
        i18n: 'fee-filter.transaction-amount'
      },
      {
        command: '3',
        label: this.$i18n.t('fee-filter.status'),
        divided: false,
        i18n: 'fee-filter.status'
      }
    ]
    sortActive = '1'
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
    get getSign(): any {
      return {deleteCache: this.reseted.deleteCache}
    }
    @Watch('filterFee.search') handleSearch(value: string): void {
      this.searchText(this, value)
    }
    @Watch('reseted') handleDeleteCache(value: Record<string, any>): void {
      if(this.reseted.deleteCache === true)
      {
        this.handleReset()
        this.sortActive = '1'
        this.isChanged = true
        this.$emit('reseted')
      }
    }
    searchText = debounce((_this:any, value: string) => {
      this.$emit('filterFee', {
        ..._this.filterFee,
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
      // EventBus.$on('selectTabBalance', this.handleChangeTab)
      // this.$emit('filterFee', this.filterFee)
    }

    destroyed(): void {
      EventBus.$off('changeLang')
      // EventBus.$off('changeTab')
    }
    handleCatchBark(filtersData: any):void {
      const filterFee = {
        search: this.filterFee.search,
        ...filtersData,
        orderBy: this.filterFee.orderBy
      }
      this.$emit('filterFee', filterFee)
      this.filterFee = filterFee
    }
    handleOpen():void {
      this.setOpenPopup({
        popupName: 'popup-fee',
        isOpen: true
      })
    }

    // handleShowPopper(): void {
    //   this.isVisible = true
    //   this.listApprove = [...this.listApproveBy]
    // }

    resetFilter(): void {
      this.filterFee = {
        search: '',
        fromDate: '',
        toDate: '',
        fromAmount: '',
        toAmount: '',
        fromFee: '',
        toFee: '',
        status: '',
        orderBy: ''
      }
    }

    handleSort(command: string): void {
      this.sortActive = command
      this.filterFee.orderBy = command
      this.$emit('filterFee', this.filterFee)
    }


    handleReset(): void {
      this.filterFee = {
        search: '',
        fromDate: '',
        toDate: '',
        fromAmount: '',
        toAmount: '',
        fromFee: '',
        toFee: '',
        status: '',
        orderBy: '1'
      }
      this.isVisible = false
    }
    handleNormalize():void {
      this.isChanged = false
    }
  }
</script>

<style scoped lang="scss">
  .dash {
    text-align: center;
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
