<template>
  <div class="h-screen bg-[#f6f8fc]">
    <header-auth />
    <div class="content pt-10">
      <form-login v-if="$route.name === 'LoginPage'" />
      <form-verify v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import HeaderAuth from '@/modules/Auth/components/HeaderAuth.vue'
  import FormLogin from '@/modules/Auth/components/FormLogin.vue'
  import FormVerify from '@/modules/Auth/components/FormVerify.vue'
</script>

<style scoped></style>
