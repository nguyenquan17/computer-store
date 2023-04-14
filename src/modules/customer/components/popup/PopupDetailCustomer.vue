<template>
  <base-popup
    name="popup-detail-customer"
    width="1200px"
    class="popup-detail-customer"
    :is-show-footer="false"
    @open="handleOpen"
  >
    <template #title>Customer detail</template>

    <div class="content pb-6">
      <div class="flex mb-6">
        <div class="avatar">
          <img v-if="rowData.avatar" :src="rowData.avatar" alt="" class="w-20 h-20 object-cover rounded-full" />
          <base-icon v-else icon="default-avatar" size="80" />
        </div>
        <div class="flex-1 w-full ml-6">
          <p class="text-[18px] leading-6 font-semibold mb-3">{{ rowData.fullName }}</p>
          <div class="flex">
            <div class="w-[316px] mr-[160px]">
              <div class="flex justify-between items-center relative mb-1">
                <p class="text-xs text-description">Referral code:</p>
                <p class="text-base">{{ rowData.affiliationCode }}</p>
              </div>
              <div class="flex justify-between items-center relative mb-1">
                <p class="text-xs text-description">Username:</p>
                <p class="text-base">{{ useFormatTxCode(rowData.username, 7) }}</p>
                <div class="cursor-pointer absolute right-[-34px] h-6" @click="useCopy(rowData.username)">
                  <base-icon icon="copy" size="24" color="#A19F9D" />
                </div>
              </div>
              <div class="flex justify-between items-center relative mb-1">
                <p class="text-xs text-description">Email:</p>
                <p class="text-base">{{ rowData.email }}</p>
                <p v-if="rowData.emailVerified === '1'" class="text-xs text-[#129961] absolute -right-[55px] top-1">Verified</p>
              </div>
            </div>

            <div class="w-[316px] mr-[160px]">
              <div class="flex justify-between items-center relative mb-1">
                <p class="text-xs text-description">Level:</p>
                <p class="text-base">{{ getLevelCurrent(rowData.level) }}</p>
              </div>
              <div class="flex justify-between items-center relative mb-1">
                <p class="text-xs text-description">Created date:</p>
                <p class="text-base">{{ useFormatDateHourMs(rowData.createdDate) }}</p>
              </div>
              <div class="flex justify-between items-center relative mb-1">
                <p class="text-xs text-description">Last login:</p>
                <p class="text-base">{{ useFormatDateHourMs(rowData.lastTimeLogin) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded shadow-md bg-white">
        <base-tab :list-tab="listTab" class="text-[16px] text-description" :tab-active="tabActive" @click="handleChangeTab" />

        <component :is="getComponent" :row-data="props.rowData"></component>
      </div>
    </div>
  </base-popup>
</template>

<script setup lang="ts">
  import useCopy from '@/composables/copy'
  import useFormatDateHourMs from '@/composables/formatDateHourMs'
  import useFormatTxCode from '@/composables/formatTxCode'
  import type { ICustomer, ITab } from '@/interfaces'

  import BalanceTable from '../table/BalanceTable.vue'
  import ReferralTable from '../table/ReferralTable.vue'
  import BonusTable from '../table/BonusTable.vue'
  import StatisticsTable from '../table/StatisticsTable.vue'
  import SettingTable from '../table/SettingTable.vue'
  import DeviceTable from '../table/DeviceTable.vue'
  import SocialTable from '../table/SocialTable.vue'
  import TransactionTable from '../table/TransactionTable.vue'

  interface IProps {
    rowData: ICustomer
  }

  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })

  const listTab = ref([
    {
      title: 'Balance',
      value: 'BALANCE'
    },
    {
      title: 'Transaction',
      value: 'TRANSACTION'
    },
    {
      title: 'Referral',
      value: 'REFERRAL'
    },
    {
      title: 'Bonus',
      value: 'BONUS'
    },
    {
      title: 'Statistics',
      value: 'STATISTICS'
    },
    {
      title: 'Settings',
      value: 'SETTING'
    },
    {
      title: 'Devices',
      value: 'DEVICE'
    },
    {
      title: 'Social',
      value: 'SOCIAL'
    }
  ])

  const tabActive = ref('BALANCE')

  const objComponent = ref({
    BalanceTable: {
      component: () => BalanceTable
    },
    ReferralTable: {
      component: () => ReferralTable
    },
    BonusTable: {
      component: () => BonusTable
    },
    StatisticsTable: {
      component: () => StatisticsTable
    },
    SettingTable: {
      component: () => SettingTable
    },
    DeviceTable: {
      component: () => DeviceTable
    },
    SocialTable: {
      component: () => SocialTable
    },
    TransactionTable: {
      component: () => TransactionTable
    }
  })

  const getComponent = computed(() => {
    const tabActiveLowerCase = tabActive.value.toLowerCase()
    const key = tabActiveLowerCase.charAt(0).toUpperCase() + tabActiveLowerCase.slice(1) + 'Table'
    return objComponent.value[key].component()
  })

  const getLevelCurrent = (level: string) => {
    try {
      if (level && level === 'MM') {
        return 'MM'
      } else if (level !== 'Default') {
        return `Level ${level.match(/\d+/)![0]}`
      } else {
        return 'Default'
      }
    } catch (error) {
      return ''
    }
  }

  const handleOpen = () => {
    tabActive.value = 'BALANCE'
  }

  const handleChangeTab = (tab: ITab) => {
    tabActive.value = tab.value
  }
</script>

<style lang="scss">
  .popup-detail-customer {
    .popup-content {
      background-color: #f6f8fc;
    }
  }
</style>
