import login_template from '../templates/accounts/login.tpl.html'
import signup_template from '../templates/accounts/signup.tpl.html'
import reset_template from '../templates/accounts/reset.tpl.html'
import profile_template from '../templates/accounts/profile.tpl.html'
import company_template from '../templates/accounts/company.tpl.html'
import settings_template from '../templates/accounts/settings.tpl.html'

import customers_template from '../templates/customers/list.tpl.html'
import customer_detail_template from '../templates/customers/details.tpl.html'
import suppliers_template from '../templates/suppliers/list.tpl.html'
import supplier_detail_template from '../templates/suppliers/details.tpl.html'

import products_template from '../templates/products/list.tpl.html'
import product_details_template from '../templates/products/details.tpl.html'

import warehouses_template from '../templates/warehouses/list.tpl.html'
import warehouses_details_template from '../templates/warehouses/details.tpl.html'

import sales_template from '../templates/sales/list.tpl.html'


export default function ($stateProvider) {
  $stateProvider
  .state('home', { url: '/' })
  .state('accounts', {
    url: '/login',
    controller: 'Login',
    template: login_template,
    requireLogin: false,
  })
  .state('sign_up', {
    url: '/sign_up',
    controller: 'Signup',
    template: signup_template,
    requireLogin: false,
  })
  .state('reset', {
    url: '/reset',
    controller: 'Reset',
    template: reset_template,
    requireLogin: false,
  })
  .state('profile', {
    url: '/profile',
    controller: 'UserProfile',
    template: profile_template,
    requireLogin: true,
  })
  .state('company', {
    url: '/company',
    controller: 'CompanyInformation',
    template: company_template,
    requireLogin: true,
  })
  .state('settings', {
    url: '/settings',
    controller: 'Settings',
    template: settings_template,
    requireLogin: true,
  })

  // Customers
  .state('customers', {
    url: '/customers',
    controller: 'Customers',
    template: customers_template,
    requireLogin: true,
  })
  .state('customer_add', {
    url: '/customers/add',
    controller: 'CustomerAdd',
    template: customer_detail_template,
    requireLogin: true,
  })
  .state('customer_edit', {
    url: '/customers/:id',
    controller: 'CustomerEdit',
    template: customer_detail_template,
    requireLogin: true,
  })

  // Suppliers
  .state('suppliers', {
    url: '/suppliers',
    controller: 'Suppliers',
    template: suppliers_template,
    requireLogin: true,
  })
  .state('supplier_add', {
    url: '/suppliers/add',
    controller: 'SupplierDetails',
    template: supplier_detail_template,
    requireLogin: true,
  })
  .state('supplier_edit', {
    url: '/suppliers/:id',
    controller: 'SupplierDetails',
    template: supplier_detail_template,
    requireLogin: true,
  })

  // Warehouses
  .state('warehouses', {
    url: '/warehouses',
    controller: 'Warehouses',
    template: warehouses_template,
    requireLogin: true,
  })
  .state('warehouse_add', {
    url: '/warehouses/add',
    controller: 'WarehouseDetails',
    template: warehouses_details_template,
    requireLogin: true,
  })
  .state('warehouse_edit', {
    url: '/warehouses/:id',
    controller: 'WarehouseDetails',
    template: warehouses_details_template,
    requireLogin: true,
  })

  // Products
  .state('products', {
    url: '/products',
    controller: 'Products',
    template: products_template,
    requireLogin: true,
  })
  .state('product_add', {
    url: '/products/add',
    controller: 'ProductAdd',
    template: product_details_template,
    requireLogin: true,
  })
  .state('product_edit', {
    url: '/products/:id',
    controller: 'ProductEdit',
    template: product_details_template,
    requireLogin: true,
  })

  // Purchases
  .state('purchases', {
    url: '/purchases',
    controller: 'Purchases',
    templateUrl: 'templates/purchases/list.html',
    requireLogin: true,
  })
  .state('purchase_add', {
    url: '/purchases/add',
    controller: 'PurchaseDetails',
    templateUrl: 'templates/purchases/details.html',
    requireLogin: true,
  })
  .state('purchase_edit', {
    url: '/purchases/:id',
    controller: 'PurchaseDetails',
    templateUrl: 'templates/purchases/details.html',
    requireLogin: true,
  })

  // Sales
  .state('sales', {
    url: '/sales',
    controller: 'Sales',
    template: sales_template,
    requireLogin: true,
  })
  .state('sale_add', {
    url: '/sales/add',
    controller: 'SaleDetails',
    templateUrl: 'templates/sales/details.html',
    requireLogin: true,
  })
  .state('sale_edit', {
    url: '/sales/:id',
    controller: 'SaleDetails',
    templateUrl: 'templates/sales/details.html',
    requireLogin: true,
  })
}
