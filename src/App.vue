<template>
  <router-view />
</template>

<script lang="ts" setup>
  import { useBaseStore } from '@/stores/base'

  const baseStore = useBaseStore()

  onMounted(() => {
    // method()
  })
</script>

<style lang="scss" scoped></style>
