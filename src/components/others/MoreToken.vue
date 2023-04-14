<template>
  <el-popover v-model:visible="isOpen" placement="bottom" popper-class="popper-token-more" width="200" trigger="click" class="p-2">
    <template #reference>
      <div class="px-3 py-4 cursor-pointer hover:text-tab-active">More...</div>
    </template>
    <div>
      <el-input v-model="search" class="input-search py-0 px-5 h-10" placeholder="Search" @input="handleSearch"> </el-input>
      <div class="list-more-token max-h-[300px] mt-2 overflow-y-auto">
        <div v-if="tabTokenMore.length">
          <div
            v-for="token in tabTokenMore"
            :key="token.id"
            :class="route.params.currency === token.currency ? 'text-tab-active font-semibold' : null"
            class="token-more cursor-pointer h-[40px] py-0 px-5 text-base leading-10 hover:text-tab-active"
            @click="handleSelectCurrency(token)"
          >
            {{ token.currency }}
          </div>
        </div>
        <empty-block v-else />
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useBaseStore } from '@/stores/base'
  import type { IAssetToken } from '@/interfaces'
  import { debounce, filter, includes, trim } from 'lodash-es'
  import { onMounted } from 'vue'

  const router = useRouter()
  const route = useRoute()

  const baseStore = useBaseStore()
  const isOpen: Ref<boolean> = ref(false)
  const search: Ref<string> = ref('')
  const tabTokenMore = ref<IAssetToken[]>([])
  const originTabTokenMore = ref<IAssetToken[]>([])
  const emit = defineEmits<{
    (e: 'select', token: string): void
  }>()

  onMounted(() => {
    console.log(baseStore.listAssetToken)
    tabTokenMore.value = filter(
      baseStore.listAssetToken,
      token => !includes(['MAGIC', 'ETH', 'BNB', 'USDT', 'BUSD'], token.currency)
    )
    originTabTokenMore.value = filter(
      baseStore.listAssetToken,
      token => !includes(['MAGIC', 'ETH', 'BNB', 'USDT', 'BUSD'], token.currency)
    )
  })

  const handleSearch = (value: string): void => {
    searchText(trim(value).toLowerCase())
  }

  const searchText = debounce((value: string): void => {
    if (value) {
      tabTokenMore.value = filter(
        originTabTokenMore.value,
        token => token.currency.toLowerCase().includes(value) || token.currencyName.toLowerCase().includes(value)
      )
    } else {
      tabTokenMore.value = originTabTokenMore.value
    }
  })

  const handleSelectCurrency = (token: IAssetToken): void => {
    emit('select', token.currency)
    isOpen.value = false
    search.value = ''
    tabTokenMore.value = originTabTokenMore.value
  }
</script>

<style scoped lang="scss"></style>
<style lang="scss">
  .popper-token-more {
    padding: 12px 0 !important;
    .empty-block {
      padding: 0 !important;
      text-align: center;
      .span-icon {
        font-size: 70px !important;
      }
    }
  }
</style>
