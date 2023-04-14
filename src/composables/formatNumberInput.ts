import { includes } from 'lodash-es'

function numberWithCommas(value: string): string {
  if (!value) return '0'
  if (includes(value, '.')) {
    const afterDot = value.substr(value.indexOf('.'))
    const beforeDot = value.substring(0, value.indexOf('.'))
    const _beforeDot = +beforeDot
    const temp = _beforeDot.toLocaleString().replaceAll('.', ',')
    return temp + afterDot
  }
  const _value = +value
  // return _value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
  return _value.toLocaleString('en-US')
}

export default function useFormatNumberInput(event: FocusEvent): void {
  const _event: any = event
  let fnumber: string = _event.target.value
  if (fnumber.length > 0) {
    let caretPos = _event.target.selectionStart
    const originLength = fnumber.length
    fnumber = fnumber.replaceAll(',', '')
    fnumber = numberWithCommas(fnumber)
    _event.target.value = fnumber
    const updatedLength = _event.target.value.length
    caretPos = updatedLength - originLength + caretPos
    _event.target.setSelectionRange(caretPos, caretPos)
  }
}
