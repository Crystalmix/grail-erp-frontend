export default ($window) => (
  (path, windowName = 'xeroAuth') => {
    const w = 800
    const h = 600
    const dualScreenLeft = $window.screenLeft || screen.left
    const dualScreenTop = $window.screenTop || screen.top
    const width = $window.innerWidth || document.documentElement.clientWidth || screen.width
    const height = $window.innerHeight || document.documentElement.clientHeight || screen.height
    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop

    const windowOptions = `location=no,status=no,width=${w},height=${h},resizable=no,top=${top},left=${left}`

    return $window.open(path, windowName, windowOptions)
  }
)
