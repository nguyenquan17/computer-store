<template>
  <div class="w-100 bo-kyc">
    <div class="bg-white wallet-header">
      <div class="be-flex align-center jc-space-between wallet-header__above">
        <div class="wallet-header__above-tabs be-flex">
          <div class="tab-item cursor" v-for="tab in tabs" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
            <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
          </div>
        </div>
      </div>
    </div>

    <member-filter @filter="handleFilter" :is-change-tab="isChangeTab" @addMember="handleAddMember" />
    <member-table
      v-loading="isLoading"
      @rowClick="handleRowClick"
      @edit="handleClickEdit"
      @sizeChange="handleSizeChange"
      @pageChange="handlePageChange"
      :query="query"
      :data="data"
    />

    <popup-member :type="type" :detailRow="detailRow" @reload="init" />
    <popup-detail-member :detailRow="detailRow" @openEdit="handleClickEdit" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  //@ts-ignore
  import MemberTable from '../components/MemberTable.vue'
  import MemberFilter from '../components/filter/MemberFilter.vue'
  import PopupMember from '../components/popup/PopupMember.vue'
  import PopupDetailMember from '../components/popup/PopupDetailMember.vue'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { MemberRepository } from '@/services/repositories/member'
  import EventBus from '@/utils/eventBus'
  import { debounce } from 'lodash'
  import { MODULE_WITH_ROUTENAME } from '@/configs/role'

  import { namespace } from 'vuex-class'
  const bcKyc = namespace('bcKyc')
  const bcAuth = namespace('beAuth')

  const apiMember: MemberRepository = getRepository('member')
  interface IQuery {
    page?: number
    limit?: number
    search?: string
    orderBy: string | number
    total: number
    status?: string | null | undefined
    filter?: string
  }

  @Component({ components: { MemberTable, MemberFilter, PopupMember, PopupDetailMember } })
  export default class BOCustomer extends Mixins(PopupMixin) {
    @bcKyc.Action('getListReason') getListReason!: () => void
    @bcAuth.Getter('listModuleCanView') listModuleCanView!: Array<Record<string, any>>

    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'member-active',
        routeName: 'MemberActive'
      },
      {
        id: 2,
        title: 'member-inactive',
        routeName: 'MemberInactive'
      }
    ]
    titlePending = ''
    tabActive = 'Pending'
    isLoading = false
    isChangeTab = false
    isConflickClick = false

    type = 'add'

    data: Array<Record<string, any>> = []

    detailRow = {}

    query: IQuery = {
      orderBy: 3,
      page: 1,
      limit: 10,
      total: 10,
      status: null
    }

    objType: Record<string, any> = {
      MemberActive: 'ACTIVE',
      MemberInactive: 'INACTIVE'
    }

    created(): void {
      // if (!this.checkPemission('customer', ['view'])) {
      //   const routeName = MODULE_WITH_ROUTENAME[this.listModuleCanView[0].module]
      //   this.$router.push({ name: routeName })
      //   return
      // }

      const name = this.$route.name!
      this.query.status = this.objType[name]
    }

    async init(): Promise<void> {
      try {
        this.isLoading = true
        const routeName = this.$route.name!
        this.query.status = this.objType[routeName]
        const result = await apiMember.getListMember({ ...this.query, total: null })
        this.data = result.members || []
        this.query.total = result.totalElement
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleChangeTab(tab: Record<string, any>): void {
      this.isChangeTab = tab.id !== 1
      this.$router.push({ name: tab.routeName }).then(() => {
        this.resetQuery()
        EventBus.$emit('changeTabMember')
      })
    }

    resetQuery(): void {
      this.query = {
        ...this.query,
        page: 1,
        limit: 10,
        search: '',
        orderBy: 3
      }
    }

    handlePageChange(page: number): void {
      this.query.page = page
      this.init()
    }
    handleSizeChange(limit: number): void {
      this.query.limit = limit
      this.init()
    }

    handleRowClick(row: Record<string, any>): void {
      this.detailRow = row
      this.setOpenPopup({
        popupName: 'popup-detail-member',
        isOpen: true
      })
    }
    handleClickEdit(row: Record<string, any>): void {
      this.type = 'edit'
      this.detailRow = row
      this.setOpenPopup({
        popupName: 'popup-member',
        isOpen: true
      })
    }

    handleFilter(filter: Record<string, any>): void {
      if (this.isLoading) {
        return
      }
      this.query = {
        ...this.query,
        ...filter,
        filter: filter.filter === 'ALL' ? null : filter.filter,
        page: 1,
        limit: 10
      }
      this.init()
      // this.debounceInit()
    }
    debounceInit = debounce(() => {
      this.init()
    }, 300)

    handleAddMember(): void {
      this.type = 'add'
      this.setOpenPopup({
        popupName: 'popup-member',
        isOpen: true
      })
    }
  }
</script>

<style scoped lang="scss">
  .bo-kyc {
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
    .wallet-header {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);
        &-tabs {
          .tab-item {
            padding: 16px 12px;
            position: relative;
            &:hover {
              color: var(--bc-tab-active);
            }
            // .text-base {
            //   color: #5b616e;
            // }
          }
          .tab-active {
            color: var(--bc-tab-active);
            font-weight: 600;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 2px;
              bottom: 0;
              left: 0;
              background-color: var(--bc-tab-active);
            }
          }
        }
      }

      &__below {
        padding: 24px;
        &-amount {
          .amount-wallet,
          .amount-lock {
            flex: 1;
            .title {
              margin-left: 16px;
              .title-coin {
                color: #201f1e;
              }
            }
            .amount {
              margin-top: 10px;

              .amount-btc {
                color: var(--bc-amount-btc);
              }
              .amount-lyn {
                color: var(--bc-amount-lin);
              }
              .amount-lock {
                color: var(--bc-amount-lock);
              }
            }
          }
          .amount-wallet {
            border-right: 1px solid var(--bc-border-primary);
          }
        }
      }
    }
  }
</style>
