<template>
  <Transition v-if="fullscreen" name="fade">
    <div v-if="loading && !iDelay" :class="fullscreen ? 'spinning fullscreen' : 'spinning'">
      <div class="spinner-loading"></div>
      <p class="center loading-tip">{{ tip }}</p>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </Transition>
  <div v-else>
    <div v-if="loading && !iDelay" class="spinning">
      <div class="spinner-loading"></div>
      <p class="center loading-tip">{{ tip }}</p>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    loading: { required: true, type: Boolean, default: true },
    delay: {
      required: false,
      type: Number,
      default: 0
    },
    fullscreen: {
      required: false,
      type: Boolean,
      default: false
    },
    tip: {
      required: false,
      type: String,
      default: 'Loading...'
    }
  })

  const iDelay = ref(0)
  const created = async (): Promise<void> => {
    iDelay.value = props.delay
    if (props.loading) {
      const itv = setInterval(() => {
        if (iDelay.value > 0) {
          iDelay.value -= 100
        } else {
          clearInterval(itv)
        }
      }, 100)
    } else {
      iDelay.value = 0
    }
  }
</script>

<style lang="scss" scoped>
  .spinner-loading {
    margin: 30px auto 0;
    z-index: 2000;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    box-shadow: 20px 0px 0 0 rgba(20, 53, 195, 0.2), 16.2px 11.8px 0 0 rgba(20, 53, 195, 0.4),
      6.2px 19px 0 0 rgba(20, 53, 195, 0.6), -6.2px 19px 0 0 rgba(20, 53, 195, 0.8), -16.2px 11.8px 0 0 rgba(20, 53, 195, 1);
    animation: spinner-b87k6z 1s infinite linear;

    @media screen and (max-width: 768px) {
      width: 4.8px;
      height: 4.8px;
      border-radius: 4.8px;
      box-shadow: 12px 0px 0 0 rgba(219, 219, 219, 0.2), 9.7px 7.1px 0 0 rgba(219, 219, 219, 0.4),
        3.7199999999999998px 11.4px 0 0 rgba(219, 219, 219, 0.6), -3.7199999999999998px 11.4px 0 0 rgba(219, 219, 219, 0.8),
        -9.7px 7.1px 0 0 #ececec;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fullscreen {
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity 0.3s;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 2014;
  }

  .fullscreen .spinner-loading {
    top: 50%;
    left: 50%;
    text-align: center;
    position: absolute;
  }

  .fullscreen .center {
    top: calc(100vh / 2 + 40px);
    left: calc(100vw / 2 - 30px);
    text-align: center;
    position: absolute;
    margin-top: 25px;
  }

  .center {
    text-align: center;
    margin-top: 30px;
  }

  @keyframes spinner-b87k6z {
    to {
      transform: rotate(360deg);
    }
  }
</style>
