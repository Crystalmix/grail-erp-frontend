/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

export default ($scope, api, uiGridConstants, $state, profile_settings) => {
  const view_name = 'sales'

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
        name: 'Inv. Date',
        field: 'Date',
        sort: { direction: uiGridConstants.ASC },
        width: 100,
        type: 'date',
        cellFilter: 'date:\'dd/MM/yyyy\'',
        visible: profile_settings.getSettings(view_name, 'Inv. Date'),
      },
      {
        name: 'Doc. No.',
        field: 'InvoiceNumber',
        sort: { direction: uiGridConstants.ASC },
        width: 100,
        visible: profile_settings.getSettings(view_name, 'Doc. No.'),
      },
      {
        field: 'Customer',
        sort: { direction: uiGridConstants.ASC },
        visible: profile_settings.getSettings(view_name, 'Customer'),
      },
      {
        field: 'Location',
        sort: { direction: uiGridConstants.ASC },
        visible: profile_settings.getSettings(view_name, 'Location'),
      },
      {
        name: 'Order No.',
        field: 'OrderNumber',
        sort: { direction: uiGridConstants.ASC },
        visible: profile_settings.getSettings(view_name, 'Order No.'),
      },
    ],
  }

  $scope.gridOptions.onRegisterApi = (gridApi) => {
    $scope.gridApi = gridApi
    gridApi.selection.on.rowSelectionChanged($scope, (row) => {
      if (row.isSelected) {
        $state.go('sale_edit', { id: row.entity.id })
      }
    })
    gridApi.core.on.columnVisibilityChanged($scope, column => {
      profile_settings.saveSettings(view_name, { [column.name]: column.visible })
    })
  }


  api.getSales().then(response => {
    $scope.gridOptions.data = response ? response.data : undefined
  })

  api.getContacts().then((response) => {
    let contacts = response.data
    const callback = (obj, i) => {
      obj[i.id] = i
      return obj
    }
    contacts = _.reduce(response.data, callback, {})

    _.each($scope.gridOptions.data, (i) => {
      if (i.Location) {
        const location = _.find(contacts[i.Contact].Locations, loc => loc.id === i.Location)
        i.Location = location.Name
      }
      i.Customer = contacts[i.Contact].Name
    })
  })
}
