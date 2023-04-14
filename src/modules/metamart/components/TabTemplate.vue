<!-- eslint-disable prettier/prettier -->
<template>
  <div class="w-100 bg-white template">
    <base-table
      :data="nftTemplate"
      :showPagination="true"
      :paginationInfo="paginationInfo"
      :table="table"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      class="template-table"
      @rowClick="handleRowClick"
    >
      <el-table-column label="#" type="index" :index="indexMethod" align="center" width="40" />
      <el-table-column :label="$t('metamart.template.template')" width="470" align="left">
        <template slot-scope="sc">
          <p class="template-name">{{ sc.row.templateName }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('metamart.template.created-at')" width="470" align="left">
        <template slot-scope="sc">
          <p class="created-date">{{ sc.row.createdAt | formatMMDDYY }}</p>
        </template>
      </el-table-column>
      <el-table-column label="" align="right">
        <template v-if="checkPemission('NFT', ['all-action-nft'])" slot-scope="sc">
          <div class="actions">
            <base-icon icon="icon-copy" size="20" class="cursor" @click.native.stop="handleCopy(sc.row.id, sc.row.templateName)" />
            <base-icon icon="icon-edit" size="20" class="cursor" @click.native.stop="handleEdit(sc.row.id, sc.row.templateName)" />
            <base-icon icon="icon-delete-new" size="20" class="cursor" @click.native.stop="openDelete(sc.row)" />
          </div>
        </template>
      </el-table-column>
    </base-table>
    <popup-delete-template :template="templateActive" @confirm="openSendCode" />
    <popup-verify-email @submit="handleSubmitCode" />
  </div>
</template>
<script lang="ts">
  import { Component, Watch, Prop, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupDeleteTemplate from '../components/template/popup/PopupDeleteTemplate.vue'
  import PopupVerifyEmail from '@/modules/metamart/components/popup/PopupVerifyEmail.vue'
  import { PaginationInterface } from '@/interface'
  import { NftRepository } from '@/services/repositories/nft'
  import getRepository from '@/services'
  const apiNft: NftRepository = getRepository('nft')
  @Component({
    components: {
      PopupDeleteTemplate,
      PopupVerifyEmail
    }
  })
  export default class TabTemplate extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: '' }) keyword!: string
    templateId!: number
    verifyCode = ''
    templateActive: Record<string, any> = {}
    paginationInfo = ''
    query: Record<string, any> = {
      search: '',
      page: 1,
      limit: 10
    }
    table: Record<string, any> = {
      page: 1,
      limit: 10,
      total: 0
    }
    nftTemplate: Array<Record<string, any>> = []
    @Watch('keyword') watchKeyWord(): void {
      this.query.search = this.keyword
      this.getListNftTemplate()
    }
    created(): void {
      this.paginationInfo = '' + this.$i18n.t('metamart.template.pagination-info')
      this.getListNftTemplate()
    }
    async getListNftTemplate(): Promise<void> {
      const params = {
        ...this.query
      }
      try {
        const rs = await apiNft.getListNftTemplate(params)
        this.nftTemplate = rs.content
        this.table.total = rs.totalElements
      } catch (error) {
        console.log(error)
      }
    }
    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleSizeChange(value: number): void {
      this.query.limit = value
      this.query.page = 1
      this.getListNftTemplate()
    }

    handleCurrentChange(value: number): void {
      this.query.page = value
      this.getListNftTemplate()
    }
    handleRowClick(payload: Record<string, any>): void {
      if (this.checkPemission('NFT', ['all-action-nft'])) {
        this.$router.push({ name: 'CreateTemplate', query: { id: '' + payload.row.id, status: 'EDIT', template: payload.row.templateName } })
      }
    }
    handleCopy(templateId: number, templateName: string): void {
      this.$emit('dup', {
        templateId,
        templateName
      })
    }
    handleEdit(templateId: number, templateName: string): void {
      this.$router.push({ name: 'CreateTemplate', query: { id: '' + templateId, status: 'EDIT', template: templateName } })
    }
    openDelete(template: Record<string, any>): void {
      this.templateActive = template
      this.setOpenPopup({
        popupName: 'popup-delete-template',
        isOpen: true
      })
    }
    openSendCode(): void {
      this.templateId = this.templateActive.id
      this.templateActive = {}
      this.setOpenPopup({
        popupName: 'popup-metamart-verify-email',
        isOpen: true
      })
    }
    handleSubmitCode(payload: string): void {
      this.verifyCode = payload
      this.handleDelete()
    }
    async handleDelete(): Promise<void> {
      try {
        await apiNft.deleteNftTemplate(this.templateId, this.verifyCode)
        this.$message({
          message: '' + this.$i18n.t('metamart.template.delete-success'),
          duration: 3500,
          type: 'success'
        })
        this.setOpenPopup({
          popupName: 'popup-metamart-verify-email',
          isOpen: false
        })
        this.getListNftTemplate()
      } catch (error: any) {
        if (error.statusCode === 400) {
          switch (error.status) {
            case 'INVALID_VERIFICATION':
              this.$message({
                message: '' + this.$i18n.t('metamart.banner.delete-invalid-code'),
                duration: 3500,
                type: 'error'
              })
              break
            case 'EXPIRED_VERIFICATION':
              this.$message({
                message: '' + this.$i18n.t('metamart.banner.delete-expired-code'),
                duration: 3500,
                type: 'error'
              })
              break
            case 'USER_LOCKED':
              this.$message({
                message: '' + this.$i18n.t('metamart.banner.delete-locked'),
                duration: 3500,
                type: 'error'
              })
              this.$router.push({ name: 'login' })
              break
          }
        }
        console.log(error)
      }
    }
  }
</script>

<style scoped lang="scss">
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    font-weight: $weight;
    line-height: $height;
    color: $color;
  }
  ::v-deep.template {
    padding: 0 24px 24px;
    &-table {
      tr.el-table__row {
        height: 64px;
      }
      .template-name,
      .created-date {
        @include text(16px, 24px, 400, #0a0b0d);
      }
      .actions {
        .span-icon {
          display: inline-block;
          margin-left: 16px;
        }
      }
    }
  }
</style>
