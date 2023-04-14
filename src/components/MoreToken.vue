<template>
  <el-popover v-model="isOpen" placement="bottom" popper-class="popper-token-more" width="200" trigger="click">
    <div class="tab-item cursor" slot="reference">More...</div>
    <el-input v-model="search" class="input-search" placeholder="Search" @input="handleSearch"> </el-input>
    <div class="list-more-token">
      <div v-if="tabTokenMore.length">
        <div
          v-for="token in tabTokenMore"
          :key="token.id"
          :class="$route.params.token === token.currency ? 'tab-active' : null"
          class="token-more"
          @click="
            $emit('select', token)
            isOpen = false
          "
        >
          {{ token.currency }}
        </div>
      </div>
      <empty-block v-else />
    </div>
  </el-popover>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import { namespace } from 'vuex-class'
  import { IAssetToken } from '@/interface'
  import { debounce, filter, includes, trim } from 'lodash'
  import EmptyBlock from './base/empty/EmptyBlock.vue'
  const beBase = namespace('beBase')
  @Component({ components: { EmptyBlock } })
  export default class MoreToken extends Vue {
    @beBase.State('listAssetToken') listAssetToken!: IAssetToken[]

    isOpen = false
    search = ''
    tabTokenMore: IAssetToken[] = []
    originTabTokenMore: IAssetToken[] = []

    created(): void {
      this.tabTokenMore = filter(this.listAssetToken, token => !includes(['MAGIC', 'ETH', 'BNB', 'USDT', 'BUSD'], token.currency))
      this.originTabTokenMore = filter(this.listAssetToken, token => !includes(['MAGIC', 'ETH', 'BNB', 'USDT', 'BUSD'], token.currency))
    }

    handleSearch(value: string): void {
      this.searchText(trim(value).toLowerCase(), this)
    }

    searchText = debounce((value: string, _this: any) => {
      if (value) {
        _this.tabTokenMore = filter(_this.originTabTokenMore, token => token.currency.toLowerCase().includes(value) || token.currencyName.toLowerCase().includes(value))
      } else {
        _this.tabTokenMore = _this.originTabTokenMore
      }
    }, 500)
  }
</script>

<style lang="scss">
  .popper-token-more {
    padding: 12px 0;
    .input-search {
      padding: 0 20px;
    }
    .empty-block {
      padding: 0 !important;
      text-align: center;
      .span-icon {
        font-size: 70px !important;
      }
    }
  }
</style>

<style scoped lang="scss">
  .tab-item {
    padding: 16px 12px;
    position: relative;
    color: var(--bc-text-discript);
    font-size: 16px;
    line-height: 24px;
    &:hover {
      color: var(--bc-tab-active);
    }
  }

  .list-more-token {
    margin-top: 8px;
    max-height: 300px;
    overflow-y: auto;
    .token-more {
      cursor: pointer;
      color: var(--bc-text-discript);
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      padding: 0 20px;
      &:hover {
        color: var(--bc-tab-active);
      }
    }
    .tab-active {
      color: var(--bc-tab-active);
      font-weight: 600;
    }
  }
</style>
