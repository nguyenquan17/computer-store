<template>
  <router-view />
</template>

<script setup lang="ts">
  import { apiParam } from '@/services'
  import { useBaseStore } from '@/stores/base'

  const baseStore = useBaseStore()

  const method = async () => {
    const rs = await apiParam.getSystemParams()
    baseStore.setSystemParams(rs)
  }

  onMounted(() => {
    method()
  })
</script>

<style scoped lang="scss"></style>
