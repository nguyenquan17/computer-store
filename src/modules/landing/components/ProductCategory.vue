<template>
  <div class="landing-product">
    <div class="m-auto mb-6 max-w-[1232px] pr-4 pl-4">
      <div class="relative h-[469px] min-h-[416px]">
        <img
          alt=""
          class="absolute top-0"
          src="https://lh3.googleusercontent.com/vCgMx7AxHVMI7Nf8XhXnYtaF96F8Xq-uOorLiXS4Q986mvZ4Qg0OXTz9n34utNLtguQmU1WTKplnTZLaWn2KCqi9r6toQYo=w1232"
        />
        <div class="relative flex h-[3.5rem] items-center justify-between border-b border-solid border-[#ffffff80] pl-4 pr-4">
          <!--          router-link-->
          <p class="text-xl font-bold text-label">Laptop</p>
          <p class="text-sm font-semibold text-label">Xem tất cả</p>
        </div>
        <div class="px-3 py-3">
          <div class="relative overflow-hidden">
            <div class="flex">
              <Item v-for="item in dataBlock" :key="item.id" :data-item="item" @click="handleClickItem(item)"></Item>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Item from '../components/Item.vue'
  import type { ICategory, IProduct } from '@/interfaces'
  import { apiProduct } from '@/services'

  interface IProps {
    dataCategory: ICategory
  }

  const router = useRouter()
  const props = withDefaults(defineProps<IProps>(), {
    dataCategory: () => ({} as ICategory)
  })
  const dataBlock: Ref<IProduct[]> = ref([])

  onMounted(async () => {
    await getProductListLanding()
  })

  const getProductListLanding = async () => {
    try {
      const body = {
        page: 0,
        size: 5,
        sort: 'desc',
        order: 'productId',
        categoryId: props.dataCategory.id
      }
      const result = await apiProduct.getAllProductByCategory(body)
      dataBlock.value = result.data.content
    } catch (e) {
      console.log(e)
    }
  }

  const handleClickItem = (item: IProduct): void => {
    router.push({ name: 'ProductDetailView', params: { detail: item.productId } })
  }
</script>

<style scoped></style>
