<template>
  <div class="menu-category select-none">
    <div class="flex">
      <div class="h-[456px] w-[200px] rounded-lg bg-[#fff]">
        <div
          v-for="(item, index) in listCategoryFilter"
          :key="item.id"
          class="relative"
          @click="handleClickMenu(item)"
          @mouseleave="hideMenu(index)"
          @mouseover="showMenu(index)"
        >
          <div
            class="flex h-[32px] cursor-pointer items-center gap-x-[8px] rounded-lg px-2 hover:bg-[#f3f5fc] hover:text-[#024dbc]"
          >
            <base-icon :icon="item.icon" color="#0a0b0d" size="24"></base-icon>
            <div class="text-xs font-bold">
              {{ item.name }}
            </div>
            <!--            <div-->
            <!--              v-show="item.visible"-->
            <!--              :style="{ top: calcMenuCategory(index) + 'px' }"-->
            <!--              class="absolute left-[188px] flex h-[456px] w-[1008px] flex-wrap rounded-lg bg-white"-->
            <!--            >-->
            <!--              <div v-for="(child, idx) in item.children.listSubMenu" :key="idx" class="px-6 py-4">-->
            <!--                <h3 class="font-bold hover:text-secondary">{{ child.title }}</h3>-->
            <!--                <div-->
            <!--                  v-for="childMini in child.subMenu"-->
            <!--                  :key="childMini.id"-->
            <!--                  class="py-1 text-sm font-semibold text-description hover:text-secondary"-->
            <!--                >-->
            <!--                  <div>{{ childMini.menu }}</div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useBaseStore } from '@/stores/base'
  import { onMounted } from 'vue'
  import { filter, forEach, includes, map } from 'lodash-es'
  import type { ICategory } from '@/interfaces'

  const router = useRouter()
  const baseStore = useBaseStore()
  // const categoryFilter: Ref<ICategory[]> = ref([])
  const emits = defineEmits<{
    (e: 'click-category'): void
  }>()
  const listMenu: Ref<Record<string, any>> = ref([
    {
      id: 0,
      url: '',
      menu: 'Laptop',
      icon: 'default-avatar',
      // visible: false,
      children: {
        listSubMenu: [
          {
            title: 'Laptop theo thương hiệu',
            subMenu: [
              {
                id: 0,
                url: '',
                menu: 'Apple'
              },
              {
                id: 1,
                url: '',
                menu: 'Dell'
              }
            ]
          },
          {
            title: 'Laptop theo giá',
            subMenu: [
              {
                id: 0,
                url: '',
                menu: 'Dưới 10 triệu'
              },
              {
                id: 1,
                url: '',
                menu: '10-15 triệu'
              },
              {
                id: 1,
                url: '',
                menu: 'trên 20 triệu'
              }
            ]
          }
        ]
      }
    },
    {
      id: 2,
      url: '',
      menu: 'PC - Màn hình máy tính',
      icon: 'default-avatar',
      // visible: false,
      children: {
        title: 'Màn hình theo thương hiệu',
        subMenu: [
          {
            id: 0,
            url: '',
            menu: 'Asus'
          },
          {
            id: 1,
            url: '',
            menu: 'Dell'
          }
        ]
      }
    },
    {
      id: 3,
      url: '',
      menu: 'PC - Linh kiện máy tính',
      icon: 'default-avatar',
      // visible: false,
      children: {
        title: 'Thương hiệu',
        subMenu: [
          {
            id: 0,
            url: '',
            menu: 'Asus'
          },
          {
            id: 1,
            url: '',
            menu: 'Dell'
          }
        ]
      }
    }
  ])

  const listIconCategory: Ref<Record<string, any>[]> = ref([
    {
      icon: 'laptop',
      name: 'Laptop'
    },
    {
      icon: 'keyboard',
      name: 'Bàn phím'
    },
    {
      icon: 'mouse',
      name: 'Chuột máy tính'
    },
    {
      icon: 'cpu',
      name: 'CPU'
    },
    {
      icon: 'hard-disk',
      name: 'Ổ cứng'
    },
    {
      icon: 'ram-memory',
      name: 'RAM'
    },
    {
      icon: 'vga',
      name: 'Card đồ họa'
    },
    {
      icon: 'radiator',
      name: 'Tản nhiệt'
    },
    {
      icon: 'hubs',
      name: 'Hub - bộ chia, chuyển đổi'
    },
    {
      icon: 'television',
      name: 'Tivi'
    },
    {
      icon: 'imac',
      name: 'Màn hình'
    }
  ])

  onMounted(() => {})

  const listCategoryFilter = computed<Record<string, any>[]>(() => {
    let categoryFilter: ICategory[] = []
    categoryFilter = filter(
      baseStore.listAssetCategory,
      item => !includes(['Chip', 'Case máy tính', 'Ghế', 'Micro', 'Webcam', 'Loa'], item.name)
    )
    return (categoryFilter = map(categoryFilter, item => {
      return {
        ...item,
        icon: filter(listIconCategory.value, icon => icon.name === item.name)[0]?.icon
      }
    }))
  })

  const handleClickMenu = (item: ICategory) => {
    emits('click-category')
    router.push({ name: 'ProductView', params: { category: item.path } })
  }

  const showMenu = index => {
    // listMenu.value[index].visible = true
  }
  const hideMenu = index => {
    // listMenu.value[index].visible = false
  }

  // const calcMenuCategory = index => {
  //   return index * -32
  // }
</script>
<style lang="scss" scoped></style>
