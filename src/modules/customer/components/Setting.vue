<template>
  <div class="list-bonus">
    <base-popup name="popup-change-phone" class="popup-customer-detail" width="480px" :isShowFooter="false" :close="handleClose" :open="handleOpen">
      <div class="title-popup" slot="title">
        <span>{{ $t('customer.setting.new-phone') }}</span>
      </div>

      <div class="form">
        <el-form class="form-item" :model="form" :rules="rules" ref="form-phone">
          <el-form-item prop="country">
            <div class="be-flex label" slot="label">{{ $t('label.country') }}</div>
            <el-select v-model="form.country" class="w-100" filterable reserve-keyword remote :remote-method="remoteCountry" clearable @change="handleSelectCountry">
              <el-option v-for="(country, index) in listCountry" :key="index" :label="country.name" :value="country.name" />
            </el-select>
          </el-form-item>

          <el-form-item prop="phone">
            <div class="be-flex label" slot="label">{{ $t('label.phone-number') }}</div>

            <el-input @keypress.native="handleChangeCode($event)" type="number" :placeholder="$t('placeholder.phone-number')" v-model="form.phone">
              <template style="cursor: pointer" slot="prepend"
                ><span style="color: #5b616e">{{ phoneDefault }}</span></template
              >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="footer" slot="footer">
          <div class="be-flex jc-space-between wrap-button" style="padding-bottom: 12px; float: right">
            <div class="btn-right">
              <el-button class="btn-default btn-close btn-h-40" @click="handleClose">{{ $t('button.cancel') }}</el-button>
              <el-button
                type="button"
                :class="disabledContinue ? 'btn btn-h-40 is-none-border backgroundDisable' : 'btn btn-continue btn-h-40 is-none-border'"
                :disabled="disabledContinue"
                @click="handleContinue"
                >{{ $t('verify.continue') }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </base-popup>

    <!-- popup verify -->
    <base-popup name="popup-verify" class="popup-customer-detail" width="480px" :isShowFooter="false" :close="handleCloseVerify" :open="handleOpenVerify">
      <div class="title-popup" slot="title">
        <span>{{ $t('customer.setting.verify') }}</span>
      </div>
      <div class="bc-verify">
        <h3 v-if="this.typeAdminFa == 'APP'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-app') }}
        </h3>
        <h3 v-else-if="this.typeAdminFa == 'SMS'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-phone') }}
        </h3>
        <h3 v-else-if="this.typeAdminFa == 'EMAIL'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-email') }}
        </h3>
        <!-- <h3 v-else class="text-3xl text-center text-semibold title-form" style="justify-content: center">{{ $t('verify.title-phone') }} {{ typeVerified }}</h3> -->
        <div class="be-flex verify-code" style="margin-right: 8px">
          <base-icon :icon="getIcon" size="80" />
          <div class="ml-1 w-100 input-code">
            <el-form @submit.prevent.native="handleSubmit">
              <el-form-item prop="phone">
                <div class="be-flex label text-semibold" slot="label" style="color: #5b616e">{{ $t('label.enter-verify-code') }}</div>

                <el-input type="number" maxlength="6" :placeholder="$t('label.verify-code')" v-model.trim="form.resendCode">
                  <!-- <template style="cursor: pointer" slot="prepend"
                    ><span style="color: #5b616e">{{ phoneDefault }}</span></template
                  > -->
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button
          class="none-focus"
          :loading="isLoading"
          :class="disableSubmit ? 'btn w-100 is-none-border btn-h-40 cursor backgroundDisable' : 'btn w-100 is-none-border btn-h-40 cursor'"
          :disabled="disableSubmit"
          style="height: 40px"
          @click="handleSubmit"
          type="button"
          @keyup.enter.native="handleSubmit"
          >{{ $t('verify.submit') }}
        </el-button>
        <div v-if="this.typeAdminFa !== 'APP'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
          {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCodeLockUser"> {{ $t('verify.re-send') }} </span>
        </div>
        <div v-else class="text-base be-flex jc-space-center mt-24 text-grey-130"></div>
        <!-- <div v-if="$route.query.reason === 'VERIFY-SMS'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
          <span class="text-hyperlink text-semibold cursor" @click="handleUseOtherPhone"> {{ $t('verify.another-phone') }} </span>
        </div> -->
      </div>
    </base-popup>

    <!-- popup rest default-->
    <base-popup name="popup-reset-default" class="popup-customer-detail" width="480px" :isShowFooter="false" :close="handleCloseVerify" :open="handleOpenVerify">
      <div class="title-popup" slot="title">
        <span>{{ $t('customer.setting.verify') }}</span>
      </div>
      <div class="bc-verify">
        <h3 v-if="this.typeAdminFa == 'APP'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-app') }}
        </h3>
        <h3 v-else-if="this.typeAdminFa == 'SMS'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-phone') }}
        </h3>
        <h3 v-else-if="this.typeAdminFa == 'EMAIL'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-email') }}
        </h3>
        <!-- <h3 v-else class="text-3xl text-center text-semibold title-form" style="justify-content: center">{{ $t('verify.title-phone') }} {{ typeVerified }}</h3> -->
        <div class="be-flex verify-code">
          <base-icon :icon="getIcon" size="80" />
          <div class="ml-1 w-100 input-code">
            <el-form @submit.prevent.native="handleSubmitResetDefault">
              <!-- <el-form-item prop="code" :label="`${$t('verify.label')}`" class="no-require-label">
                <el-input type="text" v-model.trim="twoFaCode" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
              </el-form-item> -->
              <el-form-item prop="phone">
                <div class="be-flex label" slot="label">{{ $t('label.enter-verify-code') }}</div>

                <el-input type="number" maxlength="6" :placeholder="$t('label.verify-code')" v-model.trim="form.resendCode">
                  <!-- <template style="cursor: pointer" slot="prepend"
                    ><span style="color: #5b616e">{{ phoneDefault }}</span></template
                  > -->
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button
          type="button"
          class="none-focus"
          :loading="isLoading"
          :class="disableSubmit ? 'btn w-100 is-none-border btn-h-40 cursor backgroundDisable' : 'btn w-100 is-none-border btn-h-40 cursor'"
          :disabled="disableSubmit"
          style="height: 40px"
          @click="handleSubmitResetDefault"
          @keyup.enter.native="handleSubmitResetDefault"
          >{{ $t('verify.submit') }}
        </el-button>
        <div v-if="this.typeAdminFa !== 'APP'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
          {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCodeLockUser"> {{ $t('verify.re-send') }} </span>
        </div>
        <div v-else class="text-base be-flex jc-space-center mt-24 text-grey-130"></div>
        <!-- <div v-if="$route.query.reason === 'VERIFY-SMS'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
          <span class="text-hyperlink text-semibold cursor" @click="handleUseOtherPhone"> {{ $t('verify.another-phone') }} </span>
        </div> -->
      </div>
    </base-popup>

    <!-- lock user -->
    <base-popup name="popup-verify-lock" class="popup-customer-detail" width="480px" :isShowFooter="false" :close="handleCloseLock" :open="handleOpenLock">
      <div class="title-popup" slot="title">
        <span>{{ $t('customer.setting.verify') }}</span>
      </div>
      <div class="bc-verify">
        <h3 v-if="this.typeAdminFa == 'APP'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-app') }}
        </h3>
        <h3 v-else-if="this.typeAdminFa == 'SMS'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-phone') }}
        </h3>
        <h3 v-else-if="this.typeAdminFa == 'EMAIL'" class="text-3xl text-center text-semibold title-form" style="justify-content: center">
          {{ $t('verify.title-email') }}
        </h3>
        <!-- <h3 v-else class="text-3xl text-center text-semibold title-form" style="justify-content: center">{{ $t('verify.title-phone') }} {{ typeVerified }}</h3> -->
        <div class="be-flex verify-code">
          <base-icon :icon="getIcon" size="80" />
          <div class="ml-1 w-100 input-code">
            <el-form @submit.prevent.native="handleSubmitLockUser">
              <!-- <el-form-item prop="code" :label="`${$t('verify.label')}`" class="no-require-label">
                <el-input type="text" v-model.trim="twoFaCode" maxlength="6" :placeholder="`${$t('verify.placeholder')}`" />
              </el-form-item> -->
              <el-form-item prop="phone">
                <div class="be-flex label" slot="label">{{ $t('label.enter-verify-code') }}</div>

                <el-input type="number" maxlength="6" :placeholder="$t('label.verify-code')" v-model.trim="form.resendCode">
                  <!-- <template style="cursor: pointer" slot="prepend"
                    ><span style="color: #5b616e">{{ phoneDefault }}</span></template
                  > -->
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <el-button
          class="none-focus"
          :loading="isLoading"
          :class="disableSubmit ? 'btn w-100 is-none-border btn-h-40 cursor backgroundDisable' : 'btn w-100 is-none-border btn-h-40 cursor'"
          :disabled="disableSubmit"
          style="height: 40px"
          @click="handleSubmitLockUser"
          type="button"
          @keyup.enter.native="handleSubmitLockUser"
          >{{ $t('verify.submit') }}
        </el-button>
        <div v-if="this.typeAdminFa !== 'APP'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
          {{ $t('verify.question') }} &nbsp;<span class="text-hyperlink text-semibold cursor" @click="handleResendCodeLockUser"> {{ $t('verify.re-send') }} </span>
        </div>
        <div v-else class="text-base be-flex jc-space-center mt-24 text-grey-130"></div>
        <!-- <div v-if="$route.query.reason === 'VERIFY-SMS'" class="text-base be-flex jc-space-center mt-24 text-grey-130">
          <span class="text-hyperlink text-semibold cursor" @click="handleUseOtherPhone"> {{ $t('verify.another-phone') }} </span>
        </div> -->
      </div>
    </base-popup>

    <div class="table" style="padding-bottom: 24px" v-loading="isLoading" :class="isLoading ? 'list-loading' : null">
      <!-- <div class="be-flex jc-space-between align-center">
        <div class="text1" style="transform: translateY(-9px)">{{ $t('customer.setting.phone') }}</div>
        <div class="be-flex">
          <div class="phone">
            <span v-if="this.data.phoneVerified == '1'" class="style-phone">{{ phoneNumber }}</span>
            <span v-if="this.data.phoneVerified == '0'" style="color: blue; margin-left: 4px; font-size: 14px; line-height: 20px; color: #5b616e">{{ phoneVerified }}</span>
            <span v-else style="color: blue; margin-left: 4px; font-size: 14px; line-height: 20px; color: #129961">{{ phoneVerified }}</span>
          </div>
          <div style="width: 170px">
            <div
              class="button"
              style="float: right; transform: translateY(-9px)"
              v-if="
                this.data.userStatus !== 'UNVERIFIED' &&
                this.data.userStatus !== 'LOCKED' &&
                this.data.userStatus !== 'BLOCKED' &&
                this.data.userStatus !== 'SUSPECTED' &&
                this.data.faType
              "
            >
              <el-button type="button" class="style-button" style="width: 130px" @click="clickChangePhoneNumber">{{ $t('customer.setting.change') }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <hr class="hr1" /> -->

      <div class="be-flex jc-space-between align-center">
        <div class="text1">{{ $t('customer.setting.2factor') }}</div>

        <div class="be-flex" v-if="this.data.faType">
          <div class="phone">
            <div class="phone">
              <base-icon :icon="getIconUser" size="40" /><span class="style-phone" style="position: relative; top: -7px; left: -2px">{{ authenType }}</span>
            </div>
          </div>
          <!-- <div class="status">verified</div> -->
          <div style="width: 170px">
            <div
              class="button"
              style="float: right"
              v-if="
                this.data.faType !== 'EMAIL' &&
                this.data.userStatus !== 'UNVERIFIED' &&
                this.data.userStatus !== 'LOCKED' &&
                this.data.userStatus !== 'BLOCKED' &&
                this.data.userStatus !== 'SUSPECTED'
              "
            >
              <el-button type="button" class="style-button" style="width: 130px" @click="handleResetDefault">{{ $t('customer.setting.reset') }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <hr class="hr2" />
      <div class="be-flex jc-space-between align-center">
        <div class="text1">{{ $t('customer.setting.status') }}</div>
        <div class="be-flex">
          <div class="phone">
            <span class="style-phone" style="position: relative; top: 7px" v-if="this.userStatus == 'Active'"
              ><base-icon style="vertical-align: 0.25em" icon="icon-status" size="8" />{{ $t('customer.setting.user-active') }}</span
            >
            <span class="style-phone" style="position: relative; top: 7px" v-else-if="this.userStatus == 'Unverified'"
              ><base-icon style="vertical-align: 0.25em; margin-right: 8px; color: red" icon="icon-status-red" size="8" />{{ $t('customer.setting.user-unverified') }}</span
            >
            <span class="style-phone" style="position: relative; top: 7px" v-else
              ><base-icon style="vertical-align: 0.25em; margin-right: 8px; color: red" icon="icon-status-red" size="8" />{{ $t('customer.setting.user-locked') }}</span
            >
          </div>
          <!-- <div class="status">verified</div> -->
          <div style="width: 170px">
            <div class="button" style="float: right" v-if="this.userStatus !== 'Unverified'">
              <el-button v-if="userStatus == 'Active'" type="button" class="style-button" style="width: 130px" @click="handleLockUser">{{ $t('customer.setting.lock') }}</el-button>
              <el-button v-else type="button" class="style-button" style="width: 130px" @click="handleUnlockUser">{{ $t('customer.setting.unlock') }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <hr class="hr3" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Mixins } from 'vue-property-decorator'

  import { namespace } from 'vuex-class'

  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { CustomerRepository } from '@/services/repositories/customer'
  import countryJson from '@/utils/country/index.json'
  import { AuthRepository } from '@/services/repositories/auth'
  import { filter, trim } from 'lodash'
  import { Watch } from 'vue-property-decorator'
  const apiCustomer: CustomerRepository = getRepository('customer')
  const apiAuth: AuthRepository = getRepository('auth')
  const beBase = namespace('beBase')
  const bcAuth = namespace('beAuth')
  interface IListCountry {
    name: string
    dial_code: string
    code: string
  }
  @Component({ components: {} })
  export default class CustomerBonus extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Number, default: 0 }) userId!: number
    @Prop({ required: true, type: Number, default: 0 }) dataDetail!: any
    @bcAuth.State('user') user!: Record<string, any>
    isLoading = false
    listCountry: IListCountry[] = countryJson
    language = ''
    selectLanguage = ''
    phoneDefault = '+84'
    type2Fa = ''
    typeVerified = ''
    userStatus = ''
    form: Record<string, any> = {
      country: '',
      phone: '',
      code: '',
      resendCode: ''
    }
    twoFaCode = ''
    optionLanguage: Array<Record<string, any>> = [
      {
        id: 1,
        lang: 'en'
      },
      {
        id: 2,
        lang: 'vi'
      }
    ]

    rules: Record<string, any> = {
      country: [
        {
          required: true,
          message: this.$t('validate.wrong-country'),
          trigger: 'change'
        }
      ],
      phone: [
        {
          required: true,
          message: this.$t('validate.phone-number'),
          trigger: 'blur'
        }
      ]
    }
    disabledContinue = true
    disableSubmit = true
    @Watch('form.phone') watchList(value: string): void {
      this.disabledContinue = value.length > 0 ? false : true
    }
    @Watch('form.resendCode') watchSubmit(value: string): void {
      this.disableSubmit = value.length == 6 ? false : true
      this.form.resendCode = this.form.resendCode.substring(0, 6)
    }
    @Watch('form.country')
    clearCountry(value: any) {
      if (!value) {
        this.listCountry = countryJson
      }
    }
    remoteCountry(query: string): void {
      if (query) {
        const currentCountry = filter(
          this.listCountry,
          country => trim(country.code).toUpperCase().includes(query.toUpperCase()) || trim(country.name).toUpperCase().includes(query.toUpperCase())
        )
        if (currentCountry.length > 0) {
          this.listCountry = currentCountry
        }
      } else if (!query) {
        this.listCountry = countryJson
      }
    }
    get getIconUser(): string {
      const name = this.data.faType

      if (name == 'SMS') {
        return 'verify-phone'
      }
      if (name === 'EMAIL') {
        return 'verify-email'
      }
      return 'verify-app'
    }
    get getIcon(): string {
      const name = this.typeAdminFa
      if (name == 'SMS') {
        return 'verify-phone'
      }
      if (name === 'EMAIL') {
        return 'verify-email'
      }
      return 'verify-app'
    }
    isVisible = false
    clickChangePhoneNumber(): void {
      this.setOpenPopup({
        popupName: 'popup-change-phone',
        isOpen: true
      })
    }
    handleCloseVerify(): void {
      this.setOpenPopup({
        popupName: 'popup-verify',
        isOpen: false
      })
      this.form.resendCode = ''
      // this.resetForm()
    }
    handleClose(): void {
      this.setOpenPopup({
        popupName: 'popup-change-phone',
        isOpen: false
      })
      this.form.resendCode = ''
      // this.resetForm()
    }
    resetForm(): void {
      ;(this.form.phone = ''), (this.form.code = ''), (this.form.resendCode = '')
    }
    handleOpen(): void {
      this.form.phone = ''
      // this.resetForm()
    }
    handleOpenVerify(): void {
      // this.resetForm()
    }
    handleOpenLock(): void {
      // this.resetForm()
    }
    handleCloseLock(): void {
      // this.resetForm()
      this.form.resendCode = ''
    }
    async handleResendCodeChangePhone(): Promise<void> {
      this.form.resendCode = ''
      this.handleSendCode()
    }
    async handleResendCodeResetDefault(): Promise<void> {
      this.form.resendCode = ''
      await this.handleSendCode()
    }
    async handleResetDefault(): Promise<void> {
      await this.handleSendCode()
      this.setOpenPopup({
        popupName: 'popup-reset-default',
        isOpen: true
      })
      // this.sendEmailReset2FA()
      // this.sendEmailcustomer()
    }
    sendEmailReset2FA(): void {
      apiCustomer
        .reset2Fa(this.userId)
        .then(() => {
          let message: any = this.$t('customer.setting.send-reset-default')
          this.$message.success(message)
        })
        .catch(() => {
          let message: any = this.$t('customer.setting.send-reset-default-fail')
          this.$message.error(message)
        })
    }
    async handleSubmitResetDefault(): Promise<void> {
      apiCustomer
        .verifyResetDefault(this.form.resendCode)
        .then(() => {
          // let message: any = this.$t('customer.setting.send-code')
          // this.$message.success(message)
          this.setOpenPopup({
            popupName: 'popup-reset-default',
            isOpen: false
          })
          this.sendEmailReset2FA()
        })
        .catch(() => {
          // let message: any = this.$t('customer.setting.send-code-fail')
          // this.$message.error(message)
        })
    }
    verifyCode(): void {
      apiCustomer
        .verifyResetDefault(this.form.resendCode)
        .then(() => {
          // let message: any = this.$t('customer.setting.send-code')
          // this.$message.success(message)
          this.setOpenPopup({
            popupName: 'popup-reset-default',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-change-phone',
            isOpen: false
          })
          this.sendEmailcustomer()
        })
        .catch(() => {
          // let message: any = this.$t('customer.setting.send-code-fail')
          // this.$message.error(message)
        })
    }
    sendEmailcustomer(): void {
      this.handleSendCodeCustomer()
        .then(() => {
          let message: any = this.$t('customer.setting.send-mail-success')
          this.$message.success(message)
          this.setOpenPopup({
            popupName: 'popup-verify',
            isOpen: false
          })
          this.setOpenPopup({
            popupName: 'popup-change-phone',
            isOpen: false
          })
        })
        .catch(() => {
          let message: any = this.$t('customer.setting.send-mail-fail')
          this.$message.error(message)
        })
    }
    async handleSubmit(): Promise<void> {
      this.verifyCode()
      // await this.sendEmailcustomer()
    }
    checkEvent: any = ''
    // handleChangePhone(event: FocusEvent): void {
    //   this.checkEvent = event
    //   console.log('11111 ', this.checkEvent)
    //   if (event) {
    //     this.handleContinue()
    //   }
    // }
    async handleSendCodeCustomer(): Promise<void> {
      const params = {
        countryCode: this.phoneDefault,
        country: this.form.country,
        newPhone: this.form.phone
      }
      await apiCustomer
        .sendCodeCustomer(this.userId, params)
        .then(() => {
          console.log('ok')
        })
        .catch(() => {
          console.log('fail')
        })
    }
    async handleSendCode(): Promise<void> {
      await apiCustomer
        .sendCode()
        .then(() => {
          if (this.typeAdminFa !== 'APP') {
            let message: any = this.$t('customer.setting.send-code')
            this.$message.success(message)
          }

          // this.setOpenPopup({
          //   popupName: 'popup-change-phone',
          //   isOpen: false
          // })
          // this.form.phone = ''
        })
        .catch(() => {
          if (this.typeAdminFa !== 'APP') {
            let message: any = this.$t('customer.setting.send-code-fail')
            this.$message.error(message)
          }
        })
    }
    handleSubmitLockUser(): void {
      if (this.checkStatus == 'LOCK') {
        const params = {
          userId: this.userId,
          verificationCode: this.form.resendCode
        }
        apiCustomer
          .updateLockedUser(params)
          .then((res: any) => {
            console.log('res', res)
            let message: any = this.$t('customer.setting.lock-user-success')
            this.$message.success(message)
            this.setOpenPopup({
              popupName: 'popup-verify-lock',
              isOpen: false
            })
            this.form.resendCode = ''
          })
          .catch(() => {
            // let message: any = this.$t('customer.setting.lock-user-fail')
            // this.$message.error(message)
          })
      } else {
        const paramsUnlock = {
          userId: this.userId,
          verificationCode: this.form.resendCode,
          email: this.dataDetail.email
        }
        apiCustomer
          .updateUnlockUser(paramsUnlock)
          .then((res: any) => {
            // get message thì sửa ở api Customer
            if (res.message == 'Unlocked successfully') {
              let message: any = this.$t('customer.setting.unlock-user-success')
              this.$message.success(message)
            } else {
              let message: any = this.$t('customer.setting.send-email-avtive')
              this.$message.success(message)
            }

            this.setOpenPopup({
              popupName: 'popup-verify-lock',
              isOpen: false
            })
            this.form.resendCode = ''
          })
          .catch(err => {
            console.log(err)
          })
      }
      setTimeout(() => {
        this.getData()
      }, 1000)
    }
    handleResendCodeLockUser(): void {
      this.form.resendCode = ''
      apiCustomer
        .sendCodeLockUser(this.userId)
        .then(() => {
          if (this.typeAdminFa !== 'APP') {
            let message: any = this.$t('customer.setting.send-code')
            this.$message.success(message)
          }
        })
        .catch(() => {
          let message: any = this.$t('customer.setting.send-code-fail')
          this.$message.error(message)
        })
    }
    checkStatus = ''
    async handleLockUser(): Promise<void> {
      this.checkStatus = 'LOCK'
      await apiCustomer
        .sendCodeLockUser(this.userId)
        .then(() => {
          this.setOpenPopup({
            popupName: 'popup-verify-lock',
            isOpen: true
          })
          setTimeout(() => {
            if (this.typeAdminFa !== 'APP') {
              let message: any = this.$t('customer.setting.send-code')
              this.$message.success(message)
            }
          }, 300)
        })
        .catch(() => {
          let message: any = this.$t('customer.setting.send-code-fail')
          this.$message.error(message)
        })
    }
    async handleUnlockUser(): Promise<void> {
      this.checkStatus = 'UNLOCK'
      await apiCustomer
        .sendCodeLockUser(this.userId)
        .then(() => {
          this.setOpenPopup({
            popupName: 'popup-verify-lock',
            isOpen: true
          })
          setTimeout(() => {
            if (this.typeAdminFa !== 'APP') {
              let message: any = this.$t('customer.setting.send-code')
              this.$message.success(message)
            }
          }, 300)
        })
        .catch(() => {
          let message: any = this.$t('customer.setting.send-code-fail')
          this.$message.error(message)
        })
    }
    async handleContinueChangePhone(): Promise<void> {
      if (this.form.country !== '' && this.form.phone !== '') {
        const params = {
          countryCode: this.phoneDefault,
          country: this.form.country,
          newPhone: this.form.phone
        }
        const result = await apiCustomer.validatePhoneNumber(params)
        this.setOpenPopup({
          popupName: 'popup-verify',
          isOpen: true
        })
        this.handleSendCode()
      }
    }
    handleChangeCode(event: KeyboardEvent): void {
      let keyCode = event.keyCode ? event.keyCode : event.which
      if (keyCode === 13) {
        this.handleContinue()
      }
    }
    async handleContinue(): Promise<void> {
      if (this.form.country !== '' && this.form.phone !== '') {
        const params = {
          countryCode: this.phoneDefault,
          country: this.form.country,
          newPhone: this.form.phone
        }
        const result = await apiCustomer.validatePhoneNumber(params)
        this.setOpenPopup({
          popupName: 'popup-verify',
          isOpen: true
        })
        this.handleSendCode()
      }
    }
    phoneNumber = ''
    authenType = ''
    phoneVerified = ''
    data: any = {}
    async getData(): Promise<void> {
      const params = {
        userId: this.dataDetail.userId
      }
      const result: any = await apiCustomer.getListCustomer(params)
      this.data = result.content[0]
      if (this.data.countryCode && this.data.phone) {
        this.phoneNumber = '(' + this.data.countryCode + ') ' + this.data.phone
      }
      // this.userStatus ? result.userStatus =='ACTIVE' :
      if (this.data.userStatus == 'ACTIVE') {
        this.userStatus = 'Active'
      } else if (this.data.userStatus == 'UNVERIFIED') {
        this.userStatus = 'Unverified'
      } else {
        this.userStatus = 'Locked'
      }

      //check faType
      if (this.data.faType == 'EMAIL') {
        let message: any = this.$t('customer.authen.email')
        this.authenType = message
      } else if (this.data.faType == 'APP') {
        let message: any = this.$t('customer.authen.app')
        this.authenType = message
      } else if (this.data.faType == 'SMS') {
        let message: any = this.$t('customer.authen.phone')
        this.authenType = message
      } else {
        this.authenType = ''
      }

      if (this.data.phoneVerified == '0') {
        let message: any = this.$t('customer.phoneveri.not-verified')
        this.phoneVerified = message
      } else {
        let message: any = this.$t('customer.phoneveri.verified')
        this.phoneVerified = message
      }
    }
    async created(): Promise<void> {
      await this.getData()
      this.language = window.localStorage.getItem('bc-lang')!
      this.selectLanguage = this.language
      const currentCountry = filter(this.listCountry, country => country.code === 'VN')[0]
      this.form.country = currentCountry.name
      this.get2Fa()
    }
    typeAdminFa = ''
    async get2Fa(): Promise<void> {
      const params = {
        email: this.user.email,
        userType: 'EMPLOYEE'
      }
      await apiAuth.get2FA(params).then((res: any) => {
        this.typeAdminFa = res
        this.typeVerified = res.toLowerCase()
        if (this.typeVerified == 'sms') {
          let message: any = ''
          message = this.$t('verify.phone-number')
          this.typeVerified = message
        } else if (this.typeVerified == 'app') {
          let message: any = ''
          message = this.$t('verify.authen-app')
          this.typeVerified = message
        }
        // else  {
        //   this.typeVerified = 'authenticator app'
        // }
      })
    }
    handleSelectCountry(country: string): void {
      this.phoneDefault = filter(this.listCountry, item => item.name === country)[0].dial_code
    }

    handleChangeLanguage(): void {
      //@ts-ignore
      this.$refs['form-phone']?.resetFields()
    }

    handleCopyTransaction(row: Record<string, any>): void {
      let message: any = ''
      const el = document.createElement('input')
      el.value = row.transactionCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }

    checkTypeClass(status: string): string {
      if (status === 'PENDING') {
        return 'status-peding'
      } else {
        return 'status-success'
      }
    }

    getTypeStatus(status: string): any {
      if (status === 'PENDING') {
        return this.$t('customer.table.pending')
      } else {
        return this.$t('customer.table.paid')
      }
    }

    handleShowPopper(): void {
      this.isVisible = true
    }

    // onlyNumber(event: KeyboardEvent, type: string): void {
    //   let keyCode = event.keyCode ? event.keyCode : event.which
    //   //if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    //   // 46 is dot
    //   if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    //     event.preventDefault()
    //   }
    //   if (keyCode === 46 && includes(this.filter[type], '.')) {
    //     event.preventDefault()
    //   }
    // }

    numberFormat(event: FocusEvent): void {
      const _event: any = event
      let fnumber = _event.target.value
      if (fnumber.length > 0) {
        fnumber = fnumber.replaceAll(',', '')
        fnumber = this.$options.filters?.numberWithCommas(fnumber)
        _event.target.value = fnumber
      }
    }
  }
</script>

<style scoped lang="scss">
  .input.el-input__inner {
    color: var(--bc-text-discript);
  }
  ::v-deep .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 8px;
  }
  .jc-space-center {
    justify-content: center;
    padding-bottom: 24px;
    margin-top: 24px;
  }
  .btn:hover {
    // background: var(--bc-btn-disable);
    background-color: var(--bc-btn-bg-default);
    border: none;
    color: var(--bc-color-white);
  }
  .backgroundDisable:hover {
    background: var(--bc-btn-disable);
    border: none;
    color: var(--bc-color-white);
  }
  .backgroundDisable {
    background: var(--bc-btn-disable);
    border: none;
    color: var(--bc-color-white);
  }
  .btn-continue {
    background-color: var(--bc-btn-bg-default);
  }
  .btn-continue:hover {
    background-color: var(--bc-btn-bg-default);
    color: var(--bc-color-white);
  }
  .title-form {
    color: #201f1e;
    margin-bottom: 3px;
    word-break: break-word;
  }
  .input-code {
    margin-top: 17px;
  }
  .hr1 {
    border: 1px solid #dbdbdb;
    margin-bottom: 13px;
  }
  .hr3 {
    border: 1px solid #dbdbdb;
    margin-top: 14px;
    margin-bottom: 13px;
  }
  .hr2 {
    border: 1px solid #dbdbdb;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .text1 {
    color: #0a0b0d;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }
  .phone {
    color: #0a0b0d;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: left;
  }
  .width-button {
    width: 130px !important ;
  }
  .style-phone {
    color: blue;
    width: 45px;
    font-size: 16px;
    line-height: 24px;
    color: #0a0b0d;
  }
  .style-button {
    border: 1px solid #89909e;
    background-color: #fff;
    color: var(--bc-text-primary);
  }
  .style-button:hover {
    border: 1px solid var(--bc-theme-primary);
    background-color: #fff;
    color: var(--bc-theme-primary);
  }
  .list-bonus {
    .input-search {
      width: 400px;
      margin-right: 30px;
    }
    .sort {
      cursor: pointer;
      color: #0a0b0d;
    }
    .list-loading {
      min-height: 200px;
    }
    .table {
      padding: 0 24px;
      .small {
        font-size: 14px !important;
        line-height: 16px;
        color: #5b616e;
      }
    }
  }
  .none-focus:focus {
    color: var(--bc-color-white);
    background-color: var(--bc-theme-primary);
  }
</style>
