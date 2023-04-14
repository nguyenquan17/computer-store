<template>
  <base-popup name="popup-reset-pass" class="popup-member" width="400px" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('member.popup.title-reset') }}</span>
    </div>
    <div class="content">
      <el-form class="form-item" :model="form" :rules="rules" ref="reset-pass" autocomplete="off">
        <el-form-item :label="$t('label.new-password')" prop="password" class="input-password">
          <el-popover placement="right" width="auto" trigger="manual" v-model="visible" popper-class="popper-validate-password">
            <template>
              <div class="check-password">
                <div class="be-flex align-center check-item">
                  <base-icon v-if="validate.length" icon="icon-tick" size="16" />
                  <base-icon v-else icon="icon-x" size="16" />
                  <span class="text-xs" style="padding-left: 8px; color: #5b616e">{{ $t('validate.length') }}</span>
                </div>
                <div class="be-flex align-center check-item">
                  <base-icon v-if="validate.lowercase" icon="icon-tick" size="16" />
                  <base-icon v-else icon="icon-x" size="16" />
                  <span class="text-xs" style="padding-left: 8px; color: #5b616e">{{ $t('validate.lowercase') }}</span>
                </div>
                <div class="be-flex align-center check-item">
                  <base-icon v-if="validate.uppercase" icon="icon-tick" size="16" />
                  <base-icon v-else icon="icon-x" size="16" />
                  <span class="text-xs" style="padding-left: 8px; color: #5b616e">{{ $t('validate.uppercase') }}</span>
                </div>
                <div class="be-flex align-center check-item">
                  <base-icon v-if="validate.number" icon="icon-tick" size="16" />
                  <base-icon v-else icon="icon-x" size="16" />
                  <span class="text-xs" style="padding-left: 8px; color: #5b616e">{{ $t('validate.number') }}</span>
                </div>
                <div class="be-flex align-center check-item">
                  <base-icon v-if="validate.specialCharacter" icon="icon-tick" size="16" />
                  <base-icon v-else icon="icon-x" size="16" />
                  <span class="text-xs" style="padding-left: 8px; color: #5b616e">{{ $t('validate.specialCharacter') }}</span>
                </div>
              </div>
            </template>
            <el-input
              :type="showPass == true ? 'text' : 'password'"
              slot="reference"
              autocomplete="new-password"
              :placeholder="$t('placeholder.password')"
              v-model="form.password"
              @focus="visible = true"
              @blur="visible = false"
            />
          </el-popover>
          <span class="icon-show-password" @click="showPass = !showPass">
            <base-icon :icon="showPass == true ? 'icon-eye-off' : 'icon-eye'" size="22" />
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.save') }}</span>
          </button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Watch, Prop } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'
  import { MemberRepository } from '@/services/repositories/member'
  import getRepository from '@/services'

  const apiMember: MemberRepository = getRepository('member')
  @Component({
    components: {}
  })
  export default class PopupResetPass extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) detailRow!: Record<string, any>
    showPass = false
    visible = false
    validate: Record<string, boolean> = {
      length: false,
      number: false,
      uppercase: false,
      lowercase: false,
      specialCharacter: false
    }
    form = {
      password: ''
    }

    regLow = /(?=.*[a-z])/g
    regUp = /(?=.*[A-Z])/g
    regNumber = /(?=.*[0-9])/g
    regSpecial = /(?=.*[!@#$%^&*()_=+{}:;"'/?><.,-])/g

    rules: Record<string, any> = {
      password: [
        {
          required: true,
          message: this.$t('member.validate.wrong-password'),
          trigger: 'blur'
        },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          message: this.$t('member.validate.checkpass'),
          trigger: 'blur'
        }
      ]
    }

    @Watch('form.password') watchPassword(pass: string): void {
      this.validate.length = pass.length >= 8
      this.validate.number = this.regNumber.test(pass)
      this.validate.uppercase = this.regUp.test(pass)
      this.validate.lowercase = this.regLow.test(pass)
      this.validate.specialCharacter = this.regSpecial.test(pass)
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-reset-pass',
        isOpen: false
      })
    }

    handleClose(): void {
      this.showPass = false
      this.form.password = ''
      //@ts-ignore
      this.$refs['reset-pass'].clearValidate()
    }

    handleSubmit(): void {
      //@ts-ignore
      this.$refs['reset-pass']?.validate(valid => {
        if (valid) {
          const data = {
            email: this.detailRow.email,
            password: this.$options.filters?.encryptPassword(this.form.password)
          }
          apiMember.resetPassWordMember(data).then(() => {
            let message: any = this.$t('notify.reset-pass-succsess')
            this.$message.success({ message, duration: 5000 })
            this.handleCancel()
          })
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .popup-member {
    color: var(--bc-text-primary);

    .title-popup {
      span {
        color: #0a0b0d;
      }
    }

    .content {
      display: block;
      .form-item {
        .icon-show-password {
          cursor: pointer;
          position: absolute;
          bottom: 0;
          right: 14px;
          color: #a19f9d;
        }

        .list-role {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          ::v-deep .el-checkbox {
            // margin-bottom: 12px;
            width: fit-content;
            margin: 0;
          }
          ::v-deep .el-checkbox:nth-child(odd) {
            flex-basis: 52%;
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

        .bg-line {
          height: 8px;
          background-color: #f6f8fc;
          margin: 0 -24px;
        }

        .status-active {
          padding: 24px 0;
          ::v-deep.switch-status {
            .el-switch__core {
              width: 46px;
              height: 28px;
              border-radius: 33px;
              &::after {
                width: 24px;
                height: 24px;
              }
            }
          }
          ::v-deep.switch-status.is-checked {
            .el-switch__core::after {
              margin-left: -25px;
            }
          }
        }
      }
    }

    .footer {
      .wrap-button {
        justify-content: flex-end;
        .add-member {
          height: 40px;
          font-weight: 400;
          padding: 0 8px;
          &:hover {
            border: 1px solid transparent;
          }
        }
      }
      .jc-space-between {
        justify-content: space-between;
      }
      .btn-left {
        .btn-close {
          padding: 0;
          height: 40px;
        }
      }
      .btn-close:focus {
        color: var(--bc-btn-text);
        background-color: var(--bc-bg-white);
      }
    }
  }
</style>
