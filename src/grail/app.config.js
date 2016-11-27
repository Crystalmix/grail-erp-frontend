import './controllers/accounts/login'
import login_template from '../templates/accounts/login.tpl.html'
import customers_template from '../templates/customers/list.tpl.html'
import customer_detail_template from '../templates/customers/details.tpl.html'
import suppliers_template from '../templates/suppliers/list.tpl.html'
import supplier_detail_template from '../templates/suppliers/details.tpl.html'

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
    templateUrl: 'templates/accounts/signup.html',
    requireLogin: false,
  })
  .state('reset', {
    url: '/reset',
    controller: 'Reset',
    templateUrl: 'templates/accounts/reset.html',
    requireLogin: false,
  })
  .state('profile', {
    url: '/profile',
    controller: 'UserProfile',
    templateUrl: 'templates/accounts/profile.html',
    requireLogin: true,
  })
  .state('company', {
    url: '/company',
    controller: 'CompanyInformation',
    templateUrl: 'templates/accounts/company.html',
    requireLogin: true,
  })
  .state('settings', {
    url: '/settings',
    controller: 'Settings',
    templateUrl: 'templates/accounts/settings.html',
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
    templateUrl: 'templates/warehouses/list.html',
    requireLogin: true,
  })
  .state('warehouse_add', {
    url: '/warehouses/add',
    controller: 'WarehouseDetails',
    templateUrl: 'templates/warehouses/details.html',
    requireLogin: true,
  })
  .state('warehouse_edit', {
    url: '/warehouses/:id',
    controller: 'WarehouseDetails',
    templateUrl: 'templates/warehouses/details.html',
    requireLogin: true,
  })

  // Products
  .state('products', {
    url: '/products',
    controller: 'Products',
    templateUrl: 'templates/products/list.html',
    requireLogin: true,
  })
  .state('product_add', {
    url: '/products/add',
    controller: 'ProductAdd',
    templateUrl: 'templates/products/details.html',
    requireLogin: true,
  })
  .state('product_edit', {
    url: '/products/:id',
    controller: 'ProductEdit',
    templateUrl: 'templates/products/details.html',
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
    templateUrl: 'templates/sales/list.html',
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
