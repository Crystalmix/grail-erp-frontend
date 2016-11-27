/* @flow */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

export default ($scope, $controller, api, $state, xero, uuidFactory, $q) => {
  $controller('CustomerDetailsBase', { $scope })

  const setCorrectTypeAddresses = () => {
    $scope.customer.Addresses = _.find($scope.customer.Addresses, i => (
      i.AddressType === xero.customer.address_type
    ))
    if (!$scope.customer.Addresses) {
      $scope.setDefaultAddresses()
    }
  }

  const updateWarehouses = () => {
    if ($scope.warehouses) {
      _.each($scope.customer.Locations, (location_item) => {
        const warehouse = _.find($scope.warehouses, warehouse_item => (
          warehouse_item.id === location_item.Warehouse
        ))
        location_item.Warehouse = warehouse
      })
    }
  }

  const setLocations = () => {
    updateWarehouses()
    _.each($scope.customer.Locations, location_item => { location_item.uid = uuidFactory() })
    $scope.activateLocation(_.first($scope.customer.Locations))
    $scope.selectLocation = _.first($scope.customer.Locations)
  }

  const promises = {
    warehouses: api.getWarehouses(),
    customers: api.getCustomers(),
  }

  const onCustomers = (data) => {
    $scope.customer = _.find(data, val => val.id === parseInt($state.params.id, 10))
    setCorrectTypeAddresses()
    setLocations()
  }

  const onWarehouses = (data) => {
    $scope.warehouses = data
    if (!$scope.customer.Locations.length) {
      $scope.setDefaultLocation()
    }
  }

  $q.all(promises).then((res) => {
    onWarehouses(res.warehouses.data)
    onCustomers(res.customers.data)
  })
}
