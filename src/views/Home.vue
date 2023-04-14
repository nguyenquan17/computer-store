<template>
  <div class="home-page">
    <base-icon icon="logo-zing" style="font-size: 64px" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  @Component({
    components: {}
  })
  export default class Home extends Vue {
    created(): void {
      // if (!localStorage.getItem('locale')) {
      //   localStorage.setItem('locale', process.env.VUE_APP_I18N_LOCALE || 'vi')
      // }
      this.$router.push({ name: 'CustomerMain' })
    }
  }
</script>
<style lang="scss" scoped>
  .home-page {
    position: relative;
  }
</style>
