/* @flow */
/* eslint no-underscore-dangle: 0 */

export function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

export const lengthDecimalPart = (num = '') => {
  const test_num = num.toString()
  return (test_num.split('.')[1] || []).length
}

export const validateUnitAmount = (UnitAmount) => {
  let amount = UnitAmount
  const length = lengthDecimalPart(amount)
  // UIGrid return value as string or number
  if ((typeof amount === 'string' && amount !== '') || typeof amount === 'number') {
    amount = Number(UnitAmount)
  } else {
    amount = undefined
  }
  if (amount >= 0 && length <= 4) {
    return true
  }
  return false
}

export const amountFieldTemplate = `<div class="ui-grid-cell-contents ng-binding ng-scope">
                                      {{ grid.appScope.getAmount(row.entity) }}
                                    </div>`

export const cellMenuTemplate = `<a ng-click="grid.appScope.removeLineItem(row, rowRenderIndex, rowIndex, this)"
                                  class="demo-delete-row btn btn-danger btn-xs"><i class="fa fa-remove"></i>
                                </a>`
