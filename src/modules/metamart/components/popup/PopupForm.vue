<template>
  <base-popup name="popup-form" class="popup-form" width="1040px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span> Create NFT </span>
    </div>
    <div class="content">
      <main class="content-left">
        <section class="select block">
          <h2 class="block-title">Choose Token</h2>
          <el-select v-model="popup_data.content.select.value" placeholder="HUB">
            <el-option v-for="item in popup_data.content.select.options" :key="item.value" :label="item.label" :value="item.value">
              <img src="../../../../icons/png/Lynkey.png" alt="" style="width: 20px; height: 20px; float: left; margin-top: 10px; margin-right: 8px" />
              <span>{{ item.value }}</span>
            </el-option>
          </el-select>
        </section>

        <section class="upload block">
          <h2 class="block-title">Upload file</h2>
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :auto-upload="false"
            :show-file-list="false"
            :file-list="fileList"
            multiple
            accept=".jpg, .jpeg, .png, .bmp"
          >
            <div class="el-upload__text" v-if="!url">Drop file here or <em>click to upload</em></div>
            <div class="upload-wrapper" v-if="url">
              <img :src="url" :alt="filePreviewing" class="upload-wrapper__preview" />
              <img src="../../../../icons/png/x-circle.png" alt="close preview" class="upload-wrapper__icon" @click.stop="handleClearUpload" />
            </div>
            <div class="el-upload__tip" slot="tip" v-if="isCreated && url === ''">PNG, GIF, WEBG, MP4 or MP3. Max size 100mb.</div>
          </el-upload>
          <p class="block-alert" v-if="isCreated && url === ''">"File" is required</p>
        </section>

        <section class="name block">
          <h2 class="block-title">Name</h2>
          <el-input placeholder='e. g. "Redeemable T-Shirt with logo"' v-model="popup_data.content.name.value"></el-input>
          <p class="block-alert" v-if="isCreated && !popup_data.content.name.value">"Name" is not allowed to be empty</p>
        </section>

        <section class="description block">
          <h2 class="block-title">
            Description
            <span class="block-title__light">(Optional)</span>
          </h2>
          <el-input
            type="textarea"
            :placeholder="popup_data.content.description.placeholder"
            maxlength="200"
            show-word-limit
            rows="4"
            v-model="popup_data.content.description.value"
          />
        </section>

        <section class="unlock block">
          <h2 class="block-title">
            Unlock once purchased <br />
            <span class="block-title__subtitle">Content will be unlocked after successful transaction</span>
          </h2>
          <el-switch class="block-switch" v-model="popup_data.content.switchUnlock.value" active-color="#129961" inactive-color="#DBDBDB"> </el-switch>
          <div class="unlock-input" v-if="popup_data.content.switchUnlock.value">
            <el-input v-model="popup_data.content.switchUnlock.input.value"></el-input>
            <p class="block-suggestion">Markdown is supported</p>
          </div>
        </section>

        <section class="collection block">
          <h2 class="block-title">Choose collection</h2>
          <el-radio-group v-model="popup_data.content.collection.value" @change="$emit('collection', popup_data.content.collection.value)">
            <el-radio label="1" border>
              <div class="collection-icon collection-icon__left">
                <img src="../../../../icons/png/PlusCircle.png" alt="single" />
              </div>
              <h1 class="collection-type collection-type__left">Create</h1>
            </el-radio>
            <el-radio label="2" border>
              <div class="collection-icon collection-icon__middle">
                <img src="../../../../icons/png/Lynkey.png" alt="multiple" />
              </div>
              <h1 class="collection-type collection-type__middle">Lynkey Multiple</h1>
            </el-radio>
            <el-radio label="3" border>
              <div class="collection-icon collection-icon__right">
                <img src="../../../../icons/png/Ellipse_140.png" alt="multiple" />
              </div>
              <h1 class="collection-type collection-type__right">Skulltools</h1>
            </el-radio>
          </el-radio-group>
        </section>

        <section class="fee-minting block">
          <h2 class="block-title">
            Fee minting <br />
            <span class="block-title__subtitle">Buyer will pay gas fees for minting</span>
          </h2>
          <el-switch class="block-switch" v-model="popup_data.content.switchFeeMinting.value" active-color="#129961" inactive-color="#DBDBDB"> </el-switch>
        </section>

        <section class="wrapper block">
          <section class="royalties" style="float: left">
            <h2 class="block-title">Royalties</h2>
            <el-input placeholder='e. g. "10%"' v-model="popup_data.content.royalties.value" type="number" min="0" max="50" @input="handleInput"></el-input>
            <p class="block-suggestion">Suggested: 0%, 10%, 20%, 30%. Maximum is 50%</p>
            <p class="block-alert" v-if="isCreated && !popup_data.content.royalties.value">"Royalties" must be a number</p>
          </section>
          <section class="copies" style="float: left">
            <h2 class="block-title">Number of copies</h2>
            <el-input placeholder='e. g. "10"' v-model="popup_data.content.copies.value" type="number" min="0" max="50"></el-input>
            <p class="block-suggestion">Amount of tokens</p>
            <p class="block-alert" v-if="isCreated && !popup_data.content.copies.value">"Supply" must be a number</p>
          </section>
          <br style="clear: both" />
        </section>
        <el-button class="btn-default btn-600 btn-h-48 block" @click="handleShowAdvance">
          {{ popup_data.content.advancebtn }}
        </el-button>
        <section class="advance block" v-if="isShowAdvance">
          <section class="properties block">
            <h2 class="block-title">
              Properties
              <span class="block-title__light">(Optional)</span>
            </h2>
            <div class="wrap-input">
              <el-input placeholder='e. g. "Size"' v-model="popup_data.content.property.first.leftinput.value" style="width: 301px; margin-right: 24px; float: left"></el-input>
              <el-input placeholder='e. g. "M"' v-model="popup_data.content.property.first.rightinput.value" style="width: 301px; float: left"></el-input>
              <br style="clear: both" />
            </div>
            <div class="wrap-input" style="margin-top: 16px" v-if="popup_data.content.collection.value == '2'">
              <el-input placeholder='e. g. "Size"' v-model="popup_data.content.property.second.leftinput.value" style="width: 301px; margin-right: 24px; float: left"></el-input>
              <el-input placeholder='e. g. "M"' v-model="popup_data.content.property.second.rightinput.value" style="width: 301px; float: left"></el-input>
              <br style="clear: both" />
            </div>
          </section>
          <section class="nft block">
            <h2 class="block-title">
              Alternative text for NFT
              <span class="block-title__light"> (Optional) </span>
            </h2>
            <el-input
              type="textarea"
              placeholder="Image description in details (do not start with work “image”)"
              maxlength="200"
              show-word-limit
              rows="4"
              v-model="popup_data.content.nft.value"
            />
            <p class="block-suggestion">Text that will be used in VoiceOver for people with disabilities</p>
          </section>
        </section>
        <section class="notification block" v-if="!checkResult">
          <div class="notification-icon">
            <img src="../../../../icons/png/alert.png" alt="icon alert" />
          </div>
          <p class="notification-title">Oops, validation errors</p>
          <p class="notification-subtitle">Please fix the errors in fields above and try again.</p>
        </section>
        <el-button class="btn-default-bg btn-600 btn-h-48 is-none-border block" style="margin-left: 0px; margin-bottom: 0px" @click="handleCreateItem"> Create Item </el-button>
      </main>
      <aside class="content-right">
        <section class="preview block">
          <h2 class="block-title">Preview</h2>
          <div class="preview-wrapper">
            <p class="preview-wrapper__message" v-if="!url">Upload file to preview your brand new NFT</p>
            <div class="preview-wrapper__frame" v-if="url">
              <img :src="url" :alt="filePreviewing" />
            </div>
            <div class="preview-wrapper__detail" v-if="url">
              <p class="brand">Virtual Tour SandBox</p>
              <img src="../../../../icons/png/Verified.png" alt="official icon" class="brand-icon__official" />
              <img src="../../../../icons/png/Vector.png" alt="options icon" class="brand-icon__optional" />
              <h2 class="__name">{{ popup_data.content.name.value }}</h2>
              <p class="__description">Not for sale (10K/10K)</p>
              <button class="placebid">Place a bid</button>
            </div>
          </div>
        </section>
      </aside>
      <br style="clear: both" />
    </div>
    <nft-detail @other="handleCreateOther">
      <img :src="url" alt="" style="width: 200px; height: 200px; border-radius: 8px; margin: 0 calc(50% - 100px)" />
    </nft-detail>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import NftDetail from './NftDetail.vue'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')
  @Component({ components: { NftDetail } })
  export default class PopupForm extends Mixins(PopupMixin) {
    popup_data = {
      content: {
        select: {
          options: [
            {
              label: 'value 1',
              value: 'value 1'
            },
            {
              label: 'value 2',
              value: 'value 2'
            },
            {
              label: 'value 3',
              value: 'value 3'
            }
          ],
          value: ''
        },
        upload: {
          value: []
        },
        name: {
          value: ''
        },
        description: {
          placeholder: `e. g. "After purchasing you'll be able to get the real T-Shirt"`,
          value: ''
        },
        switchUnlock: {
          input: {
            value: ''
          },
          value: false
        },
        collection: {
          value: '2'
        },
        switchFeeMinting: {
          value: true
        },
        royalties: {
          value: ''
        },
        copies: {
          value: ''
        },
        advancebtn: 'Show advance settings',
        property: {
          first: {
            leftinput: {
              value: ''
            },
            rightinput: {
              value: ''
            }
          },
          second: {
            leftinput: {
              value: ''
            },
            rightinput: {
              value: ''
            }
          }
        },
        nft: {
          value: ''
        }
      }
    }

    // het code
    filePreviewing = ''
    url = ''
    isShowAdvance = false
    isCreated: any = false
    checkResult: any = true
    fileList = []
    handleSweepOut(): void {
      this.popup_data.content.select.value = ''
      this.popup_data.content.upload.value = []
      this.popup_data.content.name.value = ''
      this.popup_data.content.description.value = ''
      this.popup_data.content.switchUnlock.input.value = ''
      this.popup_data.content.collection.value = '2'
      this.popup_data.content.royalties.value = ''
      this.popup_data.content.copies.value = ''
      this.popup_data.content.property.first.leftinput.value = ''
      this.popup_data.content.property.first.rightinput.value = ''
      this.popup_data.content.property.second.leftinput.value = ''
      this.popup_data.content.property.second.rightinput.value = ''
      this.popup_data.content.nft.value = ''
      this.url = ''
      this.isCreated = false
      this.checkResult = true
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-form',
        isOpen: false
      })
      this.handleSweepOut()
    }
    handleChange(file, fileList): void {
      this.url = URL.createObjectURL(file.raw)
      this.filePreviewing = file.name
      this.popup_data.content.upload.value = file
    }
    handleClearUpload(): void {
      this.url = ''
      this.popup_data.content.upload.value = []
    }
    handleShowAdvance(): void {
      this.isShowAdvance = !this.isShowAdvance
      this.popup_data.content.advancebtn = this.isShowAdvance ? 'Hide advance settings' : 'Show advance settings'
    }
    handleInput(): void {
      if (eval(this.popup_data.content.royalties.value) >= 50) {
        this.popup_data.content.royalties.value = '50'
      } else if (eval(this.popup_data.content.royalties.value) <= 0) {
        this.popup_data.content.royalties.value = '0'
      }
    }
    handleCreateOther(): void {
      this.setOpenPopup({
        popupName: 'nft-detail',
        isOpen: false
      })
      this.handleSweepOut()
    }
    handleCreateItem(): void {
      this.checkResult =
        this.popup_data.content.upload.value && this.popup_data.content.name.value && this.popup_data.content.royalties.value && this.popup_data.content.copies.value
      console.log(this.checkResult)
      if (this.checkResult) {
        this.setOpenPopup({
          popupName: 'nft-detail',
          isOpen: true
        })
        this.isCreated = false
      } else {
        this.isCreated = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .popup-form {
    .el-dialog__footer {
      display: none;
    }
    .content {
      padding: 24px;
      background-color: #ffffff;
      border-radius: 8px;
      .el-upload-dragger {
        position: relative;
        .upload-wrapper {
          width: 367px;
          height: 192px;
          position: absolute;
          top: 20px;
          left: 114px;
          z-index: 100;
          &__preview {
            width: 367px;
            height: 192px;
            object-fit: cover;
          }
          &__icon {
            position: absolute;
            top: -6px;
            right: -30px;
            z-index: 101;
          }
        }
      }
      &-left {
        width: 627px;
        height: auto;
        float: left;
        margin-right: 27px;
        .select {
          height: auto;
        }
        .upload {
          height: auto;
        }
        .name {
          height: 112px;
        }
        .description {
          height: 129px;
        }
        .unlock {
          height: auto;
          &-input {
            height: 72px;
            position: relative;
            .el-input {
              position: absolute;
              top: 0;
              left: 0;
            }
            .block-suggestion {
              position: absolute;
              left: 0;
              bottom: 0;
            }
          }
        }
        .wrapper {
          height: 136px;
          .copies {
            width: 301px;
            height: 100%;
          }
          .royalties {
            width: 301px;
            height: 100%;
            margin-right: 24px;
          }
        }
        .collection {
          height: 144px;
          .el-radio-group {
            width: 100%;
            height: 104px;
            display: flex;
            justify-content: space-between;
            .el-radio {
              width: 193px;
              height: 104px;
              padding: 0;
              margin: 0;
              position: relative;
              .collection-icon {
                position: absolute;
                z-index: 10;
                img {
                  width: 100%;
                }
                &__left {
                  width: 49px;
                  height: 49px;
                  top: 10px;
                  left: 73px;
                }
                &__middle {
                  width: 42px;
                  height: 42px;
                  top: 15px;
                  left: 75.5px;
                }
                &__right {
                  width: 40px;
                  height: 40px;
                  top: 16px;
                  left: 76.5px;
                }
              }
              .collection-type {
                display: inline-block;
                font-size: 16px;
                line-height: 24px;
                font-weight: 600;
                position: absolute;
                z-index: 100;
                color: #0a0b0d;
                &__left {
                  bottom: 16px;
                  left: 71px;
                }
                &__middle {
                  bottom: 16px;
                  left: 35px;
                }
                &__right {
                  bottom: 16px;
                  left: 56px;
                }
              }
            }
          }
        }
      }
      .notification {
        height: 96px;
        background-color: #fbedee;
        padding: 18px;
        box-sizing: border-box;
        &-icon {
          width: 22px;
          height: 22px;
          float: left;
          img {
            width: 100%;
          }
        }
        &-title {
          font-size: 18px;
          line-height: 24px;
          color: #0a0b0d;
          font-weight: 600;
          width: 200px;
          height: 24px;
          float: left;
          margin-left: 16px;
        }
        &-subtitle {
          clear: left;
          font-size: 16px;
          line-height: 24px;
          font-weight: 400;
          height: 24px;
          width: 367px;
          color: #0a0b0d;
          margin-left: 40px;
          margin-top: 40px;
        }
      }
      &-right {
        width: 285px;
        height: 412px;
        // background-color: green;
        float: left;
        .preview {
          height: 452px;
          .preview-wrapper {
            border: 1px solid #dbdbdb;
            height: 412px;
            border-radius: 8px;
            position: relative;
            &__message {
              text-align: center;
              font-size: 14px;
              line-height: 24px;
              width: 180px;
              height: 48px;
              margin: 182px auto;
              color: #5b616e;
            }
            &__frame {
              width: 100%;
              height: 240px;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 100;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            &__detail {
              width: 100%;
              height: 172px;
              position: absolute;
              bottom: 0;
              left: 0;
              z-index: 100;
              padding: 16px;
              box-sizing: border-box;
              .brand {
                font-size: 14px;
                line-height: 24px;
                color: #5b616e;
                float: left;
              }
              .__description {
                width: 253px;
                font-size: 14px;
                line-height: 24px;
                color: #5b616e;
                padding-bottom: 16px;
                border-bottom: 2px solid #dbdbdb;
              }
              .placebid {
                font-size: 16px;
                line-height: 24px;
                border: none;
                background-color: transparent;
                color: #0151fc;
                position: relative;
                top: 16px;
              }
              .brand-icon__official {
                margin-top: 6px;
                margin-left: 3px;
              }
              .brand-icon__optional {
                // clear: left;
                float: right;
                margin-top: 6px;
                margin-right: 3px;
                &:hover {
                  cursor: pointer;
                }
              }
              .__name {
                width: 100%;
                height: 24px;
                font-size: 16px;
                line-height: 24px;
                margin-top: 4px;
                margin-bottom: 4px;
                clear: both;
                color: #0a0b0d;
                font-weight: 600;
              }
            }
          }
        }
      }
      .block {
        width: 100%;
        margin-bottom: 40px;
        &-title {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
          color: #0a0b0d;
          margin-bottom: 16px;
          &__subtitle {
            font-size: 14px;
            font-weight: 400;
            color: #5b616e;
          }
          &__light {
            font-weight: 400;
          }
        }
        &-suggestion {
          font-size: 12px;
          line-height: 16px;
          color: #5b616e;
          margin-top: 8px;
        }
        &-alert {
          font-size: 12px;
          line-height: 16px;
          margin-top: 8px;
          color: #cf202f;
        }
        &-switch {
          float: right;
          position: relative;
          bottom: 50px;
        }
      }
    }
    .btn-600 {
      font-weight: 600;
      &:hover {
        border: 1px solid var(--bc-btn-default-border-hover);
      }
    }
    .btn-h-48 {
      padding: 15px 0;
      height: 48px;
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
