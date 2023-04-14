<template>
  <el-container class="main-layout" :class="isLoading ? 'be-flex-center' : null">
    <transition name="el-fade-in-linear">
      <base-page-loading v-if="isLoading" />
    </transition>
    <el-aside v-if="!isLoading" class="sidebar-left" style="width: 80px">
      <main-sidebar />
    </el-aside>
    <el-container v-if="!isLoading" class="main-content">
      <el-header class="be-flex main-header" style="height: 70px">
        <div class="be-flex-item">
          <main-header />
        </div>
      </el-header>
      <el-main class="main-center">
        <router-view />
      </el-main>
      <el-footer class="be-flex align-center jc-space-between main-footer">
        <div class="footer-left">
          <span class="text-hyperlink d-ib mr-24 cursor" @click="handleClickTerm">{{ $t('footer.terms') }}</span>
          <span style="color: #5b616e">{{ urlSystem['system.token.company.address'] }}</span>
        </div>

        <div class="footer-right">
          <el-select v-model="selectLanguage" @change="handleChangeLanguage" class="select-language" popper-class="select-language-dropdown">
            <el-option :label="`${$t('login.en')}`" value="en">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="flag-usa" size="14" style="margin-right: 4px" />
                  <span class="lang">{{ $t('login.en') }}</span>
                </div>
              </template>
            </el-option>
            <el-option :label="`${$t('login.vi')}`" value="vi">
              <template>
                <div class="be-flex flag">
                  <base-icon icon="flag-vn" size="19" style="margin-right: 4px; margin-left: -2px" />
                  <span class="lang" style="margin-left: 1px">{{ $t('login.vi') }}</span>
                </div>
              </template>
            </el-option>
            <div class="suffix" slot="prefix">
              <base-icon v-if="getIcon === 'flag-usa'" class="flag-usa" :icon="getIcon" size="14" />
              <base-icon v-else class="flag-vn" :icon="getIcon" size="19" />
            </div>
          </el-select>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import MainSidebar from '../sidebar/MainSidebar.vue'
  import MainHeader from '../header/MainHeader.vue'
  import BasePageLoading from '../page-loading/BasePageLoading.vue'
  import EventBus from '@/utils/eventBus'
  import { namespace } from 'vuex-class'
  import { ParamsRepository } from '@/services/repositories/params'
  import getRepository from '@/services'
  import firebase from '@/utils/firebase'
  import { CrowdsaleRepository } from '@/services/repositories/crowdsale'

  const bcAuth = namespace('beAuth')
  const beBase = namespace('beBase')
  const apiParams: ParamsRepository = getRepository('params')
  const apiCrowdsale: CrowdsaleRepository = getRepository('crowdsale')
  import { initListToken } from '@/configs/format'

  @Component({
    components: { MainSidebar, MainHeader, BasePageLoading }
  })
  export default class Layout extends Vue {
    @beBase.State('urlSystem') urlSystem!: Record<string, any>
    @beBase.Mutation('SET_LIST_ASSET_NETWORK') setLitsAssetNetwork!: (list: Array<Record<string, any>>) => void

    @bcAuth.Action('getInfo') getInfo!: () => Promise<any>

    isLoading = false
    selectLanguage = ''
    timing: any = null
    refAssetNetwork: any = null

    async created(): Promise<void> {
      try {
        this.isLoading = true
        this.selectLanguage = window.localStorage.getItem('bc-lang')!
        // await this.getInfo()
        setTimeout(() => {
          this.getInfo()
        }, 500)

        this.handleSignInFireBase().then(async () => {
          await this.getListAssetNetwork()
          this.isLoading = false
        })
      } catch (error) {
        this.isLoading = false
        console.log(error)
      }
    }
    get getIcon(): string {
      return this.selectLanguage === 'vi' ? 'flag-vn' : 'flag-usa'
    }

    // handleRedirectRoute():void{

    // }

    async handleSignInFireBase(): Promise<any> {
      try {
        const data = {
          password: this.$options.filters?.encryptPassword(process.env.VUE_APP_PASS_FIREBASE!)
        }
        const result = await apiParams.getTokenFirebase(data)
        await firebase.auth().signInWithCustomToken(result.authToken)
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }

    async getListAssetNetwork(): Promise<void> {
      try {
        const result = await apiParams.getAssetNetwork()
        this.setLitsAssetNetwork(result.assets)
        initListToken(result.assets, result.allAsset)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    handleChangeLanguage(lang: string): void {
      this.$i18n.locale = lang
      window.localStorage.setItem('bc-lang', lang)
      // EventBus.$emit('changeLang')
      location.reload()
    }
    handleClickTerm(): void {
      window.open(`${this.urlSystem['system.token.terms']}`)
    }
  }
</script>
<style lang="scss" scoped>
  .main-layout {
    position: relative;
    height: 100vh;
    .sidebar-left {
      border-right: 1px solid #ccc;
      height: 100%;
      overflow: hidden;
      background-color: #e9e9e9;
      position: relative;
    }
    .main-content {
      .main-header {
        padding: 0px;
      }
      .main-center {
        padding: 24px 24px 0 24px;
        background-color: #f6f8fc;
        border-top: 1px solid #d2d0ce;
        overflow-y: scroll;
      }
    }
    .sidebar-right {
      padding-top: 15px;
      border-left: 1px solid hsl(0deg 0% 100% / 10%);
      overflow: hidden;
    }
  }
  .show-player {
    .sidebar-left {
      height: calc(100vh - 90px);
    }
    .main-content {
      height: calc(100vh - 90px);
    }
    .sidebar-right {
      height: calc(100vh - 90px);
    }
  }
  .main-footer {
    border-top: 1px solid var(--bc-border-primary);
    padding: 0 24px;
  }
  .footer-right {
    .suffix {
      .flag-usa {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 7px;
        display: block;
      }
      .flag-vn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 6px;
        display: block;
      }
    }
  }
</style>
