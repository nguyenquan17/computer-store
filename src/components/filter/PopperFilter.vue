<template>
  <el-popover
    v-model:visible="isOpen"
    placement="bottom"
    :trigger="props.trigger"
    :width="props.width"
    :hide-after="0"
    popper-class="popper-filter"
  >
    <div class="content">
      <slot />

      <div v-if="props.showFooter" class="h-[65px] flex items-center justify-end border-t border-solid border-[#d2d0ce]">
        <base-button type="plain" size="medium" class="w-[100px] font-normal text-sm" @click="handleReset">Reset</base-button>
        <base-button size="medium" class="w-[100px] font-normal text-sm ml-[10px]" @click="handleApply">Apply</base-button>
      </div>
    </div>
    <template #reference>
      <div class="flex items-center cursor-pointer hover:text-[#0151fc]">
        <base-icon icon="filter" size="18" />
        <p class="text-base ml-[10px]">Filter</p>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
  interface IProp {
    trigger?: 'click' | 'hover'
    width?: number | string
    showFooter?: boolean
  }

  const props = withDefaults(defineProps<IProp>(), {
    trigger: 'click',
    width: 200,
    showFooter: true
  })

  const emit = defineEmits(['reset', 'apply'])

  const isOpen = ref(false)

  const handleApply = () => {
    isOpen.value = false
    emit('apply')
  }
  const handleReset = () => {
    isOpen.value = false
    emit('reset')
  }
</script>

<style scoped></style>
