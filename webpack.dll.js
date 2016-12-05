const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    vendor: [
      'raven-js',
      'raven-js/plugins/angular',
      'jquery',
      'jquery-ui',
      'bootstrap/dist/js/bootstrap',
      'underscore',
      'angular',
      'angular-ui-router',
      'angular-ui-grid',
      'angular-ui-sortable',
      'angular-strap/dist/angular-strap',
      'angular-strap/dist/angular-strap.tpl',
      'ui-select',
      'pdfmake/build/pdfmake',
      'pdfmake/build/vfs_fonts',
      'selectize',
      'angular-selectize',
      'ng-dialog',
      'jsgrid/dist/jsgrid',
      'angular-ui-bootstrap',
      path.join(__dirname, 'src', 'nifty_template', 'nifty'),
    ],
  },
  output: {
    path: path.join(__dirname, 'dist', 'dll'),
    filename: 'dll.[name].js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist', 'dll', '[name]-manifest.json'),
      name: '[name]',
      context: path.resolve(__dirname, 'src'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      'window.$': 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.ProvidePlugin({
      Selectize: 'selectize',
      'window.Selectize': 'selectize',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  resolve: {
    alias: {
      'angular-ui-grid$': 'angular-ui-grid/ui-grid.min.js',
      jquery$: 'jquery/dist/jquery.min.js',
      'jquery-ui': 'jquery-ui-bundle/jquery-ui.min.js',
      'angular-selectize': 'angular-selectize2/dist/angular-selectize.js',
      'angular-ui-router': 'angular-ui-router/release/angular-ui-router.min.js',
    },
  },
}
