<template>
  <div class="bo-crowdsale-transaction">
    <div class="be-flex mb-24 round-tab">
      <div
        v-for="(round, index) in listRound"
        :key="round.id"
        :class="index === tabActive ? 'round-active text-bold' : null"
        class="text-base cursor round-item"
        @click="handleChangeTab(index)"
      >
        <span>{{ round.name }}</span>
      </div>
    </div>

    <div class="box-filter be-flex align-center kyc-filter pl-0">
      <div class="box-search">
        <el-input v-model="query.search" class="input-search" :placeholder="$t('placeholder.search')">
          <span slot="prefix" class="prefix-search">
            <base-icon icon="icon-search" size="24" />
          </span>
        </el-input>
      </div>
      <div class="btn-filter be-flex align-center cursor">
        <el-popover :value="isVisible" placement="bottom-start" width="400" trigger="click" popper-class="popper-filter-request-withdraw" @show="handleShowPopper">
          <div class="content">
            <div class="label">{{ $t('crowdsale.filter-popper.added-by') }}</div>
            <div class="be-flex jc-space-between row box">
              <el-select
                v-model="query.createdBy"
                filterable
                remote
                reserve-keyword
                :remote-method="handleSearchAddedBy"
                :placeholder="$t('crowdsale.filter-popper.pl-createdBy')"
                clearable
              >
                <el-option v-for="item in listCreatedBy" :key="item.id" :label="item.fullName" :value="item.userId" />
              </el-select>
            </div>
            <div class="label">{{ $t('crowdsale.filter-popper.added-date') }}</div>
            <div class="be-flex jc-space-between align-center row box">
              <el-date-picker
                v-model="query.fromDate"
                value-format="timestamp"
                format="MM/dd/yyyy"
                clearable
                type="date"
                :placeholder="$t('crowdsale.filter-popper.pl-fromDate')"
                class="box-input-request-date"
                :picker-options="pickerOption2"
              >
              </el-date-picker>
              <div class="line" style="margin: 0 5px"></div>
              <el-date-picker
                v-model="query.toDate"
                value-format="timestamp"
                format="MM/dd/yyyy"
                clearable
                type="date"
                :placeholder="$t('crowdsale.filter-popper.pl-toDate')"
                class="box-input-request-date"
                :picker-options="pickerOption"
              >
              </el-date-picker>
            </div>

            <div class="be-flex jc-flex-end footer">
              <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular" @click="handleResetFilter">
                {{ $t('button.reset') }}
              </el-button>
              <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular" @click="handleApply">
                {{ $t('button.apply') }}
              </el-button>
            </div>
          </div>
          <div slot="reference" class="btn-filter be-flex align-center cursor">
            <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="16" /> <span class="fs-16">{{ $t('crowdsale.filter') }}</span>
          </div>
        </el-popover>
      </div>
      <el-dropdown class="sort cursor" trigger="click" @command="handleSort">
        <div class="sort-title be-flex align-center">
          <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="16" class="icon" /> <span class="fs-16">{{ $t('crowdsale.sortBy') }}</span>
        </div>
        <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown" style="width: 232px">
          <el-dropdown-item v-for="(value, index) in sorts" :key="index" :class="sortActive === value.command ? 'active' : null" :command="value.command">
            <span class="be-flex">
              <span class="be-flex-item">
                {{ value.label }}
              </span>
              <base-icon v-if="sortActive === value.command" icon="icon-tick-dropdown" size="16" />
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <button
        v-if="tabActive >= indexRoundCurrent"
        type="button"
        :class="lang === 'vi' ? 'w-auto' : null"
        class="btn-default-bg text-sm ml-auto add-member"
        @click="handleAddMember"
      >
        <span>{{ $t('button.add-buyer') }}</span>
      </button>
    </div>
    <div class="table">
      <base-table
        :data="dataTable"
        :table="query"
        :paginationInfo="getPaginationInfo"
        :emptyDefault="emptyDefault"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        v-loading="isLoading"
        class="base-table table-crowdsale"
      >
        <el-table-column label="#" :index="indexMethod" type="index" align="center" width="60" />
        <el-table-column :label="$t('crowdsale.full-name')" prop="fullName" />
        <el-table-column label="Email" prop="userEmail" width="300" class-name="col-email"> </el-table-column>
        <el-table-column :label="this.$t('crowdsale.add-date')" prop="createdAt" align="left" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | formatDateHourMs }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('crowdsale.add-by')" prop="createdByFullName " width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createdByFullName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" v-if="tabActive >= indexRoundCurrent">
          <template slot-scope="scope">
            <span @click="handleEdit(scope.row.userId)">
              <base-icon icon="icon-edit" size="24" style="margin-right: 5px" />
            </span>
            <span @click="handleDelete(scope.row)">
              <base-icon icon="icon-delete" size="24" />
            </span>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <popup-setting-round-member :type="type" :userId="userId" :listRound="listRound" @reload="init" :tabActive="tabActive" />
    <popup-confirm @reload="init" :userId="userId" :listRound="listRound" :tabActive="tabActive" />
  </div>
