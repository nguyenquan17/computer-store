<template>
  <div class="w-100 bo-request-nft">
    <div class="bg-white box-shadow" style="margin-bottom: 24px">
      <div class="bg-white wallet-header">
        <div class="be-flex align-center jc-space-between wallet-header__above">
          <div class="wallet-header__above-tabs be-flex">
            <div
              class="tab-item cursor"
              v-for="tab in tabsHeader"
              :key="tab.id"
              :class="$route.params.type === tab.type ? 'tab-active' : null"
              @click="handleChangeTabsHeader(tab)"
            >
              <span class="text-base">{{ tab.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <filter-request-nft @filter="handleFilter" />
      <table-request-nft :listRequest="listRequest" :query="query" @sizeChange="handleSizeChange" @pageChange="handleCurrentChange" @rowClick="handleRowClick" />

      <popup-filter-request-nft @filter="handleFilter" />
      <popup-request-nft-detail :detailRequest="detailRequest" @reload="getListRequestNft" />
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'

  import FilterRequestNft from '../components/FilterRequestNft.vue'
  import TableRequestNft from '../components/TableRequestNft.vue'
  import PopupFilterRequestNft from '../components/PopupFilterRequestNft.vue'
  import PopupRequestNftDetail from '../components/PopupRequestNftDetail.vue'

  import getRepository from '@/services'
  import { NftRepository } from '@/services/repositories/nft'
  import { IDetailRequestNft } from '@/interface'

  const apiNft: NftRepository = getRepository('nft')

  @Component({
    components: { FilterRequestNft, TableRequestNft, PopupFilterRequestNft, PopupRequestNftDetail }
  })
  export default class RequestNFT extends Mixins(PopupMixin) {
    tabsHeader: Array<Record<string, any>> = [
      {
        id: 2,
        title: this.$t('menu.pending'),
        type: 'pending'
      },
      {
        id: 3,
        title: this.$t('menu.processing'),
        type: 'processing'
      },
      {
        id: 4,
        title: this.$t('menu.completed'),
        type: 'completed'
      },
      {
        id: 5,
        title: this.$t('menu.cancelled'),
        type: 'cancelled'
      }
    ]

    detailRequest = {} as IDetailRequestNft

    query: Record<string, any> = {
      page: 1,
      limit: 20,
      status: 'PENDING',
      total: 0
    }
    listRequest: Array<Record<string, any>> = []

    created(): void {
      this.query.status = (this.$route.params.type as string).toUpperCase()
      this.getListRequestNft()
    }

    async getListRequestNft(): Promise<void> {
      const result = await apiNft.getListRequestNft(this.query)
      this.listRequest = result.content
      this.query.total = result.totalElements
    }

    handleFilter(filter: Record<string, any>): void {
      this.query = { ...this.query, ...filter, page: 1, limit: 20 }
      this.getListRequestNft()
    }

    handleChangeTabsHeader(tab: Record<string, any>): void {
      this.resetFilter()
      this.query.status = (tab.type as string).toUpperCase()
      this.$router.push({ name: 'RequestNFT', params: { type: tab.type } }).then(() => this.getListRequestNft())
    }

    handleSizeChange(limit: number): void {
      this.query.limit = limit
      this.getListRequestNft()
    }

    handleCurrentChange(page: number): void {
      this.query.page = page
      this.getListRequestNft()
    }

    resetFilter(): void {
      this.query = {
        page: 1,
        limit: 20,
        total: 0
      }
    }

    async handleRowClick(row: Record<string, any>): Promise<void> {
      const detail = await apiNft.getDetailRequestNft(row.id)
      this.detailRequest = detail.usedNftDetail
      this.detailRequest.emailContent = row.emailContent
      this.setOpenPopup({
        popupName: 'popup-request-nft-detail',
        isOpen: true
      })
    }
  }
</script>
<style scoped lang="scss">
  .bo-request-nft {
    color: var(--bc-text-primary);
    .box-content {
      // tab active
      .table {
        .box-table {
          padding: 24px;
          min-height: 240px;
          overflow-y: auto;
        }
      }
    }

    .wallet-header {
      &__above {
        border-bottom: 1px solid var(--bc-border-primary);
        &-tabs {
          .tab-item {
            padding: 16px 12px;
            position: relative;
            color: var(--bc-text-discript);
            &:hover {
              color: var(--bc-tab-active);
            }
          }
          .tab-active {
            color: var(--bc-tab-active);
            font-weight: 600;
            &::after {
              content: '';
              position: absolute;
              width: 100%;
              height: 2px;
              bottom: 0;
              left: 0;
              background-color: var(--bc-tab-active);
            }
          }
        }
      }
    }
  }
</style>
