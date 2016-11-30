import angular from 'angular'
import Raven from 'raven-js'
import angularPlugin from 'raven-js/plugins/angular'

if (process.env.NODE_ENV === 'production') {
  Raven.config(process.env.SENTRY_DSN).install()
  angularPlugin(Raven, angular)
}
