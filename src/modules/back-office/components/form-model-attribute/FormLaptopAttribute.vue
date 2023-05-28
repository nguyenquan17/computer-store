<template>
  <div>
    <el-form ref="ruleFormRef" :model="formAttribute" :rules="rules" label-position="top">
      <div class="flex justify-between">
        <el-form-item label="Thương hiệu" prop="brand">
          <el-select v-model="formAttribute.brand" filterable placeholder="Chọn thương hiệu" remote reserve-keyword>
            <el-option v-for="item in dataList.brandProduct" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Màu sắc" prop="color">
          <el-select v-model="formAttribute.color" filterable placeholder="Chọn màu sắc" remote reserve-keyword>
            <el-option v-for="item in dataList.colorProduct" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex justify-between">
        <el-form-item label="Series Laptop" prop="laptopSeries">
          <el-select v-model="formAttribute.laptopSeries" filterable placeholder="Chọn series laptop" remote reserve-keyword>
            <el-option v-for="item in dataList.laptopSeries" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Series CPU" prop="cpuSeries">
          <el-select v-model="formAttribute.cpuSeries" filterable placeholder="Chọn series laptop" remote reserve-keyword>
            <el-option v-for="item in dataList.cpuSeries" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex w-full">
        <el-form-item class="w-full" label="Kích thước màn hình" prop="monitorSize">
          <el-select
            v-model="formAttribute.monitorSize"
            class="w-full"
            clearable
            filterable
            placeholder="Chọn kích thước màn hình"
            remote
            reserve-keyword
          >
            <el-option v-for="item in dataList.monitorSize" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
      <div class="flex w-full flex-col">
        <el-form-item class="w-full" label="Màn hình" prop="monitorModel">
          <el-input
            v-model="formAttribute.monitorModel"
            placeholder="VD: 14\( 2880 x 1800 ) OLED 90Hz , Màn hình gương, HD webcamm"
          ></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Lưu trữ" prop="laptopStorage">
          <el-input v-model="formAttribute.laptopStorage" placeholder="VD: 512GB SSD M.2 NVMe"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Ram" prop="ramModel">
          <el-input v-model="formAttribute.ramModel" placeholder="VD: 16GB Onboard LPDDR5"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="VGA" prop="vgaModel">
          <el-input v-model="formAttribute.vgaModel" placeholder="VD: Onboard Intel Iris Xe Graphics"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="CPU" prop="cpuModel">
          <el-input v-model="formAttribute.cpuModel" placeholder="VD: Core i7 , Intel Core thế hệ thứ 12 , Intel EVO"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Mô tả kích thước máy" prop="sizeDescription">
          <el-input v-model="formAttribute.sizeDescription" placeholder="VD: 31.36 x 22.06 x 1.69 cm"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Bàn phím" prop="keyboardModel">
          <el-input v-model="formAttribute.keyboardModel" placeholder="VD: thường , không phím số , LED"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Cổng kết nối" prop="laptopConnectionPort">
          <el-input
            v-model="formAttribute.laptopConnectionPort"
            placeholder="VD: 1 x USB 3.2 , 2 x Thunderbolt 4 , 1 x micro SD card slot , Audio combo"
          ></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Số cổng lưu trữ tối đa" prop="laptopMaxNumberOfStoragePorts">
          <el-input v-model="formAttribute.laptopMaxNumberOfStoragePorts" placeholder="VD: 1 x M.2 NVMe"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Hệ điều hành" prop="laptopOperatingSystem">
          <el-input v-model="formAttribute.laptopOperatingSystem" placeholder="VD: Windows 11 Home Windows 11"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Cổng xuất hình" prop="laptopOutputPort">
          <el-input v-model="formAttribute.laptopOutputPort" placeholder="VD: 1 x HDMI"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Pin" prop="battery">
          <el-input v-model="formAttribute.battery" placeholder="VD: 4 cell 75 Wh , Pin liền"></el-input>
        </el-form-item>
        <el-form-item class="w-full" label="Khối lượng" prop="weight">
          <el-input v-model="formAttribute.weight" placeholder="VD: 1.3 kg"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
  import type { FormInstance, FormRules } from 'element-plus'
  import type { IAttribute } from '@/interfaces'
  import useAttributeProduct from '@/composables/useAttributeProduct'
  import { Attribute } from '@/util/enum'

  const { dataList, getAttributeProduct } = useAttributeProduct()
  const formAttribute: Ref<IAttribute> = ref({
    brand: '',
    color: '',
    laptopSeries: '',
    cpuSeries: '',
    cpuModel: '',
    ramModel: '',
    vgaModel: '',
    monitorSize: '',
    monitorModel: '',
    laptopStorage: '',
    sizeDescription: '',
    keyboardModel: '',
    laptopConnectionPort: '',
    laptopMaxNumberOfStoragePorts: '',
    laptopOperatingSystem: '',
    laptopOutputPort: '',
    warranty: '',
    weight: '',
    battery: ''
  })
  const emits = defineEmits<{
    (e: 'form-attribute', formAttribute: Record<string, any>)
  }>()
  const ruleFormRef = ref<FormInstance>()
  const rules = ref<FormRules>({
    consigneeName: [{ required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' }],
    consigneePhoneNumber: [
      {
        required: true,
        message: 'Vui lòng nhập số điện thoại',
        trigger: 'blur'
      }
    ],
    deliveryAddress: [
      {
        required: true,
        message: 'Vui lòng nhập địa chỉ',
        trigger: 'blur'
      }
    ]
  })
  // const dataAttribute: Ref<Record<string, any>> = ref([])
  onMounted(async () => {
    await getAttributeProduct([
      Attribute.brandProduct,
      Attribute.colorProduct,
      Attribute.laptopSeries,
      Attribute.cpuSeries,
      Attribute.monitorSize
    ])
    // dataAttribute.value = dataList
  })
  watch(
    formAttribute,
    () => {
      console.log(123)
      emits('form-attribute', formAttribute.value)
    },
    { deep: true }
  )
</script>

<style scoped></style>
