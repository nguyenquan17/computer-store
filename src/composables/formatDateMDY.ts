export default function useFormatDateMDY(value: string | number): string {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  return (
    (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '/' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '/' +
    date.getFullYear()
  )
}
