<template>
  <base-popup name="nft-detail" class="nft-detail" width="400px" :close="handleClose">
    <div class="title-popup" slot="title">
    </div>
    <div class="content" v-loading="isLoading">
        <section class="frame block">
            <!-- <img src="../../../../icons/png/Lynkey.png" alt=""> -->
            <slot></slot>
        </section>
        <section class="message block">
            Your <span style="font-weight: 600; color: #0151FC;">Thai Merci</span>  NFT is successfully <br>
            created. It will be minted in blockchain while <br> 
            purchasing or transferring
        </section>
        <section class="showoff block">
            <p class="showoff-title">Let's show-off a little</p>
            <div class="showoff-social">
                <div class="brand" style="width: 40px; margin-right: 12px;">
                    <a href="#" class="brand-icon">
                        <img src="../../../../icons/png/insta.png" alt="Twiter">
                    </a>
                    <p class="brand-name">Twiter</p>
                </div>
                <div class="brand" style="width: 53px; margin-right: 7px;">
                    <a href="#" class="brand-icon">
                        <img src="../../../../icons/png/telegram.png" alt="Telegram">
                    </a>
                    <p class="brand-name">Telegram</p>
                </div>
                <div class="brand" style="width: 53px; margin-right: 13px;">
                    <a href="#" class="brand-icon">
                        <img src="../../../../icons/png/facebook.png" alt="Facebook">
                    </a>
                    <p class="brand-name">Facebook</p>
                </div>
                <div class="brand" style="width: 40px; margin-right: 17px">
                    <a href="#" class="brand-icon">
                        <img src="../../../../icons/png/email.png" alt="E-mail">
                    </a>
                    <p class="brand-name">E-mail</p>
                </div>
                <div class="brand" style="width: 40px;">
                    <a href="#" class="brand-icon">
                        <img src="../../../../icons/png/share.png" alt="Copy">
                    </a>
                    <p class="brand-name">Copy</p>
                </div>
                <br style="clear: both;">
            </div>
        </section>
      <section class="buttons">
          <el-button class="btn-default-bg btn-600 is-none-border btn-customize btn-customize__success"
          @click="handleClose">View NFT</el-button>
          <el-button class="btn-default btn-600 btn-customize" @click="$emit('other')">Create another</el-button>
      </section>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  // import { namespace } from 'vuex-class'
  // const bcKyc = namespace('bcKyc')
  @Component
  export default class NftDetail extends Mixins(PopupMixin) {
    // @bcKyc.State('listReason') listReason!: Array<Record<string, any>>
    // checkList = []
    // reason = ''
    // isLoading = false
    // isStopDbClick = false

    

    handleClose(): void {
      this.setOpenPopup({
        popupName: 'nft-detail',
        isOpen: false
      })
    }
  }
</script>

<style scoped lang="scss">
  .nft-detail {
    .content {
      padding-bottom: 24px;
      .frame {
          height: 200px;
      }
      .message {
          height: 72px;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          color: #0a0b0d;
          text-indent: 10px;
      }
      .showoff{
          height: auto;
          &-title {
              font-size: 18px;
              line-height: 24px;
              font-weight: 600;
              color: #0A0B0D;
              width: 100%;
              text-align: center;
              margin-bottom: 7.3px;
          }
          &-social {
              width: 100%;
              height: 72px;
              padding: 0 36px;
              box-sizing: border-box;
              .brand {
                  width: auto;
                  height: 62px;
                  float: left;
                  &-icon {
                      display: inline-block;
                      width: 40px;
                      height: 40px;
                      margin: 0 calc(50% - 20px) 6px calc(50% - 20px);
                      img {
                          width: 100%;
                      }
                  }
                  &-name {
                        font-size: 11px;
                        line-height: 16px;
                        color: #5b616e;
                        text-align: center;
                  }
              }
          }
      }
      .block {
          width: 100%;
          margin-bottom: 24px;
      }
    }
    .btn-customize {
        width: 100%;
        margin: 0;
        height: 48px;
        &__success {
            margin: 0 0 12px 0;
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
