<template>
  <div class="max-w-[83.33%] flex-[0_0_83.33%] px-2 py-2">
    <div class="w-full rounded-lg bg-white">
      <div class="flex h-[64px] w-full border-b border-solid border-[#eaeaea] px-4 text-sm">
        <div class="flex items-center">
          <h3 class="mr-8 text-sm font-bold">Sắp xếp theo</h3>
          <div class="flex justify-between">
            <BaseButton v-for="item in listSort" :key="item.value" class="mr-4" size="medium" type="plain">
              {{ item.name }}
            </BaseButton>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap justify-center">
        <div v-for="item in 20" :key="item" class="w-[25%] border-b border-r border-l border-solid border-[#eaeaea]">
          <Item />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Item from '@/modules/landing/components/Item.vue'

  const listSort: Ref<Record<string, any>> = ref([
    {
      name: 'Khuyến mãi tốt nhất',
      value: 'big_promotion'
    },
    {
      name: 'Giá tăng dần',
      value: 'price_asc'
    },
    {
      name: 'Giá giảm dần',
      value: 'price_desc'
    }
  ])
</script>

<style scoped></style>
