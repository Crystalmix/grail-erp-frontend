export default ($scope, $state, api, auth_status, profile_settings) => {
  $scope.data = {}

  return $scope.save = function () {
    $scope.data.username = $scope.data.email
    return api.login($scope.data).then((response) => {
      if (response.data) {
        auth_status.setToken(response.data.key)
        auth_status.setUser($scope.data.email)
        profile_settings.fetchProfile()
        return $state.go('home')
      }
    }, (response) => {
      if (response.status === 400) {
        return $scope.error_msq = 'Unable to log in with provided credentials.'
      }
    })
  }
}
