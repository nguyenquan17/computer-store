<template>
  <div class="bo-crowdsale-round">
    <div class="table">
      <base-table :data="listRound" class="base-table table-crowdsale-round" :showPagination="false">
        <el-table-column :label="this.$t('crowdsale.round')" prop="name" align="left">
          <template slot-scope="scope">
            <span>{{ getGroupName(scope.row.name) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('crowdsale.startDate')" prop="fromDate" align="left" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.fromDate.time | formatMMDDYYWithoutHour }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('crowdsale.endDate')" prop="toDate" align="left" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.toDate.time | formatMMDDYYWithoutHour }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('crowdsale.price')" prop="price" align="center" width="124">
          <template slot-scope="scope">
            <span>${{ scope.row.price | convertAmountDecimal('USD') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('crowdsale.sold')" prop="totalSold" align="right" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.totalSold | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('crowdsale.remain')" prop="totalAvailable" align="right" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.totalAvailable | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="this.$t('crowdsale.progress2')" prop="percentageSold" align="right" width="160">
          <template slot-scope="scope">
            <span>{{ ((scope.row.percentageSold * 1000) / 10) | convertAmountDecimal('PERCENT') }}%</span>
            <!-- <span v-else>0%</span> -->
          </template>
        </el-table-column>
      </base-table>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import firebase from '@/utils/firebase'
  @Component
  export default class BOCrowdsaleRound extends Vue {
    listRound: Record<string, any>[] = []
    listener: any = null

    created(): void {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      const crowdSaleRef = firebase.database().ref('crowd-sales')
      this.listener = crowdSaleRef.on('value', function (snapshot) {
        _this.listRound = snapshot.val()
      })
    }

    destroyed(): void {
      const crowdSaleRef = firebase.database().ref('crowd-sales')
      crowdSaleRef.off('value', this.listener)
    }
    getGroupName(groupName: string): void {
      let name: any = groupName.charAt(0).toUpperCase() + groupName.toLowerCase().slice(1)
      return name
    }
  }
</script>
<style scoped lang="scss">
  .bo-crowdsale-round {
  }
</style>
