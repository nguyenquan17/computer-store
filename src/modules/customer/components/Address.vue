<template>
  <div class="list-address">
    <!--    <filter-main :sorts="sorts" @filter="handleFilter" :isShowSort="true" />-->
    <filter-transaction @filter="handleFilter" :type="'addresses'" />
    <div class="table" v-loading="isLoading" :class="isLoading ? 'list-loading' : null" style="margin-top: 24px">
      <base-table :data="listAddress" :showPagination="false" class="base-table table-wallet">
        <el-table-column label="#" type="index" align="center" width="40" />
        <el-table-column :label="$t('customer.table.asset')" width="144">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <base-icon :icon="getIcon(scope.row.currency)" size="24" />
              <span style="padding-left: 8px" class="d-ib">{{ scope.row.currencyName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('customer.table.network')" width="200">
          <template slot-scope="scope">
            <span class="text-base">{{ scope.row.networkName }}</span>
            <span class="d-block small">{{ scope.row.network }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.wallet-address')" width="310">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <span class="d-ib">{{ scope.row.address | formatTransactionCode(15) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.address" class="icon-copy" @click="handleCopyTransaction(scope.row)">
              <base-icon icon="icon-copy" size="24" />
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.create-date')">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | formatMMDDYY }} </span>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <popup-filter-addresses @filter="handleFilter" :listAssetNetwork="listAssetNetwork" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import FilterMain from '@/components/filter/FilterMain.vue'

  import getRepository from '@/services'
  import { CustomerRepository } from '@/services/repositories/customer'
  const apiCustomer: CustomerRepository = getRepository('customer')
  import FilterTransaction from '@/components/filter/FilterTransaction.vue'
  import PopupFilterAddresses from '@/components/popup/PopupFilterAddresses.vue'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  @Component({ components: { FilterMain, FilterTransaction, PopupFilterAddresses } })
  export default class CustomerAddress extends Vue {
    @Prop({ required: true, type: Number, default: 0 }) userId!: number
    listAddress: Record<string, any>[] = []
    listAssetNetwork: Record<string, any>[] = []
    isLoading = false
    query: Record<string, any> = {
      search: null,
      page: 1,
      limit: 10,
      network: null,
      total: null,
      currency: null,
      toCreatedAt: null,
      fromCreatedAt: null
    }
    sorts: Array<Record<string, any>> = [
      {
        command: 1,
        label: this.$i18n.t('customer.sort.create-date'),
        divided: false,
        i18n: 'customer.sort.create-date'
      }
    ]

    created(): void {
      this.handleGetListAddress()
      this.handleGetListAssetNetwork()
    }

    async handleGetListAddress(): Promise<void> {
      try {
        const params = {
          ...this.query,
          // userId: this.query.userId,
          limit: this.query.limit,
          page: this.query.page,
          fromCreatedAt: this.query.fromCreatedAt,
          toCreatedAt: this.query.toCreatedAt,
          total: null
        }
        this.isLoading = true
        const result = await apiCustomer.getlistAddress(this.userId, params)
        this.listAddress = result.content
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }
    async handleGetListAssetNetwork(): Promise<void> {
      try {
        const result = await apiCustomer.getlistAssetNetwork()
        this.listAssetNetwork = result.filter(items => {
          return items.currency !== 'CLM' && items.currency !== 'HUB'
        })
      } catch (error) {
        console.log(error)
      }
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = { ...this.query, ...filter }
      this.handleGetListAddress()
    }

    handleCopyTransaction(row: Record<string, any>): void {
      let message: any = ''
      const el = document.createElement('input')
      el.value = row.address
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }

    getIcon(asset: string): string {
      switch (asset) {
        case 'BNB':
          return 'icon-bnb'
        case 'BTC':
          return 'icon-btc'
        case 'ETH':
          return 'icon-eth'
        case 'CLM':
          return 'icon-clm'
        case 'USDC':
          return 'icon-usdc'
        case 'USDT':
          return 'icon-usdt'
        case 'BUSD':
          return 'icon-busd'

        default:
          return 'icon-lin'
      }
    }

    getAssetTitle(asset: string): string {
      switch (asset) {
        case 'BNB':
          return 'Binance'
        case 'BTC':
          return 'Bitcoin'
        case 'ETH':
          return 'Ethereum'
        case 'CLM':
          return 'Clm'
        case 'USDC':
          return 'USDC'
        case 'USDT':
          return 'Tether'
        case 'HUB':
          return 'Hub'

        default:
          return 'LynKey'
      }
    }
  }
</script>

<style scoped lang="scss">
  .list-address {
    .list-loading {
      min-height: 200px;
    }
    .table {
      padding: 0 24px 24px 24px;
      .small {
        font-size: 14px !important;
        line-height: 16px;
        color: #5b616e;
      }
    }
  }
</style>
