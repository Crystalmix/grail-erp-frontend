/* @flow weak */
/* eslint no-param-reassign: 0 */

export default ($scope, auth_status, api, $state, $rootScope, profile_settings) => {
  profile_settings.fetchProfile()
  $scope.username = auth_status.getUser()

  $rootScope.$on('update_user', ($event, val) => { $scope.username = val })

  $scope.logout = () =>
      api.logout().then(() => {
        auth_status.clear()
        $state.go('accounts')
      })
}
