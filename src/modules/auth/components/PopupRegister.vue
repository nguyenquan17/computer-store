<template>
  <base-popup
    :is-show-footer="false"
    class="popup-register"
    name="popup-register"
    width="600px"
    @close="handleClose"
    @open="handleOpen"
  >
    <template #title></template>
    <div class="form-login m-auto px-6 pb-[30px]">
      <p class="mb-5 text-center text-[30px] font-semibold leading-[45px]">Đăng Ký</p>
      <el-form ref="form-login" :model="form" :rules="rules" class="form-item" label-position="top">
        <el-form-item label="Họ tên" prop="clientName">
          <el-input v-model="form.clientName" placeholder="Họ tên" />
        </el-form-item>
        <el-form-item label="Email" prop="username">
          <el-input v-model="form.username" placeholder="Email" type="email" />
        </el-form-item>
        <el-form-item class="input-password" label="Mật khẩu" prop="password">
          <el-input
            v-model="form.password"
            :type="showPass == true ? 'text' : 'password'"
            class="input-password"
            placeholder="Password"
          >
            <template #append>
              <div class="icon-eye cursor-pointer" @click="showPass = !showPass">
                <base-icon :icon="showPass == true ? 'eye-off' : 'eye'" size="22" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Số điện thoại" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="Số điện thoại" />
        </el-form-item>
        <el-form-item label="Địa chỉ" prop="address">
          <el-input v-model="form.address" placeholder="Địa chỉ" />
        </el-form-item>
        <el-form-item class="w-full" label="Ngày sinh" prop="dob">
          <el-date-picker v-model="form.dob" :size="size" class="!w-full" placeholder="Chọn ngày tháng năm" type="date" />
        </el-form-item>
        <base-button :disabled="getDisableBtn" :loading="isLoading" class="my-6" @click="handleSubmit"> Đăng Ký </base-button>
      </el-form>
    </div>
  </base-popup>
</template>

<script lang="ts" setup>
  import { useBaseStore } from '@/stores/base'
  import type { FormRules } from 'element-plus'

  const router = useRouter()
  const baseStore = useBaseStore()

  interface IFormRegister {
    clientName: string
    username: string
    password: string
    phoneNumber: string | number
    address: string
    dob: string
  }

  const form = ref<IFormRegister>({
    clientName: '',
    username: '',
    password: '',
    phoneNumber: '',
    address: '',
    dob: ''
  })
  const rules = ref<FormRules>({
    clientName: [
      {
        required: true,
        message: 'Vui lòng nhập họ tên',
        trigger: 'blur'
      }
    ],
    username: [
      {
        required: true,
        message: 'Vui lòng nhập địa chỉ email',
        trigger: 'blur'
      },
      { type: 'email', message: 'Vui lòng nhập đúng địa chỉ email', trigger: 'blur' }
    ],
    password: [
      {
        required: true,
        message: 'Vui lòng nhập mật khẩu',
        trigger: 'blur'
      }
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
  const showPass = ref(false)
  const isLoading = ref(false)

  const getDisableBtn = computed(() => {
    return !(
      form.value.username &&
      form.value.password &&
      form.value.clientName &&
      form.value.phoneNumber &&
      form.value.address &&
      form.value.dob
    )
  })

  const handleSubmit = (): void => {
    console.log()
  }

  // const handleOpenFormSignIn = (): void => {
  //   router.push({ name: 'FormSignIn' })
  //   baseStore.setOpenPopup(true, 'popup-login')
  //   baseStore.setOpenPopup(false, 'popup-register')
  // }

  const handleOpen = () => {
    console.log()
  }
  const handleClose = () => {
    baseStore.setOpenPopup(false, 'popup-login')
    router.push({ name: 'LandingPage' })
  }
</script>

<style scoped></style>
