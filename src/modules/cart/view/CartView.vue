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
        <div class="flex items-center justify-between border-b border-solid border-[#eaeaea] px-4 py-4">
          <div class="max-w-[4%] flex-[0_0_4%]">
            <el-checkbox v-model="isCheckAll" :indeterminate="isIndeterminate" size="large" @change="handleCheckAllChange" />
          </div>
          <div class="flex flex-[0_0_96%] justify-between text-sm font-bold">
            <div class="flex justify-between">
              <div class="flex-[0_0_50%]"></div>
              <div class="max-w-[16.66%]">Đơn giá</div>
              <div class="max-w-[16.66%]">Số lượng</div>
              <div class="max-w-[16.66%]">Thành tiền</div>
            </div>
          </div>
        </div>
        <el-checkbox-group v-model="cartItemSelected" :value="item" size="large" @change="updateCheckAllItem()">
        </el-checkbox-group>
        <div v-for="item in fakeCart" :key="item.id" class="flex justify-between px-4 py-4">
          <div class="max-w-[4%] flex-[0_0_4%]">
            <el-checkbox v-model="cartItemSelected" size="large" @change="updateCheckAllItem" />
          </div>
          <div class="flex flex-[0_0_96%] justify-between text-sm font-bold">
            <div class="max-w-[16.66%]">Đơn giá</div>
            <div class="max-w-[16.66%]">Số lượng</div>
            <div class="max-w-[16.66%]">Thành tiền</div>
          </div>
        </div>
      </div>
      <div class="block-right w-[33.33%] rounded bg-white">
        <p>thanh toán</p>
        <p>thanh toán</p>
        <p>thanh toán</p>
        <p>thanh toán</p>
        <p>thanh toán</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const isCheckAll = ref(false)
  const isIndeterminate = ref(true)
  const fakeCart: Ref<Record<string, any>[]> = ref([
    {
      id: 0,
      categoryId: 1,
      name: 'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
      imageMain:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw',
      brand: 3,
      description:
        'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
      retailPrice: 25990000,
      latestPrice: 20990000,
      quantity: 16
    },
    {
      id: 1,
      categoryId: 1,
      name: 'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
      imageMain:
        'https://lh3.googleusercontent.com/rnIVOAhuK4DqaHOsT3vGKI_rdZTtfAbpW3klDiKfLfXDjrvjrBI7JLCOkNegNx5lXWU4uIkoBaeTIMQsrMngAPg0xDzvBSGz=w500-h500-rw',
      brand: 3,
      description:
        'Laptop Asus Zenbook 14 OLED UX3402Z UX3402ZA-KM221W (14inch 90Hz/Intel Core i7 1260P/16GB/512GB SSD/Windows 11 Home/1.3kg)',
      retailPrice: 25990000,
      latestPrice: 20990000,
      quantity: 16
    }
  ])
  const cartItemSelected: Ref<boolean> = ref(false)
  const updateCheckAllItem = (): void => {}
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

<style scoped></style>
