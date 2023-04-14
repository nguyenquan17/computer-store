<template>
  <base-popup name="popup-setup-staking-success" class="popup-success" width="400px" :close="handleClose" :isShowFooter="false">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.success.title') }}</span>
    </div>
    <div class="content text-center">
      <div class="mb-12">
        <base-icon icon="success-icon" size="80"></base-icon>
      </div>
      <div class="text-desc text-bold mt-12">
        <span>You have successfully added new package</span>
      </div>
      <el-button class="btn w-100 is-none-border btn-h-40 cursor mt-24" style="height: 48px" @click="handleClose" type="button">{{ $t('button.continue') }}</el-button>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  @Component({ components: {} })
  export default class PopupSetupStakingSuccess extends Mixins(PopupMixin) {
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-setup-staking-success',
        isOpen: false
      })
      this.$emit('close')
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

    .btn {
      color: var(--bc-color-white);
      background: var(--bc-btn-bg-default);
      border: none;

      &:hover {
        border: none;
        color: var(--bc-color-white);
        background: var(--bc-btn-bg-default-hover);
      }
    }
  }
</style>
