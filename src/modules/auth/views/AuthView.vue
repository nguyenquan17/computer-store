<template>
  <div class="h-screen bg-[#f6f8fc]">
    <header-auth />
    <div class="content pt-10">
      <form-login v-if="$route.name === 'LoginPage'" />
      <form-verify v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import HeaderAuth from '@/modules/auth/components/HeaderAuth.vue'
  import FormLogin from '@/modules/auth/components/FormLogin.vue'
  import FormVerify from '@/modules/auth/components/FormVerify.vue'
</script>

<style scoped></style>