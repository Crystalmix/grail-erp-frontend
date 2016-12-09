/* @flow */

// Global vendor
import 'jquery'
import 'jquery-ui'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

// Setup sentry
import './sentry'

// Styles
import './nifty_template/nifty.css'
import './nifty_template/nifty'
import './grailerp.css'

import './main.css'


// import app from './grail/app.module'
import './grail/app.module'

// angular.module('grail', [app])

const foo = async (x: string, flag: bool): Promise<void> => {
  console.log(`=> Start: ${x}`, flag)
}

if (process.env.NODE_ENV !== 'production') {
  console.log('=> NODE_ENV', process.env.NODE_ENV)
  foo('yo', false)
}

if (process.env.NODE_ENV === 'production') {
  console.log('=> NODE_ENV', process.env.NODE_ENV)
  foo('yo', true)
}
