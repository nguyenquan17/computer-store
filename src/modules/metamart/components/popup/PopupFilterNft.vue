<!-- eslint-disable prettier/prettier -->
<template>
  <base-popup name="popup-filter-nft" class="popup-filter-collection" width="600px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('metamart.nft.filter.title') }}</span>
    </div>
    <div class="content">
    <div class="content-block">
      <p class="content-block__title">{{ $t('metamart.nft.filter.collection') }}</p>
      <el-select 
        v-model="filterNft.collectionId" 
        :placeholder="$t('metamart.nft.filter.collection')"
        filterable
        remote
        :remote-method="remoteCollectionList"
      >
        <div v-infinite-scroll="loadMoreCollection" infinite-scroll-delay="500">
          <el-option v-for="(option, index) in collections" :label="option.collectionName" :value="option.id" :key="index"></el-option>
        </div>
      </el-select>
    </div>
     <div class="content-block">
        <p class="content-block__title">{{ $t('metamart.nft.filter.creator') }}</p>
        <el-select 
          v-model="filterNft.creatorId" 
          :placeholder="$t('metamart.nft.filter.creator')" 
          class="select-prefix-icon"
          filterable
          remote
          :remote-method="remoteCreatorList"
        >
          <template slot="prefix">
            <div class="select-icon">
              <base-icon icon="logo-login" size="14" />
            </div>
          </template>
          <div v-infinite-scroll="loadMoreCreator" infinite-scroll-delay="500">
            <el-option v-for="(option, index) in creators" :label="`${option.accountName} (${option.username})`" :value="option.id" :key="index">
              <template>
                <div class="be-flex wallet-item">
                  <span style="margin-left: 10px">{{ option.accountName }}</span>
                  <span style="margin-left: 4px">({{ option.username }})</span>
                </div>
              </template>
            </el-option>
          </div>
        </el-select>
      </div>
      <div class="content-block">
        <p class="content-block__title">{{ $t('metamart.nft.filter.category') }}</p>
        <el-select 
          filterable
          remote
          :remote-method="remoteCategoryList"
          v-model="filterNft.categoryId" 
          :placeholder="$t('metamart.nft.filter.category')"
        >
          <el-option 
            v-for="(option, index) in categories" 
            :label="option.categoryName" 
            :value="option.id" 
            :key="index"
            :style="{ 'margin-left': `${(option.levelDepth ? option.levelDepth : 0) * 15}px` }"
          >
          </el-option>
        </el-select>
      </div>

      <div class="content-block">
        <p class="content-block__title">{{ $t('metamart.nft.filter.network') }}</p>
        <el-select v-model="filterNft.networkName" :placeholder="$t('metamart.nft.filter.network')">
          <el-option v-for="(option, index) in networks" :label="option.networkName" :value="option.networkName" :key="index"></el-option>
        </el-select>
      </div>
      <div class="content-block">
        <p class="content-block__title">{{ $t('metamart.nft.filter.status') }}</p>
        <el-select v-model="filterNft.statusBlockchain" :placeholder="$t('metamart.nft.filter.status')">
          <el-option v-for="(option, index) in status" :label="option.label" :value="option.value" :key="index"></el-option>
        </el-select>
      </div>
      <div class="content-block">
        <p class="content-block__title">{{ $t('metamart.nft.filter.created-date') }}</p>
        <div class="content-block__inputs">
          <el-date-picker
            :placeholder="$t('metamart.nft.filter.from-date')"
            format="MM/dd/yyyy"
            value-format="timestamp"
            v-model="filterNft.fromCreatedAt"
            prefix-icon="el-icon-date"
            type="date"
            class="input-small"
            :picker-options="pickerOption2"
          ></el-date-picker>
          <span style="display: block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
          <el-date-picker
            :placeholder="$t('metamart.nft.filter.to-date')"
            format="MM/dd/yyyy"
            value-format="timestamp"
            v-model="filterNft.toCreatedAt"
            prefix-icon="el-icon-date"
            type="date"
            class="input-small"
            :picker-options="pickerOption"
          ></el-date-picker>
        </div>
      </div>
    </div>
   

    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleReset">{{ $t('metamart.button.reset') }}</el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" @click="handleApply">{{ $t('metamart.button.apply') }}</el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import EventBus from '@/utils/eventBus'

  @Component
  export default class PopupFilterNft extends Mixins(PopupMixin) {
    @Prop() collections: any
    @Prop() creators: any
    @Prop() categories: any
    @Prop() networks: any

    @Watch('$route', { immediate: true, deep: true })
    onUrlChange() {
      this.filterNft = {
        collectionId: '',
        creatorId: '',
        categoryId: '',
        networkName: '',
        statusBlockchain: '',
        fromCreatedAt: '',
        toCreatedAt: '',
      }
    }

    get pickerOption(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'from-to')
        }
      }
    }
    get pickerOption2(): any {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this
      return {
        disabledDate(time: Date) {
          return _this.disableTime(time, 'to-from')
        }
      }
    }
    disableTime(time: Date, type: string): any {
      if (type === 'from-to') {
        if (this.filterNft.fromCreatedAt) {
          return time.getTime() / 1000 < new Date(this.filterNft.fromCreatedAt).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.filterNft.toCreatedAt) {
          return time.getTime() / 1000 > new Date(this.filterNft.toCreatedAt).getTime() / 1000
        }
      }
    }

    status = [
      {label: 'On-chain', value: 'ON_CHAIN'},
      {label: 'Off-chain', value: 'OFF_CHAIN'},
    ]

    filterNft = {
      collectionId: '',
      creatorId: '',
      categoryId: '',
      networkName: '',
      statusBlockchain: '',
      fromCreatedAt: '',
      toCreatedAt: '',
    }

    handleClose(): void {
      this.$emit('reset-query')
      this.setOpenPopup({
        popupName:'popup-filter-nft',
        isOpen: false
      })
    }

    handleReset(): void {
      this.filterNft = {
        collectionId: '',
        creatorId: '',
        categoryId: '',
        networkName: '',
        statusBlockchain: '',
        fromCreatedAt: '',
        toCreatedAt: '',
      }
      EventBus.$emit('filter', this.filterNft)
      this.handleClose()
    }

    handleApply(): void {
      let fromDate = ''
      let toDate = ''
      if (this.filterNft.fromCreatedAt) {
        fromDate = this.$options.filters?.formatReferral(this.filterNft.fromCreatedAt)
      }
      if (this.filterNft.toCreatedAt) {
        toDate = this.$options.filters?.formatReferral(this.filterNft.toCreatedAt + 86399000)
      }
      this.filterNft = {
        ...this.filterNft,
        //@ts-ignore
        // network: this.filterNft.network.match(/\(([^)]+)\)/)[1],
        fromCreatedAt: fromDate,
        toCreatedAt: toDate
      }
      EventBus.$emit('filter', this.filterNft)
      this.handleClose()
    }

    //Collection
    remoteCollectionList(query: string): void {
      this.$emit("remote-collection", query)
    }
    loadMoreCollection(): void {
      this.$emit('load-more-collection')
    }

    //Creator
    remoteCreatorList(query: string): void {
      this.$emit("remote-creator", query)
    }
    loadMoreCreator(): void {
      this.$emit('load-more-creator')
    }

    //Category
    remoteCategoryList(query: string): void {
      this.$emit('remote-category', query)
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
  ::v-deep.popup-filter-collection {
    .content {
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content-block {
          .el-input__inner {
            width: 256px;
          }
          &:last-child {
            .content-block__label {
              padding-left: 20px;
            }
            .content-block__wrap {
              text-align: right;
            }
          }
        }
      }
      &-block {
        width: 100%;
        height: auto;
        margin-bottom: 24px;
        .el-select {
          width: 100%;
          .el-input__inner {
            @include text(16px, 24px, 400, #0a0b0d);
            height: 48px;
          }
        }
        .el-date-editor {
          .el-input__inner {
            height: 48px;
          }
        }
        .input-error {
          .el-input__inner {
            border-color: #cf202f;
          }
        }
        &__title {
          @include text(14px, 20px, 400, #0a0b0d);
          margin-bottom: 8px;
        }
        .select-icon {
          margin-left: 8px;
          width: 24px;
          height: 24px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          background-color: var(--bc-bg-neutral);
          .span-icon {
            vertical-align: middle;
          }
        }
        .select-prefix-icon {
          .el-input__inner {
            padding-left: 44px;
          }
        }
        &__alert {
          margin-top: 4px;
          @include text(14px, 20px, 400, #cf202f);
        }
        &__inputs {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .el-input {
            width: 256px;
            .el-input__inner {
              width: 100%;
              font-size: 16px;
            }
          }
          .delimiter {
            width: 8px;
            height: 2px;
            background-color: #dbdbdb;
          }
        }
      }
    }
  }
</style>