</template>
<script lang="ts">
  import { Mixins, Component, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupFilterCrowdsale from '../components/popup/PopupFilterCrowdsale.vue'
  import PopupSettingRoundMember from '../components/popup/PopupSettingRoundMember.vue'
  import PopupConfirm from '../components/popup/PopupConfirmTable.vue'
  import getRepository from '@/services'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'
  import firebase from '@/utils/firebase'
  import { debounce, findIndex, trim } from 'lodash'
  import { namespace } from 'vuex-class'

  const crowdsaleBo = namespace('crowdsaleBo')
  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')

  @Component({ components: { PopupFilterCrowdsale, PopupSettingRoundMember, PopupConfirm } })
  export default class SettingRound extends Mixins(PopupMixin) {
    @crowdsaleBo.State('roundCurrent') roundCurrent!: Record<string, any>

    tabActive = 0
    type = 'add'
    userId = 0
    listRound: Array<Record<string, any>> = []

    isVisible = false

    query: Record<string, any> = {
      search: '',
      limit: 10,
      page: 1,
      orderBy: 'CREATED_AT',
      total: 0
    }

    listCreatedBy: Array<Record<string, any>> = []

    listener: any = null
    lang = 'en'

    dataProp: any = {}
    isLoading = false
    emptyDefault = false

    dataTable: Record<string, any>[] = []
    sortActive = 'CREATED_AT'

    sorts: Array<Record<string, any>> = [
      {
        command: 'USER_FULL_NAME',
        label: this.$i18n.t('crowdsale.sort.full-name')
      },
      {
        command: 'CREATED_AT',
        label: this.$i18n.t('crowdsale.sort.added-at')
      }
    ]

    queryAddedBy = {
      page: 1,
      limit: 1000,
      search: '',
      roles: 'SUPERADMIN,ADMIN,ACCOUNTANT'
    }

    get getPaginationInfo(): any {
      return this.$t('paging.buyer')
    }

    get indexRoundCurrent(): number {
      if (this.listRound.length && this.roundCurrent) {
        return findIndex(this.listRound, round => round.id === this.roundCurrent.id)
      }
      return 0
    }

    get pickerOption(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'from-to')
        }
      }
    }

    get pickerOption2(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'to-from')
        }
      }
    }

    disableTime(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.query.fromDate) {
          return time.getTime() / 1000 < new Date(this.query.fromDate).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.query.toDate) {
          return time.getTime() / 1000 > new Date(this.query.toDate).getTime() / 1000
        }
      }
    }
    mounted(): void {
      this.lang = window.localStorage.getItem('bc-lang')!
      this.init(true)
    }

    @Watch('query.search')
    handleSearch(): void {
      this.debounceInit()
    }

    debounceInit = debounce(() => {
      this.query.page = 1
      this.query.limit = 10
      this.init()
    }, 500)

    async init(firstTime = false): Promise<void> {
      try {
        this.isLoading = true
        const leadsRef = firebase.database().ref('crowd-sales')
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let _this = this

        const params = {
          ...this.query,
          fromDate: this.fromDate,
          toDate: this.toDate
        }
        if (!this.listRound.length) {
          this.listener = leadsRef.once('value', async function (snapshot) {
            _this.listRound = snapshot.val()
            const roundCurrent = snapshot.val()[_this.tabActive]
            const result = await apiCrowdsale.getListUserInRound({ ...params, roundId: roundCurrent.id })
            _this.dataTable = result.content || []
            _this.query.total = result.totalElements
            if (!_this.query.total && firstTime) {
              _this.emptyDefault = false
            }
            if (!_this.query.total && !firstTime) {
              _this.emptyDefault = true
            }
          })
        } else {
          const roundCurrent = this.listRound[_this.tabActive]
          const result = await apiCrowdsale.getListUserInRound({ ...params, roundId: roundCurrent.id })
          _this.dataTable = result.content || []
          _this.query.total = result.totalElements
          if (!_this.query.total && firstTime) {
            _this.emptyDefault = false
          }
          if (!_this.query.total && !firstTime) {
            _this.emptyDefault = true
          }
        }
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    }

    handleShowPopper(): void {
      this.isVisible = true
      // const params = {
      //   page: 1,
      //   limit: 1000,
      //   roles: 'ADMIN,ACCOUNTANT'
      // }
      if (!this.listCreatedBy.length) {
        apiCrowdsale.getListCreatedBy({ ...this.queryAddedBy }).then(res => {
          this.listCreatedBy = res.content || []
        })
      }
    }

    handleResetFilter(): void {
      ;(this.fromDate = ''), (this.toDate = '')
      this.query = {
        ...this.query,
        fromDate: null,
        toDate: null,
        createdBy: null
      }
      this.isVisible = false
      this.init()
    }
    fromDate = ''
    toDate = ''
    handleApply(): void {
      this.query.page = 1
      this.query.limit = 10
      this.fromDate = ''
      this.toDate = ''
      if (this.query.fromDate) {
        this.fromDate = this.$options.filters?.formatReferral(this.query.fromDate)
      }
      if (this.query.toDate) {
        this.toDate = this.$options.filters?.formatReferral(this.query.toDate + 86399000)
      }

      this.init()
      this.isVisible = false
    }

    handleChangeTab(index: number): void {
      this.emptyDefault = false
      this.tabActive = index
      this.sortActive = 'CREATED_AT'
      ;(this.fromDate = ''), (this.toDate = '')
      this.query = {
        search: this.query.search,
        limit: 10,
        page: 1,
        orderBy: 'CREATED_AT',
        total: 0
      }
      if (this.query.search) {
        this.query.search = ''
      } else {
        this.init(true)
      }
    }

    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleSizeChange(value: number): void {
      this.query.limit = value
      this.query.page = 1

      this.init()
    }
    handleCurrentChange(value: number): void {
      this.query.page = value

      this.init()
    }
    handleOpenPopupFilter(): void {
      this.setOpenPopup({
        popupName: 'popup-filter-crowdsale',
        isOpen: true
      })
    }

    handleSort(command: string): void {
      this.sortActive = command
      this.query.orderBy = command
      this.init()
    }

    handleAddMember(): void {
      this.type = 'add'
      this.setOpenPopup({
        popupName: 'popup-setting-round-member',
        isOpen: true
      })
    }

    handleEdit(userId: number): void {
      this.userId = userId
      this.type = 'edit'
      this.setOpenPopup({
        popupName: 'popup-setting-round-member',
        isOpen: true
      })
    }

    handleDelete(row: Record<string, any>): void {
      this.userId = row.userId
      this.setOpenPopup({
        popupName: 'popup-confirm-buyer-table',
        isOpen: true
      })
    }

    handleSearchAddedBy(query: string): void {
      // if (query !== '') {
      //   this.queryAddedBy.search = trim(query)
      //   apiCrowdsale.getListCreatedBy(this.queryAddedBy).then(res => {
      //     this.listCreatedBy = res.content || []
      //   })
      // } else {
      //   this.listApprove = this.listApproveBy
      // }
      this.queryAddedBy.search = trim(query)
      apiCrowdsale.getListCreatedBy(this.queryAddedBy).then(res => {
        this.listCreatedBy = res.content || []
      })
    }
  }
