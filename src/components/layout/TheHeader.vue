<template>
  <div class="flex items-center justify-between h-full">
    <p class="text-2xl leading-8 font-semibold">{{ route.meta.title }}</p>
    <div class="avatar">
      <el-dropdown trigger="click" placement="bottom-end" popper-class="popper-avatar-header" @command="handleCommand">
        <span class="el-dropdown-link" style="color: #201f1e">
          <base-icon v-if="!user.avatar" icon="default-avatar" size="40" />
          <img v-else :src="user.avatar" class="w-10 h-10 rounded-full object-cover" />
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="item-above">
              <span class="text-base font-semibold text-primary" style="padding-bottom: 4px">{{ user.fullName }}</span>
              <div v-if="user.affiliationCode" class="be-flex align-center ref-code">
                <span class="text-sm" style="color: #5b616e; padding-right: 6px">
                  Referral code: {{ user.affiliationCode }}
                </span>
                <base-icon icon="copy" class="cursor" @click="handleCopyRefCode" />
              </div>
              <span class="line"></span>
            </el-dropdown-item>
            <el-dropdown-item class="item-below" command="change-pass"><span>Change password</span></el-dropdown-item>
            <el-dropdown-item class="item-below" command="logout"><span>Sign out</span></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/modules/Auth/store'
  import { useBaseStore } from '@/stores/base'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const baseStore = useBaseStore()
  const authStore = useAuthStore()

  const router = useRouter()

  const user = computed(() => {
    return authStore.user
  })

  const handleCommand = (command: string) => {
    if (command === 'logout') {
      authStore.logout().then(() => {
        router.push('/login')
      })
    }
  }
  const handleCopyRefCode = () => {
    const el = document.createElement('input')
    el.value = user.value.affiliationCode
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    ElMessage.success('Copied')
  }
</script>

<style lang="scss"></style>
