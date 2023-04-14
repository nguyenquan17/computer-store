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
        <el-dropdown-menu class="header-downloadapp dropdown-sort sort-commission" slot="dropdown">
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
    <popup-filter-commission
      :salesMemberSearchList="salesMemberSearchList"
      :investorSearchList="investorSearchList"
      @filter="handleApplyFilter"
      @reset-filter="handleResetFilter"
      @filter-sale-remote="filterMethods.filterSaleRemote"
      @loadmore-sale-member="filterMethods.loadmoreSalesMember"
      @filter-investor-remote="filterMethods.filterInvestorRemote"
      @loadmore-investor="filterMethods.loadmoreInvestor"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupFilterCommission from '../popups/PopupFilterCommission.vue'
  import { forEach, trim, debounce } from 'lodash'
  import CommissionRepository from '@/services/repositories/commission'
  import getRepository from '@/services'

  const apiCommission: CommissionRepository = getRepository('commission')

  @Component({ components: { PopupFilterCommission } })
  export default class FilterCommission extends Mixins(PopupMixin) {
    filter = {
      salesMember: '',
      investor: '',
      fromDate: '',
      toDate: '',
      fromQuantity: '',
      toQuantity: '',
      fromAmount: '',
      toAmount: '',
      orderBy: '',
      page: 1,
      limit: 20
    }
    salesMemberSearchList: Array<Record<string, any>> = []
    querySalesMember: Record<string, any> = {
      page: 1,
      limit: 20,
      search: ''
    }

    investorSearchList: Array<Record<string, any>> = []
    queryInvestor: Record<string, any> = {
      page: 1,
      limit: 20,
      search: ''
    }

    search = ''
    sorts: Array<Record<string, any>> = [
      {
        command: 'DATE_DESC',
        label: 'Date',
        divided: false,
        i18n: ''
      },
      {
        command: 'SALES_ASC',
        label: 'Sales',
        divided: false,
        i18n: ''
      },
      {
        command: 'ITEM_ASC',
        label: this.$i18n.t('sort_item'),
        divided: false,
        i18n: ''
      },
      {
        command: 'AMOUNT_DESC',
        label: 'Amount',
        divided: false,
        i18n: ''
      },
      {
        command: 'QUANTITY_DESC',
        label: 'Quantity',
        divided: false,
        i18n: ''
      }
    ]

    get getSort(): Array<Record<string, any>> {
      return this.sorts
    }

    created(): void {
      this.filter.orderBy = 'DATE_DESC'
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

    public handleOpenPopupFilter(): void {
      this.setOpenPopup({
        popupName: 'popup-filter-commission',
        isOpen: true
      })
    }

    public handleApplyFilter(form: Record<string, any>): void {
      const filters = {
        ...this.filter,
        search: trim(this.search),
        ...form
      } as Record<string, any>
      delete filters.investorName
      delete filters.salesMemberAffiliationCode

      if (filters.fromDate) {
        filters.fromDate = this.$options.filters?.formatReferral(filters.fromDate)
      }
      if (filters.toDate) {
        filters.toDate = this.$options.filters?.formatReferral(filters.toDate + 86399000)
      }

      this.setOpenPopup({
        popupName: 'popup-filter-commission',
        isOpen: false
      })
      this.$emit('filter', filters)
    }

    public handleResetFilter(): void {
      this.search = ''
      this.filter.orderBy = 'DATE_DESC'
      this.salesMemberSearchList = []
      this.investorSearchList = []
    }

    public filterMethods = {
      filterSaleRemote: (query: string): void => {
        this.querySalesMember.search = trim(query)
        this.getSalesMemberFilterList(this.querySalesMember.search)
      },
      loadmoreSalesMember: (): void => {
        this.querySalesMember.limit += 20
        this.getSalesMemberFilterList(this.querySalesMember.search)
      },
      filterInvestorRemote: (query: string): void => {
        this.queryInvestor.search = trim(query)
        this.getInvestorList(this.queryInvestor.search)
      },
      loadmoreInvestor: (): void => {
        this.queryInvestor.limit += 20
        this.getInvestorList(this.queryInvestor.search)
      }
    }

    private async getSalesMemberFilterList(search: string): Promise<void> {
      try {
        const result = await apiCommission.getSalesMemberFilterList({
          page: this.querySalesMember.page,
          limit: this.querySalesMember.limit,
          search: trim(search) ? trim(search) : ''
        })
        this.salesMemberSearchList = result.content
      } catch (error) {
        console.log(error)
      }
    }
    private async getInvestorList(search: string): Promise<void> {
      try {
        const result = await apiCommission.searchInvestor({
          page: this.queryInvestor.page,
          limit: this.queryInvestor.limit,
          search: trim(search) ? trim(search) : ''
        })
        this.investorSearchList = result.content
      } catch (error) {
        console.log(error)
      }
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
