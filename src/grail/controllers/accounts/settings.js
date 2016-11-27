/* @flow */
/* eslint no-param-reassign: 0 */

export default ($scope, popup, api, profile_settings, settings_constants) => {
  $scope.accountConfig = {
    create: false,
    labelField: 'Name',
    maxItems: 1,
    persist: false,
    valueField: 'id',
    searchField: ['Name'],
    onChange(val) {
      $scope.default_sales_account = parseInt(val, 10)
    },
  }

  $scope.taxConfig = {
    create: false,
    labelField: 'name',
    maxItems: 1,
    persist: false,
    valueField: 'id',
    searchField: ['name'],
    onChange(val) {
      $scope.default_tax_rule = parseInt(val, 10)
    },
  }

  $scope.default_sales_account = profile_settings.getXeroSettings(settings_constants.default.sales_account)
  $scope.default_tax_rule = profile_settings.getXeroSettings(settings_constants.default.tax_rule)

  api.getAccounts().then(response => { $scope.accounts = response.data })

  api.getTaxRates().then(response => { $scope.tax_rates = response.data })

  $scope.save = () => {
    profile_settings.setXeroSettings(settings_constants.default.sales_account, $scope.default_sales_account)
    profile_settings.setXeroSettings(settings_constants.default.tax_rule, $scope.default_tax_rule)
    profile_settings.saveProfile()
  }

  $scope.downloadAccounts = () => popup(api.getTaxRatesAndAccountsImportXeroUrl())

  $scope.import = () => popup(api.getOrganizartionImportXeroUrl())
}
