<template>
  <div class="load-main">
    <div class="spinner-main"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .load-main {
    width: 100vw;
    height: 100vh;
    z-index: 2000;
    position: absolute;
    top: 0;
    left: 0;
    background: #ffffff;
  }
  .spinner-main {
    position: fixed;
    top: calc(50vh - 60px);
    left: 50%;
    z-index: 2015;
    width: 14.4px;
    height: 14.4px;
    border-radius: 14.4px;
    box-shadow: 36px 0px 0 0 rgba(71, 75, 255, 0.2), 29.2px 21.2px 0 0 rgba(71, 75, 255, 0.4),
      11.16px 34.2px 0 0 rgba(71, 75, 255, 0.6), -11.16px 34.2px 0 0 rgba(71, 75, 255, 0.8), -29.2px 21.2px 0 0 #474bff;
    animation: spinner-b87k6z 1s infinite linear;
  }

  @keyframes spinner-b87k6z {
    to {
      transform: rotate(360deg);
    }
  }
</style>
