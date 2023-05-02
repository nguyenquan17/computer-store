<template>
  <div class="m-auto h-full max-w-[1232px]">
    <div class="flex h-full items-center">
      <div class="flex items-center pl-2 pr-2">
        <base-icon icon="logo-icon" size="36"></base-icon>
        <h1 class="font-['Open_Sans']">QUANNA.SHOP</h1>
      </div>
      <div class="search-bar flex-auto pl-2 pr-2">
        <el-input v-model="form.inputSearch" class="h-[37px]" placeholder="Nhập từ khóa cần tìm kiếm">
          <template #append>
            <el-button>
              <el-icon class="text-base text-[#82869E]">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <div class="flex min-w-[190px] items-center gap-2 pl-2 pr-2">
        <base-icon color="#82869E" icon="default-avatar" size="36"></base-icon>
        <div class="flex text-sm">
          <p class="cursor-pointer hover:underline hover:underline-offset-4">Đăng nhập</p>
          <span>/</span>
          <p class="cursor-pointer hover:underline hover:underline-offset-4">Đăng ký</p>
        </div>
      </div>
      <div class="flex min-w-[68px] cursor-pointer items-center justify-center pl-2 pr-2">
        <el-icon class="text-[32px] text-[#82869E]">
          <Bell />
        </el-icon>
      </div>
      <div class="flex cursor-pointer items-center gap-2 pl-2 pr-2">
        <el-icon class="text-[32px] text-[#82869E]">
          <ShoppingTrolley />
        </el-icon>
        <div class="text-sm">
          <p>Giỏ hàng của bạn</p>
          <div class="flex items-center">
            <span>(0)</span>
            <p>sản phẩm</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Bell, ShoppingTrolley, Search } from '@element-plus/icons-vue'

  const form: Ref<Record<string, any>> = ref({
    inputSearch: ''
  })
</script>

<style scoped></style>
