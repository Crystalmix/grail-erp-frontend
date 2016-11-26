/* @flow weak */

import type { XeroConst } from '../constants/xero'

export default ($http, configs, auth_status, $state, $exceptionHandler, xero: XeroConst) => {
  const api = {}
  api.request = (method, path, body) => $http({
    method,
    url: `${configs.API_URL}/api${path}`,
    data: body,
    headers: {
      Authorization: `Token ${auth_status.getToken()}`,
    },
  }).error((response, status) => {
    if (status === 401) {
      auth_status.clear()
      return $state.go('accounts')
    } else {
      return $exceptionHandler(status, response)
    }
  })

  api.auth_request = (method, path, body) => $http({
    method,
    url: `${configs.API_URL}/rest-auth${path}`,
    data: body,
  })

  api.user_profile_request = (method, path, body) => $http({
    method,
    url: `${configs.API_URL}/rest-auth${path}`,
    data: body,
    headers: {
      Authorization: `Token ${auth_status.getToken()}`,
    },
  }).error((response, status) => {
    if (status === 401) {
      auth_status.clear()
      return $state.go('accounts')
    } else {
      return $exceptionHandler(status, response)
    }
  })

  api.login = function (data) {
    return this.auth_request('POST', '/login/', data)
  }

  api.logout = function () {
    return this.auth_request('GET', '/logout/')
  }

  api.reset = function (data) {
    return this.auth_request('POST', '/password/reset/', data)
  }

  api.registration = function (data) {
    return this.auth_request('POST', '/registration/', data)
  }

  api.getProfile = function () {
    return this.user_profile_request('GET', '/user/')
  }

  api.updateProfile = function (data) {
    return this.user_profile_request('PUT', '/user/', data)
  }

  api.getOrganizartions = function () {
    return this.request('GET', '/organizations/')
  }

  api.updateOrganization = function (id, data) {
    return this.request('PUT', `/organizations/${id}/`, data)
  }

  api.getOrganizartionImportXeroUrl = () => `${configs.API_SERVER}/xero/organizations/organization/import/?token=${auth_status.getToken()}`

  api.getTaxRatesAndAccountsImportXeroUrl = () => `${configs.API_SERVER}/xero/others/tax_rates_accounts/import/?token=${auth_status.getToken()}`

  // Customers and Suppliers
  api.getCustomerExportXeroUrl = id => `${configs.API_SERVER}/xero/contacts/contacts/export/${id}/?token=${auth_status.getToken()}`

  // Customers and Suppliers
  api.getCustomerExportXeroUrl = id => `${configs.API_SERVER}/xero/contacts/contacts/export/${id}/?token=${auth_status.getToken()}`

  api.getContacts = function () {
    return this.request('GET', '/contacts/')
  }

  api.getCustomers = function () {
    return this.request('GET', '/contacts/?IsCustomer=True')
  }

  api.getSuppliers = function () {
    return this.request('GET', '/contacts/?IsSupplier=True')
  }

  api.updateContact = function (id, data) {
    return this.request('PUT', `/contacts/${id}/`, data)
  }

  api.addContact = function (data) {
    return this.request('POST', '/contacts/', data)
  }

  api.deleteContactLocation = function (contact_id, location_id) {
    return this.request('Delete', `/contacts/${contact_id}/delete_location/${location_id}/`)
  }

  api.getContactsImportXeroUrl = () => `${configs.API_SERVER}/xero/contacts/contacts/import/?token=${auth_status.getToken()}`

  api.getContactsExportXeroUrl = () => `${configs.API_SERVER}/xero/contacts/contacts/export/?token=${auth_status.getToken()}`

  // Warehouses
  api.getWarehouses = function () {
    return this.request('GET', '/warehouses/')
  }

  api.updateWarehouse = function (id, data) {
    return this.request('PUT', `/warehouses/${id}/`, data)
  }

  api.addWarehouse = function (data) {
    return this.request('POST', '/warehouses/', data)
  }

  // Products
  api.getProducts = function () {
    return this.request('GET', '/products/')
  }

  api.updateProduct = function (id, data) {
    return this.request('PUT', `/products/${id}/`, data)
  }

  api.addProduct = function (data) {
    return this.request('POST', '/products/', data)
  }

  api.deactivateProductItem = function (product_id, item_id) {
    return this.request('POST', `/products/${product_id}/deactivate_item/${item_id}/`)
  }

  api.activateProductItem = function (product_id, item_id) {
    return this.request('POST', `/products/${product_id}/activate_item/${item_id}/`)
  }

  // Purchases
  api.getPurchases = function () {
    return this.request('GET', `/invoices/?Type=${xero.invoice.purchase_type}`)
  }

  api.getPurchase = function (id) {
    return this.request('GET', `/invoices/${id}/`)
  }

  api.updatePurchase = function (id, data) {
    return this.request('PUT', `/invoices/${id}/`, data)
  }

  api.addPurchase = function (data) {
    return this.request('POST', '/invoices/', data)
  }

  api.deleteInvoiceLineItem = function (invoice_id, item_id) {
    return this.request('Delete', `/invoices/${invoice_id}/delete_item/${item_id}/`)
  }

  api.getInvoiceExportXeroUrl = id => `${configs.API_SERVER}/xero/invoices/invoices/export/${id}/?token=${auth_status.getToken()}`

  // Sales

  api.getInvoiceExportXeroUrl = id => `${configs.API_SERVER}/xero/invoices/invoices/export/${id}/?token=${auth_status.getToken()}`

  api.getSaleLastDocId = function () {
    return this.request('GET', '/invoices/last_doc_id/')
  }

  api.getSales = function () {
    return this.request('GET', `/invoices/?Type=${xero.invoice.sale_type}`)
  }

  api.getSale = function (id) {
    return this.request('GET', `/invoices/${id}/`)
  }

  api.updateSale = function (id, data) {
    return this.request('PUT', `/invoices/${id}/`, data)
  }

  api.addSale = function (data) {
    return this.request('POST', '/invoices/', data)
  }

  // Accounts
  api.getAccounts = function () {
    return this.request('GET', '/accounts/')
  }

  // Tax Rates
  api.getTaxRates = function () {
    return this.request('GET', '/tax_rates/')
  }

  return api
}
