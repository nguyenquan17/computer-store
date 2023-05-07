<template>
  <the-page-loading v-if="isLoading" />
  <el-container v-else class="h-screen">
    <el-container>
      <div class="banner-header h-[56px]">
        <img
          alt=""
          class="h-full w-full"
          src="https://lh3.googleusercontent.com/nKMbfvP-YF19yj0cDGV7asc7Ro_30B79EX0Qgaw1WlULVylvHL_634Xbu_0jY2peGLzJOTjDV8YXwpmtw2ZvrVjArEhDza67=w1920-rw"
        />
      </div>
      <div class="general-information-header min-h-[42px] bg-[#1435c3]">
        <div class="m-auto flex h-full w-[1232px] justify-between text-sm text-[#ececec]">
          <div class="flex cursor-pointer items-center">
            <el-icon>
              <Discount />
            </el-icon>
            <p class="pl-2">Khuyến mãi</p>
          </div>
          <div class="flex cursor-pointer items-center">
            <el-icon>
              <OfficeBuilding />
            </el-icon>
            <p class="pl-2">Hệ thống Showroom</p>
          </div>
          <div class="flex cursor-pointer items-center">
            <el-icon>
              <Service />
            </el-icon>
            <p class="pl-2">Tư vấn mua hàng (miễn phí): 1800 0018</p>
          </div>
          <div class="flex cursor-pointer items-center">
            <el-icon>
              <Service />
            </el-icon>
            <p class="pl-2">CSKH: 1800 0018</p>
          </div>
          <div class="flex cursor-pointer items-center">
            <el-icon>
              <Monitor />
            </el-icon>
            <p class="pl-2">Tin công nghệ</p>
          </div>
          <div class="flex cursor-pointer items-center">
            <el-icon>
              <Setting />
            </el-icon>
            <p class="pl-2">Xây dựng cấu hình</p>
          </div>
        </div>
      </div>
      <el-header class="h-[88px] border-solid border-[#d2d0ce] px-6">
        <Header />
      </el-header>
      <el-main class="bg-[#f6f8fc] pb-0 pl-0 pt-0 pr-0">
        <router-view />
        <div>
          <Footer />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
  import { Discount, OfficeBuilding, Service, Monitor, Setting } from '@element-plus/icons-vue'

  const isLoading = ref(true)
  onMounted(async () => {
    isLoading.value = false
  })
</script>

<style scoped></style>