<template>
  <div class="policies">
    <div class="block">
      <div class="block-row">
        <p class="block-row__title">{{ $t('metamart.template.title') }} <span style="color: #cf202f">*</span></p>
        <el-input v-model="title" :placeholder="$t('metamart.template.placeholder.enter-title')" class="block-row__input" :disabled="disabled" @input="changeTitle"></el-input>
      </div>
      <div class="block-table">
        <div class="block-table__row header" style="text-transform: uppercase">{{ $t('metamart.template.name') }}</div>
        <div class="block-table__row add">
          <div style="width: fit-content; display: flex; justify-content: left; align-items: center" @click="addNewPolicy" class="cursor">
            <base-icon icon="icon-add-circle" size="40" />
            <span class="title">{{ $t('metamart.template.add-policy') }}</span>
          </div>
        </div>
        <div
          class="block-table__row item cursor"
          v-for="(row, index) in list"
          :key="index"
          :draggable="!disabled"
          @dragstart="handleStartDrag($event, row)"
          @drop.prevent="handleDrop($event, row)"
          @dragover.prevent
          v-show="list.length > 0"
        >
          <div class="drag-hover" :style="{ visibility: disabled ? 'hidden' : null }">
            <span class="drag-hover__dots"></span>
            <span class="drag-hover__dots"></span>
            <span class="drag-hover__dots"></span>
            <span class="drag-hover__dots"></span>
            <span class="drag-hover__dots"></span>
            <span class="drag-hover__dots"></span>
          </div>
          <div class="info">
            <p class="info-primary">{{ row.metaName }}</p>
            <p class="info-desc" v-show="!!row.metaAnnotation">{{ row.metaAnnotation | quote }}</p>
          </div>
          <div class="actions" v-show="!disabled">
            <base-icon icon="icon-edit" size="20" @click.native="openEditRow(row)" />
            <base-icon icon="icon-delete-new" size="20" @click.native="openDelRow(row)" />
          </div>
        </div>
        <div class="block-table__row empty" v-show="list.length === 0">
          <empty-block :emptyText="'There are no data'" />
        </div>
      </div>
    </div>
    <div class="block">
      <div class="block-header">
        <span class="block-header__title">{{ title }}</span>
      </div>
      <div class="block-content">
        <div class="block-content__row" v-for="(row, i) in list" :key="i">
          <div class="block-content__row--left">
            <p class="primary">{{ row.metaName }}</p>
            <p class="desc" v-show="!!row.metaAnnotation">{{ row.metaAnnotation | quote }}</p>
          </div>
          <div class="block-content__row--right">{{ row.metaValue }}</div>
        </div>
      </div>
    </div>
    <popup-polices-action :title="action" :row="rowActive" @delete="handleDelRow" @change="handleChange" />
  </div>
