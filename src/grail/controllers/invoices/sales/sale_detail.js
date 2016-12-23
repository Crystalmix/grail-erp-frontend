/* @flow weak */
/* eslint no-param-reassign: 0 */
/* eslint no-underscore-dangle: 0 */

import _ from 'underscore'
import angular from 'angular'
import { __guard__, amountFieldTemplate, cellMenuTemplate } from '../utils'

import cellEditTemplateProduct from '../../../../templates/sales/cellEditTemplateProduct.tpl.html'
import error_quantity_template from '../../../../templates/sales/error_quantity_template.tpl.html'

export default ($scope, api, $state, $q, $controller, uiGridValidateService, ngDialog, popup, xero) => {
  $controller('BaseDetails', { $scope })
  $controller('InvoiceDetails', { $scope })

  const initialData = {
    Type: xero.invoice.sale_type,
    Contact: null,
    Date: null,
    DueDate: null,
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

  const customerConfig = {
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

  const locationConfig = {
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

  const warehouseConfig = {
    create: false,
    valueField: 'id',
    labelField: 'name',
    maxItems: 1,
    persist: false,
    searchField: ['name'],
    onChange(val) { $scope.data.Warehouse = parseInt(val, 10) },
  }

  const status = [
    {
      name: 'SALE_ORDER',
      label_name: 'Sale Order',
      date: 'SalesOrderDate',
    },
    {
      name: 'DELIVERY',
      label_name: 'Delivery',
      date: 'DeliveryDate',
    },
    {
      name: 'INVOICE',
      label_name: 'Invoice',
      date: 'InvoiceDate',
    },
  ]

  const callbackRemoveLineItems = (item) => {
    if (item) {
      const invoice_id = $scope.data.id
      return api.deleteInvoiceLineItem(invoice_id, item.id)
    }
    return undefined
  }

  const getLocationAddress = (location) => {
    if (!location) { return '' }
    return `${location.AddressLine1} ${location.AddressLine2} ${location.AddressLine3} \
            ${location.Country} ${location.PostCode}`
  }

  const openWarnDialog = () => {
    ngDialog.open({
      template: `<p>
                  <b>Please add Product Items</b>
                  <div><span>Add Product, Quantity and Price</span></div>
                </p>`,
      plain: true })
  }

  const onChangeLocation = (newValue) => {
    const location = _.findWhere($scope.locations, { id: newValue })
    $scope.location_address = getLocationAddress(location)
    if (location) { $scope.location_attention = location.Attention }
  }

  const save = (callback) => {
    if (!$scope.data.Attention) {
      $scope.data.Attention = $scope.location_attention
    }

    const { id } = $scope.data || $state.params

    $scope.data.LineItems = _.filter($scope.data.LineItems, i => i.Product)

    if (id) {
      const json = angular.toJson($scope.data)

      $q.all(_.map($scope.removeLineItems, callbackRemoveLineItems))
      .then(() =>
          api.updateSale(id, json).then((response) => callback ? callback(response.data) : undefined)
      )
    } else {
      api.addSale(angular.toJson($scope.data)).then((response) => callback ? callback(response.data) : undefined)
    }
  }

  const updateStatusModel = (index) => {
    const date = new Date($scope.data.Date)
    $scope.data.Status = $scope.status[index].name
    $scope.data[$scope.status[index].date] = date.toISOString()
    save((data) => { $scope.data = data })
  }

  const saveAndTryUpdateStock = (index) => {
    const callback = (data) => {
      $scope.data = data
      api.updateStock($scope.data.id).then(() => {
        updateStatusModel(index)
      }, (response) => {
        ngDialog.open({
          template: error_quantity_template,
          plain: true,
          className: 'ngdialog-theme-default',
          controller: 'ErrorQuantity',
          resolve: {
            not_enough_list() { return response.data },
            warehouses() { return $scope.warehouses },
            products() { return $scope.products },
            sale() { return $scope.data },
          },
        })
      })
    }
    save((data) => callback(data))
  }

  const changeStatus = () => {
    const currentStatus = $scope.data.Status
    let index = _.findIndex($scope.status, (val) => val.name === currentStatus)
    index += 1
    const next_status = $scope.status[index]
    if (next_status) {
      const is_status_invoice = next_status.name === _.last($scope.status).name
      if (is_status_invoice) {
        const is_product_items = $scope.isLineItems().length && $scope.isLineItemsValid()
        if (is_product_items) {
          saveAndTryUpdateStock(index)
        } else { openWarnDialog() }
      } else { updateStatusModel(index) }
    }
  }

  // TODO: save before export Invoice
  $scope.export = () => popup(api.getInvoiceExportXeroUrl($state.params.id))

  $scope.isEdit = $state.params.hasOwnProperty('id')

  $scope.data = initialData
  $scope.tax_rates = []
  $scope.customers = []
  $scope.locations = []
  $scope.warehouses = []
  $scope.products = []
  $scope.product_items = []
  $scope.location_address = ''
  $scope.removeLineItems = []
  $scope.customerConfig = customerConfig
  $scope.locationConfig = locationConfig
  $scope.warehouseConfig = warehouseConfig
  $scope.status = status

  $scope.$watch('data.Location', (newValue) => onChangeLocation(newValue))
  $scope.$watch('data.Date', (newValue) => $scope.data.SalesOrderDate = newValue)

  $scope.onSelect = (model, rowRenderIndex) => {
    const line = $scope.data.LineItems[rowRenderIndex]
    const product = _.findWhere($scope.products, { Code: model.base_product_name })
    const tax_rate = _.findWhere($scope.tax_rates, { id: __guard__(product, x => x.TaxRate) })
    line.TaxType = __guard__(tax_rate, x1 => x1.tax_type)
    line.UnitAmount = __guard__(product.sell_price, x => x)
  }

  $scope.changeStatus = () => changeStatus()

  $scope.isAvailableToSave = () => {
    if ($scope.isLineItems().length) {
      return $scope.isLineItemsValid()
    }
    return true
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

  $scope.save = () => save(() => $state.go('sales'))

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
      if (!$scope.isEdit) {
        $scope.data.Status = _.first(status).name
        $scope.data.SalesOrderDate = $scope.data.Date
      }
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

  init()
}
