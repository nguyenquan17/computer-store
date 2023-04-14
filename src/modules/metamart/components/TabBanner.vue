<template>
  <div class="banner w-100 bg-white">
    <base-table
      :data="listBanners"
      :showPagination="true"
      :paginationInfo="$t('metamart.banner.table.pagination-info')"
      :table="table"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      class="banner-table"
    >
      <!-- @rowClick="handleRowClick" -->
      <!-- @selectionChange="handleSelectionChange" -->
      <el-table-column label="#" type="index" align="center" width="40" :index="indexMethod" />
      <!-- <el-table-column type="selection" :selectable="handleSelectable" align="center" width="40" /> -->
      <el-table-column label="banner" width="400" align="left">
        <template slot-scope="sc">
          <p class="banner-table__name">{{ sc.row.objectName }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('metamart.banner.table.link')" width="350" align="left">
        <template slot-scope="sc">
          <a class="banner-table__link" :title="sc.row.objectUrl !== null ? sc.row.objectUrl : ''" :href="sc.row.objectUrl !== null ? sc.row.objectUrl : '#'" target="_blank">{{
            sc.row.objectUrl !== null ? sc.row.objectUrl : ''
          }}</a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('metamart.banner.table.position')" width="165" align="right">
        <template slot-scope="sc">
          <span class="banner-table__position">{{ sc.row.objectPosition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" align="right">
        <template v-if="checkPemission('NFT', ['all-action-nft'])" slot-scope="sc">
          <div class="banner-table__actions">
            <base-icon icon="icon-edit" size="20" class="cursor banner-table__actions--edit" @click.native.stop="handleEdit(sc.row)" />
            <base-icon icon="icon-delete-new" size="20" class="cursor banner-table__actions--del" @click.native.stop="openDeleteBanner(sc.row)" />
          </div>
        </template>
      </el-table-column>
    </base-table>
    <popup-delete-banner :banner="bannerDelete" @confirm="openVerifyEmail" />
    <popup-verify-email @submit="handleSubmitCode" />
  </div>
</template>
<script lang="ts">
  import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator'
  import { NftRepository } from '@/services/repositories/nft'
  import getRepository from '@/services'
  import EventBus from '@/utils/eventBus'
  import PopupDeleteBanner from '@/modules/metamart/components/popup/PopupDeleteBanner.vue'
  import PopupMixin from '@/mixins/popup'
  import PopupVerifyEmail from '@/modules/metamart/components/popup/PopupVerifyEmail.vue'
  import { namespace } from 'vuex-class'
  const beAuth = namespace('beAuth')
  const apiNft: NftRepository = getRepository('nft')
  @Component({
    components: {
      PopupDeleteBanner,
      PopupVerifyEmail
    }
  })
  export default class TabBanner extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object }) filter!: Record<string, any>
    @beAuth.State('user') userInfo!: Record<string, any>
    bannerDelete: Record<string, any> = {}
    bannerId!: number
    verifyCode = ''
    query = {
      page: 1,
      limit: 10,
      search: '',
      orderBy: 'POSITION',
      orderType: 'ASC'
    }
    table = {
      page: 1,
      limit: 10,
      total: 0
    }
    listBanners: Array<Record<string, any>> = []
    @Watch('filter', { deep: true }) watchFilter(): void {
      this.handleFilter()
    }
    created(): void {
      this.getListBanners()
      EventBus.$on('banner-completed', this.handleReload)
      EventBus.$on('delete-in-popup', this.openDeleteBanner)
    }

    destroyed(): void {
      EventBus.$off('banner-completed')
      EventBus.$off('delete-in-popup')
    }

    indexMethod(index: number): number {
      return (this.query.page - 1) * this.query.limit + index + 1
    }
    handleFilter(): void {
      this.query = {
        ...this.query,
        ...this.filter
      }
      this.getListBanners()
    }
    async getListBanners(): Promise<void> {
      try {
        const rs = await apiNft.getListBanners(this.query)
        this.listBanners = rs.content
        this.table.total = rs.totalElements
      } catch (error) {
        console.log(error)
      }
    }
    handleSizeChange(payload: number): void {
      this.query = {
        ...this.query,
        limit: payload,
        page: 1
      }
      this.table = {
        ...this.table,
        limit: payload,
        page: 1
      }
      this.getListBanners()
    }
    handleCurrentChange(payload: number): void {
      this.query = {
        ...this.query,
        page: payload
      }
      this.table = {
        ...this.table,
        page: payload
      }
      this.getListBanners()
    }
    handleEdit(payload: Record<string, any>): void {
      this.$emit('edit', {
        popupName: 'popup-banner',
        banner: payload
      })
    }
    handleReload(): void {
      // this.query = {
      //   page: 1,
      //   limit: 10,
      //   search: '',
      //   orderBy: 'NAME',
      //   orderType: 'ASC'
      // }
      this.table = {
        ...this.table,
        page: 1,
        limit: 10
      }
      this.getListBanners()
    }
    openDeleteBanner(banner: Record<string, any>): void {
      this.bannerDelete = banner
      this.setOpenPopup({
        popupName: 'popup-delete-banner',
        isOpen: true
      })
    }
    openVerifyEmail(): void {
      this.bannerId = this.bannerDelete.id
      this.bannerDelete = {}
      this.setOpenPopup({
        popupName: 'popup-metamart-verify-email',
        isOpen: true
      })
    }
    handleSubmitCode(payload: string): void {
      this.verifyCode = payload
      this.handleDeleteBanner()
    }
    async handleDeleteBanner(): Promise<void> {
      const params = {
        verificationCode: this.verifyCode,
        type: 'EMAIL',
        email: this.userInfo.email
      }
      try {
        const rs = await apiNft.deleteBanner(this.bannerId, params)
        this.$message({
          message: '' + this.$i18n.t('metamart.banner.delete-success'),
          duration: 3500,
          type: 'success'
        })
        this.setOpenPopup({
          popupName: 'popup-metamart-verify-email',
          isOpen: false
        })
        this.handleReload()
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
<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    font-weight: $weight;
    line-height: $height;
    color: $color;
  }
  ::v-deep.banner {
    padding: 0 24px;
    &-table {
      .el-table__row {
        height: 64px;
      }
      &__name,
      &__position {
        @include text(16px, 24px, 400, #0a0b0d);
      }
      &__link {
        display: block;
        @include text(16px, 24px, 400, #2e89ff);
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 24px;
        white-space: nowrap;
        text-decoration: none;
      }
      &__actions {
        &--edit,
        &--del {
          display: inline-block;
          margin-right: 16px;
        }
        &--del {
          margin-right: 6px;
        }
      }
    }
  }
</style>
