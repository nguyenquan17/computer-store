<template>
  <div class="be-flex info">
    <div class="info-item">
      <div class="be-flex align-center mb-2 title">
        <span class="text-base text-bold">{{ $t('label.personal-info') }}</span>
        <base-icon icon="icon-personal" size="24" class="icon-personal" />
      </div>
      <div class="be-flex jc-space-between align-center item">
        <span class="label">{{ $t('label.f-name') }}</span>
        <span class="text-base">{{ info.firstName }}</span>
      </div>
      <div class="be-flex jc-space-between align-center item">
        <span class="label">{{ $t('label.l-name') }}</span>
        <span class="text-base">{{ info.lastName }}</span>
      </div>
      <div class="be-flex jc-space-between align-center item">
        <span class="label">{{ $t('label.birth-day') }}</span>
        <span class="text-base">{{ info.birthday | formatDateTimeBirthday }}</span>
      </div>
      <div class="be-flex jc-space-between align-center item">
        <span class="label">{{ $t('label.nationality') }}</span>
        <span class="text-base">{{ info.nationality }}</span>
      </div>
    </div>
    <div class="info-item">
      <div class="be-flex align-center mb-2 title">
        <span class="text-base text-bold">{{ $t('label.address') }}</span>
        <base-icon icon="icon-address" size="24" class="icon-personal" />
      </div>
      <div class="be-flex jc-space-between item">
        <span class="label" style="line-height: 25px">{{ $t('label.address') }}</span>
        <span class="text-base" style="padding-bottom: 8px">{{ info.address }}</span>
      </div>
      <div class="be-flex jc-space-between align-center item">
        <span class="label">{{ $t('label.city') }}</span>
        <span class="text-base">{{ info.cityName }}</span>
      </div>
      <div class="be-flex jc-space-between align-center item">
        <span class="label">{{ $t('label.state') }}</span>
        <span class="text-base">{{ info.state }}</span>
      </div>
      <div class="be-flex jc-space-between align-center item">
        <span class="label">{{ $t('label.country') }}</span>
        <span class="text-base">{{ info.country }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class InfoCustomer extends Vue {
    @Prop({ required: true, type: Object, default: {} }) info!: Record<string, any>
  }
</script>

<style scoped lang="scss">
  .info {
    padding-left: 144px;
    .info-item {
      margin-right: 144px;
      .title {
        position: relative;
        .icon-personal {
          position: absolute;
          left: -29px;
        }
      }
      .item {
        // padding-bottom: 12px;
        min-height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #d2d0ce;
        min-width: 280px;
        // margin-bottom: 12px;
        .label {
          font-size: 12px;
          line-height: 16px;
          color: #5b616e;
          flex-shrink: 0;
        }
        .text-base {
          margin-left: 24px;
          word-break: break-word;
          text-align: right;
        }
      }
      .item:last-child {
        margin-bottom: 24px;
        text-align: right;
      }
    }
  }
</style>
