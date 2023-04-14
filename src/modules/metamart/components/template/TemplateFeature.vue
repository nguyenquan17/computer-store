<template>
  <div class="feature">
    <div class="feature-block">
      <div class="feature-block__row">
        <p class="feature-block__row--title">{{ $t('metamart.template.title') }} <span style="color: #cf202f">*</span></p>
        <el-input
          v-model="title"
          :placeholder="$t('metamart.template.placeholder.enter-title')"
          class="feature-block__row--input"
          :disabled="disabled"
          @input="changeTitle"
        ></el-input>
      </div>
      <div class="feature-block__row">
        <div class="feature-block__row--header">
          <span class="index">#</span>
          <span class="content" style="text-transform: uppercase">{{ $t('metamart.template.content') }}</span>
        </div>
        <div class="feature-block__row--add">
          <div class="cursor" style="width: fit-content; display: flex; justify-content: left; align-items: center" @click="openAddFeature">
            <base-icon icon="icon-add-circle" size="40" />
            <span>{{ $t('metamart.template.add-feature') }}</span>
          </div>
        </div>
        <div class="feature-block__row--item" v-for="(feature, index) in listFeatures" :key="index">
          <div class="left">
            <span class="left-index">{{ index + 1 }}</span>
            <span class="left-content">{{ feature.metaName }}</span>
          </div>
          <div class="right" :style="{ visibility: disabled ? 'hidden' : 'visible' }">
            <base-icon icon="icon-edit" size="20" class="cursor" @click.native="openEditFeature(feature, index)" />
            <base-icon icon="icon-delete-new" size="20" class="cursor" @click.native="openDeleteFeature(feature, index)" />
          </div>
        </div>
        <empty-block v-if="listFeatures.length === 0" class="feature-block__row--empty" />
      </div>
    </div>
    <div class="feature-block">
      <div class="feature-block__header">
        <span class="feature-block__header--title">{{ title }}</span>
      </div>
      <div class="feature-block__content">
        <div class="feature-block__content--item" v-for="(feature, index) in listFeatures" :key="index">
          <base-icon :icon="feature.metaValue === 'TRUE' ? 'tick-v' : 'icon-x-red'" size="20" class="item-icon" />
          <span class="item-name">{{ feature.metaName }}</span>
        </div>
      </div>
    </div>
    <popup-feature-actions :action="action" @change="handleChange" :feature="featureActive" />
  </div>
