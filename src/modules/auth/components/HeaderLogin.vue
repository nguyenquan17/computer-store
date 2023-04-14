<template>
  <div class="header-login be-flex align-center jc-space-between">
    <div class="header-login__left be-flex align-center cursor" @click="redirect">
      <!-- <base-icon icon="logo-login" size="32" /> -->
      <img src="../../../assets/images/logo-70.png" alt="" width="50px" />
      <!-- <span class="title">LYNKEY</span> -->
    </div>
    <div class="header-login__right be-flex align-center">
      <div class="item cursor mr-24" @click="handleClick">
        <span>{{ $t('login.support') }}</span>
      </div>
      <div class="item cursor mr-24">
        <el-dropdown trigger="click" class="pl-2 login-page-header" @command="handleCommand">
          <span class="el-dropdown-link" style="color: #201f1e"> {{ $t('login.download') }}<i class="el-icon-arrow-down el-icon--right"></i> </span>

          <el-dropdown-menu slot="dropdown" class="header-downloadapp">
            <div class="dropdown-group pb-1">
              <div class="dropdown-group-title">Application for mobile devices</div>
              <el-dropdown-item command="chplay"><base-icon icon="chplay" style="font-size: 16px" /><span class="pl-1">Get the app on Google Play</span></el-dropdown-item>
              <el-dropdown-item command="appstore"><base-icon icon="appstore" style="font-size: 17px" /><span class="pl-1">Get the app on App Store</span></el-dropdown-item>
            </div>
            <!-- <div class="dropdown-group pb-1 pt-1" style="border-top: 1px solid #dbdbdb">
              <div class="dropdown-group-title">Applications for computers</div>
              <el-dropdown-item command="macos"><base-icon icon="macos" style="font-size: 18px" /><span class="pl-1">Download apps for macOS</span></el-dropdown-item>
              <el-dropdown-item command="window"><base-icon icon="window" style="font-size: 19px" /><span class="pl-1">Download apps for Windows</span></el-dropdown-item>
            </div> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="item cursor be-flex align-center">
        <base-icon icon="email" size="20" style="padding-right: 5px" />
        <span>{{ urlSystem['system.token.support_email'] }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  const beBase = namespace('beBase')

  @Component
  export default class HeaderLogin extends Vue {
    @beBase.State('urlSystem') urlSystem!: Record<string, any>

    redirect(): void {
      this.$router.push({ name: 'login' })
    }
    handleClick(): void {
      window.open(`${this.urlSystem['system.token.support.url']}`)
    }

    handleCommand(command: string): void {
      if (command === 'chplay') {
        window.open(`${this.urlSystem['system.token.app.android.download']}`)
      } else {
        window.open(`${this.urlSystem['system.token.app.ios.download']}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  .header-login {
    height: 70px;
    background-color: var(--bc-bg-white);
    padding: 0 40px;
    border-bottom: 1px solid #d2d0ce;

    &__left {
      .title {
        font-size: 18px;
        color: #1741b5;
        font-weight: 700;
        margin-left: 8px;
      }
    }
    &__right {
      .item {
        color: #201f1e;
      }
    }
  }
</style>
