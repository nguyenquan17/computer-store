<template>
  <div class="px-6 py-6">
    <div class="mb-4 font-bold">Thông tin tài khoản</div>
    <div>
      <el-form ref="refProfile" :model="formProfile" :rules="rules" e label-position="top">
        <el-form-item label="Họ và tên" prop="fullName">
          <el-input v-model="formProfile.fullName" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="formProfile.email" />
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phoneNumber">
          <el-input v-model="formProfile.phoneNumber" @keypress="useOnlyNumber($event, formProfile.phoneNumber)" />
        </el-form-item>
        <el-form-item label="Địa chỉ" prop="address">
          <el-input v-model="formProfile.address" type="textarea" />
        </el-form-item>
        <el-form-item class="w-full" label="Ngày sinh" prop="dob">
          <el-date-picker v-model="formProfile.dob" class="!w-full" placeholder="Chọn ngày tháng năm" type="date" />
        </el-form-item>
        <el-form-item class="wrap-btn">
          <!--          <base-button class="mr-4" type="plain" @click="resetForm(ruleFormRef)">Hủy bỏ</base-button>-->
          <base-button class="w-[120px]" type="primary" @click="submitForm(ruleFormRef)"> Cập nhật</base-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IUser } from '@/interfaces'
  import useOnlyNumber from '@/composables/onlyNumber'
  import type { FormRules } from 'element-plus'

  const formProfile: Ref<IUser> = ref({
    userId: 7,
    email: 'quan@gmail.com',
    fullName: 'Nguyễn Anh Quân',
    phoneNumber: '0368517926',
    address: 'Hoài Đức, Hà Nội',
    dob: '2000-08-30'
  })
  const rules = ref<FormRules>({
    fullName: [
      {
        required: true,
        message: 'Vui lòng nhập họ tên',
        trigger: 'blur'
      }
    ],
    email: [
      {
        required: true,
        message: 'Vui lòng nhập địa chỉ email',
        trigger: 'blur'
      },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' }
    ],
    phoneNumber: [
      {
        required: true,
        message: 'Vui lòng nhập số điện thoại',
        trigger: 'blur'
      }
    ],
    address: [
      {
        required: true,
        message: 'Vui lòng nhập địa chỉ',
        trigger: 'blur'
      }
    ],
    dob: [
      {
        required: true,
        message: 'Vui lòng chọn ngày sinh',
        trigger: 'blur'
      }
    ]
  })
</script>

<style lang="scss" scoped>
  :deep(.wrap-btn) {
    .el-form-item__content {
      justify-content: flex-end;
    }
  }
</style>
