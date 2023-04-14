export function useConvertUtcTime(dateTime: number | string, type: 'from' | 'to'): any {
  if (!dateTime) {
    return ''
  }
  // 86399000 = 23h59p59s
  let millisecond = new Date(dateTime).getTime()
  millisecond = type === 'from' ? millisecond : millisecond + 86399000
  const gmt = new Date().getTimezoneOffset() / -60
  const ago = millisecond - gmt * 60 * 60 * 1000
  const date = new Date(ago)
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    ' ' +
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':' +
    (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  )
}
