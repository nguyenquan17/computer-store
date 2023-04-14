<template>
  <div class="tab-description">
    <el-input type="textarea" :placeholder="$t('label_long-desc')" v-model="description" @input="handleInput" :maxlength="200" show-word-limit> </el-input>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import filter from 'lodash/filter'
  import debounce from 'lodash/debounce'
  import findIndex from 'lodash/findIndex'

  import { namespace } from 'vuex-class'
  const bcNft = namespace('bcNft')

  @Component
  export default class TabText extends Vue {
    @Prop({ required: false, type: Number, default: 0 }) idTabActive!: number

    @bcNft.State('metaDatas') metaDatas!: Array<Record<string, any>>

    description = ''
    data: Record<string, any> = {}

    created(): void {
      this.data = filter(this.metaDatas, elm => elm.metaTypeId === this.idTabActive)[0]
      // const language = localStorage.getItem('bc-lang') || ''
      // const parseJson = JSON.parse(this.data.metaValue)
      this.description = this.data.metaValue
    }

    handleInput(text: string): void {
      this.debounceInput(text, this)
    }
    debounceInput = debounce((text: string, _this: any) => {
      // const language = localStorage.getItem('bc-lang') || ''

      // let parseJson: Record<string, any> = JSON.parse(_this.data.metaValue)

      // parseJson = {
      //   ...parseJson,
      //   [language]: _this.description
      // }

      _this.data = {
        ..._this.data,
        metaValue: text
      }

      const index = findIndex(_this.metaDatas, (elm: Record<string, any>) => elm.metaTypeId === _this.idTabActive)

      _this.metaDatas[index] = _this.data

      _this.$emit('update')
    }, 500)
  }
</script>

<style scoped lang="scss">
  ::v-deep.tab-description {
    .el-textarea__inner {
      border-radius: 4px;
      min-height: 300px !important;
    }
  }
</style>
