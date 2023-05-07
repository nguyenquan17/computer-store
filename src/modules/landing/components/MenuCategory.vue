<template>
  <div class="menu-category select-none">
    <div class="flex">
      <div class="h-[456px] w-[200px] rounded-lg bg-[#fff]">
        <div
          v-for="(item, index) in listMenu"
          :key="item.id"
          class="relative"
          @mouseleave="hideMenu(index)"
          @mouseover="showMenu(index)"
        >
          <div
            class="flex h-[32px] cursor-pointer items-center gap-x-[8px] rounded-lg px-2 hover:bg-[#f3f5fc] hover:text-[#024dbc]"
          >
            <base-icon :icon="item.icon" size="24"></base-icon>
            <div class="text-xs font-bold">
              {{ item.menu }}
              <!--            <div v-show="item.visible">-->
              <!--              <h3>{{ item.children.title }}</h3>-->
              <!--              <div v-for="child in item.children.subMenu" :key="child.id">-->
              <!--                <div>{{ child.menu }}</div>-->
              <!--              </div>-->
              <!--            </div>-->
            </div>
            <div
              v-show="item.visible"
              :style="{ top: calcMenuCategory(index) + 'px' }"
              class="absolute left-[188px] flex h-[456px] w-[1008px] flex-wrap rounded-lg bg-white"
            >
              <div v-for="(child, idx) in item.children.listSubMenu" :key="idx" class="px-6 py-4">
                <h3 class="font-bold hover:text-secondary">{{ child.title }}</h3>
                <div
                  v-for="childMini in child.subMenu"
                  :key="childMini.id"
                  class="py-1 text-sm font-semibold text-description hover:text-secondary"
                >
                  <div>{{ childMini.menu }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        <div v-for="(menu, index) in listMenu" :key="index" class="dropdown-content">-->
        <!--          <div-->
        <!--            v-show="menu.visible"-->
        <!--            class="dropdown-content left absolute top-[-64px] left-[200px] h-[456px] w-[1008px] rounded-lg bg-white"-->
        <!--          >-->
        <!--            <h3>{{ menu.children.title }}</h3>-->
        <!--            <div v-for="child in menu.children.subMenu" :key="child.id">-->
        <!--              <div>{{ child.menu }}</div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
      <!--      <div v-for="(menu, index) in listMenu" :key="index" class="dropdown-content">-->
      <!--        <div v-show="menu.visible" class="dropdown-content left absolute top-0 h-[456px] w-[1008px] rounded-lg bg-white">-->
      <!--          <h3>{{ menu.children.title }}</h3>-->
      <!--          <div v-for="child in menu.children.subMenu" :key="child.id">-->
      <!--            <div>{{ child.menu }}</div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="w-full bg-white">-->
      <!--        -->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  const showMenu = index => {
    console.log(index)
    // listMenu.value[index] = { visible: true }
    listMenu.value[index].visible = true
  }
  const hideMenu = index => {
    // listMenu.value[index] = {visible: false}
    listMenu.value[index].visible = false
  }

  const calcMenuCategory = index => {
    return index * -32
  }
</script>
<style lang="scss" scoped></style>
