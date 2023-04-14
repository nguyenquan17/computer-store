<template>
  <div class="create-template">
    <div class="create-template__header">
      <div class="left">
        <span
          class="left-content"
          :contenteditable="$route.query.status === 'NEW' || $route.query.status === 'DUPLICATE' || ($route.query.status === 'EDIT' && numOfCollections < 1)"
          @blur="handleChangeTemplate"
          :spellcheck="false"
          ref="templateName"
        >
          {{ template }}
        </span>
        <base-icon
          icon="icon-edit"
          size="22"
          class="left-icon cursor"
          @click.native="handleFocus"
          v-if="$route.query.status === 'NEW' || $route.query.status === 'DUPLICATE' || ($route.query.status === 'EDIT' && numOfCollections < 1)"
        />
      </div>
      <div class="right">
        <span class="button button-advance cursor" @click="handleBack">{{ $t('metamart.template.create.back-btn') }}</span>
        <span
          class="button button-advance cursor"
          @click="openAdvancedSettings"
          v-if="$route.query.status === 'NEW' || $route.query.status === 'DUPLICATE' || ($route.query.status === 'EDIT' && numOfCollections < 1)"
          >{{ $t('metamart.template.create.advance-btn') }}</span
        >
        <span
          class="button button-save cursor"
          @click="saveTemplate"
          v-if="$route.query.status === 'NEW' || $route.query.status === 'DUPLICATE' || ($route.query.status === 'EDIT' && numOfCollections < 1)"
          >{{ $t('metamart.template.create.save-btn') }}</span
        >
      </div>
    </div>
    <div class="create-template__tabs">
      <span
        class="tab cursor"
        v-for="(tab, index) in templateTabs"
        :class="{ 'tab-active': tab.metaTypePosition === tabActive }"
        :key="index"
        @click="
          () => {
            tabActive = tab.metaTypePosition
          }
        "
        >{{ tab.metaTypeName }}</span
      >
      <base-icon
        icon="icon-add"
        size="24"
        class="cursor"
        @click.native="openPopupMetaData"
        v-if="$route.query.status === 'NEW' || ($route.query.status === 'EDIT' && numOfCollections < 1)"
      />
    </div>
    <div class="create-template__content">
      <keep-alive>
        <component :is="getComponent" :data="dataProp" :collection="numOfCollections" :name="typeNameActive" />
      </keep-alive>
    </div>
    <popup-meta-data @create="handleListen" />
    <popup-advanced-settings :tabs="tabs" @save="tabActive = 1" />
  </div>
