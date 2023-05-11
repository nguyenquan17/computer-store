<template>
  <div class="wrap-product-detail max-w-[1232px] w-[1232px] px-4 py-4 m-auto">
    <div class="product-detail">
      <div class="block-above px-6 py-6 bg-white rounded-sm mb-6">
        <div class="flex">
          <div class="product-gallery pr-6">
            <swiper
                :style="{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff',
    }"
                :spaceBetween="10"
                :navigation="true"
                :thumbs="{ swiper: thumbsSwiper }"
                :modules="modules"
                class="mySwiper2"
            >
              <swiper-slide
              ><img
                  src="https://lh3.googleusercontent.com/UnfSZ6tAgjebCGEtCGIRA6oAd62TZQm2-t4kEdFGGlnCBW9TXmFVBi_UJ-N0vMnjHUDCJB4iG0vJhibgbLIQCmHTzyf1Tm65lA=w500-rw" /></swiper-slide
              ><swiper-slide
            ><img
                src="https://lh3.googleusercontent.com/_fPRuhZri87O4Fkk3NJtC96tEvT0wNfFRzW5lgz9Igp7vjubS2NQi7lHVcq-go40T6539wJ26dIMZ2n4MA6V_00TOszOrfc=w500-rw" /></swiper-slide
            ><swiper-slide
            ><img
                src="https://lh3.googleusercontent.com/LdIP0OrKzQfl2wnmXMQI2fwz6OtGS4RfA8Iwtnyfc1UFI-H396X1uNGN1etiLamMV6-g2ThMFsOkJaI_GA0VSH0zwYfAwJV8=w500-rw" /></swiper-slide
            ><swiper-slide
            ><img
                src="https://lh3.googleusercontent.com/uc_UsE8L5n5syPuziv5Koze_zWogMI8C4b_vtxqI0-VjI8D9ZUtJEqlAjFG6PO8zCV-BRhVJ9Kl9R-1eldwj4i-9FrzQkAr4=w500-rw" /></swiper-slide
            >
            </swiper>
            <swiper
                @swiper="setThumbsSwiper"
                :spaceBetween="10"
                :slidesPerView="4"
                :freeMode="true"
                :watchSlidesProgress="true"
                :modules="modules"
                class="mySwiper"
            >
              <swiper-slide
              ><img
                  src="https://lh3.googleusercontent.com/UnfSZ6tAgjebCGEtCGIRA6oAd62TZQm2-t4kEdFGGlnCBW9TXmFVBi_UJ-N0vMnjHUDCJB4iG0vJhibgbLIQCmHTzyf1Tm65lA=w500-rw" /></swiper-slide
              ><swiper-slide
            ><img
                src="https://lh3.googleusercontent.com/_fPRuhZri87O4Fkk3NJtC96tEvT0wNfFRzW5lgz9Igp7vjubS2NQi7lHVcq-go40T6539wJ26dIMZ2n4MA6V_00TOszOrfc=w500-rw" /></swiper-slide
            ><swiper-slide
            ><img
                src="https://lh3.googleusercontent.com/LdIP0OrKzQfl2wnmXMQI2fwz6OtGS4RfA8Iwtnyfc1UFI-H396X1uNGN1etiLamMV6-g2ThMFsOkJaI_GA0VSH0zwYfAwJV8=w500-rw" /></swiper-slide
            ><swiper-slide
            ><img
                src="https://lh3.googleusercontent.com/uc_UsE8L5n5syPuziv5Koze_zWogMI8C4b_vtxqI0-VjI8D9ZUtJEqlAjFG6PO8zCV-BRhVJ9Kl9R-1eldwj4i-9FrzQkAr4=w500-rw" /></swiper-slide
            >
            </swiper>
          </div>
          <div class="product-content">
            <div class="text-2xl font-semibold mb-2">MacBook Air 2022 13.6 inch Z15S00092 (M2/ 16GB/ 256GB SSD)</div>
            <div class="text-description text-sm mb-6">Thương hiệu <span class="text-secondary">APPLE</span></div>
            <div class="text-sm text-[#f78212] mb-2">Còn 1 sản phẩm</div>
            <span class="text-xl text-secondary font-bold">36.890.000₫</span>
            <div>
              <span class="text-xs text-description line-through mr-1">15.290.000₫</span>
              <span class="text-xs text-secondary">-28.123%</span>
            </div>
            <div class="flex py-6 ">
              <base-button class="mr-2 w-full">Mua ngay</base-button>
              <base-button type="plain" class="w-full">Thêm vào giỏ hàng</base-button>
            </div>
            <div>
              - CPU: Apple M2
              <br>
              - Màn hình: 13.3" IPS (2560 x 1600)
              <br>
              - RAM: 1 x 16GB
              <br>
              - Đồ họa: Onboard
              <br>
              - Lưu trữ: 512GB SSD
              <br>
              - Hệ điều hành: macOS
              <br>
              - 58 Wh Pin liền
              <br>
              - Khối lượng: 1.4kg
            </div>
          </div>
        </div>
      </div>
      <div class="block-below px-6 py-6 bg-white rounded-sm">
<!--        v-html-->
        <div class="flex">
          <div class="description flex-[0_0_66%] max-w-[66%]">
            Mô tả sản phẩm
            MacBook Pro 13 inch Z16S00034 của nhà Apple sở hữu một thiết kế thời thượng, sang trọng cùng với tính di động và gọn nhẹ. Máy được trang bị bộ vi xử lý độc quyền Apple M2 có hiệu năng hoạt động tối ưu, giúp xử lý tốt mọi tác vụ hàng ngày hay chỉnh sửa đồ họa. Không những thế, chiếc máy này còn đảm bảo đáp ứng đủ dải nhu cầu sử dụng từ cơ bản đến nâng cao hứa hẹn sẽ làm hài lòng đến mọi khách hàng.
            <img src="https://storage.googleapis.com/teko-gae.appspot.com/media/image/2022/10/7/20221007_8f6f10e2-6d0d-4397-ab2e-91910e9422fc.png" alt="">
            Thiết kế nhỏ gọn, thời thượng và có chất liệu vỏ kim loại cao cấp
            MacBook 13 inch sở hữu ngôn ngữ thiết kế đặc trưng của nhà Apple, thể hiện được sự thời thượng, tinh tế giúp làm tăng sự sang trọng hơn cho người sở hữu phù hợp cho mọi người dùng, đặc biệt là các doanh nhân. Với tính linh hoạt, nhỏ gọn chỉ với kích thước 30.41 x 21.24 x 1.56cm và trọng lượng khiêm tốn chỉ 1.4kg giúp bạn có thể mang chiếc MacBook này đến bất cứ nơi đâu.
          </div>
          <div class="attribute-detail">
<!--            component-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import {FreeMode, Navigation, Pagination, Thumbs} from 'swiper';

// Import Swiper styles
import 'swiper/css';

import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"

let thumbsSwiper = null;
const setThumbsSwiper = (swiper) => {
  thumbsSwiper = swiper;
}
const modules: Ref<any> = ref([FreeMode, Pagination, Navigation, Thumbs])


</script>

<style scoped lang="scss">
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