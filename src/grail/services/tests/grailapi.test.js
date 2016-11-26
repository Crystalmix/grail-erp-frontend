/* eslint no-underscore-dangle: 0 */

import { assert } from 'chai'
import angular from 'angular'
import 'angular-mocks'

import api from '../grailapi'
// import settings from '../../settings'
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
  let client
  let $httpBackend

  beforeEach(angular.mock.inject(($injector) => {
    $httpBackend = $injector.get('$httpBackend')
    const $http = $injector.get('$http')
    $httpBackend.when('GET', /.*/).respond()
    client = api($http, settings, _auth_status, $state, $exceptionHandler, xero)
  }))

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
    client = null
  })

  // for (const func_name of api_functions) {
  //   it(`API: ${func_name}`, () => {
  //     assert.typeOf(client[func_name], 'function')
  //     assert(client[func_name]())
  //   })
  // }

  it('test request', (done) => {
    const url = '/test'
    const url_expected = '/api/test'
    client.request('get', url)
    .then((resp) => {
      assert.equal(resp.config.method, 'GET')
      assert.equal(resp.config.url, url_expected)
      done()
    })
    $httpBackend.flush()
  })

  it("It's object", () => {
    assert.typeOf(client, 'object')
  })
})
