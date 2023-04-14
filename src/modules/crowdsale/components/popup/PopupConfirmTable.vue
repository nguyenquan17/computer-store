<template>
  <base-popup name="popup-confirm-buyer-table" class="popup-member" width="400px" :open="handleOpen" :close="handleClose">
    <div class="title-popup" slot="title">
      <span>{{ $t('crowdsale.popup.title-confirm') }}</span>
    </div>
    <div class="content" style="padding-bottom: 24px">
      <span>{{ $t('crowdsale.popup.content-confirm') }}</span>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex wrap-button">
        <div class="btn-right">
          <el-button class="btn-default btn-close btn-h-40 mr-16" @click="handleCancel">{{ $t('button.cancel') }}</el-button>
          <button type="button" class="btn-default-bg text-sm ml-auto add-member" @click="handleSubmit">
            <span>{{ $t('button.submit') }}</span>
          </button>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'
  import getRepository from '@/services'
  import { namespace } from 'vuex-class'
  import { filter, findIndex, forEach, includes } from 'lodash'

  const crowdsaleBo = namespace('crowdsaleBo')

  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')
  @Component({
    components: {}
  })
  export default class PopupConfirm extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Array, default: () => [] }) listRound!: Record<string, any>[]
    @Prop({ required: true, type: Number, default: 0 }) userId!: number
    @Prop({ required: true, type: Number, default: 0 }) tabActive!: number
    @crowdsaleBo.State('roundCurrent') roundCurrent!: Record<string, any>

    form = {
      userEmail: '',
      userFirstName: '',
      userLastName: ''
    }
    listRoundChecked: number[] = []
    objRound = {}

    get indexRoundCurrent(): number {
      if (this.listRound.length && this.roundCurrent) {
        return findIndex(this.listRound, round => round.id === this.roundCurrent.id)
      }
      return 0
    }

    handleCancel(): void {
      this.setOpenPopup({
        popupName: 'popup-confirm-buyer-table',
        isOpen: false
      })
    }

    handleClose(): void {
      this.listRoundChecked = []
    }

    handleOpen(): void {
      apiCrowdsale.getDetailRoundUser(this.userId).then(res => {
        this.form = { ...res }
        forEach(res.listRoundOfUser, elm => {
          this.listRoundChecked.push(elm.roundId)
        })
        forEach(this.listRound, (round, index) => {
          if (index < this.indexRoundCurrent) {
            this.objRound[round.id] = true
          }
        })
      })
    }

    handleSubmit(): void {
      const idCurrent = this.listRound[this.tabActive].id

      const roundIds: number[] = this.listRoundChecked.filter((element: any) => ![idCurrent].includes(element))

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
