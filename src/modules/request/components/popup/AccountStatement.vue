<template>
  <div class="content-account" v-loading="isLoading">
    <div class="box1 be-flex align-center">
      <div class="mini-boxcontent">
        <div class="be-flex align-center header">
          <base-icon
            class="icon-header"
            :class="data.currency == 'LYNK' ? 'icon-lin' : null"
            :icon="getIcon(data.currency)"
            :size="data.currency == 'LYNK' ? '30' : '40'"
          ></base-icon>
          <div>
            <p class="fw-600 fs-18">{{ getTitle }}</p>
            <p class="fw-400 fs-12 text-color">{{ $t('request.popup.account.discription1') }}</p>
          </div>
        </div>
        <div>
          <p class="fw-600 fs-24" style="line-height: 32px" :class="getClassUnit">{{ summary.balance | numberWithCommas }} {{ data.currency }}</p>
          <p class="fw-400 fs-14 dolar">~${{ summary.balanceToUsd | convertAmountDecimal('USD') }}</p>
        </div>
      </div>
      <div class="mini-boxcontent mini-boxcontent2">
        <div class="be-flex align-center header">
          <base-icon
            class="icon-header"
            :class="data.currency == 'LYNK' ? 'icon-lin' : null"
            :icon="getIcon(data.currency)"
            :size="data.currency == 'LYNK' ? '30' : '40'"
          ></base-icon>
          <div>
            <p class="fw-600 fs-18">{{ $t('request.popup.account.available') }}</p>
            <p class="fw-400 fs-12 text-color">{{ $t('request.popup.account.discription2') }}</p>
          </div>
        </div>
        <div>
          <p class="fw-600 fs-24" style="line-height: 32px" :class="getClassUnit">{{ summary.availableBalance | numberWithCommas }} {{ data.currency }}</p>
          <p class="fw-400 fs-14 dolar">~${{ summary.availableBalanceToUsd | convertAmountDecimal('USD') }}</p>
        </div>
      </div>
      <div class="mini-boxcontent mini-boxcontent3">
        <div class="be-flex align-center header">
          <base-icon class="icon-header" icon="icon-lock" size="40"></base-icon>
          <div>
            <p class="fw-600 fs-18">{{ $t('request.popup.account.locked') }}</p>
            <p class="fw-400 fs-12 text-color">{{ $t('request.popup.account.discription3') }}</p>
          </div>
        </div>
        <div>
          <p class="fw-600 fs-24" style="line-height: 32px">{{ summary.totalLockedAmount | numberWithCommas }} {{ data.currency }}</p>
          <p class="fw-400 fs-14 dolar">~${{ summary.totalLockedAmountToUsd | convertAmountDecimal('USD') }}</p>
        </div>
      </div>
    </div>
    <div class="big-title fw-600 fs-24">{{ $t('request.popup.account.bigTitle1') }}</div>
    <div class="open align-center be-flex row">
      <div class="title fw-600 fs-16">{{ $t('request.popup.account.title1') }}</div>
      <div class="title2 fw-600 fs-16">{{ summary.openBalance }} {{ data.currency }}</div>
      <!-- <div>{{summary.closeBalance}}</div> -->
    </div>
    <div class="box-table">
      <base-table
        class="base-table table-request"
        :data="responseList"
        :isLoading="isLoading"
        :showPagination="true"
        :paginationInfo="getPaginationInfo"
        :table="query"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
      >
        <el-table-column :label="$t('request.popup.account.label1')" prop="transactionType" align="left" min-width="200">
          <template slot-scope="scope">
            <div class="box-type" style="margin-left: 6px">
              <p class="fw-400 fs-16" style="color: #0a0b0d; text-transform: uppercase">
                {{ scope.row.transactionType | capitalizeFirstLetter }}
              </p>
              <p class="fw-400 fs-14 text-color">{{ scope.row.transactionDate | formatMMDDYY }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('request.popup.account.label2')" width="200" prop="transactionType" align="right">
          <template slot-scope="scope">
            <div v-if="parseFloat(scope.row.creditAmountDisplay) != 0">
              <p class="fw-400 fs-16" style="color: #129961">+{{ scope.row.creditAmountDisplay }}</p>
            </div>
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('request.popup.account.label3')" width="200" prop="transactionType" align="right">
          <template slot-scope="scope">
            <!-- <div>
              <p class="fw-400 fs-16" style="color: #cf202f">{{ scope.row.debitAmountDisplay }}</p>
            </div> -->
            <div v-if="parseFloat(scope.row.debitAmountDisplay) != 0">
              <p class="fw-400 fs-16" style="color: #cf202f">{{ scope.row.debitAmountDisplay }}</p>
            </div>
            <div v-else></div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('request.popup.account.label4')" width="200" prop="transactionType" align="right">
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.balanceDisplay }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('request.popup.account.label5')" width="139" prop="status" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 'PENDING'" class="box-status pending">
              <p>{{ $t('request.popup.account.pending') }}</p>
            </div>
            <div v-else-if="scope.row.status == 'FAILED'" class="box-status failed">
              <p>{{ $t('request.popup.account.failed') }}</p>
            </div>
            <div v-else-if="scope.row.status == 'SUCCESS'" class="box-status success">
              <p>{{ $t('request.popup.account.success') }}</p>
            </div>
            <div v-else-if="scope.row.status == 'PROCESSING'" class="box-status processing">
              <p>{{ $t('request.popup.account.processing') }}</p>
            </div>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <div class="total align-center be-flex row">
      <div class="title fw-600 fs-16">{{ $t('request.popup.account.title2') }}</div>
      <div class="title2 fw-600 fs-16">+{{ summary.totalCreditAmount | numberWithCommas }} {{ data.currency }}</div>
      <div class="title3 fw-600 fs-16">-{{ summary.totalDebitAmount | numberWithCommas }} {{ data.currency }}</div>
    </div>
    <div class="close align-center be-flex row">
      <div class="title fw-600 fs-16">{{ $t('request.popup.account.title3') }}</div>
      <div class="title2 fw-600 fs-16">{{ summary.closeBalance | numberWithCommas }} {{ data.currency }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import getRepository from '@/services'
  import { RequestRepository } from '@/services/repositories/request'
  import PopupMixin from '@/mixins/popup'

  const api: RequestRepository = getRepository('request')

  @Component
  export default class AccountStatement extends Mixins(PopupMixin) {
    @Prop() data!: any
    coin: any = ''
    responseList: any = []
    summary: any = {}
    isLoading = true
    getIcon(currency: string): void {
      let icon: any = ''
      if (currency) {
        icon = `icon-${currency.toLowerCase()}`
      }
      return icon
    }
    query: any = {
      page: 1,
      limit: 10,
      total: 10
    }
    get getTitle(): any {
      switch (this.data.currency) {
        case 'LYNK':
          return this.$t('request.popup.account.Linkey')
        case 'HUB':
          return this.$t('request.popup.account.Hubgame')
        case 'BTC':
          return this.$t('request.popup.account.Bitcoin')
        case 'ETH':
          return this.$t('request.popup.account.Ethereum')
        case 'BNB':
          return this.$t('request.popup.account.Bnb')
        case 'USDT':
          return this.$t('request.popup.account.Usdt')
        case 'USDC':
          return this.$t('request.popup.account.Usdc')
        case 'BUSD':
          return this.$t('request.popup.account.busd')
        default:
          return this.$t('request.popup.account.Cleverme')
      }
    }
    get getClassUnit(): string {
      switch (this.data.currency) {
        case 'LYNK':
          return 'amount-lyn'
        case 'HUB':
          return 'amount-hub'
        case 'BTC':
          return 'amount-btc'
        case 'ETH':
          return 'amount-eth'
        case 'BNB':
          return 'amount-bnb'
        case 'USDT':
          return 'amount-usdt'
        case 'USDC':
          return 'amount-usdc'
        case 'BUSD':
          return 'amount-busd'
        default:
          return 'amount-clm'
      }
    }
    get getPaginationInfo(): any {
      return this.$t('paging.request')
    }
    handleSizeChange(value: string | number): void {
      this.query.page = 1
      this.query.limit = value
      this.getDataTable()
    }
    handleCurrentChange(value: string | number): void {
      this.query.page = value
      // this.query.limit = value
      this.getDataTable()
    }

    async getDataTable(): Promise<void> {
      this.isLoading = true
      if (this.data.userId) {
        await api
          .getTableStatement(this.data.currency, this.data.userId, this.query.page, this.query.limit)
          .then((res: any) => {
            this.isLoading = false
            this.responseList = res.transactions.content
            this.summary = res.summary
            this.query.total = res.transactions.totalElements
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
    async init(): Promise<void> {
      this.getDataTable()
    }
    created(): void {
      this.init()
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep .el-dialog {
    width: 1100px !important;
  }
  .content-account {
    .text-color {
      color: #5b616e;
    }
    .box1 {
      border-radius: 4px;
      border: 1px solid #dbdbdb;
      margin-bottom: 24px;
      justify-content: space-between;
      padding: 16px 24px;
      .mini-boxcontent {
        min-width: 250px;
        .header {
          margin-bottom: 16px;
          .icon-header {
            margin-right: 16px;
          }
          .icon-lin {
            background: #f3f2f1;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 40px;
          }
        }
        .dolar {
          color: #5b616e;
        }
      }
      .mini-boxcontent2,
      .mini-boxcontent3 {
        padding-left: 24px;
        border-left: 1px solid #dbdbdb;
      }
    }
    .big-title {
      margin-bottom: 24px;
    }
    .open,
    .total,
    .close {
      background: #f3f2f1;
      color: #0a0b0d;
      height: 24px;
      padding: 12px 16px;
      .title {
        min-width: 570px;
      }
      .title2 {
        min-width: 200px;
        text-align: right;
      }
    }
    .open {
      border-radius: 4px 4px 0 0;
    }
    .total {
      margin-bottom: 8px;
      .title {
        min-width: 170px;
      }
      .title2 {
        min-width: 200px;
        text-align: right;
      }
      .title3 {
        min-width: 200px;
        text-align: right;
      }
    }
    .close {
      border-radius: 4px;
      color: #fff;
      background: #0151fc;
      .title {
        min-width: 570px;
      }
      .title2 {
        min-width: 200px;
        text-align: right;
      }
    }
    .box-table {
      .box-status {
        background: #e4f9e2;
        color: #129961;
        width: 80px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border-radius: 4px;
        font-weight: 500;
        font-size: 12px;
        margin: 0 auto;
      }
      .pending {
        background: #fff3e2;
        color: #dd7d00;
      }
      .failed {
        background: #fbedee;
        color: #cf202f;
      }
      .success {
        background: #e4f9e2;
        color: #129961;
      }
      .processing {
        background: #fff3e2;
        color: #dd7d00;
      }
    }
  }
</style>
