/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import angular from 'angular'

export default ($scope, $controller, $state, api) => {
  $controller('BaseDetails', {$scope: $scope})

  let callback = function(response) {
    let findWarehouse = list => _.find(list, val => val.id === parseInt($state.params.id));
    if (response) {
      $scope.warehouse = findWarehouse(response.data)
    }
  }

  api.getWarehouses().then( (response) => {
    callback(response)
  })

  $scope.save = () => {
    let json = angular.toJson($scope.warehouse)
    if ($scope.warehouse.id) {
      api.updateWarehouse($scope.warehouse.id, json)
      .then( () => $state.go('warehouses') )
    }
    else {
      api.addWarehouse(json)
      .then( () => $state.go('warehouses'))
    }
  }
}
