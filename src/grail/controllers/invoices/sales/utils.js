/* eslint no-param-reassign: 0 */
/* eslint no-underscore-dangle: 0 */

import _ from 'underscore'
import $ from 'jquery'
import { __guard__ } from '../utils'

export const productFilter = () =>
  (item, collDef) => {
    const array = __guard__(collDef, x => x.editDropdownOptionsArray)
    item = _.findWhere(array || [], { id: item })
    if (!item) {
      return ''
    }
    return item[collDef.editDropdownValueLabel]
  }

export const taxRateFilter = (settings_constants, profile_settings) =>
  (item, tax_rates) => {
    const defaultTaxRate = _.findWhere(tax_rates, {
      id: profile_settings.getXeroSettings(settings_constants.default.tax_rule),
    })
    const tax_rate = _.findWhere(tax_rates, { tax_type: item })
    if (!tax_rate) {
      const value = defaultTaxRate ? `${__guard__(defaultTaxRate, x => x.name)} (${__guard__(defaultTaxRate, x1 => x1.rate)}%)` : '0%'
      return value
    }
    return `${__guard__(tax_rate, x2 => x2.name)} (${__guard__(tax_rate, x3 => x3.rate)}%)`
  }


export const uiSelectWrap = ($document, uiGridEditConstants) =>
  ($scope, $elm) => {
    const docClick = (evt) => {
      if ($(evt.target).closest('.ui-select-container').size() === 0) {
        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT)
        return $document.off('click', docClick)
      }
    }
    $document.on('click', docClick)
  }
