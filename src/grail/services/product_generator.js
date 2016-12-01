/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

export default (combine) => {
  const computeCode = (arrayOfOptions, product_code) => {
    let code = ''
    _.each(arrayOfOptions, val => { code = `${code}${val}` })
    return `${product_code}${code}`
  }

  const prepareProductItems = (productCombinations, variants, product_code) =>
      _.map(productCombinations, (val) => {
        const obj = _.object(variants, val)
        return _.extend({ data: obj }, { Code: computeCode(val, product_code) })
      })


  const compactOptionValues = (options) => {
    options = _.values(options)
    return _.map(options, val => _.compact(val))
  }

  // TODO: We should be sure that the order of variants adn options is similar
  const generate = (variants, options, code) => {
    options = compactOptionValues(options)
    variants = _.compact(variants)
    const productCombinations = _.isEmpty(options) ? [] : combine(options)
    return prepareProductItems(productCombinations, variants, code)
  }

  return generate
}
