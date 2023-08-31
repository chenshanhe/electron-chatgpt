import debug from 'debug'
import { app, protocol, BrowserWindow, ipcMain, Menu,Tray } from 'electron'

const eventEmitter = require('./eventHandler').getInstance()

let log = require('electron-log')



export async function init(){
    try{
        require('./logger')

        log.info('appUrl:',process.env.appUrl)
        log.info('resourceUrl:',process.env.resourceUrl)
        log.info(`HELLO,THIS IS ${process.env.npm_package_name} ${process.env.appVer}`)

        let configManager = require('./config')
        await configManager.init()

    }catch(err){
        log.error(err)
    }
    _systemEventInit()
    eventInit()
    log.info('now init has done')    
}

function eventInit(){
    
}


function _systemEventInit(){

    let windowsManager = require('./windowsManager').getInstance()


    eventEmitter.on('__ELECTRON_IS_READY__',(eventBody)=>{
        let WindowModle = require('../model/window')
        new WindowModle('/',{
            multiInstance:false,
            windowsType:"__mainWindow"
        },{
            width:1600,
            height:900,
            frame:false,
            resizable:false,
            titleBarStyle: 'hidden', //控制头部 标题栏显示

        }).open()
    })

    eventEmitter.on('__WINDOW_DO_OPEN__',(eventBody)=>{
        windowsManager.open(eventBody)
    })
}



