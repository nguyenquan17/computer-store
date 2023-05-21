<template>
  <div class="h-full overflow-y-auto border-r border-solid border-[#ccc]">
    <!-- <div class="menu">
      <img src="/images/logo.png" alt="" class="w-8" />
      <p class="text-[10px] mt-[3px] leading-3 text-[#201f1e]">Home</p>
    </div> -->

    <router-link v-slot="{ navigate }" :to="{ name: 'ProductManagement' }" custom>
      <div class="menu" role="link" @click="navigate">
        <img alt="" class="w-8" src="/images/logo.png" />
        <p class="mt-[3px] text-[10px] leading-3 text-[#201f1e]">Home</p>
      </div>
    </router-link>
    <router-link v-slot="{ navigate, isActive }" :to="{ name: 'ProductManagement' }" custom>
      <div :class="{ 'active-link': isActive }" class="menu" role="link" @click="navigate">
        <base-icon class="icon" icon="menu-request" size="32" />
        <base-icon class="icon-active" icon="menu-request-active" size="32" />
        <p class="mt-[3px] text-[10px] leading-3 text-[#201f1e]">Product</p>
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
