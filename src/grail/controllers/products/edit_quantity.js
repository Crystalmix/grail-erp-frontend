/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

export default ($scope, api, product_item, warehouses) => {
  $scope.data = {}

  $scope.item = product_item
  $scope.warehouses = warehouses
  $scope.data = []

  _.each($scope.item.warehouses, warehouse => $scope.data.push(_.clone(warehouse)))

  $scope.getWarehouseName = (warehouse_id) => {
    const warehouse = _.findWhere($scope.warehouses, { id: warehouse_id })
    return warehouse.name
  }

  $scope.getQuantity = (item) => {
    const quantity = _.reduce(item, (total, i) => total + (i.quantity || 0), 0)
    return quantity
  }

  $scope.save = () => {
    $scope.item.warehouses = $scope.data
    $scope.closeThisDialog()
  }

  $scope.cancel = () => $scope.closeThisDialog()
}
