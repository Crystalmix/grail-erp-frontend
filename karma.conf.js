const webpackConfig = require('./webpack.config')

// https://github.com/webpack/karma-webpack/issues/24
const commonsChunkPluginIndex = webpackConfig.plugins.findIndex(plugin => plugin.chunkNames)
webpackConfig.plugins.splice(commonsChunkPluginIndex, 1)

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
