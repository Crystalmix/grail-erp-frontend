const webpackConfig = require('./webpack.config')

webpackConfig.module.rules[0] = {
  test: /\.js$/,
  include: /src/,
  exclude: /(node_modules|bower_components|dist|coverage)/,
  use: [
    {
      loader: 'babel-istanbul-loader',
      options: {
        cacheDirectory: true,
      },
    },
  ],
}

module.exports = (config) => {
  config.set({
    browsers: ['Chrome'],
    colors: true,
    autoWatch: true,
    singleRun: false,

    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'html' },
      ],
    },
    files: [
      './node_modules/phantomjs-polyfill-find/find-polyfill.js',
      {
        pattern: 'dist/dll/dll.vendor.js',
        watched: false,
        served: true,
      },
      'src/**/*.test.js',
    ],
    frameworks: ['mocha'],
    reporters: ['progress', 'coverage', 'mocha'],
    mochaReporter: {
      output: 'autowatch',
    },
    preprocessors: {
      'src/**/*.test.js': ['webpack', 'sourcemap'],
    },
    plugins: [
      'karma-jasmine',
      'karma-mocha',
      'karma-coverage',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
  })
}
