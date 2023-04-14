<template>
  <base-popup name="popup-detail-member" class="popup-member" width="600px" :isShowFooter="false">
    <div class="title-popup" slot="title">
      <span>{{ $t('member.popup.title-detail') }}</span>
    </div>
    <div class="content">
      <div class="content__top">
        <div class="avatar">
          <img v-if="detailRow.avatar" :src="detailRow.avatar" alt="" />
          <base-icon v-else icon="default-avatar" size="80" style="display: inline-flex" />
        </div>
        <span class="text-xl text-bold">{{ detailRow.fullName }}</span>
        <div class="roles mb-16">
          <span v-for="role in detailRow.roles" :key="role" class="text-sm role-item">{{ switchRole(role) }}</span>
        </div>
        <div class="cursor wrap-edit" @click="handleEdit">
          <base-icon icon="icon-edit" size="16" style="display: inline-flex" />
          <span>{{ $t('member.popup.edit') }}</span>
        </div>
      </div>
      <div class="bg-line"></div>

      <div class="content__bottom">
        <div class="be-flex align-center jc-space-between item">
          <span>{{ $t('member.popup.email') }}</span>
          <span class="text-base">{{ detailRow.email }}</span>
        </div>
        <div class="be-flex align-center jc-space-between item">
          <span>{{ $t('member.popup.create-date') }}</span>
          <span class="text-base">{{ detailRow.createdAt | formatDateHourMs }}</span>
        </div>
        <div class="be-flex align-center jc-space-between item">
          <span>{{ $t('member.popup.last-login') }}</span>
          <span class="text-base">{{ detailRow.lastTimeLogin | formatDateHourMs }}</span>
        </div>
        <div class="be-flex align-center jc-space-between item">
          <span>{{ $t('member.popup.active-status') }}</span>
          <span class="text-base" :class="detailRow.status === 'INACTIVE' ? 'inactive' : 'active'">{{ switchStatus(detailRow.status) }}</span>
        </div>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'

  import PopupMixin from '@/mixins/popup'

  @Component({
    components: {}
  })
  export default class PopupDetailMember extends Mixins(PopupMixin) {
    @Prop({ required: false, type: Object, default: () => ({}) }) detailRow!: Record<string, any>

    switchRole(role: string): string {
      switch (role) {
        case 'SUPERADMIN':
          return this.$t('member.sort.spadmin') as string
        case 'ADMIN':
          return this.$t('member.sort.admin') as string
        case 'SUPPORT':
          return this.$t('member.sort.support') as string
        case 'MARKETING':
          return this.$t('member.sort.mkt') as string
        case 'BOOKING':
          return this.$t('member.sort.booking') as string
        case 'SETUPNFT':
          return this.$t('member.sort.setupNft') as string
        case 'MARKETPLACEADMIN':
          return this.$t('member.sort.marketplaceAdmin') as string
        default:
          return this.$t('member.sort.accountant') as string
      }
    }
    switchStatus(status: string): string {
      switch (status) {
        case 'INACTIVE':
          return this.$t('member.inactive') as string

        default:
          return this.$t('member.active') as string
      }
    }

    handleEdit(): void {
      this.$emit('openEdit', this.detailRow)
      this.setOpenPopup({
        popupName: 'popup-detail-member',
        isOpen: false
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
      &__top {
        text-align: center;
        position: relative;
        .avatar {
          img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
          }
        }
        .roles {
          .role-item {
            color: #5b616e;
            position: relative;
          }
          .role-item:not(:last-child) {
            padding-right: 20px;
          }
          .role-item:not(:first-child)::before {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #dbdbdb;
            top: 50%;
            left: -13px;
            transform: translateY(-50%);
          }
        }
        .wrap-edit {
          padding: 6px 12px;
          width: fit-content;
          border: 1px solid #89909e;
          border-radius: 4px;
          display: flex;
          align-items: center;
          position: absolute;
          top: 0;
          right: 0;
          span:last-child {
            padding-left: 10px;
          }
        }
      }
      .bg-line {
        height: 8px;
        background-color: #f6f8fc;
        margin: 0 -24px;
      }
      &__bottom {
        padding: 12px 0;
        .item {
          height: 48px;
          border-bottom: 1px solid #dbdbdb;
        }
        .item:last-child {
          border-bottom: none;
        }
        .active {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #129961;
            top: 50%;
            left: -16px;
            transform: translateY(-50%);
          }
        }
        .inactive {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #dbdbdb;
            top: 50%;
            left: -16px;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
</style>
