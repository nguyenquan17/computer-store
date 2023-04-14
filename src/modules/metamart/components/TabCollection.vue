<template>
  <div class="w-100 bg-white wallet-table">
    <div class="wallet-table__below">
      <div class="wrapper">
        <!-- <div v-for="dataCollection in data"
             :key="dataCollection.id"
             class="grid-data"
        >
          <card-collection :data="dataCollection" />
        </div> -->
        <base-table :data="data" :paginationInfo="getPaginationInfo" :table="query" @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" class="collection-table">
          <el-table-column label="#" type="index" :index="indexMethod" align="center" width="40" />
          <el-table-column :label="$t('metamart.table.collection')" align="left" min-width="387">
            <template slot-scope="scope">
              <div class="wrap-item">
                <img :src="scope.row.avatar" alt="" class="item-img" width="40px" height="40px" />
                <p>{{ scope.row.collectionName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('metamart.table.category')" align="left" width="270">
            <template slot-scope="scope">
              <p>{{ scope.row.categoryName }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('metamart.table.network')" align="left" width="130">
            <template slot-scope="scope">
              <div class="item-text">
                <p class="item-text__name">{{ scope.row.networkName }}</p>
                <p class="item-text__code">{{ scope.row.network }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('metamart.table.creator')" align="left" width="200">
            <template slot-scope="scope">
              <div class="item-text">
                <p class="item-text__name">{{ scope.row.creatorName }}</p>
                <p class="item-text__code">{{ scope.row.creatorUsername }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPemission('NFT', ['all-action-nft'])" align="center" width="86">
            <template slot-scope="scope">
              <div class="action">
                <span @click="handleEdit(scope.row)">
                  <base-icon icon="icon-edit" size="24" />
                </span>
                <span @click="handleDelete(scope.row)">
                  <base-icon icon="icon-delete-new" size="22" />
                </span>
              </div>
            </template>
          </el-table-column>
        </base-table>
      </div>
    </div>
    <popup-edit-collection :editData="editData" />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  // import CardCollection from "@/modules/metamart/components/CardCollection.vue";
  // import BasePagination from "@/components/base/pagination/BasePagination.vue";
  import PopupEditCollection from './popup/PopupEditCollection.vue'
  import PopupDelete from './popup/PopupDelete.vue'
  import { PaginationInterface } from '@/interface'
  import PopupMixin from '@/mixins/popup'
  import { NftRepository } from '@/services/repositories/nft'
  import getRepository from '@/services'

  const apiNft: NftRepository = getRepository('nft')

  @Component({
    components: { PopupEditCollection, PopupDelete }
  })
  export default class TabCollection extends Mixins(PopupMixin) {
    //Props
    // @Prop({ required: false, type: Boolean, default: true }) showPagination!: boolean
    // @Prop({ required: false, type: String, default: '' }) paginationInfo!: string
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @Prop({
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    })
    query!: PaginationInterface

    deleteData: Record<string, any> = {}
    editData: Record<string, any> = {}

    get getPaginationInfo(): any {
      //@ts-ignore
      if (this.query.total > 1) {
        return this.$t('paging.collections')
      } else {
        return this.$t('paging.collection')
      }
    }

    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleSizeChange(value: number): void {
      this.query.limit = value
      this.query.page = 1
      this.$emit('sizeChange', value)
    }
    handleCurrentChange(value: number): void {
      this.query.page = value
      this.$emit('pageChange', value)
    }
    async handleEdit(row: any): Promise<any> {
      console.log('Edit Clicked:', row)

      await this.getDetailCollection(row.id)

      this.setOpenPopup({
        popupName: 'popup-edit-collection',
        isOpen: true
      })
    }

    async getDetailCollection(id: any): Promise<any> {
      await apiNft
        .getDetailCollection(id)
        .then((res: any) => {
          console.log('RES COLLECTION: ', res)
          this.editData = res.data
        })
        .catch(e => {
          console.log(e)
        })
    }

    async handleDelete(row: any): Promise<any> {
      console.log('Delete Clicked:', row)
      this.$emit('delete', row)
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

  .wallet-table {
    &__below {
      padding: 0 24px;
      .wrapper {
        display: flex;
        flex-wrap: wrap;
        //display: grid;
        //grid-template-columns: repeat(auto-fit, minmax(261px, 1fr));
        //grid-column-gap: 20px;
        //grid-row-gap: 24px;
        .grid-data {
          width: calc(25% - 15px);
          margin: 24px 20px 0 0;
        }
        .grid-data:nth-child(-n + 4) {
          margin-top: 0;
        }
        .grid-data:nth-child(4n) {
          margin-right: 0;
        }
        .collection-table {
          .wrap-item {
            display: flex;
            align-items: center;
            gap: 8px;
            .item-img {
              border-radius: 4px;
              object-fit: cover;
            }
          }
          .item-text {
            &__name {
              @include text(16px, 24px, 400, #0a0b0d);
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &__code {
              @include text(14px, 20px, 400, #5b616e);
            }
          }
          .action {
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
    .custom-pagination {
      padding: 10px 0;
      margin: 24px 24px 0 24px;
    }
  }
</style>
