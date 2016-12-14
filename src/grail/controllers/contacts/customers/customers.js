/* @flow weak */
/* eslint no-param-reassign: 0 */

export default ($scope, api, uiGridConstants, $state, popup, profile_settings, xeroStatus) => {
  const view_name = 'customers'

  xeroStatus.checkXeroStatus(xeroStatus.isXeroExpired)

  $scope.import = () => popup(api.getContactsImportXeroUrl())
  $scope.export = () => popup(api.getContactsExportXeroUrl())

  $scope.gridOptions = {
    enableRowSelection: true,
    multiSelect: false,
    enableSelectionBatchEvent: false,
    enableFullRowSelection: true,
    enableRowHeaderSelection: false,
    enableGridMenu: true,
    enableColumnMenus: false,
    columnDefs: [{
      field: 'Name',
      sort: { direction: uiGridConstants.ASC },
      visible: profile_settings.getSettings(view_name, 'Name'),
    }],
  }

  $scope.gridOptions.onRegisterApi = (gridApi) => {
    $scope.gridApi = gridApi
    gridApi.selection.on.rowSelectionChanged($scope, (row) => {
      if (row.isSelected) {
        $state.go('customer_edit', { id: row.entity.id })
      }
    })
    gridApi.core.on.columnVisibilityChanged(
      $scope, column => profile_settings.saveSettings(view_name, { [column.name]: column.visible })
    )
  }


  api.getCustomers().then((response) => {
    if (response) {
      $scope.gridOptions.data = response.data
    }
  })
}
