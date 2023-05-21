<template>
  <the-page-loading v-if="isLoading"/>
  <el-container v-else class="h-screen">
    <el-aside class="sidebar w-20">
      <the-sidebar/>
    </el-aside>
    <el-container>
      <el-header class="h-[70px] border-b border-solid border-[#d2d0ce] px-6">
        <the-header/>
      </el-header>
      <el-main class="bg-[#f6f8fc] pt-6 pr-6 pl-6 pb-0">
        <router-view/>
      </el-main>
      <el-footer class="flex items-center border-t border-solid border-[#d2d0ce] px-6 text-sm">
        <p class="mr-6 cursor-pointer select-none text-hyperlink">@2023 quanna.shop</p>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {useBaseStore} from '@/stores/base'
import {useAuthStore} from '@/modules/Auth/store/index'
import useCategoryProduct from '@/composables/useCategoryProduct'

const baseStore = useBaseStore()
const authStore = useAuthStore()
const isLoading = ref(true)

onMounted(async () => {
  // await authStore.getInfoUser()
  await useCategoryProduct().getListAssetCategory()
  isLoading.value = false
})

</script>

<style scoped></style>
