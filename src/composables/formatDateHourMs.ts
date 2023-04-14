export default function useFormatDateHourMs(value: string | number): string {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  return (
    (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '/' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '/' +
    date.getFullYear() +
    ' ' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  )
}
