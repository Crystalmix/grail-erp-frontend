/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import { getQuantityByWarehouse, getQuantity } from './utils.js'

/*
type Transaction = {|
  warehouse: number,
  product_item: number,
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

export default ($scope, api, product_item, warehouses) => {
  $scope.newTransaction = {
    product_item: product_item.id,
    warehouse: getDefaultWarehouseId(warehouses),
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

  $scope.cancel = () => $scope.closeThisDialog()
}
