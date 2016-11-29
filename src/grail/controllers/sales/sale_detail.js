/* @flow */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import angular from 'angular'

import cellEditTemplateProduct from '../../../templates/sales/cellEditTemplateProduct.tpl.html'

/* eslint no-underscore-dangle: 0 */
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

export default ($scope, api, $state, $q, $controller, uiGridValidateService, popup, xero, naturalService) => {
  $controller('BaseDetails', { $scope })

  $scope.export = () => popup(api.getInvoiceExportXeroUrl($state.params.id))

  $scope.isNew = $state.params.hasOwnProperty('id')

  $scope.data = {
    Type: xero.invoice.sale_type,
    Contact: null,
    Date: null,
    OrderNumber: null,
    InvoiceNumber: null,
    Warehouse: null,
    LineItems: [],
    TotalTax: null,
    Total: null,
    DocumentNumber: '0001',
    Location: null,
    Attention: null,
  }

  $scope.tax_rates = []
  $scope.customers = []
  $scope.locations = []
  $scope.warehouses = []
  $scope.products = []
  $scope.product_items = []
  $scope.location_address = ''
  $scope.removeLineItems = []

  $scope.customerConfig = {
    create: false,
    valueField: 'id',
    labelField: 'Name',
    maxItems: 1,
    persist: false,
    searchField: ['Name'],
    onChange(val) {
      const id = parseInt(val, 10)
      $scope.data.Contact = id

      const customer = _.findWhere($scope.customers, { id })
      $scope.locations = __guard__(customer, x => x.Locations) || []
      if (__guard__($scope.locations, x1 => x1.length) === 1) {
        $scope.data.Location = __guard__($scope.locations[0], x2 => x2.id)
      } else {
        $scope.data.Location = null
      }
      return $scope.$apply()
    },
  }

  $scope.locationConfig = {
    create: false,
    valueField: 'id',
    labelField: 'Name',
    maxItems: 1,
    persist: false,
    searchField: ['Name'],
    onChange(val) {
      const id = parseInt(val, 10)
      $scope.data.Location = id

      const location = _.findWhere($scope.locations, { id })
      if (__guard__(location, x => x.Warehouse)) { $scope.data.Warehouse = location.Warehouse }

      return $scope.$apply()
    },
  }

  $scope.warehouseConfig = {
    create: false,
    valueField: 'id',
    labelField: 'name',
    maxItems: 1,
    persist: false,
    searchField: ['name'],
    onChange(val) { $scope.data.Warehouse = parseInt(val, 10) },
  }

  const getLocationAddress = (location) => {
    if (!location) {
      return ''
    }
    return `${location.AddressLine1} ${location.AddressLine2} ${location.AddressLine3} \
${location.Country} ${location.PostCode}`
  }

  const check = (num = '') => {
    const test_num = num.toString()
    return (test_num.split('.')[1] || []).length
  }

  $scope.$watch('data.Location', (newValue) => {
    const location = _.findWhere($scope.locations, { id: newValue })
    $scope.location_address = getLocationAddress(location)
    if (location) { $scope.location_attention = location.Attention }
  })

  $scope.getAmount = (line_item) => {
    const amount = (line_item.Quantity * line_item.UnitAmount) || 0
    return amount.toFixed(2)
  }

  $scope.addLineItem = () => $scope.data.LineItems.push({})

  $scope.getSubTotal = () => {
    const total = _.reduce($scope.data.LineItems, (total, i) => total + ((i.Quantity || 0) * (i.UnitAmount || 0))
      , 0)
    return total
  }

  $scope.getTaxTotal = () => {
    const total = _.reduce($scope.data.LineItems, (total, i) => {
      const tax_rate_obj = _.findWhere($scope.tax_rates, { tax_type: i.TaxType })
      let tax_rate = __guard__(tax_rate_obj, x => x.rate) || 0
      tax_rate /= 100
      return total + (((i.Quantity || 0) * (i.UnitAmount || 0)) * tax_rate)
    }
      , 0)
    $scope.data.TotalTax = total.toFixed(2)
    return total
  }

  $scope.getTotal = () => {
    const total = $scope.getSubTotal() + $scope.getTaxTotal()
    $scope.data.Total = total.toFixed(2)
    return total
  }

  const amountFieldTemplate = '<div class="ui-grid-cell-contents ng-binding ng-scope"> \
{{ grid.appScope.getAmount(row.entity) }}</div>'
  const cellMenuTemplate = '\
<a ng-click="grid.appScope.removeLineItem(row, rowRenderIndex, rowIndex, this)" \
class="demo-delete-row btn btn-danger btn-xs"><i class="fa fa-remove"></i> \
</a>'

  uiGridValidateService.setValidator('positive', (() =>
      (oldValue, newValue) => {
        if (newValue <= 0) {
          return false
        }
        return true
      })
      , () => 'value must be a positive integer')

  uiGridValidateService.setValidator('not_negative', (() =>
      (oldValue, newValue) => {
        if (newValue < 0) {
          return false
        }
        return true
      })
      , () => 'value must be zero or negative integer')

  uiGridValidateService.setValidator('decimal', (() =>
      (oldValue, newValue) => {
        if (check(newValue) > 4) {
          return false
        }
        return true
      })
      , () => 'value exceeds 4 decimal places')

  $scope.natural = field =>
      item => naturalService.naturalValue(item[field])


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
    rowHeight: 38,
    columnDefs: [
      {
        field: 'Product',
        cellFilter: 'productFilter : col.colDef',
        // editableCellTemplate: 'templates/sales/cellEditTemplateProduct.html',
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
          { name: 'Amount', cellTemplate: amountFieldTemplate, enableCellEdit: false, enableColumnMenu: false },
          { name: ' ', enableCellEdit: false, enableColumnMenu: false, cellTemplate: cellMenuTemplate },
    ],
  }

  $scope.removeLineItem = (row) => {
    $scope.removeLineItems.push(_.findWhere($scope.data.LineItems, { id: row.entity.id }))
    $scope.data.LineItems = _.reject($scope.data.LineItems, i => (
      i.$$hashKey === row.entity.$$hashKey
    ))
  }

  const init = () => {
    const onCustomers = customers => { $scope.customers = customers }
    const onWarehouses = warehouses => { $scope.warehouses = warehouses }
    const onLastDocId = data => { $scope.data.InvoiceNumber = data.sale_next_id }

    const onTaxRates = tax_rates =>
          // ToDo: I don't know why
          // $scope.tax_rates = res.tax_rates.data
          _.each(tax_rates, i => $scope.tax_rates.push(i))


    const onProducts = (products) => {
      $scope.products = products
      $scope.products.map((product) =>
        _.each(product.items, (i) => {
          i = _.extend(i, { base_product_name: product.Code })
          $scope.product_items.push(i)
        }
      ))
    }

    const onSale = (sale) => {
      _.extend($scope.data, sale)
      if (!$scope.data.Warehouse) {
        const warehouse = _.first($scope.warehouses)
        if (warehouse) { $scope.data.Warehouse = warehouse.id }
      }
      _.each($scope.data.LineItems, i => { i.UnitAmount = Number(i.UnitAmount) })

      const customer = _.findWhere($scope.customers, { id: $scope.data.Contact })
      $scope.locations = __guard__(customer, x => x.Locations) || []
    }


    const promises = {
      customers: api.getCustomers(),
      warehouses: api.getWarehouses(),
      tax_rates: api.getTaxRates(),
      products: api.getProducts(),
    }

    if ($state.params.id) {
      _.extend(promises, { sale: api.getSale($state.params.id) })
    } else {
      _.extend(promises, { last_doc_id: api.getSaleLastDocId() })
    }

    $q.all(promises).then((res) => {
      onCustomers(res.customers.data)
      onWarehouses(res.warehouses.data)
      onTaxRates(res.tax_rates.data)
      onProducts(res.products.data)
      onSale(__guard__(res.sale, x => x.data))
      if (res.last_doc_id) { onLastDocId(res.last_doc_id.data) }
    })
  }

  const callbackRemoveLineItems = (item) => {
    if (item) {
      const invoice_id = $scope.data.id
      return api.deleteInvoiceLineItem(invoice_id, item.id)
    }
    return undefined
  }

  const validateUnitAmount = (UnitAmount) => {
    const length = check(UnitAmount)
    if ((typeof UnitAmount === 'string' && UnitAmount !== '') || typeof UnitAmount === 'number') {
      UnitAmount = Number(UnitAmount)
    } else {
      UnitAmount = undefined
    }
    if (UnitAmount >= 0 && length <= 4) {
      return true
    }
    return false
  }

  $scope.$watch('data.LineItems', () => {
      // Add new line item
    const last = $scope.data.LineItems[$scope.data.LineItems.length - 1]
    if (__guard__(last, x => x.Product)) {
      $scope.addLineItem()
    }
  }, true)

  $scope.isLineItems = () => _.filter($scope.data.LineItems, val => val.Product)


  $scope.isLineItemsValid = () => {
    for (const item of $scope.data.LineItems) {
      if (item.Product && (!item.Quantity || !validateUnitAmount(item.UnitAmount))) {
        return false
      }
    }
    return true
  }

  $scope.save = () => {
    if (!$scope.data.Attention) {
      $scope.data.Attention = $scope.location_attention
    }

    const { id } = $state.params

    $scope.data.LineItems = _.filter($scope.data.LineItems, i => i.Product)

    if (id) {
      const json = angular.toJson($scope.data)

      $q.all(_.map($scope.removeLineItems, callbackRemoveLineItems))
      .then(() =>
          api.updateSale(id, json).then(() => $state.go('sales'))
      )
    } else {
      api.addSale(angular.toJson($scope.data)).then(() => $state.go('sales'))
    }
  }


  init()
}
