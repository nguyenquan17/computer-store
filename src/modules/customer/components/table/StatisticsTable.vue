<template>
  <div class="w-full p-6">
    <div class="grid grid-cols-5 gap-4">
      <div v-for="(item, index) in listSummary" :key="index" class="border border-solid border-[#dbdbdb] rounded-lg p-4">
        <div class="flex justify-between">
          <p class="text-base text-description">{{ item.title }}</p>
          <base-icon :icon="item.icon" size="20" :color="item.color" />
        </div>
        <p class="text-[30px] leading-[48px]">${{ item.total }}</p>
      </div>
    </div>

    <p class="text-[18px] font-semibold mb-4 mt-10">Transaction Statistics</p>
    <base-table :data="data" :show-pagination="false">
      <el-table-column label="#" type="index" width="40" />
      <el-table-column label="type" width="200" prop="transactionType" align="left">
        <template #default="scope">
          <span>{{ useCapitalizeFirstLetter(scope.row.transactionType) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="num of trans" prop="numOfTransaction" width="144" align="right">
        <template #default="scope">
          <span class="text-base"
            >{{ scope.row.numOfTransaction < 10 ? '0' + scope.row.numOfTransaction : scope.row.numOfTransaction }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="total amount" prop="totalAmount" align="right">
        <template #default="scope">
          <span class="text-base">${{ useFormatCurrency(scope.row.totalAmount, 'USD') }} </span>
        </template>
      </el-table-column>
      <el-table-column label="avg trans amount" align="right" prop="avgAmount" width="250">
        <template #default="scope">
          <span>${{ useFormatCurrency(scope.row.avgAmount, 'USD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="last transaction" prop="lastTransaction" width="210" align="center">
        <template #default="scope">
          <span>{{ userFormatDateHourMs(scope.row.lastTransaction) }}</span>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import useAbbreviateNumber from '@/composables/abbreviateNumber'
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'
  import useFormatCurrency from '@/composables/formatCurrency'
  import userFormatDateHourMs from '@/composables/formatDateHourMs'
  import type { ICustomer } from '@/interfaces'
  import { apiCustomer } from '@/services'

  interface IProps {
    rowData: ICustomer
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })
  const listSummary = ref([
    {
      icon: 'menu-balance-active',
      title: 'Balance',
      total: 0,
      color: '#fff'
    },
    {
      icon: 'deposit',
      title: 'Total Deposit',
      total: 0,
      color: 'inherit'
    },
    {
      icon: 'withdraw',
      title: 'Total Withdraw',
      total: 0,
      color: 'inherit'
    },
    {
      icon: 'swap',
      title: 'Total Bet',
      total: 0,
      color: '#129961'
    },
    {
      icon: 'prize',
      title: 'Total Prize',
      total: 0,
      color: 'inherit'
    }
  ])
  const data = ref([])

  onMounted(() => {
    getStatistics()
  })

  const getStatistics = async () => {
    const rs = await apiCustomer.getStatistics(props.rowData.userId)
    data.value = rs.statistics
    const summary = rs.summary
    console.log(summary)

    listSummary.value[0].total = handleFormatSummary(summary.totalBalance) as number
    listSummary.value[1].total = handleFormatSummary(summary.totalDeposit) as number
    listSummary.value[2].total = handleFormatSummary(summary.totalWithdraw) as number
    listSummary.value[3].total = handleFormatSummary(summary.totalBet) as number
    listSummary.value[4].total = handleFormatSummary(summary.totalBetPrize) as number
  }

  const handleFormatSummary = (amount: number) => {
    return amount ? (amount < 10 ** 6 ? useFormatCurrency(amount, 'USD') : useAbbreviateNumber(amount)) : 0
  }
</script>

<style scoped></style>
