<template>
  <div class="landing-cart m-auto max-w-[1232px] px-8 py-8">
    <base-loading :fullscreen="true" :loading="isLoading"></base-loading>
    <div class="mr-4 w-[66.67%]">
      <h1 class="mb-4 text-2xl font-bold">Giỏ hàng</h1>
      <div class="mb-4 flex justify-between text-sm text-description">
        <p>Giỏ hàng {{ getLengthCart ? `(${getLengthCart})` : `(0)` }} sản phẩm</p>
        <p class="mr-4 cursor-pointer text-hyperlink">Xóa tất cả</p>
      </div>
    </div>
    <div class="flex w-full">
      <div class="block-left mr-4 w-[66.67%] rounded bg-white">
        <base-table
          ref="multipleTableRef"
          :data="getListCart"
          :showPagination="false"
          class="table-cart"
          @selection-change="handleSelectionChange"
          @row-click="handleClickRow"
        >
          <!--          <el-table-column type="selection" width="40" />-->
          <el-table-column label="" width="">
            <template #default="scope">
              <div class="flex items-center">
                <img :src="scope.row.productImage" alt="" height="80" width="80" />
                <p class="ml-2 text-sm line-clamp-2">{{ scope.row.productName }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" label="Đơn giá" property="productLatestPrice" width="120">
            <template #default="scope">
              <div class="text-sm font-medium">{{ userFormatNumber(scope.row.productLatestPrice) }}đ</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Số lượng" property="itemQuantity" width="130">
            <template #default="scope">
              <!--              <el-input-number v-model="scope.row.itemQuantity" :min="1" @change="handleChangeQuantity($event, scope.row)" />-->
              <div class="flex">
                <el-button
                  :disabled="scope.row.quantity <= 1"
                  class="w-[36px] rounded-tr-none rounded-br-none"
                  @click="handleDecreaseQty(scope.row)"
                  >-
                </el-button>
                <el-input
                  v-model="scope.row.itemQuantity"
                  class="w-[42px] rounded-none"
                  @blur="handleBlurQty"
                  @keypress="useOnlyNumber($event, scope.row.itemQuantity)"
                ></el-input>
                <el-button class="w-[36px] rounded-tl-none rounded-bl-none" @click="handleIncreaseQty(scope.row)">+ </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right" label="Thành tiền" property="totalPricePerProduct" show-overflow-tooltip width="120">
            <template #default="scope">
              <div class="text-sm font-medium">{{ userFormatNumber(scope.row.totalPricePerProduct) }}đ</div>
            </template>
          </el-table-column>
        </base-table>
      </div>
      <div class="block-right max-h-[300px] w-[33.33%] rounded bg-white">
        <div class="px-6 py-6">
          <div class="mb-4 text-base font-bold">Thanh toán</div>
          <div class="mb-1 flex justify-between">
            <h3>Tổng tạm tính</h3>
            <span class="font-bold">{{ userFormatNumber(getPriceProductSelected) }}₫</span>
          </div>
          <div class="mb-12 flex justify-between">
            <h3>Thành tiền</h3>
            <span class="font-bold">{{ userFormatNumber(getPriceProductSelected) }}₫</span>
          </div>
          <base-button :disabled="disableButton" class="mb-4" @click="handleNavigationCheckout">Tiếp tục</base-button>
          <base-button type="plain" @click="router.push({ name: 'LandingPage' })">Trở lại mua hàng</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router'
  import BaseTable from '@/components/base/table/BaseTable.vue'
  import { useCartStore } from '@/modules/cart/store'
  import userFormatNumber from '@/composables/formatNumber'
  import useOnlyNumber from '@/composables/onlyNumber'
  import { forEach } from 'lodash-es'
  import { apiCart } from '@/services'
  import { useAuthStore } from '@/modules/auth/store'
  import BaseLoading from '@/components/base/loading/BaseLoading.vue'

  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const isLoading: Ref<boolean> = ref(false)
  const multipleSelection = ref<any>([])
  const idProductUpdate: Ref<number> = ref(0)
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
  const handleNavigationCheckout = (): void => {
    router.push({ name: 'CheckoutView' })
  }

  const handleSelectionChange = (val: any): void => {
    multipleSelection.value = val
    cartStore.setDataCartItem(val)
  }

  const handleClickRow = (row: Record<string, any>): void => {
    idProductUpdate.value = row.productId
  }

  const handleDecreaseQty = async (row: Record<string, any>): Promise<void> => {
    try {
      isLoading.value = true
      const params = {
        cartId: cartStore.detailCart.cartId,
        productId: row.productId
      }
      await apiCart.removeProductToCart(params)
      await cartStore.getDetailCart()
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
    }
  }
  const handleIncreaseQty = async (row: Record<string, any>): Promise<void> => {
    try {
      isLoading.value = true
      const params = {
        clientId: authStore.user.userId,
        productId: row.productId
      }
      await apiCart.addProductToCart(params)
      await cartStore.getDetailCart()
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
    }
  }

  const handleBlurQty = async (): Promise<void> => {
    try {
      isLoading.value = true
      await cartStore.getDetailCart()
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
    }
  }

  const handleChangeQuantity = (currentVal: number, row: any): void => {
    console.log(currentVal)
    // console.log(oldVal)
    console.log(row)
  }

  onMounted(async () => {
    await cartStore.getDetailCart()
  })
  const getLengthCart = computed<number>(() => {
    let itemQuantity = 0
    forEach(cartStore.detailCart?.cartItemDetailList, item => {
      itemQuantity += item.itemQuantity
    })
    return itemQuantity
  })

  const getListCart = computed<Record<string, any>[]>(() => {
    return cartStore.detailCart?.cartItemDetailList ? cartStore.detailCart.cartItemDetailList : []
  })

  const getPriceProductSelected = computed<number>(() => {
    let totalPrice = 0
    forEach(cartStore.detailCart?.cartItemDetailList, item => {
      totalPrice += item.totalPricePerProduct
    })
    return totalPrice
  })

  // const getCartPrice = computed<number>(() => {
  //   return cartStore.detailCart.cartPrice
  // })

  const disableButton = computed<boolean>(() => {
    return !cartStore.detailCart
  })
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

  :deep(.el-input .el-input__wrapper) {
    border-radius: 0;

    input {
      text-align: center;
    }
  }
</style>
