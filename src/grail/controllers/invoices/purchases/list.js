/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

export default ($scope, api, uiGridConstants, $state, $q, profile_settings) => {
  let view_name = 'purchases';

  $scope.gridOptions = {
    enableRowSelection: true,
    ultiSelect: false,
    enableSelectionBatchEvent: false,
    enableFullRowSelection: true,
    enableRowHeaderSelection: false,
    enableGridMenu: true,
    enableColumnMenus: false,
    columnDefs: [
      {
        displayName: 'PO Date',
        field: 'Date',
        sort: {direction: uiGridConstants.ASC},
        width: 100,
        type: 'date',
        cellFilter: 'date:\'dd/MM/yyyy\'',
        visible: profile_settings.getSettings(view_name, 'Date')
      },
      {
        field: 'Supplier',
        sort: {direction: uiGridConstants.ASC},
        visible: profile_settings.getSettings(view_name, 'Supplier')
      },
      {
        field: 'Warehouse',
        sort: {direction: uiGridConstants.ASC},
        visible: profile_settings.getSettings(view_name, 'Warehouse')
      },
    ]
  };

  $scope.gridOptions.onRegisterApi = (gridApi) => {
    $scope.gridApi = gridApi;
    gridApi.selection.on.rowSelectionChanged($scope, (row) => {
      if (row.isSelected) {
        $state.go("purchase_edit", {id: row.entity.id});
      }
    })
    gridApi.core.on.columnVisibilityChanged($scope, column => {
      profile_settings.saveSettings(view_name, {[column['name']] : column.visible})
    })
  }

  $q.all({
    purchases: api.getPurchases(),
    warehouses: api.getWarehouses(),
    suppliers: api.getSuppliers()
  }).then(function(res) {
    let callback = (obj, i) => {
      obj[i.id] = i;
      return obj;
    };

    if (res.purchases.data) {
      $scope.gridOptions.data = res.purchases.data
    }

    //let warehouses = res.warehouses.data;
    let warehouses = _.reduce(res.warehouses.data, callback, {});
    _.each($scope.gridOptions.data, i => i.Warehouse = warehouses[i.Warehouse].name);

    //let suppliers = res.suppliers.data;
    let suppliers = _.reduce(res.suppliers.data, callback, {});
    _.each($scope.gridOptions.data, i => i.Supplier = suppliers[i.Contact].Name);
  })
}
