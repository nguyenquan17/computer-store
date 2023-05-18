<template>
  <div class="landing-cart m-auto max-w-[1232px] px-8 py-8">
    <div class="mr-4 w-[66.67%]">
      <h1 class="mb-4 text-2xl font-bold">Thanh toán</h1>
    </div>
    <div class="flex w-full">
      <div class="block-left mr-4 w-[66.67%] rounded bg-white px-4 py-4">
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <h1 class="mb-4 text-sm font-bold">Thông tin nhận hàng</h1>
          </div>

          <!--          <div class="block-right flex w-[48%] flex-wrap rounded bg-white">-->
          <!--            <div-->
          <!--              class="flex h-auto min-h-[120px] w-[100%] flex-auto flex-col items-center justify-center rounded border border-solid border-[#eaeaea] p-[20px]"-->
          <!--            >-->
          <!--              <div>+</div>-->
          <!--              <div>Thêm địa chỉ</div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="block-right flex w-[48%] flex-wrap rounded bg-white">
            <div
              class="flex h-auto min-h-[120px] w-[100%] flex-auto flex-col rounded border border-solid border-[#eaeaea] p-[20px] text-sm"
            >
              <div class="flex items-center justify-between font-bold">
                <h1 class="pr-2">Nguyễn Anh Quân</h1>
                <el-icon class="cursor-pointer" size="20">
                  <Edit />
                </el-icon>
              </div>
              <div>0368517926</div>
              <div>Hoài Đức, Xã Yên Sở, Huyện Hoài Đức, Thành phố Hà Nội</div>
            </div>
          </div>
          <!--          <el-form-item label="Họ và tên">-->
          <!--            <el-input></el-input>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="Số điện thoại">-->
          <!--            <el-input></el-input>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="Địa chỉ">-->
          <!--            <el-input></el-input>-->
          <!--          </el-form-item>-->
        </div>
        <div>
          <div class="flex items-center justify-between">
            <h1 class="mb-4 text-sm font-bold">Phương thức thanh toán</h1>
          </div>
          <div>
            <el-radio-group v-model="paymentMethod" class="flex w-full justify-between">
              <el-radio border class="!mr-[0] flex !h-[90px] w-[48%]" label="1" size="large">
                <div class="mr-4 text-sm font-bold">Thanh toán qua</div>
                <img alt="" height="50" src="@/assets/images/checkout/paypal-logo.png" width="100" />
              </el-radio>
              <el-radio border class="!h-[90px] w-[48%]" label="2" size="large">
                <div class="text-sm font-bold">Thanh toán khi nhận hàng</div>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="block-right max-h-[350px] w-[33.33%] rounded bg-white">
        <div class="px-6 py-6">
          <div class="mb-4 text-base font-bold">Thanh toán</div>
          <div class="mb-1 flex justify-between">
            <h3>Tổng tạm tính</h3>
            <span>8.890.000₫</span>
          </div>
          <div class="mb-1 flex justify-between">
            <h3>Phí vận chuyển</h3>
            <span>Miễn phí</span>
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
  import { Edit } from '@element-plus/icons-vue'

  const paymentMethod: Ref<number> = ref(1)
</script>

<style lang="scss" scoped>
  .el-radio__label {
    display: flex;
  }
</style>
