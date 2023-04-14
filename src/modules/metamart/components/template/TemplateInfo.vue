<template>
  <div class="template-info">
    <div class="block">
      <div class="block-line">
        <p class="block-line__title">{{ $t('metamart.template.info.contract-address') }}</p>
        <el-input v-model="templateData['Contract Address']" :placeholder="$t('metamart.template.info.contract-address')" disabled></el-input>
      </div>
      <div class="block-line">
        <p class="block-line__title">{{ $t('metamart.template.info.token-id') }}</p>
        <el-input v-model="templateData['Token ID']" :placeholder="$t('metamart.template.info.token-id')" disabled></el-input>
      </div>
      <div class="block-line">
        <p class="block-line__title">{{ $t('metamart.template.info.token-standard') }}</p>
        <el-input v-model="templateData['Token Standard']" :placeholder="$t('metamart.template.info.token-standard')" disabled></el-input>
      </div>
      <div class="block-line">
        <p class="block-line__title">Blockchain</p>
        <el-input v-model="templateData['Blockchain']" placeholder="Blockchain" disabled></el-input>
      </div>
    </div>
    <div class="block">
      <div class="block-header">
        <span class="block-header__title">
          {{ templateData.title }}
        </span>
      </div>
      <p class="block-info" v-for="(info, index) in infos" :key="index">
        <span class="block-info__title"> {{ info.title }} </span>
        <span class="block-info__value">{{ info.value }}</span>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'

  const beBase = namespace('beBase')
  const bcNft = namespace('bcNft')
  @Component
  export default class TemplateInfo extends Vue {
    @Prop({ required: true, type: Array }) data!: Array<Record<string, any>>
    @bcNft.Mutation('CHANGE_META_DATA') changeMetaData!: (Payload: Record<string, any>) => void
    @bcNft.Mutation('BUILD_BODY') buildBody!: () => void

    get infos(): Array<Record<string, any>> {
      let rs: Array<Record<string, any>> = []
      const templateData = this.templateData
      const keys = Object.keys(this.templateData)
      for (let key of keys) {
        if (key !== 'title') {
          rs.push({
            title:
              key === 'Contract Address'
                ? this.$i18n.t('metamart.template.info.contract-address')
                : key === 'Token ID'
                ? this.$i18n.t('metamart.template.info.token-id')
                : key === 'Token Standard'
                ? this.$i18n.t('metamart.template.info.token-standard')
                : key,
            value: templateData[key]
          })
        }
      }
      return rs
    }
    templateData = {
      title: 'NFT info',
      'Contract Address': '0xf507f6d5...413f4d0787',
      'Token ID': '#15687',
      'Token Standard': 'ERC-20',
      Blockchain: 'Ethereum'
    }
    get disabled(): boolean {
      return this.$route.query.status === 'VIEW'
    }
    activated(): void {
      this.changeMetaData(this.emitChange())
      this.buildBody()
      if (this.$route.query.status === 'VIEW') {
        if (this.data.length > 0) {
          const metaValue = JSON.parse(this.data[0].metaValue)
          const lang = window.localStorage.getItem('bc-lang') + ''
          // this.textarea = metaValue[lang]
        } else {
          this.templateData = {
            title: 'NFT info',
            'Contract Address': '',
            'Token ID': '',
            'Token Standard': '',
            Blockchain: ''
          }
        }
      }
    }
    emitChange(): Record<string, any> {
      return {
        metaType: 'INFO',
        metaName: 'NFT Info',
        metaDatas: []
      }
    }
  }
</script>
<style lang="scss" scoped>
  @mixin text($size, $height, $weight, $color) {
    font-size: $size;
    font-weight: $weight;
    line-height: $height;
    color: $color;
  }
  ::v-deep.template-info {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 24px;
    .block {
      padding: 24px;
      height: 440px;
      border: 1px solid #dbdbdb;
      border-radius: 8px;
      &-line {
        height: auto;
        &:not(:last-child) {
          margin-bottom: 24px;
        }
        &__title {
          @include text(16px, 24px, 600, #0a0b0d);
          margin-bottom: 8px;
        }
        .el-input__inner {
          height: 48px;
          font-size: 16px;
          line-height: 24px;
          &[disabled='disabled'] {
            background-color: rgba($color: #dbdbdb, $alpha: 0.5);
            color: #5b616e;
          }
        }
      }
      &-header {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #dbdbdb;
        margin-bottom: 24px;
        &__title {
          display: inline-block;
          padding: 16px 12px 14px;
          @include text(16px, 24px, 600, #0151fc);
          border-bottom: 2px solid currentColor;
        }
      }
      &-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        &:nth-child(2) {
          .block-info__value {
            @include text(16px, 24px, 400, #0151fc);
          }
        }
        &__title {
          @include text(16px, 24px, 400, #0a0b0d);
        }
        &__value {
          @include text(16px, 24px, 400, #5b616e);
        }
      }
    }
  }
</style>
