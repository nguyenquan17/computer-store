<template>
  <div class="list-balance">
    <filter-main :sorts="sorts" @filter="handleFilter" :isShowFilter="false" />
    <div class="table" v-loading="isLoading" :class="isLoading ? 'list-loading' : null">
      <base-table :data="listBlance" :showPagination="false" class="base-table table-wallet">
        <el-table-column label="#" type="index" align="center" width="40" />
        <el-table-column :label="$t('customer.table.asset')" width="144">
          <template slot-scope="scope">
            <div class="be-flex align-center">
              <img :src="getIcon(scope.row.asset)" alt="" class="img-token" />
              <span style="padding-left: 8px" class="d-ib">{{ getAssetTitle(scope.row.asset) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('customer.table.price')" align="right" width="160">
          <template slot-scope="scope">
            <span>${{ scope.row.price | convertAmountDecimal('USD') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.available')" align="right" width="200">
          <template slot-scope="scope">
            <span class="text-base">{{ scope.row.available | convertAmountDecimal(scope.row.asset) }} {{ scope.row.asset }}</span>
            <span class="d-block small">~${{ scope.row.availableUSD | convertAmountDecimal('USD') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.lock-amount')" align="right" width="200">
          <template slot-scope="scope">
            <span class="text-base">{{ scope.row.totalLockedAmount | convertAmountDecimal(scope.row.asset) }} {{ scope.row.asset }}</span>
            <span class="d-block small">~${{ scope.row.totalLockedAmountUSD | convertAmountDecimal('USD') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.table.balance')" align="right">
          <template slot-scope="scope">
            <span class="text-base">{{ scope.row.totalBalance | convertAmountDecimal(scope.row.asset) }} {{ scope.row.asset }}</span>
            <span class="d-block small">~${{ scope.row.totalBalanceUSD | convertAmountDecimal('USD') }}</span>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import FilterMain from '@/components/filter/FilterMain.vue'

  import getRepository from '@/services'
  import { CustomerRepository } from '@/services/repositories/customer'
  const apiCustomer: CustomerRepository = getRepository('customer')

  import { namespace } from 'vuex-class'
  import { IAssetToken } from '@/interface'
  import { filter } from 'lodash'
  const beBase = namespace('beBase')

  @Component({ components: { FilterMain } })
  export default class CustomerBalance extends Vue {
    @Prop({ required: true, type: Number, default: 0 }) userId!: number
    @beBase.State('listAssetToken') listAssetToken!: IAssetToken[]

    listBlance: Record<string, any>[] = []
    isLoading = false
    filter: Record<string, any> = {}
    sorts: Array<Record<string, any>> = [
      {
        command: 1,
        label: this.$i18n.t('customer.sort.price'),
        divided: false,
        i18n: 'customer.sort.price'
      },
      {
        command: 2,
        label: this.$i18n.t('customer.sort.avail-amount'),
        divided: false,
        i18n: 'customer.sort.avail-amount'
      },
      {
        command: 3,
        label: this.$i18n.t('customer.sort.locked-amount'),
        divided: false,
        i18n: 'customer.sort.locked-amount'
      },
      {
        command: 4,
        label: this.$i18n.t('customer.sort.balance-amount'),
        divided: false,
        i18n: 'customer.sort.balance-amount'
      }
    ]

    created(): void {
      this.handleGetListBalance()
    }

    async handleGetListBalance(): Promise<void> {
      try {
        this.isLoading = true
        this.listBlance = await apiCustomer.getlistBalance(this.userId, this.filter)
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleFilter(filter: Record<string, any>): void {
      this.filter = { ...this.filter, ...filter }
      this.handleGetListBalance()
    }

    getIcon(currency: string): string {
      const token = filter(this.listAssetToken, elm => elm.currency === currency)
      return token.length ? token[0].iconUrl : ''
    }

    getAssetTitle(currency: string): string {
      const token = filter(this.listAssetToken, elm => elm.currency === currency)
      return token.length ? token[0].currencyName : ''
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
      padding: 0 24px 24px 24px;
      .small {
        font-size: 14px !important;
        line-height: 16px;
        color: #5b616e;
      }
    }
    .img-token {
      width: 24px;
    }
  }
</style>
