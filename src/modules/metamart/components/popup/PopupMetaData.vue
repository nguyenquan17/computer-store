<template>
  <base-popup name="popup-meta-data" class="popup-meta-data" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.template.popup.meta-data.title') }}</span>
    </div>
    <div class="content">
      <div
        class="meta-type cursor"
        :class="{ 'type-active': typeActive === type.id }"
        v-for="(type, index) in listTypes"
        :key="index"
        @click="handleChangeType(type.id)"
        v-show="type.metaType !== 'GROUP'"
      >
        <base-icon :icon="getIcon(type.metaType)" size="32" class="meta-type__icon" />
        <p class="meta-type__title">{{ type.metaName }}</p>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button :class="'passive'" class="btn-default btn-400 btn-h-40 btn-close" @click="handleClose"> {{ $t('metamart.template.popup.meta-data.passive-btn') }} </el-button>
          <el-button :class="'active'" class="btn-default-bg btn-400 btn-h-40 is-none-border" @click="handleCreate" style="font-size: 14px; font-weight: 600">
            {{ $t('metamart.template.popup.meta-data.active-btn') }}
          </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import { NftRepository } from '@/services/repositories/nft'
  import getRepository from '@/services'
  const apiNft: NftRepository = getRepository('nft')
  @Component
  export default class PopupMetaData extends Mixins(PopupMixin) {
    typeActive = 1
    listTypes: Array<Record<string, any>> = []

    handleOpen(): void {
      console.log('open')
    }
    created(): void {
      this.getMetaDataTypes()
    }
    getIcon(input: string): string {
      switch (input) {
        case 'INFORMATION':
          return 'meta-info'
        case 'TEXT':
          return 'meta-text'
        case 'HTML':
          return 'meta-html'
        case 'POLICY':
          return 'meta-shield'
        case 'FEATURE':
          return 'meta-feature'
        case 'ATTACHMENT':
          return 'meta-attach'
        case 'GROUP':
          return 'meta-group'
        default:
          return 'meta-info'
      }
    }
    async getMetaDataTypes(): Promise<void> {
      try {
        const rs = await apiNft.getMetadataTypes()
        const lang = '' + window.localStorage.getItem('bc-lang')
        this.listTypes = rs.data.map((type: Record<string, any>): Record<string, any> => {
          const typeName = JSON.parse(type.metaName)
          return {
            ...type,
            metaName: typeName[lang]
          }
        })
        this.typeActive = this.listTypes[0].id
      } catch (error) {
        console.log(error)
      }
    }
    handleChangeType(type: number): void {
      this.typeActive = type
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-meta-data',
        isOpen: false
      })
      this.typeActive = 1
    }
    handleCreate(): void {
      const typeActive = this.typeActive
      const metaType: Record<string, any> | undefined = this.listTypes.find((type: Record<string, any>): boolean => {
        return type.id === typeActive
      })
      if (metaType !== undefined) {
        this.$emit('create', metaType)
        this.handleClose()
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-meta-data {
    .popup-content {
      padding: 24px;
      .content {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        row-gap: 24px;
        column-gap: 24px;
        .meta-type {
          padding: 16px;
          border: 2px solid #dbdbdb;
          border-radius: 6px;
          height: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: left;
          color: #dbdbdb;
          &__title {
            font-weight: 16px;
            line-height: 24px;
            font-weight: 600;
            text-align: center;
          }
          &.type-active {
            border-color: #0151fc;
            color: #0151fc;
          }
          &:hover {
            border-color: #0151fc;
            color: #0151fc;
          }
        }
      }
    }
  }
</style>
