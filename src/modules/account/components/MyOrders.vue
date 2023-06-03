<template>
  <div class="px-4 py-4">
    <base-table :border="parentBorder" :data="tableData" :showPagination="false" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
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
            <div class="mb-4">
              <h1 class="mb-4 text-base font-bold">Thông tin đơn hàng</h1>
              <base-table :data="getListCartSelected" :loading="false" :query="{}" :showPagination="false" label="sản phẩm">
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
                <h1 class="mr-1 flex-[0_0_20%]">Phương thức thanh toán:</h1>
                <div class="flex items-center">
                  <!--            <div class="mr-4 text-sm font-bold">Thanh toán qua</div>-->
                  <img alt="" height="50" src="@/assets/images/checkout/logo-stripe.png" width="100" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Ngày đặt" prop="date" />
      <el-table-column label="Trạng thái" prop="status" />
    </base-table>
  </div>
</template>

<script lang="ts" setup>
  const parentBorder = ref(false)
  const childBorder = ref(false)
  const tableData = [
    {
      date: '2016-05-03',
      name: 'Tom',
      state: 'California',
      city: 'San Francisco',
      address: '3650 21st St, San Francisco',
      zip: 'CA 94114',
      family: [
        {
          name: 'Jerry',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Spike',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Tyke',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        }
      ]
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      state: 'California',
      city: 'San Francisco',
      address: '3650 21st St, San Francisco',
      zip: 'CA 94114',
      family: [
        {
          name: 'Jerry',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Spike',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Tyke',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        }
      ]
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      state: 'California',
      city: 'San Francisco',
      address: '3650 21st St, San Francisco',
      zip: 'CA 94114',
      family: [
        {
          name: 'Jerry',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Spike',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Tyke',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        }
      ]
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      state: 'California',
      city: 'San Francisco',
      address: '3650 21st St, San Francisco',
      zip: 'CA 94114',
      family: [
        {
          name: 'Jerry',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Spike',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Tyke',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        }
      ]
    },
    {
      date: '2016-05-08',
      name: 'Tom',
      state: 'California',
      city: 'San Francisco',
      address: '3650 21st St, San Francisco',
      zip: 'CA 94114',
      family: [
        {
          name: 'Jerry',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Spike',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Tyke',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        }
      ]
    },
    {
      date: '2016-05-06',
      name: 'Tom',
      state: 'California',
      city: 'San Francisco',
      address: '3650 21st St, San Francisco',
      zip: 'CA 94114',
      family: [
        {
          name: 'Jerry',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Spike',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Tyke',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        }
      ]
    },
    {
      date: '2016-05-07',
      name: 'Tom',
      state: 'California',
      city: 'San Francisco',
      address: '3650 21st St, San Francisco',
      zip: 'CA 94114',
      family: [
        {
          name: 'Jerry',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Spike',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        },
        {
          name: 'Tyke',
          state: 'California',
          city: 'San Francisco',
          address: '3650 21st St, San Francisco',
          zip: 'CA 94114'
        }
      ]
    }
  ]
</script>

<style scoped></style>
