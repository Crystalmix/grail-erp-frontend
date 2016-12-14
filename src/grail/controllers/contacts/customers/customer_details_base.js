/* @flow weak */
/* eslint no-param-reassign: 0 */
/* eslint no-unneeded-ternary: 0 */

import _ from 'underscore'
import angular from 'angular'

export default ($scope, api, $state, ngDialog, $controller, popup, xero, $q, uuidFactory, xeroStatus) => {
  const removed_locations_ids = []

  xeroStatus.checkXeroStatus(xeroStatus.isXeroExpired)

  const prepareLocationsToSave = () => {
    $scope.customer.Locations = _.reject($scope.customer.Locations, i => !i.Name)
    _.each($scope.customer.Locations, (location) => {
      if (location.Warehouse) { location.Warehouse = location.Warehouse.id }
    })
  }

  const prepareAddresses = () => {
    const address = _.clone($scope.customer.Addresses)
    $scope.customer.Addresses = []
    $scope.customer.Addresses.push(address)
  }

  const areEmptyWarehouses = () => _.find($scope.customer.Locations, i => !i.Warehouse)

  const areDuplicateLocations = () => {
    const uniq = _.uniq($scope.customer.Locations, item => item.Name)
    let duplicates = []

    $scope.customer.Locations.filter((item) => {
      const isDupValue = uniq.indexOf(item) === -1

      if (isDupValue) {
        duplicates = (_.where($scope.customer.Locations, { Name: item.Name }))
        return duplicates
      }
      return false
    })
    return duplicates.length
  }


  const callbackRemoveLocations = (item) => {
    const customer_id = $scope.customer.id
    return api.deleteContactLocation(customer_id, item.id)
  }

  const inactivateLocations = () => _.map($scope.customer.Locations, val => {
    val.active = false
    return val
  })


  $controller('BaseDetails', { $scope })

  $scope.export = () => popup(api.getCustomerExportXeroUrl($state.params.id))

  $scope.isNew = $state.params.hasOwnProperty('id')
  $scope.customer = { Locations: [] }
  $scope.cloneCopyInvoiceAddress = {}

  $scope.$watch('customer.Locations.length', (new_length) => {
    if (new_length === 1) {
      const val = $scope.cloneCopyInvoiceAddress[`${$scope.selectLocation.uid}`]
      $scope.isCopyInvoiceAddress = val ? true : false
    }
  })

  $scope.updateCopyInvoiceAddress = (isCopyInvoiceAddress) => {
    if (isCopyInvoiceAddress) {
      $scope.cloneCopyInvoiceAddress[`${$scope.selectLocation.uid}`] = angular.copy($scope.selectLocation)
      _.extend($scope.selectLocation, {
        AddressLine1: $scope.customer.Addresses.AddressLine1,
        AddressLine2: $scope.customer.Addresses.AddressLine2,
        AddressLine3: $scope.customer.Addresses.AddressLine3,
        Country: $scope.customer.Addresses.Country,
        PostCode: $scope.customer.Addresses.PostalCode,
      }
          )
    } else if ($scope.cloneCopyInvoiceAddress[`${$scope.selectLocation.uid}`]) {
      const copySelectLocation = $scope.cloneCopyInvoiceAddress[`${$scope.selectLocation.uid}`]
      _.extend($scope.selectLocation, {
        AddressLine1: copySelectLocation.AddressLine1,
        AddressLine2: copySelectLocation.AddressLine2,
        AddressLine3: copySelectLocation.AddressLine3,
        Country: copySelectLocation.Country,
        PostCode: copySelectLocation.PostCode,
      }
          )
      $scope.cloneCopyInvoiceAddress[`${$scope.selectLocation.uid}`] = null
    }
  }

  $scope.setDefaultAddresses = () =>
    _.extend($scope.customer, {
      Addresses: {
        AddressType: xero.customer.address_type,
        AddressLine1: '',
        AddressLine2: '',
        AddressLine3: '',
        Country: '',
        PostalCode: '',
      },
    })


  $scope.setDefaultLocation = () => {
    _.extend($scope.customer, {
      Locations: [{
        Name: 'Default',
        Warehouse: _.first($scope.warehouses),
        uid: uuidFactory(),
      }],
    })
    $scope.activateLocation(_.first($scope.customer.Locations))
    $scope.selectLocation = _.first($scope.customer.Locations)
  }

  $scope.activateLocation = (location) => {
    inactivateLocations()
    location.active = true
  }

  $scope.updateSelectedLocation = (location) => {
    $scope.activateLocation(location)
    $scope.selectLocation = location
  }

  $scope.addLocation = () => {
    const default_location = {
      Name: 'Default',
      Warehouse: _.first($scope.warehouses),
      uid: uuidFactory(),
    }
    $scope.activateLocation(default_location)
    $scope.customer.Locations.push(default_location)
    $scope.selectLocation = _.last($scope.customer.Locations)
  }

  $scope.removeSelectedLocation = () => {
    if ($scope.customer.Locations.length > 1) {
      $scope.customer.Locations = _.reject($scope.customer.Locations, (val) => {
        if (val.active === true) {
          if (val.id) { removed_locations_ids.push({ id: val.id }) }
          return true
        }
        return false
      })
      const location = _.last($scope.customer.Locations)
      $scope.activateLocation(location)
      $scope.selectLocation = location
    }
  }

  $scope.setWarehouseToLocation = warehouse => { $scope.selectLocation.Warehouse = warehouse }

  $scope.save = () => {
    if (areEmptyWarehouses() || areDuplicateLocations()) {
      ngDialog.open({ template: 'templates/customers/error_save.html' })
      return
    }

    prepareLocationsToSave()
    prepareAddresses()

    if ($scope.customer.id) {
      const json = angular.toJson($scope.customer)
      $q.all(_.map(removed_locations_ids, callbackRemoveLocations))
      .then(() => {
        api.updateContact($scope.customer.id, json)
        .then(() => $state.go('customers'))
      })
    } else {
      const customer = { IsSupplier: false, IsCustomer: true }
      _.extend(customer, $scope.customer)
      api.addContact(angular.toJson(customer)).then(() => $state.go('customers'))
    }
  }
}
