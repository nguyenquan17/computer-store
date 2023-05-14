<template>
  <div class="m-auto h-full max-w-[1232px]">
    <div class="flex h-full items-center">
      <div class="flex items-center pl-2 pr-2">
        <router-link to="/">
          <base-icon icon="logo-icon" size="36"></base-icon>
        </router-link>
        <el-popover :width="200" placement="bottom" title="" trigger="click">
          <div>
            <MenuCategory />
          </div>
          <template #reference>
            <el-button class="m-2 h-[37px]">
              <el-icon class="mr-2 text-[20px]">
                <Expand />
              </el-icon>
              Danh mục sản phẩm
            </el-button>
          </template>
        </el-popover>
      </div>
      <div class="search-bar flex-auto pl-2 pr-2">
        <el-input v-model="form.inputSearch" class="h-[37px]" placeholder="Nhập từ khóa cần tìm kiếm">
          <template #append>
            <el-button>
              <el-icon class="text-base text-[#82869E]">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <div class="flex min-w-[190px] items-center gap-2 pl-2 pr-2">
        <base-icon color="#82869E" icon="default-avatar" size="36"></base-icon>
        <div v-if="!authStore.isLogin" class="flex text-sm">
          <p class="cursor-pointer select-none hover:underline hover:underline-offset-4" @click="handleOpenPopup('signIn')">
            Đăng nhập
          </p>
          <span>/</span>
          <p class="cursor-pointer select-none hover:underline hover:underline-offset-4" @click="handleOpenPopup('signUp')">
            Đăng ký
          </p>
        </div>
        <div v-else class="flex items-center">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link font-medium text-description">
              Xin Chào, Nguyễn Quân<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="dropdown-menu-profile">
                <el-dropdown-item command="profile">Thông tin cá nhân</el-dropdown-item>
                <el-dropdown-item command="my-order">Quản lý đơn hàng</el-dropdown-item>
                <el-dropdown-item command="my-admin">Quản lý sản phẩm</el-dropdown-item>
                <el-dropdown-item command="logout" divided>Đăng xuất</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="flex min-w-[68px] cursor-pointer items-center justify-center pl-2 pr-2">
        <el-icon class="text-[32px] text-[#82869E]">
          <Bell />
        </el-icon>
      </div>
      <div class="flex cursor-pointer items-center gap-2 pl-2 pr-2 hover:text-secondary">
        <el-icon class="text-[32px] text-[#82869E]">
          <ShoppingTrolley />
        </el-icon>
        <div class="text-sm" @click="handleCart">
          <p>Giỏ hàng của bạn</p>
          <div class="flex items-center">
            <span>(0)</span>
            <p>sản phẩm</p>
          </div>
        </div>
      </div>
    </div>
    <PopupLogin />
    <PopupRegister />
  </div>
</template>

<script lang="ts" setup>
  import { Bell, ShoppingTrolley, Search, Expand, ArrowDown } from '@element-plus/icons-vue'
  import { useBaseStore } from '@/stores/base'
  import PopupLogin from '@/modules/auth/components/PopupLogin.vue'
  import PopupRegister from '@/modules/auth/components/PopupRegister.vue'
  import MenuCategory from '@/modules/landing/components/MenuCategory.vue'
  import { useAuthStore } from '@/modules/auth/store'
  import { ElMessage } from 'element-plus'

  const router = useRouter()
  const baseStore = useBaseStore()
  const authStore = useAuthStore()
  const form: Ref<Record<string, any>> = ref({
    inputSearch: ''
  })

  const handleCart = (): void => {
    if (!authStore.isLogin) {
      ElMessage.error({ message: 'Vui lòng đăng nhập để xem giỏ hàng', duration: 5000 })
      baseStore.setOpenPopup(true, 'popup-login')
    } else {
      router.push({ name: 'Cart' })
    }
  }

  const handleOpenPopup = (type: string): void => {
    if (type === 'signIn') {
      baseStore.setOpenPopup(true, 'popup-login')
    } else if (type === 'signUp') {
      baseStore.setOpenPopup(true, 'popup-register')
    }
  }
  const handleCommand = (command: string | number | object) => {
    if (command === 'logout') {
      console.log(command)
      console.log(authStore.authUser)
      authStore.logout()
      router.push({ name: 'LandingPage' })
    }
  }
</script>

<style scoped></style>
