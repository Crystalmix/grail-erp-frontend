/* @flow weak */

import 'jquery'
import 'jquery-ui'

import 'angular-ui-router'
import 'angular-ui-grid'
import 'angular-ui-sortable'
import 'angular-ui-bootstrap'
import 'angular-strap/dist/angular-strap'
import 'angular-strap/dist/angular-strap.tpl'

// angular-ladda
import 'angular-ladda'
import 'ladda/dist/ladda-themeless.min.css'

// angular-ui-select
import 'ui-select'
import 'ui-select/dist/select.css'

// angular-loading-bar
import 'angular-loading-bar'
import 'angular-loading-bar/build/loading-bar.min.css'

// magic-check
import 'magic-check/css/magic-check.css'


import 'selectize'
import 'selectize/dist/css/selectize.default.css'
import 'angular-selectize'

import 'ng-dialog'
import 'ng-dialog/css/ngDialog.min.css'
import 'ng-dialog/css/ngDialog-theme-default.min.css'

import 'angular-ui-grid/ui-grid.css'

import angular from 'angular'

import 'angular-animate'

import 'jsgrid/dist/jsgrid'
import 'jsgrid/dist/jsgrid.css'
import 'jsgrid/dist/jsgrid-theme.css'
import './jsGrid'

import routing from './app.config'
import settings from './settings'

import xero from './constants/xero'
import settings_constants from './constants/settings_constants'
import api from './services/grailapi'
import profile_settings from './services/profile_settings'
import auth_status from './services/auth_status'
import login_require from './services/login_require'
import popup from './services/popup'
import uuidFactory from './services/uuid'
import product_generator from './services/product_generator'
import array_combinations from './services/array_combinations'
import naturalService from './services/naturalOrder'
import pdfmake from './services/pdfmaker'

import Init from './controllers/init_controller'
import BaseDetails from './controllers/core/base_details'
import Login from './controllers/accounts/login'
import Signup from './controllers/accounts/signup'
import Reset from './controllers/accounts/reset'
import UserProfile from './controllers/accounts/user_profile'
import CompanyInformation from './controllers/accounts/company_information'
import Settings from './controllers/accounts/settings'

import Customers from './controllers/contacts/customers/customers'
import CustomerDetailsBase from './controllers/contacts/customers/customer_details_base'
import CustomerAdd from './controllers/contacts/customers/customer_add'
import CustomerEdit from './controllers/contacts/customers/customer_edit'
import Suppliers from './controllers/contacts/suppliers/list'
import SupplierDetails from './controllers/contacts/suppliers/details'

import ProductDetailsBase from './controllers/products/details_base'
import Products from './controllers/products/list'
import ProductAdd from './controllers/products/add'
import EditQuantity from './controllers/products/edit_quantity'
import ProductEdit from './controllers/products/edit'

import Warehouses from './controllers/warehouses/list'
import WarehouseDetails from './controllers/warehouses/details'

import InvoiceDetails from './controllers/invoices/details'

import Sales from './controllers/invoices/sales/sales'
import SaleDetails from './controllers/invoices/sales/sale_detail'
import ErrorQuantity from './controllers/invoices/sales/error_quantity'
import createPDF from './controllers/invoices/sales/create_pdf'

import { productFilter, taxRateFilter, uiSelectWrap } from './controllers/invoices/sales/utils'

import Purchases from './controllers/invoices/purchases/list'
import PurchaseDetails from './controllers/invoices/purchases/details'

const app_requirements = [
  'angular-ladda',
  'ngjsgrid',
  'ui.router',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.grid.cellNav',
  'ui.grid.validate',
  'ui.grid.autoResize',
  'ui.sortable',
  'ui.select',
  'ui.bootstrap',
  'ngDialog',
  'selectize',
  'mgcrea.ngStrap',
  'angular-loading-bar',
  'ngAnimate',
]

if (process.env.NODE_ENV === 'production') {
  app_requirements.push('ngRaven')
}

const app = angular.module('grail', app_requirements)

app.run(login_require)
app.config(routing)

app.constant('configs', settings)
app.constant('xero', xero)
app.constant('settings_constants', settings_constants)

app.filter('productFilter', productFilter)
app.filter('taxRateFilter', taxRateFilter)

app.directive('uiSelectWrap', uiSelectWrap)

app.factory('api', api)
app.factory('auth_status', auth_status)
app.factory('profile_settings', profile_settings)
app.factory('popup', popup)
app.factory('uuidFactory', uuidFactory)
app.factory('product_generator', product_generator)
app.factory('combine', array_combinations)
app.factory('naturalService', naturalService)
app.factory('pdfmake', pdfmake)

app.controller('Init', Init)
app.controller('BaseDetails', BaseDetails)
app.controller('Login', Login)
app.controller('Signup', Signup)
app.controller('Reset', Reset)
app.controller('UserProfile', UserProfile)
app.controller('CompanyInformation', CompanyInformation)
app.controller('Settings', Settings)

app.controller('CustomerDetailsBase', CustomerDetailsBase)
app.controller('Customers', Customers)
app.controller('CustomerAdd', CustomerAdd)
app.controller('CustomerEdit', CustomerEdit)
app.controller('Suppliers', Suppliers)
app.controller('SupplierDetails', SupplierDetails)

app.controller('ProductDetailsBase', ProductDetailsBase)
app.controller('EditQuantity', EditQuantity)
app.controller('Products', Products)
app.controller('ProductAdd', ProductAdd)
app.controller('ProductEdit', ProductEdit)

app.controller('Warehouses', Warehouses)
app.controller('WarehouseDetails', WarehouseDetails)

app.controller('InvoiceDetails', InvoiceDetails)

app.controller('Sales', Sales)
app.controller('SaleDetails', SaleDetails)
app.controller('ErrorQuantity', ErrorQuantity)
app.controller('createPDF', createPDF)

app.controller('Purchases', Purchases)
app.controller('PurchaseDetails', PurchaseDetails)

export default app
