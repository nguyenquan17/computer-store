<template>
  <div class="form-verify w-[512px] bg-white m-auto rounded-lg shadow-lg py-[30px] px-6">
    <p class="text-[30px] leading-[45px] font-semibold text-center color-[#201f1e]">{{ title }}</p>
    <div class="flex items-center">
      <base-icon :icon="getIcon" size="80" />
      <el-form
        ref="form-verify"
        label-position="top"
        :model="form"
        :rules="rules"
        class="w-full mt-[17px] ml-[10px]"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="code" label="Enter 2-step authentication code:" class="form-item-code">
          <el-input v-model.trim="form.code" type="text" maxlength="6" placeholder="Verification code" />
        </el-form-item>
      </el-form>
    </div>
    <base-button :loading="isLoading" :disabled="form.code.length !== 6" @click="handleSubmit">Submit</base-button>
    <div v-if="route.params.type !== 'app'" class="mt-6 flex justify-center text-base text-[#605e5c]">
      <p>Didn’t receive any verification code? &nbsp;</p>
      <p class="text-hyperlink font-semibold cursor-pointer">Resend code</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { apiAuth } from '@/services'
  import type { FormRules } from 'element-plus'
  import { useAuthStore } from '../store'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()

  const form = ref({
    code: ''
  })
  const isLoading = ref(false)

  const rules = ref<FormRules>({
    code: [
      {
        required: true,
        message: 'Please enter verification code',
        trigger: 'blur'
      }
    ]
  })

  const title = computed((): string => {
    switch (route.params.type) {
      case 'email':
        return 'Enter the 6-digit code we texted to your email'
      case 'app':
        return 'Enter the 6-digit code from your authenticator app'
      default:
        return 'Enter the 6-digit code we texted to your phone number'
    }
  })

  const getIcon = computed((): string => {
    return `verify-${route.params.type}`
  })

  const handleSubmit = async () => {
    try {
      isLoading.value = true
      let message: any = ''
      // const type = this.$route.query.type
      const password = route.query.pass
      const email = route.query.email
      const reason = route.query.reason
      const data: Record<string, any> = {
        email,
        password,
        verificationCode: form.value.code
      }

      if (reason === 'REQUEST_LOGIN') {
        // const encodePass = this.$options.filters?.encryptPassword(password)
        authStore
          .login({ ...data })
          .then(async () => {
            const result = await apiAuth.getInfo()
            const listRoles = result.roles

            if ((listRoles.length == 1 && listRoles.includes('INVESTOR')) || listRoles.length == 0) {
              message = 'You don’t have permission to access'
              ElMessage.error({ message, duration: 5000 })
              await authStore.logout()
              router.push({ name: 'login' })
            } else {
              message = 'Verification successful'
              ElMessage.error({ message, duration: 5000 })
              router.push({ name: 'Customer', params: { type: 'all' } })
            }

            isLoading.value = false
          })
          .catch(() => {
            isLoading.value = false
          })
      }

      if (reason === 'VERIFY-SMS') {
        delete data.password
        apiAuth
          .verifyCode('CODE', { ...data, type: 'SMS' })
          .then(res => {
            authStore.setUserInfo(res)
            router.push({ name: 'Customer', params: { type: 'all' } })
          })
          .catch(error => {
            isLoading.value = false
          })
      }
    } catch (error) {
      isLoading.value = false
    }
  }
</script>

<style scoped lang="scss">
  .form-verify {
    :deep(.form-item-code) {
      .el-form-item__label {
        font-size: 16px;
        color: #605e5c;
        font-weight: 600;
      }
    }
  }
</style>
