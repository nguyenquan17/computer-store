<template>
  <div class="base-filter flex items-center py-6 pl-6">
    <el-input v-model="search" placeholder="Search" class="mr-[30px]" @input="handleSearch">
      <template #prepend>
        <base-icon icon="search" size="24" />
      </template>
    </el-input>

    <template v-if="showFilter">
      <popper-filter v-if="props.popper" :width="widthPopper" @reset="emits('reset')" @apply="emits('apply')">
        <slot name="filter" />
      </popper-filter>
      <div v-else class="flex items-center cursor-pointer hover:text-[#0151fc]" @click="handleOpenPopupFilter">
        <base-icon icon="filter" size="18" />
        <p class="text-base ml-[10px]">Filter</p>
      </div>
    </template>

    <dropdown-sort
      v-if="showSort"
      :list-sort="props.listSort"
      :sort-active="props.sortActive"
      :width-dropdown="props.widthDropdown"
      @sort="handleSort"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ISort } from '@/interfaces'
  import { debounce, trim } from 'lodash-es'
  import { useBaseStore } from '@/stores/base'
  const baseStore = useBaseStore()
  interface IProp {
    popper?: boolean
    buttonRight?: boolean
    listSort?: ISort[]
    sortActive?: string
    widthPopper?: string | number
    widthDropdown?: string | number
    showFilter?: boolean
    showSort?: boolean
    popupName?: string
  }

  const props = withDefaults(defineProps<IProp>(), {
    popper: true,
    buttonRight: false,
    listSort: () => [],
    sortActive: '',
    widthPopper: 200,
    widthDropdown: 180,
    showFilter: true,
    showSort: true,
    popupName: ''
  })

  const emits = defineEmits<{
    (e: 'sort', command: ISort): void
    (e: 'search', text: string): void
    (e: 'reset'): void
    (e: 'apply'): void
  }>()

  const search = ref('')

  defineExpose({
    search
  })

  const handleSort = (command: ISort) => {
    emits('sort', command)
  }

  const handleSearch = () => {
    searchText()
  }

  const handleOpenPopupFilter = () => {
    baseStore.setOpenPopup(true, props.popupName)
  }

  const searchText = debounce(() => {
    emits('search', trim(search.value))
  }, 500)
</script>

<style scoped lang="scss">
  .base-filter {
    :deep(.el-input) {
      width: 400px;
      height: 48px;
      border: 1px solid var(--color-input-border);
      border-radius: 4px;
      &:hover,
      &:focus {
        border-color: var(--color-input-hover-border);
      }
      .el-input-group__prepend {
        padding: 0 10px 0 12px;
        box-shadow: none;
        background-color: transparent;
      }
      .el-input__wrapper {
        border: none;
        box-shadow: none;
        padding-left: 0;

        .el-input__inner {
          font-size: 16px;
          height: 100%;
          color: var(--color-text);
        }
      }
    }
  }
</style>
