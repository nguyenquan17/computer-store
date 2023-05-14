<template>
  <div>
    <Banner />
    <div v-for="(dataCategory, index) in categoryFilterHome" :key="index">
      <ProductCategory :data-category="dataCategory" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Banner from '../components/Banner.vue'
  import ProductCategory from '@/modules/landing/components/ProductCategory.vue'
  import { useBaseStore } from '@/stores/base'
  import { filter, includes } from 'lodash-es'
  import type { ICategory } from '@/interfaces'

  const baseStore = useBaseStore()
  onMounted(async () => {
    // await getProductListLanding()
  })

  const categoryFilterHome = computed<ICategory[]>(() => {
    return filter(baseStore.listAssetCategory, item => includes(['Laptop', 'Bàn phím', 'Chuột máy tính', 'RAM'], item.name))
  })

  // const getProductListLanding = async () => {
  //   try {
  //     const categoryFilter = filter(baseStore.listAssetCategory, item =>
  //       includes(['Laptop', 'Bàn phím', 'Chuột máy tính', 'RAM'], item.name)
  //     )
  //
  //     const promises = forEach(categoryFilter, async item => {
  //       const body = {
  //         page: 0,
  //         size: 10,
  //         sort: 'desc',
  //         order: 'productId',
  //         categoryId: item.id
  //       }
  //       const result = await apiProduct.getAllProductByCategory(body)
  //       data.value.push(result.data)
  //       return data.value
  //     })
  //     console.log(promises)
  //
  //     // const body = {
  //     //   page: 0,
  //     //   size: 10,
  //     //   sort: 'desc',
  //     //   order: 'productId',
  //     //   categoryId: 1
  //     // }
  //     // const result = await apiProduct.getAllProductByCategory(body)
  //     // console.log(result)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
</script>

<style scoped></style>
