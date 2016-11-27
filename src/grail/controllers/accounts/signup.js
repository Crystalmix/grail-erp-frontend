/* @flow */
/* eslint no-param-reassign: 0 */

export default ($scope, api, auth_status, $state, profile_settings) => {
  $scope.data = {}

  $scope.save = () => {
    const success = (response) => {
      auth_status.is_authenticated = true
      if (response.data) {
        auth_status.setToken(response.data.key)
        auth_status.setUser($scope.data.email)
        profile_settings.fetchProfile()
        $state.go('home')
      }
    }
    const error = (response) => {
      if (response.data && response.data.email) {
        $scope.error_msq = response.data.email[0]
      } else if (response.data && response.data.password1) {
        $scope.error_msq = response.data.password1[0]
      }
    }

    if ($scope.data.password1 !== $scope.data.password2) {
      $scope.error_msq = 'Please check passwords'
    } else {
      $scope.data.username = $scope.data.email
      api.registration($scope.data).then(success, error)
    }
  }
}
