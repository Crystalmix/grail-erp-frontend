import 'angular-ui-router'
import 'angular-ui-grid'
import 'angular-ui-sortable'
import 'ng-dialog'

import 'angular-ui-grid/ui-grid.css'

import angular from 'angular'

import routing from './app.config'
import settings from './settings'

import xero from './constants/xero'
import api from './services/grailapi'
import profile_settings from './services/profile_settings'
import auth_status from './services/auth_status'
import login_require from './services/login_require'
import popup from './services/popup'
import uuidFactory from './services/uuid'

import BaseDetails from './controllers/core/base_details'
import Login from './controllers/accounts/login'

import Customers from './controllers/contacts/customers/customers'
import CustomerDetailsBase from './controllers/contacts/customers/customer_details_base'
import CustomerAdd from './controllers/contacts/customers/customer_add'
import CustomerEdit from './controllers/contacts/customers/customer_edit'


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

app.factory('api', api)
app.factory('auth_status', auth_status)
app.factory('profile_settings', profile_settings)
app.factory('popup', popup)
app.factory('uuidFactory', uuidFactory)

app.controller('BaseDetails', BaseDetails)
app.controller('Login', Login)

app.controller('CustomerDetailsBase', CustomerDetailsBase)
app.controller('Customers', Customers)
app.controller('CustomerAdd', CustomerAdd)
app.controller('CustomerEdit', CustomerEdit)

export default app