</template>
<script lang="ts">
  import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupMetaData from '../components/popup/PopupMetaData.vue'
  import TemplateInfo from '../components/template/TemplateInfo.vue'
  import TemplateDesc from '../components/template/TemplateDesc.vue'
  import TemplatePolicies from '../components/template/TemplatePolicies.vue'
  import TemplateDetail from '../components/template/TemplateDetail.vue'
  import TemplateEbrochure from '../components/template/TemplateEbrochure.vue'
  import TemplateFeature from '../components/template/TemplateFeature.vue'
  import PopupAdvancedSettings from '../components/popup/PopupAdvancedSettings.vue'
  import { NftRepository } from '@/services/repositories/nft'
  import getRepository from '@/services'
  import { cloneDeep, filter } from 'lodash'
  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')
  const apiNft: NftRepository = getRepository('nft')
  @Component({
    components: {
      PopupMetaData,
      TemplateInfo,
      TemplateDesc,
      TemplatePolicies,
      TemplateDetail,
      PopupAdvancedSettings,
      TemplateEbrochure,
      TemplateFeature
    }
  })
  export default class CreateTemplate extends Mixins(PopupMixin) {
    @bcNft.Mutation('STORE_TEMPLATE') storeTemplate!: (payload: Record<string, any>) => void
    @bcNft.Mutation('CHANGE_TEMPLATE_NAME') changeTemplateName!: (templateName: string) => void
    @bcNft.Getter('templateDatas') templateDatas!: Record<string, any>
    @bcNft.Getter('templateTypes') templateTypes!: Record<string, any>
    @bcNft.Getter('getTabs') templateTabs!: Array<Record<string, any>>
    @bcNft.Getter('getApiBody') API_BODY!: Record<string, any>
    @bcNft.Mutation('RESET_TEMPLATE') resetTemplate!: () => void
    @bcNft.Mutation('LOG_STATUS') logStatus!: (status: string) => void
    @bcNft.Mutation('BUILD_BODY') initBody!: () => void
    @bcNft.Mutation('BUILD_ADVANCED_SETTINGS') buildAdvanced!: () => void
    @bcNft.Mutation('ADD_TABS') addTabs!: (newTabs: Record<string, any>) => void
    typeNameActive = ''
    numOfCollections = -1
    template = ''
    tabActive = 1
    dataProp: Array<Record<string, any>> = []
    listTabs: Array<Record<string, any>> = [
      {
        order: 0,
        metaType: 'INFO',
        title: 'NFT info'
      }
    ]
    tabs: Array<Record<string, any>> = []
    @Watch('template', { immediate: true }) watchTemplate(): void {
      this.changeTemplateName(this.template)
    }
    @Watch('templateTabs', { deep: true, immediate: true }) watchTemplateTabs(): void {
      this.initBody()
    }
    async created(): Promise<void> {
      this.logStatus(this.$route.query.status + '')
      if (this.$route.query.status === 'NEW') {
        this.template = '' + this.$route.query.template
      } else {
        const templateId = +this.$route.query.id
        this.template = '' + this.$route.query.template
        this.getDetailTemplate(templateId)
      }
    }
    beforeDestroy(): void {
      this.resetTemplate()
    }
    get getComponent(): string {
      const position = this.tabActive
      const tab: any = this.templateTabs.find((tab: Record<string, any>): boolean => {
        return tab.metaTypePosition === position
      })
      if (tab !== undefined) {
        switch (tab.metaType) {
          case 'INFO': {
            this.dataProp = this.templateDatas.filter((metaData: Record<string, any>): boolean => {
              return metaData.metaType === 'INFO'
            })
            return 'TemplateInfo'
          }
          case 'PERFORMANCE': {
            this.dataProp = this.templateDatas.filter((metaData: Record<string, any>): boolean => {
              return metaData.metaType === 'PERFORMANCE'
            })
            return 'TemplateInfo'
          }
          case 'DESCRIPTION': {
            this.dataProp = this.templateDatas.filter((metaData: Record<string, any>): boolean => {
              return metaData.metaType === 'DESCRIPTION'
            })
            return 'TemplateDesc'
          }
          case 'DETAIL': {
            this.dataProp = this.templateDatas.filter((metaData: Record<string, any>): boolean => {
              return metaData.metaType === 'DETAIL'
            })
            return 'TemplateDetail'
          }
          case 'POLICY': {
            this.dataProp = this.templateDatas.filter((metaData: Record<string, any>): boolean => {
              return metaData.metaType === 'POLICY'
            })
            return 'TemplatePolicies'
          }
          case 'PROPERTY': {
            this.dataProp = this.templateDatas.filter((metaData: Record<string, any>): boolean => {
              return metaData.metaType === 'PROPERTY'
            })
            return 'TemplateFeature'
          }
          case 'EBROCHURES': {
            this.dataProp = this.templateDatas.filter((metaData: Record<string, any>): boolean => {
              return metaData.metaType === 'EBROCHURES'
            })
            return 'TemplateEbrochure'
          }
          default:
            return 'TemplateInfo'
        }
      } else {
        return ''
      }
    }
    openPopupMetaData(): void {
      this.setOpenPopup({
        popupName: 'popup-meta-data',
        isOpen: true
      })
    }
    handleListen(type: Record<string, any>): void {
      let newTab: Record<string, any> = {
        metaTypeId: null,
        metaTypePosition: null,
        displayType: null,
        metaType: null,
        metaTypeName: null
      }
      const newPosition = this.templateTabs.length
      if (type.metaType === 'INFORMATION') {
        newTab = {
          ...newTab,
          metaType: 'INFO',
          displayType: 'FIXED',
          metaTypeName: 'NFT Info',
          metaTypePosition: newPosition + 1
        }
        this.addTabs(newTab)
      } else if (type.metaType === 'TEXT') {
        newTab = {
          ...newTab,
          metaType: 'DESCRIPTION',
          displayType: 'FIXED',
          metaTypeName: 'Description',
          metaTypePosition: newPosition + 1
        }
        this.addTabs(newTab)
      } else if (type.metaType === 'HTML') {
        newTab = {
          ...newTab,
          metaType: 'DETAIL',
          displayType: 'FIXED',
          metaTypeName: 'Detail',
          metaTypePosition: newPosition + 1
        }
        this.addTabs(newTab)
      } else if (type.metaType === 'POLICY') {
        newTab = {
          ...newTab,
          metaType: 'POLICY',
          displayType: 'FIXED',
          metaTypeName: 'Policies',
          metaTypePosition: newPosition + 1
        }
        this.addTabs(newTab)
      } else if (type.metaType === 'FEATURE') {
        newTab = {
          ...newTab,
          metaType: 'PROPERTY',
          displayType: 'FIXED',
          metaTypeName: 'Features',
          metaTypePosition: newPosition + 1
        }
        this.addTabs(newTab)
      } else if (type.metaType === 'ATTACHMENT') {
        newTab = {
          ...newTab,
          metaType: 'EBROCHURES',
          displayType: 'FIXED',
          metaTypeName: 'eBrochures',
          metaTypePosition: newPosition + 1
        }
        this.addTabs(newTab)
      }
      this.tabActive = newPosition + 1
    }
    openAdvancedSettings(): void {
      this.setOpenPopup({
        popupName: 'popup-advanced-settings',
        isOpen: true
      })
    }
    async getDetailTemplate(templateId: number): Promise<void> {
      try {
        const rs = await apiNft.getDetailNftTemplate(templateId)
        this.listTabs = rs.metaTypes
        this.numOfCollections = rs.numOfCollections
        this.storeTemplate({
          metaDatas: rs.metaDatas,
          metaTypes: rs.metaTypes
        })
        this.initBody()
      } catch (error) {
        console.log(error)
      }
    }
    handleBack(): void {
      this.$router.push({ name: 'Template' })
    }

    validateMetaData(): boolean {
      const listWithoutInfo = filter(this.API_BODY.metaTypes, elm => elm.metaType !== 'INFO')

      const isValid = listWithoutInfo.every(item => {
        return item.metaDatas.length > 0
      })
      return isValid
    }
    saveTemplate(): void {
      const validate = this.API_BODY.metaTypes.some((metaType: Record<string, any>): boolean => {
        return this.validateMeta(metaType)
      }, this)

      if (!this.validateMetaData()) {
        this.$message.error({ message: 'Must be have sample data', duration: 5000 })
        return
      }

      if (!validate) {
        if (this.$route.query.status === 'NEW' || this.$route.query.status === 'DUPLICATE') {
          this.handleCreateTemplate(this.API_BODY)
        } else if (this.$route.query.status === 'EDIT') {
          this.handleUpdateTemplate(this.API_BODY)
        }
      } else {
        console.log('not ok')
      }
    }
    validateMeta(meta: Record<string, any>): boolean {
      if (meta.metaName === '') {
        return true
      }
      return false
    }
    async handleCreateTemplate(params: Record<string, any>): Promise<void> {
      try {
        await apiNft.createNewNftTemplate(params)
        this.$message({
          message: this.$i18n.t('metamart.template.create-success') + '',
          duration: 3500,
          type: 'success'
        })
        this.handleBack()
      } catch (error) {
        this.$message({
          message: this.$i18n.t('metamart.template.create-error') + '',
          duration: 3500,
          type: 'error'
        })
        console.log(error)
      }
    }
    async handleUpdateTemplate(params: Record<string, any>): Promise<void> {
      try {
        const body: Record<string, any> = {
          templateId: this.$route.query.id,
          ...params
        }
        await apiNft.editNftTemplate(body)
        this.handleBack()
        this.$message({
          message: this.$i18n.t('metamart.template.update-success') + '',
          duration: 3500,
          type: 'success'
        })
      } catch (error) {
        this.$message({
          message: this.$i18n.t('metamart.template.update-error') + '',
          duration: 3500,
          type: 'error'
        })
        console.log(error)
      }
    }
    handleChangeTemplate(e: Record<string, any>): void {
      this.template = e.target.innerText.trim()
      e.target.innerText = this.template
      this.$forceUpdate()
    }
    handleFocus(): void {
      //@ts-ignore
      this.$refs['templateName'].focus()
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
  ::v-deep.create-template {
    width: 100%;
    height: auto;
    border-radius: 4px;
    background-color: #ffffff;
    padding: 24px;
    box-shadow: 0 1px 4px #dbdbdb;
    &__header {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        justify-content: left;
        align-items: center;
        &-content {
          &:focus-visible {
            border-radius: 4px;
            outline: 1px solid #409eff;
            padding: 8px 16px;
          }
          @include text(24px, 32px, 600, #0a0b0d);
        }
        &-icon {
          visibility: hidden;
          display: inline-block;
          margin-left: 16px;
          color: #5b616e;
        }
        &:hover {
          .left-icon {
            &:hover {
              color: #0151fc;
            }
            visibility: visible;
          }
        }
      }
      .right {
        .button {
          display: inline-block;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          padding: 12px;
          border-radius: 6px;
          margin-left: 16px;
          &-advance {
            border: 1px solid #dbdbdb;
          }
          &-save {
            color: #ffffff;
            background-color: #0151fc;
          }
        }
      }
    }
    &__tabs {
      border-bottom: 1px solid #dbdbdb;
      width: 100%;
      height: auto;
      max-height: 56px;
      box-sizing: border-box;
      padding: 0;
      .tab {
        @include text(16px, 24px, 400, #5b616e);
        display: inline-block;
        padding: 16px 12px;
        &.tab-active {
          font-weight: 600;
          color: #0151fc;
          padding-bottom: 14px;
          border-bottom: 2px solid #0151fc;
        }
      }
      .span-icon {
        line-height: 24px;
        display: inline-block;
        margin-left: 16px;
      }
    }
    &__content {
      padding-top: 24px;
    }
  }
</style>
