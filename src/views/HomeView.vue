<template>
  <el-icon class="is-loading">
    <i-ep-loading />
  </el-icon>
</template>

<script setup lang="ts">
  const form = ref<Record<string, any>>({
    fullName: '',
    email: '',
    password: '',
    rePassword: ''
  })
  const type = ref<'LOGIN' | 'SIGNUP'>('LOGIN')

  const handleSubmitAuth = () => {
    console.log('aaa')
  }
</script>

<style scoped lang="scss">
  .auth-page {
    .left {
      // background-image: url('/public/images/auth/banner-authpage.webp');
    }
    .right {
      background-color: #f6f7fc;
    }
  }
</style>
