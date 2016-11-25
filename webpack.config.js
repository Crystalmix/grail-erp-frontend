const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    main: './main.js',
    vendor: [
      'jquery',
      'jquery-ui',
      'bootstrap/dist/js/bootstrap',
      'lodash',
      'angular',
      'angular-ui-router',
      'angular-ui-grid',
      'angular-ui-sortable',
      'ng-dialog',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].map',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?sourceMap',
        }),
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url-loader?limit=10000' },
      { test: /\.tpl.html/, loader: 'html-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html', inject: 'body' }),
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor'] }),
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }),
    new ExtractTextPlugin("styles.css"),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },
}
