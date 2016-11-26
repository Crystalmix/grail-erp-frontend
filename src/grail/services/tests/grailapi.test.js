/* eslint no-underscore-dangle: 0 */

import { assert } from 'chai'
import angular from 'angular'

import api from '../grailapi'
import settings from '../../settings'
import auth_status from '../auth_status'
import xero from '../../constants/xero'

const injector = angular.injector(['ng'])
const $http = injector.get('$http')
const $exceptionHandler = injector.get('$exceptionHandler')
const $state = {}
const $rootScope = injector.get('$rootScope')
const _auth_status = auth_status($rootScope)

const api_functions = [
  'request',
  'auth_request',
  'user_profile_request',
  'login',
  'logout',
  'reset',
  'registration',
  'getProfile',
  'updateProfile',

  'getOrganizartions',
  'updateOrganization',
  'getOrganizartionImportXeroUrl',
  'getTaxRatesAndAccountsImportXeroUrl',
  'getCustomerExportXeroUrl',
  'getCustomerExportXeroUrl',
  'getContacts',
  'getCustomers',
  'getSuppliers',
  'updateContact',
  'addContact',
  'deleteContactLocation',
  'getContactsImportXeroUrl',
  'getContactsExportXeroUrl',
  'getWarehouses',
  'updateWarehouse',
  'addWarehouse',
  'getProducts',
  'updateProduct',
  'addProduct',
  'deactivateProductItem',
  'activateProductItem',
  'getPurchases',
  'getPurchase',
  'updatePurchase',
  'addPurchase',
  'deleteInvoiceLineItem',
  'getInvoiceExportXeroUrl',
  'getInvoiceExportXeroUrl',
  'getSaleLastDocId',
  'getSales',
  'getSale',
  'updateSale',
  'addSale',
  'getTaxRates',
  'getAccounts',
  'getTaxRates',
]

describe('Grail ERP API Client', () => {
  const client = api($http, settings, _auth_status, $state, $exceptionHandler, xero)

  for (const func_name of api_functions) {
    it(`API: ${func_name}`, () => {
      assert.typeOf(client[func_name], 'function')
      assert(client[func_name]())
    })
  }

  it("It's object", () => {
    assert.typeOf(client, 'object')
  })
})
