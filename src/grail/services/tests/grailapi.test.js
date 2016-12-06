/* @flow weak */
/* eslint no-underscore-dangle: 0 */
/* global describe, it, afterEach, beforeEach */

import { assert } from 'chai'
import angular from 'angular'
import 'angular-mocks'

import api from '../grailapi'
import auth_status from '../auth_status'
import xero from '../../constants/xero'


const injector = angular.injector(['ng'])
// const $http = injector.get('$http')
const $exceptionHandler = injector.get('$exceptionHandler')
const $rootScope = injector.get('$rootScope')
const $state = {}
const _auth_status = auth_status($rootScope)

const settings = {
  API_SERVER: '',
  API_URL: '',
}


const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'

const data = { some: 'data' }

type TestMethodOptions = {
  method: string,
  args: any[],
  url: string,
  data?: any,
  http_method?: 'GET' | 'POST' | 'PUT' | 'DELETE',

}

const client_tests: TestMethodOptions[] = [
  { method: 'request', args: [GET, '/test'], url: '/api/test' },
  { method: 'auth_request', args: [GET, '/test'], url: '/rest-auth/test' },

  { method: 'registration', args: [data], url: '/rest-auth/registration/', http_method: POST },
  { method: 'login', args: [data], url: '/rest-auth/login/', http_method: POST },
  { method: 'logout', args: [data], url: '/rest-auth/logout/' },
  { method: 'reset', args: [data], url: '/rest-auth/password/reset/', http_method: POST },

  { method: 'user_profile_request', args: [GET, '/test'], url: '/rest-auth/test' },
  { method: 'getProfile', args: [], url: '/rest-auth/user/', http_method: GET },
  { method: 'updateProfile', args: [data], url: '/rest-auth/user/', http_method: PUT },

  { method: 'getOrganizartions', args: [], url: '/api/organizations/' },
  { method: 'updateOrganization', args: [1, data], url: '/api/organizations/1/', http_method: PUT },

  { method: 'getContacts', args: [], url: '/api/contacts/' },
  { method: 'getCustomers', args: [], url: '/api/contacts/?IsCustomer=True' },
  { method: 'getSuppliers', args: [], url: '/api/contacts/?IsSupplier=True' },
  { method: 'updateContact', args: [1, data], url: '/api/contacts/1/', http_method: PUT },
  { method: 'addContact', args: [data], url: '/api/contacts/', http_method: POST },
  { method: 'deleteContactLocation', args: [1, 2], url: '/api/contacts/1/delete_location/2/', http_method: DELETE },

  { method: 'getWarehouses', args: [], url: '/api/warehouses/' },
  { method: 'updateWarehouse', args: [1, data], url: '/api/warehouses/1/', http_method: PUT },
  { method: 'addWarehouse', args: [data], url: '/api/warehouses/', http_method: POST },

  { method: 'getProducts', args: [], url: '/api/products/' },
  { method: 'updateProduct', args: [1, data], url: '/api/products/1/', http_method: PUT },
  { method: 'addProduct', args: [data], url: '/api/products/', http_method: POST },
  { method: 'deactivateProductItem', args: [1, 2], url: '/api/products/1/deactivate_item/2/', http_method: POST, data: undefined },
  { method: 'activateProductItem', args: [1, 2], url: '/api/products/1/activate_item/2/', http_method: POST, data: undefined },

  { method: 'getPurchases', args: [], url: '/api/invoices/?Type=ACCPAY' },
  { method: 'getSales', args: [], url: '/api/invoices/?Type=ACCREC' },
  { method: 'getPurchase', args: [1], url: '/api/invoices/1/' },
  { method: 'getSale', args: [1], url: '/api/invoices/1/' },
  { method: 'updatePurchase', args: [1, data], url: '/api/invoices/1/', http_method: PUT },
  { method: 'updateSale', args: [1, data], url: '/api/invoices/1/', http_method: PUT },
  { method: 'addPurchase', args: [data], url: '/api/invoices/', http_method: POST },
  { method: 'addSale', args: [data], url: '/api/invoices/', http_method: POST },
  { method: 'deleteInvoiceLineItem', args: [1, 2], url: '/api/invoices/1/delete_item/2/', http_method: DELETE },

  { method: 'getSaleLastDocId', args: [], url: '/api/invoices/last_doc_id/' },

  { method: 'getTaxRates', args: [], url: '/api/tax_rates/' },
  { method: 'getAccounts', args: [], url: '/api/accounts/' },

  { method: 'addTransaction', args: [data], url: '/api/transactions/', http_method: POST },
]

describe('Grail ERP API Client', () => {
  let client
  let $httpBackend

  beforeEach(angular.mock.inject(($injector) => {
    $httpBackend = $injector.get('$httpBackend')
    const $http = $injector.get('$http')
    $httpBackend.when(GET, /.*/).respond()
    $httpBackend.when(POST, /.*/).respond()
    $httpBackend.when(PUT, /.*/).respond()
    $httpBackend.when(DELETE, /.*/).respond()
    client = api($http, settings, _auth_status, $state, $exceptionHandler, xero)
  }))

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
    client = null
  })

  it("It's object", () => {
    assert.typeOf(client, 'object')
  })

  /* eslint no-loop-func: 0 */
  for (const test of client_tests) {
    it(`Auto-test: client.${test.method}`, (done) => {
      client[test.method](...test.args).then(resp => {
        if (test.http_method === POST) {
          const expected_data = test.hasOwnProperty('data') ? test.data : data
          assert.equal(resp.config.data, expected_data)
        }
        assert.equal(resp.config.url, test.url)
        assert.equal(resp.config.method, test.http_method || GET)
        done()
      })
      $httpBackend.flush()
    })
  }
})

describe('Test: Xero Import Url', () => {
  const fake_auth_status = {
    getToken: () => ('fake_token'),
  }
  const $http = null
  const client = api($http, settings, fake_auth_status, $state, $exceptionHandler, xero)

  it('getOrganizartionImportXeroUrl', () => {
    assert.equal(client.getOrganizartionImportXeroUrl(), '/xero/organizations/organization/import/?token=fake_token')
  })
  it('getTaxRatesAndAccountsImportXeroUrl', () => {
    assert.equal(client.getTaxRatesAndAccountsImportXeroUrl(), '/xero/others/tax_rates_accounts/import/?token=fake_token')
  })
  it('getCustomerExportXeroUrl', () => {
    assert.equal(client.getCustomerExportXeroUrl(1), '/xero/contacts/contacts/export/1/?token=fake_token')
  })
  it('getContactsImportXeroUrl', () => {
    assert.equal(client.getContactsImportXeroUrl(), '/xero/contacts/contacts/import/?token=fake_token')
  })
  it('getContactsExportXeroUrl', () => {
    assert.equal(client.getContactsExportXeroUrl(), '/xero/contacts/contacts/export/?token=fake_token')
  })
  it('getInvoiceExportXeroUrl', () => {
    assert.equal(client.getInvoiceExportXeroUrl(1), '/xero/invoices/invoices/export/1/?token=fake_token')
  })
})
