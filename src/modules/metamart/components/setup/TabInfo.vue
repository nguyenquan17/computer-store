<template>
  <div class="tab-info">
    <form-info @selectCollection="handleSelectCollection" @findCollection="handleFindCollection" :typePopup="typePopup" />
    <preview-nft />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import FormInfo from './FormInfo.vue'
  import PreviewNft from './PreviewNft.vue'

  @Component({ components: { FormInfo, PreviewNft } })
  export default class TabInfo extends Vue {
    @Prop({ required: false, type: String, default: 'add' }) typePopup!: 'add' | 'edit'

    handleSelectCollection(collection: Record<string, any>): void {
      this.$emit('selectCollection', collection)
    }

    handleFindCollection(text: string): void {
      this.$emit('findCollection', text)
    }
  }
</script>

<style scoped lang="scss">
  .tab-info {
    display: flex;
  }
</style>
