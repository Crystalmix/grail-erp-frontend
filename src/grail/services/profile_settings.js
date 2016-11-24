function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

export default (api, auth_status) => {

    let user = {
        profile: {
            settings: {},
            xero_settings: {}
        }
    }

    return {
        fetchProfile(callback) {
            let token = auth_status.getToken()
            return api.getProfile(token).then(function(response) {
                user = __guard__(response, x => x.data)
                if (callback) { return callback() }
            })
        },

        saveSettings(view_name, new_settings, callback) {
            if (view_name && new_settings) {
                if (!user.profile.settings[view_name]) { user.profile.settings[view_name] = {} }
                let view_settings = user.profile.settings[view_name]
                _.extend(view_settings, new_settings)
                return api.updateProfile(user).then(function(response) {
                    user = __guard__(response, x => x.data)
                    if (callback) { return callback() }
                })
            }
        },

        getSettings(view_name, key) {
            return __guard__(__guard__(user.profile.settings, x1 => x1[view_name]), x => x[key])
        },

        setXeroSettings(key, val) {
            if (key && val) { return user.profile.xero_settings[key] = val }
        },

        getXeroSettings(key) {
            if (key) { return __guard__(user.profile.xero_settings, x => x[key]) }
        },

        saveProfile(user_profile = user, callback) {
            return api.updateProfile(user_profile).then(function(response) {
                user = __guard__(response, x => x.data)
                if (callback) { return callback() }
            })
        },

        getProfile() {
            return user
        }
    }
}
