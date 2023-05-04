<template>
  <div class="landing-product">
    <div class="m-auto max-w-[1232px] pr-4 pl-4 mb-6">
      <div class="relative min-h-[416px]">
        <img
          alt=""
          class="absolute top-0"
          src="https://lh3.googleusercontent.com/vCgMx7AxHVMI7Nf8XhXnYtaF96F8Xq-uOorLiXS4Q986mvZ4Qg0OXTz9n34utNLtguQmU1WTKplnTZLaWn2KCqi9r6toQYo=w1232"
        />
        <div class="relative flex h-[3.5rem] items-center justify-between pl-4 pr-4 border-solid border-b border-[#ffffff80]">
          <!--          router-link-->
          <p class="text-label text-xl font-bold">Laptop</p>
          <p class="text-label text-sm font-semibold">Xem tất cả</p>
        </div>
        <div class="px-3 py-3">
          <div class="relative overflow-hidden">
            <div class="flex">
              <Item></Item>
              <Item></Item>
              <Item></Item>
              <Item></Item>
              <Item></Item>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Item from '../components/Item.vue'
</script>

<style scoped></style>
