<template>
  <div class="w-full">
    <base-table :data="data" :show-pagination="false" class="p-6">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column label="Social">
        <template #default="scope">
          <span class="inline-block">{{ scope.row.social }}</span>
        </template>
      </el-table-column>
      <el-table-column label="User">
        <template #default="scope">
          <span class="inline-block">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center" width="160">
        <template #default="scope">
          <span :class="checkType(scope.row.socialId)">{{ checkStatus(scope.row.socialId) }}</span>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script setup lang="ts">
  import type { ICustomer } from '@/interfaces'

  interface IProps {
    rowData: ICustomer
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })

  const data = computed(() => {
    return [
      { social: 'Twitter', userName: props.rowData.twitter, socialId: props.rowData.twitter },
      { social: 'Telegram', userName: props.rowData.telegram, socialId: props.rowData.telegramId },
      { social: 'Discord', userName: props.rowData.discord, socialId: props.rowData.discordId }
    ]
  })

  const checkType = (type: string) => {
    return type ? 'status-verified' : 'status-not-verified'
  }

  const checkStatus = (status: string) => {
    return status ? 'Verified' : 'Unverified'
  }
</script>

<style scoped></style>