</template>
<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import PopupFeatureActions from '../template/popup/PopupFeatureActions.vue'
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import EmptyBlock from '@/components/base/empty/EmptyBlock.vue'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  @Component({ components: { PopupFeatureActions, EmptyBlock } })
  export default class TemplateFeature extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @Prop({ required: true, type: Number }) collection!: number
    @bcNft.Getter('templateDatas') templateDatas!: Array<Record<string, any>>
    @bcNft.Getter('getTabs') tabs!: Array<Record<string, any>>
    @bcNft.Mutation('CHANGE_TYPE_NAME') changeTypeName!: (payload: { type: string; value: string }) => void
    @bcNft.Mutation('CHANGE_META_DATA') changeMetaData!: (Payload: Record<string, any>) => void
    @bcNft.Mutation('BUILD_BODY') buildBody!: () => void
    @bcNft.Mutation('CHANGE_DATAS') changeDatas!: (payload: Record<string, any>) => void
    idOfDatas = 0
    action = 'ADD'
    title = 'Feature'
    featureActive: Record<string, any> = {}
    listFeatures: Array<Record<string, any>> = [
      {
        icon: 'tick-v',
        feature: 'Community room'
      },
      {
        icon: 'icon-x-red',
        feature: 'Community room'
      },
      {
        icon: 'tick-v',
        feature: 'Community room'
      },
      {
        icon: 'tick-v',
        feature: 'Community room'
      }
    ]
    get disabled(): boolean {
      return !(this.$route.query.status === 'NEW' || this.$route.query.status === 'DUPLICATE' || (this.$route.query.status === 'EDIT' && this.collection < 1))
    }
    get mockList(): Array<Record<string, any>> {
      return this.listFeatures
    }
    @Watch('title', { immediate: true }) watchTitle(): void {
      if (this.$route.query.status === 'NEW') {
        this.changeMetaData(this.emitChange())
      }
      this.buildBody()
    }
    @Watch('mockList', { deep: true, immediate: true }) watchList(): void {
      if (this.$route.query.status === 'NEW') {
        this.changeMetaData(this.emitChange())
      }
      this.buildBody()
    }
    @Watch('tabs', { immediate: true, deep: true }) watchTabChange(): void {
      const active = this.tabs.find((tab: Record<string, any>): boolean => {
        return tab.metaType === 'PROPERTY'
      })
      this.title = active ? active.metaTypeName : ''
    }
    updated(): void {
      if (this.$route.query.status === 'NEW') {
        this.changeMetaData(this.emitChange())
      }
      this.buildBody()
    }
    created(): void {
      this.handleInit()
    }
    handleInit(): void {
      if (this.$route.query.status !== 'NEW') {
        this.listFeatures = []
        for (let item of this.data) {
          const { metaName, metaValueType, metaIcon, metaValue, metaStaticValue, metaAnnotation, metaMinimum, metaMaximum, metaDescription, metaType } = item
          const newFeature = { metaName, metaValueType, metaIcon, metaValue, metaStaticValue, metaAnnotation, metaMinimum, metaMaximum, metaDescription, metaType }
          this.listFeatures.push(newFeature)
        }
      } else {
        this.listFeatures = []
      }
    }
    openAddFeature(): void {
      if (!this.disabled) {
        this.action = 'ADD'
        this.setOpenPopup({
          popupName: 'popup-feature-actions',
          isOpen: true
        })
      }
    }
    openEditFeature(payload: Record<string, any>, order: number): void {
      this.featureActive = { ...payload, order: order }
      this.action = 'EDIT'
      if (this.$route.query.status !== 'NEW') {
        //@ts-ignore
        this.idOfDatas = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'PROPERTY' && item.metaName === this.featureActive.metaName && item.metaValue === this.featureActive.metaValue
        }, this).id
      }
      this.setOpenPopup({
        popupName: 'popup-feature-actions',
        isOpen: true
      })
    }
    openDeleteFeature(payload: Record<string, any>, order: number): void {
      this.action = 'DELETE'
      this.featureActive = { ...payload, order: order }
      if (this.$route.query.status !== 'NEW') {
        //@ts-ignore
        this.idOfDatas = this.templateDatas.find((item: Record<string, any>): boolean => {
          return item.metaType === 'PROPERTY' && item.metaName === this.featureActive.metaName && item.metaValue === this.featureActive.metaValue
        }, this).id
      }
      this.setOpenPopup({
        popupName: 'popup-feature-actions',
        isOpen: true
      })
    }
    handleChange(payload: Record<string, any>): void {
      const format = {
        id: 0,
        itemId: null,
        metaAnnotation: null,
        metaDescription: null,
        metaIcon: null,
        metaMaximum: null,
        metaMinimum: null,
        metaName: '',
        metaStaticValue: null,
        metaStatisValue: null,
        metaType: 'PROPERTY',
        metaTypeAvatar: null,
        metaTypeId: null,
        metaTypePosition: null,
        metaValue: '',
        metaValueType: 'BOOLEAN'
      }
      if (payload.action === 1) {
        const newFeature = {
          metaName: payload.name,
          metaValueType: 'BOOLEAN',
          metaIcon: null,
          metaValue: payload.value ? 'TRUE' : 'FALSE',
          metaStaticValue: null,
          metaAnnotation: null,
          metaMinimum: null,
          metaMaximum: null,
          metaType: 'PROPERTY',
          metaDescription: null
        }
        this.listFeatures.push(newFeature)
        if (this.$route.query.status === 'EDIT' || this.$route.query.status === 'DUPLICATE') {
          format.id = this.templateDatas.length + 1
          format.metaName = payload.name
          format.metaValue = payload.value ? 'TRUE' : 'FALSE'
          this.changeDatas({
            action: 'ADD',
            data: format
          })
        }
      } else if (payload.action === 2) {
        const newFeature = {
          metaName: payload.name,
          metaValueType: 'BOOLEAN',
          metaIcon: null,
          metaValue: payload.value ? 'TRUE' : 'FALSE',
          metaStaticValue: null,
          metaAnnotation: null,
          metaMinimum: null,
          metaMaximum: null,
          metaDescription: null
        }
        const index = this.featureActive.order
        this.listFeatures[index] = newFeature
        this.$forceUpdate()
        if (this.$route.query.status === 'EDIT' || this.$route.query.status === 'DUPLICATE') {
          format.id = this.idOfDatas
          format.metaName = payload.name
          format.metaValue = payload.value ? 'TRUE' : 'FALSE'
          this.changeDatas({
            action: 'EDIT',
            data: format
          })
        }
      } else {
        const orderDelete = this.featureActive.order
        this.listFeatures = this.listFeatures.filter((feature: Record<string, any>, index: number) => {
          return index !== orderDelete
        })
        this.$forceUpdate()
        if (this.$route.query.status === 'EDIT' || this.$route.query.status === 'DUPLICATE') {
          this.changeDatas({
            action: 'DELETE',
            data: {
              id: this.idOfDatas
            }
          })
        }
      }
    }
    emitChange(): Record<string, any> {
      const metaData: Record<string, any> = {
        metaType: 'PROPERTY',
        metaName: this.title,
        metaDatas: []
      }
      metaData.metaDatas = this.listFeatures.map((item: Record<string, any>): Record<string, any> => {
        return {
          metaName: item.metaName,
          metaValueType: 'BOOLEAN',
          metaIcon: null,
          metaValue: item.metaValue,
          metaStaticValue: null,
          metaAnnotation: null,
          metaMinimum: null,
          metaMaximum: null,
          metaDescription: null
        }
      })
      return metaData
    }
    changeTitle(): void {
      this.changeTypeName({
        type: 'PROPERTY',
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
  ::v-deep.feature {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 24px;
    &-block {
      border: 1px solid #dbdbdb;
      border-radius: 16px;
      padding: 24px;
      &__row {
        &--title {
          @include text(16px, 24px, 600, #0a0b0d);
          margin-bottom: 8px;
        }
        &--input {
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
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        &--header {
          border-bottom: 1px solid #dbdbdb;
          .index {
            display: inline-block;
            padding: 12px 22.5px;
          }
          .index,
          .content {
            @include text(16px, 24px, 600, #0a0b0d);
          }
        }
        &--add {
          padding: 12px 8px 12px 55px;
          border-bottom: 1px solid #dbdbdb;
          display: flex;
          justify-content: left;
          align-items: center;
          @include text(14px, 16px, 400, #0151fc);
          .svg-icon {
            display: inline-block;
            margin-right: 12px;
          }
        }
        &--item {
          border-bottom: 1px solid #dbdbdb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left {
            &-index {
              @include text(16px, 24px, 400, #0a0b0d);
              display: inline-block;
              padding: 20px 0;
              width: 56px;
              padding-left: 24px;
            }
            &-content {
              @include text(16px, 24px, 400, #28344b);
            }
          }
          .right {
            .span-icon {
              display: inline-block;
              margin-right: 16px;
            }
          }
        }
        &--empty {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      &__header {
        border-bottom: 1px solid #dbdbdb;
        &--title {
          @include text(16px, 24px, 600, #0151fc);
          display: inline-block;
          padding: 16px 12px 14px;
          border-bottom: 2px solid currentColor;
        }
      }
      &__content {
        margin-top: 24px;
        &--item {
          display: flex;
          justify-content: left;
          align-items: center;
          @include text(16px, 24px, 400, #28344b);
          &:not(:last-child) {
            margin-bottom: 24px;
          }
          .svg-icon {
            display: inline-block;
            margin-right: 8px;
          }
        }
      }
    }
  }
</style>
