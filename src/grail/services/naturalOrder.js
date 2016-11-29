export default ($locale) => {
  const natCache = {}

  const padding = value => '00000000000000000000'.slice(value.length)

  const natDateMonthFirst = $locale.DATETIME_FORMATS.shortDate.charAt(0) === 'm'

  const fixDates = value =>
      value.replace(/(\d\d?)[-\/\.](\d\d?)[-\/\.](\d{4})/, ($0, $m, $d, $y) => {
        const t = $d
        if (!natDateMonthFirst) {
          if (Number($d) < 13) {
            $d = $m
            $m = t
          }
        } else if (Number($m) > 12) {
          $d = $m
          $m = t
        }
        return `${$y}-${$m}-${$d}`
      })


  const fixNumbers = value =>
      value.replace(/(\d+)((\.\d+)+)?/g, ($0, integer, decimal, $3) => {
        if (decimal !== $3) {
          return $0.replace(/(\d+)/g, $d => padding($d) + $d)
        } else {
          decimal = decimal || '.0'
          return padding(integer) + integer + decimal + padding(decimal)
        }
      })


  const natValue = (value) => {
    if (natCache[value]) {
      return natCache[value]
    }
    const newValue = fixNumbers(fixDates(value))
    return natCache[value] = newValue
  }

  return {
    naturalValue: natValue,
    naturalSort(a, b) {
      a = natVale(a)
      b = natValue(b)
      return a < b ? -1 : a > b ? 1 : 0
    },

  }
}
