<template>
  <div v-if="prop.show" class="empty-block pt-[22px]">
    <base-icon icon="no-data" size="100" />
    <p class="empty-text text-description">Không có sản phẩm nào</p>
  </div>
</template>

<script lang="ts" setup>
  interface IProp {
    show: boolean
  }

  const prop = withDefaults(defineProps<IProp>(), {
    show: false
  })
</script>

<style scoped></style>
