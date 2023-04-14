import { includes } from 'lodash-es'

export default function useCapitalizeFirstLetter(string: string): string {
  if (!string) {
    return ''
  }
  if (includes(string, '_')) {
    string = string.split('_').join(' ')
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}
