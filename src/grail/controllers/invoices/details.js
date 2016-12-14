/* @flow */
/* eslint no-param-reassign: 0 */
/* eslint no-underscore-dangle: 0 */

import _ from 'underscore'
import { __guard__, validateUnitAmount, lengthDecimalPart } from './utils'

export default ($scope, naturalService, uiGridValidateService, xeroStatus) => {
  xeroStatus.checkXeroStatus(xeroStatus.isXeroExpired)

  const getAmount = (line_item) => {
    const amount = (line_item.Quantity * line_item.UnitAmount) || 0
    return amount.toFixed(2)
  }

  const getSubTotal = () => {
    const total = _.reduce($scope.data.LineItems, (itemTotal, i) =>
      itemTotal + ((i.Quantity || 0) * (i.UnitAmount || 0)
    ), 0)
    return total
  }

  const getTaxTotal = () => {
    const total = _.reduce($scope.data.LineItems, (itemTotal, i) => {
      const tax_rate_obj = _.findWhere($scope.tax_rates, { tax_type: i.TaxType })
      let tax_rate = __guard__(tax_rate_obj, x => x.rate) || 0
      tax_rate /= 100
      return itemTotal + (((i.Quantity || 0) * (i.UnitAmount || 0)) * tax_rate)
    }, 0)
    return total
  }

  const getTotal = () => $scope.getSubTotal() + $scope.getTaxTotal()

  const isLineItemsValid = () => {
    for (const item of $scope.data.LineItems) {
      if (item.Product && (!item.Quantity || !validateUnitAmount(item.UnitAmount))) {
        return false
      }
    }
    return true
  }

  const removeLineItem = (row) => _.reject($scope.data.LineItems, i => (
      i.$$hashKey === row.entity.$$hashKey
    ))

  const onChangeLineItems = () => {
    // Add new line item
    const last = $scope.data.LineItems[$scope.data.LineItems.length - 1]
    if (__guard__(last, x => x.Product)) {
      $scope.addLineItem()
    }
  }

  uiGridValidateService.setValidator('positive', (() =>
    (oldValue, newValue) => {
      if (newValue <= 0) {
        return false
      }
      return true
    }), () => 'value must be a positive integer')

  uiGridValidateService.setValidator('not_negative', (() =>
    (oldValue, newValue) => {
      if (newValue < 0) {
        return false
      }
      return true
    }), () => 'value must be zero or negative integer')

  uiGridValidateService.setValidator('decimal', (() =>
    (oldValue, newValue) => {
      if (lengthDecimalPart(newValue) > 4) {
        return false
      }
      return true
    }), () => 'value exceeds 4 decimal places')

  $scope.addLineItem = () => {
    $scope.data.LineItems.push({})
  }

  $scope.getAmount = (line_item) => getAmount(line_item)

  $scope.getSubTotal = () => getSubTotal()

  $scope.getTaxTotal = () => {
    const total = getTaxTotal()
    $scope.data.TotalTax = total.toFixed(2)
    return total
  }

  $scope.getTotal = () => {
    const total = getTotal()
    $scope.data.Total = total.toFixed(2)
    return total
  }

  $scope.removeLineItem = (row) => {
    $scope.removeLineItems.push(_.findWhere($scope.data.LineItems, { id: row.entity.id }))
    $scope.data.LineItems = removeLineItem(row)
  }

  $scope.isLineItemsValid = () => isLineItemsValid()

  $scope.isLineItems = () => _.filter($scope.data.LineItems, val => val.Product)

  $scope.natural = field => item => naturalService.naturalValue(item[field])

  $scope.$watch('data.LineItems', () => onChangeLineItems())
}
