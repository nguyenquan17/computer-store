<template>
  <div class="max-w-[20%] flex-[0_0_20%] px-2 py-2">
    <div class="flex flex-col rounded-lg bg-white px-[12px] py-[12px]">
      <el-form>
        <div class="price">
          <div class="mb-1 text-sm font-bold">Khoảng giá</div>
          <div class="flex">
            <el-form-item class="mr-2" label="">
              <el-input v-model="filter.priceFrom" clearable placeholder="0"></el-input>
            </el-form-item>
            <div class="mr-2 text-description">-</div>
            <el-form-item label="">
              <el-input v-model="filter.priceTo" clearable placeholder="0"></el-input>
            </el-form-item>
          </div>
          <div class="slider-demo-block">
            <el-slider v-model="value" :max="10" range show-stops size="small" />
          </div>
        </div>
        <div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1" title="Attribute">
              <el-checkbox-group v-model="checkList" class="flex flex-wrap justify-between">
                <el-checkbox
                  v-for="item in data.brandProduct"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                  class="!mr-2 flex w-[90px] flex-wrap"
                ></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item name="2" title="Attribute">
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="item in data.colorProduct"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item name="3" title="Attribute">
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="item in data.laptopSeries"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item name="4" title="Attribute"></el-collapse-item>
          </el-collapse>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import useAttributeProduct from '@/composables/useAttributeProduct'

  const route = useRoute()
  const useAttribute = useAttributeProduct()

  const value = ref([4, 8])
  const filter: Ref<Record<string, any>> = ref({
    priceTo: '',
    priceFrom: ''
  })
  const data: Ref<Record<string, any>> = ref({})
  onMounted(async () => {
    const pathUrl = route.params.category
    if (pathUrl === 'laptop') {
      await useAttribute.getAttributeProduct(['brandProduct', 'colorProduct', 'laptopSeries'])
      console.log(useAttribute.dataList)
      data.value = useAttribute.dataList
    }
  })
</script>

<style scoped></style>
