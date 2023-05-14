<template>
  <div class="max-w-[83.33%] flex-[0_0_83.33%] px-2 py-2">
    <div class="w-full rounded-lg bg-white">
      <div class="flex h-[64px] w-full border-b border-solid border-[#eaeaea] px-4 text-sm">
        <div class="flex items-center">
          <h3 class="mr-8 text-sm font-bold">Sắp xếp theo</h3>
          <div class="flex justify-between">
            <BaseButton v-for="item in listSort" :key="item.value" class="mr-4" size="medium" type="plain">
              {{ item.name }}
            </BaseButton>
          </div>
        </div>
      </div>
      <div v-if="!isLoading" class="flex min-h-[65vh] flex-wrap justify-start bg-white">
        <div
          v-for="item in listProduct"
          :key="item.id"
          class="h-fit w-[25%] border-b border-r border-l border-solid border-[#eaeaea]"
          @click="handleClickItem(item)"
        >
          <Item :data-item="item" />
        </div>
      </div>
      <div v-else class="flex min-h-[65vh] flex-wrap justify-start bg-white">
        <base-loading class="flex w-full items-center justify-center" tip="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Item from '@/modules/landing/components/Item.vue'
  import { useBaseStore } from '@/stores/base'
  import { apiProduct } from '@/services'
  import type { IProduct } from '@/interfaces'
  import { filter } from 'lodash-es'

  const route = useRoute()
  const router = useRouter()
  const baseStore = useBaseStore()
  const isLoading: Ref<boolean> = ref(false)
  const listProduct: Ref<IProduct[]> = ref([])
  const listSort: Ref<Record<string, any>> = ref([
    {
      name: 'Khuyến mãi tốt nhất',
      value: 'big_promotion'
    },
    {
      name: 'Giá tăng dần',
      value: 'price_asc'
    },
    {
      name: 'Giá giảm dần',
      value: 'price_desc'
    }
  ])
  onMounted(async () => {
    await getProductList()
  })

  const getProductList = async () => {
    try {
      isLoading.value = true
      const body = {
        page: 0,
        size: 20,
        sort: 'desc',
        order: 'productId',
        categoryId: filter(baseStore.listAssetCategory, item => item.path === route.params.category)[0].id
      }
      const result = await apiProduct.getAllProductByCategory(body)
      if (result) {
        listProduct.value = result.data
      }
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      console.log(e)
    }
  }

  const handleClickItem = (item: IProduct): void => {
    console.log(item.productId)
    router.push({ name: 'ProductDetailView', params: { detail: item.productId } })
  }

  watch(
    () => route.params.category,
    () => {
      getProductList()
    }
  )
</script>

<style scoped></style>
