<template>
  <div class="flex items-center border-b border-solid border-border-primary">
    <div
      v-for="(tab, index) in props.listTab"
      :key="index"
      class="px-3 py-4 cursor-pointer hover:text-tab-active"
      :class="{ 'text-tab-active font-semibold border-b-2 border-solid border-[#0151fc]': tab.value === props.tabActive }"
      @click="emit('click', tab)"
    >
      {{ tab.title }}
    </div>
    <slot name="more-tab" />
  </div>
</template>

<script setup lang="ts">
  import type { ITab } from '@/interfaces'

  interface IProps {
    listTab: ITab[]
    tabActive: string
  }

  const props = withDefaults(defineProps<IProps>(), {
    listTab: () => [],
    tabActive: ''
  })

  const emit = defineEmits<{
    (e: 'click', tab: ITab): void
  }>()
</script>

<style scoped></style>
