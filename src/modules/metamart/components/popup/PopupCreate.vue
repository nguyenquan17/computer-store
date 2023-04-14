<template>
  <base-popup name="popup-create" class="popup-create" width="400px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>COLLECTION ERC-1155</span>
    </div>
    <div class="content">
      <div class="avatar block">
          <div class="avatar-frame">
              <img src="../../../../icons/png/circle.png" alt="avatar" class="avatar-frame__image">
          </div>
          <div class="avatar-notice">
              <span>We recommend an image of at <br> least 300x300. Gifs work too. <br> Max 5mb. </span>
              <em>Click to upload</em>
          </div>
      </div>
      <div class="name block">
          <span class="block-title">
              Display name
          </span>
          <el-input placeholder="Enter collection name" 
          v-model="popup_data.content.name.value"></el-input>
          <p class="block-tip">
              Token name cannot be changed in future
          </p>
      </div>
      <div class="symbol block">
          <span class="block-title">
              Symbol
          </span>
          <el-input placeholder="Enter token symbol" 
          v-model="popup_data.content.symbol.value"></el-input>
      </div>
      <div class="description block">
          <span class="block-title">
              Description
              <span class="block-title__light">
                  (Optional)
              </span>
          </span>
          <el-input placeholder="Spread some words about your token..." 
          v-model="popup_data.content.description.value"></el-input>
      </div>
      
    </div>
    
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-600 btn-h-40 btn-close" @click="handleClose">Cancel</el-button>
          <el-button class="btn-default-bg btn-600 btn-h-40 is-none-border" @click="handleClose">Create</el-button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  // import { namespace } from 'vuex-class'
  // const bcKyc = namespace('bcKyc')
  @Component
  export default class PopupCreate extends Mixins(PopupMixin) {
    // @bcKyc.State('listReason') listReason!: Array<Record<string, any>>
    // checkList = []
    // reason = ''
    // isLoading = false
    // isStopDbClick = false

    popup_data = {
        content: {
            name: {
                value: ""
            },
            symbol: {
                value: ""
            },
            description: {
                value: ""
            }
        }
    }

    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-create',
        isOpen: false
      })
    }
  }
</script>

<style scoped lang="scss">
.popup-create {
    .content {
      padding-bottom: 24px;
      .block {
          margin-bottom: 24px;
          width: 352px;
          &-title {
              font-size: 16px;
              line-height: 24px;
              font-weight: 600;
              color: #0a0b0d;
              display: inline-block;
              margin-bottom: 8px;
              &__light{
                  font-weight: 400;
              }
          }
          &-tip {
              font-size: 12px;
              line-height: 16px;
              color: #89909E;
              display: inline-block;
              margin-top: 8px;
          }
      }
      .avatar {
          height: 88px;
          &-frame {
              width: 88px;
              height: 88px;
              float: left;
              &__image {
                  width: 100%;
              }
          }
          &-notice {
              float: left;
              width: 256px;
              height: 72px;
              padding-right: 0px;
              margin: 8px 0 8px 8px;
              font-size: 16px;
              line-height: 24px;
              text-align: left;
              color: #5B616E;
              box-sizing: border-box;
              em {
                  color: #0A34C7;
              }
        }
        .name {
            height: 104px;
        }
        .symbol {
            height: 80px;
        }
        .description {
            height: 80px;
        }
    }
}
    .btn-600 {
      font-weight: 600;
      &:hover {
        border: 1px solid var(--bc-btn-default-border-hover);
      }
    }
    .checkbox {
      ::v-deep .el-checkbox {
        margin-bottom: 12px;
        width: fit-content;
      }
      ::v-deep .el-checkbox__label {
        color: #0a0b0d;
      }
      ::v-deep .el-checkbox__input {
        .el-checkbox__inner {
          width: 20px;
          height: 20px;
          &::after {
            // border: 2px solid #fff;
            height: 10px;
            left: 7px;
            top: 2px;
          }
        }
      }
      ::v-deep .el-checkbox__input.is-checked {
        .el-checkbox__inner {
          background-color: var(--bc-cb-bg-checked);
        }
      }
    }

    ::v-deep .el-textarea {
      .el-textarea__inner {
        color: var(--bc-text-primary);
      }
    }
  }
</style>
