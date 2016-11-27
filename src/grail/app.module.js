import 'angular-ui-router'
import 'angular-ui-grid'
import 'angular-ui-sortable'
import 'ng-dialog'

import 'angular-ui-grid/ui-grid.css'

import angular from 'angular'

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


const app = angular.module('grail', [
  'ui.router',
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.grid.cellNav',
  'ui.grid.validate',
  'ui.grid.autoResize',
  'ui.sortable',
  'ngDialog',
])

app.run(login_require)
app.config(routing)

app.constant('configs', settings)
app.constant('xero', xero)
app.constant('settings_constants', settings_constants)

app.factory('api', api)
app.factory('auth_status', auth_status)
app.factory('profile_settings', profile_settings)
app.factory('popup', popup)
app.factory('uuidFactory', uuidFactory)

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

export default app
