<template>
  <div class="player" :style="{ height: height + 'px' }">
    <video class="main-video" :height="height + 'px'" ref="main-video" @timeupdate="watchDog">
      <source :src="src" :type="type" />
    </video>
    <div class="controls">
      <div class="controls-center">
        <base-icon icon="play-solid" size="40" v-if="isPaused" @click.native="handlePlay" />
        <base-icon icon="pause-solid" size="40" v-if="!isPaused" @click.native="handlePlay" />
      </div>
      <div class="controls-bottom">
        <base-icon icon="volume-high-solid" size="20" v-if="!isMuted" @click.native="handleMuted" />
        <base-icon icon="volume-xmark-solid" size="20" v-else @click.native="handleMuted" />
        <input type="range" ref="volume" min="0" max="1" step="any" v-model="volume" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  @Component
  export default class VideoPlayer extends Vue {
    @Prop({ required: false, type: Number, default: 308 }) height!: number
    @Prop({ required: true, type: String }) src!: string
    @Prop({ required: false, type: String, default: 'video/mp4' }) type!: string
    mainVideo!: any
    isPaused = true
    isMuted = false
    volume = 0
    @Watch('volume') watchVolume(): void {
      this.mainVideo.volume = +this.volume
      this.isMuted = +this.volume === 0
    }
    mounted(): void {
      this.mainVideo = this.$refs['main-video']
      this.isPaused = this.mainVideo.paused
      this.isMuted = this.mainVideo.muted
      this.volume = this.mainVideo.volume
    }
    watchDog(e: Event): void {
      const mainVideo: any = e.target
      const { currentTime, duration } = mainVideo
      this.isPaused = currentTime === duration ? true : this.isPaused
    }
    handleMuted(): void {
      this.mainVideo.muted = !this.mainVideo.muted
      this.isMuted = this.mainVideo.muted
    }
    handlePlay(): void {
      this.isPaused ? this.mainVideo.play() : this.mainVideo.pause()
      this.isPaused = this.mainVideo.paused
      console.log(this.isPaused)
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep.player {
    position: relative;
    height: auto;
    &:hover {
      .controls {
        display: flex;
      }
    }
    .controls {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
      z-index: 5;
      background-color: rgba($color: #000000, $alpha: 0.5);
      justify-content: center;
      align-items: center;
      &-center {
        width: 100px;
        height: 100px;
        border: 1px solid rgba($color: #ffffff, $alpha: 0.71);
        background-color: rgba($color: #b7b7b7, $alpha: 0.3);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .svg-icon {
          color: #ececec;
        }
      }
      &-bottom {
        width: 100%;
        height: 64px;
        position: absolute;
        bottom: 0;
        display: flex;
        padding: 0 16px;
        justify-content: space-between;
        align-items: center;
        .svg-icon {
          color: #ececec;
        }
        input[type='range'] {
          height: 4px !important;
        }
      }
    }
  }
</style>
