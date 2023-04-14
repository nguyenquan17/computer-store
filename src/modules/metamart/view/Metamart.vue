<template>
  <div class="w-100 bo-metamart">
    <div class="bg-white wallet-header">
      <div class="be-flex align-center jc-space-between wallet-header__above">
        <div class="wallet-header__above-tabs be-flex">
          <div class="tab-item cursor" v-for="tab in getTabs" :key="tab.id" :class="$route.name === tab.routeName ? 'tab-active' : null" @click="handleChangeTab(tab)">
            <span class="text-base">{{ $t(`menu.${tab.title}`) }}</span>
          </div>
        </div>
        <!-- <el-button type="primary" @click="handleOpen('popup-choosetype')" style="margin-right: 24px;">Create</el-button> -->
      </div>
    </div>
    <filter-metamart
      :tabs="tabs"
      isChangeTab="isChangeTab"
      @click="handleOpen"
      @selectCommand="handleSelectCommand"
      @searchData="handleSearch"
      @reload="debounceInit"
      :listCategory="listCategory"
      @openCategoryPopup="handleOpenCategory"
      @sort="handleSortChange"
      @openPopupTemplate="handleOpenPopupTemplate"
    />

    <tab-nft
      v-if="$route.name === 'Nft'"
      @sizeChange="handleSizeChange"
      @pageChange="handlePageChange"
      :data="nftData"
      :query="query"
      v-loading="isLoading"
      @selectCommand="handleSelectCommand"
      @rowClick="handleRowClick"
      @edit="OpenPopupEditNft"
      @delete="handleDeleteNft"
    />
    <tab-collection
      v-if="$route.name === 'Collection'"
      @sizeChange="handleSizeChange"
      @pageChange="handlePageChange"
      :query="query"
      :data="collectionData"
      v-loading="isLoading"
      @delete="handleDeleteCollection"
    />

    <tab-category
      v-if="$route.name === 'Category'"
      @sizeChange="handleSizeChange"
      @pageChange="handlePageChange"
      :query="query"
      :data="categoryData"
      v-loading="isLoading"
      :listCategory="listCategory"
      @edit="handleEditCategory"
      @create="handleOpenCategory"
      @load="debounceInit"
      @delete="handleDeleteCategory"
      @delete-category="handleGetCategoryId"
      :idDelete="idDelete"
    />

    <tab-template v-if="$route.name === 'Template'" :keyword="filterBanner.search" @dup="openDuplicate" />
    <tab-banner v-if="$route.name === 'Banner'" @edit="openEditBanner" :filter="filterBanner" />
    <popup-choosetype @continues="handleToPopupform($event)" />
    <popup-form @collection="handleOpenCreate($event)" />
    <popup-create />
    <popup-create-collection @reload="init" />
    <popup-create-nft :typePopup="typePopupCreateNft" @reload="init" />
    <popup-public-onchain />
    <popup-nft-detail
      :nftItem="detailNft.nftItem"
      :metaData="detailNft.metaDatas"
      :metaType="detailNft.metaTypes"
      :creator="detailNft.creator"
      :owners="detailNft.owners"
      :medias="detailNft.medias"
      :policies="detailNft.policies"
      :detailNft="detailNft"
      :rowData="rowData"
      @reload="init"
      @edit="OpenPopupEditNft"
      @delete="handleDeleteNft"
    />
    <popup-banner :type="bannerType" :banner="bannerEdit" @close="bannerType = 'add'" />
    <popup-delete :itemDelete="deleteData" :collectionDelete="deleteData" @reload="init" />
    <popup-template @create="handleCreateTemplate" :duplicate="duplicatedTemplate" :action="popupTemplateAction" @close="closePopupTemplate" @duplicate="handleDuplicateTemplate" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import FilterMetamart from '../components/filter/FilterMetamart.vue'
  import TabNft from '../components/TabNft.vue'
  import TabCategory from '../components/TabCategory.vue'
  import TabCollection from '../components/TabCollection.vue'
  import TabTemplate from '../components/TabTemplate.vue'
  import TabBanner from '../components/TabBanner.vue'
  import PopupForm from '../components/popup/PopupForm.vue'
  import PopupChoosetype from '../components/popup/ChooseType.vue'
  import PopupCreate from '../components/popup/PopupCreate.vue'
  import PopupCreateCollection from '../components/popup/PopupCreateCollection.vue'
  import PopupCreateNft from '../components/popup/PopupCreateNft.vue'
  import PopupPublicOnchain from '../components/popup/PopupPublicOnchain.vue'
  import PopupMixin from '@/mixins/popup'
  import PopupNftDetail from '../components/popup/PopupNftDetail.vue'
  import getRepository from '@/services'
  import { NftRepository } from '@/services/repositories/nft'
  import { debounce, filter, forEach, map, trim } from 'lodash'
  import axios from 'axios'
  import PopupCreateCategory from '../components/popup/PopupCreateCategory.vue'
  import PopupTemplate from '../components/popup/PopupTemplate.vue'
  import PopupBanner from '../components/popup/PopupBanner.vue'
  import EventBus from '@/utils/eventBus'
  import PopupDelete from '../components/popup/PopupDelete.vue'

  //Interface
  interface IQuery {
    page?: number
    limit?: number
    sortBy?: string | null
    orderBy?: string | null
    total: number
    type?: string | null | undefined
  }
  const apiNft: NftRepository = getRepository('nft')

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  @Component({
    components: {
      FilterMetamart,
      TabNft,
      TabCollection,
      TabCategory,
      PopupChoosetype,
      PopupCreateCollection,
      PopupForm,
      PopupCreate,
      PopupCreateNft,
      PopupPublicOnchain,
      PopupNftDetail,
      PopupCreateCategory,
      TabTemplate,
      TabBanner,
      PopupTemplate,
      PopupBanner,
      PopupDelete
    }
  })
  export default class Metamart extends Mixins(PopupMixin) {
    @bcNft.Mutation('SET_DETAIL_NFT') setDetailNft!: (PopupNftDetail: Record<string, any>) => void
    popupTemplateAction = 'ADD'
    duplicatedTemplate: Record<string, any> = {}
    filterBanner: Record<string, any> = {
      search: '',
      orderBy: 'POSITION',
      orderType: 'ASC'
    }
    bannerEdit: Record<string, any> = {}
    bannerType = 'add'
    listCategory: Array<Record<string, any>> = []
    tabs: Array<Record<string, any>> = [
      {
        id: 1,
        title: 'metamart-nft',
        routeName: 'Nft'
      },
      {
        id: 2,
        title: 'metamart-collection',
        routeName: 'Collection'
      },
      {
        id: 3,
        title: 'metamart-category',
        routeName: 'Category'
      },
      {
        id: 4,
        title: 'metamart-banner',
        routeName: 'Banner'
      },
      {
        id: 5,
        title: 'metamart-template',
        routeName: 'Template'
      }
    ]
    deleteData: Record<string, any> = {}
    detailNft: Record<string, any> = {}
    collectionData: Array<Record<string, any>> = []
    nftData: Array<Record<string, any>> = []
    categoryData: Array<Record<string, any>> = []
    params: Array<Record<string, any>> = []
    searchData = ''
    rowData: Record<string, any> = {}
    query: IQuery = {
      page: 1,
      limit: 20,
      total: 20
    }
    idDelete: string | number = 0

    typePopupCreateNft = 'add'

    get getTabs(): Array<Record<string, any>> {
      if (this.checkPemission('NFT', ['all-action-nft'])) {
        return this.tabs
      } else {
        return [
          {
            id: 1,
            title: 'metamart-nft',
            routeName: 'Nft'
          },
          {
            id: 2,
            title: 'metamart-collection',
            routeName: 'Collection'
          }
        ]
      }
    }

    debounceInit = debounce(() => {
      if (this.$route.name === 'Category') {
        this.getCategoryList()
      } else if (this.$route.name === 'Collection') {
        this.getCollection()
      } else if (this.$route.name === 'Nft') {
        this.getNftItem()
      }
    }, 300)
    debounceForBanner = debounce((payload: string, _this: any): void => {
      _this.filterBanner.search = payload
    }, 300)
    handleSearch(data: any): void {
      // if (!data) {
      //   this.debounceInit()
      // }
      // console.log(this.params)
      this.query.page = 1

      if (this.$route.name !== 'Banner' && this.$route.name !== 'Template') {
        this.searchData = trim(data)
        this.debounceInit()
      } else {
        const searchData = trim(data)
        this.debounceForBanner(searchData, this)
      }
    }
    handleGetCategoryId(id: number | string): void {
      this.idDelete = id
      console.log(this.idDelete, 'id delete')
    }

    deleteType = ''
    // objType: Record<string, any> = {
    //   Nft: 'Nft',
    //   Collection: 'Collection'
    // }
    created(): void {
      this.init()
      EventBus.$on('filter', this.handleFilter)
    }

    destroy(): void {
      EventBus.$off('filter')
    }

    handleFilter(value: Record<string, any>) {
      console.log('Filter:', value)
      this.query = { ...this.query, ...value, page: 1 }
      if (this.$route.name === 'Nft') {
        this.getNftItem()
      } else if (this.$route.name === 'Collection') {
        this.getCollection()
      }
    }

    async getCategoryList(): Promise<void> {
      let params
      if (this.searchData) {
        params = {
          search: this.searchData
        }
      }

      await apiNft
        .getCategories(params)
        .then((res: any) => {
          this.categoryData = res.content
          this.recursiveCategoryChild(res.content)
        })
        .catch(e => {
          console.log(e)
        })
    }
    recursiveCategoryChild(list: Array<Record<string, any>>): void {
      for (let i = 0; i < list.length; i++) {
        this.listCategory.push(list[i])
        if (list[i].subCategory !== null) {
          const listParent = filter(list[i].subCategory, value => value.parentId === list[i].id)
          this.recursiveCategoryChild(listParent)
        }
      }
    }
    async getNftItem(): Promise<void> {
      try {
        this.isLoading = true
        const result = await apiNft.getNftItem({ ...this.query, total: null, type: null, search: this.searchData })
        console.log('nft called', result)
        this.nftData = result.content || []
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }
    async getCollection(): Promise<void> {
      try {
        this.isLoading = true
        const result = await apiNft.getNftCollection({ ...this.query, total: null, type: null, search: this.searchData })
        console.log('collection called', result)
        this.collectionData = result.content || []
        this.query.total = result.totalElements
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }

    tabActive = 'Pending'
    isLoading = false
    isChangeTab = false
    isConflickClick = false
    type = ''
    isOpen = false
    direction = ''
    data: Array<Record<string, any>> = []

    async init(): Promise<void> {
      if (this.$route.name === 'Nft') await this.getNftItem()
      if (this.$route.name === 'Collection') await this.getCollection()
      if (this.$route.name === 'Category') await this.getCategoryList()
    }

    resetQuery(): void {
      this.query = { ...this.query, page: 1, limit: 10 }
    }

    handleChangeTab(tab: Record<string, any>): void {
      console.log('tab', tab)
      this.isChangeTab = tab.id !== 1
      this.$router
        .push({ name: tab.routeName })
        .then(() => {
          this.resetQuery()
        })
        .catch(() => {
          return
        })
      this.query = {
        page: 1,
        limit: 20,
        total: 20
      }
      this.searchData = ''
      if (this.isChangeTab && tab.id === 2) {
        this.getCollection()
      } else if (this.isChangeTab && tab.id === 3) {
        this.getCategoryList()
      } else {
        this.getNftItem()
      }
    }

    handleSortChange(command: string): void {
      console.log('Sort:', command)
      this.query.orderBy = command
      if (this.$route.name === 'Collection') {
        this.getCollection()
      } else if (this.$route.name === 'Nft') {
        this.getNftItem()
      } else if (this.$route.name === 'Banner') {
        console.log('365')

        this.filterBanner.orderBy = command
      }
    }

    //handleChangeSize
    handleSizeChange(size: number): void {
      this.query.limit = size
      this.init()
    }
    handlePageChange(page: number): void {
      this.query.page = page
      this.init()
    }

    handleOpen(popupName: string): void {
      console.log('280')

      this.setOpenPopup({
        popupName: popupName,
        isOpen: true
      })
    }
    handleOpenCategory(): void {
      this.type = 'add'
      this.setOpenPopup({
        popupName: 'popup-create-category',
        isOpen: true
      })
    }
    handleEditCategory(): void {
      this.type = 'edit'
      this.setOpenPopup({
        popupName: 'popup-create-category',
        isOpen: true
      })
    }
    handleDeleteCategory(): void {
      this.setOpenPopup({
        popupName: 'popup-metamart-delete',
        isOpen: true
      })
    }
    handleToPopupform(direction: string): void {
      console.log(direction)
      if (direction === '2') {
        this.setOpenPopup({
          popupName: 'popup-choosetype',
          isOpen: false
        })
        setTimeout(() => {
          this.setOpenPopup({
            popupName: 'popup-form',
            isOpen: true
          })
        }, 200)
      }
    }
    handleOpenCreate(collection: string): void {
      if (collection === '1') {
        this.setOpenPopup({
          popupName: 'popup-create',
          isOpen: true
        })
      }
    }
    handleCreateItem(isAllowed: boolean): void {
      if (isAllowed) {
        this.setOpenPopup({
          popupName: 'popup-form',
          isOpen: false
        })
      }
    }

    handleSelectCommand(command: string): void {
      if (command === 'add-nft') {
        this.typePopupCreateNft = 'add'
        this.setOpenPopup({
          popupName: 'popup-create-nft',
          isOpen: true
        })
      } else if (command === 'public-on-chain') {
        this.setOpenPopup({
          popupName: 'popup-public-onchain',
          isOpen: true
        })
      } else if (command === 'delete-nft') {
        // this.deleteType = 'delete-nft'
        // this.setOpenPopup({
        //   popupName: 'popup-metamart-delete',
        //   isOpen: true
        // })
      }
    }

    handleRowClick(row: Record<string, any>): void {
      // this.OpenPopupEditNft(row)
      this.OpenNFtDetail(row)
      this.rowData = row
    }
    async handleDeleteCollection(row: Record<string, any>): Promise<void> {
      await apiNft.checkValidDeleteCollection(row.id)
      this.deleteData = {
        id: row.id,
        collectionName: row.collectionName
      }
      // this.deleteType = 'delete-collection'
      this.setOpenPopup({
        popupName: 'popup-metamart-delete',
        isOpen: true
      })
    }
    async handleDeleteNft(row: Record<string, any>): Promise<void> {
      try {
        await apiNft.checkValidDeleteNft(row.itemId)
        this.deleteData = {
          id: row.itemId,
          itemName: row.itemName
        }
        this.setOpenPopup({
          popupName: 'popup-metamart-delete',
          isOpen: true
        })
      } catch (error) {
        console.log(error)
      }
    }

    handleOpenPopupTemplate(): void {
      console.log('472')

      this.setOpenPopup({
        popupName: 'popup-template',
        isOpen: true
      })
    }
    handleCreateTemplate(payload: Record<string, any>): void {
      this.setOpenPopup({
        popupName: 'popup-template',
        isOpen: false
      })
      this.$router.push({ name: 'CreateTemplate', query: { template: payload.template, status: 'NEW' } })
    }
    handleDuplicateTemplate(payload: Record<string, any>): void {
      this.setOpenPopup({
        popupName: 'popup-template',
        isOpen: false
      })
      this.$router.push({ name: 'CreateTemplate', query: { template: payload.template, status: 'DUPLICATE', id: payload.templateId } })
    }
    async OpenNFtDetail(row: Record<string, any>): Promise<void> {
      const result = await apiNft.getDetailNft(row.itemId)

      this.detailNft = result

      const metaTypes: Array<Record<string, any>> = []
      forEach(result.metaTypes, type => {
        const listData = filter(result.metaDatas, data => data.metaTypeId === type.metaTypeId)
        if (listData.length) {
          metaTypes.push({ ...type, typeTab: listData[0].metaValueType })
        }
        if (type.metaType === 'INFO') {
          metaTypes.push({ ...type, typeTab: 'INFO' })
        }
      })

      this.detailNft.metaTypes = metaTypes
      this.setOpenPopup({
        popupName: 'popup-nft-detail',
        isOpen: true
      })
    }

    async OpenPopupEditNft(row: Record<string, any>): Promise<void> {
      this.typePopupCreateNft = 'edit'
      const result = await apiNft.getDetailNft(row.itemId)
      let initInterest = {}
      if (this.checkPemission('NFT', ['setup-interest'])) {
        initInterest = await apiNft.getDetailInterest(row.itemId)
      }

      this.detailNft = result
      console.log(result)

      const language = localStorage.getItem('bc-lang') || ''
      const parseJsonShortDescription = JSON.parse(result.nftItem.shortDescription)
      const parseJsonDescription = JSON.parse(result.nftItem.description)
      const description = parseJsonDescription[language]
      const shortDescription = parseJsonShortDescription[language]

      const initInfo = { ...result.nftItem, medias: result.medias, description, shortDescription }
      const metaDatas = result.metaDatas
      const metaTypes = result.metaTypes
      const initBlockchain = {
        totalSupply: result.nftItem.totalSupply,
        totalMint: result.nftItem.totalSupply,
        contractAddress: result.nftItem.contractAddress,
        tokenId: result.nftItem.itemCode,
        network: result.nftItem.network,
        networkName: result.nftItem.networkName,
        creatorName: result.nftItem.creatorName,
        creatorUsername: result.nftItem.creatorUsername,
        creatorId: result.nftItem.creatorId
      }
      const initSetting = {
        serviceFee: result.nftItem.serviceFee,
        creatorFee: result.nftItem.creatorFee,
        hotPosition: result.nftItem.hotPosition,
        topPosition: result.nftItem.topPosition,
        isTop: result.nftItem.isTop,
        isHot: result.nftItem.isHot,
        isNftVoucher: result.nftItem.isNftVoucher
      }

      this.setDetailNft({ initInfo, initBlockchain, initSetting, metaTypes, metaDatas, initInterest })

      this.setOpenPopup({
        popupName: 'popup-create-nft',
        isOpen: true
      })
    }
    openEditBanner(payload: Record<string, any>): void {
      this.bannerType = 'edit'
      this.bannerEdit = payload.banner
      this.setOpenPopup({
        popupName: payload.popupName,
        isOpen: true
      })
    }
    openDuplicate(payload: Record<string, any>): void {
      this.duplicatedTemplate = payload
      this.popupTemplateAction = 'DUPLICATE'
      this.setOpenPopup({
        popupName: 'popup-template',
        isOpen: true
      })
    }
    closePopupTemplate(): void {
      this.duplicatedTemplate = {}
      this.popupTemplateAction = 'ADD'
    }
  }
</script>

<style scoped lang="scss">
  .bo-metamart {
    box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
    border-radius: 4px;
    .wallet-header {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);
        &-tabs {
          .tab-item {
            padding: 16px 12px;
            position: relative;
            &:hover {
              color: var(--bc-tab-active);
            }
            // .text-base {
            //   color: #5b616e;
            // }
          }
          .tab-active {
            color: var(--bc-tab-active);
            font-weight: 600;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 2px;
              bottom: 0;
              left: 0;
              background-color: var(--bc-tab-active);
            }
          }
        }
      }

      &__below {
        padding: 24px;
        &-amount {
          .amount-wallet,
          .amount-lock {
            flex: 1;
            .title {
              margin-left: 16px;
              .title-coin {
                color: #201f1e;
              }
            }
            .amount {
              margin-top: 10px;

              .amount-btc {
                color: var(--bc-amount-btc);
              }
              .amount-lyn {
                color: var(--bc-amount-lin);
              }
              .amount-lock {
                color: var(--bc-amount-lock);
              }
            }
          }
          .amount-wallet {
            border-right: 1px solid var(--bc-border-primary);
          }
        }
      }
    }
  }
</style>
