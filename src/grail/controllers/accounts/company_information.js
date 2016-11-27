/* @flow */
/* eslint no-param-reassign: 0 */

/* eslint no-underscore-dangle: 0 */
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

export default ($scope, api, $state, $controller, $timeout) => {
  $controller('BaseDetails', { $scope })

  $scope.org = null

  const prepareData = (res) => {
    if (res.data) {
      $scope.org = res.data[0]
      $scope.address = __guard__(
        __guard__(__guard__($scope.org, x2 => x2.data), x1 => x1.Addresses), x => x[0])
    }
  }

  api.getOrganizartions().then(res => prepareData(res))

  $scope.save = () => {
    if ($scope.org && $scope.org.id) {
      $scope.org.data.Addresses[0] = $scope.address
      api.updateOrganization($scope.org.id, $scope.org).then(() => $state.go('home'))
    } else {
      $timeout(() => $state.go('home'), 0)
    }
  }
}
