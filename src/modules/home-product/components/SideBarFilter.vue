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
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1" title="Thương hiệu">
              <el-checkbox-group
                v-model="checkListBrandProduct"
                class="flex flex-wrap justify-between"
                @change="handleChangeFilter"
              >
                <el-checkbox
                  v-for="item in dataList.brandProduct"
                  :key="item.name"
                  :label="item.value"
                  class="!mr-2 flex w-[90px] flex-wrap"
                  >{{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item name="2" title="Màu sắc">
              <el-checkbox-group v-model="checkListColorProduct" @change="handleChangeFilter">
                <el-checkbox v-for="item in dataList.colorProduct" :key="item.name" :label="item.value"
                  >{{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item name="3" title="Laptop Series">
              <el-checkbox-group v-model="checkListLaptopSeries" @change="handleChangeFilter">
                <el-checkbox v-for="item in dataList.laptopSeries" :key="item.name" :label="item.value"
                  >{{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item name="4" title="Dung lượng Ram">
              <el-checkbox-group v-model="checkListRamCapacity" @change="handleChangeFilter">
                <el-checkbox v-for="item in dataList.ramCapacity" :key="item.name" :label="item.value"
                  >{{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import useAttributeProduct from '@/composables/useAttributeProduct'
  import { Attribute } from '@/util/enum'

  const route = useRoute()
  const { dataList, getAttributeProduct } = useAttributeProduct()

  const value = ref([4, 8])
  const filter: Ref<Record<string, any>> = ref({
    priceTo: '',
    priceFrom: ''
  })
  const checkListBrandProduct: Ref<Record<string, any>> = ref([])
  const checkListColorProduct: Ref<Record<string, any>> = ref([])
  const checkListLaptopSeries: Ref<Record<string, any>> = ref([])
  const checkListHardDiskCapacity: Ref<Record<string, any>> = ref([])
  const checkListHardDiskConnectionType: Ref<Record<string, any>> = ref([])
  const checkListHardDiskType: Ref<Record<string, any>> = ref([])
  const checkListHardDiskSeries: Ref<Record<string, any>> = ref([])
  const checkListMonitorRefreshRate: Ref<Record<string, any>> = ref([])
  const checkListMonitorPanel: Ref<Record<string, any>> = ref([])
  const checkListMonitorResolution: Ref<Record<string, any>> = ref([])
  const checkListMonitorSize: Ref<Record<string, any>> = ref([])
  const checkListRamCapacity: Ref<Record<string, any>> = ref([])
  const checkListRamSeries: Ref<Record<string, any>> = ref([])
  const checkListCpuSocket: Ref<Record<string, any>> = ref([])
  const checkListCpuSeries: Ref<Record<string, any>> = ref([])
  const checkListMouseType: Ref<Record<string, any>> = ref([])

  const activeNames = ref(['1', '2', '3', '4'])
  // const data: Ref<Record<string, any>> = ref({})
  onMounted(async () => {
    const pathUrl = route.params.category
    if (pathUrl === 'laptop') {
      await getAttributeProduct([Attribute.brandProduct, Attribute.colorProduct, Attribute.laptopSeries, Attribute.ramCapacity])
      // console.log(useAttribute.dataList)
      // data.value = dataList
    }
  })

  const handleChangeFilter = () => {
    console.log({ checkListBrandProduct, checkListColorProduct, checkListLaptopSeries })
  }
</script>

<style scoped></style>
