/* @flow */
/* eslint no-param-reassign: 0 */

export default ($scope, $controller, api) => {
  $controller('CustomerDetailsBase', { $scope })
  $scope.setDefaultAddresses()
  api.getWarehouses().then((response) => {
    if (response) {
      $scope.warehouses = response.data
      if (!$scope.customer.Locations.length) {
        $scope.setDefaultLocation()
      }
    }
  })
}
