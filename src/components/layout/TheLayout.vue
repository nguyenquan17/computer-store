<template>
  <the-page-loading v-if="isLoading" />
  <el-container v-else class="h-screen">
    <el-aside class="sidebar w-20">
      <the-sidebar />
    </el-aside>
    <el-container>
      <el-header class="h-[70px] px-6 border-b border-solid border-[#d2d0ce]">
        <the-header />
      </el-header>
      <el-main class="pt-6 pr-6 pl-6 pb-0 bg-[#f6f8fc]">
        <router-view />
      </el-main>
      <el-footer class="flex items-center px-6 border-t border-solid border-[#d2d0ce] text-sm">
        <p class="text-hyperlink mr-6 cursor-pointer select-none" @click="handleClickTerm">Terms and Conditions</p>
        <p class="text-[#5b616e]">{{ baseStore.systemParams['system.token.company.address'] }}</p>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import { useBaseStore } from '@/stores/base'
  import { useAuthStore } from '@/modules/Auth/store/index'
  import { apiParam } from '@/services'

  const baseStore = useBaseStore()
  const authStore = useAuthStore()

  const isLoading = ref(true)

  onMounted(async () => {
    await authStore.getInfoUser()
    await getListAssetNetwork()
    isLoading.value = false
  })

  const getListAssetNetwork = async () => {
    try {
      const result = await apiParam.getListAssetToken()
      baseStore.setListRounding(result.assets)
      baseStore.setListAssetToken(result.assets)

      // initListToken(result.assets, result.allAsset)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const handleClickTerm = () => {
    window.open(`${baseStore.systemParams['system.token.terms']}`)
  }
</script>

<style scoped></style>
