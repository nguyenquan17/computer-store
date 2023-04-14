export default function useDisableTime(time: string, type: 'from' | 'to', value: string | number) {
  if (value) {
    if (type === 'from') {
      return new Date(time).getTime() / 1000 > new Date(value).getTime() / 1000
    } else {
      return new Date(time).getTime() / 1000 < new Date(value).getTime() / 1000 - 7 * 60 * 60
    }
  }
}
