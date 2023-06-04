<template>
  <div class="px-4 py-4">
    <base-table :data="listOrder" :loading="isLoading" :showPagination="false" style="width: 100%"
                @row-click="handleClickRow">
      <el-table-column type="expand">
        <template #default="props">
          <div v-if="!isLoading">
            <div class="mb-4">
              <h1 class="mb-4 text-base font-bold">Thông tin nhận hàng</h1>
              <div class="flex w-full text-sm font-medium">
                <h1 class="mr-1 flex-[0_0_12%]">Họ và tên:</h1>
                <div>{{ props.row.detail.consigneeName }}</div>
              </div>
              <div class="flex w-full text-sm font-medium">
                <h1 class="mr-1 flex-[0_0_12%]">Số điện thoại:</h1>
                <span>{{ props.row.detail.consigneePhoneNumber }}</span>
              </div>
              <div class="flex w-full text-sm font-medium">
                <h1 class="mr-1 flex-[0_0_12%]">Địa chỉ nhận hàng:</h1>
                <div>{{ props.row.detail.deliveryAddress }}</div>
              </div>
            </div>
            <div class="mb-4">
              <h1 class="mb-4 text-base font-bold">Thông tin đơn hàng</h1>
              <base-table :data="props.row.detail.orderItemDetailList" :loading="false" :showPagination="false"
                          label="sản phẩm">
                <el-table-column :index="1" align="center" label="#" type="index" width="80"/>
                <el-table-column align="left" label="Tên sản phẩm" prop="name">
                  <template #default="scope">
                    <div class="flex items-center">
                      <img :src="scope.row.imageList[0]" alt="" height="60" width="60"/>
                      <p class="ml-4">{{ scope.row.productName }}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="right" label="Số lượng" prop="itemQuantity" width="150"></el-table-column>
                <el-table-column align="right" label="Đơn giá" prop="itemPrice" width="150">
                  <template #default="scope">
                    <div class="text-sm font-medium">{{ userFormatNumber(scope.row.itemPrice) }}đ</div>
                  </template>
                </el-table-column>
              </base-table>
            </div>
            <div class="mb-4">
              <h1 class="mb-4 text-base font-bold">Thông tin thanh toán</h1>
              <div class="flex w-full items-center text-sm font-medium">
                <h1 class="mr-1 flex-[0_0_20%]">Phương thức thanh toán:</h1>
                <div class="flex items-center">
                  <!--            <div class="mr-4 text-sm font-bold">Thanh toán qua</div>-->
                  <img alt="" height="50" src="@/assets/images/checkout/logo-stripe.png" width="100"/>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Ngày đặt" prop="createAt">
        <template #default="scope">
          <div>{{ useFormatDateHourMs(scope.row.createAt) }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Trạng thái" prop="status">
        <template #default="scope">
          <div :class="getClassStatus(scope.row.status)" class="h-full py-1 px-2 text-xs font-medium">
            {{ getOrderStatus(scope.row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="" prop="">
        <template #default="scope">
          <div v-if="scope.row.status === 1">
            <base-button class="!h-[33px] w-[180px] text-sm" size="small"
                         @click="handleRedirectToStripeCheckout(scope.row.checkoutSessionUrl)">Thanh toán ngay
            </base-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" label="" prop="">
        <template #default="scope">
          <div
              class="flex items-center justify-end text-right text-sm font-medium"
              @click="handleOpenPopupPaymentDetail(scope.row)"
          >
            Chi tiết
            <el-icon>
              <CaretRight/>
            </el-icon>
          </div>
        </template>
      </el-table-column>
    </base-table>
    <popup-payment-detail :row-data="rowData"/>
  </div>
</template>

<script lang="ts" setup>
import {CaretRight} from '@element-plus/icons-vue'
import {apiOrder} from '@/services'
import {useAuthStore} from '@/modules/auth/store'
import useFormatDateHourMs from '@/composables/formatDateHourMs'
import userFormatNumber from '@/composables/formatNumber'
import {findIndex} from 'lodash-es'
import BaseButton from '@/components/base/button/BaseButton.vue'
import {useBaseStore} from '@/stores/base'
import PopupPaymentDetail from '@/modules/account/components/popup/PopupPaymentDetail.vue'
import type {Ref} from 'vue'

const baseStore = useBaseStore()
const authStore = useAuthStore()
const listOrder: Ref<Record<string, any>[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const orderId: Ref<number> = ref(0)
const rowData: Ref<Record<string, any>> = ref({})
onMounted(async () => {
  await getListOrder()
})

const getListOrder = async (): Promise<void> => {
  try {
    isLoading.value = true
    const params = {
      page: 0,
      size: 1000,
      orderStatus: '',
      userId: authStore.user.userId
    }
    const rs = await apiOrder.getListOrderClient(params)
    listOrder.value = rs.data
    isLoading.value = false
  } catch (e) {
    isLoading.value = false
    console.log(e)
  }
}

// const handleClickRow = (row: Record<string, any>): void => {
//   rowData.value = row
//   console.log(rowData.value)
//   baseStore.setOpenPopup(true, 'popup-payment-detail')
// }

// const handleExpandChange = async (payload: Record<string, any>): Promise<void> => {
//   try {
//     const { row, expand } = payload
//     console.log(expand.length)
//     if (expand.length) {
//       // const id = row.orderId
//       // const lastId = expandedRow.value[0]
//       // expandedRow.value = id === lastId ? [] : [id]
//       // console.log(expandedRow.value)
//       isLoading.value = true
//       const rs = await apiOrder.getOrderDetailClient({ orderId: row.orderId })
//       const indexItemParent = findIndex(listOrder.value, (elm: Record<string, any>) => elm.orderId === row.orderId)
//       listOrder.value[indexItemParent].detail = rs.data
//       isLoading.value = false
//     }
//   } catch (e) {
//     isLoading.value = false
//     console.log(e)
//   }
// }
const getOrderStatus = (status: number): string => {
  return status === 0 ? 'Đã hủy' : status === 1 ? 'Chờ thanh toán' : 'Thành công'
}

const getClassStatus = (status: number): string => {
  return status === 0
      ? 'bg-[#fde2e2] rounded border-solid border-[1px] border-[#f89898] text-[#c45656] w-[110px] m-auto'
      : status === 1
          ? 'bg-[#f8e3c5] rounded border-solid border-[1px] border-[#E6A23C] text-[#b88230] w-[110px] m-auto'
          : 'bg-[#d1edc4] rounded border-solid border-[1px] border-[#67C23A] text-[#529b2e] w-[110px] m-auto'
}

const handleOpenPopupPaymentDetail = (row: Record<string, any>): void => {
  rowData.value = row
  baseStore.setOpenPopup(true, 'popup-payment-detail')
}

const handleRedirectToStripeCheckout = (url: string): void => {
  window.open(url, '_blank')
}
</script>

<style scoped></style>
