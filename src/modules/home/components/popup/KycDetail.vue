<template>
  <base-popup
    name="popup-kyc-detail"
    class="popup-kyc-detail"
    :class="$route.name === 'KycRejected' ? 'popup-reject-style' : null"
    width="960px"
    :isShowFooter="getShowFooter"
    :open="handleOpen"
    :close="handleClose"
  >
    <div class="title-popup" slot="title">
      <span>{{ $t('kyc.popup.title') }}</span>
    </div>
    <div class="reason-reject mb-24" v-if="$route.name === 'KycRejected'">
      <h3 class="text-xl text-bold mb-16">{{ $t('kyc.reason-reject') }}</h3>
      <ul class="list-reason">
        <li class="text-base item" v-for="item in listReasonReject" :key="item.id">
          {{ $t(`params.` + item.key) }}
        </li>
        <li v-if="detail.kycRejectReasons" class="text-base item">
          {{ $t('kyc.other-reason') }}
          {{ detail.kycRejectReasons }}
        </li>
      </ul>
    </div>
    <h3 class="text-xl text-bold mb-16" v-if="$route.name === 'KycRejected'">{{ $t('kyc.title') }}</h3>
    <div class="be-flex content" v-loading="isLoading">
      <div class="mr-24 detail-left">
        <div class="detail-item detail-item--above">
          <span class="title text-l text-bold">{{ $t('kyc.popup.personal-detail') }}</span>
          <div class="wrap">
            <span class="wrap-small">{{ $t('kyc.popup.f-name') }}</span>
            <span class="name">{{ detail.firstName }}</span>
          </div>
          <div class="wrap">
            <span class="wrap-small">{{ $t('kyc.popup.l-name') }}</span>
            <span class="name">{{ detail.lastName }}</span>
          </div>
          <div class="wrap">
            <span class="wrap-small">{{ $t('kyc.popup.national') }}</span>
            <span class="name">{{ detail.nationality }}</span>
          </div>
        </div>
        <div class="detail-item detail-item--below">
          <span class="title text-l text-bold">{{ $t('kyc.popup.id-verification') }}</span>
          <div class="wrap">
            <span class="wrap-small">{{ $t('kyc.popup.id-type') }}</span>
            <span class="name">{{ detail.identificationType | formatIdentificationType }}</span>
          </div>
          <div class="wrap">
            <span class="wrap-small">{{ $t('kyc.popup.id-number') }}</span>
            <span class="name">{{ detail.identificationNumber }}</span>
          </div>
        </div>
      </div>
      <div class="detail-right">
        <span class="text-l text-bold mb-24 d-ib">{{ $t('kyc.popup.title-photo') }}</span>
        <div class="be-flex w-100 slider" v-if="listImage.length">
          <el-carousel indicator-position="none" arrow="always" :autoplay="false">
            <el-carousel-item v-for="(item, index) in listImage" :key="index">
              <!-- <img :src="item" class="img-fluid" :alt="item" /> -->
              <div style="position: relative; width: 100%; height: 100%">
                <el-image
                  style="height: 100%"
                  class="img-fluid"
                  :src="item"
                  :preview-src-list="listImage"
                  v-bind:style="{ transform: 'rotate(' + rotateDeg[index] + 'deg)' }"
                ></el-image>
                <div v-if="$route.name === 'KycPending'" class="rotate be-flex" @click="rotateRightImage(index)">
                  <base-icon icon="icon-rotate" style="color: #5b616e; margin-right: 4px" size="18" class="icon" />
                  Rotate
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <div class="footer" slot="footer">
      <div class="be-flex jc-space-between wrap-button">
        <div class="btn-left">
          <el-button class="btn-default btn-close btn-h-40" @click="handleClose">{{ $t('button.close') }}</el-button>
        </div>
        <div class="btn-right">
          <el-button class="btn btn-reject btn-h-40 is-none-border" @click="handleReject" :disabled="this.isLoading">{{ $t('button.reject') }} </el-button>
          <el-button class="btn btn-approve btn-h-40 is-none-border" @click="handleApprove" :disabled="this.isLoading">{{ $t('button.approve') }} </el-button>
        </div>
      </div>
    </div>
    <popup-reject @reject="submitReject" />
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import PopupReject from './PopupReject.vue'
  import PopupMixin from '@/mixins/popup'
  import getRepository from '@/services'
  import { KycRepository } from '@/services/repositories/kyc'

  const apiKyc: KycRepository = getRepository('kyc')

  import { namespace } from 'vuex-class'
  import { filter } from 'lodash'
  import { debounce } from 'lodash'

  const bcKyc = namespace('bcKyc')

  interface IDetail {
    rfrId: number
    firstName: string | null
    lastName: string | null
    fullName: string | null
    email: string | null
    status: string | null
    kycStatus: string | null
    createdAt: string | null
    nationality: string | null
    identificationType: string | null
    identificationNumber: string | null
    idPhoto1: string
    idPhoto2: string
    selfiePhoto: string
    rotatePhoto1: string
    rotatePhoto2: string
    rotateSelfiePhoto: string
    pinEnabled: string | null
    kycRejectReasonIds: string
    userId: number
  }

  @Component({ components: { PopupReject } })
  export default class KycDetail extends Mixins(PopupMixin) {
    @Prop({ required: true, type: Object, default: {} }) detailRow!: Record<string, any>
    @bcKyc.State('listReason') listReason!: Array<Record<string, any>>

    detail = {} as IDetail
    isLoading = false
    listReasonReject: Array<Record<string, any>> = []
    rotateDeg = {
      0: 0,
      1: 0,
      2: 0
    }
    get listImage(): string[] {
      if (this.detail.userId) {
        return [this.detail.idPhoto1, this.detail.idPhoto2, this.detail.selfiePhoto]
      } else {
        return []
      }
    }

    rotateRightImage(id: number) {
      if (this.rotateDeg[id] < 270) {
        this.rotateDeg[id] += 90
      } else {
        this.rotateDeg[id] = 0
      }
    }

    get getShowFooter(): boolean {
      return this.$route.name === 'KycPending'
    }

    handleGetListRejectOfUser(): void {
      const arrReasonIds = this.detail.kycRejectReasonIds ? this.detail.kycRejectReasonIds.split(',') : ''
      if (arrReasonIds) {
        this.listReasonReject = arrReasonIds.reduce((prev: any, cur) => {
          const value = filter(this.listReason, elm => elm.id == cur)[0]
          prev.push(value)
          return prev
        }, [])
      }
    }

    async handleOpen(): Promise<void> {
      try {
        this.isLoading = true
        this.detail = await apiKyc.getDetailKyc(this.detailRow.userId)
        this.handleGetListRejectOfUser()
        if (this.detailRow) {
          this.rotateDeg = {
            0: this.detailRow.rotatePhoto1 ? parseInt(this.detailRow.rotatePhoto1.replace(/[^0-9]/g, '')) : 0,
            1: this.detailRow.rotatePhoto2 ? parseInt(this.detailRow.rotatePhoto2.replace(/[^0-9]/g, '')) : 0,
            2: this.detailRow.rotateSelfiePhoto ? parseInt(this.detailRow.rotateSelfiePhoto.replace(/[^0-9]/g, '')) : 0
          }
        }
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }
    handleUpdate(): void {
      this.isLoading = true
      const data = {
        ids: [this.detailRow.id]
      }
      const data2 = {
        ...this.detail,
        rotateSelfiePhoto: `rotate(${this.rotateDeg[2]}deg)`,
        rotatePhoto2: `rotate(${this.rotateDeg[1]}deg)`,
        rotatePhoto1: `rotate(${this.rotateDeg[0]}deg)`
      }
      apiKyc
        .updateKyc(data2)
        .then(() => {
          apiKyc
            .approveKyc(data)
            .then(() => {
              const message: any = this.$i18n.t('notify.approve-success')
              this.$message.success({ message, duration: 5000 })
              this.isLoading = false
              this.handleClose()
              this.$emit('init')
            })
            .catch(() => {
              this.isLoading = false
              this.handleClose()
            })
        })
        .catch(error => {
          const { data } = error.response
          if (data.message === 'Kyc has been approved by another admin') {
            this.$emit('init')
          }

          this.isLoading = false
          this.handleClose()
        })
    }

    //protected double click
    debounceApprove = debounce((nameAction: any) => {
      if (nameAction == 'handleSubmit') {
        this.handleUpdate()
      }
    }, 400)
    handleApprove(): void {
      this.debounceApprove('handleSubmit')
    }
    debounceReject = debounce((data: Record<string, any>) => {
      this.reject(data)
    }, 400)
    submitReject(data: Record<string, any>) {
      this.debounceReject(data)
    }
    async reject(data: Record<string, any>): Promise<void> {
      try {
        this.isLoading = true
        const data2 = {
          ...this.detail,
          rotateSelfiePhoto: `rotate(${this.rotateDeg[2]}deg)`,
          rotatePhoto2: `rotate(${this.rotateDeg[1]}deg)`,
          rotatePhoto1: `rotate(${this.rotateDeg[0]}deg)`
        }
        await apiKyc.updateKyc(data2)
        await apiKyc.rejectKyc({ ...data, ids: [this.detailRow.id] })
        const message: any = this.$i18n.t('notify.reject-success')
        this.$message.success({ message, duration: 5000 })
        this.isLoading = false
        this.handleClose()
        this.$emit('init')
      } catch (error) {
        console.log(error)
      }
    }

    handleReject(): void {
      this.setOpenPopup({
        popupName: 'popup-reject',
        isOpen: true
      })
    }

    handleClose(): void {
      this.detail = {} as IDetail
      this.setOpenPopup({
        popupName: 'popup-kyc-detail',
        isOpen: false
      })
    }
  }
</script>

<style scoped lang="scss">
  .popup-kyc-detail {
    color: var(--bc-text-primary);

    .content {
      padding-bottom: 24px;

      .detail-left {
        border-radius: 4px;
        width: 216px;
        background-color: #fff;
        padding: 24px 24px 52px;
        box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);

        .title {
          margin-bottom: 8px;
          display: inline-block;
        }

        .detail-item--above {
          padding-bottom: 24px;
          border-bottom: 1px solid #d2d0ce;
        }

        .detail-item--below {
          margin-top: 24px;
        }

        .wrap {
          &:not(:last-child) {
            margin-bottom: 16px;
          }

          .name {
            font-size: 16px;
          }

          .wrap-small {
            font-size: 12px;
            line-height: 16px;
            color: #5b616e;
            display: block;
            margin-bottom: 4px;
          }
        }
      }

      .detail-right {
        flex: 1;
        background-color: #fff;
        box-shadow: 0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13);
        padding: 24px;
        border-radius: 4px;

        .slider {
          ::v-deep .el-carousel {
            width: 100%;

            .el-carousel__container {
              height: 100%;
              // img {
              //   height: 100%;
              // }
              .el-carousel__arrow {
                background: rgba(0, 0, 0, 0.4);
                width: 40px;
                height: 40px;

                i {
                  font-size: 20px;
                }
              }
            }
          }

          height: calc(100% - 48px);
        }

        .rotate {
          border-radius: 4px;
          padding: 4px 8px;
          position: absolute;
          bottom: 8px;
          left: 45%;
          background: rgba(0, 0, 0, 0.4);
          font-family: Open Sans;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: #ffffff;
          cursor: pointer;
        }
      }
    }

    ::v-deep .popup-content {
      background-color: #f6f8fc;

      .el-image__inner {
        object-fit: contain;
      }
    }
  }

  .popup-reject-style {
    .content {
      background: #f6f8fc;
      padding: 24px;
      border-radius: 4px;
    }

    ::v-deep .popup-content {
      background-color: #fff;

      .el-image__inner {
        object-fit: contain;
      }
    }
  }

  .reason-reject {
    padding-bottom: 40px;
    border-bottom: 1px solid #d2d0ce;

    .list-reason {
      padding: 16px;
      background-color: #fbedee;
      border: 1px solid #cf202f;
      border-radius: 4px;

      .item:not(:last-child) {
        margin-bottom: 4px;
      }

      .item {
        position: relative;
        padding-left: 16px;
        margin-left: 10px;

        &::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: #000;
          border-radius: 50%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .footer {
    .btn-right {
      button[disabled] {
        opacity: 0.5;
      }
    }
  }
</style>
