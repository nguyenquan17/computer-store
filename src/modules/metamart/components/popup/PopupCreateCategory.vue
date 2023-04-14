<template>
  <base-popup name="popup-create-category" class="popup-create-category" width="600px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.collection.popup.create-category') }}</span>
    </div>
    <div class="body-content">
      <el-form ref="dataInput" :model="dataInput" :rules="rules">
        <el-row>
          <el-col>
            <div class="col-style">
              <el-form-item :label="$t('metamart.collection.popup.category')" class="select" prop="categoryName">
                <el-input clearable :placeholder="$t('metamart.collection.popup.category')" v-model="dataInput.categoryName" ref="categoryName" style="color: #181b22"></el-input>
              </el-form-item>
              <el-form-item :label="$t('parent_category')">
                <el-select class="select w-100" clearable remote :remote-method="remoteCategoryList" v-model="dataInput.parentId" filterable :placeholder="$t('parent_category')">
                  <el-option
                    v-for="(option, index) in categories"
                    :label="option.categoryName"
                    :value="option.id"
                    :key="index"
                    :style="{ 'margin-left': `${(option.levelDepth ? option.levelDepth : 0) * 15}px` }"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('metamart.collection.popup.position')" class="select" prop="position">
                <el-input @keypress.native="onlyNumber($event)" clearable :placeholder="$t('metamart.collection.popup.position')" v-model="dataInput.position" ref="position" style="color: #181b22"></el-input>
              </el-form-item>
              <el-form-item :label="$t('metamart.collection.popup.description')" class="select">
                <el-input clearable type="textarea" :rows="4" :placeholder="$t('metamart.collection.popup.description')" v-model="dataInput.description"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleReset"> {{ $t('button.reset') }} </el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" v-bind:disabled="isDisabledApplyButton"  style="font-size: 14px; font-weight: 600" @click="handleApply"> <i v-if="isCreatingCategory" class="el-icon-loading"></i> {{ $t('button.save') }} </el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { NftRepository } from '@/services/repositories/nft'
  import { debounce, filter, findIndex, forEach, trim } from 'lodash'

  const apiNft: NftRepository = getRepository('nft')

  @Component
  export default class PopupCreateCategory extends Mixins(PopupMixin) {
    text = ''
    @Prop() idCategory: any
    @Prop() listCategory!: any
    @Prop({ required: false, type: Object, default: {} }) dataDetail!: Record<string, any>
    dataInput: any = {
      categoryName: '',
      parentId: '',
      position: 0,
      description: ''
    }
    categories: Array<Record<string, any>> = this.listCategory
    isCategoryLoading = false
    fullNameLength = false
    rules: any = {
      categoryName: [
        {
          required: true,
          message: this.$t('member.validate.empty-category'),
          trigger: 'blur'
        }
      ]
    }
    async createCategory(): Promise<void> {
      {
        await apiNft
          .createCategory(this.dataInput)
          .then((res: any) => {
            this.$message.success(`${this.$t('notify.create-category-success')}`)
          })
          .catch(e => {
            console.log(e)
          })
      }
    }
    // handleListCustomer(id: string): void {
    //   const customerCategoryList: any = []
    //   forEach(id, elm => {
    //     customerCategoryList.push(this.listCategory.filter((item: any) => item.id == elm))
    //   })
    //   this.pushCustomerCategoryList(customerCategoryList)
    // }
    pushCustomerCategoryList(data: any): void {
      const item: any = []
      forEach(data, elm => {
        item.push(elm[0])
      })
      // this.customer.customerCategoryList = item
    }
    remoteCustomerCategory(query: string): void {
      this.isCategoryLoading = true
      // if (trim(query) === '') {
      //   this.isSearchCate = false
      // } else {
      //   this.isSearchCate = true
      // }
      // this.queryCustomerCategory.search = trim(query)
      // this.queryCustomerCategory.page = 1
      // this.queryCustomerCategory.limit = 1000
      // const a = debounce(this.getCustomerCategory, 500)
      // a(query)
    }
    handleOpen(): void {
      ;(this.dataInput.categoryName = null), (this.dataInput.parentId = null)
      this.dataInput.description = null
      this.fullNameLength = false
      this.dataInput.parentId = this.idCategory ? this.idCategory : null
      this.dataInput.position = 0
      this.disabledApplyButton = false;
    }
    handleClose(): void {
      //@ts-ignore
      this.$refs['dataInput'].resetFields();
      this.categories = this.listCategory
      this.setOpenPopup({
        popupName: 'popup-create-category',
        isOpen: false
      })
    }
    handleReset(): void {
      // @ts-ignore
      this.$refs.dataInput.clearValidate()
      this.dataInput = {}
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

    creatingCategory = false
    get isCreatingCategory() {
      return this.creatingCategory
    }

    disabledApplyButton = false 
    get isDisabledApplyButton(): boolean {
      return this.disabledApplyButton
    }

    handleApply(): void {
      if (this.creatingCategory) {
        return
      }
      
      let a: any = this.$refs.dataInput
      if (trim(this.dataInput.categoryName) === '') {
        this.fullNameLength = true
      }
      a.validate((valid: any) => {
        if (valid) {
          if (!this.fullNameLength) {
            this.creatingCategory = true;
            this.disabledApplyButton = true;
            apiNft
              .createCategory(this.dataInput)
              .then((res: any) => {
                this.$message.success(`${this.$t('notify.create-category-success')}`)
                this.handleClose()
                this.$emit('load')
              })
              .catch(er => {
                console.log(er)
              }).finally(() => {
                this.creatingCategory = false 
              })
          } else {
            console.log('error validate data!')
            return false
          }
        }
      })
    }

    onlyNumber(event: KeyboardEvent): void {
      const keyCode = event.keyCode ? event.keyCode : event.which
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault()
      }
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    line-height: $height;
    font-weight: $weight;
    color: $color;
  }
  ::v-deep.popup-create-category {
    .el-form {
      &-item {
        margin-bottom: 24px;
        .el-textarea {
          &__inner {
            min-height: 143px !important;
          }
        }
      }
      &-item:nth-child(1) {
        margin-bottom: 16px;
      }
    }
    .footer {
      .el-button {
        width: 100px;
        height: 40px;
      }
      .el-button:nth-child(2) {
        margin-left: 16px;
      }
    }
  }
</style>
