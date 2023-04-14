<template>
  <div class="list-balance">
    <filter-main :sorts="sorts" @filter="handleFilter">
      <div class="filter-item">
        <el-popover :value="isVisible" placement="bottom-start" width="330" trigger="click" popper-class="popper-filter" @show="handleShowPopper">
          <div class="content">
            <el-form>
              <el-form-item class="be-flex-item" :label="$t('label.status')">
                <el-select v-model="filter.status" :placeholder="$t('placeholder.select-type')" class="w-100" clearable>
                  <el-option v-for="(type, index) in listStatus" :key="index" :label="type.name" :value="type.value" />
                </el-select>
              </el-form-item>
              <el-form-item class="be-flex-item" :label="$t('label.from-date')">
                <el-date-picker
                  class="w-100"
                  format="MM/dd/yyyy"
                  value-format="timestamp"
                  :placeholder="$t('label.from-date')"
                  v-model="filter.fromCreatedAt"
                  type="date"
                  :picker-options="pickerOption2"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item class="be-flex-item" :label="$t('label.to-date')">
                <el-date-picker
                  class="w-100"
                  format="MM/dd/yyyy"
                  :placeholder="$t('label.to-date')"
                  value-format="timestamp"
                  v-model="filter.toCreatedAt"
                  type="date"
                  :picker-options="pickerOption"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="be-flex jc-flex-end footer">
            <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular" @click="handleReset">
              {{ $t('button.reset') }}
            </el-button>
            <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular" @click="handleApply">
              {{ $t('button.apply') }}
            </el-button>
          </div>
          <div slot="reference" class="cursor text-filter" style="font-size: 16px">
            <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 4px" icon="icon-filter" size="18" /> </span>
            {{ $t('kyc.filter.filter') }}
          </div>
        </el-popover>
        <!-- <div class="cursor text-filter" style="font-size: 16px">
        <span class="abicon"> <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" /> </span>
        {{ $t('kyc.filter.filter') }}
      </div> -->
      </div>
    </filter-main>
    <div class="table" v-loading="isLoading" :class="isLoading ? 'list-loading' : null">
      <base-tree-table
        :data="listReferral"
        :table="query"
        :paginationInfo="getPaginationInfo"
        :showPagination="true"
        :showSummary="false"
        :default-expand-all="false"
        :rowClassName="rowClassName"
        rowKey="inviteDate"
        class="table-text-body-bold table-expanded table-width-background custom-table custom-table-height"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
      >
        <el-table-column type="expand" width="35px" align="right">
          <template slot-scope="props">
            <base-tree-table
              :data="props.row.subs"
              :showPagination="false"
              :showTableHeader="false"
              :showSummary="false"
              :default-expand-all="false"
              :rowClassName="rowClassName"
              rowKey="inviteDate"
              class="table-text-body-bold table-expanded table-width-background custom-table custom-table-height"
            >
              <el-table-column width="40px" align="right" />
              <el-table-column type="expand" width="35px" align="right">
                <template slot-scope="props1">
                  <base-tree-table
                    :data="props1.row.subs"
                    :showPagination="false"
                    :showTableHeader="false"
                    :showSummary="false"
                    :default-expand-all="false"
                    rowKey="inviteDate"
                    class="table-text-body-bold table-expanded table-width-background custom-table custom-table-height"
                  >
                    <el-table-column width="100px" align="right" />
                    <el-table-column :label="$t('customer.table.name')" class-name="no-padding-cell">
                      <template slot-scope="scope">
                        <span>{{ scope.row.fullName }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('customer.table.email')" prop="inviteEmail" width="260"> </el-table-column>
                    <el-table-column :label="$t('customer.table.tier')" prop="tier" width="100" align="center" />
                    <el-table-column :label="$t('customer.table.date')" width="200">
                      <template slot-scope="scope">
                        <span class="text-base">{{ scope.row.inviteDate | formatMMDDYY }} </span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('customer.table.status')" align="center" width="120">
                      <template slot-scope="scope">
                        <span v-if="scope.row.status" :class="checkTypeClass(scope.row.status)">{{ getTypeStatus(scope.row.status) }}</span>
                      </template>
                    </el-table-column>
                  </base-tree-table>
                </template>
              </el-table-column>
              <el-table-column :label="$t('customer.table.name')" class-name="no-padding-cell">
                <template slot-scope="scope">
                  <span>{{ scope.row.fullName }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="$t('customer.table.email')" prop="inviteEmail" width="260"> </el-table-column>
              <el-table-column :label="$t('customer.table.tier')" prop="tier" width="100" align="center" />
              <el-table-column :label="$t('customer.table.date')" width="200">
                <template slot-scope="scope">
                  <span class="text-base">{{ scope.row.inviteDate | formatMMDDYY }} </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('customer.table.status')" align="center" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.status" :class="checkTypeClass(scope.row.status)">{{ getTypeStatus(scope.row.status) }}</span>
                </template>
              </el-table-column>
            </base-tree-table></template
          >
        </el-table-column>
        <el-table-column :label="$t('customer.table.name')" class-name="no-padding-cell">
          <template slot-scope="scope">
            <span>{{ scope.row.fullName }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('customer.table.email')" prop="inviteEmail" width="260"> </el-table-column>
        <el-table-column :label="$t('customer.table.tier')" prop="tier" width="100" align="center" />
        <el-table-column :label="$t('customer.table.date')" width="200">
          <template slot-scope="scope">
            <span class="text-base">{{ scope.row.inviteDate | formatMMDDYY }} </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.status')" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status" :class="checkTypeClass(scope.row.status)">{{ getTypeStatus(scope.row.status) }}</span>
          </template>
        </el-table-column>
      </base-tree-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import FilterMain from '@/components/filter/FilterMain.vue'

  import getRepository from '@/services'
  import { CustomerRepository } from '@/services/repositories/customer'
  const apiCustomer: CustomerRepository = getRepository('customer')

  @Component({ components: { FilterMain } })
  export default class CustomerReferral extends Vue {
    @Prop({ required: true, type: Number, default: 0 }) userId!: number

    listReferral: Record<string, any>[] = []
    isLoading = false
    filter: Record<string, any> = {
      status: '',
      fromCreatedAt: null,
      toCreatedAt: null
    }
    query: Record<string, any> = {
      page: 1,
      limit: 10,
      total: 0
    }
    sorts: Array<Record<string, any>> = [
      {
        command: 3,
        label: this.$i18n.t('customer.sort.invited-date'),
        divided: false,
        i18n: 'customer.sort.invited-date'
      },
      {
        command: 1,
        label: this.$i18n.t('customer.sort.referral-name'),
        divided: false,
        i18n: 'customer.sort.referral-name'
      }
    ]

    isVisible = false

    listStatus: Array<Record<string, any>> = [
      {
        id: 0,
        name: this.$i18n.t('customer.select.sign-up'),
        value: 'SIGNED_UP'
      },
      {
        id: 1,
        name: this.$i18n.t('customer.select.invited'),
        value: 'INVITED'
      },
      {
        id: 2,
        name: this.$i18n.t('customer.select.crowdsale'),
        value: 'CROWDSALE'
      }
    ]

    created(): void {
      this.handleGetListReferral()
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
        if (this.filter.fromCreatedAt) {
          return time.getTime() / 1000 < new Date(this.filter.fromCreatedAt).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.filter.toCreatedAt) {
          return time.getTime() / 1000 > new Date(this.filter.toCreatedAt).getTime() / 1000
        }
      }
    }
    get getIndex(): number {
      return this.query.limit * (this.query.page - 1) + 1
    }

    get getPaginationInfo(): any {
      return this.$t('paging.investor')
    }

    async handleGetListReferral(): Promise<void> {
      try {
        this.isLoading = true
        const params = {
          ...this.query,
          total: null,
          userId: this.userId,
          fromCreatedAt: this.fromCreatedAt,
          toCreatedAt: this.toCreatedAt
        }
        const result = await apiCustomer.getlistReferral(params)
        this.listReferral = result.content
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleSizeChange(value: number): void {
      this.query.limit = value
      this.handleGetListReferral()
    }
    handleCurrentChange(value: number): void {
      this.query.page = value
      this.handleGetListReferral()
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = { ...this.query, ...filter, sort: filter.orderBy ? filter.orderBy : null, orderBy: null }
      this.handleGetListReferral()
    }
    fromCreatedAt = ''
    toCreatedAt = ''
    handleApply(): void {
      this.query = { ...this.query, ...this.filter, page: 1 }
      this.fromCreatedAt = ''
      this.toCreatedAt = ''
      if (this.filter.fromCreatedAt) {
        this.fromCreatedAt = this.$options.filters?.formatReferral(this.filter.fromCreatedAt)
      }
      if (this.filter.toCreatedAt) {
        this.toCreatedAt = this.$options.filters?.formatReferral(this.filter.toCreatedAt + 86399000)
      }
      this.handleGetListReferral()
      this.isVisible = false
    }

    handleReset(): void {
      this.filter = {
        status: '',
        fromCreatedAt: '',
        toCreatedAt: ''
      }
      this.query = { ...this.query, ...this.filter }
      this.handleGetListReferral()
      this.isVisible = false
    }

    handleShowPopper(): void {
      this.isVisible = true
    }

    checkTypeClass(status: string): string {
      switch (status) {
        case 'INVITED':
          return 'status-neutral status'
        case 'SIGNED_UP':
          return 'status-warning status'
        default:
          return 'status-success status'
      }
    }
    getTypeStatus(status: string): any {
      if (status === 'INVITED') {
        return this.$t('customer.table.invited')
      } else if (status === 'SIGNED_UP') {
        return this.$t('customer.table.signedup')
      } else {
        return this.$t('customer.table.crowdsale')
      }
    }
    rowClassName(params: Record<string, any>): string {
      const { row } = params
      if (row.subs) {
        return 'have-subs'
      }
      return 'no-sub'
    }
  }
</script>

<style scoped lang="scss">
  .list-balance {
    .input-search {
      width: 400px;
      margin-right: 30px;
    }
    .sort {
      cursor: pointer;
      color: #0a0b0d;
    }
    .list-loading {
      min-height: 200px;
    }
    .table {
      padding: 0 24px;
      .small {
        font-size: 14px !important;
        line-height: 16px;
        color: #5b616e;
      }
    }
  }
</style>
