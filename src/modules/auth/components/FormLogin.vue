<template>
  <div class="form-login w-[512px] bg-white m-auto rounded-lg shadow-lg py-[30px] px-6">
    <p class="text-[30px] leading-[45px] font-semibold mb-5 text-center">Sign In</p>
    <el-form ref="form-login" label-position="top" class="form-item" :model="form" :rules="rules">
      <el-form-item prop="email">
        <el-input v-model="form.email" placeholder="Email" type="email" />
      </el-form-item>
      <el-form-item prop="password" class="input-password">
        <el-input
          v-model="form.password"
          class="input-password"
          :type="showPass == true ? 'text' : 'password'"
          placeholder="Password"
        >
          <template #append>
            <div class="icon-eye cursor-pointer" @click="showPass = !showPass">
              <base-icon :icon="showPass == true ? 'eye-off' : 'eye'" size="22" />
            </div>
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="remember"
        ><span class="text-base" style="color: #201f1e; font-weight: 400; margin-left: -2px"> Remember me </span></el-checkbox
      >
      <div v-if="systemParams && systemParams['api.auto.test'] !== '1'" class="flex justify-center mt-[20px]">
        <vue-recaptcha
          ref="recaptcha"
          :load-recaptcha-script="true"
          :sitekey="baseStore.siteKey"
          @verify="verifyCaptcha"
          @expired="expiredCaptcha"
        ></vue-recaptcha>
      </div>
      <base-button class="my-6" :loading="isLoading" :disabled="getDisableBtn" @click="handleSubmit"> Sign In </base-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus'
  import { VueRecaptcha } from 'vue-recaptcha'
  import { ElMessage } from 'element-plus'
  import { useBaseStore } from '@/stores/base'
  import { useAuthStore } from '../store'
  import { useEncrypt } from '@/composables/encrypt'
  import { apiAuth } from '@/services'

  const router = useRouter()

  const baseStore = useBaseStore()
  const authStore = useAuthStore()

  interface IForm {
    email: string
    password: string
  }

  const form = ref<IForm>({
    email: '',
    password: ''
  })
  const rules = ref<FormRules>({
    email: [
      {
        required: true,
        message: 'Please enter your email',
        trigger: 'blur'
      },
      { type: 'email', message: 'Please enter a correct email address', trigger: 'blur' }
    ],
    password: [
      {
        required: true,
        message: 'Please enter password',
        trigger: 'blur'
      }
    ]
  })
  const captcha = ref('')
  const showPass = ref(false)
  const remember = ref(false)
  const isVerifyCaptcha = ref(false)
  const isLoading = ref(false)

  const systemParams = computed(() => {
    return baseStore.systemParams
  })

  const getDisableBtn = computed(() => {
    if (systemParams.value && systemParams.value['api.auto.test'] !== '1') {
      return !(form.value.email && form.value.password && isVerifyCaptcha.value)
    }
    return !(form.value.email && form.value.password)
  })

  const verifyCaptcha = (response: string) => {
    captcha.value = response
    isVerifyCaptcha.value = true
  }
  const expiredCaptcha = () => {
    isVerifyCaptcha.value = false
  }

  const handleSubmit = async () => {
    const encryptText = useEncrypt(form.value.password)
    const validate = await apiAuth.validateUser({ ...form.value, password: encryptText.value }, captcha.value)
    let message = ''
    if (!validate.emailVerified && !validate.phoneVerified) {
      router.push({
        name: 'VerifyAuth',
        params: { type: 'email' },
        query: { type: 'EMAIL', email: form.value.email, reason: 'SIGN_UP' }
      })
      message = 'Verification code sent successfully'
      ElMessage.success({ message, duration: 5000 })
    } else if (validate.emailVerified && !validate.phoneVerified) {
      router.push({ name: 'VerifyAuth', params: { type: 'email' }, query: { email: form.value.email } })
    } else if (validate.emailVerified && validate.phoneVerified && (validate.type === 'EMAIL' || validate.type === 'SMS')) {
      router.push({
        name: 'VerifyAuth',
        params: { type: (validate.type as string).toLowerCase() },
        query: { type: validate.type, email: form.value.email, pass: encryptText.value as string, reason: 'REQUEST_LOGIN' }
      })
    } else if (validate.emailVerified && validate.phoneVerified && validate.type === 'APP') {
      router.push({
        name: 'VerifyAuth',
        params: { type: 'app' },
        query: { type: validate.type, email: form.value.email, pass: encryptText.value as string, reason: 'REQUEST_LOGIN' }
      })
    } else if (validate.type === 'NONE') {
      authStore.login({ ...form.value, password: encryptText.value }).then(async () => {
        const result = await apiAuth.getInfo()
        const listRoles = result.roles

        if ((listRoles.length == 1 && listRoles.includes('INVESTOR')) || listRoles.length == 0) {
          message = 'You don’t have permission to access'
          ElMessage.error({ message, duration: 5000 })
          await authStore.logout()
        } else {
          router.push({ name: 'Customer', params: { type: 'all' } })
          message = 'Logged in successfully'
          ElMessage.success({ message, duration: 5000 })
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .form-item {
    :deep(.el-input-group) {
      &:hover {
        .el-input-group__append {
          border-color: var(--color-input-hover-border);
        }
      }
      .el-input__wrapper {
        border-right: none !important;
      }
      .el-input-group__append {
        color: #a19f9d;
        background: transparent;
      }
    }
  }
</style>
