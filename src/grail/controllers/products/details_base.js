/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'
import angular from 'angular'

export default ($scope, api, $state, $controller, profile_settings, settings_constants) => {
  $scope.cancel = () => { $state.reload() }
  const prepareJson = () => {
    const json = _.clone($scope.product)
    json.items = $scope.productItems
    return angular.toJson(json)
  }

  const cleanProductItems = () => {
    $scope.productItems = _.filter($scope.productItems, item => item.Code)
  }


  const addWeightToProductItems = () => {
    _.each($scope.productItems, (val, key) => { val.weight = key + 1 })
  }


  $controller('BaseDetails', { $scope })

  $scope.product = {}

  $scope.default_sales_account = profile_settings.getXeroSettings(settings_constants.default.sales_account)
  $scope.default_tax_rule = profile_settings.getXeroSettings(settings_constants.default.tax_rule)
  $scope.default_tax_rule_purchases = profile_settings.getXeroSettings(settings_constants.default.tax_rule_purchases)

  $scope.accountConfig = {
    create: false,
    labelField: 'Name',
    maxItems: 1,
    persist: false,
    valueField: 'id',
    searchField: ['Name'],
    onChange(val) { $scope.product.Account = parseInt(val, 10) },
  }

  $scope.taxConfig = {
    create: false,
    labelField: 'name',
    maxItems: 1,
    persist: false,
    valueField: 'id',
    searchField: ['name'],
    onChange(val) { $scope.product.TaxRate = parseInt(val, 10) },
  }

  $scope.taxPurchaseConfig = {
    create: false,
    labelField: 'name',
    maxItems: 1,
    persist: false,
    valueField: 'id',
    searchField: ['name'],
    onChange(val) { $scope.product.tax_rate_purchases = parseInt(val, 10) },
  }

  $scope.save = (goTo = 'products') => {
    if ($scope.productItems) { cleanProductItems() }
    $scope.product.Name = $scope.product.Code
    if ($scope.product.id) {
      api.updateProduct($scope.product.id, prepareJson()).then(() => $state.go(goTo))
    } else {
      if ($scope.productItems) { addWeightToProductItems() }
      api.addProduct(prepareJson()).then(() => $state.go(goTo))
    }
  }
}
