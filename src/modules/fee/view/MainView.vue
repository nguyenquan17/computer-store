<template>
  <div class="main-view w-100">
    <router-view />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class MainView extends Vue {}
</script>

<style scoped></style>
