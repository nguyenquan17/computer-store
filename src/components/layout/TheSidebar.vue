<template>
  <div class="h-full overflow-y-auto border-r border-solid border-[#ccc]">
    <!-- <div class="menu">
      <img src="/images/logo.png" alt="" class="w-8" />
      <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Home</p>
    </div> -->

    <router-link v-slot="{ navigate }" :to="{ name: 'Request', params: { type: 'MAGIC' } }" custom>
      <div class="menu" role="link" @click="navigate">
        <img alt="" class="w-8" src="/images/logo.png" />
        <p class="mt-[3px] text-[10px] leading-3 text-[#201f1e]">Home</p>
      </div>
    </router-link>

    <!--    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'CustomerMain' }" custom>-->
    <!--      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">-->
    <!--        <base-icon icon="menu-customer" size="32" class="icon" />-->
    <!--        <base-icon icon="menu-customer-active" size="32" class="icon-active" />-->
    <!--        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Customer</p>-->
    <!--      </div>-->
    <!--    </router-link>-->

    <!--    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'BalanceMain' }" custom>-->
    <!--      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">-->
    <!--        <base-icon icon="menu-balance" size="32" class="icon" />-->
    <!--        <base-icon icon="menu-balance-active" size="32" class="icon-active" />-->
    <!--        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Balance</p>-->
    <!--      </div>-->
    <!--    </router-link>-->
    <!--    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'TransactionMain' }" custom>-->
    <!--      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">-->
    <!--        <base-icon icon="menu-transaction" size="32" class="icon" />-->
    <!--        <base-icon icon="menu-transaction-active" size="32" class="icon-active" />-->
    <!--        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Transaction</p>-->
    <!--      </div>-->
    <!--    </router-link>-->
    <!--    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'FeeMain' }" custom>-->
    <!--      <div class="menu" role="link" :class="{ 'active-link': isActive }" @click="navigate">-->
    <!--        <base-icon icon="menu-fee" size="32" class="icon" />-->
    <!--        <base-icon icon="menu-fee-active" size="32" class="icon-active" />-->
    <!--        <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Fee</p>-->
    <!--      </div>-->
    <!--    </router-link>-->
    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'RequestMain' }" custom>
      <div :class="{ 'active-link': isActive }" class="menu" role="link" @click="navigate">
        <base-icon class="icon" icon="menu-request" size="32" />
        <base-icon class="icon-active" icon="menu-request-active" size="32" />
        <p class="mt-[3px] text-[10px] leading-3 text-[#201f1e]">Request</p>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
  .menu {
    @apply flex h-20 cursor-pointer flex-col items-center justify-center;
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