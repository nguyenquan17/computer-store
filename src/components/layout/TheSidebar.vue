<template>
  <div class="overflow-y-auto h-full border-r border-[#ccc] border-solid">
    <!-- <div class="menu">
      <img src="/images/logo.png" alt="" class="w-8" />
      <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Home</p>
    </div> -->

    <router-link v-slot="{ navigate }" :to="{ name: 'Customer', params: { type: 'all' } }" custom>
      <div class="menu" role="link" @click="navigate">
        <img src="/images/logo.png" alt="" class="w-8" />
        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Home</p>
      </div>
    </router-link>

    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'CustomerMain' }" custom>
      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">
        <base-icon icon="menu-customer" size="32" class="icon" />
        <base-icon icon="menu-customer-active" size="32" class="icon-active" />
        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Customer</p>
      </div>
    </router-link>

    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'BalanceMain' }" custom>
      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">
        <base-icon icon="menu-balance" size="32" class="icon" />
        <base-icon icon="menu-balance-active" size="32" class="icon-active" />
        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Balance</p>
      </div>
    </router-link>
    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'TransactionMain' }" custom>
      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">
        <base-icon icon="menu-transaction" size="32" class="icon" />
        <base-icon icon="menu-transaction-active" size="32" class="icon-active" />
        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Transaction</p>
      </div>
    </router-link>
    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'FeeMain' }" custom>
      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">
        <base-icon icon="menu-fee" size="32" class="icon" />
        <base-icon icon="menu-fee-active" size="32" class="icon-active" />
        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Fee</p>
      </div>
    </router-link>
    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'RequestMain' }" custom>
      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">
        <base-icon icon="menu-request" size="32" class="icon" />
        <base-icon icon="menu-request-active" size="32" class="icon-active" />
        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Request</p>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .menu {
    @apply h-20 flex items-center justify-center flex-col cursor-pointer;
    &:hover {
      @apply bg-[#f3f2f1];
      .icon {
        display: none;
      }
      .icon-active {
        display: block;
        color: #fff;
      }
      p {
        @apply text-hyperlink;
      }
    }
    .icon {
      color: #5b616e;
    }
    .icon-active {
      display: none;
    }
  }
  .active-link {
    p {
      @apply text-hyperlink;
    }
    .icon {
      display: none;
    }
    .icon-active {
      display: block;
      color: #fff;
    }
  }
</style>
