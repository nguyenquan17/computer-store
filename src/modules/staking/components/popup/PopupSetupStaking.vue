<template>
  <base-popup name="popup-staking-setup" class="popup-staking-setup" width="1200px" :isShowFooter="true" :open="handleOpen" :close="handleClose">
    <div slot="title">
      <span> {{ typePopup === 'ADD' ? 'ADD NEW PACKAGE' : 'EDIT PACKAGE' }}</span>
    </div>
    <div class="content">
      <div class="content__left">
        <el-form ref="form" class="form" :model="form" :rules="rules">
          <el-form-item prop="planName" label="Name">
            <el-input v-model="form.planName" :disabled="objectDisabled.planName" placeholder="Enter package name" />
          </el-form-item>
          <el-form-item label="Token" class="is-required">
            <el-select class="w-100 select-token" v-model="form.token" :disabled="objectDisabled.token">
              <el-option v-for="item in listAssetToken" :key="item.id" :label="`${item.currencyName} (${item.currency})`" :value="item.currency">
                <template>
                  <div class="be-flex wallet-item">
                    <base-icon :icon="`icon-${item.currency.toLowerCase()}`" size="24" />
                    <span class="d-ib" style="margin-left: 10px">{{ item.currencyName }}</span>
                    <span class="d-ib" style="margin-left: 4px">({{ item.currency.toUpperCase() }})</span>
                  </div>
                </template>
              </el-option>
              <div v-if="form.token" class="prefix" slot="prefix">
                <base-icon :icon="`icon-${form.token.toLowerCase()}`" size="24" />
              </div>
            </el-select>
          </el-form-item>

          <el-form-item prop="minQuantity" label="Minimum amount" class="suffix">
            <el-input
              v-model="form.minQuantity"
              :disabled="objectDisabled.minQuantity"
              placeholder="Enter minimum staking amount"
              @keypress.native="onlyNumber($event, 'minQuantity')"
              @keyup.native="numberFormat($event)"
            >
              <p class="text-desc text-body-small" slot="suffix">{{ form.token }}</p>
            </el-input>
          </el-form-item>
          <div class="be-flex row">
            <el-form-item prop="durationType" class="mr-24 be-flex-item" label="Duration type">
              <el-select class="w-100" v-model="form.durationType" :disabled="objectDisabled.durationType">
                <el-option v-for="item in listDurationType" :key="item.id" :label="item.value" :value="item.key"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="duration" label="Duration" class="be-flex-item suffix">
              <el-input
                v-model="form.duration"
                :disabled="objectDisabled.duration"
                placeholder="Enter duration package"
                @keypress.native="onlyNumber($event, 'duration')"
                @keyup.native="numberFormat($event)"
              >
                <p class="text-desc text-body-small" slot="suffix">{{ textDuration }}</p>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item prop="unstakeDay" label="Unstake" class="suffix">
            <el-input
              v-model="form.unstakeDay"
              :disabled="objectDisabled.unstakeDay"
              placeholder="Enter number of days waiting to unstake"
              @keypress.native="onlyNumber($event, 'unstakeDay')"
              @keyup.native="numberFormat($event)"
            >
              <p class="text-desc text-body-small" slot="suffix">{{ textUnstake }}</p>
            </el-input>
          </el-form-item>
          <el-form-item prop="apr" label="APR (Annual Percentage Rate)" class="suffix">
            <el-input v-model="form.apr" :disabled="objectDisabled.apr" placeholder="Enter APR" @keypress.native="onlyNumber($event, 'apr')" @keyup.native="numberFormat($event)">
              <p class="text-desc text-body-small" slot="suffix">%</p>
            </el-input>
          </el-form-item>
          <el-form-item prop="distributeType" label="Distribution type">
            <el-select class="w-100" v-model="form.distributeType" :disabled="objectDisabled.distributeType">
              <el-option v-for="item in listInterestType" :key="item.id" :label="item.value" :value="item.key"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="content__right">
        <p class="text-body-small" style="margin-bottom: 8px">Description</p>
        <jodit-editor :config="configReply" v-model="content" />
      </div>
    </div>
    <div slot="footer" class="be-flex footer">
      <div @click="handleReset" class="btn-action btn-close">{{ $t('button.cancel') }}</div>
      <div @click="handleSubmit" class="btn-action btn-submit">{{ typePopup === 'ADD' ? $t('button.add-new') : $t('button.save') }}</div>
    </div>
    <popup-setup-staking-success @close="$emit('reload')" />
  </base-popup>
</template>

