export default $rootScope => ({
  setToken(token) {
    $rootScope.$emit("update_token", token)
    return localStorage.setItem("token", token)
  },

  getToken() {
    return localStorage.getItem("token")
  },

  setUser(username) {
    $rootScope.$emit("update_user", username)
    return localStorage.setItem("user", username)
  },

  getUser() {
    return localStorage.getItem("user")
  },

  clear() {
    $rootScope.$emit("update_user", null)
    $rootScope.$emit("update_token", null)
    return localStorage.clear()
  }
})
