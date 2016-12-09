/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

/*
  not_enough_list = [[1, 10], [2, 0]]
  [1, 10] = the warehouse has 10 products with id=1
  [2, 0] = the warehouse has 0 product with id=2
*/
export default ($scope, sale, warehouses, products, not_enough_list) => {
  $scope.warehouse = _.find(warehouses, (item) => item.id === sale.Warehouse)

  _.each(not_enough_list, ((list) => {
    _.each(products, (product) => {
      _.each(product.items, (item => {
        if (item.id === _.first(list)) {
          list[0] = `${item.Code} (${product.Description})`
        }
      }))
    })
  }))

  $scope.not_enough_list = not_enough_list
}
