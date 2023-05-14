<template>
  <div class="mx-[5px] h-[unset] w-full cursor-pointer select-none whitespace-normal first:ml-0">
    <div class="h-full w-[227px] bg-white">
      <div class="relative h-full w-full px-4 py-4">
        <div class="wrap">
          <div class="image transition duration-500 hover:scale-105">
            <img v-if="dataItem.imageList" :src="dataItem?.imageList[0]" alt="" class="h-[195px] w-[195px] object-contain" />
            <img
              v-else
              alt=""
              class="h-[195px] w-[195px] object-contain"
              src="https://i.pinimg.com/564x/62/ed/6e/62ed6ea71018a57a3ab0c8c959d78cb0.jpg"
            />
          </div>
          <div class="saving">
            <div class="mt-[-36px] flex h-[36px] w-fit flex-col rounded px-1 py-1 leading-[12px]">
              <div class="text-[10px] font-bold text-[#ffd591]">Tiết kiệm</div>
              <span class="text-[13px] font-bold leading-[18px] text-label">5.700.000 đ</span>
            </div>
          </div>
          <div class="brand">
            <div>{{ dataItem.brand }}</div>
          </div>
          <div class="caption">
            <h3 class="min-h-[80px] text-sm text-description line-clamp-4">
              {{ dataItem.productName }}
            </h3>
          </div>
          <div class="price mt-1 mb-2">
            <div>
              <div class="retail-price text-sm font-bold text-secondary">
                {{ useFormatNumber(dataItem.retailPrice) }}
                đ
              </div>
              <div class="origin-price flex text-xs">
                <div class="mr-1 text-description line-through">{{ useFormatNumber(dataItem.latestPrice) }} ₫</div>
                <span class="text-secondary">-{{ dataItem.discount }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { IProduct } from '@/interfaces'
  import useFormatNumber from '@/composables/formatNumber'

  interface IProps {
    dataItem: IProduct
  }

  const props = withDefaults(defineProps<IProps>(), {
    dataItem: () => ({} as IProduct)
  })
</script>

<style lang="scss" scoped>
  .saving div {
    background: linear-gradient(45.6deg, #9d3ef2 26.04%, #3036f4 72.34%, #598efb 100%);
  }
</style>
