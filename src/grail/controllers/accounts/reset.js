/* @flow weak */
/* eslint no-param-reassign: 0 */

export default ($scope, api) => {
  $scope.data = {}

  $scope.save = () => {
    api.reset($scope.data)
    .then((response) => {
      if (response.data) { $scope.text = response.data.success }
    }, (response) => {
      if (response.status === 400) {
        $scope.error_msq = 'The e-mail address is not assigned to any user account.'
      }
    })
  }
}
