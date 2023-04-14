<template>
  <div
    class="button"
    :class="[
      `button--${props.size}`,
      `button--${props.type}`,
      { 'button--loading': props.loading, 'button--disabled': props.disabled }
    ]"
    @click="emit('click')"
  >
    <el-icon v-if="props.loading" class="is-loading">
      <i-ep-loading />
    </el-icon>
    <div class="title">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface IProps {
    size?: 'large' | 'medium' | 'small'
    type?: 'primary' | 'neutral' | 'secondary' | 'plain'
    disabled?: boolean
    loading?: boolean
  }
  const props = withDefaults(defineProps<IProps>(), {
    size: 'large',
    type: 'primary',
    disabled: false,
    loading: false
  })
  const emit = defineEmits(['click'])
</script>

<style scoped lang="scss">
  .button {
    border-radius: 6px;
    cursor: pointer;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    &--large {
      height: 48px;
    }
    &--medium {
      height: 40px;
    }
    &--small {
      height: 25px;
    }
    &--primary {
      background-color: var(--background-button-primary);
      color: var(--text-button-primary);
      &:hover {
        background-color: var(--background-button-primary-hover);
      }
    }
    &--secondary {
      background-color: var(--background-button-secondary);
      color: var(--text-button-secondary);
      &:hover {
        background-color: var(--background-button-secondary-hover);
      }
    }
    &--neutral {
      background-color: var(--background-button-neutral);
      color: var(--text-button-neutral);
      &:hover {
        background-color: var(--background-button-neutral-hover);
      }
    }
    &--plain {
      background-color: transparent;
      color: var(--text-button-plain);
      border: 1px solid var(--color-border-primary);
      &:hover {
        color: var(--text-button-plain-hover);
        border-color: #0078d4;
      }
    }

    &--disabled {
      cursor: default;
      background-color: var(--background-button-disabled);
      pointer-events: none;
      &:hover {
        background-color: var(--background-button-disabled);
      }
    }
    &--loading {
      cursor: default;
      pointer-events: none;
    }
    .is-loading {
      margin-right: 6px;
    }
  }
</style>
