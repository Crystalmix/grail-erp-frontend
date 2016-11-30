/* @flow */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import angular from 'angular'

export default ($scope, api, $state, $q, uiGridValidateService, $controller, xero, naturalService) => {
  $controller("BaseDetails", { $scope })

  $scope.data = {
    Type: xero.invoice.purchase_type,
    Contact: null,
    Date: null,
    OrderNumber: "",
    InvoiceNumber: null,
    Warehouse: null,
    LineItems: [],
    TotalTax: null,
    Total: null,
    DocumentNumber: '0001'
  }

  $scope.tax_rates = []
  $scope.suppliers = []
  $scope.warehouses = []
  $scope.products = []
  $scope.product_items = []

  $scope.supplierConfig = {
    create: false,
    valueField: 'id',
    labelField: 'Name',
    maxItems: 1,
    persist: false,
    searchField: ['Name'],
    onChange(val) { return $scope.data.Contact = parseInt(val, 10) }
  }

  $scope.warehouseConfig = {
    create: false,
    valueField: 'id',
    labelField: 'name',
    maxItems: 1,
    persist: false,
    searchField: ['name'],
    onChange(val) { return $scope.data.Warehouse = parseInt(val, 10) }
  }


  $scope.getAmount = (line_item) => {
    let amount = (line_item.Quantity * line_item.UnitAmount) || 0
    return amount.toFixed(2)
  }

  $scope.addLineItem = () => $scope.data.LineItems.push({})

  $scope.getSubTotal = () => {
    let total = _.reduce($scope.data.LineItems, (total, i) => {
        total + ( (i.Quantity || 0) * (i.UnitAmount || 0) )
      }, 0)
    return total
  }

  $scope.getTaxTotal = () => {
    let total = _.reduce($scope.data.LineItems, (total, i) => {
        let tax_rate_obj = _.findWhere($scope.tax_rates, {tax_type: i.TaxType})
        let tax_rate = __guard__(tax_rate_obj, x => x.rate) || 0
        tax_rate = tax_rate / 100
        return total + ( ( (i.Quantity || 0) * (i.UnitAmount || 0) ) * tax_rate)
      }, 0)
    $scope.data.TotalTax = total.toFixed(2)
    return total
  }

  $scope.getTotal = () => {
    let total = $scope.getSubTotal() + $scope.getTaxTotal()
    $scope.data.Total = total.toFixed(2)
    return total
  }

  let amountFieldTemplate = `<div class="ui-grid-cell-contents ng-binding ng-scope"> \
                              {{ grid.appScope.getAmount(row.entity) }} \
                            </div>`;
  let cellMenuTemplate = `<a \
                          ng-click="grid.appScope.removeLineItem(row, rowRenderIndex, rowIndex, this)" \
                          class="demo-delete-row btn btn-danger btn-xs"><i class="fa fa-remove"></i> \
                          </a>`;

  let check = (num = "") => {
    let test_num = num.toString()
    return (test_num.split('.')[1] || []).length
  }

  uiGridValidateService.setValidator('positive', (argument =>
    function(oldValue, newValue, rowEntity, colDef) {
      if (newValue <= 0) {
        return false;
      }
      return true;
    })
    , arg => 'value must be a positive integer');

  uiGridValidateService.setValidator('not_negative', (() =>
    function(oldValue, newValue) {
      if (newValue < 0) {
        return false;
      }
      return true;
    })
    , arg => "value must be zero or negative integer");

  uiGridValidateService.setValidator('decimal', (() =>
    function(oldValue, newValue) {
      if (check(newValue) > 4) {
        return false;
      }
      return true;
    })
    , arg => 'value exceeds 4 decimal places');

  $scope.natural = field => {
    item => naturalService.naturalValue(item[field])
  }

  $scope.onSelect = (model, rowRenderIndex) => {
    let line = $scope.data.LineItems[rowRenderIndex]
    let product = _.findWhere($scope.products, {Code: model.base_product_name})
    let tax_rate = _.findWhere($scope.tax_rates, {id: __guard__(product, x => x.TaxRate)})
    return line.TaxType = __guard__(tax_rate, x1 => x1.tax_type)
  }

  $scope.gridOptions = {
    enableSorting: false,
    enableGridMenu: false,
    data: "data.LineItems",
    columnDefs: [
      {
        field: 'Product',
        cellFilter: 'productFilter : col.colDef',
        editableCellTemplate: 'templates/purchases/cellEditTemplateProduct.html',
        editDropdownIdLabel: 'id',
        editDropdownValueLabel: 'Code',
        editDropdownOptionsArray: $scope.product_items,
        enableColumnMenu: false,
        enableCellEditOnFocus: true
      },
      {
        field: 'Quantity',
        type: 'number',
        enableColumnMenu: false,
        enableCellEditOnFocus: true,
        validators: {required: true, positive: true},
        cellTemplate: 'ui-grid/cellTitleValidator'
      },
      {
        field: 'UnitAmount',
        name: 'Price',
        type: 'numberStr',
        enableColumnMenu: false,
        enableCellEditOnFocus: true,
        validators: {required: true, not_negative: true, decimal:true},
        cellTemplate: 'ui-grid/cellTitleValidator'
      },
      {
        field: 'TaxType',
        cellFilter: 'taxRateFilter : grid.appScope.tax_rates',
        name: 'Tax Rate',
        type: 'number',
        editableCellTemplate: 'ui-grid/dropdownEditor',
        editDropdownIdLabel: 'tax_type',
        editDropdownValueLabel: 'name',
        editDropdownOptionsFunction(rowEntity, colDef) {
          return _.map($scope.tax_rates, i => ({tax_type: i.tax_type, name: `${i.name} (${i.rate}%)`}));
        },
        enableColumnMenu: false,
        enableCellEditOnFocus: true
      },
      {
        name: 'Amount',
        cellTemplate: amountFieldTemplate,
        type: 'number',
        enableCellEdit: false,
        enableColumnMenu: false
      },
      {
        name: ' ',
        enableCellEdit: false,
        enableColumnMenu: false,
        cellTemplate: cellMenuTemplate
      }
    ]
  }

  $scope.removeLineItem = row => {
    $scope.data.LineItems = _.reject($scope.data.LineItems, i => i.$$hashKey === row.entity.$$hashKey)
  }

  let init = () => {

    $q.all({
      suppliers: api.getSuppliers(),
      warehouses: api.getWarehouses(),
      tax_rates: api.getTaxRates(),
      products: api.getProducts(),
      last_doc_id: api.getSaleLastDocId()
    }).then(function(res) {
      $scope.suppliers = res.suppliers.data
      $scope.warehouses = res.warehouses.data

      // ToDo: I don't know why
      // $scope.tax_rates = res.tax_rates.data
      _.each(res.tax_rates.data, i => $scope.tax_rates.push(i))

      $scope.products = res.products.data;
      for (let product of $scope.products) {
        _.each(product.items, function(i) {
          i = _.extend(i, {base_product_name: product["Code"]})
            return $scope.product_items.push(i)
        })
      }
      if (res.last_doc_id.data) {
        $scope.data.InvoiceNumber = res.last_doc_id.data.purchase_next_id
      }

      if (!$scope.data.Warehouse) {
        let warehouse = _.first($scope.warehouses)
        if (warehouse) { return $scope.data.Warehouse = warehouse.id }
      }
    })

    if ($state.params.id) {
      api.getPurchase($state.params.id)
      .then(response => $scope.data = response.data)
    }
  }

  let validateUnitAmount = (UnitAmount) => {
    let length = check(UnitAmount)
    if ((typeof UnitAmount === "string"  && UnitAmount !== "") || typeof UnitAmount === "number") {
      UnitAmount = Number(UnitAmount)
    } else {
      UnitAmount = undefined
    }
    if (UnitAmount >= 0 && length <=4) {
      return true
    }
    return false
  }

  $scope.$watch('data.LineItems', function(newValue, oldValue) {
    // Add new line item
    let last = $scope.data.LineItems[$scope.data.LineItems.length - 1]
    if (__guard__(last, x => x.Product)) {
      return $scope.addLineItem();
    }
  }, true)

  $scope.isLineItems = () =>
    _.filter($scope.data.LineItems, val => val.Product)

  $scope.isLineItemsValid = () => {
    for (let item of $scope.data.LineItems) {
      if (item.Product && (!item.Quantity || !validateUnitAmount(item.UnitAmount))) {
        return false
      }
    }
    return true
  }

  $scope.save = () => {
    let { id } = $state.params
    let json = angular.toJson($scope.data)
    $scope.data.LineItems = _.filter($scope.data.LineItems, i => i.Product)
    if (id) {
      api.updatePurchase(id, json)
      .then(() => $state.go("purchases"))
    } else {
      api.addPurchase(angular.toJson($scope.data))
      .then(() => $state.go("purchases"))
    }
  }

  init()
}
