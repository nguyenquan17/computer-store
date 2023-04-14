<template>
  <div class="tab-map">
    <base-table :data="data" :showPagination="false" :key="key">
      <el-table-column :label="$t('label_nft-name')" prop="metaName">
        <template slot-scope="scope">
          <p>{{ scope.row.metaName }}</p>
          <p class="nft-body-small text-desc" v-if="scope.row.metaAnnotation">({{ scope.row.metaAnnotation }})</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('label_long-desc')" prop="metaValue" align="right"> </el-table-column>
      <el-table-column align="right" width="100px">
        <template slot-scope="scope">
          <span @click="handleCallAction('edit', scope.row)">
            <base-icon icon="icon-edit" size="20" />
          </span>
          <span style="padding-left: 16px" @click="handleCallAction('delete', scope.row)">
            <base-icon icon="icon-delete-2" size="20" />
          </span>
        </template>
      </el-table-column>
      <div class="append" slot="append">
        <div class="be-flex align-center cursor" @click="handleClickAdd">
          <base-icon icon="icon-add-circle" size="40" />
          <span class="text-hyperlink text-sm" style="padding-left: 12px">{{ $t('label_add-policy') }}</span>
        </div>
      </div>
    </base-table>
    <popup-add-map
      :typePopup="typePopup"
      :idTabActive="idTabActive"
      :rowCurrent="rowCurrent"
      @confirmDelete="handleCallAction('delete', rowCurrent)"
      @confirm="handleConfirm"
      @edit="handleEdit"
    />
    <popup-delete :rowCurrent="rowCurrent" :tabActive="tabActive" @delete="handleDelete" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
  import filter from 'lodash/filter'
  import findIndex from 'lodash/findIndex'

  import PopupMixin from '@/mixins/popup'
  import PopupAddMap from './PopupAddMap.vue'
  import PopupDelete from './PopupDelete.vue'

  import { namespace } from 'vuex-class'
  import { IMetaMap } from '../../interface'
  import uniqueId from 'lodash/uniqueId'
  const bcNft = namespace('bcNft')

  @Component({ components: { PopupAddMap, PopupDelete } })
  export default class TabMap extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number
    @Prop({ required: false, type: String, default: '' }) tabActive!: string

    @bcNft.State('metaDatas') metaDatas!: Array<Record<string, any>>
    @bcNft.Mutation('SET_LIST_METADATA') setListMetaData!: (list: Array<Record<string, any>>) => void

    data: Array<Record<string, any>> = []
    typePopup = 'add'
    rowCurrent: Record<string, any> = {}
    key = 0

    created(): void {
      this.data = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
    }

    handleClickAdd(): void {
      this.typePopup = 'add'
      this.setOpenPopup({
        popupName: 'popup-add-map',
        isOpen: true
      })
    }

    handleCallAction(type: 'edit' | 'delete', row: Record<string, any>): void {
      this.rowCurrent = row
      this.typePopup = type
      if (type === 'edit') {
        this.setOpenPopup({
          popupName: 'popup-add-map',
          isOpen: true
        })
      } else {
        this.setOpenPopup({
          popupName: 'popup-setup-delete',
          isOpen: true
        })
      }
    }

    handleDelete(): void {
      const metaDatas = filter(this.metaDatas, elm => elm.id !== this.rowCurrent.id)
      this.setListMetaData(metaDatas)

      this.data = filter(this.data, elm => elm.id !== this.rowCurrent.id)
      this.$emit('update')
      this.setOpenPopup({
        popupName: 'popup-setup-delete',
        isOpen: false
      })
      this.setOpenPopup({
        popupName: 'popup-add-map',
        isOpen: false
      })
    }

    handleEdit(form: IMetaMap): void {
      const indexItemMetaData = findIndex(this.metaDatas, elm => elm.id === form.id)
      const indexItemData = findIndex(this.data, elm => elm.id === form.id)

      this.metaDatas[indexItemMetaData] = form
      this.data[indexItemData] = form
      this.key = Math.random()
      this.$emit('update')
    }

    handleConfirm(form: IMetaMap): void {
      const id = +uniqueId()
      this.metaDatas.push({ ...form, id, isAdd: true })
      this.data.push({ ...form, id, isAdd: true })
      this.$emit('update')
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.tab-map {
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    overflow: hidden;
    padding: 14px 16px 16px;
    .el-table {
      &__body-wrapper {
        display: flex;
        flex-direction: column-reverse;

        .el-table__row {
          td {
            height: 64px;
          }
        }

        .el-table__append-wrapper {
          .append {
            padding-left: 10px;
            height: 64px;
            line-height: 64px;
            border-bottom: 1px solid var(--bc-border-primary);
            &:hover {
              background-color: var(--bc-table-row-hover);
            }
          }
        }
      }
    }
  }
</style>
