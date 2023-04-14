<template>
  <div style="width: 100%; background-color: #ffffff; text-align: center">
    <div class="w-100 bg-white wallet-table">
      <div class="wallet-table__below">
        <div class="wrapper">
          <base-table
            :data="data"
            :paginationInfo="getPaginationInfo"
            :table="query"
            @selectionChange="handleSelectionChange"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
            class="collection-table"
            @rowClick="handleRowClick"
          >
            <el-table-column label="#" type="index" :index="indexMethod" align="center" width="50" />
            <!-- <el-table-column type="selection" :selectable="handleSelectable" align="center" width="40" /> -->
            <el-table-column :label="$t('inventory.table.item')" align="left" min-width="347">
              <template slot-scope="scope">
                <div class="wrap-item">
                  <img :src="scope.row.thumb" alt="" class="item-img" width="40px" height="40px" />
                  <div class="item-text">
                    <p class="item-text__name">{{ scope.row.itemName }}</p>
                    <p class="item-text__code">#{{ scope.row.itemCode }}</p>
                  </div>
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
            <el-table-column :label="$t('inventory.table.status')" align="center" width="200">
              <template slot-scope="scope">
                <div v-if="scope.row.isOnChain === 'NO'" class="box-status-table locked">
                  <span class="fs-12 fw-500">Off-chain</span>
                </div>
                <div v-else class="box-status-table">
                  <span class="fs-12 fw-500">On-chain</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="checkPemission('NFT', ['all-action-nft'])" align="center" width="86">
              <template slot-scope="scope">
                <div class="action">
                  <span @click="handleEdit(scope.row)">
                    <base-icon icon="icon-edit" size="24" />
                  </span>

                  <span @click.stop="handleDelete(scope.row)">
                    <base-icon icon="icon-delete-new" size="22" />
                  </span>
                  <!-- <el-dropdown trigger="click" @command="handleCommand">
                    <i class="el-icon-more" style="padding: 5px" @click="handleConflictClick"></i>
                    <el-dropdown-menu class="dropdown-sort" slot="dropdown">
                      <el-dropdown-item>Update metadata</el-dropdown-item>
                      <el-dropdown-item>{{ scope.row.isOnChain === 'NO' ? 'On-chain' : 'Off-chain' }}</el-dropdown-item>
                      <el-dropdown-item command="delete-nft">Delete</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
                </div>
              </template>
            </el-table-column>
          </base-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
  import BasePagination from '@/components/base/pagination/BasePagination.vue'
  import { PaginationInterface } from '@/interface'
  import PopupMixin from '@/mixins/popup'

  @Component({
    components: { BasePagination }
  })
  export default class TabNFT extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @Prop({ required: false, type: Boolean, default: true }) showPagination!: boolean
    @Prop({ required: false, type: String, default: '' }) paginationInfo!: string
    @Prop({
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    })
    query!: PaginationInterface

    isConflictClick = false
    deleteData: Record<string, any> = {}

    get getPaginationInfo(): any {
      //@ts-ignore
      if (this.query.total > 1) {
        return this.$t('paging.NFTs')
      } else {
        return this.$t('paging.NFT')
      }
    }

    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleSelectable(row: Record<string, any>) {
      if (row.isOnChain === 'YES') {
        return false
      } else {
        return true
      }
    }
    handleSelectionChange(value: Array<Record<string, any>>) {
      console.log('selected,', value)
      this.$emit('selectionChange', value)
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
    handleCommand(command: string): void {
      this.$emit('selectCommand', command)
    }
    handleRowClick(row: Record<string, any>): void {
      if (this.isConflictClick) {
        this.isConflictClick = false
        return
      }
      this.$emit('rowClick', row.row)
      console.log(row)
    }
    handleEdit(row: Record<string, any>): void {
      this.isConflictClick = true
      this.$emit('edit', row)
    }
    handleDelete(row: Record<string, any>): void {
      this.$emit('delete', row)
      // console.log("Delete click", row);
      // this.deleteData = {
      //   id: row.itemId,
      //   itemName: row.itemName
      // }
      // this.setOpenPopup({
      //   popupName: 'popup-metamart-delete',
      //   isOpen: true
      // })
    }
    handleConflictClick(row: Record<string, any>): void {
      this.isConflictClick = true
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
  ::v-deep.wallet-table {
    .el-checkbox__inner {
      width: 18px;
      height: 18px;
    }
    .el-checkbox__inner::after {
      width: 5px;
      margin-left: 1px;
      margin-top: 1px;
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      margin-top: 2px;
    }
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
          .box-status-table {
            width: 80px;
            height: 24px;
            background: #e4f9e2;
            color: #129961;
            border-radius: 4px;
            margin: 0 auto;
          }
          .locked {
            background: #f3f2f1;
            color: #5b616e;
          }
        }
      }
    }
  }
  .custom-pagination {
    padding: 10px 0px;
    margin: 24px 24px 0 24px;
  }
</style>
