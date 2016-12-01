/* @flow weak */

export default () => {
  const combine = (...args) => {
    const r = []
    const arg = args[0]
    const max = arg.length - 1

    const helper = (arr, i) => {
      let j = 0
      const l = arg[i].length
      while (j < l) {
        const a = arr.slice(0)
        a.push(arg[i][j])
        if (i === max) {
          r.push(a)
        } else {
          helper(a, i + 1)
        }
        j += 1
      }
    }

    helper([], 0)
    return r
  }

  return combine
}
