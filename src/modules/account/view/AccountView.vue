<template>
  <div class="m-auto max-w-[1232px] px-8 py-8">
    <div class="flex gap-x-[20px]">
      <div class="tab-left max-h-[250px] flex-[0_0_25%] rounded bg-white px-3 py-4">
        <div class="flex items-center gap-x-[8px] pb-4">
          <base-icon color="#82869E" icon="default-avatar" size="36"></base-icon>
          <div>
            Xin chào,
            <h1 class="font-bold">Nguyễn Quân</h1>
          </div>
        </div>
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="route.name === tab.value ? 'text-tab-active' : null"
          class="cursor-pointer py-2 text-sm font-bold hover:text-tab-active"
          @click="handleClickTab(tab)"
        >
          <div class="flex items-center">
            <base-icon :icon="tab.icon" class="mr-2" size="18"></base-icon>
            {{ tab.title }}
          </div>
        </div>
      </div>
      <div class="content min-h-[670px] flex-[0_0_75%] rounded bg-white">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ITab } from '@/interfaces'

  const route = useRoute()
  const router = useRouter()
  const tabActive: Ref<string> = ref('Profile')
  const tabs: Ref<ITab[]> = ref([
    {
      title: 'Thông tin tài khoản',
      value: 'Profile',
      icon: 'profile'
    },
    {
      title: 'Quản lý đơn hàng',
      value: 'MyOrders',
      icon: 'order_icon'
    }
  ])

  const handleClickTab = (tab: ITab): void => {
    tabActive.value = tab.value
    router.push({ name: tab.value })
  }
</script>

<style scoped></style>
