<template>
  <base-popup
      :is-show-footer="false"
      class="popup-shipping-info"
      name="popup-shipping-info"
      width="600px"
      @close="handleClose"
      @open="handleOpen"
  >
    <template #title>Chỉnh sửa thông tin nhận hàng</template>
    <div>
      <el-form :model="formShipping" :rules="rules" ref="ruleFormRef" e label-position="top">
        <el-form-item label="Họ và tên" prop="consigneeName">
          <el-input v-model="formShipping.consigneeName" />
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="consigneePhoneNumber">
          <el-input v-model="formShipping.consigneePhoneNumber" @keypress="useOnlyNumber($event, formShipping.consigneePhoneNumber)"/>
        </el-form-item>
        <el-form-item label="Địa chỉ nhận hàng" prop="deliveryAddress">
          <el-input v-model="formShipping.deliveryAddress" type="textarea"/>
        </el-form-item>
        <el-form-item class="wrap-btn">
          <base-button class="mr-4" type="plain" @click="resetForm(ruleFormRef)">Hủy bỏ</base-button>
          <base-button type="primary" @click="submitForm(ruleFormRef)">
            Xác nhận
          </base-button>
        </el-form-item>
      </el-form>
    </div>
  </base-popup>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import useOnlyNumber from "@/composables/onlyNumber";
import {useBaseStore} from "@/stores/base";
import type {IFormShipping} from "@/interfaces"
import {ElMessage} from "element-plus";
interface IProps {
  propsForm: IFormShipping
}
const baseStore = useBaseStore()

const formShipping: Ref<IFormShipping> = ref({
  consigneeName: '',
  consigneePhoneNumber: '',
  deliveryAddress: ''
})
const props = withDefaults(defineProps<IProps>(), {
  propsForm: () => ({} as IFormShipping)
})
const emits = defineEmits<{
  (e: 'form-shipping', formShipping: IFormShipping)
}>()
const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules>({
  consigneeName: [
    {required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur'},
  ],
  consigneePhoneNumber: [
    {
      required: true,
      message: 'Vui lòng nhập số điện thoại',
      trigger: 'blur',
    },
  ],
  deliveryAddress: [
    {
      required: true,
      message: 'Vui lòng nhập địa chỉ',
      trigger: 'blur',
    },
  ],
})

const handleOpen = ():void =>{
  formShipping.value = {...props.propsForm}
}
const handleClose = ():void =>{
  resetForm()
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('form-shipping', formShipping.value)
      ElMessage.success({ message:'Cập nhật thông tin thành công', duration: 5000})
      baseStore.setOpenPopup(false, 'popup-shipping-info')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = () => {
  //@ts-ignore
  // console.log(ruleFormRef.value)
  ruleFormRef.value.clearValidate()
  baseStore.setOpenPopup(false, 'popup-shipping-info')

}
</script>

<style scoped lang="scss">
:deep(.wrap-btn){
  .el-form-item__content{
    justify-content: flex-end;
  }
}
</style>