<template>
  <base-popup name="popup-setting-round-member" class="popup-member" width="480px" :close="handleClose" :open="handleOpen">
    <div class="title-popup" slot="title">
      <span>{{ getTitle }}</span>
    </div>
    <div class="content" v-loading="isLoading">
      <el-form class="form-item" :model="form" :rules="rules" ref="setting-round-member" autocomplete="off">
        <el-form-item :label="$t('label.email')" :class="isEmailFailed ? 'is-error' : null" prop="userEmail">
          <el-select
            v-model="form.userEmail"
            class="w-100"
            filterable
            remote
            clearable
            reserve-keyword
            :disabled="type === 'edit'"
            :placeholder="$t('placeholder.email')"
            :remote-method="handleFindCustomer"
            @change="handleSelectCustomer"
            @clear="handleClearEmail"
          >
            <div v-infinite-scroll="loadMoreCustomer" infinite-scroll-delay="500">
              <el-option v-for="item in listCustomer" :key="item.id" :label="item.email" :value="item.email"> </el-option>
            </div>
          </el-select>
          <!-- <el-input
            v-model="form.userEmail"
            autocomplete="new-password"
            :readonly="false"
            :placeholder="$t('placeholder.email')"
            :disabled="type === 'edit'"
            clearable
            @input="handleFindCustomer"
            @clear="handleClearEmail"
          /> -->
          <!-- <small class="small" v-if="isEmailFailed">{{ $t('notify.not-find-customer') }}</small> -->
        </el-form-item>

        <div class="be-flex jc-space-between">
          <el-form-item :label="$t('label.f-name')" class="be-flex-item mr-16" prop="firstName">
            <el-input v-model="form.userFirstName" :placeholder="$t('placeholder.f-name')" disabled clearable />
          </el-form-item>

          <el-form-item :label="$t('label.l-name')" class="be-flex-item" prop="lastName">
            <el-input v-model="form.userLastName" :placeholder="$t('placeholder.l-name')" disabled clearable />
          </el-form-item>
        </div>

        <el-form-item :label="$t('label.round')" class="is-required" prop="role">
          <el-checkbox-group v-model="listRoundChecked" class="list-role" @change="isNotChooseRound = false">
            <el-checkbox v-for="(round, index) in listRound" :key="round.id" :label="round.id" :disabled="checkDisableRound(index)">{{ round.name }}</el-checkbox>
          </el-checkbox-group>
          <small class="small" v-if="isNotChooseRound">{{ $t('notify.choose-round') }}</small>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button" :class="type === 'edit' ? 'jc-space-between' : null">
        <div class="btn-left" v-if="type === 'edit'">
          <el-button class="btn-default btn-close btn-h-40 mr-16 btn-delete" @click="handleDelete">{{ $t('button.delete') }}</el-button>
        </div>
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" :class="isEmailFailed ? 'btn--disabled' : null" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.save') }}</span>
          </button>
        </div>
      </div>
    </div>

    <popup-confirm @delete="confirmDelete" />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'
  import PopupConfirm from './PopupConfirm.vue'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'
  import getRepository from '@/services'
  import { namespace } from 'vuex-class'
  import { filter, findIndex, forEach, trim } from 'lodash'

  const crowdsaleBo = namespace('crowdsaleBo')

  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')

  @Component({
    components: { PopupConfirm }
  })
  export default class PopupSettingRoundMember extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) detailRow!: Record<string, any>
    @Prop({ required: false, type: Array, default: () => [] }) listRound!: Record<string, any>[]
    @Prop({ required: true, type: String, default: 'add' }) type!: string
    @Prop({ required: true, type: Number, default: 0 }) userId!: number
    @Prop({ required: true, type: Number, default: 0 }) tabActive!: number

    @crowdsaleBo.State('roundCurrent') roundCurrent!: Record<string, any>

    form = {
      userEmail: '',
      userFirstName: '',
      userLastName: ''
    }
    listRoundChecked: number[] = []
    listCustomer: Record<string, any>[] = []
    listCustomerClone: Record<string, any>[] = []

    isLoading = false
    isEmailFailed = false
    isNotChooseRound = false

    limit = 20
    emailSearch = ''

    objRound = {}

    rules: Record<string, any> = {
      userEmail: [
        {
          required: true,
          message: this.$t('member.validate.wrong-email'),
          trigger: 'change'
        }
      ]
    }

    get indexRoundCurrent(): number {
      if (this.listRound.length && this.roundCurrent) {
        return findIndex(this.listRound, round => round.id === this.roundCurrent.id)
      }
      return 0
    }

    get getTitle(): string {
      if (this.type === 'add') {
        return this.$t('crowdsale.popup.title-member') as string
      }
      return this.$t('crowdsale.popup.title-member-edit') as string
    }

    // @Watch('form.userEmail') watchEmail(email: string): void {
    //   if (email === '') {
    //     this.isEmailFailed = false
    //   }
    // }

    checkDisableRound(index: number): boolean {
      forEach(this.listRound, (round, index) => {
        if (index < this.indexRoundCurrent) {
          this.objRound[round.id] = true
        }
      })
      return index < this.indexRoundCurrent
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-setting-round-member',
        isOpen: false
      })
    }

    handleOpen(): void {
      //@ts-ignore
      this.$refs['setting-round-member']?.clearValidate()
      this.isEmailFailed = false
      if (this.type === 'edit') {
        this.isLoading = true
        apiCrowdsale
          .getDetailRoundUser(this.userId)
          .then(res => {
            this.form = { ...res }
            forEach(res.listRoundOfUser, elm => {
              this.listRoundChecked.push(elm.roundId)
            })
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
          })
      } else {
        this.handleFindCustomer(' ', true)
        const roundId = this.listRound[this.tabActive].id
        this.listRoundChecked.push(roundId)
      }
    }

    handleClose(): void {
      this.listRoundChecked = []
      this.isNotChooseRound = false
      this.form = {
        userEmail: '',
        userFirstName: '',
        userLastName: ''
      }
      //@ts-ignore
      this.$refs['setting-round-member'].clearValidate()
    }

    handleDelete(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-buyer',
        isOpen: true
      })
    }

    confirmDelete(): void {
      const keyObj = Object.keys(this.objRound)
      const roundIds: number[] = this.listRoundChecked.filter((element: any) => keyObj.includes(element + ''))

      const data = {
        roundIds,
        userEmail: this.form.userEmail
      }
      apiCrowdsale.updateBuyer(data).then(() => {
        const message: any = this.$t('notify.delete-buyer')
        this.$message.success({ message, duration: 5000 })
        this.handleCancel()
        this.$emit('reload')
      })
    }

    handleClearEmail(): void {
      this.form.userFirstName = ''
      this.form.userLastName = ''
      this.listCustomer = [...this.listCustomerClone]
      this.limit = 20
      this.emailSearch = ''
    }

    // handleFindCustomer(): void {
    //   this.debouneFindCustomer(this)
    // }

    // debouneFindCustomer = debounce(_this => {
    //   if (_this.form.userEmail) {
    //     const params = {
    //       email: _this.form.userEmail,
    //       limit: 1000
    //     }
    //     apiCrowdsale.findCustomerByEmail(params).then(res => {
    //       if (res) {
    //         _this.form.userFirstName = res.firstName
    //         _this.form.userLastName = res.lastName
    //         _this.isEmailFailed = false
    //       } else {
    //         _this.isEmailFailed = true
    //         _this.form.userFirstName = ''
    //         _this.form.userLastName = ''
    //       }
    //       //@ts-ignore
    //       _this.$refs['setting-round-member']?.fields.find(f => f.prop == 'userEmail').clearValidate()
    //     })
    //   }
    // }, 500)

    loadMoreCustomer(): void {
      this.limit += 20
      const params = {
        email: this.emailSearch,
        limit: this.limit
      }
      apiCrowdsale.findCustomerByEmail(params).then(res => {
        this.listCustomer = res
      })
    }

    handleFindCustomer(query: string, isFirst = false): void {
      if (query !== '') {
        this.emailSearch = trim(query)
        this.limit = 20
        const params = {
          email: this.emailSearch,
          limit: 20
        }
        apiCrowdsale.findCustomerByEmail(params).then(res => {
          this.listCustomer = res
          if (isFirst) {
            this.listCustomerClone = res
          }
        })
      } else {
        this.limit = 20
        this.emailSearch = ''
        this.listCustomer = [...this.listCustomerClone]
      }
    }

    handleSelectCustomer(value: string): void {
      const customer = filter(this.listCustomer, elm => elm.email === value)
      if (customer.length) {
        this.form.userFirstName = customer[0].firstName
        this.form.userLastName = customer[0].lastName
      }
    }

    handleSubmit(): void {
      if (!this.listRoundChecked.length) {
        //@ts-ignore
        this.$refs['setting-round-member']?.validate()
        this.isNotChooseRound = true
        return
      }
      //@ts-ignore
      this.$refs['setting-round-member']?.validate(valid => {
        if (valid) {
          const data = {
            roundIds: this.listRoundChecked,
            userEmail: this.form.userEmail
          }
          if (this.type === 'add') {
            apiCrowdsale.createBuyer(data).then(() => {
              const message: any = this.$t('notify.add-buyer')
              this.$message.success({ message, duration: 5000 })
              this.handleCancel()
              this.$emit('reload')
            })
          } else {
            apiCrowdsale.updateBuyer(data).then(() => {
              const message: any = this.$t('notify.update-buyer')
              this.$message.success({ message, duration: 5000 })
              this.handleCancel()
              this.$emit('reload')
            })
          }
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
            font-size: 16px;
            font-weight: 400;
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
        .btn-delete:hover {
          border: 1px solid var(--bc-btn-bg-reject);
          color: var(--bc-status-error);
        }
      }
      .btn-close:focus {
        color: var(--bc-btn-text);
        background-color: var(--bc-bg-white);
      }
    }
  }
  .small {
    color: var(--bc-status-error);
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
</style>
