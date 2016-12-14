/* @flow weak */
/* eslint no-param-reassign: 0 */

export default ($scope, auth_status, api, $state, $rootScope, profile_settings, xeroStatus, popup) => {
  profile_settings.fetchProfile()
  $scope.username = auth_status.getUser()

  $scope.xeroConnect = () => {
    const new_window = popup(api.getXeroConnectUrl())

    // workaround: window Same Origin Policy
    const intervalId = setInterval(() => {
      if (new_window.closed) {
        clearInterval(intervalId)
        xeroStatus.checkXeroStatus()
      }
    }, 1000)
  }

  $rootScope.isXeroExpired = xeroStatus.isXeroExpired
  $rootScope.xeroTokenInfo = xeroStatus.xeroTokenInfo

  $scope.$watch(() => xeroStatus.isXeroExpired, (newVal) => {
    $rootScope.isXeroExpired = newVal
  })

  $scope.$watch(() => xeroStatus.xeroTokenInfo, (newVal) => {
    $rootScope.xeroTokenInfo = newVal
  })

  $rootScope.$on('update_user', ($event, val) => { $scope.username = val })

  $scope.logout = () =>
      api.logout().then(() => {
        auth_status.clear()
        $state.go('accounts')
      })
}
