const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


const SENTRY_DSN = 'http://97708a52f59d4b288c54470f8734542b@sentry.grail.crystalnix.com/2'


const config = {
  devtool: 'eval-source-map',
  context: path.join(__dirname, 'src'),
  entry: {
    main: './main.js',
  },
  resolve: {
    alias: {
      'angular-ui-grid$': 'angular-ui-grid/ui-grid.min.js',
      jquery$: 'jquery/dist/jquery.min.js',
      'jquery-ui': 'jquery-ui-bundle/jquery-ui.min.js',
      'angular-selectize': 'angular-selectize2/dist/angular-selectize.js',
      'angular-ui-router': 'angular-ui-router/release/angular-ui-router.min.js',
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
        exclude: /(node_modules|bower_components|dist|coverage|tests)/,
        use: [
          {
            loader: 'babel-loader',
            options: { cacheDirectory: true },
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
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url-loader?limit=10000' },
      { test: /\.tpl.html/, loader: 'html-loader' },
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, 'src'),
      manifest: require('./dist/dll/vendor-manifest.json'),
    }),
    new WebpackMd5Hash(),
    new HtmlWebpackPlugin({ template: './index.html', inject: 'body' }),
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }),
    new webpack.ProvidePlugin({ Selectize: 'selectize', 'window.Selectize': 'selectize' }),
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || SENTRY_DSN),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([{ from: 'images', to: 'images' }]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
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
