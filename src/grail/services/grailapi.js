/* @flow weak */

import type { XeroConst } from '../constants/xero'

type HTTPMethod = string

export default ($http, configs, auth_status, $state, $exceptionHandler, xero: XeroConst) => {
  const api = {}

  api.request = (method: HTTPMethod, path: string, body: any) => $http({
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

  api.auth_request = (method: HTTPMethod, path: string, body: any) => $http({
    method,
    url: `${configs.API_URL}/rest-auth${path}`,
    data: body,
  })

  api.user_profile_request = (method: HTTPMethod, path: string, body: any) => $http({
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

  api.login = (data: {}) => api.auth_request('POST', '/login/', data)
  api.logout = () => api.auth_request('GET', '/logout/')
  api.reset = (data: {}) => api.auth_request('POST', '/password/reset/', data)
  api.registration = (data: {}) => api.auth_request('POST', '/registration/', data)

  api.getProfile = () => api.user_profile_request('GET', '/user/')
  api.updateProfile = (data: {}) => api.user_profile_request('PUT', '/user/', data)

  api.getOrganizartions = () => api.request('GET', '/organizations/')
  api.updateOrganization = (id: number, data: {}) => api.request('PUT', `/organizations/${id}/`, data)
  api.getOrganizartionImportXeroUrl = () => `${configs.API_SERVER}/xero/organizations/organization/import/?token=${auth_status.getToken()}`
  api.getTaxRatesAndAccountsImportXeroUrl = () => `${configs.API_SERVER}/xero/others/tax_rates_accounts/import/?token=${auth_status.getToken()}`

  // Customers and Suppliers
  api.getCustomerExportXeroUrl = (id: number) => `${configs.API_SERVER}/xero/contacts/contacts/export/${id}/?token=${auth_status.getToken()}`
  api.getContacts = () => api.request('GET', '/contacts/')
  api.getCustomers = () => api.request('GET', '/contacts/?IsCustomer=True')
  api.getSuppliers = () => api.request('GET', '/contacts/?IsSupplier=True')
  api.updateContact = (id: number, data: {}) => api.request('PUT', `/contacts/${id}/`, data)
  api.addContact = (data: {}) => api.request('POST', '/contacts/', data)
  api.deleteContactLocation = (contact_id: number, location_id: number) => api.request('Delete', `/contacts/${contact_id}/delete_location/${location_id}/`)
  api.getContactsImportXeroUrl = () => `${configs.API_SERVER}/xero/contacts/contacts/import/?token=${auth_status.getToken()}`
  api.getContactsExportXeroUrl = () => `${configs.API_SERVER}/xero/contacts/contacts/export/?token=${auth_status.getToken()}`

  // Warehouses
  api.getWarehouses = () => api.request('GET', '/warehouses/')
  api.updateWarehouse = (id: number, data: {}) => api.request('PUT', `/warehouses/${id}/`, data)
  api.addWarehouse = (data: {}) => api.request('POST', '/warehouses/', data)

  // Products
  api.getProducts = () => api.request('GET', '/products/')
  api.updateProduct = (id: number, data: {}) => api.request('PUT', `/products/${id}/`, data)
  api.addProduct = (data: {}) => api.request('POST', '/products/', data)
  api.deactivateProductItem = (product_id: number, item_id: number) => api.request('POST', `/products/${product_id}/deactivate_item/${item_id}/`)
  api.activateProductItem = (product_id: number, item_id: number) => api.request('POST', `/products/${product_id}/activate_item/${item_id}/`)

  // Purchases
  api.getPurchases = () => api.request('GET', `/invoices/?Type=${xero.invoice.purchase_type}`)
  api.getPurchase = (id: number) => api.request('GET', `/invoices/${id}/`)
  api.updatePurchase = (id: number, data: {}) => api.request('PUT', `/invoices/${id}/`, data)
  api.addPurchase = (data: {}) => api.request('POST', '/invoices/', data)
  api.deleteInvoiceLineItem = (invoice_id: number, item_id: number) => api.request('Delete', `/invoices/${invoice_id}/delete_item/${item_id}/`)
  api.getInvoiceExportXeroUrl = (id: number) => `${configs.API_SERVER}/xero/invoices/invoices/export/${id}/?token=${auth_status.getToken()}`

  // Sales
  api.getSaleLastDocId = () => api.request('GET', '/invoices/last_doc_id/')
  api.getSales = () => api.request('GET', `/invoices/?Type=${xero.invoice.sale_type}`)
  api.getSale = (id: number) => api.request('GET', `/invoices/${id}/`)
  api.updateSale = (id: number, data: {}) => api.request('PUT', `/invoices/${id}/`, data)
  api.addSale = (data: {}) => api.request('POST', '/invoices/', data)

  // Accounts
  api.getAccounts = () => api.request('GET', '/accounts/')

  // Tax Rates
  api.getTaxRates = () => api.request('GET', '/tax_rates/')

  return api
}
