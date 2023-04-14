<template>
  <div class="bc-verify">
    <h3 class="text-3xl text-center text-semibold title-form">{{ getTittle }}</h3>
    <div class="be-flex verify-code">
      <base-icon :icon="getIcon" size="80" />
      <div class="ml-1 w-100 input-code">
        <el-form :model="form" :rules="rules" ref="form-verify" @submit.native.prevent="handleSubmit">
          <el-form-item prop="code" :label="`${$t('verify.label')}`" class="no-require-label">
            <el-input type="text" v-model.trim="form.code" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-button :loading="isLoading" :class="getDisableBtn ? 'btn--disabled' : null" class="btn w-100 is-none-border cursor" @click="handleSubmit"
      >{{ $t('verify.submit') }}
    </el-button>
    <!-- <button :class="getDisableBtn ? 'btn--disabled' : null" type="button" class="btn is-none-border w-100 cursor" @click="handleSubmit">{{ $t('verify.submit') }}</button> -->
    <div v-if="$route.name !== 'verify-app'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
      {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCode"> {{ $t('verify.re-send') }} </span>
    </div>
    <div v-if="$route.query.reason === 'VERIFY-SMS'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
      <span class="text-hyperlink text-semibold cursor" @click="handleUseOtherPhone"> {{ $t('verify.another-phone') }} </span>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import getRepository from '@/services'
  import { VerifyRepository } from '@/services/repositories/verify'
  import { AuthRepository } from '@/services/repositories/auth'
  import { IBodyApiVerify } from '@/interface'
  import { namespace } from 'vuex-class'
  import { includes } from 'lodash'
  const bcAuth = namespace('beAuth')
  const apiVerify: VerifyRepository = getRepository('verify')
  const apiAuth: AuthRepository = getRepository('auth')

  @Component
  export default class VerifyPage extends Vue {
    @bcAuth.Action('login') login!: (data: Record<string, any>) => Promise<void>
    @bcAuth.Action('logout') logout!: () => Promise<void>
    @bcAuth.Mutation('SET_USER_INFO') setUserInfo!: (data: Record<string, any>) => void

    form: Record<string, any> = {
      code: ''
    }
    isLoading = false
    rules: Record<string, any> = {
      code: [
        {
          required: true,
          message: this.$t('verify.wrong-code'),
          trigger: 'blur'
        }
      ]
    }
    get getDisableBtn(): boolean {
      return this.form.code.length !== 6
    }

    get getIcon(): string {
      const name = this.$route.name
      if (name === 'verify-phone') {
        return 'verify-phone'
      }
      if (name === 'verify-email') {
        return 'verify-email'
      }
      return 'verify-app'
    }

    get getTittle(): string | any {
      const name = this.$route.name
      if (name === 'verify-phone') {
        return this.$t('verify.title-phone')
      }
      if (name === 'verify-email') {
        return this.$t('verify.title-email')
      }
      return this.$t('verify.title-app')
    }

    clearValidate(): void {
      //@ts-ignore
      this.$refs['form-verify']?.resetFields()
    }

    handleUseOtherPhone(): void {
      this.$router.push({ name: 'verify-phone-number', query: { email: this.$route.query.email } })
    }

    async handleResendCode(): Promise<void> {
      try {
        let message: any = ''
        const email = this.$route.query.email
        // const reason = this.$route.query.reason
        const type = this.$route.query.type
        await apiAuth.resendCode({ email, type, reason: 'FOR_LOGIN' })
        message = this.$t('notify.send-code')
        this.$message.success({ message, duration: 5000 })
      } catch (error: any) {
        let message: any = ''
        const { config, data } = error.response
        if (data.status === 'USER_BLOCKED' && includes(config.url, 'resendCode')) {
          message = this.$t('notify.user-blocked-resend-code')
          this.$message.error({ message, duration: 5000 })
        }
        if (data.status === 'USER_LOCKED' && includes(config.url, 'resendCode')) {
          message = this.$t('notify.user-locked-resend-code')
          this.$message.error({ message, duration: 5000 })
        }
      }
    }

    handleSubmit(): void {
      if (this.getDisableBtn) {
        return
      }
      //@ts-ignore
      this.$refs['form-verify'].validate(valid => {
        if (valid) {
          this.isLoading = true
          let message: any = ''
          // const type = this.$route.query.type
          const password = this.$route.query.pass
          const email = this.$route.query.email
          const reason = this.$route.query.reason
          const data: IBodyApiVerify = {
            email,
            password,
            verificationCode: this.form.code
          }
          if (reason === 'REQUEST_LOGIN') {
            // const encodePass = this.$options.filters?.encryptPassword(password)
            this.login({ ...data })
              .then(async () => {
                const result = await apiAuth.getInfo()
                const listRoles = result.roles
                console.log(listRoles)

                if ((listRoles.length == 1 && listRoles.includes('INVESTOR')) || listRoles.length == 0) {
                  message = this.$t('notify.no-permisson')
                  this.$message.error({ message, duration: 5000 })
                  await this.logout()
                  this.$router.push({ name: 'login' })
                } else {
                  message = this.$t('notify.verify-success')
                  this.$message.success({ message, duration: 5000 })
                  this.$router.push({ name: 'CustomerMain' })
                }

                this.isLoading = false
              })
              .catch(() => {
                this.isLoading = false
              })
          }
          if (reason === 'SIGN_UP') {
            delete data.password
            apiAuth
              .verifyCode('CODE', { ...data, type: 'EMAIL' })
              .then(res => {
                this.$router.push({ name: 'verify-phone-number', query: { email } })
              })
              .catch(error => {
                this.isLoading = false
              })
          }
          if (reason === 'VERIFY-SMS') {
            delete data.password
            apiAuth
              .verifyCode('CODE', { ...data, type: 'SMS' })
              .then(res => {
                this.setUserInfo(res)
                this.$router.push({ name: 'CustomerMain' })
              })
              .catch(error => {
                console.log(error)
                this.isLoading = false
              })
          }
          if (reason === 'FORGET_PASSWORD') {
            apiAuth
              .forgetPassword({ ...data })
              .then(code => {
                message = this.$t('notify.verify-success')
                this.$message.success({ message, duration: 5000 })
                this.$router.push({ name: 'reset-password', query: { email, reason: 'FORGET_PASSWORD', code } })
                this.isLoading = false
              })
              .catch(() => {
                this.isLoading = false
              })
          }
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .btn {
    padding: 12px 0 !important;
    font-size: 16px !important;
    line-height: 24px !important;
  }
  .title-form {
    color: #201f1e;
    margin-bottom: 3px;
  }
  .input-code {
    margin-top: 17px;
  }
</style>
