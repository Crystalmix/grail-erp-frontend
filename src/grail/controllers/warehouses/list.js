/* @flow weak */
/* eslint no-param-reassign: 0 */

export default ($scope, api, uiGridConstants, $state, profile_settings, $window) => {
  const view_name = 'warehouses'

  $scope.stockReportDate = new Date()

  $scope.exportStockReport = () => {
    const year = $scope.stockReportDate.getUTCFullYear()
    const month = $scope.stockReportDate.getUTCMonth() + 1
    const day = $scope.stockReportDate.getUTCDate()
    $window.location.assign(api.downloadStockReportByDate(year, month, day))
  }

  $scope.exportStockDetailReport = () => {
    const year = $scope.stockReportDate.getUTCFullYear()
    const month = $scope.stockReportDate.getUTCMonth() + 1
    const day = $scope.stockReportDate.getUTCDate()
    $window.location.assign(api.downloadStockDetailReportByDate(year, month, day))
  }

  $scope.gridOptions = {
    enableRowSelection: true,
    multiSelect: false,
    enableSelectionBatchEvent: false,
    enableFullRowSelection: true,
    enableRowHeaderSelection: false,
    enableGridMenu: true,
    enableColumnMenus: false,
    columnDefs: [{
      field: 'name',
      sort: {direction: uiGridConstants.ASC},
      visible: profile_settings.getSettings(view_name, 'name')
    }],
  }

  $scope.gridOptions.onRegisterApi = (gridApi) => {
    $scope.gridApi = gridApi
    gridApi.selection.on.rowSelectionChanged($scope, (row) => {
      if (row.isSelected) {
        $state.go("warehouse_edit", { id: row.entity.id })
      }
    })
    gridApi.core.on.columnVisibilityChanged($scope, (column) => {
      profile_settings.saveSettings(view_name, {[column.name]: column.visible})
    })
  }

  api.getWarehouses().then((response) => {
    if (response) {
      $scope.gridOptions.data = response.data
    }
  })
}
