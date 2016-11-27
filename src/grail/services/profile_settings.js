/* @flow */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

export default (api, auth_status) => {
  let user = {
    profile: {
      settings: {},
      xero_settings: {},
    },
  }

  return {
    fetchProfile: (callback) => {
      const token = auth_status.getToken()
      api.getProfile(token).then((response) => {
        user = __guard__(response, x => x.data)
        if (callback) { callback() }
      })
    },

    saveSettings: (view_name, new_settings, callback) => {
      if (view_name && new_settings) {
        if (!user.profile.settings[view_name]) { user.profile.settings[view_name] = {} }
        const view_settings = user.profile.settings[view_name]
        _.extend(view_settings, new_settings)
        api.updateProfile(user).then((response) => {
          user = __guard__(response, x => x.data)
          if (callback) { callback() }
        })
      }
    },

    getSettings: (view_name, key) => (
      __guard__(__guard__(user.profile.settings, x1 => x1[view_name]), x => x[key])
    ),

    setXeroSettings: (key, val) => {
      if (key && val) { user.profile.xero_settings[key] = val }
    },

    getXeroSettings: (key) => {
      if (key) { return __guard__(user.profile.xero_settings, x => x[key]) }
      return null
    },

    saveProfile: (user_profile = user, callback) => {
      api.updateProfile(user_profile).then((response) => {
        user = __guard__(response, x => x.data)
        if (callback) { callback() }
      })
    },

    getProfile: () => user,
  }
}
