/* @flow */
/* eslint no-param-reassign: 0 */

export default ($scope, $state, api, auth_status, profile_settings) => {
  $scope.data = {}

  $scope.save = () => {
    $scope.data.username = $scope.data.email
    api.login($scope.data).then((response) => {
      if (response.data) {
        auth_status.setToken(response.data.key)
        auth_status.setUser($scope.data.email)
        profile_settings.fetchProfile()
        $state.go('home')
      }
    }, (response) => {
      if (response.status === 400) {
        $scope.error_msq = 'Unable to log in with provided credentials.'
      }
    })
  }
}
