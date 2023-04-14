export default function useFormatTxCode(txCode: string, number = 10) {
  if (!txCode) return ''
  const before = txCode.substring(0, number)
  const after = txCode.substring(txCode.length - number)
  return before + '...' + after
}
