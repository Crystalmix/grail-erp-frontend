import 'angular-ui-router'
import 'angular-ui-grid'
import 'angular-ui-sortable'
import 'ng-dialog'

import 'angular-ui-grid/ui-grid.css'

import angular from 'angular'

import settings from './settings'
import xero from './constants/xero'
import profile_settings from './services/profile_settings'
import auth_status from './services/auth_status'
import login_require from './services/login_require'
import popup from './services/popup'
import routing from './app.config'
import Login from './controllers/accounts/login'
import Customers from './controllers/contacts/customers/customers'
import api from './services/grailapi'

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

app.controller('Login', Login)
app.controller('Customers', Customers)

export default app
