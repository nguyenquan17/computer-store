<template>
  <div class="wrap-product-detail m-auto w-[1232px] max-w-[1232px] px-4 py-4">
    <div class="product-detail">
      <div class="block-above mb-6 rounded-sm bg-white px-6 py-6">
        <div class="flex">
          <div class="product-gallery pr-6">
            <swiper
              :modules="modules"
              :navigation="true"
              :spaceBetween="10"
              :style="{
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#fff'
              }"
              :thumbs="{ swiper: thumbsSwiper }"
              class="mySwiper2"
            >
              <swiper-slide v-for="item in dataDetailProductConvert.imageList" :key="dataDetailProductConvert.id"
                ><img :src="item" alt="" />
              </swiper-slide>
            </swiper>
            <swiper
              :freeMode="true"
              :modules="modules"
              :slidesPerView="4"
              :spaceBetween="10"
              :watchSlidesProgress="true"
              class="mySwiper"
              @swiper="setThumbsSwiper"
            >
              <swiper-slide v-for="item in dataDetailProduct.imageList" :key="dataDetailProductConvert.id"
                ><img :src="item" alt="" />
              </swiper-slide>
            </swiper>
          </div>
          <div class="product-content w-full">
            <div class="mb-2 text-2xl font-semibold">{{ dataDetailProductConvert.productName }}</div>
            <div class="mb-6 text-sm text-description">
              Thương hiệu <span class="text-secondary">{{ dataDetailProductConvert.brand }}</span>
            </div>
            <div class="mb-2 text-sm text-[#f78212]">Còn {{ dataDetailProductConvert.quantity }} sản phẩm</div>
            <span class="text-xl font-bold text-secondary">{{ useFormatNumber(dataDetailProductConvert.latestPrice) }}₫</span>
            <div>
              <span class="mr-1 text-xs text-description line-through"
                >{{ useFormatNumber(dataDetailProductConvert.retailPrice) }}₫</span
              >
              <span class="text-xs text-secondary">-{{ useFormatNumber(dataDetailProductConvert.discount) }}%</span>
            </div>
            <div class="flex py-6">
              <base-button class="mr-2 w-full" @click="handleAddToCart('redirect')">Mua ngay</base-button>
              <base-button class="w-full" type="plain" @click="handleAddToCart('add')">Thêm vào giỏ hàng</base-button>
            </div>
            <div>
              - CPU: Apple M2
              <br />
              - Màn hình: 13.3" IPS (2560 x 1600)
              <br />
              - RAM: 1 x 16GB
              <br />
              - Đồ họa: Onboard
              <br />
              - Lưu trữ: 512GB SSD
              <br />
              - Hệ điều hành: macOS
              <br />
              - 58 Wh Pin liền
              <br />
              - Khối lượng: 1.4kg
            </div>
          </div>
        </div>
      </div>
      <div class="block-below rounded-sm bg-white px-6 py-6">
        <!--        v-html-->
        <div class="flex justify-between">
          <div class="description max-w-[66%] flex-[0_0_66.67%]">
            <h1 class="mb-4 text-xl font-bold">Mô tả sản phẩm</h1>
            <div>
              Mô tả sản phẩm MacBook Pro 13 inch Z16S00034 của nhà Apple sở hữu một thiết kế thời thượng, sang trọng cùng với tính
              di động và gọn nhẹ. Máy được trang bị bộ vi xử lý độc quyền Apple M2 có hiệu năng hoạt động tối ưu, giúp xử lý tốt
              mọi tác vụ hàng ngày hay chỉnh sửa đồ họa. Không những thế, chiếc máy này còn đảm bảo đáp ứng đủ dải nhu cầu sử dụng
              từ cơ bản đến nâng cao hứa hẹn sẽ làm hài lòng đến mọi khách hàng.
              <img
                alt=""
                src="https://storage.googleapis.com/teko-gae.appspot.com/media/image/2022/10/7/20221007_8f6f10e2-6d0d-4397-ab2e-91910e9422fc.png"
              />
              Thiết kế nhỏ gọn, thời thượng và có chất liệu vỏ kim loại cao cấp MacBook 13 inch sở hữu ngôn ngữ thiết kế đặc trưng
              của nhà Apple, thể hiện được sự thời thượng, tinh tế giúp làm tăng sự sang trọng hơn cho người sở hữu phù hợp cho
              mọi người dùng, đặc biệt là các doanh nhân. Với tính linh hoạt, nhỏ gọn chỉ với kích thước 30.41 x 21.24 x 1.56cm và
              trọng lượng khiêm tốn chỉ 1.4kg giúp bạn có thể mang chiếc MacBook này đến bất cứ nơi đâu.
            </div>
          </div>
          <div class="attribute-detail flex-[0_0_33.33%] pl-6">
            <!--            component-->
            <h1 class="mb-4 text-xl font-bold">Thông tin chi tiết</h1>
            <div
              v-for="(value, key) in dataDetailProductConvert.attributes"
              :key="key"
              class="flex w-full justify-between odd:bg-white even:bg-slate-50"
            >
              <div class="flex w-full justify-between px-3 py-3">
                <div class="flex-[0_0_40%] text-sm font-medium">{{ value.attribute }}</div>
                <div class="flex-[0_0_60%]">{{ value.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { apiProduct, apiCart } from '@/services'
  import useFormatNumber from '@/composables/formatNumber'

  import { ElNotification } from 'element-plus'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper'
  // Import Swiper styles
  import 'swiper/css'

  import 'swiper/css/free-mode'
  import 'swiper/css/navigation'
  import 'swiper/css/thumbs'

  import { useAuthStore } from '@/modules/auth/store'
  import useConvertEntity from '@/composables/useConvertEntity'
  import type { IProductDetail, IProductDetailConvert } from '@/interfaces'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const useConvertProductEntity = useConvertEntity()
  let thumbsSwiper = null
  const modules: Ref<any> = ref([FreeMode, Pagination, Navigation, Thumbs])
  const isLoading: Ref<boolean> = ref(false)
  const dataDetailProduct: Ref<IProductDetail> = ref({} as IProductDetail)
  const dataDetailProductConvert: Ref<IProductDetailConvert> = ref({} as IProductDetailConvert)

  onMounted(async () => {
    await getDetailProductById()
  })

  const getDetailProductById = async (): Promise<void> => {
    try {
      isLoading.value = true
      const params = {
        productId: route.params.detail
      }
      const result = await apiProduct.getProductDetailById(params)
      dataDetailProduct.value = result.data
      dataDetailProductConvert.value = useConvertProductEntity.convertProductDetail(dataDetailProduct.value)
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      console.log(e)
    }
  }
  const handleAddToCart = async (type: string): Promise<void> => {
    try {
      isLoading.value = true
      const params = {
        clientId: authStore.authUser.userId,
        productId: Number(route.params.detail)
      }
      const result = await apiCart.addProductToCart(params)
      if (result.status === 200) {
        ElNotification({
          type: 'success',
          title: 'Đã thêm sản phẩm vào giỏ hàng',
          duration: 3000
        })
        if (type === 'redirect') {
          await router.push({ name: 'CartView' })
        }
      }
      isLoading.value = false
    } catch (e) {
      console.log(e)
    }
  }
  const setThumbsSwiper = swiper => {
    thumbsSwiper = swiper
  }
</script>

<style lang="scss" scoped>
  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  body {
    background: #000;
    color: #000;
  }

  .swiper {
    width: 450px;
    height: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .swiper-slide {
    background-size: cover;
    background-position: center;
  }

  .mySwiper2 {
    height: 500px;
    width: 500px;
  }

  .mySwiper {
    height: 20%;
    box-sizing: border-box;
    padding: 10px 0;
  }

  .mySwiper .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
    cursor: pointer;
  }

  .mySwiper .swiper-slide-thumb-active {
    opacity: 1;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
