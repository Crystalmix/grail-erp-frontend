/* @flow */
/* eslint no-param-reassign: 0 */

import angular from 'angular'

export default ($scope, $state, profile_settings, $controller) => {
  $controller('BaseDetails', { $scope })

  $scope.user = angular.copy(profile_settings.getProfile(), {})

  $scope.save = () => {
    const callback = () => $state.go('home')
    profile_settings.saveProfile($scope.user, callback)
  }
}
