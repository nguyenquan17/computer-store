<template>
  <div class="tab-meta">
    <div class="tab-meta__tabs">
      <div
        v-for="item in metaTypes"
        :key="item.id"
        class="text-base text-desc tab-item"
        :class="idTabActive === item.metaTypeId ? 'tab-active' : null"
        @click="handleChangeTab(item)"
      >
        {{ getName(item.metaTypeName) }}
      </div>
    </div>
    <div class="tab-meta__content" v-loading="isLoading">
      <!-- <keep-alive> -->
      <component :is="getComponent" class="flex-1" :idTabActive="idTabActive" @update="handleUpdate" :tabActive="tabActive" />
      <!-- </keep-alive> -->
      <preview-meta-data :dataPreview="dataPreview" :idTabActive="idTabActive" :tabActive="tabActive" :tabName="getNameTabPreview" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import TabText from './TabText.vue'
  import TabHtml from './TabHtml.vue'
  import TabMap from './TabMap.vue'
  import TabFile from './TabFile.vue'
  import TabBoolean from './TabBoolean.vue'
  import PreviewMetaData from './PreviewMetaData.vue'

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  import { IMetaTypes } from '../../interface'
  import { filter } from 'lodash'

  @Component({ components: { TabText, PreviewMetaData, TabHtml, TabMap, TabFile, TabBoolean } })
  export default class TabMetaData extends Vue {
    @bcNft.State('metaTypes') metaTypes!: IMetaTypes[]
    @bcNft.State('metaDatas') metaDatas!: Array<Record<string, any>>
    isLoading = false

    tabActive = 'TEXT'
    idTabActive = 0

    dataPreview: Array<Record<string, any>> = []

    get getComponent(): string {
      switch (this.tabActive) {
        case 'TEXT':
          return 'TabText'
        case 'HTML':
          return 'TabHtml'
        case 'MAP':
          return 'TabMap'
        case 'FILE':
          return 'TabFile'
        default:
          return 'TabBoolean'
      }
    }

    get getNameTabPreview(): string {
      if (!this.idTabActive) return ''
      const tabActive = filter(this.metaTypes, type => type.metaTypeId === this.idTabActive)[0]
      const language = localStorage.getItem('bc-lang') || ''
      const parseJson = JSON.parse(tabActive.metaTypeName)
      return parseJson[language]
    }

    created(): void {
      this.idTabActive = this.metaTypes[0].metaTypeId
      this.tabActive = this.metaTypes[0].typeTab
      this.dataPreview = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
    }

    getName(metaTypeName: string): string {
      const language = localStorage.getItem('bc-lang') || ''
      const parseJson = JSON.parse(metaTypeName)
      return parseJson[language]
    }

    handleChangeTab(item: IMetaTypes): void {
      this.tabActive = item.typeTab
      this.idTabActive = item.metaTypeId
      this.dataPreview = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
    }

    handleUpdate(): void {
      console.log(this.metaDatas)

      this.dataPreview = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.tab-meta {
    &__tabs {
      display: flex;
      border-bottom: 1px solid #dbdbdb;
      margin-bottom: 24px;
      .tab-item {
        padding: 0 12px 16px;
        cursor: pointer;
        &:hover {
          color: var(--bc-text-hyperlink);
        }
      }
      .tab-active {
        color: var(--bc-text-hyperlink);
        font-weight: 600;
        border-bottom: 2px solid var(--bc-text-hyperlink);
      }
    }

    &__content {
      display: flex;
      margin-bottom: 24px;
      .flex-1 {
        flex: 1;
      }
      // .preview {
      //   width: 360px;
      //   margin-left: 24px;
      // }
    }
  }
</style>
