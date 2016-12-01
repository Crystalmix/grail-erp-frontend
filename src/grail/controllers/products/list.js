/* @flow weak */
/* eslint no-param-reassign: 0 */

export default ($scope, api, uiGridConstants, $state, profile_settings) => {
  const view_name = 'products'

  $scope.gridOptions = {
    enableRowSelection: true,
    multiSelect: false,
    enableSelectionBatchEvent: false,
    enableFullRowSelection: true,
    enableRowHeaderSelection: false,
    enableGridMenu: true,
    enableColumnMenus: false,
    columnDefs: [
      {
        field: 'Name',
        name: 'Name/Code',
        sort: { direction: uiGridConstants.ASC },
        visible: profile_settings.getSettings(view_name, 'Name/Code'),
      },
      {
        field: 'Description',
        sort: { direction: uiGridConstants.ASC },
        visible: profile_settings.getSettings(view_name, 'Description'),
      },
      {
        name: 'Options',
        field: 'items.length',
        width: 120,
        type: 'number',
        visible: profile_settings.getSettings(view_name, 'Options'),
      },
    ],
  }

  $scope.gridOptions.onRegisterApi = (gridApi) => {
    $scope.gridApi = gridApi
    gridApi.selection.on.rowSelectionChanged($scope, (row) => {
      if (row.isSelected) {
        $state.go('product_edit', { id: row.entity.id })
      }
    })
    gridApi.core.on.columnVisibilityChanged($scope, column => (
      profile_settings.saveSettings(view_name, { [column.name]: column.visible })
    ))
  }

  api.getProducts().then(response => {
    $scope.gridOptions.data = response ? response.data : undefined
  })
}
