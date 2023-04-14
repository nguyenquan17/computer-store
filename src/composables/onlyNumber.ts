import { includes } from 'lodash-es'

export default function useOnlyNumber(event: KeyboardEvent, amount: string): void {
  const keyCode = event.keyCode ? event.keyCode : event.which
  console.log(amount)

  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    event.preventDefault()
  }
  if (keyCode === 46 && includes(amount, '.')) {
    event.preventDefault()
  }
}
