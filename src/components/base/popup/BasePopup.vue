<template>
  <el-dialog
    v-model="isOpen"
    :width="props.width"
    :append-to-body="props.appendBody"
    :close-on-press-escape="props.closePressEscape"
    :close-on-click-modal="props.closeClickModal"
    :top="props.top"
    class="base-popup"
    @open="handleOpen"
    @close="handleClose"
  >
    <template #header>
      <div class="text-l text-grey-190 text-semibold uppercase text-[18px] font-semibold">
        <slot name="title" />
      </div>
    </template>

    <div class="popup-content">
      <slot />
    </div>
    <template v-if="isShowFooter" #footer>
      <div class="popup-footer">
        <slot name="footer" />
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { findIndex } from 'lodash'
  import { useBaseStore } from '@/stores/base'

  interface IPopup {
    name: string
    width: string
    appendBody?: boolean
    isShowFooter?: boolean
    top?: string
    closeClickModal?: boolean
    closePressEscape?: boolean
  }
  const props = withDefaults(defineProps<IPopup>(), {
    name: '',
    width: '600px',
    top: '5vh',
    isShowFooter: true,
    appendBody: true,
    closeClickModal: false,
    closePressEscape: true
  })

  const emits = defineEmits<{
    (e: 'close'): void
    (e: 'open'): void
  }>()

  const baseStore = useBaseStore()

  const isOpen = computed({
    // getter
    get() {
      return (
        findIndex(baseStore.popup, value => {
          return value === props.name
        }) !== -1
      )
    },
    // setter
    set(value: boolean) {
      baseStore.setOpenPopup(value, props.name)
    }
  })

  function handleOpen() {
    emits('open')
  }
  function handleClose() {
    emits('close')
  }
</script>

<style scoped></style>
