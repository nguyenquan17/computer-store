<template>
  <base-popup name="popup-advanced-settings" class="popup-advanced-settings" width="600px">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.template.popup.meta-data.advanced-settings') }}</span>
    </div>
    <div class="content">
      <div
        class="content-row"
        v-for="(tab, index) in list"
        :key="index"
        draggable
        @dragstart="handleStartDrag($event, tab)"
        @drop.prevent="handleDrop($event, tab)"
        @dragover.prevent
      >
        <div class="content-row__drag">
          <span class="content-row__drag--dots"></span>
          <span class="content-row__drag--dots"></span>
          <span class="content-row__drag--dots"></span>
          <span class="content-row__drag--dots"></span>
          <span class="content-row__drag--dots"></span>
          <span class="content-row__drag--dots"></span>
        </div>
        <el-input placeholder="Enter title" v-model="tab.metaTypeName" class="content-row__input"></el-input>
        <div class="content-row__order">{{ tab.metaTypePosition }}</div>
        <base-icon icon="icon-delete-new" size="20" class="content-row__del cursor" @click.native="openDelete(tab)" />
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button :class="'passive'" class="btn-default btn-400 btn-h-40 btn-close" @click="handleCancel"> {{ $t('metamart.template.popup.meta-data.passive-btn') }} </el-button>
          <el-button :class="'active'" class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" @click="handleSave">
            {{ $t('metamart.template.popup.meta-data.save') }}
          </el-button>
        </div>
      </div>
    </div>
    <popup-delete-meta :row="rowActive" @delete="handleDeleteMeta" />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupDeleteMeta from '@/modules/metamart/components/popup/PopupDeleteMeta.vue'
  import { namespace } from 'vuex-class'
  import { cloneDeep } from 'lodash'
  const bcNft = namespace('bcNft')
  @Component({
    components: {
      PopupDeleteMeta
    }
  })
  export default class PopupAdvancedSettings extends Mixins(PopupMixin) {
    @bcNft.Getter('getTabs') tabs!: Array<Record<string, any>>
    @bcNft.Mutation('MUTATE_META_TYPES') handleMutate!: (payload: Array<Record<string, any>>) => void
    @bcNft.Mutation('BUILD_ADVANCED_SETTINGS') buildAdvanced!: () => void
    listTabs: Array<Record<string, any>> = []
    rowActive: Record<string, any> = {}
    rootElm: any = {}
    get list(): Array<Record<string, any>> {
      let rs = this.listTabs
      rs.sort((a: Record<string, any>, b: Record<string, any>) => {
        return a.metaTypePosition - b.metaTypePosition
      })
      return rs
    }
    @Watch('tabs', { immediate: true, deep: true }) watchTabsChange(): void {
      this.listTabs = cloneDeep(this.tabs)
    }
    handleStartDrag(e: any, item: Record<string, any>): void {
      this.rootElm = e.target
      this.rootElm.classList.toggle('bg-drag')
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('order', item.metaTypePosition)
    }
    handleDrop(e: any, item: Record<string, any>): void {
      this.rootElm.classList.toggle('bg-drag')

      const rootOrder = +e.dataTransfer.getData('order')
      const distOrder = item.metaTypePosition
      const rootItem: any = this.listTabs.find((item: Record<string, any>): boolean => {
        return item.metaTypePosition === rootOrder
      })
      if (rootOrder < distOrder) {
        const above = this.listTabs.filter((item: Record<string, any>): boolean => {
          return item.metaTypePosition > rootOrder && item.metaTypePosition <= distOrder
        })
        above.forEach((elm: Record<string, any>): void => {
          elm.metaTypePosition--
        })
        rootItem.metaTypePosition = distOrder
      } else if (rootOrder > distOrder) {
        const below = this.listTabs.filter((item: Record<string, any>): boolean => {
          return item.metaTypePosition >= distOrder && item.metaTypePosition < rootOrder
        })
        below.forEach((elm: Record<string, any>): void => {
          elm.metaTypePosition++
        })
        rootItem.metaTypePosition = distOrder
      }
    }
    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-advanced-settings',
        isOpen: false
      })
    }
    handleSave(): void {
      this.$emit('save')
      this.handleMutate(this.list)
      this.handleCancel()
    }
    openDelete(row: Record<string, any>): void {
      this.rowActive = row
      this.setOpenPopup({
        popupName: 'popup-delete-meta',
        isOpen: true
      })
    }
    handleDeleteMeta(): void {
      const rowPosition = this.rowActive.metaTypePosition
      this.listTabs =
        this.listTabs !== undefined
          ? this.listTabs.filter((tab: Record<string, any>): boolean => {
              return tab.metaTypePosition !== rowPosition
            })
          : this.listTabs
      this.listTabs = this.listTabs.map((tab: Record<string, any>, index: number) => {
        return {
          ...tab,
          metaTypePosition: index + 1
        }
      })
      this.rowActive = {}
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    font-weight: $weight;
    line-height: $height;
    color: $color;
  }
  ::v-deep.popup-advanced-settings {
    .popup-content {
      padding-bottom: 24px;
      .content {
        &-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 24px;
          }
          &__drag {
            width: 14px;
            height: 28px;
            display: grid;
            grid-template-columns: 5px 5px;
            column-gap: 4px;
            row-gap: 4px;
            &--dots {
              display: inline-block;
              height: 5px;
              background-color: #dbdbdb;
              border-radius: 50%;
            }
          }
          &__input {
            width: fit-content;
            .el-input__inner {
              width: 406px;
              height: 48px;
              background-color: transparent;
            }
          }
          &__order {
            width: 48px;
            height: 48px;
            border: 1px solid #dbdbdb;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            @include text(16px, 24px, 400, #28344b);
          }
          &__del {
            line-height: 20px;
          }
          &.bg-drag {
            background-color: #f3f3f3;
          }
        }
      }
    }
  }
</style>
