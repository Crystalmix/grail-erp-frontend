export default $rootScope => ({
  setToken: (token) => {
    $rootScope.$emit('update_token', token)
    localStorage.setItem('token', token)
  },

  getToken: () => localStorage.getItem('token'),

  setUser: (username) => {
    $rootScope.$emit('update_user', username)
    localStorage.setItem('user', username)
  },

  getUser: () => localStorage.getItem('user'),

  clear: () => {
    $rootScope.$emit('update_user', null)
    $rootScope.$emit('update_token', null)
    localStorage.clear()
  },
})
