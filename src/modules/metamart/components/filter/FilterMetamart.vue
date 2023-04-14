<!-- eslint-disable prettier/prettier -->
<template>
  <div class="pb-24 pt-24 be-flex align-center kyc-filter">
    <el-input
      v-model="filter.value.search"
      class="input-search"
      :placeholder="$t('placeholder.search')"
      @input="handleChange"
      :style="{ marginRight: $route.name === 'Banner' ? '0px' : '30px' }"
    >
      <span slot="prefix" class="prefix-search">
        <base-icon icon="icon-search" size="24" />
      </span>
    </el-input>
    <div class="filter-item">
      <!-- <el-popover :value="isVisible" placement="bottom-start" width="568" trigger="click" popper-class="popper-filter-nft">
        <div class="content">
          <el-form>
            <div class="be-flex-column jc-space-between">
              <el-form-item class="be-flex-item" :label="$t('nft.filter.category')">
                <el-select v-model="filter.value.category" id-type :placeholder="$t('nft.filter.placeholderCategory')" class="w-100" clearable>
                  <el-option v-for="(category, index) in listCategory" :key="index" :label="category.name" :value="category.name" />
                </el-select>
              </el-form-item>
              <div v-if="this.$route.name === 'Nft'">
                <el-form-item class="be-flex-item" :label="$t('nft.filter.saleType')">
                  <el-select v-model="filter.value.saleType" id-type :placeholder="$t('nft.filter.placeholderSaleType')" class="w-100" clearable>
                    <el-option v-for="(saleType, index) in listSaleType" :key="index" :label="saleType.name" :value="saleType.name" />
                  </el-select>
                </el-form-item>
              </div>
              <div class="be-flex jc-space-between align-center row box">
                <el-form-item :label="$t('label.create-date')">
                  <el-date-picker
                    class="box-input-created-date"
                    format="MM/dd/yyyy"
                    value-format="timestamp"
                    :placeholder="$t('label.from-date')"
                    v-model="filter.value.fromCreatedAt"
                    type="date"
                    clearable
                  >
                  </el-date-picker>
                </el-form-item>
                <div class="line"></div>
                <el-form-item class="hide-label" label="1">
                  <el-date-picker
                    class="box-input-created-date"
                    format="MM/dd/yyyy"
                    value-format="timestamp"
                    :placeholder="$t('label.to-date')"
                    v-model="filter.value.toCreatedAt"
                    type="date"
                    clearable
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="be-flex jc-space-between align-center row box" v-if="this.$route.name === 'Nft'">
                <el-form-item :label="$t('nft.filter.priceRange')">
                  <div>
                    <el-input v-model="filter.value.fromPrice" size="24" type="number" clearable class="box-input-price">
                      <div class="prefix" slot="prefix" style="margin: 3px 0 0 5px">$</div>
                    </el-input>
                  </div>
                </el-form-item>
                <div class="line"></div>
                <el-form-item class="hide-label" label="1">
                  <div>
                    <el-input v-model="filter.value.toPrice" size="24" type="number" clearable class="box-input-price">
                      <div class="prefix" slot="prefix" style="margin: 3px 0 0 5px">$</div>
                    </el-input>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="be-flex jc-flex-end footer">
          <el-button class="btn-default btn-400 btn-h-40 btn-close text-regular">
            {{ $t('button.reset') }}
          </el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border h-40 text-regular">
            {{ $t('button.apply') }}
          </el-button>
        </div>
      </el-popover> -->

      <div
        v-if="this.$route.name !== 'Category' && $route.name !== 'Banner' && $route.name !== 'Template'"
        slot="reference"
        class="cursor text-filter"
        style="font-size: 16px"
        @click="handleOpen"
      >
        <span>
          <base-icon style="color: #5b616e; margin-right: 10px" icon="icon-filter" size="18" />
        </span>
        {{ $t('kyc.filter.filter') }}
      </div>
    </div>
    <div v-if="this.$route.name !== 'Category' && $route.name !== 'Template'">
      <el-dropdown class="sort" trigger="click" @command="handleSort">
        <span class="sort-title" style="font-size: 16px">
          <base-icon icon="icon-sort" style="color: #5b616e; margin-right: 10px" size="18" class="icon" /> {{ $t('kyc.filter.sort') }}
        </span>
        <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown">
          <el-dropdown-item
            v-for="(value, index) in sortMetamart"
            :key="index"
            :class="sortActive === value.command ? 'active' : null"
            :command="value.command"
            :divided="value.divided"
          >
            <span class="be-flex">
              <span class="be-flex-item">
                {{ value.label }}
              </span>
              <base-icon v-if="sortActive === value.command" icon="icon-tick-dropdown" size="16" />
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-button
      v-if="this.$route.name === 'Collection' && checkPemission('NFT', ['all-action-nft'])"
      class="add-btn add-collection ml-auto"
      @click="$emit('click', 'popup-create-collection')"
      >{{ $t('button.add-new') }}</el-button
    >
    <el-button v-if="this.$route.name === 'Banner' && checkPemission('NFT', ['all-action-nft'])" class="add-btn add-collection ml-auto" @click="$emit('click', 'popup-banner')">{{
      $t('button.add-new')
    }}</el-button>
    <el-button v-if="this.$route.name === 'Category' && checkPemission('NFT', ['all-action-nft'])" class="add-btn add-collection ml-auto" @click="$emit('openCategoryPopup')">{{
      $t('button.add-new')
    }}</el-button>
    <el-button v-if="$route.name === 'Template' && checkPemission('NFT', ['all-action-nft'])" class="add-btn add-collection ml-auto" @click="$emit('openPopupTemplate')">{{
      $t('button.add-new')
    }}</el-button>
    <div v-if="this.$route.name === 'Nft'" class="ml-auto">
      <!-- <el-dropdown trigger="click" @command="handleCommand">
        <el-button style="width: auto !important; margin-right: 12px">
          <span>{{ $t('button.action') }} | <i class="el-icon-arrow-down"></i></span>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="header-downloadapp dropdown-sort">
          <el-dropdown-item command="public-on-chain">Public On-chain</el-dropdown-item>
          <el-dropdown-item command="delete-nft">Delete</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

      <el-button v-if="checkPemission('NFT', ['all-action-nft'])" class="add-btn add-collection ml-auto" @click="handleCommand('add-nft')">{{ $t('button.add-new') }}</el-button>

      <!-- <el-dropdown trigger="click" @command="handleCommand">
        <div class="be-flex align-center">
          <el-button class="add-btn" style="width: auto !important">
            <span>{{ $t('button.add-new') }} | <i class="el-icon-arrow-down"></i></span>
          </el-button>
        </div>
        <el-dropdown-menu class="header-downloadapp dropdown-sort" slot="dropdown">
          <el-dropdown-item command="add-nft">{{ $t('button.add-new') }}</el-dropdown-item>
          <el-dropdown-item>{{ $t('button.import-file') }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!-- <el-button class="excel-btn" style="width: auto !important; padding: 5px 12px 10px">
        <div class="be-flex align-center">
          <span
            ><p style="font-size: 16px"><base-icon icon="icon-excel" size="22" /></p
          ></span>
        </div>
      </el-button> -->
    </div>
    <popup-filter-collection
      :creators="creators"
      :categories="categories"
      :networks="networks"
      @reset-query="resetQuery"
      @load-more-creator="loadMoreCreator"
      @remote-creator="remoteCreatorList"
      @remote-category="remoteCategoryList"
    />
    <popup-filter-nft
      :collections="collections"
      :creators="creators"
      :categories="categories"
      :networks="networks"
      @reset-query="resetQuery"
      @load-more-collection="loadMoreCollection"
      @remote-collection="remoteCollectionList"
      @load-more-creator="loadMoreCreator"
      @remote-creator="remoteCreatorList"
      @remote-category="remoteCategoryList"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import BaseIcon from '@/components/base/icon/BaseIcon.vue'
  import PopupMixin from '@/mixins/popup'
  import PopupFilterCollection from '../popup/PopupFilterCollection.vue'
  import PopupFilterNft from '../popup/PopupFilterNft.vue'
  import PopupCreateCategory from '../popup/PopupCreateCategory.vue'
  import { NftRepository } from '@/services/repositories/nft'
  import getRepository from '@/services'
  import { debounce, filter, trim } from 'lodash'

  const apiNft: NftRepository = getRepository('nft')

  @Component({
    components: { BaseIcon, PopupFilterCollection, PopupFilterNft, PopupCreateCategory }
  })
  export default class FilterMetamart extends Mixins(PopupMixin) {
    // @Prop({ required: true }) isChangeTab!: boolean
    @Prop() listCategory: any

    collections: Array<Record<string, any>> = []
    creators: Array<Record<string, any>> = []
    categories: Array<Record<string, any>> = []
    categoriesClone: Array<Record<string, any>> = []
    networks: Array<Record<string, any>> = []
    sortActive = ''

    @Watch('$route', { immediate: true, deep: true })
    onUrlChange() {
      this.filter.value.search = ''
      this.sortActive = ''
    }

    created(): void {
      this.init()
    }

    get sortMetamart(): Array<any> {
      let sorts: Array<Record<string, any>> = []
      if (this.$route.name === 'Collection') {
        sorts = [
          {
            command: 'CREATED_AT_DESC',
            label: this.$i18n.t('nft.sort.latest'),
            divided: false,
            i18n: 'nft.sort.latest'
          },
          {
            command: 'CREATED_AT_ASC',
            label: this.$i18n.t('nft.sort.oldest'),
            divided: false,
            i18n: 'nft.sort.oldest'
          }
        ]
      } else if (this.$route.name === 'Nft') {
        sorts = [
          {
            command: 'ITEM',
            label: this.$i18n.t('nft.sort.item'),
            divided: false,
            i18n: 'nft.sort.item'
          },
          {
            command: 'CREATOR',
            label: this.$i18n.t('nft.sort.creator'),
            divided: false,
            i18n: 'nft.sort.creator'
          },
          {
            command: 'COLLECTION',
            label: this.$i18n.t('nft.sort.collection'),
            divided: false,
            i18n: 'nft.sort.collection'
          },
          {
            command: 'CATEGORY',
            label: this.$i18n.t('nft.sort.category'),
            divided: false,
            i18n: 'nft.sort.category'
          },
          {
            command: 'NETWORK',
            label: this.$i18n.t('nft.sort.network'),
            divided: false,
            i18n: 'nft.sort.network'
          },
          {
            command: 'BLOCKCHAIN_STATUS',
            label: this.$i18n.t('nft.sort.status'),
            divided: false,
            i18n: 'nft.sort.status'
          }
        ]
      } else if (this.$route.name === 'Banner') {
        sorts = [
          {
            command: 'NAME',
            label: this.$i18n.t('nft.sort.name'),
            divided: false,
            i18n: 'nft.sort.name'
          },
          {
            command: 'POSITION',
            label: this.$i18n.t('nft.sort.position'),
            divided: false,
            i18n: 'nft.sort.position'
          }
        ]
      }

      return sorts
    }

    filter = {
      value: {
        search: '',
        category: '',
        saleType: '',
        fromCreatedAt: '',
        toCreatedAt: '',
        fromPrice: '',
        toPrice: ''
      }
      // isShow: {
      //   saleType: false,
      //   fromPrice: false,
      //   toPrice: false
      // }
    }
    init(): void {
      this.getCreatorList('')
      this.getCategoryList('')
      this.getNetworkList()
      this.getCollectionList('')
    }
    handleChange(): void {
      this.$emit('searchData', this.filter.value.search)
    }
    handleReload(): void {
      this.$emit('reload')
    }
    handleOpen(): void {
      let filterName = ''
      switch (this.$route.name) {
        case 'Collection':
          filterName = 'popup-filter-collection'
          break
        case 'Nft':
          filterName = 'popup-filter-nft'
          break
        default:
          break
      }
      console.log(filterName)
      this.setOpenPopup({
        popupName: filterName,
        isOpen: true
      })
    }
    resetQuery(): void {
      this.queryCreatorList = {
        page: 1,
        limit: 20,
        businessPartner: 'SYSTEM',
        search: ''
      }
      this.queryCollectionList = {
        page: 1,
        limit: 20,
        search: ''
      }
      this.getCategoryList('')
    }
    handleCommand(command: string): void {
      this.$emit('selectCommand', command)
    }
    handleSort(command: string): void {
      this.sortActive = command
      this.$emit('sort', command)
    }

    //Call Api
    //api creator
    queryCreatorList = {
      page: 1,
      limit: 20,
      businessPartner: 'SYSTEM',
      search: ''
    }
    loadMoreCreator(): void {
      this.queryCreatorList.limit += 20
      const a = debounce(this.getCreatorList, 500)
      a(this.queryCreatorList.search)
    }
    remoteCreatorList(query: string): void {
      this.queryCreatorList.search = trim(query)
      const a = debounce(this.getCreatorList, 500)
      a(query)
    }
    async getCreatorList(search: string): Promise<void> {
      await apiNft
        .getListCreator({
          page: this.queryCreatorList.page,
          limit: this.queryCreatorList.limit,
          businessPartner: 'SYSTEM',
          search: trim(search) ? trim(search) : ''
        })
        .then((res: any) => {
          this.creators = res.content
        })
        .catch(e => {
          console.log(e)
        })
    }

    //api category
    remoteCategoryList(query: string): void {
      const a = debounce(this.getCategoryList, 500)
      a(query)
    }
    async getCategoryList(search: string): Promise<void> {
      await apiNft
        .getCategories({
          search: trim(search) ? trim(search) : null
        })
        .then((res: any) => {
          if (trim(search)) {
            this.categories = res.content
            this.categories.forEach(function (v) {
              delete v.levelDepth
            })
          } else {
            this.categories = []
            this.recursiveCategoryChild(res.content)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
    recursiveCategoryChild(list: Array<Record<string, any>>): void {
      for (let i = 0; i < list.length; i++) {
        this.categories.push(list[i])
        if (list[i].subCategory !== null) {
          const listParent = filter(list[i].subCategory, value => value.parentId === list[i].id)
          this.recursiveCategoryChild(listParent)
        }
      }
    }

    //api network
    async getNetworkList(): Promise<void> {
      await apiNft
        .getListNetwork()
        .then((res: any) => {
          this.networks = res.content
        })
        .catch(e => {
          console.log(e)
        })
    }

    //api collection
    queryCollectionList = {
      page: 1,
      limit: 20,
      search: ''
    }
    loadMoreCollection(): void {
      this.queryCollectionList.limit += 20
      const a = debounce(this.getCollectionList, 500)
      a(this.queryCollectionList.search)
    }
    remoteCollectionList(query: string): void {
      this.queryCollectionList.search = trim(query)
      const a = debounce(this.getCollectionList, 500)
      a(query)
    }
    async getCollectionList(search: string): Promise<void> {
      try {
        const result = await apiNft.getNftCollection({
          page: this.queryCollectionList.page,
          limit: this.queryCollectionList.limit,
          search: trim(search) ? trim(search) : ''
        })
        // this.collections = this.collections.concat(result.content)
        this.collections = result.content
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  .kyc-filter {
    background-color: #fff;

    .input-search {
      width: 400px;
      margin-right: 30px;
    }
    .sort {
      margin-left: 30px;
      cursor: pointer;
      color: #0a0b0d;
    }
    .add-btn {
      color: var(--bc-color-white);
      background-color: var(--bc-theme-primary);
      margin-right: 12px;
    }
    .add-collection {
      width: 122px;
      height: 48px;
      margin-right: 24px;
      border-radius: 6px;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }
    .excel-btn {
      margin-right: 24px;
    }

    ::v-deep .filter-item {
      &:hover {
        .text-filter {
          color: var(--bc-theme-primary);

          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }
    }

    ::v-deep .sort {
      &:hover {
        .el-dropdown-selfdefine {
          color: var(--bc-theme-primary);

          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }

      .sort-title {
        &:focus {
          color: var(--bc-theme-primary);

          .span-icon {
            color: var(--bc-theme-primary) !important;
          }
        }
      }
    }
  }
</style>
