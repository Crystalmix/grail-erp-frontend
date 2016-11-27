import angular from 'angular'
import $ from 'jquery'

const app = angular.module('ngjsgrid', [])

app.factory('jsGrid', $window => $window.jsGrid)

app.directive('ngJsgrid', ($timeout, $compile, jsGrid) => ({
  restrict: 'A',
  replace: false,
  transclude: false,
  scope: {
    config: '=ngJsgrid',
  },
  link(scope, $element) {
    let linking = true

    const ops = $.extend(scope.config, {
      renderTemplate(source, context, args) {
        const template = jsGrid.Grid.prototype.renderTemplate.apply(this, arguments)
        if (typeof template !== 'string') {
          return template
        }
        const templateScope = scope.$parent.$new()
        angular.extend(templateScope, args)
        return $compile(`<div>${template}</div>`)(templateScope).contents()
      },
    })

    $element.jsGrid(ops)

    $.each(scope.config, key => scope.$watch(`config.${key}`, value => $element.jsGrid(scope.config, key, value)))

    $timeout(() => { linking = false })
  },
}))