<script lang="ts">
  import { IAssetNetwork } from '@/interface'
  import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
  import PopupMixin from '@/mixins/popup'
  import PopupSetupStakingSuccess from './PopupSetupStakingSuccess.vue'

  import { JoditEditor } from 'jodit-vue'
  import 'jodit/build/jodit.min.css'
  import Cookies from 'js-cookie'
  import { API_URL } from '@/configs'
  const USERID = Cookies.get('user_id')

  import { namespace } from 'vuex-class'
  import getRepository from '@/services'
  import StakingRepository from '@/services/repositories/staking'
  import { includes } from 'lodash'
  const beBase = namespace('beBase')
  const beStaking = namespace('beStaking')

  const apiStaking: StakingRepository = getRepository('staking')

  @Component({ components: { JoditEditor, PopupSetupStakingSuccess } })
  export default class PopupSetupStaking extends Mixins(PopupMixin) {
    @Prop({ required: false, type: String, default: 'ADD' }) typePopup!: 'ADD' | 'EDIT'
    @Prop({ required: false, type: Object, default: () => ({}) }) row!: Record<string, any>

    @beBase.State('listAssetToken') listAssetToken!: IAssetNetwork[]
    @beStaking.State('listDurationType') listDurationType!: Array<Record<string, any>>
    @beStaking.State('listInterestType') listInterestType!: Array<Record<string, any>>

    form: Record<string, any> = {
      planName: '',
      token: '',
      minQuantity: '',
      duration: '',
      durationType: '',
      unstakeDay: '',
      apr: '',
      distributeType: ''
    }

    objectDisabled: Record<string, any> = {
      planName: false,
      token: false,
      minQuantity: false,
      duration: false,
      durationType: false,
      unstakeDay: false,
      apr: false,
      distributeType: false
    }

    content = ''
    configReply = {
      spellcheck: false,
      showCharsCounter: false,
      showWordsCounter: false,
      autofocus: false,
      showXPathInStatusbar: false,
      language: 'en',
      minHeight: 200,
      readonly: false,
      removeButtons: ['about', 'print', 'selectall', 'video', 'file', 'preview', 'copyformat', 'image'],
      i18n: {
        vi: {
          'Type something': 'Nhập mô tả',
          'Search for': 'Nhập tìm kiếm',
          'Open in new tab': 'Mở tab mới',
          'No follow': 'Theo dõi liên kết',
          Insert: 'Thêm',
          Text: 'Tiêu đề',
          Upload: 'Tải lên',
          'Drop image': 'Kéo thả ảnh',
          'or click': 'hoặc chọn từ máy tính',
          'Alternative text': 'Văn bản thay thế'
          // URL: 'Liên kết'
        },
        en: {
          'Type something': 'Type something...'
        }
      },
      uploader: {
        url: `${API_URL}/file/api/v1/user/upload`,
        prepareData: function (formdata) {
          formdata.append('type', 'DESCRIPTION_NFT')
          formdata.append('userId', USERID)
        },
        format: 'json',
        headers: {
          Authorization: `Bearer ${this.$store.state.beAuth.access_token}`
        },
        isSuccess: function (resp: Record<string, any>): any {
          return !resp.error
        },
        getMessage: function (resp: Record<string, any>): string {
          return resp.msg
        },
        filesVariableName: function (e: any): string {
          return 'files'
        },
        process: function (resp: Record<string, any>): Record<string, any> {
          return {
            files: resp.data || []
          }
        },
        defaultHandlerSuccess: function (data: Record<string, any>): void {
          const field = 'files'

          if (data[field] && data[field]['success'].length) {
            for (let i = 0; i < data[field]['success'].length; i += 1) {
              //@ts-ignore
              this.s.insertImage(data[field]['success'][i].url)
            }
          }
        },
        error: function (e: any): void {
          console.error(e)
        }
      }
    }

    rules: any = {
      planName: [
        {
          required: true,
          message: 'Please enter package name',
          trigger: 'blur'
        }
      ],
      minQuantity: [
        {
          required: true,
          message: 'Please enter amount',
          trigger: 'blur'
        }
      ],
      duration: [
        {
          required: true,
          message: 'Please enter duration',
          trigger: 'blur'
        }
      ],
      unstakeDay: [
        {
          required: true,
          message: 'Please enter unstake',
          trigger: 'blur'
        }
      ],
      apr: [
        {
          required: true,
          message: 'Please enter APR',
          trigger: 'blur'
        }
      ],
      durationType: [
        {
          required: true,
          message: 'Please enter duration type',
          trigger: 'change'
        }
      ],
      distributeType: [
        {
          required: true,
          message: 'Please enter distribution type',
          trigger: 'change'
        }
      ]
    }

    get textDuration(): string {
      if (this.form.durationType) {
        return Number(this.form.duration.replaceAll(',', '')) > 1
          ? this.$options.filters?.convertTextLowerCase(this.form.durationType) + 's'
          : this.$options.filters?.convertTextLowerCase(this.form.durationType)
      }
      return 'day'
    }
    get textUnstake(): string {
      return Number(this.form.unstakeDay.replaceAll(',', '')) > 1 ? 'days' : 'day'
    }

    handleOpen(): void {
      if (this.typePopup === 'EDIT') {
        const { planName, currency, minQuantity, durations, durationType, unstakeDay, aprPercent, interestType } = this.row
        this.form = {
          planName,
          token: currency,
          minQuantity: minQuantity && this.$options.filters?.formatNumber(minQuantity),
          duration: durations.toString(),
          durationType,
          unstakeDay: unstakeDay.toString(),
          apr: aprPercent,
          distributeType: interestType
        }
        this.content = this.row.description || ''
        this.checkDisabledFormItem()
      } else {
        this.form.token = this.listAssetToken[0].currency
        this.form.durationType = this.listDurationType[0].key
        this.form.distributeType = this.listInterestType[0].key
      }
    }
    handleClose(): void {
      this.objectDisabled = {
        planName: false,
        token: false,
        minQuantity: false,
        duration: false,
        durationType: false,
        unstakeDay: false,
        apr: false,
        distributeType: false
      }
      this.form = {
        planName: '',
        token: '',
        minQuantity: '',
        duration: '',
        durationType: '',
        unstakeDay: '',
        apr: '',
        distributeType: ''
      }
      this.content = ''
      //@ts-ignore
      this.$refs['form']?.clearValidate()
    }

    checkDisabledFormItem(): void {
      if (!this.row.totalStakedAmount && !this.row.lastTransaction) {
        return
      }
      if ((!this.row.totalStakedAmount && this.row.lastTransaction) || this.row.totalStakedAmount) {
        this.objectDisabled.token = true
        this.objectDisabled.minQuantity = true
        this.objectDisabled.duration = true
        this.objectDisabled.durationType = true
        this.objectDisabled.unstakeDay = true
        this.objectDisabled.apr = true
        this.objectDisabled.distributeType = true
      }
    }

    handleReset(): void {
      this.setOpenPopup({
        popupName: 'popup-staking-setup',
        isOpen: false
      })
    }
    handleSubmit(): void {
      //@ts-ignore
      this.$refs['form']?.validate(async valid => {
        if (valid) {
          const data = {
            ...this.form,
            description: this.content,
            minQuantity: Number(this.form.minQuantity.replaceAll(',', ''))
          }
          if (this.typePopup === 'ADD') {
            await apiStaking.createStaking(data)
            this.setOpenPopup({
              popupName: 'popup-setup-staking-success',
              isOpen: true
            })
          } else {
            await apiStaking.updateStaking(data, this.row.id)
            this.$message.success({ message: 'Update successfully', duration: 5000 })
            this.$emit('reload')
            this.setOpenPopup({
              popupName: 'popup-staking-setup',
              isOpen: false
            })
          }
        }
      })
    }
    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value

      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }
    onlyNumber(event: KeyboardEvent, type: string): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      // 46 is dot
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        event.preventDefault()
      }
      if (keyCode === 46 && includes(this.form[type], '.')) {
        event.preventDefault()
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep.popup-staking-setup {
    .popup-content {
      padding: 0;
      .content {
        display: flex;
        &__left {
          width: 596px;
          padding: 24px;
          padding-bottom: 0;
          .form {
            .select-token {
              .el-input {
                &__inner {
                  padding-left: 44px;
                }
                &__prefix {
                  top: 4px;
                  left: 12px;
                }
              }
            }
            .suffix {
              .el-input__suffix {
                right: 8px;
                top: 15px;
              }
            }
          }
        }
        &__right {
          flex: 1;
          border-left: 8px solid #f6f8fc;
          padding: 24px;
          padding-bottom: 0;
        }
      }
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .btn-action {
        width: 100px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        border-radius: 6px;

        &:hover {
          color: var(--bc-btn-default-text-hover);
          border: 1px solid var(--bc-btn-default-border-hover);
        }
      }

      .btn-close {
        background: var(--bc-color-white);
        border: 1px solid var(--bc-color-grey50);
        color: var(--bc-color-grey150);
        margin-right: 16px;
      }

      .btn-submit {
        color: var(--bc-color-white);
        background: var(--bc-btn-bg-default);
        border: none;

        &:hover {
          border: none;
          color: var(--bc-color-white);
          background: var(--bc-btn-bg-default-hover);
        }
      }
    }
  }
</style>
