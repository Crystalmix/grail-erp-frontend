/* @flow weak */
/* eslint no-alert: 0 */

export default ($scope) => {
  const callback = (event) => {
    const form = $scope.details
    if (form.$dirty && !form.$submitted) {
      if (!confirm('You have unsaved changes, do you want to leave the page?')) {
        event.preventDefault()
      }
    }
  }

  $scope.$on('$stateChangeStart', event => callback(event))
}
