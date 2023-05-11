<template>
  <base-popup
    :is-show-footer="false"
    class="popup-login"
    name="popup-login"
    width="600px"
    @close="handleClose"
    @open="handleOpen"
  >
    <template #title></template>
    <div class="form-login m-auto px-6 pb-[30px]">
      <p class="mb-5 text-center text-[30px] font-semibold leading-[45px]">Đăng nhập</p>
      <el-form ref="form-login" :model="form" :rules="rules" class="form-item" label-position="top">
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
        <!--        <el-checkbox v-model="remember"-->
        <!--          ><span class="text-base" style="color: #201f1e; font-weight: 400; margin-left: -2px"> Remember me </span>-->
        <!--        </el-checkbox>-->
        <base-button :disabled="getDisableBtn" :loading="isLoading" class="my-6" @click="handleSubmit"> Đăng nhập </base-button>
      </el-form>
      <div class="text-center">
        Bạn chưa có tài khoản? <span class="cursor-pointer text-hyperlink" @click="handleOpenFormSignUp">Đăng ký ngay</span>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts" setup>
  import { useBaseStore } from '@/stores/base'
  import { useAuthStore } from '@/modules/auth/store'
  import { ElMessage } from 'element-plus'
  import type { FormRules } from 'element-plus'

  const router = useRouter()

  const baseStore = useBaseStore()
  const authStore = useAuthStore()

  interface IForm {
    username: string
    password: string
  }

  const form = ref<IForm>({
    username: '',
    password: ''
  })
  const rules = ref<FormRules>({
    username: [
      {
        required: true,
        message: 'Please enter your username',
        trigger: 'blur'
      },
      { type: 'email', message: 'Please enter a correct username', trigger: 'blur' }
    ],
    password: [
      {
        required: true,
        message: 'Please enter password',
        trigger: 'blur'
      }
    ]
  })
  const showPass = ref(false)
  const remember = ref(false)
  const isLoading = ref(false)

  const getDisableBtn = computed(() => {
    return !(form.value.username && form.value.password)
  })

  const handleSubmit = async () => {
    let message = ''
    authStore.login({ ...form.value }).then(async () => {
      await router.push({ name: 'LandingPage' })
      message = 'Đăng nhập thành công'
      ElMessage.success({ message, duration: 5000 })
      baseStore.setOpenPopup(false, 'popup-login')
      // }
    })
  }

  const handleOpenFormSignUp = (): void => {
    baseStore.setOpenPopup(true, 'popup-register')
    baseStore.setOpenPopup(false, 'popup-login')
  }

  const handleOpen = () => {
    console.log()
  }
  const handleClose = () => {
    baseStore.setOpenPopup(false, 'popup-login')
  }
</script>

<style lang="scss" scoped>
  :deep(.el-dialog .popup-login) {
    margin-top: 15vh !important;
  }

  .el-dialog .popup-login {
    margin-top: 15vh !important;
  }
</style>
