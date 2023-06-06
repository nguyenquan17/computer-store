<template>
  <div class="layout-balance rounded bg-white shadow-md">
    <div class="flex justify-between p-6">
      <div
        class="flex h-auto w-1/5 basis-[calc(25%-18px)] flex-col justify-between rounded-lg border border-solid border-[#dbdbdb] py-0 px-4"
      >
        <div class="mt-1.5 flex justify-between">
          <p>Total Available Product</p>
          <base-icon color="#CF202F" icon="request-icon-withdraw" size="19"></base-icon>
        </div>
        <span class="mt-2 inline-block w-full text-[24px] font-semibold leading-[24px]">
          <span class="text-xs font-normal">{{ tabActive }}</span>
        </span>
      </div>
    </div>
    <!--    <base-filter-->
    <!--      ref="refFilter"-->
    <!--      :list-sort="listSort"-->
    <!--      :sort-active="filter.orderBy"-->
    <!--      width-dropdown="180"-->
    <!--      width-popper="518"-->
    <!--      @apply="handleApplyFilter"-->
    <!--      @reset="handleReset"-->
    <!--      @search="handleSearch"-->
    <!--      @sort="handleSort"-->
    <!--    >-->
    <!--      <template #filter>-->
    <!--        <el-form label-position="top">-->
    <!--          <div class="flex justify-between">-->
    <!--            <el-form-item class="flex-1" label="Status">-->
    <!--              <el-select v-model="filter.status" :teleported="false" class="w-full" clearable placeholder="Status">-->
    <!--                <el-option v-for="(type, index) in listStatus" :key="index" :label="type.title" :value="type.value" />-->
    <!--              </el-select>-->
    <!--            </el-form-item>-->
    <!--          </div>-->
    <!--          <div class="flex justify-between">-->
    <!--            <el-form-item class="mr-10 flex-1" label="Request date">-->
    <!--              <el-date-picker-->
    <!--                v-model="filter.fromDate"-->
    <!--                :disabled-date="$event => useDisableTime($event, 'from', filter.toDate)"-->
    <!--                :teleported="false"-->
    <!--                format="MM/DD/YYYY"-->
    <!--                placeholder="From date"-->
    <!--                type="date"-->
    <!--                value-format="x"-->
    <!--              >-->
    <!--              </el-date-picker>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item class="hide-label flex-1" label="1">-->
    <!--              <el-date-picker-->
    <!--                v-model="filter.toDate"-->
    <!--                :disabled-date="$event => useDisableTime($event, 'to', filter.fromDate)"-->
    <!--                :teleported="false"-->
    <!--                format="MM/DD/YYYY"-->
    <!--                placeholder="To date"-->
    <!--                type="date"-->
    <!--                value-format="x"-->
    <!--              >-->
    <!--              </el-date-picker>-->
    <!--            </el-form-item>-->
    <!--          </div>-->
    <!--          <div class="flex justify-between">-->
    <!--            <el-form-item class="mr-10 flex-1" label="Amount">-->
    <!--              <el-input-->
    <!--                v-model="filter.fromAmount"-->
    <!--                placeholder="From"-->
    <!--                @keypress="useOnlyNumber($event, filter.fromAmount)"-->
    <!--                @keyup="useFormatNumberInput($event)"-->
    <!--              >-->
    <!--                <template #prefix>-->
    <!--                  <span class="flex h-full items-center text-base text-[#0a0b0d]">$</span>-->
    <!--                </template>-->
    <!--              </el-input>-->
    <!--            </el-form-item>-->
    <!--            <el-form-item class="mt-5 flex-1" label=" ">-->
    <!--              <el-input-->
    <!--                v-model="filter.toAmount"-->
    <!--                placeholder="To"-->
    <!--                @keypress="useOnlyNumber($event, filter.toAmount)"-->
    <!--                @keyup="useFormatNumberInput($event)"-->
    <!--              >-->
    <!--                <template #prefix>-->
    <!--                  <span class="flex h-full items-center text-base text-[#0a0b0d]">$</span>-->
    <!--                </template>-->
    <!--              </el-input>-->
    <!--            </el-form-item>-->
    <!--          </div>-->
    <!--        </el-form>-->
    <!--      </template>-->
    <!--      <template #button>-->
    <!--        <div class="ml-[auto] pr-6">-->
    <!--          <base-button @click="handleOpenPopupAddProduct">Add Product</base-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </base-filter>-->
    <div class="px-6"></div>
    <popup-add-product />
  </div>
</template>

<script lang="ts" setup>
  import useDisableTime from '@/composables/disableTime'
  import useOnlyNumber from '@/composables/onlyNumber'
  import useFormatNumberInput from '@/composables/formatNumberInput'

  import { useBaseStore } from '@/stores/base'
  import PopupAddProduct from '@/modules/back-office/components/popup/PopupAddProduct.vue'

  const route = useRoute()
  const router = useRouter()
  const baseStore = useBaseStore()

  const dataProduct: Ref<Record<string, any>[]> = ref([{}])

  const handleOpenPopupAddProduct = (): void => {
    baseStore.setOpenPopup(true, 'popup-add-product')
  }

  onMounted(() => {})
</script>

<style scoped></style>
