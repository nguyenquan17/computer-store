<template>
  <div class="be-flex jc-space-between align-center kyc-filter filter" :class="type === 'customer' ? 'mb-24' : ''">
    <div class="wrap-left be-flex align-center">
      <el-input v-model="filter.search" class="input-search" :placeholder="$t('placeholder.search')" @input="handleSearch">
        <span slot="prefix" class="prefix-search">
          <base-icon icon="icon-search" size="24" />
        </span>
      </el-input>
      <div class="cursor text-filter" style="font-size: 16px" @click="handleOpenPopupFilter">
        <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 4px" icon="icon-filter" size="18" /> </span>
        {{ $t('kyc.filter.filter') }}
      </div>
      <div v-if="type !== 'addresses'">
        <el-dropdown class="sort" trigger="click" @command="handleSort">
          <span class="abicon sort-title" style="font-size: 16px">
            <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 4px" size="18" class="icon" /> {{ $t('kyc.filter.sort') }}</span
          >
          <el-dropdown-menu class="header-downloadapp dropdown-sort" style="width: 230px" slot="dropdown">
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
    <!-- <div class="wrap-right be-flex align-center mr-24">
      <el-button type="primary" class="btn-show-popup mr-1" @click="handleClickButton('popup-add-transfer')" v-if="showBtnTransfer"><span>Transfer</span> </el-button>
      <el-button type="primary" class="btn-show-popup mr-1" @click="handleClickButton('popup-add-deposit')" v-if="showBtn"><span>Deposit</span> </el-button>
      <el-button type="button" class="export-excel" :loading="isExporting" @click="handleExport" v-if="showBtnExportExcel">
        <base-icon icon="icon-excel" size="22" />
      </el-button>
    </div> -->
  </div>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import debounce from 'lodash/debounce'
  import trim from 'lodash/trim'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')

  @Component
  export default class FilterTransaction extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: 'customer' }) type!: string
    @Prop({ required: false, type: Boolean, default: false }) showBtn!: boolean
    @Prop({ required: false, type: Boolean, default: false }) showBtnCrowdsale!: boolean
    @Prop({ required: false, type: Boolean, default: false }) showBtnTransfer!: boolean
    @Prop({ required: false, type: Boolean, default: false }) showBtnExportExcel!: boolean
    filter: Record<string, any> = {
      search: '',
      keywordString: '',
      orderBy: null
    }
    isExporting = false
    sorts: Array<Record<string, any>> = [
      {
        command: 'DATE_DESC',
        label: this.$i18n.t('customer.sort.trans-date')
      },
      {
        command: 'AMOUNT_DESC',
        label: this.$i18n.t('customer.sort.trans-amount')
      },
      {
        command: 'QUANTITY_DESC',
        label: this.$i18n.t('sort_quantity')
      },
      {
        command: 'ITEM_ASC',
        label: this.$i18n.t('sort_item')
      },
      {
        command: 'FROM_ASC',
        label: this.$i18n.t('sort_from')
      }
    ]
    sortsHub: Array<Record<string, any>> = [
      {
        command: 'DATE_DESC',
        label: this.$i18n.t('customer.sort.trans-date')
      },
      {
        command: 'FROM_ASC',
        label: this.$i18n.t('customer.sort.account-name'),
        index: 1
      },
      {
        command: 'ITEM_ASC',
        label: this.$i18n.t('customer.sort.item-name'),
        index: 2
      },
      {
        command: 'QUANTITY_DESC',
        label: this.$i18n.t('customer.sort.quantity'),
        index: 3
      },
      {
        command: 'AMOUNT_DESC',
        label: this.$i18n.t('customer.sort.trans-amount'),
        index: 4
      }
    ]
    sortActive = 'DATE_DESC'
    @Watch('$route.path', { deep: true, immediate: true }) watchRoute(to: string, from: string): void {
      if (this.type === 'transaction-nft') {
        if (to.includes('burn') || to.includes('transfer')) {
          this.sorts = [
            {
              command: 'DATE_DESC',
              label: this.$i18n.t('customer.sort.trans-date')
            },
            {
              command: 'QUANTITY_DESC',
              label: this.$i18n.t('sort_quantity')
            },
            {
              command: 'ITEM_ASC',
              label: this.$i18n.t('sort_item')
            },
            {
              command: 'FROM_ASC',
              label: this.$i18n.t('sort_from')
            }
          ]
        } else if (to.includes('staking')) {
          this.sorts = [
            {
              command: 'DATE_DESC',
              label: this.$i18n.t('customer.sort.trans-date')
            },
            {
              command: 'AMOUNT_DESC',
              label: this.$i18n.t('customer.sort.trans-amount')
            },
            {
              command: 'QUANTITY_DESC',
              label: this.$i18n.t('sort_quantity')
            },
            {
              command: 'ITEM_ASC',
              label: this.$i18n.t('sort_item')
            }
          ]
        } else {
          this.sorts = [
            {
              command: 'DATE_DESC',
              label: this.$i18n.t('customer.sort.trans-date')
            },
            {
              command: 'AMOUNT_DESC',
              label: this.$i18n.t('customer.sort.trans-amount')
            },
            {
              command: 'QUANTITY_DESC',
              label: this.$i18n.t('sort_quantity')
            },
            {
              command: 'ITEM_ASC',
              label: this.$i18n.t('sort_item')
            },
            {
              command: 'FROM_ASC',
              label: this.$i18n.t('sort_from')
            }
          ]
        }
      }
    }
    mounted(): void {
      if (this.type == 'transaction' || this.type == 'customer-transaction') {
        this.sorts = [
          {
            command: 'DATE_DESC',
            label: this.$i18n.t('customer.sort.trans-date'),
            index: 1,
            orderByName: 'transactionDate'
          },
          {
            command: 'AMOUNT_DESC',
            label: this.$i18n.t('customer.sort.trans-amount'),
            index: 2,
            orderByName: 'amount'
          },
          {
            command: 'STATUS',
            label: this.$i18n.t('customer.sort.status'),
            index: 3,
            orderByName: 'status'
          }
        ]
      }
    }

    searchText = debounce((value: string, sortActive: string, sorts: Record<any, any>[]) => {
      let filterOrderBy
      let itemOrderBy
      if (this.type == 'transaction' || this.type == 'customer-transaction') {
        itemOrderBy = sorts.find(itemCode => {
          return itemCode.command == sortActive
        })
        filterOrderBy = { orderBy: itemOrderBy?.index }
      } else {
        filterOrderBy = { orderBy: sortActive }
      }

      this.$emit('filter', {
        ...this.filter,
        ...filterOrderBy,
        page: 1,
        limit: 10,
        search: trim(value),
        keywordString: null
      })
    }, 500)

    handleSearch(value: string): void {
      this.searchText(value, this.sortActive, this.sorts)
    }

    public handleReset(): void {
      this.filter.search = ''
      this.filter.keywordString = ''
      this.filter.orderBy = 1
      this.sortActive = 'DATE_DESC'
    }
    handleSortHub(command: string): void {
      this.sortActive = command
      this.$emit('filter', { orderBy: command })
    }
    handleSort(command: string): void {
      this.sortActive = command
      let item: any = {}
      if (this.type == 'transaction' || this.type == 'customer-transaction') {
        item = this.sorts.find(itemCode => {
          return itemCode.command == this.sortActive
        })
        this.$emit('filter', { orderBy: item?.index })
      } else {
        this.$emit('filter', { orderBy: this.sortActive })
      }
    }

    handleOpenPopupFilter(): void {
      if (this.type === 'addresses') {
        this.setOpenPopup({
          popupName: 'popup-filter-addresses',
          isOpen: true
        })
      } else {
        this.setOpenPopup({
          popupName: 'popup-filter-transaction',
          isOpen: true
        })
      }
    }
    handleClickButton(popupName: string): void {
      this.$emit('clickButton', popupName)
    }
    handleExport(): void {
      this.isExporting = true
      const timeOut = setTimeout(() => {
        EventBus.$emit('start-export')
        clearTimeout(timeOut)
      }, 500)
    }
    created(): void {
      EventBus.$on('end-export', this.handleEndExport)
    }
    destroyed(): void {
      EventBus.$off('end-export', this.handleEndExport)
    }
    handleEndExport(): void {
      this.isExporting = false
    }
  }
</script>

<style scoped lang="scss">
  .filter {
    position: relative;
    .input-search {
      width: 400px;
      margin-right: 30px;
    }
    .sort {
      margin-left: 30px;
      cursor: pointer;
      color: #0a0b0d;
    }
  }
  .kyc-filter {
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
    .text-filter {
      &:hover {
        color: var(--bc-theme-primary);
        .span-icon {
          color: var(--bc-theme-primary) !important;
        }
      }
    }
  }
  .add-member {
    height: 40px;
    font-weight: 400;
    padding: 0 8px;
    margin-right: 24px;
    &:hover {
      border: 1px solid transparent;
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
  .btn-show-popup {
    height: 48px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    background: #0151fc;
    border: 1px solid #569feb;
    color: #fff;
  }
</style>
