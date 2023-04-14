<template>
  <div class="w-full p-6">
    <div class="flex justify-between items-center pb-[15px] border-b border-solid border-border-primary">
      <p class="text-base font-semibold">2-factor Authentication</p>
      <div v-if="detail.faType" class="flex items-center">
        <base-icon :icon="getIcon" size="40" />
        <p class="ml-1 text-base">{{ getType2Fa }}</p>
      </div>
    </div>
    <div class="flex justify-between items-center py-[15px] border-b border-solid border-border-primary">
      <p class="text-base font-semibold">Active status</p>
      <div v-if="detail.userStatus" class="flex items-center">
        <div
          class="w-2 h-2 rounded-full mr-1"
          :class="{
            'bg-[#129961]': detail.userStatus === 'ACTIVE',
            'bg-[#cf202f]': detail.userStatus === 'UNVERIFIED' || detail.userStatus === 'LOCKED'
          }"
        ></div>
        <p class="ml-1 text-base">{{ useCapitalizeFirstLetter(detail.userStatus) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import useCapitalizeFirstLetter from '@/composables/capitalizeLetter'
  import type { ICustomer } from '@/interfaces'
  import { apiCustomer } from '@/services'
  interface IProps {
    rowData: ICustomer
  }
  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as ICustomer)
  })

  const detail = ref<Record<string, any>>({})

  onMounted(() => {
    getDetailCustomer()
  })

  const getDetailCustomer = async () => {
    const rs = await apiCustomer.getDetailCustomer({ userId: props.rowData.userId })
    detail.value = rs.content[0]
    console.log(rs)
  }

  const getIcon = computed(() => {
    return detail.value.faType === 'SMS' ? 'verify-phone' : detail.value.faType === 'EMAIL' ? 'verify-email' : 'verify-app'
  })
  const getType2Fa = computed(() => {
    return detail.value.faType === 'SMS' ? 'Phone number' : detail.value.faType === 'EMAIL' ? 'Email' : 'Authenticator app'
  })
</script>

<style scoped></style>
