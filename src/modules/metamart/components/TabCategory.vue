<!-- eslint-disable prettier/prettier -->
<template>
  <div class="w-100 bg-white wallet-table">
    <div class="wallet-table__below">
      <div class="wrapper">
        <div class="group-name">{{ $t('nft.sort.category')}}</div>
        <!-- <div class="group-code">Mã nhóm</div>
      <div class="group-member">Số thành viên</div> -->
        <div class="group-placeholder"></div>
      </div>
      <ul class="groupCustomer-list be-scroll-custom">
        <!-- <li class="title" style="padding-left: 45px; display: flex; justify-content: space-between">
          <div>Tên nhóm</div>
          <div style="margin-right: 400px">Số thành viên</div>
        </li> -->
        <li v-for="value in data" :key="value.id">
          <unit-item
            ref="unitItem"
            @edit="editItem"
            @detail="detailItem"
            @create="createItem"
            @delete="deleteItem"
            @idLocation="getIdArea"
            :value="value"
            :dataDetail="dataDetail"
            :is-search="isSearch"
            :parent="[]"
          />
        </li>
      </ul>
      <!-- <base-pagination :table="table" :info="'nhóm'" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange"/> -->
    </div>
    <popup-create-category :idCategory="parentIdProp" :listCategory="listCategory" @load="loadData" />
    <popup-edit-category :dataDetail="dataDetail" @load="loadData" :listCategory="listCategory" />
    <popup-delete :idDelete="idDelete" @load="loadData"/>
  </div>
</template>
<script lang="ts">
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import UnitItem from './unit/UnitItem.vue'
  import PopupCreateCategory from './popup/PopupCreateCategory.vue'
  import PopupEditCategory from './popup/PopupEditCategory.vue'
  import getRepository from '@/services'
  import { NftRepository } from '@/services/repositories/nft'
  import PopupDelete from './popup/PopupDelete.vue'
  @Component({
    components: {
      UnitItem,
      PopupCreateCategory,
      PopupEditCategory,
      PopupDelete
    }
  })
  export default class TabCategory extends PopupMixin {
    @Prop() listCategory!: any
    dataList = []
    isLoading = false
    tabActive = 'ACTIVE'
    dataDetail: Record<string, unknown> = {}
    isSearch = false
    locationId = 0
    parentIdProp: any = null
    idArea = ''
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    categoryIds: any = []
    idCategory: any = null
    idDelete: any = null
    type = 'delete-category'
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    editItem(data: Record<string, any>) {
      this.dataDetail = data
      // console.log('row1', data)
    }
    detailItem(data: Record<string, any>): void {
      this.dataDetail = data
      this.idCategory = data.id
    }
    createItem(data: Record<string, any>): void {
      console.log('thanh', data)
      this.parentIdProp = data
      console.log(this.parentIdProp)
      // console.log('idParent',id)
    }
    deleteItem(data: Record<string, any>): void {
      this.idDelete = data.id
      console.log('>>>data', data)
      console.log(this.idDelete)
      this.$emit('delete-category', data.id)
    }
    handleDelete(): void {
      this.$emit('delete')
    }
    handleCreate(): void {
      this.$emit('create')
    }
    handleEdit(): void {
      this.$emit('edit')
    }
    getIdArea(id: string): void {
      this.idArea = id
    }
    loadData(): void {
      // location.reload()
      // this.isShowExpand = false
      // this.paginitInfo.parentId = 0
      this.$emit('load')
    }
  }
</script>
<style scoped lang="scss">
  .main {
    // min-height: 200px;
    height: calc(100vh - 340px) !important;
    padding-bottom: 20px;
    .title {
      font-size: 14px;
      font-weight: 500;
      height: 40px;
      line-height: 40px;
      text-transform: uppercase;
      border-bottom: 1px solid #dbdbdb;
      padding-left: 45px;
      display: flex;
      align-items: center;
      .group-code {
        width: 112px;
      }
      .group-member {
        width: 120px;
        text-align: end;
      }
      .group-placeholder {
        width: 182px;
      }
    }
  }
  .wallet-table {
    &__below {
      padding: 0 24px;
      .wrapper {
        display: flex;
        flex-wrap: wrap;
        //display: grid;
        //grid-template-columns: repeat(auto-fit, minmax(261px, 1fr));
        //grid-column-gap: 20px;
        // eslint-disable-next-line prettier/prettier
        //grid-row-gap: 24px;
        .group-name {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          color: var(--bc-table-text-color);
          padding-bottom: 12px;
          padding-left: 20px;
          padding-top: 12px;
          border-bottom: 1px solid #dbdbdb;
          text-transform: uppercase;
          margin-left: 24px;
        }
      }
    }
  }
</style>
