const modname = 'windows'
let { app, BrowserWindow, Notification, screen, Tray, Menu } = require('electron')
let { createProtocol } = require('vue-cli-plugin-electron-builder/lib')
const debug = require('debug')(modname)
let log = require('electron-log')
const _ = require('lodash')
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:8080`
  : `file://${__dirname}/index.html`

exports.getInstance = getInstance

var manager

function getInstance() {
  if (manager) { return manager }

  manager = new WindowsManager()
  return manager
}
const EventEmitter = require('events')
class WindowsManager extends EventEmitter {
  constructor() {
    super()
    this._windows = {} //生成windows状态
  }

  /**
   * 
   * @param {Window} window
   */
  open(winModelOpts) {
    let { id, url, options, winOptions } = winModelOpts
    let windows = this._getWindowsByType(options.windowsType)
    let win = windows.id
    if ((!options.multiInstance && Object.keys(windows).length > 0)
      || !_.isNil(win)) {
        win.focus()
    }

    let newWin = new BrowserWindow(winOptions)
    debug('process.env.WEBPACK_DEV_SERVER_URL', process.env.WEBPACK_DEV_SERVER_URL)
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      newWin.loadURL(winURL + '/#' + url)
      debug('loadURL', winURL + '/#' + url)

      // if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      newWin.loadURL('app://./index.html/#' + url)
      debug('loadURL', 'app://./index.html/#' + url)
    }
    // 此处写 你要打开的路由地址
    newWin.once('ready-to-show', () => {
      options.readyToShow()
      newWin.show()
    })

    newWin.on('close', (event) => {
      this._rmWindows(options.windowsType,id)
      options.close()
    })

    this._addWindows(options.windowsType,id, newWin)
  }

  _rmWindows(name, id) {
    debug('_rmWindows', name)

    delete this._windows[name][id]
  }

  _addWindows(name, id, win) {
    debug('_addWindows', name, win)
    if (!this._windows[name]) {
      this._windows[name] = {}
    }
    this._windows[name][id] = win
  }

  _getWindow(name, id) {
    return this._windows[name][id]
  }
  _getWindowsByType(name) {
    return this._windows[name] || {}
  }

  sendMessage(windowsType, id, eventName, eventBody) {
    let win = this._getWindow(windowsType, id)
    if (!win) {
      log.error('窗口不存在，信息发送失败')
      return
    }
    win.webContents.send(eventName, eventBody)
    debug('sendMessage', windowsType, id, eventName, eventBody)
  }


}
