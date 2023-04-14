<template>
  <div class="tab-boolean">
    <base-table :data="data" :showPagination="false" :key="key">
      <el-table-column label="#" type="index" width="56px" align="center" />
      <el-table-column :label="$t('label_nft-name')" prop="metaName"> </el-table-column>
      <el-table-column prop="status" align="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.metaValue" active-value="true" inactive-value="false" active-color="#129961"> </el-switch>
        </template>
      </el-table-column>
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
          <span class="text-hyperlink text-sm" style="padding-left: 12px">{{ getLabel }}</span>
        </div>
      </div>
    </base-table>
    <popup-add-feature
      :typePopup="typePopup"
      :rowCurrent="rowCurrent"
      :idTabActive="idTabActive"
      @confirm="handleConfirm"
      @edit="handleEdit"
      @confirmDelete="handleCallAction('delete', rowCurrent)"
    />
    <popup-delete :rowCurrent="rowCurrent" @delete="handleDelete" />
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
  import filter from 'lodash/filter'
  import findIndex from 'lodash/findIndex'
  import uniqueId from 'lodash/uniqueId'

  import PopupMixin from '@/mixins/popup'
  import PopupAddFeature from './PopupAddFeature.vue'
  import PopupDelete from './PopupDelete.vue'

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  @Component({ components: { PopupAddFeature, PopupDelete } })
  export default class TabBoolean extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number

    @bcNft.State('metaDatas') metaDatas!: Array<Record<string, any>>
    @bcNft.State('metaTypes') metaTypes!: Array<Record<string, any>>
    @bcNft.Mutation('SET_LIST_METADATA') setListMetaData!: (list: Array<Record<string, any>>) => void

    data: Array<Record<string, any>> = []
    typePopup = 'add'
    rowCurrent: Record<string, any> = {}
    key = 0

    get getLabel(): string {
      if (this.metaTypes.length) {
        const type = filter(this.metaTypes, elm => elm.metaTypeId === this.idTabActive)
        const language = localStorage.getItem('bc-lang') || ''
        const parseJson = JSON.parse(type[0].metaTypeName)
        return this.typePopup === 'add'
          ? this.$t('popup_add') + ' ' + (parseJson[language] as string).toLowerCase()
          : this.$t('popup_edit') + ' ' + (parseJson[language] as string).toLowerCase()
      }
      return ''
    }

    @Watch('idTabActive') changeTab(newTabId: number): void {
      this.data = filter(this.metaDatas, elm => elm.metaTypeId === newTabId)
      this.$emit('update')
    }

    created(): void {
      this.data = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
    }

    handleClickAdd(): void {
      this.typePopup = 'add'
      this.setOpenPopup({
        popupName: 'popup-add-feature',
        isOpen: true
      })
    }

    handleCallAction(type: 'edit' | 'delete', row: Record<string, any>): void {
      this.rowCurrent = row
      this.typePopup = type
      if (type === 'edit') {
        this.setOpenPopup({
          popupName: 'popup-add-feature',
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
        popupName: 'popup-add-feature',
        isOpen: false
      })
    }

    handleEdit(form: Record<string, any>): void {
      const indexItemMetaData = findIndex(this.metaDatas, elm => elm.id === form.id)
      const indexItemData = findIndex(this.data, elm => elm.id === form.id)

      this.metaDatas[indexItemMetaData] = form
      this.data[indexItemData] = form
      this.key = Math.random()
      this.$emit('update')
    }

    handleConfirm(form: Record<string, any>): void {
      const id = +uniqueId()
      this.metaDatas.push({ ...form, id, isAdd: true })
      this.data = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)
      this.$emit('update')
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.tab-boolean {
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
        .el-switch {
          height: 26px;
          line-height: 26px;
          &__core {
            width: 44px !important;
            height: 26px;
            border-radius: 40px;
            &::after {
              width: 22px;
              height: 22px;
            }
          }
        }
        .is-checked {
          .el-switch__core {
            &::after {
              margin-left: -23px;
            }
          }
        }

        .el-table__append-wrapper {
          .append {
            padding-left: 66px;
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
