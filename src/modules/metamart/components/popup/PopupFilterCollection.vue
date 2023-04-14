<template>
  <base-popup name="popup-filter-collection" class="popup-filter-collection" width="600px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{$t('metamart.collection.filter.filter')}}</span>
    </div>
    <div class="content">
      <div class="content-block">
        <p class="content-block__title">{{$t('metamart.collection.filter.creator')}}</p>
        <el-select 
          filterable
          remote
          :remote-method="remoteCreatorList"
          v-model="filterCollection.creatorId" 
          :placeholder="$t('metamart.collection.filter.creator')" 
          class="select-prefix-icon"
        >
          <el-option v-for="(item, index) in creators" :label="`${item.accountName} (${item.username})`" :value="item.id" :key="index">
            <template>
              <div class="be-flex wallet-item">
                <span style="margin-left: 10px">{{ item.accountName }}</span>
                <span style="margin-left: 4px">({{ item.username }})</span>
              </div>
            </template>
          </el-option>
        </el-select>
      </div>
      <div class="content-block">
        <p class="content-block__title">{{$t('metamart.collection.filter.category')}}</p>
        <el-select 
          filterable
          remote
          :remote-method="remoteCategoryList"
          v-model="filterCollection.categoryId"
          :placeholder="$t('metamart.collection.filter.category')"
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
        <p class="content-block__title">{{$t('metamart.collection.filter.network')}}</p>
        <el-select v-model="filterCollection.networkName" :placeholder="$t('metamart.collection.filter.network')">
          <el-option v-for="(option, index) in networks" :label="option.networkName" :value="option.networkName" :key="index"></el-option>
        </el-select>
      </div>
      <div class="content-block">
        <p class="content-block__title">{{$t('metamart.collection.filter.created-date')}}</p>
          <div class="content-block__inputs">
              <el-date-picker :placeholder="$t('metamart.collection.filter.from-date')" 
                format="MM/dd/yyyy"
                value-format="timestamp"
                v-model="filterCollection.fromCreatedAt" 
                prefix-icon="el-icon-date"
                type="date"
                class="input-small"
                :picker-options="pickerOption2"
              ></el-date-picker>
              <span style="display:block; width: 8px; height: 2px; background-color: #dbdbdb"></span>
              <el-date-picker :placeholder=" $t('metamart.collection.filter.to-date')" 
                format="MM/dd/yyyy"
                value-format="timestamp"
                v-model="filterCollection.toCreatedAt" 
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
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleReset">{{$t('metamart.button.reset')}}</el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" style="font-size: 14px; font-weight: 600" @click="handleApply">{{$t('metamart.button.apply')}}</el-button>
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
  export default class PopupFilterCollection extends Mixins(PopupMixin) {
    @Prop() creators: any
    @Prop() categories: any
    @Prop() networks: any

    @Watch('$route', { immediate: true, deep: true })
    onUrlChange() {
      this.filterCollection = {
        creatorId: '',
        categoryId: '',
        networkName: '',
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
        if (this.filterCollection.fromCreatedAt) {
          return time.getTime() / 1000 < new Date(this.filterCollection.fromCreatedAt).getTime() / 1000 - 7 * 60 * 60
        }
      } else {
        if (this.filterCollection.toCreatedAt) {
          return time.getTime() / 1000 > new Date(this.filterCollection.toCreatedAt).getTime() / 1000
        }
      }
    }

    filterCollection = {
      creatorId: '',
      categoryId: '',
      networkName: '',
      fromCreatedAt: '',
      toCreatedAt: '',
    }
    handleClose(): void {
      this.$emit('reset-query')
      this.setOpenPopup({
        popupName:'popup-filter-collection',
        isOpen: false
      })
    }
    handleReset(): void {
      this.filterCollection = {
        creatorId: '',
        categoryId: '',
        networkName: '',
        fromCreatedAt: '',
        toCreatedAt: '',
      }
      EventBus.$emit('filter', this.filterCollection)
      this.handleClose()
    }
    handleApply(): void {
      let fromDate = ''
      let toDate = ''
      if (this.filterCollection.fromCreatedAt) {
        fromDate = this.$options.filters?.formatReferral(this.filterCollection.fromCreatedAt)
      }
      if (this.filterCollection.toCreatedAt) {
        toDate = this.$options.filters?.formatReferral(this.filterCollection.toCreatedAt + 86399000)
      }
      this.filterCollection = {
        ...this.filterCollection,
        //@ts-ignore
        // network: this.filterCollection.network.match(/\(([^)]+)\)/)[1],
        fromCreatedAt: fromDate,
        toCreatedAt: toDate
      }
      EventBus.$emit('filter', this.filterCollection)
      this.handleClose()
    }

    //Creator load more
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
            font-weight: 400;
            font-size: 16px;
            line-height: 24px;
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
        // .select-prefix-icon {
        //   .el-input__inner {
        //     padding-left: 40px;
        //   }
        //   .el-input__prefix {
        //     left: 12px;
        //     .select-icon {
        //       width: 24px;
        //       height: 24px;
        //       position: absolute;
        //       top: 50%;
        //       transform: translateY(-50%);
        //       border-radius: 50%;
        //       background-color: var(--bc-bg-neutral);
        //       .span-icon {
        //         vertical-align: middle;
        //       }
        //     }
        //   }
        // }
        &__title {
          @include text(14px, 20px, 400, #0a0b0d);
          margin-bottom: 8px;
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