</template>
<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import PopupPolicesAction from '../popup/PopupPoliciesAction.vue'
  import PopupMixin from '@/mixins/popup'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  @Component({
    components: {
      PopupPolicesAction,
      EmptyBlock
    },
    filters: {
      quote(input: string): string {
        return '(' + input + ')'
      }
    }
  })
  export default class TemplatePolicies extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @Prop({ required: true, type: Number }) collection!: number
    @bcNft.Getter('templateDatas') templateDatas!: Array<Record<string, any>>
    @bcNft.Getter('getTabs') tabs!: Array<Record<string, any>>
    @bcNft.Mutation('CHANGE_TYPE_NAME') changeTypeName!: (payload: { type: string; value: string }) => void
    @bcNft.Mutation('CHANGE_META_DATA') changeMetaData!: (Payload: Record<string, any>) => void
    @bcNft.Mutation('BUILD_BODY') buildBody!: () => void
    @bcNft.Mutation('CHANGE_DATAS') changeDatas!: (payload: Record<string, any>) => void
    title = 'Policies'
    action = 'Edit'
    rootElm: any = {}
    rowActive: Record<string, any> = {}
    idOfDatas = 0
    listRows: Array<Record<string, any>> = []
    @Watch('title', { immediate: true }) watchTitle(): void {
      if (this.$route.query.status === 'NEW') {
        this.changeMetaData(this.emitChange())
      }
      this.buildBody()
    }
    @Watch('listRows', { deep: true, immediate: true }) watchList(): void {
      if (this.$route.query.status === 'NEW') {
        this.changeMetaData(this.emitChange())
      }
      this.buildBody()
    }
    @Watch('tabs', { immediate: true, deep: true }) watchTabChange(): void {
      const active = this.tabs.find((tab: Record<string, any>): boolean => {
        return tab.metaType === 'POLICY'
      })
      this.title = active ? active.metaTypeName : ''
    }
    updated(): void {
      this.changeMetaData(this.emitChange())
    }
    get disabled(): boolean {
      return !(this.$route.query.status === 'NEW' || this.$route.query.status === 'DUPLICATE' || (this.$route.query.status === 'EDIT' && this.collection < 1))
    }
    get list(): Array<Record<string, any>> {
      let rs = this.listRows
      rs.sort((a: Record<string, any>, b: Record<string, any>) => {
        return a.order - b.order
      })
      return rs
    }
    created(): void {
      this.handleInit()
    }
    handleInit(): void {
      if (this.$route.query.status !== 'NEW') {
        this.listRows = []
        this.listRows = this.data.map((item: Record<string, any>, i: number): Record<string, any> => {
          return {
            ...item,
            order: i + 1
          }
        })
      } else {
        this.listRows = []
      }
    }
    addNewPolicy(): void {
      if (!this.disabled) {
        this.rowActive = {
          title: '',
          description: ''
        }
        this.action = 'Add'
        this.setOpenPopup({
          popupName: 'popup-policies-action',
          isOpen: true
        })
      }
    }
    handleStartDrag(e: any, item: Record<string, any>): void {
      this.rootElm = e.target
      this.rootElm.classList.toggle('bg-drag')
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer?.setData('itemOrder', item.order)
    }
    handleDrop(e: any, item: Record<string, any>): void {
      this.rootElm.classList.toggle('bg-drag')
      const rootOrder = +e.dataTransfer.getData('itemOrder')
      const distOrder = item.order
      const rootItem: any = this.listRows.find((item: Record<string, any>): boolean => {
        return item.order === rootOrder
      })
      if (rootOrder < distOrder) {
        const above = this.listRows.filter((item: Record<string, any>): boolean => {
          return item.order > rootOrder && item.order <= distOrder
        })
        above.forEach((elm: Record<string, any>): void => {
          elm.order--
        })
        rootItem.order = distOrder
      } else if (rootOrder > distOrder) {
        const below = this.listRows.filter((item: Record<string, any>): boolean => {
          return item.order >= distOrder && item.order < rootOrder
        })
        below.forEach((elm: Record<string, any>): void => {
          elm.order++
        })
        rootItem.order = distOrder
      }
    }
    openEditRow(row: Record<string, any>): void {
      this.rowActive = row
      if (this.$route.query.status !== 'NEW') {
        //@ts-ignore
        this.idOfDatas = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'POLICY' && item.metaName === this.rowActive.metaName && item.metaAnnotation === this.rowActive.metaAnnotation
        }, this).id
      }
      this.action = 'Edit'
      this.setOpenPopup({
        popupName: 'popup-policies-action',
        isOpen: true
      })
    }
    openDelRow(row: Record<string, any>): void {
      this.rowActive = row
      if (this.$route.query.status !== 'NEW') {
        //@ts-ignore
        this.idOfDatas = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'POLICY' && item.metaName === this.rowActive.metaName && item.metaAnnotation === this.rowActive.metaAnnotation
        }, this).id
      }
      this.action = 'Delete'
      this.setOpenPopup({
        popupName: 'popup-policies-action',
        isOpen: true
      })
    }
    handleDelRow(): void {
      const rowActive = this.rowActive
      this.listRows = this.listRows
        .filter((row: Record<string, any>): boolean => {
          return row.order !== rowActive.order
        })
        .map((row: Record<string, any>, i: number): Record<string, any> => {
          return {
            ...row,
            order: i + 1
          }
        })
      this.rowActive = {}
      if (this.$route.query.status !== 'NEW') {
        this.changeDatas({
          action: 'DELETE',
          data: {
            id: this.idOfDatas
          }
        })
      }
    }
    handleChange(payload: Record<string, any>): void {
      const format = {
        id: 0,
        itemId: null,
        metaAnnotation: '',
        metaDescription: null,
        metaIcon: null,
        metaMaximum: null,
        metaMinimum: null,
        metaName: '',
        metaStaticValue: null,
        metaStatisValue: null,
        metaType: 'POLICY',
        metaTypeAvatar: null,
        metaTypeId: null,
        metaTypePosition: null,
        metaValue: '',
        metaValueType: 'MAP'
      }
      if (payload.action === 1) {
        const len = this.listRows.length
        this.listRows.push({
          order: len + 1,
          metaName: payload.name,
          metaAnnotation: payload.annotate,
          metaValue: ''
        })
        if (this.$route.query.status === 'EDIT' || this.$route.query.status === 'DUPLICATE') {
          format.id = this.templateDatas.length + 1
          format.metaName = payload.name
          format.metaAnnotation = payload.annotate
          this.changeDatas({
            action: 'ADD',
            data: format
          })
        }
      } else if (payload.action === 2) {
        this.rowActive.metaName = payload.name
        this.rowActive.metaAnnotation = payload.annotate
        this.$forceUpdate()
        if (this.$route.query.status === 'EDIT' || this.$route.query.status === 'DUPLICATE') {
          format.id = this.idOfDatas
          format.metaName = payload.name
          format.metaAnnotation = payload.annotate
          this.changeDatas({
            action: 'EDIT',
            data: format
          })
        }
      }
    }

    emitChange(): Record<string, any> {
      const metaData: Record<string, any> = {
        metaType: 'POLICY',
        metaName: this.title,
        metaDatas: []
      }
      metaData.metaDatas = this.list.map((item: Record<string, any>): Record<string, any> => {
        return {
          metaName: item.metaName,
          metaValueType: 'MAP',
          metaIcon: null,
          metaValue: item.metaValue,
          metaStaticValue: item.metaValue,
          metaAnnotation: item.metaAnnotation,
          metaMinimum: null,
          metaMaximum: null,
          metaPosition: item.order
        }
      })
      return metaData
    }
    changeTitle(): void {
      this.changeTypeName({
        type: 'POLICY',
        value: this.title
      })
    }
  }
