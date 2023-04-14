<template>
  <el-dropdown trigger="click" class="ml-[30px]" @command="handleCommand">
    <div class="flex items-center cursor-pointer hover:text-[#0151fc]">
      <base-icon icon="sort" size="18" />
      <p class="text-base ml-[10px] text-primary hover:text-[#0151fc]">Sort by</p>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="menu" :style="{ '--width': widthDropdown }">
        <el-dropdown-item
          v-for="(sort, index) in props.listSort"
          :key="index"
          :command="sort"
          :class="{ active: props.sortActive === sort.value }"
          >{{ sort.title }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import type { ISort } from '@/interfaces'
  interface IProp {
    listSort: ISort[]
    sortActive: string
    widthDropdown?: string | number
  }

  const props = withDefaults(defineProps<IProp>(), {
    listSort: () => [],
    sortActive: '',
    widthDropdown: 180
  })

  const emit = defineEmits<{
    (e: 'sort', command: ISort): void
  }>()

  const widthDropdown = computed(() => {
    return props.widthDropdown + 'px'
  })

  const handleCommand = (command: ISort) => {
    emit('sort', command)
  }
</script>

<style scoped>
  .menu {
    width: var(--width);
  }
</style>
