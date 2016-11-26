let settings = {}

if (process.env.NODE_ENV !== 'production') {
  settings = {
    API_SERVER: 'http://127.0.0.1:8000',
    API_URL: 'http://127.0.0.1:8000',
  }
} else {
  settings = {
    API_URL: 'http://dev.grail.crystalnix.com',
    API_SERVER: 'http://dev.grail.crystalnix.com',
  }
}

export default { ...settings }
