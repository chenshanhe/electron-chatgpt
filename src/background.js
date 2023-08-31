'use strict'

import { app, protocol, BrowserWindow } from 'electron'

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

const eventHandler = require('./core/eventHandler').getInstance()

let appUrl = path.resolve(app.getPath('exe'), '../'); // process.cwd()即为路径
let resourceUrl = path.resolve(app.getPath('exe'), '../resources/resource'); // process.cwd()即为路径
if (process.env.NODE_ENV === 'development') { // 开发模式下的路径处理，path.join仅是项目处理逻辑，可按需更改
  appUrl = process.cwd()
  resourceUrl = path.join(process.cwd(), '/resource');
}
resourceUrl = resourceUrl.replaceAll("\\", "/");
appUrl = appUrl.replaceAll("\\", "/");
process.env.resourceUrl = resourceUrl
process.env.appUrl = appUrl
const core = require('./core/core') //引入自己的程序代码




// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

if(app.isPackaged){
  app.setLoginItemSettings({
    openAtLogin:true,
    path:'\"'+process.execPath+'\"',
  })
}
// async function createWindow() {
//   // Create the browser window.
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
      
//       // Use pluginOptions.nodeIntegration, leave this alone
//       // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
//       nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
//       contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
//     }
//   })

//   if (process.env.WEBPACK_DEV_SERVER_URL) {
//     // Load the url of the dev server if in development mode
//     await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
//     if (!process.env.IS_TEST) win.webContents.openDevTools()
//   } else {
//     createProtocol('app')
//     // Load the index.html when not in development
//     win.loadURL('app://./index.html')
//   }
// }

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (BrowserWindow.getAllWindows().length === 0) eventHandler.emit("__ELECTRON_IS_READY__")
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await core.init()
  let log = require('electron-log')
  log.info('will create window')
  eventHandler.emit("__ELECTRON_IS_READY__")


  
  // let windowsManager = require('./core/windowsManager').getInstance()
  // windowsManager.open(  new WindowModle('/'))
  
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS3_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  // createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
    // 输出从第二个实例中接收到的数据

    //TODO:
    // console.log(additionalData)
    // let windowsManager = require('@/core/windowsManager').getInstance()
    // let mainWin = windowsManager.getMainWin()
    // // 有人试图运行第二个实例，我们应该关注我们的窗口
    // if (mainWin) {
    //   if (mainWin.isMinimized()) mainWin.restore()
    //   mainWin.focus()
    // }
  })

  // // 创建 myWindow, 加载应用的其余部分, etc...
  // app.whenReady().then(() => {
  //   let windowsManager = require('@/core/windowsManager').getInstance()
  //   mainWin = windowsManager.createMainWindow()
  // })
}
