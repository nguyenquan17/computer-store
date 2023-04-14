<template>
  <base-popup name="popup-setup-delete" class="popup-setup-delete" width="600px">
    <div class="title-popup" slot="title">
      <span>{{ $t('popup_delete') }}</span>
    </div>
    <div class="mb-24 content">
      <p class="text-base">
        <span v-if="tabActive === 'MAP'" class="text-desc">{{ $t('popup_label-delete') }}</span>
        <span v-if="tabActive === 'FILE'" class="text-desc">{{ $t('popup_label-delete-file') }}</span>
        <span v-if="tabActive === 'BOOLEAN'" class="text-desc">{{ $t('popup_label-delete-boolean') }}</span>

        <span>"{{ rowCurrent.metaName }}"?</span>
      </p>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.confirm') }}</span>
          </button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Prop, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  @Component
  export default class PopupDelete extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) rowCurrent!: Record<string, any>
    @Prop({ required: false, type: String, default: '' }) tabActive!: string

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-setup-delete',
        isOpen: false
      })
    }

    handleSubmit(): void {
      this.$emit('delete')
      this.handleCancel()
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-setup-delete {
    .footer {
      .wrap-button {
        justify-content: flex-end;
        .add-member {
          height: 40px;
          font-weight: 400;
          padding: 0 8px;
          &:hover {
            border: 1px solid transparent;
          }
        }
      }
      .jc-space-between {
        justify-content: space-between;
      }
      .btn-left {
        .btn-close {
          padding: 0;
          height: 40px;
        }
        .btn-delete:hover {
          border: 1px solid var(--bc-btn-bg-reject);
          color: var(--bc-status-error);
        }
      }
      .btn-close:focus {
        color: var(--bc-btn-text);
        background-color: var(--bc-bg-white);
      }
    }
  }
</style>
