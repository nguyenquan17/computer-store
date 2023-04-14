<template>
  <div class="w-full">
    <base-table :data="data" :show-pagination="false" class="p-6">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column label="device os" width="220">
        <template #default="scope">
          <span class="inline-block">{{ scope.row.devicesOsVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="device name">
        <template #default="scope">
          <span class="inline-block">{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="app version" width="130">
        <template #default="scope">
          <span class="inline-block">{{ scope.row.appVersion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="last login" width="200">
        <template #default="scope">
          <p class="text-base">{{ useFormatDateMDY(scope.row.lastLogin) }}</p>
          <p class="text-sm text-description">{{ useFormatDateHMS(scope.row.lastLogin) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="2fa status" width="150" align="center">
        <template #default="scope">
          <span class="text-base">{{ scope.row.twoFactorStatus }} </span>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import useFormatDateHMS from '@/composables/formatDateHMS'
  import useFormatDateMDY from '@/composables/formatDateMDY'
  import type { ICustomer } from '@/interfaces'
  import { apiCustomer } from '@/services'

  interface IProps {
    rowData: ICustomer
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })
  const data = ref<Array<Record<string, any>>>([])

  onMounted(() => {
    getListDevice()
  })

  const getListDevice = async () => {
    try {
      const rs = await apiCustomer.getListDevice(props.rowData.userId)
      data.value = rs.content
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style scoped></style>
