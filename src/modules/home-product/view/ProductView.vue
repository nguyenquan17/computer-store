<template>
  <div>
    <div>
      <div class="m-auto w-full max-w-[1232px] px-4 py-4">
        <div class="flex flex-row">
          <SideBarFilter/>
          <ProductList/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SideBarFilter from '../components/SideBarFilter.vue'
import ProductList from '../components/ProductList.vue'


</script>

<style scoped></style>
