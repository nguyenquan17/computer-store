export default function useAbbreviateNumber(number: number, toFix = 1): string {
  const SI_SYMBOL = ['', 'K', 'M', 'B', 'T', 'P', 'E']

  if (!number) return '0'

  if (number < 1000) {
    return number.toString()
  }
  // what tier? (determines SI symbol)
  const tier = (Math.log10(Math.abs(number)) / 3) | 0

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)

  // scale the number
  const scaled = number / scale

  // format number and add suffix
  return scaled.toFixed(toFix) + suffix
}