</script>
<style scoped lang="scss">
  .bo-crowdsale-transaction {
    .round-tab {
      width: fit-content;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--bc-theme-primary);
      .round-item {
        padding: 8px 24px;
      }
      .round-item:not(:last-child) {
        border-right: 1px solid #dbdbdb;
      }
      .round-active {
        color: #fff;
        background-color: var(--bc-theme-primary);
      }
    }

    .box-filter {
      margin-bottom: 24px;
    }
    .box-search {
      .input-search {
        width: 400px;
        margin-right: 29px;
        .prefix-search {
          margin-top: 9px;
          margin-left: 3px;
        }
      }
    }
    .btn-filter,
    .sort {
      margin-right: 27.5px;
      color: var(--bc-text-primary);
      .span-icon {
        color: var(--bc-text-primary) !important;
      }
    }
    .dropdown-sort {
      min-width: 250px !important;
    }
    .table {
      .table-crowdsale {
        .box-status-tabel {
          width: 80px;
          height: 24px;
          background: #e4f9e2;
          color: #129961;
          border-radius: 4px;
          margin: 0 auto;
        }
        .failed {
          background: #fff3e2;
          color: #dd7d00;
        }
        .locked {
          background: #fbedee;
          color: #cf202f;
        }
        .text-paid {
          color: #cf202f;
        }
        .text-amount {
          color: #129961;
        }
        .avi {
          color: #5b616e;
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
  .btn-filter {
    margin-right: 15px !important;
    &:hover {
      color: var(--bc-theme-primary) !important;
      .span-icon {
        color: var(--bc-theme-primary) !important;
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
  .input-search {
    width: 400px;
    margin-right: 30px;
  }
</style>
