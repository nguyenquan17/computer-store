<template>
  <base-popup
    name="popup-filter-transaction"
    width="600px"
    class="popup-filter-transaction"
    :is-show-footer="false"
    @open="handleOpen"
  >
    <template #title>Filter</template>
    <el-form label-position="top">
      <div class="flex justify-between">
        <el-form-item class="flex-1 mr-10" label="Transaction Type">
          <el-select v-model="filter.transactionType" class="w-full">
            <el-option
              v-for="(type, index) in props.listTransactionType"
              :key="index"
              :label="type.displayName"
              :value="type.typeName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flex-1" label="Status">
          <el-select v-model="filter.status" :clearable="true" class="w-full">
            <el-option v-for="(type, index) in listStatus" :key="index" :label="type.title" :value="type.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="flex justify-between">
        <el-form-item class="flex-1 mr-10" label="Transaction Date">
          <el-date-picker
            v-model="filter.fromTransactionDate"
            class="!w-full"
            format="MM/DD/YYYY"
            value-format="x"
            placeholder="From date"
            type="date"
            :disabled-date="$event => useDisableTime($event, 'from', filter.toTransactionDate)"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="flex-1 hide-label" label="1">
          <el-date-picker
            v-model="filter.toTransactionDate"
            class="!w-full"
            format="MM/DD/YYYY"
            value-format="x"
            placeholder="To date"
            type="date"
            :disabled-date="$event => useDisableTime($event, 'to', filter.fromTransactionDate)"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="flex justify-between">
        <el-form-item class="flex-1 mr-10" label="Transaction Amount">
          <el-input
            v-model="filter.fromTransactionAmount"
            placeholder="From amount"
            @keypress="useOnlyNumber($event, filter.fromTransactionAmount)"
            @keyup="useFormatNumberInput($event)"
          >
            <template #prefix>
              <div class="text-base text-[#0a0b0d]">$</div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="flex-1 hide-label" label="1">
          <el-input
            v-model="filter.toTransactionAmount"
            placeholder="To amount"
            @keypress="useOnlyNumber($event, filter.toTransactionAmount)"
            @keyup="useFormatNumberInput($event)"
          >
            <template #prefix>
              <div class="text-base text-[#0a0b0d]">$</div>
            </template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <button
        class="border border-solid border-[#d2d0ce] w-[120px] rounded-lg mr-[15px] font-normal text-sm h-10 text-[#3b3a39]"
        @click="handleReset"
      >
        Reset
      </button>
      <button
        class="border border-solid border-[#d2d0ce] w-[120px] rounded-lg font-normal text-sm h-10 text-[#fff] bg-[#0151fc]"
        @click="handleApply"
      >
        Continue
      </button>
    </template>
  </base-popup>
</template>

<script setup lang="ts">
  import useDisableTime from '@/composables/disableTime'
  import useOnlyNumber from '@/composables/onlyNumber'
  import useFormatNumberInput from '@/composables/formatNumberInput'
  interface IProps {
    listTransactionType: Array<Record<string, any>>
    transactionType: string
    module?: string
  }
  const props = withDefaults(defineProps<IProps>(), {
    listTransactionType: () => [],
    transactionType: '',
    module: 'TRANSACTION'
  })
  const filter = ref({
    fromTransactionDate: '',
    toTransactionDate: '',
    fromTransactionAmount: '',
    toTransactionAmount: '',
    status: '',
    transactionType: ''
  })

  const handleOpen = () => {
    filter.value.transactionType = props.transactionType
  }

  const listStatus = ref<Record<string, any>>([
    {
      title: 'Pending',
      value: 'PENDING'
    },
    {
      title: 'Processing',
      value: 'PROCESSING'
    },
    {
      title: 'Success',
      value: 'SUCCESS'
    }
  ])
  const emit = defineEmits(['reset', 'apply'])

  const resetFilter = () => {
    filter.value = {
      transactionType: '',
      status: '',
      fromTransactionDate: '',
      toTransactionDate: '',
      fromTransactionAmount: '',
      toTransactionAmount: ''
    }
  }

  const handleReset = () => {
    resetFilter()
    emit('reset')
  }
  const handleApply = () => {
    emit('apply', filter)
  }
</script>

<style lang="scss">
  .popup-filter-transaction {
    --el-dialog-margin-top: 15vh !important;
  }
</style>
