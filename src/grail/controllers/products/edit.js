/* @flow */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

import edit_quantity_template from '../../../templates/products/edit_quantity.tpl.html'

export default ($scope, $controller, api, $state, ngDialog, uiGridConstants, $q) => {
  let lastWeight = 0
  let product_id = $state.params.id

  $controller('ProductDetailsBase', { $scope })
  $scope.is_new = false
  $scope.warehouses = []
  $scope.showInactive = true

  $scope.toggleFiltering = () => {
    $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering
    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN)
  }

  $scope.removeProductItem = (item) => {
    product_id = $scope.product.id
    const item_id = item.id
    api.deactivateProductItem(product_id, item_id)
    .then(() => {
      item = _.findWhere($scope.productItems, { id: item_id })
      item.is_active = false
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN)
    })
  }

  $scope.activateProductItem = (item) => {
    product_id = $scope.product.id
    const item_id = item.id
    api.activateProductItem(product_id, item_id)
    .then(() => {
      item = _.findWhere($scope.productItems, { id: item_id })
      item.is_active = true
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN)
    })
  }

  const productItemCellTemplate = "<div ng-click='grid.appScope.open(row.entity)' class='ui-grid-cell-contents'> {{ grid.appScope.getQuantity(row.entity) }} </div>"

  const cellMenuTemplate = '<div class="btn-group"> <button title="Deactivate" ng-click="grid.appScope.removeProductItem(row.entity)" ng-show="row.entity.is_active == true" class="btn btn-danger btn-icon btn-xs"><i class="fa fa-remove"></i> </button> <button title="Activate" ng-click="grid.appScope.activateProductItem(row.entity)" ng-show="row.entity.is_active == false" class="btn btn-success btn-icon btn-xs"><i class="fa fa-check"></i> </button> <span title="Activate" ng-show="row.entity.is_active == undefined"</span> </div>'


  const gridAddColumnsFromItems = (items) => {
    const fields = _.union.apply(null, _.map(_.pluck(items, 'data'), _.keys))
    _.each(fields, field =>
          $scope.gridOptions.columnDefs.splice($scope.gridOptions.columnDefs.length - 2, 0, {
            name: field,
            enableFiltering: false,
            field: `data.${field}`,
          }))
  }

  $scope.getQuantity = (item) => {
    const quantity = _.reduce(item.warehouses, (total, i) => total + (i.quantity || 0), 0)
    return quantity
  }

  $scope.gridOptions = {
    enableFiltering: !$scope.showInactive,
    enableSorting: false,
    enableGridMenu: false,
    onRegisterApi(gridApi) { $scope.gridApi = gridApi },
    data: 'productItems',
    columnDefs: [
      {
        field: 'weight',
        visible: false,
        sort: { direction: 'asc', priority: 0,
        },
      },
      {
        field: 'id',
        visible: false,
      },
      {
        field: 'is_active',
        visible: false,
        enableFiltering: false,
        filter: {
          noTerm: true,
          condition(searchTerm, cellValue) {
            return cellValue
          },
        },

      },
      {
        field: 'Code',
        enableFiltering: false,
      },
      {
        name: 'Quantity',
        cellTemplate: productItemCellTemplate,
        enableCellEdit: false,
        enableFiltering: false,
      },
      {
        name: 'Activate/Deactivate',
        enableCellEdit: false,
        enableColumnMenu: false,
        cellTemplate: cellMenuTemplate,
        enableFiltering: false,
      },
    ],
  }

  const findProduct = list => _.find(list, val => val.id === parseInt(product_id, 10))

  const prepareProductAccount = () => {
    if (!$scope.product.Account) {
      $scope.product.Account = $scope.default_sales_account
    } else {
      $scope.default_sales_account = null
    }
  }

  const prepareProductTax = () => {
    if (!$scope.product.TaxRate) {
      $scope.product.TaxRate = $scope.default_tax_rule
    } else {
      $scope.default_tax_rule = null
    }
  }

  const findLastWeight = () => {
    _.each($scope.productItems, (item) => {
      if (lastWeight < item.weight) { lastWeight = item.weight }
    })
  }

  const prepareItemWarehouses = item => {
    _.each($scope.warehouses, (warehouse) => {
      if (!_.findWhere(item.warehouses, { id: warehouse.id })) {
        item.warehouses.push({ id: warehouse.id, quantity: 0 })
      }
    })
  }


  const callbackInitProduct = (response) => {
    $scope.product = response ? findProduct(response.data) : undefined
    $scope.productItems = $scope.product ? $scope.product.items : undefined
    prepareProductAccount()
    prepareProductTax()
    gridAddColumnsFromItems($scope.productItems)
    findLastWeight()
  }

  const promises = {
    accounts: api.getAccounts(),
    warehouses: api.getWarehouses(),
    tax_rates: api.getTaxRates(),
    products: api.getProducts(),
  }

  $q.all(promises).then((res) => {
    $scope.accounts = res.accounts.data
    $scope.taxRates = res.tax_rates.data
    $scope.warehouses = res.warehouses.data
    return callbackInitProduct(res.products)
  })

  $scope.open = (item) => {
    prepareItemWarehouses(item)
    ngDialog.open({
      template: edit_quantity_template,
      plain: true,
      className: 'ngdialog-theme-default',
      controller: 'EditQuantity',
      resolve: {
        product_item() { return item },
        warehouses() { return $scope.warehouses },
      },
    })
  }

  $scope.addProductItem = () => {
    lastWeight += 1
    $scope.productItems.push({ data: {}, weight: lastWeight })
  }
}
