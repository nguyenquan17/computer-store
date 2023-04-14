<template>
  <div v-if="prop.show" class="empty-block pt-[22px]">
    <base-icon icon="no-data" size="100" />
    <p class="empty-text">There are no data</p>
  </div>
</template>

<script setup lang="ts">
  interface IProp {
    show: boolean
  }

  const prop = withDefaults(defineProps<IProp>(), {
    show: false
  })
</script>

<style scoped></style>
