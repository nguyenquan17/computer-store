<template>
  <div class="landing-cart m-auto max-w-[1232px] px-8 py-8">
    <div class="mr-4 w-[66.67%]">
      <h1 class="mb-4 text-2xl font-bold">Giỏ hàng</h1>
      <div class="mb-4 flex justify-between text-sm text-description">
        <p>Giỏ hàng (03) sản phẩm</p>
        <p class="mr-4 cursor-pointer text-hyperlink">Xóa tất cả</p>
      </div>
    </div>
    <div class="flex w-full">
      <div class="block-left mr-4 w-[66.67%] rounded bg-white">
        <!--        <div class="flex items-center justify-between border-b border-solid border-[#eaeaea] px-4 py-4">-->
        <!--          <div class="max-w-[4%] flex-[0_0_4%]">-->
        <!--            <el-checkbox v-model="isCheckAll" :indeterminate="isIndeterminate" size="large" @change="handleCheckAllChange" />-->
        <!--          </div>-->
        <!--          <div class="flex flex-[0_0_96%] justify-between text-sm font-bold">-->
        <!--            <div class="flex w-full justify-between">-->
        <!--              <div class="flex-[0_0_50%]"></div>-->
        <!--              <div class="flex w-full justify-between">-->
        <!--                <div class="max-w-[16%]">Đơn giá</div>-->
        <!--                <div class="max-w-[20%]">Số lượng</div>-->
        <!--                <div class="max-w-[28%]">Thành tiền</div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <!--        &lt;!&ndash;        <el-checkbox-group v-model="cartItemSelected" :value="item" size="large" @change="updateCheckAllItem()">&ndash;&gt;-->
        <!--        &lt;!&ndash;        </el-checkbox-group>&ndash;&gt;-->
        <!--        <div v-for="item in allItems" :key="item.id" class="flex justify-between px-4 py-4">-->
        <!--          <div class="max-w-[4%] flex-[0_0_4%]">-->
        <!--            <el-checkbox v-model="cartItemSelected" :label="item" size="large" @change="updateCheckAllItem"-->
        <!--              >{{}}-->
        <!--              <div class="flex flex-[0_0_96%] justify-between text-sm font-bold">-->
        <!--                <div class="max-w-[16.66%]">Đơn giá</div>-->
        <!--                <div class="max-w-[16.66%]">Số lượng</div>-->
        <!--                <div class="max-w-[16.66%]">Thành tiền</div>-->
        <!--              </div>-->
        <!--            </el-checkbox>-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        -->
        <base-table
          ref="multipleTableRef"
          :data="allItems"
          :showPagination="false"
          class="table-cart"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column label="" width="">
            <template #default="scope">
              <div class="flex items-center">
                <img :src="scope.row.productImageMain" alt="" height="80" width="80" />
                <p class="ml-2 text-sm line-clamp-2">{{ scope.row.productName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" label="Đơn giá" property="totalPricePerProduct" width="120" />
          <el-table-column align="center" label="Số lượng" property="itemQuantity" width="130">
            <template #default="scope">
              <el-input-number v-model="scope.row.itemQuantity" />
            </template>
          </el-table-column>
          <el-table-column align="right" label="Thành tiền" property="productLatestPrice" show-overflow-tooltip width="120" />
        </base-table>
      </div>
      <div class="block-right max-h-[300px] w-[33.33%] rounded bg-white">
        <div class="px-6 py-6">
          <div class="mb-4 text-base font-bold">Thanh toán</div>
          <div class="mb-1 flex justify-between">
            <h3>Tổng tạm tính</h3>
            <span>8.890.000₫</span>
          </div>
          <div class="mb-12 flex justify-between">
            <h3>Thành tiền</h3>
            <span>8.890.000₫</span>
          </div>
          <base-button class="mb-4" @click="handleNavigationCheckout">Tiếp tục</base-button>
          <base-button type="plain">Trở lại mua hàng</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import BaseTable from '@/components/base/table/BaseTable.vue'

  const multipleSelection = ref<any>([])
  const isCheckAll = ref(false)
  const isIndeterminate: Ref<boolean> = ref(true)
  const allItems: Ref<Record<string, any>[]> = ref([
    {
      productId: 1,
      productName:
        'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
      productImageMain:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw',
      itemQuantity: 3,
      productLatestPrice: 25990000,
      totalPricePerProduct: 2599000
    },
    {
      productId: 2,
      productName:
        'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
      productImageMain:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw',
      itemQuantity: 3,
      productLatestPrice: 25990000,
      totalPricePerProduct: 2599000
    }
  ])
  const cartItemSelected: Ref<boolean> = ref(false)
  const updateCheckAllItem = (): void => {}
  const handleNavigationCheckout = (): void => {
    router.push({ name: 'CheckoutView' })
  }

  const handleSelectionChange = (val: any): void => {
    console.log(val)
    multipleSelection.value = val
  }
  // const selectedItem: Ref<Record<string, any>> = ref({})

  // const checkAllItem = (): void => {
  //   isCheckAll.value = !isCheckAll.value
  //   cartItemSelected.value = []
  //   if (isCheckAll.value) {
  //     for (const key in fakeCart.value) {
  //       console.log(key)
  //       cartItemSelected.value.push(fakeCart.value[key])
  //     }
  //   }
  // }
  // const updateCheckAllItem = (): void => {
  //   isCheckAll.value = fakeCart.value.length === cartItemSelected.value.length
  // }
</script>

<style lang="scss" scoped>
  :deep(.base-table .el-table__header-wrapper .el-table__header thead th .cell) {
    font-size: 14px;
  }

  :deep(.base-table td) {
    border-bottom: none !important;
  }

  :deep(.el-table__inner-wrapper::before) {
    height: 0;
  }

  :deep(.el-input-number) {
    width: 110px;
  }
</style>
