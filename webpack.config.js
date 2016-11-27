const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


const config = {
  context: path.join(__dirname, 'src'),
  entry: {
    vendor: [
      'jquery',
      'jquery-ui',
      'bootstrap/dist/js/bootstrap',
      'underscore',
      'angular',
      'angular-ui-router',
      'angular-ui-grid',
      'angular-ui-sortable',
      'selectize',
      'angular-selectize',
      'ng-dialog',
      'babel-polyfill',
      'jsgrid/dist/jsgrid',
    ],
    main: './main.js',
  },
  resolve: {
    alias: {
      'jquery-ui': 'jquery-ui-bundle/jquery-ui.js',
      'angular-selectize': 'angular-selectize2/dist/angular-selectize.js',
    },
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].[id].chunk.js',
    sourceMapFilename: '[name].[chunkhash].map',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader',
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
    new WebpackMd5Hash(),
    new HtmlWebpackPlugin({ template: './index.html', inject: 'body' }),
    new webpack.optimize.CommonsChunkPlugin({ names: ['vendor'], minChunks: 2 }),
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }),
    new webpack.ProvidePlugin({ Selectize: 'selectize', 'window.Selectize': 'selectize' }),
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([{ from: 'images', to: 'images' }]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },
}

if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map'
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      angular: true,
      warnings: false,
    },
    mangle: false,
    sourceMap: true,
    sourceMapIncludeSources: true,
  }))
} else {
  config.devtool = 'eval-source-map'
}

if (process.env.NODE_ENV === 'profile') {
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config
