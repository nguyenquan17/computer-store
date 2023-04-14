import { useBaseStore } from '@/stores/base'
import { includes } from 'lodash-es'

const baseStore = useBaseStore()

export default function useFormatCurrency(amount: string | number, currency: string): string {
  const ROUNDING_CURRENCY = baseStore.listRounding[currency]
  if (!amount) {
    if (currency === 'PERCENT') {
      return '0'
    }
    amount = 0 // case amount = null | ''
    return amount.toLocaleString('en-US', { minimumFractionDigits: ROUNDING_CURRENCY })
  }

  if (amount >= 100 && currency === 'PERCENT') {
    return '100'
  }

  amount = amount.toString()
  if (includes(amount, '.')) {
    const afterDot = amount.substr(amount.indexOf('.'))
    const _afterDotString = Number(afterDot).toFixed(ROUNDING_CURRENCY)
    const _afterDot = _afterDotString.substr(_afterDotString.lastIndexOf('.') + 1)
    let _beforeDot = 0
    const beforeDot = amount.substring(0, amount.indexOf('.'))
    if (Number(_afterDotString) === 1) {
      _beforeDot = +beforeDot + 1
    } else {
      _beforeDot = +beforeDot
    }
    const temp = _beforeDot.toLocaleString().replaceAll('.', ',')
    return temp + '.' + _afterDot
  }
  const _value = +amount
  return _value.toLocaleString('en-US', { minimumFractionDigits: ROUNDING_CURRENCY })
}
