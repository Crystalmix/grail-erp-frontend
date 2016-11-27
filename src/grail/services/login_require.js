export default ($rootScope, $state, auth_status) => {
  $rootScope.$on('$stateChangeStart', (event, toState) => {
    if (toState.requireLogin && !auth_status.getToken()) {
      auth_status.clear()
      $state.go('accounts')
    }
  })
}
