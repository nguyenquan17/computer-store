<template>
  <div class="list-transaction" v-loading="isLoading" :class="isLoading ? 'list-transaction-loading' : null">
    <filter-transaction @filter="handleFilter" type="customer-transaction" :showBtnTransfer="false"/>
    <div class="table">
      <table-transaction type="customer" :listTransaction="listTransaction" :query="query" @sizeChange="handleSizeChange" @pageChange="handleCurrentChange" />
    </div>
    <popup-filter-transaction @filter="handleFilter" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import FilterTransaction from '@/components/filter/FilterTransaction.vue'
  import TableTransaction from '@/components/table/TableTransaction.vue'
  import PopupFilterTransaction from '@/components/popup/PopupFilterTransaction.vue'

  import getRepository from '@/services'
  import { CustomerRepository } from '@/services/repositories/customer'

  const apiCustomer: CustomerRepository = getRepository('customer')

  @Component({ components: { FilterTransaction, TableTransaction, PopupFilterTransaction } })
  export default class CustomerTransaction extends Vue {
    @Prop({ required: true, type: Number, default: 0 }) userId!: number

    listTransaction: Record<string, any>[] = []
    query: Record<string, any> = {
      page: 1,
      limit: 10,
      total: 0
    }
    isLoading = false

    mounted(): void {
      this.handleGetListTransaction()
    }

    async handleGetListTransaction(): Promise<void> {
      try {
        this.isLoading = true
        const result = await apiCustomer.getlistTransaction(this.userId, this.query)
        this.listTransaction = result.content
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = { ...this.query, ...filter, page: 1 }
      this.handleGetListTransaction()
    }

    handleSizeChange(value: number): void {
      this.query.limit = value
      this.handleGetListTransaction()
    }
    handleCurrentChange(value: number): void {
      this.query.page = value
      this.handleGetListTransaction()
    }
  }
</script>

<style scoped lang="scss">
  .list-transaction-loading {
    min-height: 200px;
  }
  .table {
    padding: 0 24px;
  }
</style>
