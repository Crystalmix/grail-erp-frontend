/* @flow */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import angular from 'angular'

export default ($scope, api, $state, $controller) => {
  $controller('BaseDetails', { $scope })

  api.getSuppliers().then((response) => {
    if (response) {
      $scope.supplier = _.find(response.data, val => val.id === parseInt($state.params.id, 10))
    }
  })

  $scope.save = () => {
    if ($scope.supplier.id) {
      const json = angular.toJson($scope.supplier)
      api.updateContact($scope.supplier.id, json)
      .then(() => $state.go('suppliers'))
    } else {
      const supplier = { IsSupplier: true, IsCustomer: false }
      _.extend(supplier, $scope.supplier)
      api.addContact(angular.toJson(supplier))
      .then(() => $state.go('suppliers'))
    }
  }
}
