/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import angular from 'angular'
import { __guard__, amountFieldTemplate, cellMenuTemplate } from '../utils'

import cellEditTemplateProduct from '../../../../templates/purchases/cellEditTemplateProduct.tpl.html'

export default ($scope, api, $state, $q, uiGridValidateService, $controller, xero) => {
  $controller('BaseDetails', { $scope })
  $controller('InvoiceDetails', { $scope })

  const initialData = {
    Type: xero.invoice.purchase_type,
    Contact: null,
    Date: null,
    OrderNumber: null,
    InvoiceNumber: null,
    Warehouse: null,
    LineItems: [],
    TotalTax: null,
    Total: null,
    DocumentNumber: '0001',
  }

  const supplierConfig = {
    create: false,
    valueField: 'id',
    labelField: 'Name',
    maxItems: 1,
    persist: false,
    searchField: ['Name'],
    onChange(val) { $scope.data.Contact = parseInt(val, 10) },
  }

  const warehouseConfig = {
    create: false,
    valueField: 'id',
    labelField: 'name',
    maxItems: 1,
    persist: false,
    searchField: ['name'],
    onChange(val) { $scope.data.Warehouse = parseInt(val, 10) },
  }

  $scope.data = initialData
  $scope.tax_rates = []
  $scope.suppliers = []
  $scope.warehouses = []
  $scope.products = []
  $scope.product_items = []
  $scope.supplierConfig = supplierConfig
  $scope.warehouseConfig = warehouseConfig

  $scope.onSelect = (model, rowRenderIndex) => {
    const line = $scope.data.LineItems[rowRenderIndex]
    const product = _.findWhere($scope.products, { Code: model.base_product_name })
    const tax_rate = _.findWhere($scope.tax_rates, { id: __guard__(product, x => x.TaxRate) })
    line.TaxType = __guard__(tax_rate, x1 => x1.tax_type)
  }

  $scope.gridOptions = {
    enableSorting: false,
    enableGridMenu: false,
    data: 'data.LineItems',
    columnDefs: [
      {
        field: 'Product',
        cellFilter: 'productFilter : col.colDef',
        editableCellTemplate: cellEditTemplateProduct,
        editDropdownIdLabel: 'id',
        editDropdownValueLabel: 'Code',
        editDropdownOptionsArray: $scope.product_items,
        enableColumnMenu: false,
        enableCellEditOnFocus: true,
      },
      {
        field: 'Quantity',
        type: 'number',
        enableColumnMenu: false,
        enableCellEditOnFocus: true,
        validators: { required: true, positive: true },
        cellTemplate: 'ui-grid/cellTitleValidator',
      },
      {
        field: 'UnitAmount',
        name: 'Price',
        type: 'numberStr',
        enableColumnMenu: false,
        enableCellEditOnFocus: true,
        validators: { required: true, not_negative: true, decimal: true },
        cellTemplate: 'ui-grid/cellTitleValidator',
      },
      {
        field: 'TaxType',
        cellFilter: 'taxRateFilter : grid.appScope.tax_rates',
        name: 'Tax Rate',
        type: 'number',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'tax_type',
        editDropdownValueLabel: 'name',
        editDropdownOptionsFunction() {
          return _.map($scope.tax_rates, i => ({ tax_type: i.tax_type, name: `${i.name} (${i.rate}%)` }))
        },
        enableColumnMenu: false,
        enableCellEditOnFocus: true,
      },
      {
        name: 'Amount',
        cellTemplate: amountFieldTemplate,
        type: 'number',
        enableCellEdit: false,
        enableColumnMenu: false,
      },
      {
        name: ' ',
        enableCellEdit: false,
        enableColumnMenu: false,
        cellTemplate: cellMenuTemplate,
      },
    ],
  }

  const init = () => {
    $q.all({
      suppliers: api.getSuppliers(),
      warehouses: api.getWarehouses(),
      tax_rates: api.getTaxRates(),
      products: api.getProducts(),
      last_doc_id: api.getSaleLastDocId(),
    }).then((res) => {
      $scope.suppliers = res.suppliers.data
      $scope.warehouses = res.warehouses.data

      // ToDo: I don't know why
      // $scope.tax_rates = res.tax_rates.data
      _.each(res.tax_rates.data, i => $scope.tax_rates.push(i))

      $scope.products = res.products.data
      for (const product of $scope.products) {
        _.each(product.items, (i) => {
          i = _.extend(i, { base_product_name: product.Code })
          $scope.product_items.push(i)
        })
      }
      if (res.last_doc_id.data) {
        $scope.data.InvoiceNumber = res.last_doc_id.data.purchase_next_id
      }

      if (!$scope.data.Warehouse) {
        const warehouse = _.first($scope.warehouses)
        if (warehouse) { $scope.data.Warehouse = warehouse.id }
      }
    })

    if ($state.params.id) {
      api.getPurchase($state.params.id)
      .then((response) => { $scope.data = response.data })
    }
  }

  $scope.save = () => {
    const { id } = $state.params
    const json = angular.toJson($scope.data)
    // TODO: why it doesn't filter???
    $scope.data.LineItems = _.filter($scope.data.LineItems, i => i.Product)
    if (id) {
      api.updatePurchase(id, json)
      .then(() => $state.go('purchases'))
    } else {
      api.addPurchase(angular.toJson($scope.data))
      .then(() => $state.go('purchases'))
    }
  }

  init()
}
