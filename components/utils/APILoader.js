const DEFAULT_CONFIG = {
  v: '1.4.0',
  hostAndPath: 'webapi.amap.com/maps',
  key: 'f97efc35164149d0c0f299e7a8adb3d2',
  callback: '__amap_init_callback',
  injectScript: false,
  useAMapUI: false
}

let mainPromise = null
let amapuiPromise = null
let amapuiInited = false
export default class APILoader {
  constructor({ key, useAMapUI, version, protocol, hostProxy, injectScript }) {
    this.config = { ...DEFAULT_CONFIG, useAMapUI, protocol, injectScript }
    if (typeof window !== 'undefined') {
      if (key) {
        this.config.key = key
      } else if ('amapkey' in window) {
        this.config.key = window.IMAPkey
      }
    }
    if (version) {
      this.config.v = version
    }
    this.protocol = protocol || window.location.protocol
    if (this.protocol.indexOf(':') === -1) {
      this.protocol += ':'
    }

    this.hostProxy = hostProxy || 'localhost'
  }

  // getScriptSrc(cfg) {
  //   return `${this.protocol}//${cfg.hostAndPath}?v=${cfg.v}&key=${cfg.key}&callback=${cfg.callback}`
  // }

  buildScriptTag(src) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = false
    // script.defer = false
    script.src = src
    return script
  }

  appendScriptTag(src) {
    const script = this.buildScriptTag(src);
    document.body.appendChild(script)
  }

  appendLinkTag(href) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.async = false
    document.body.appendChild(link)
  }

  getAmapuiPromise() {
    const script = this.buildScriptTag(`${this.protocol}//webapi.amap.com/ui/1.0/main-async.js`)
    const p = new Promise(resolve => {
      script.onload = () => {
        resolve()
      }
    })
    document.body.appendChild(script)
    return p
  }

  getMainPromise() {
    const { injectScript } = this.config;
    if (!injectScript) {
      return Promise.resolve()
    }

    const script = document.createElement('script');
    script.text = `var host = '${this.hostProxy}';`;
    script.async = false;
    document.body.appendChild(script);

    this.appendScriptTag(`http://${this.hostProxy}:25001/as/webapi/js/auth?v=2.0&t=jsmap&ak=ec85d3648154874552835438ac6a02b2`);
    this.appendLinkTag(`http://${this.hostProxy}:25002/jsmap/2.0/IMap.css`)
    this.appendScriptTag(`http://${this.hostProxy}:25002/jsmap/2.0/main.js`)
    this.appendScriptTag(`http://${this.hostProxy}:25002/jsmap/2.0/flash/IMapStreetView.js`)
    this.appendScriptTag(`http://${this.hostProxy}:25001/as/webapi/js/auth?v=2.0&t=tool&ak=ec85d3648154874552835438ac6a02b2`)

    const jsmapconfigScript = this.buildScriptTag(`http://${this.hostProxy}:25001/as/webapi/js/auth?v=2.0&t=jsmapconfig&ak=ec85d3648154874552835438ac6a02b2`)
    const p = new Promise(resolve => {
      // window[this.config.callback] = () => {
      //   resolve()
      //   delete window[this.config.callback]
      // }
      jsmapconfigScript.onload = () => {
        resolve()
      }
    })
    document.body.appendChild(jsmapconfigScript)
    return p
  }

  load() {
    if (typeof window === 'undefined') {
      return null
    }
    const { useAMapUI } = this.config
    mainPromise = mainPromise || this.getMainPromise()
    if (useAMapUI) {
      amapuiPromise = amapuiPromise || this.getAmapuiPromise()
    }
    return new Promise(resolve => {
      mainPromise.then(() => {
        if (useAMapUI && amapuiPromise) {
          amapuiPromise.then(() => {
            if (window.initAMapUI && !amapuiInited) {
              window.initAMapUI()
              if (typeof useAMapUI === 'function') {
                useAMapUI()
              }
              amapuiInited = true
            }
            resolve()
          })
        } else {
          resolve()
        }
      })
    })
  }
}
