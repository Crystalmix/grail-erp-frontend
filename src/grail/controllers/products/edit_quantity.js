/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import { getQuantityByWarehouse, getQuantity } from './utils.js'

export default ($scope, api, product_item, warehouses) => {
  $scope.data = {}
  $scope.getQuantityByWarehouse = getQuantityByWarehouse
  $scope.getQuantity = getQuantity

  $scope.item = product_item
  $scope.warehouses = warehouses
  $scope.data = []

  $scope.cancel = () => $scope.closeThisDialog()
}
