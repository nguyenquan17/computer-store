<template>
  <div class="w-100 staking-setup">
    <div class="bg-white menu-header">
      <div class="be-flex align-center jc-space-between menu-header__above">
        <div class="menu-header__above-tabs be-flex">
          <div class="tab-item cursor" :class="$route.name === 'StakingSetup' ? 'tab-active' : null">
            <span class="text-base">{{ $t('menu.package') }}</span>
          </div>
        </div>
      </div>
    </div>
    <filter-staking @openSetupStaking="handleOpenSetupStaking" @filter="handleFilter" />
    <table-setup-staking :data="data" :query="query" @edit="openPopupEdit" @delete="openPopupDelete" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" />
    <popup-setup-staking :row="rowCurrent" :typePopup="typePopup" @reload="reload" />
    <popup-staking-delete :row="rowCurrent" @reload="init" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { namespace } from 'vuex-class'

  import FilterStaking from '../components/filter/FilterStaking.vue'
  import PopupSetupStaking from '../components/popup/PopupSetupStaking.vue'
  import TableSetupStaking from '../components/table/TableSetupStaking.vue'
  import PopupStakingDelete from '../components/popup/PopupDelete.vue'

  import getRepository from '@/services'
  import StakingRepository from '@/services/repositories/staking'
  import { IQueryStakingSetup } from '@/interface'
  import { ParamsRepository } from '@/services/repositories/params'

  const apiStaking: StakingRepository = getRepository('staking')
  const apiParams: ParamsRepository = getRepository('params')

  const beStaking = namespace('beStaking')

  @Component({ components: { FilterStaking, PopupSetupStaking, TableSetupStaking, PopupStakingDelete } })
  export default class SetupStaking extends Mixins(PopupMixin) {
    @beStaking.Mutation('SET_LIST_TYPE_STAKING') setListTypeStaking!: (list: Array<Record<string, any>>) => void

    data: Array<Record<string, any>> = []
    typePopup: 'ADD' | 'EDIT' = 'ADD'
    query: IQueryStakingSetup = {
      search: '',
      currency: '',
      durationType: '',
      startDuration: '',
      endDuration: '',
      startAPRPercent: '',
      endAPRPercent: '',
      interestType: '',
      orderBy: '',
      page: 1,
      limit: 20,
      total: 0
    }
    rowCurrent: Record<string, any> = {}

    async created(): Promise<void> {
      await this.getTypeStaking()
      await this.init()
    }

    async init(): Promise<void> {
      try {
        const result = await apiStaking.getListStakingSetup(this.query)
        console.log(result.staking)
        this.data = result.staking || []
        this.query.total = result.totalStaking
      } catch (error) {
        this.data = []
      }
    }

    async getTypeStaking(): Promise<void> {
      const promiseAll = [apiParams.getTypeStaking({ type: 'INTEREST_TYPE' }), apiParams.getTypeStaking({ type: 'DURATION_TYPE' })]
      const result = await Promise.all(promiseAll)
      this.setListTypeStaking(result)
    }

    handleSizeChange(limit: number): void {
      this.query.page = 1
      this.query.limit = limit
      this.init()
    }
    handleCurrentChange(page: number): void {
      this.query.page = page
      this.init()
    }

    handleFilter(filter: Record<string, any>): void {
      console.log(filter)
      this.query = {
        ...this.query,
        ...filter,
        page: 1
      }
      this.init()
    }

    openPopupDelete(row: Record<string, any>): void {
      if (row.totalStakedAmount) {
        const message = this.$t('notify.can-not-delete-staking') as string
        this.$message.error({ message, duration: 5000 })
        return
      }
      this.rowCurrent = row
      this.setOpenPopup({
        popupName: 'popup-staking-delete',
        isOpen: true
      })
    }
    openPopupEdit(row: Record<string, any>): void {
      this.rowCurrent = row
      this.typePopup = 'EDIT'
      this.setOpenPopup({
        popupName: 'popup-staking-setup',
        isOpen: true
      })
    }

    async handleDeletePackage(): Promise<void> {
      try {
        //
      } catch (error) {
        this.$message.error({ message: 'Delete failed', duration: 5000 })
      }
    }

    reload(): void {
      this.init()
      this.setOpenPopup({
        popupName: 'popup-staking-setup',
        isOpen: false
      })
    }

    handleOpenSetupStaking(): void {
      this.typePopup = 'ADD'
      this.setOpenPopup({
        popupName: 'popup-staking-setup',
        isOpen: true
      })
    }
  }
</script>

<style scoped lang="scss">
  .staking-setup {
    .menu-header {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);
        &-tabs {
          .tab-item {
            padding: 16px 12px;
            position: relative;
            &:hover {
              color: var(--bc-tab-active);
            }
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
    }
  }
</style>
