<template>
  <div class="header">
    <div class="body">
      <div class="content-left">
        <div class="text-2xl title">{{ getTitle }}</div>
      </div>
      <div class="content-right">
        <div class="content">
          <!-- <div class="btn plus">
            <span><base-icon icon="plus" size="24" /></span>
          </div>
          <div class="notification">
            <span><base-icon icon="notification2" size="18" /></span>
          </div>
          <div class="endow">
            <span><base-icon icon="endow" size="18" /></span>
          </div>
          <div class="question">
            <span><base-icon icon="question" size="18" /></span>
          </div> -->
          <div class="avatar">
            <el-dropdown trigger="click" class="pl-2 login-page-header" @command="handleCommand">
              <span class="el-dropdown-link" style="color: #201f1e">
                <base-icon v-if="!user.avatar" icon="default-avatar" size="40" style="display: inline-flex" />
                <img v-else :src="user.avatar" />
              </span>

              <el-dropdown-menu slot="dropdown" class="header-downloadapp header-dropdown">
                <div class="dropdown-group">
                  <el-dropdown-item class="item-above">
                    <span class="text-base text-bold" style="padding-bottom: 4px">{{ user.fullName }}</span>
                    <div v-if="user.affiliationCode" class="be-flex align-center ref-code">
                      <span class="text-sm" style="color: #5b616e; padding-right: 6px">Referral code: {{ user.affiliationCode }}</span>
                      <base-icon icon="icon-copy" class="cursor" @click.native="handleCopyRefCode" />
                    </div>
                    <span class="line"></span>
                  </el-dropdown-item>
                  <el-dropdown-item command="change-pass"
                    ><span>{{ $t('logout.change-pass') }}</span></el-dropdown-item
                  >
                  <el-dropdown-item command="logout"
                    ><span>{{ $t('logout.title') }}</span></el-dropdown-item
                  >
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- <div class="avatar">
            <img src="@/assets/images/avatar.png" alt="" />
          </div> -->
        </div>
      </div>
    </div>
    <popup-change-password />
  </div>
</template>

<script lang="ts">
  import PopupMixin from '@/mixins/popup'
  import { Component, Mixins } from 'vue-property-decorator'
  import PopupChangePassword from './PopupChangePass.vue'
  import getRepository from '@/services'
  import { SettingRepository } from '@/services/repositories/setting'

  const api: SettingRepository = getRepository('setting')

  import { namespace } from 'vuex-class'
  const bcAuth = namespace('beAuth')
  @Component({ components: { PopupChangePassword } })
  export default class MainHeader extends Mixins(PopupMixin) {
    @bcAuth.Action('logout') logout!: () => Promise<any>
    @bcAuth.State('user') user!: Record<string, any>

    // image = './avatar.png'

    get getTitle(): any {
      switch (this.$route.matched[0].path) {
        case '/kyc':
          return this.$t('header.kyc')
        case '/customer':
          return this.$t('header.customer')
        case '/crowd-sale':
          return this.$t('header.crowdsale')
        case '/request':
          return this.$t('header.request')
        case '/balance':
          return this.$t('header.balance')
        case '/transaction':
          return this.$t('header.transaction')
        case '/exception':
          return this.$t('header.exception')
        case '/member':
          return this.$t('header.member')
        case '/report':
          return this.$t('header.report')
        case '/metamart':
          return this.$t('header.nft')
        case '/fee':
          return this.$t('header.fee')
        case '/inventory':
          return this.$t('header.inventory')
        case '/nft-transaction':
          return this.$t('header.transaction')
        case '/fee-nft':
          return this.$t('header.fee-nft')
        case '/request-nft':
          return this.$t('header.request-nft')
        case '/staking':
          return 'Staking'
        case '/commission':
          return 'Commission'
        default:
          return this.$t('header.kyc')
      }
    }

    handleCommand(command: string): void {
      if (command === 'logout') {
        this.logout().then(() => {
          this.$router.push({ name: 'login' })
        })
      }
      if (command === 'change-pass') {
        const data = {
          email: this.user.email,
          type: 'EMAIL',
          reason: 'PROFILE_RESET_PASSWORD'
        }
        api.resendCode(data).then(() => {
          this.setOpenPopup({
            popupName: 'popup-change-password',
            isOpen: true
          })
        })
      }
    }

    handleCopyRefCode(): void {
      let message: any = ''
      const el = document.createElement('input')
      el.value = this.user.affiliationCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      message = this.$t('notify.copy')
      this.$message.success(message)
    }
  }
</script>

<style scoped lang="scss">
  .header {
    width: 99.9%;
    height: 72px;
    // border-color: var(--bc-input-border);
    border-left: 1px solid var(--bc-input-border);
    border-bottom: 1px solid #d2d0ce;
    .body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .content-left {
        width: 50%;
        height: 100%;
        padding: 20px 0px 20px 24px;
        .title {
          width: 150px;
          height: 32px;
          font-weight: 600;
          color: #0a0b0d;
          line-height: 32px;
        }
      }
      .content-right {
        width: 50%;
        height: 100%;
        padding: 17px 24px 15px 0;
        display: flex;
        flex-direction: row-reverse;
        .content {
          width: 232px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          div {
            display: inline-block;
            cursor: pointer;
          }
          .plus {
            width: 45.78px;
            height: 40px;
            border-radius: 50%;
            margin-right: 27px;
            position: relative;
            padding: 0;
            span {
              position: absolute;
              top: 20%;
              left: 20%;
            }
          }
          .notification {
            width: 24px;
            height: 24px;
            margin-right: 18px;
            position: relative;
            span {
              position: absolute;
              top: 8%;
              left: 8%;
            }
          }
          .endow {
            width: 24px;
            height: 24px;
            margin-right: 20px;
            position: relative;
            span {
              position: absolute;
              top: 8%;
              left: 8%;
            }
          }
          .question {
            width: 24px;
            height: 24px;
            margin-right: 24px;
            position: relative;
            span {
              position: absolute;
              top: 8%;
              left: 8%;
            }
          }
          .avatar {
            width: 40px;
            height: 40px;
            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
            }
          }
        }
      }
    }
  }
</style>
