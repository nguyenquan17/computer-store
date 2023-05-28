<template>
  <base-popup
    :is-show-footer="true"
    class="popup-payment-detail"
    name="popup-payment-detail"
    width="1200px"
    @close="handleClose"
    @open="handleOpen"
  >
    <template #title>Chi tiết thanh toán</template>
    <div>
      <div>
        <div class="mb-4">
          <h1 class="mb-4 text-base font-bold">Thông tin nhận hàng</h1>
          <div class="flex w-full text-sm font-medium">
            <h1 class="mr-1 flex-[0_0_12%]">Họ và tên:</h1>
            <div>Nguyễn Anh Quân</div>
          </div>
          <div class="flex w-full text-sm font-medium">
            <h1 class="mr-1 flex-[0_0_12%]">Số điện thoại:</h1>
            <span>0368517926</span>
          </div>
          <div class="flex w-full text-sm font-medium">
            <h1 class="mr-1 flex-[0_0_12%]">Địa chỉ nhận hàng:</h1>
            <div>Số 34 Hoàng Cầu, tòa nhà Viễn Đông, Ô chợ Dừa, Đống Đa, Hà Nội</div>
          </div>
        </div>
        <div>
          <h1 class="mb-4 text-base font-bold">Thông tin đơn hàng</h1>
          <base-table :data="getListCartSelected" :loading="false" :query="{}" label="sản phẩm">
            <el-table-column :index="1" align="center" label="#" type="index" width="80" />
            <el-table-column align="left" label="Tên sản phẩm" prop="name">
              <template #default="scope">
                <div class="flex items-center">
                  <img :src="scope.row.productImage" alt="" height="60" width="60" />
                  <p class="ml-4">{{ scope.row.productName }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right" label="Số lượng" prop="itemQuantity" width="150"></el-table-column>
            <el-table-column align="right" label="Đơn giá" prop="totalPricePerProduct" width="250">
              <template #default="scope">
                <div class="text-sm font-medium">{{ userFormatNumber(scope.row.totalPricePerProduct) }}đ</div>
              </template>
            </el-table-column>
          </base-table>
        </div>
        <div class="mb-4">
          <h1 class="mb-4 text-base font-bold">Thông tin thanh toán</h1>
          <div class="flex w-full items-center text-sm font-medium">
            <h1 class="mr-1 flex-[0_0_16%]">Phương thức thanh toán:</h1>
            <div class="flex items-center">
              <!--            <div class="mr-4 text-sm font-bold">Thanh toán qua</div>-->
              <img alt="" height="50" src="@/assets/images/checkout/paypal-logo.png" width="100" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <base-button class="mr-4" type="plain">Quay lại</base-button>
        <base-button type="primary"> Xác nhận</base-button>
        <payment-stripe />
      </div>
    </template>
  </base-popup>
</template>

<script lang="ts" setup>
  import PaymentStripe from '@/modules/cart/components/popup/PaymentStripe.vue'
  import { useCartStore } from '@/modules/cart/store'
  import userFormatNumber from '@/composables/formatNumber'

  const cartStore = useCartStore()
  const dataFake: Ref<Record<string, any>[]> = ref([
    {
      id: 0,
      name: 'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
      image:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz',
      retailPrice: 25990000,
      latestPrice: 20990000,
      quantity: 2
    },
    {
      id: 0,
      name: 'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg) ',
      image:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz',
      retailPrice: 25990000,
      latestPrice: 20990000,
      quantity: 2
    }
  ])
  const getListCartSelected = computed<Record<string, any>[]>(() => {
    return cartStore.cartItemSelected
  })

  const handleOpen = (): void => {
    console.log()
  }
  const handleClose = (): void => {
    console.log()
  }
</script>

<style scoped></style>