</script>
<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    font-weight: $weight;
    line-height: $height;
    color: $color;
  }
  ::v-deep.policies {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 24px;
    .block {
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      padding: 24px;
      &-row {
        width: 100%;
        height: auto;
        margin-bottom: 24px;
        &__title {
          @include text(16px, 24px, 600, #0a0b0d);
          margin-bottom: 8px;
        }
        &__input {
          .el-input__inner {
            font-size: 16px;
            line-height: 24px;
            height: 48px;
          }
          &.is-disabled {
            .el-input__inner {
              background-color: rgba($color: #dbdbdb, $alpha: 0.5);
              color: #5b616e;
            }
          }
        }
      }
      &-table {
        height: auto;
        max-height: 368px;
        overflow-y: scroll;
        &__row {
          width: 100%;
          height: auto;
          padding: 12px 0;
          border-bottom: 1px solid #dbdbdb;
          &.header {
            padding-left: 32px;
            @include text(16px, 24px, 600, #0a0b0d);
          }
          &.add {
            padding-left: 32px;
            display: flex;
            justify-content: left;
            align-items: center;
            .title {
              display: inline-block;
              @include text(14px, 16px, 400, #0151fc);
              margin-left: 12px;
            }
            .span-icon {
              line-height: 40px;
            }
          }
          &.item {
            height: 64px;
            display: flex;
            justify-content: left;
            align-items: center;
            position: relative;
            &.bg-drag {
              background-color: #f3f3f3;
            }
            &:hover {
              .drag-hover {
                visibility: visible;
              }
            }
            .drag-hover {
              width: 14px;
              height: 28px;
              display: grid;
              grid-template-columns: 5px 5px;
              column-gap: 4px;
              row-gap: 4px;
              margin-left: 3px;
              margin-right: 15px;
              visibility: hidden;
              &__dots {
                height: 5px;
                background-color: #dbdbdb;
                border-radius: 50%;
              }
            }
            .info {
              &-primary {
                @include text(16px, 24px, 400, #0a0b0d);
              }
              &-desc {
                @include text(14px, 20px, 400, #5b616e);
              }
            }
            .actions {
              position: absolute;
              right: 0;
              .span-icon {
                display: inline-block;
                margin-right: 16px;
              }
            }
          }
          &.empty {
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: none;
          }
        }
      }
      &-header {
        height: auto;
        border-bottom: 1px solid #dbdbdb;
        &__title {
          @include text(16px, 24px, 600, #0151fc);
          display: inline-block;
          padding: 16px 12px 14px;
          border-bottom: 2px solid currentColor;
        }
      }
      &-content {
        padding: 24px 0;
        &__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: auto;
          &:not(:last-child) {
            margin-bottom: 16px;
          }
          &--left {
            .primary {
              @include text(16px, 24px, 400, #0a0b0d);
            }
            .desc {
              @include text(14px, 20px, 400, #5b616e);
            }
          }
          &--right {
            @include text(16px, 24px, 400, #0a0b0d);
          }
        }
      }
    }
  }
</style>
