<template>
  <base-popup name="popup-create-collection" class="popup-create-collection" width="1040px" :open="handleOpen" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.collection.popup.create') }}</span>
    </div>
    <div class="content">
      <main class="content-left">
        <!-- Upload avatar & thumbnail -->
        <el-form :model="collection" :rules="rules" ref="collection">
          <el-form-item prop="avatar">
            <section class="upload block">
              <h2 class="block-title" style="margin-bottom: 0px">
                {{ $t('metamart.collection.popup.avatar') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <span class="block__subtitle">PNG, JPG. {{ $t('metamart.collection.upload.size') }}: 60x60 ({{ $t('metamart.collection.upload.max') }} 5mb).</span>
              <el-input v-model="collection.avatar" style="display: none"></el-input>
              <el-upload action="javascript:;" class="upload-avatar" drag :on-change="handleAvatarChange" :auto-upload="false" :show-file-list="false" accept=".jpg, .jpeg, .png">
                <div class="el-upload__text" v-if="!collection.avatar">
                  {{ $t('metamart.collection.upload.drop') }} <em>{{ $t('metamart.collection.upload.click') }}</em>
                </div>
                <div class="upload-wrapper" v-if="collection.avatar">
                  <img :src="collection.avatar" :alt="avatarPreviewing" class="upload-wrapper__preview" />
                  <span class="cursor icon-x upload-wrapper__icon" @click.stop="collection.avatar = ''">
                    <base-icon icon="icon-delete-circle" size="26" />
                  </span>
                </div>
              </el-upload>
            </section>
          </el-form-item>

          <el-form-item prop="thumb">
            <section class="upload block">
              <h2 class="block-title" style="margin-bottom: 0px">
                {{ $t('metamart.collection.popup.thumbnail') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <span class="block__subtitle">PNG, JPG. {{ $t('metamart.collection.upload.size') }}: 285x190 ({{ $t('metamart.collection.upload.max') }} 5mb).</span>
              <el-input v-model="collection.thumb" style="display: none"></el-input>
              <el-upload
                action="javascript:;"
                class="upload-thumbnail"
                drag
                :on-change="handleThumbnailChange"
                :auto-upload="false"
                :show-file-list="false"
                accept=".jpg, .jpeg, .png,"
              >
                <div class="el-upload__text" v-if="!collection.thumb">
                  {{ $t('metamart.collection.upload.drop') }} <em>{{ $t('metamart.collection.upload.click') }}</em>
                </div>
                <div class="upload-wrapper" v-if="collection.thumb">
                  <img :src="collection.thumb" :alt="thumbnailPreviewing" class="upload-wrapper__preview" />
                  <span class="cursor icon-x upload-wrapper__icon" @click.stop="collection.thumb = ''">
                    <base-icon icon="icon-delete-circle" size="26" />
                  </span>
                </div>
              </el-upload>
            </section>
          </el-form-item>

          <!-- Upload banner -->
          <el-form-item prop="banners">
            <section class="upload block">
              <h2 class="block-title" style="margin-bottom: 0px">
                {{ $t('metamart.collection.popup.banner') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <span class="block__subtitle"
                >PNG, GIF, WEBG, MP4 or MP3. {{ $t('metamart.collection.upload.size') }}: 1200X260 ({{ $t('metamart.collection.upload.max') }} 5mb).</span
              >
              <el-input v-model="collection.banners[0]" style="display: none"></el-input>
              <el-upload
                action="javascript:;"
                class="upload-banner"
                drag
                :on-change="handleBannerChange"
                :auto-upload="false"
                :show-file-list="false"
                accept=".jpg, .jpeg, .png, .gif, .webg, .mp4"
              >
                <div class="el-upload__text" v-if="!collection.banners[0]">
                  {{ $t('metamart.collection.upload.drop') }} <em>{{ $t('metamart.collection.upload.click') }}</em>
                </div>
                <div class="upload-wrapper" v-if="collection.banners[0] && imageClick.type === 'image'">
                  <img :src="imageClick.mediaUrl" class="upload-wrapper__preview" />
                  <span class="cursor icon-x upload-wrapper__icon" @click.stop="handleBannerRemove(imageClick)">
                    <base-icon icon="icon-delete-circle" size="26" />
                  </span>
                </div>
                <div class="upload-wrapper" v-if="collection.banners[0] && imageClick.type === 'video/mp4'">
                  <video controls>
                    <source :src="imageClick.mediaUrl" :type="imageClick.type" />
                  </video>
                  <span class="cursor icon-x upload-wrapper__icon" @click.stop="handleBannerRemove(imageClick)">
                    <base-icon icon="icon-delete-circle" size="26" />
                  </span>
                </div>
              </el-upload>
              <div v-if="collection.banners[0]" class="banner-list">
                <div v-for="(item, index) of collection.banners" :key="index" class="flex jc-space-center" style="width: 84px">
                  <div :class="{ active: item.uid === activeBannerUid, 'banner-list__image': true }">
                    <div v-if="item.type === 'image'" class="banner-list__image-spacing">
                      <img :src="item.mediaUrl" :alt="item.name" @click="handleImageClick(item)" />
                    </div>
                    <div v-if="item.type === 'video/mp4'" class="banner-list__image-spacing">
                      <video @click="handleImageClick(item)">
                        <source :src="item.mediaUrl" :type="item.type" />
                      </video>
                    </div>
                  </div>
                </div>
                <el-upload
                  action="javascript:;"
                  class="upload-banner-list"
                  :auto-upload="false"
                  accept=".jpg, .jpeg, .png, .bmp"
                  :on-change="handleListBanner"
                  :file-list="collection.banners"
                  :show-file-list="false"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </section>
          </el-form-item>

          <el-form-item prop="collectionName">
            <section class="name block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.name') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <el-input v-model="collection.collectionName" :placeholder="$t('metamart.collection.placeholder.name')"></el-input>
            </section>
          </el-form-item>

          <el-form-item prop="description">
            <section class="description block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.description') }}
                <span class="block-title__light"> ({{ $t('metamart.collection.popup.optional') }}) </span>
              </h2>
              <el-input
                v-model="collection.description"
                type="textarea"
                :placeholder="$t('metamart.collection.placeholder.description')"
                maxlength="200"
                show-word-limit
                rows="4"
              />
            </section>
          </el-form-item>

          <el-form-item prop="network">
            <section class="network block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.network') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <el-select v-model="collection.network" placeholder="Ethereum (ERC-1155)">
                <el-option v-for="(option, index) in networks" :label="option.networkName" :value="option.id" :key="index"></el-option>
              </el-select>
            </section>
          </el-form-item>

          <el-form-item prop="contractAddress">
            <section class="contract-address block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.contract-address') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <!-- <el-input v-model="collection.contractAddress" placeholder="Select a contract address" ></el-input> -->
              <el-select filterable remote v-model="collection.contractAddress" :placeholder="$t('metamart.collection.placeholder.contract-address')">
                <el-option v-for="(option, index) in contracts" :label="option.contractAddress" :value="option.contractAddress" :key="index"></el-option>
              </el-select>
            </section>
          </el-form-item>

          <el-form-item prop="currency">
            <section class="payment block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.default-payment-by') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <el-select v-model="collection.currency" class="select-prefix-icon">
                <el-option v-for="(item, index) in currencies" :label="`${item.currencyName} (${item.currency})`" :value="item.currency" :key="index">
                  <template>
                    <div class="be-flex wallet-item">
                      <base-icon :icon="getIcon(item.currency)" size="24" />
                      <span class="d-ib" style="margin-left: 10px">{{ item.currencyName }}</span>
                      <span class="d-ib" style="margin-left: 4px">({{ item.currency.toUpperCase() }})</span>
                    </div>
                  </template>
                </el-option>
                <div class="select-icon" slot="prefix">
                  <base-icon :icon="getIcon(collection.currency)" size="24" />
                </div>
              </el-select>
            </section>
          </el-form-item>

          <el-form-item prop="creatorId">
            <section class="creator block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.creator') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <el-select filterable remote :remote-method="remoteCreatorList" v-model="collection.creatorId" :placeholder="$t('metamart.collection.placeholder.creator')">
                <div class="" v-infinite-scroll="loadMoreCreator" infinite-scroll-delay="500">
                  <el-option v-for="item in creators" :label="`${item.accountName} (${item.username})`" :value="item.id" :key="item.id">
                    <template>
                      <div class="be-flex wallet-item">
                        <span style="margin-left: 10px">{{ item.accountName }}</span>
                        <span style="margin-left: 4px">({{ item.username }})</span>
                      </div>
                    </template>
                  </el-option>
                </div>
              </el-select>
            </section>
          </el-form-item>

          <el-form-item prop="categoryIds">
            <section class="category block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.category') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <el-select
                filterable
                remote
                clearable
                :remote-method="remoteCategoryList"
                v-model="collection.categoryIds"
                :placeholder="$t('metamart.collection.placeholder.category')"
              >
                <el-option
                  v-for="(option, index) in categories"
                  :label="option.categoryName"
                  :value="option.id"
                  :key="index"
                  :style="{ 'margin-left': `${(option.levelDepth ? option.levelDepth : 0) * 15}px` }"
                >
                </el-option>
              </el-select>
            </section>
          </el-form-item>

          <el-form-item prop="templateId">
            <section class="template block">
              <h2 class="block-title">
                {{ $t('metamart.collection.popup.template') }}
                <span class="block-title__asterisk"> *</span>
              </h2>
              <el-select
                filterable
                remote
                :remote-method="remoteTemplateList"
                clearable
                v-model="collection.templateId"
                :placeholder="$t('metamart.collection.placeholder.template')"
              >
                <div class="" v-infinite-scroll="loadMoreTemplate" infinite-scroll-delay="500">
                  <el-option v-for="option in templates" :label="option.templateName" :value="option.id" :key="option.id"></el-option>
                </div>
              </el-select>
            </section>
          </el-form-item>
        </el-form>
      </main>

      <aside class="content-right">
        <section class="preview block">
          <h2 class="block-title">{{ $t('metamart.collection.popup.preview') }}</h2>
          <div class="preview-wrapper">
            <p class="preview-wrapper__message" v-if="!collection.avatar && !collection.thumb">{{ $t('metamart.collection.upload.preview') }}</p>
            <div class="preview-wrapper__thumbnail" v-if="collection.thumb">
              <img :src="collection.thumb" :alt="thumbnailPreviewing" />
            </div>
            <div class="preview-wrapper__avatar" v-if="collection.avatar">
              <img :src="collection.avatar" :alt="avatarPreviewing" />
              <base-icon class="icon-active" icon="icon-status1" size="26" />
              <base-icon class="icon-verified" icon="icon-verified" size="17" />
            </div>
            <div class="preview-wrapper__detail" v-if="collection.avatar && collection.thumb">
              <p class="brand">{{ collection.collectionName }}</p>
              <div v-for="creator in creators" :key="creator.id">
                <p v-if="collection.creatorId === creator.id" class="__name">
                  by
                  <span class="__name-link">
                    {{ creator.accountName }}
                    <base-icon icon="icon-user-verified" size="12" />
                  </span>
                </p>
              </div>
              <p class="__description">{{ collection.description }}</p>
            </div>
          </div>
        </section>
      </aside>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleReset">{{ $t('metamart.button.reset') }}</el-button>
          <el-button class="btn-default-bg btn-400 btn-h40 is-none-border" style="width: 100px; font-size: 14px; font-weight: 600" @click="handleSave">{{
            $t('metamart.button.save')
          }}</el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import NftDetail from './NftDetail.vue'
  import { NftRepository } from '@/services/repositories/nft'
  import UploadRepository from '@/services/repositories/upload'
  import getRepository from '@/services'
  import { debounce, filter, includes, trim } from 'lodash'
  import { namespace } from 'vuex-class'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const apiNft: NftRepository = getRepository('nft')
  const apiUpload: UploadRepository = getRepository('upload')

  @Component({ components: { NftDetail } })
  export default class PopupCreateCollection extends Mixins(PopupMixin) {
    @bcAuth.State('user') user!: Record<string, any>

    userId = this.$store.state.beAuth.user.userId
    imageClick: any = {}
    avatarPreviewing = ''
    thumbnailPreviewing = ''
    collection: Record<string, any> = {
      avatar: '',
      thumb: '',
      banners: [],
      collectionName: '',
      description: '',
      network: '',
      contractAddress: '',
      currency: this.coinMain,
      creatorId: '',
      categoryIds: '',
      templateId: ''
    }
    activeBannerUid = 0
    networks: Array<Record<string, any>> = []
    contracts: Array<Record<string, any>> = []
    creators: Array<Record<string, any>> = []
    categories: Array<Record<string, any>> = []
    categoriesClone: Array<Record<string, any>> = []
    templates: Array<Record<string, any>> = []
    templatesClone: Array<Record<string, any>> = []
    currencies: Array<Record<string, any>> = []
    baseCurrency = ''

    rules: Record<string, any> = {
      avatar: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.avatar'),
          trigger: 'change'
        }
      ],
      thumb: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.thumbnail'),
          trigger: 'change'
        }
      ],
      banners: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.banner'),
          trigger: 'change'
        }
      ],
      collectionName: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.name'),
          trigger: 'change'
        }
      ],
      network: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.network'),
          trigger: 'change'
        }
      ],
      contractAddress: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.contract-address'),
          trigger: 'change'
        }
      ],
      currency: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.default-payment-by'),
          trigger: 'change'
        }
      ],
      creatorId: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.creator'),
          trigger: 'change'
        }
      ],
      categoryIds: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.category'),
          trigger: 'change'
        }
      ],
      templateId: [
        {
          required: true,
          message: this.$t('metamart.collection.validate.template'),
          trigger: 'change'
        }
      ]
    }

    @Watch('collection.network') handleNetworkChange(newVal: any): void {
      //@ts-ignore
      this.$refs['collection'].fields.find((f: any) => f.prop === 'contractAddress').resetField()
      this.getContractList()
      this.networks.forEach((network: any) => {
        if (network.id === newVal) {
          this.baseCurrency = network.baseCurrency
        }
      })
      console.log('>>>base Cur:', this.baseCurrency)
      this.getCurrencyList(this.baseCurrency)
    }
    async handleAvatarChange(file: any): Promise<void> {
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
        this.$message.error(this.$t('metamart.collection.upload.avatar-format') as string)
        return
      }
      if (file.size > 1024 * 1024 * 5) {
        this.$message.error(this.$t('metamart.collection.upload.error-size') as string)
        return
      }
      const formData = new FormData()
      formData.append('files', file.raw)
      formData.append('type', 'AVATAR_COLLECTION')
      formData.append('userId', this.userId)
      await apiUpload
        .uploadImage(formData)
        .then((res: any) => {
          this.collection.avatar = res.success[0].url
          this.avatarPreviewing = res.success[0].name
        })
        .catch(e => {
          console.log(e)
        })
    }
    async handleThumbnailChange(file: any): Promise<void> {
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
        this.$message.error(this.$t('metamart.collection.upload.thumbnail-format') as string)
        return
      }
      if (file.size > 1024 * 1024 * 5) {
        this.$message.error(this.$t('metamart.collection.upload.error-size') as string)
        return
      }
      const formData = new FormData()
      formData.append('files', file.raw)
      formData.append('type', 'THUMB_COLLECTION')
      formData.append('userId', this.userId)
      await apiUpload
        .uploadImage(formData)
        .then((res: any) => {
          this.collection.thumb = res.success[0].url
          this.thumbnailPreviewing = res.success[0].name
        })
        .catch(e => {
          console.log(e)
        })
    }
    async handleBannerChange(file: any): Promise<void> {
      // this.collection.banners.unshift({
      //   name: file.name,
      //   url: URL.createObjectURL(file.raw)
      // })
      // this.imageClick = this.collection.banners[0]
      // console.log('fileUrl', URL.createObjectURL(file.raw));
      // console.log('banner', this.collection.banners);
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png' && file.raw.type !== 'video/mp4') {
        this.$message.error(this.$t('metamart.collection.upload.banner-format') as string)
        return
      }
      if (file.size > 1024 * 1024 * 5) {
        this.$message.error(this.$t('metamart.collection.upload.error-size') as string)
        return
      }
      this.uploadBanner(file.raw)
    }
    handleClearUpload(): void {
      this.collection.avatar = ''
      this.collection.thumb = ''
    }
    handleListBanner(file: any): void {
      // this.collection.banners.unshift({
      //   name: file.name,
      //   url: URL.createObjectURL(file.raw)
      // })
      if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png' && file.raw.type !== 'video/mp4') {
        this.$message.error(this.$t('metamart.collection.upload.banner-format') as string)
        return
      }
      if (file.size > 1024 * 1024 * 5) {
        this.$message.error(this.$t('metamart.collection.upload.error-size') as string)
        return
      }
      this.uploadBanner(file.raw)
    }
    handleBannerRemove(banner: any): void {
      console.log('>>remove banner:', banner)
      console.log('>>banners:', this.collection.banners)
      this.collection.banners = this.collection.banners.filter((item: any) => item !== banner)
      this.imageClick = this.collection.banners[0]
    }
    handleImageClick(image: any): void {
      this.imageClick = image
      console.log('>>>imageClick', this.imageClick)
      this.activeBannerUid = image.uid
    }
    getIcon(currency: string): string {
      return currency ? `icon-${currency.toLocaleLowerCase()}` : 'icon-hub'
    }
    handleOpen(): void {
      this.getNetworkList()
      this.getContractList()
      this.getCreatorList('')
      this.getCategoryList('')
      this.getTemplateList('')
    }
    handleClose(): void {
      //@ts-ignore
      this.$refs['collection'].resetFields()
      this.categories = []
      this.categoriesClone = []
      this.queryTemplateList = {
        page: 1,
        limit: 20,
        search: ''
      }
      this.setOpenPopup({
        popupName: 'popup-create-collection',
        isOpen: false
      })
    }
    handleReset(): void {
      //@ts-ignore
      this.$refs['collection'].resetFields()
      this.getCategoryList('')
    }
    handleSave(): void {
      //@ts-ignore
      this.$refs['collection']?.validate((valid: any) => {
        if (valid) {
          // this.collection.network = this.collection.network.match(/\(([^)]+)\)/)[1]
          this.networks.forEach((item: any) => {
            if (item.id === this.collection.network) {
              this.collection.network = item.network
            }
          })
          apiNft
            .createCollection(this.collection)
            .then((res: any) => {
              this.handleClose()
              this.$message.success('Create collection successful')
              this.$emit('reload')
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    }

    //call API
    async uploadBanner(file: any): Promise<void> {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('type', 'BANNER_COLLECTION')
      formData.append('userId', this.userId)
      await apiUpload
        .uploadImage(formData)
        .then((res: any) => {
          console.log(res)
          this.collection.banners.unshift({
            name: res.success[0].name,
            mediaUrl: res.success[0].url,
            mediaType: includes(res.success[0].url, 'video') ? 'VIDEO' : 'IMAGE'
          })
          this.imageClick = this.collection.banners[0]
          if (includes(res.success[0].url, 'video')) {
            this.imageClick.type = 'video/mp4'
          } else {
            this.imageClick.type = 'image'
          }
        })
        .catch(e => {
          console.log(e)
        })
    }

    async getCurrencyList(param: any): Promise<void> {
      let params = {
        baseCurrency: param
      }
      await apiNft
        .getListCurrency(params)
        .then((res: any) => {
          this.currencies = res
          this.collection.currency = res[0].currency
        })
        .catch(e => {
          console.log(e)
        })
    }

    async getNetworkList(): Promise<void> {
      await apiNft
        .getListNetwork()
        .then((res: any) => {
          this.networks = res.content
          this.collection.network = res.content[0].id
        })
        .catch(e => {
          console.log(e)
        })
    }

    async getContractList(): Promise<void> {
      let networkCode = ''
      this.networks.forEach((item: any) => {
        if (item.id === this.collection.network) {
          networkCode = item.networkName
        }
      })
      let param = {
        type: 'NFT',
        network: networkCode
      }
      console.log(param)
      await apiNft
        .getListContractAddress(param)
        .then((res: any) => {
          this.contracts = res.content
          this.collection.contractAddress = res.content[0].contractAddress
        })
        .catch(e => {
          console.log(e)
        })
    }

    //api list creator
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
          if (!trim(search)) {
            this.collection.creatorId = res.content[0].id
          }
        })
        .catch(e => {
          console.log(e)
        })
    }

    //api list category
    remoteCategoryList(query: string): void {
      const a = debounce(this.getCategoryList, 500)
      a(query)
    }
    async getCategoryList(search: string): Promise<any> {
      await apiNft
        .getCategories({
          search: trim(search) ? trim(search) : null
        })
        .then((res: any) => {
          if (trim(search)) {
            // this.categoriesClone = res.content
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

    //api list template
    queryTemplateList = {
      page: 1,
      limit: 20,
      search: ''
    }
    loadMoreTemplate(): void {
      this.queryTemplateList.page += 1
      // const a = debounce(this.getTemplateList, 500)
      // a(this.queryTemplateList.search)
      apiNft.getListTemplate(this.queryTemplateList).then((res: any) => {
        this.templates = [...this.templates, ...res.content]
      })
    }
    async remoteTemplateList(query: string): Promise<any> {
      if (query !== '') {
        this.queryTemplateList.page = 1
        this.queryTemplateList.search = trim(query)
        await apiNft.getListTemplate(this.queryTemplateList).then((res: any) => {
          this.templates = res.content || []
        })
      } else {
        this.templates = this.templatesClone
      }
    }
    async getTemplateList(search: string): Promise<void> {
      await apiNft
        .getListTemplate({
          page: this.queryTemplateList.page,
          limit: this.queryTemplateList.limit,
          search: trim(search) ? trim(search) : null
        })
        .then((res: any) => {
          this.templates = res.content
          this.templatesClone = res.content
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-create-collection {
    .popup-content {
      background-color: #f6f8fc;
      padding-bottom: 24px;
    }
    .content {
      padding: 24px;
      background-color: #ffffff;
      border-radius: 8px;
      display: flex;
      gap: 32px;
      .el-upload {
        width: 100%;
        .el-upload-dragger {
          width: 100%;
          height: auto;
          min-height: 148px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          .el-upload__text {
            font-size: 16px;
            color: var(--bc-text-discript);
            em {
              color: #0a34c7;
            }
          }
          .upload-wrapper {
            &__preview {
              width: 100%;
              height: 100%;
              border-radius: 8px;
              object-fit: cover;
            }
            &__icon {
              position: absolute;
              top: -20px;
              right: -12px;
              z-index: 101;
            }
          }
        }
      }
      .el-form {
        .el-form-item {
          margin-bottom: 40px;
          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
      &-left {
        flex: 1;
        .upload {
          height: auto;
        }
        .upload-avatar {
          .el-upload-dragger {
            height: 148px;
            .upload-wrapper {
              width: 60px;
              height: 60px;
              position: relative;
              z-index: 100;
            }
          }
        }
        .upload-thumbnail {
          .el-upload-dragger {
            .upload-wrapper {
              width: 285px;
              height: 190px;
              position: relative;
              margin: 24px 0px;
              z-index: 100;
            }
          }
        }
        .upload-banner {
          .el-upload-dragger {
            height: 148px;
            .upload-wrapper {
              width: 461px;
              height: 100px;
              position: relative;
              z-index: 100;
              video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
              }
            }
          }
        }
        .banner-list {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          &__image {
            width: 72px;
            height: 72px;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            .banner-list__image-spacing {
              width: calc(100% - 2px);
              height: calc(100% - 2px);
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: white;
              border-radius: 8px;
              img {
                width: calc(100% - 4px);
                height: calc(100% - 4px);
                object-fit: cover;
                border-radius: 8px;
              }
              video {
                width: calc(100% - 4px);
                height: calc(100% - 4px);
                object-fit: cover;
                border-radius: 8px;
              }
            }
          }
          .active {
            background: linear-gradient(transparent, transparent) padding-box, linear-gradient(to top right, #9d3ef2, #3036f4) border-box;
            border-radius: 10px;
            border: 0px solid transparent;
          }
          .upload-banner-list {
            width: 80px;
            height: 80px;
            line-height: 80px;
            border: 1px dashed #dbdbdb;
            border-radius: 8px;
          }
        }
      }
      &-right {
        width: 285px;
        height: 412px;
        // background-color: green;
        float: left;
        .preview {
          height: 452px;
          .preview-wrapper {
            border: 1px solid #dbdbdb;
            min-height: 412px;
            border-radius: 8px;
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 34px;
            box-sizing: border-box;
            &__thumbnail {
              height: 190px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px 8px 0px 0px;
              }
            }
            &__avatar {
              width: 64px;
              height: 64px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -75%);
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
                border: 2px solid white;
                box-sizing: border-box;
                filter: drop-shadow(0px 0.6px 1.8px rgba(0, 0, 0, 0.1)) drop-shadow(0px 3.2px 7.2px rgba(0, 0, 0, 0.13));
              }
              .icon-active {
                position: absolute;
                font-size: 26px;
                left: 50%;
                transform: translateX(50%);
              }
              .icon-verified {
                position: absolute;
                font-size: 17px;
                left: 64%;
                top: 45%;
                transform: translate(50%, 50%);
              }
            }
            &__message {
              text-align: center;
              font-size: 16px;
              line-height: 24px;
              height: 48px;
              margin: auto 20px;
              color: #5b616e;
            }
            &__frame {
              width: 100%;
              height: 240px;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 100;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            &__detail {
              width: 100%;
              height: 172px;
              padding: 16px;
              text-align: center;
              box-sizing: border-box;
              z-index: 100;
              .brand {
                font-family: 'Open Sans';
                font-style: normal;
                font-weight: 500;
                font-size: 20px;
                line-height: 24px;
                color: var(--bc-text-primary);
              }
              .__description {
                font-weight: 400;
                font-size: 16px;
                line-height: 24px;
                color: var(--bc-text-discript);
                margin-top: 16px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .placebid {
                font-size: 16px;
                line-height: 24px;
                border: none;
                background-color: transparent;
                color: #0151fc;
                position: relative;
                top: 16px;
              }
              .brand-icon__official {
                margin-top: 6px;
                margin-left: 3px;
              }
              .brand-icon__optional {
                // clear: left;
                float: right;
                margin-top: 6px;
                margin-right: 3px;
                &:hover {
                  cursor: pointer;
                }
              }
              .__name {
                font-weight: 400;
                font-size: 14px;
                line-height: 24px;
                color: var(--bc-text-discript);
                &-link {
                  color: var(--bc-text-hyperlink);
                }
              }
            }
          }
        }
      }
      .block {
        width: 100%;
        &-title {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
          color: #0a0b0d;
          margin-bottom: 8px;
          &__light {
            font-weight: 400;
          }
          &__asterisk {
            color: var(--bc-required);
          }
        }
        &__subtitle {
          font-size: 12px;
          font-weight: 400;
          color: var(--bc-text-disabled);
        }
        &-suggestion {
          font-size: 12px;
          line-height: 16px;
          color: #5b616e;
          margin-top: 8px;
        }
        &-alert {
          font-size: 12px;
          line-height: 16px;
          margin-top: 8px;
          color: #cf202f;
        }
        &-switch {
          float: right;
          position: relative;
          bottom: 50px;
        }
        .el-select {
          width: 100%;
        }
        .select-prefix-icon {
          .el-input__inner {
            padding-left: 40px;
          }
          .el-input__prefix {
            left: 12px;
            .select-icon {
              width: 24px;
              height: 24px;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              border-radius: 50%;
              background-color: var(--bc-bg-neutral);
              .span-icon {
                font-size: 14px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
    }
  }
</style>
