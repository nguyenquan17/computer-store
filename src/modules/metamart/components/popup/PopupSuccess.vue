<template>
  <base-popup name="popup-metamart-success" class="popup-success" width="400px" :close="handleClose" :isShowFooter="false">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.success.title') }}</span>
    </div>
    <div class="content text-center">
      <div class="mb-12">
        <base-icon icon="success-icon" size="80"></base-icon>
      </div>
      <div class="text-desc text-bold mt-12">
        <span v-if="this.$route.name === 'Collection'">{{ $t('metamart.success.delete-collection') }}</span>
        <span v-if="this.$route.name === 'Category'">{{ $t('metamart.success.delete-category') }}</span>
        <span v-if="this.$route.name === 'Nft'">{{ $t('metamart.success.delete-nft') }}</span>
      </div>
      <el-button class="btn w-100 is-none-border btn-h-40 cursor mt-24" style="height: 48px" @click="handleClose" type="button">{{ $t('button.continue') }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import EventBus from '@/utils/eventBus'

  @Component({ components: {} })
  export default class PopupSuccess extends Mixins(PopupMixin) {
    @Prop({ required: true, type: String, default: '' }) type!: string
    handleClose(): void {
      console.log('clicked')
      if (this.type === 'delete-collection') {
        EventBus.$emit('closePopup')
      } else if (this.type === 'delete-nft') {
        EventBus.$emit('closePopup')
      }
      this.setOpenPopup({
        popupName: 'popup-metamart-success',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-metamart-delete',
        isOpen: false
      })

      if (this.$route.query) {
        this.$router.replace({ query: undefined })
      }
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  ::v-deep.base-table .cell {
    font-weight: 600;
  }

  ::v-deep.popup-success {
    .popup-content {
      padding-bottom: 24px;
      .content {
        @include text(16px, 24px, 400, #5b616e);
        .text-semibold {
          @include text(16px, 24px, 600, #0a0b0d);
        }
        .content-filter {
          margin-top: 24px;
          &__title {
            @include text(14px, 20px, 400, #0a0b0d);
            text-transform: capitalize;
          }
          .el-select {
            width: 100%;
          }
        }
      }
    }
    .ml-24 {
      margin-left: 24px;
    }
    .mb-24 {
      margin-bottom: 24px;
    }
    .circle {
      border-radius: 50% !important;
    }
    .code {
      color: #5b616e;
    }
  }
</style>
