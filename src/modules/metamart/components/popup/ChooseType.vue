<template>
  <base-popup name="popup-choosetype" class="popup-choose" width="600px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>CHOOSE TYPE</span>
    </div>
    <div class="content">
      <span class="content-description">
          Choose “Single” for one of a kind or “Multiple” if you want
          to sell one collectible multiple times
      </span>
       <div class="choise">
            <el-radio-group v-model="popup_data.content.radio.choise">
                <el-radio label="1" border>
                    <div class="choise-icon left">
                        <img src="../../../../icons/png/single.png" alt="single">
                    </div>
                    <h1 class="choise-type left">Single</h1>
                    <span class="choise-description left">
                        If you want to highlight the <br> 
                        uniqueness and individuality <br>
                        of your item </span>
                </el-radio>
                <el-radio label="2" border >
                    <div class="choise-icon right">
                        <img src="../../../../icons/png/multiple.png" alt="multiple">
                    </div>
                    <h1 class="choise-type right">Multiple</h1>
                    <span class="choise-description right">
                        If you want to share <br>
                        your item with a large number <br>
                        of community members 
                    </span>
                </el-radio>
            </el-radio-group>
      </div>
    </div>
    
    <div class="footer" slot="footer">
      <div class="wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-400 btn-h-40 btn-close" @click="handleClose">
              Cancel
          </el-button>
          <el-button class="btn-default-bg btn-400 btn-h-40 is-none-border" @click="$emit('continues', popup_data.content.radio.choise)"
          style="font-size: 14px; font-weight: 600;">
              Continues
          </el-button>
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
  export default class PopupChoosetype extends Mixins(PopupMixin) {
    // @bcKyc.State('listReason') listReason!: Array<Record<string, any>>
    // checkList = []
    // reason = ''
    // isLoading = false
    // isStopDbClick = false
    //begin
    popup_data = {
        content: {
            radio :{
                choise: '2'
            }
        }
    }
    
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-choosetype',
        isOpen: false
      })
    }
  }
</script>

<style scoped lang="scss">
  .popup-choose {
    .popup-content {
        background-color: #ffffff !important;
    }
    .content {
      padding-bottom: 24px;
      .content-description {
          font-size: 16px;
          line-height: 24px;
          font-weight: 400px;
          display: inline-block;
          width: 425px;
          height: 48px;
          margin-bottom: 12px;
          color: var(--bc-text-discript);
      }
      .choise {
          width: 100%;
          .el-radio-group {
              width: 100%;
              height: 212px;
              display: flex;
              justify-content: space-between;
              .el-radio {
                  width: 270px;
                  height: 212px;
                  padding: 0;
                  margin: 0;
                  position: relative;
                  .choise-icon {
                      position: absolute;
                      z-index: 10;
                      top: 24px;
                      height: 40px;
                      img {
                          width: 100%;
                      }
                      &.left {
                          width: 40px;
                          left: 115px;
                      }
                      &.right {
                          width: 88px;
                          left: 91px;
                      }
                  }
                  .choise-type {
                      display: inline-block;
                      font-size: 24px;
                      line-height: 32px;
                      font-weight: 600;
                      position: absolute;
                      top: 80px;
                      z-index: 100;
                      color: #0a0b0d;
                      &.left {
                          left: 101px;
                      }
                      &.right {
                          left: 87px;
                      }
                  }
                  .choise-description {
                      height: 72px;
                      position: absolute;
                      top: 116px;
                      z-index: 100;
                      text-align: center;
                      font-size: 14px;
                      line-height: 24px;
                      font-weight: 400;
                      color: #5B616E;
                      display: inline-block;
                      &.left {
                          width: 212px;
                          left: 29px;

                      }
                      &.right {
                          width: 198px;
                          left: 36px;
                      }
                  }
                  &.is-checked {
                      border-color: #9D3EF2;
                  }
                  
                  .el-radio__inner {
                      display: none !important;
                  }
              }
          }
      }
    }
    .btn-400 {
      font-weight: 400;
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
