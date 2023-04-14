<template>
  <div class="be-flex mb-24 tab-blockchain">
    <form-blockchain :typePopup="typePopup" />
    <preview-tab-blockchain :typePopup="typePopup" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import FormBlockchain from './FormBlockchain.vue'
  import PreviewTabBlockchain from './PreviewTabBlockchain.vue'

  @Component({ components: { FormBlockchain, PreviewTabBlockchain } })
  export default class TabBlockchain extends Vue {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: 'add' | 'edit'
  }
</script>

<style scoped></style>
