/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import { getQuantityByWarehouse, getQuantity } from './utils.js'

/*
type CreateTransaction = {|
  warehouse_id: number,
  product_item_id: number,
  quantity: number,
  price: string,
  description: string
|}
*/

type Warehouse = {|
  id: number,
  name: string,
|}

const getDefaultWarehouseId = (warehouses: Warehouse[]): number => warehouses[0].id

export default ($scope, api, product_item, warehouses, onAddTransaction) => {
  $scope.loading = false
  $scope.newTransaction = {
    product_item_id: product_item.id,
    warehouse_id: getDefaultWarehouseId(warehouses),
  }

  $scope.warehousesConfig = {
    create: false,
    maxItems: 1,
    valueField: 'id',
    searchField: ['Name'],
    labelField: 'name',
  }

  $scope.data = {}
  $scope.getQuantityByWarehouse = getQuantityByWarehouse
  $scope.getQuantity = getQuantity

  $scope.item = product_item
  $scope.warehouses = warehouses
  $scope.data = []

  $scope.addTransaction = () => {
    $scope.loading = true
    api.addTransaction($scope.newTransaction).then((resp) => {
      $scope.loading = false
      onAddTransaction(resp.data)
      $scope.closeThisDialog()
    })
  }

  $scope.cancel = () => $scope.closeThisDialog()
}
