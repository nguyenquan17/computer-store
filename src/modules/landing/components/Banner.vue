<template>
  <div class="landing-banner">
    <div>
      <swiper
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false
        }"
        :centeredSlides="true"
        :modules="modules"
        :navigation="true"
        :pagination="{
          clickable: true
        }"
        :spaceBetween="30"
        class="mySwiper"
      >
        <swiper-slide v-for="(item, index) in listBanner" :key="index">
          <div class="select-none">
            <img :src="item.image" alt="" />
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="z-50 m-auto mt-[-72px] flex max-w-[1232px]">
      <div class="flex justify-between gap-[15px]">
        <div
          v-for="item in listBottomBanner"
          :key="item.id"
          class="transform cursor-pointer overflow-hidden rounded-lg transition duration-500 hover:scale-105"
        >
          <img :src="item.image" alt="" class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Autoplay, Pagination, Navigation } from 'swiper'
  // Import Swiper styles
  import 'swiper/css'

  import 'swiper/css/pagination'
  import 'swiper/css/navigation'

  const modules: Ref<any> = ref([Autoplay, Pagination, Navigation])
  const listBanner: Ref<Record<string, any>> = ref([
    {
      id: 0,
      image:
        'https://lh3.googleusercontent.com/FXs0Avw0ggc2aVTIpcirJCIcA21CgXg0Y90mtKkftwmy7KRRcQhU7wcmyLw6q1pKDCvBkyQVgwZg7hywsJlN11TCJQB12Oem=w1920-rw'
    },
    {
      id: 1,
      image:
        'https://lh3.googleusercontent.com/FeE-2OLVlgr0rLqJcHXyzuvEEpgnYp1XBJ60hZq6YD4sZgHlzYJMFcAS66_79y-rBWOFhvamh5zKy8jjIuHuhhuIOJ2pA_Q=w1920-rw'
    },
    {
      id: 2,
      image:
        'https://lh3.googleusercontent.com/38VYfGRFwWmHsd9kSzW3Dp86ir87GrQ2QYO5QrnUMNQNKcq8wriHChwsim9NSZaAg-eNAPPHl-lQq8LxeAV9PZUzAPiI1udK=w1920-rw'
    },
    {
      id: 3,
      image:
        'https://lh3.googleusercontent.com/38VYfGRFwWmHsd9kSzW3Dp86ir87GrQ2QYO5QrnUMNQNKcq8wriHChwsim9NSZaAg-eNAPPHl-lQq8LxeAV9PZUzAPiI1udK=w1920-rw'
    }
  ])
  const listBottomBanner: Ref<Record<string, any>> = ref([
    {
      id: 0,
      image:
        'https://lh3.googleusercontent.com/3GqSXb7_JQDsdA1GOWGliUscigsfGWACFgIjupc7isi1VHebNDqKL4olzciPVhyU2L_R7Sqw9GoaW0uIJFtqaaKmLPp-xyFD=w308-rw'
    },
    {
      id: 1,
      image:
        'https://lh3.googleusercontent.com/ixMA6w9fxfzHJHv9df3Cdxlf22W6W-pHdPA6EYQJsNYoLYqwcXE3AAj4WlqJrMIjb52Boh3TtG6gJJZryoVU7kwXVbp2xEt3=w308-rw'
    },
    {
      id: 2,
      image:
        'https://lh3.googleusercontent.com/2b0ZSrvkZOJ-FZWjzgaP3WppMppkDIQjekVAN5LOV4SFtT3zT12CUZ02E1WLtjh0jWCYQ26SCQc3F9jRi-5XhgIimLa3f3tNfg=w308-rw'
    },
    {
      id: 3,
      image:
        'https://lh3.googleusercontent.com/2RWXFv_BmcbgvdX2WwNjElOyi5d_PCMwu6LghDMJ5kNIQQne7QIaE5n44Sy3UsAH-zgXeAOLnE0eK7jPLksFC4dKcF-NrUjo=w308-rw'
    }
  ])
</script>

<style scoped></style>
