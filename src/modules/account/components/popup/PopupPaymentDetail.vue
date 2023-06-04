<template>
  <base-popup
    :is-show-footer="true"
    class="popup-payment-detail"
    name="popup-payment-detail"
    width="1200px"
    @close="handleClose"
    @open="handleOpen"
  >
    <template #title>Chi tiết đơn hàng</template>
    <div>
      <div>
        <div class="mb-4">
          <h1 class="mb-4 text-base font-bold">Thông tin nhận hàng</h1>
          <div class="flex w-full text-sm font-medium">
            <h1 class="mr-1 flex-[0_0_12%]">Họ và tên:</h1>
            <div>{{ detailOrder.consigneeName }}</div>
          </div>
          <div class="flex w-full text-sm font-medium">
            <h1 class="mr-1 flex-[0_0_12%]">Số điện thoại:</h1>
            <span>{{ detailOrder.consigneePhoneNumber }}</span>
          </div>
          <div class="flex w-full text-sm font-medium">
            <h1 class="mr-1 flex-[0_0_12%]">Địa chỉ nhận hàng:</h1>
            <div>{{ detailOrder.deliveryAddress }}</div>
          </div>
        </div>
        <div class="mb-4">
          <h1 class="mb-4 text-base font-bold">Thông tin đơn hàng</h1>
          <base-table :data="detailOrder.orderItemDetailList" :loading="isLoading" :showPagination="false" label="sản phẩm">
            <el-table-column :index="1" align="center" label="#" type="index" width="80" />
            <el-table-column align="left" label="Tên sản phẩm" prop="name">
              <template #default="scope">
                <div class="flex items-center">
                  <img :src="scope.row.imageList[0]" alt="" height="60" width="60" />
                  <p class="ml-4">{{ scope.row.productName }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right" label="Số lượng" prop="itemQuantity" width="150"></el-table-column>
            <el-table-column align="right" label="Đơn giá" prop="itemPrice" width="250">
              <template #default="scope">
                <div class="text-sm font-medium">{{ userFormatNumber(scope.row.itemPrice) }}đ</div>
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
              <img alt="" height="50" src="@/assets/images/checkout/logo-stripe.png" width="100" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <base-button type="plain" @click="handleClose">Quay lại</base-button>
        <base-button v-if="detailOrder.status === 1" class="ml-4" type="primary"> Thanh toán ngay</base-button>
        <!--        <payment-stripe />-->
        <!--        <stripe />-->
      </div>
    </template>
  </base-popup>
</template>

<script lang="ts" setup>
  import userFormatNumber from '@/composables/formatNumber'
  import { apiOrder } from '@/services'
  import { useBaseStore } from '@/stores/base'

  interface IProps {
    rowData: Record<string, any>
  }

  // const props = withDefaults(defineProps<{ orderId?: number }>(), {
  //   orderId: 0
  // })

  const props = withDefaults(defineProps<IProps>(), {
    rowData: () => ({} as Record<string, any>)
  })

  const baseStore = useBaseStore()
  const detailOrder: Ref<Record<string, any>> = ref({})
  const isLoading: Ref<boolean> = ref(false)

  const getOrderDetail = async (): Promise<void> => {
    try {
      console.log(props.rowData.orderId)
      if (props.rowData.orderId) {
        detailOrder.value = {}
        isLoading.value = true
        const rs = await apiOrder.getOrderDetailClient({ orderId: props.rowData.orderId })
        detailOrder.value = rs.data
        isLoading.value = false
      }
    } catch (e) {
      isLoading.value = false
      console.log(e)
    }
  }
  const handleOpen = async (): Promise<void> => {
    await getOrderDetail()
  }
  const handleClose = (): void => {
    baseStore.setOpenPopup(false, 'popup-payment-detail')
  }
</script>

<style scoped></style>
