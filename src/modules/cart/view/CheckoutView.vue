<template>
  <div class="landing-cart m-auto max-w-[1232px] px-8 py-8">
    <div class="mr-4 w-[66.67%]">
      <h1 class="mb-4 text-2xl font-bold">Thanh toán</h1>
    </div>
    <div class="flex w-full">
      <div class="block-left mr-4 w-[66.67%] rounded bg-white px-4 py-4">
        <div class="flex items-center justify-between">
          <h1>Thông tin nhận hàng</h1>
        </div>

        <div class="block-right flex w-[33.33%] flex-wrap rounded bg-white">
          <div
            class="flex h-[180px] w-[40%] flex-auto flex-col items-center justify-center rounded border border-solid border-[#eaeaea]"
          >
            <div>+</div>
            <div>Thêm địa chỉ</div>
          </div>
        </div>
      </div>
      <div class="block-right max-h-[300px] w-[33.33%] rounded bg-white">
        <div class="px-6 py-6">
          <div class="mb-4 text-base font-bold">Thanh toán</div>
          <div class="mb-1 flex justify-between">
            <h3>Tổng tạm tính</h3>
            <span>8.890.000₫</span>
          </div>
          <div class="mb-12 flex justify-between">
            <h3>Thành tiền</h3>
            <span>8.890.000₫</span>
          </div>
          <base-button class="mb-4" @click="handleNavigationCheckout">Tiếp tục</base-button>
          <base-button type="plain">Trở lại mua hàng</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
