<template>
  <span class="inline-flex">
    <svg aria-hidden="true" class="svg-icon" :style="{ width: size, height: size, '--color': color }">
      <use :href="symbolId" :fill="color" />
    </svg>
  </span>
</template>

<script setup>
  const props = defineProps({
    icon: {
      type: String,
      default: 'icon',
      required: true
    },
    size: {
      type: String,
      default: '16',
      required: false
    },
    color: {
      type: String,
      default: 'inherit',
      required: false
    }
  })

  const symbolId = computed(() => `#icon-${props.icon}`)
</script>

<style scoped lang="scss">
  .svg-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    color: var(--color);
    vertical-align: middle;
    fill: currentColor;
    // stroke: currentColor;
  }
</style>
