/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

import identical_options_template from '../../../templates/products/identical_options.tpl.html'

export default ($scope, $controller, product_generator, ngDialog, api) => {
  $controller('ProductDetailsBase', { $scope })

  $scope.is_new = true
  // Example for variants, options
  // $scope.variants = ["Colour", "Size"]
  // $scope.options =
  //   Colour: ["Black", "Green"]
  //   Size: ["S", "XS"]
  $scope.variants = []
  $scope.options = {}
  $scope.product.Account = $scope.default_sales_account
  $scope.product.TaxRate = $scope.default_tax_rule
  $scope.product.tax_rate_purchases = $scope.default_tax_rule_purchases

  const renderGrid = () => {
    const prepareItems = () => {
      const result = []
      _.each($scope.productItems, (val, key) => { result[key] = _.extend({}, val, val.data) })
      return result
    }
    const productFields = ['Code'].concat($scope.variants)
    $scope.gridConfig = {
      width: '100%',
      filtering: false,
      editing: true,
      sorting: true,
      paging: true,
      pageSize: 100,
      data: prepareItems(),
      fields: [],
    }

    for (const field of productFields) {
      $scope.gridConfig.fields.push({ name: field, type: 'text', width: 150 })
    }
    $scope.gridConfig.fields.push({ type: 'control' })
  }

  const compactOptions = () => {
      // Remove options with empty value
    const options = []
    for (const key of Object.keys($scope.options)) {
      let val = $scope.options[key]
      val = _.compact(val)
      if (val.length) { options[key] = val }
    }
    return options
  }

  const compactVariants = options => _.keys(options)

  const areIdenticalOptions = () =>
      _.find($scope.options, option => _.unique(option).length !== option.length)


  api.getAccounts().then(response => { $scope.accounts = response.data })

  api.getTaxRates().then(response => { $scope.taxRates = response.data })

  $scope.generate = () => {
    if (areIdenticalOptions()) {
      ngDialog.open({ template: identical_options_template, plain: true })
      return
    }
    if (!$scope.product || !$scope.product.Code) {
      return
    }
    const options = compactOptions()
    const variants = compactVariants(options)
    $scope.productItems = product_generator(variants, options, $scope.product.Code)
    renderGrid()
  }

  $scope.removeVariant = (value) => {
    delete $scope.options[value]
    $scope.variants = _.without($scope.variants, value)
  }

  $scope.addVariant = () => {
    const is_variant_exist = _.indexOf($scope.variants, $scope.newVariant) !== -1
    if (!$scope.newVariant || is_variant_exist) {
      return
    }
    $scope.variants.push($scope.newVariant)
    $scope.options[`${$scope.newVariant}`] = []
    $scope.newVariant = null
  }

  $scope.removeOptions = (variant, index) => $scope.options[`${variant}`].splice(index, 1)

  $scope.addOption = (variant) => {
    const empty_option = ''
    if ($scope.options[`${variant}`]) {
      $scope.options[`${variant}`].push(empty_option)
    } else {
      $scope.options[`${variant}`] = [empty_option]
    }
  }
}
