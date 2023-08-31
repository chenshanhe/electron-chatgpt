
const eventEmitter = require('../core/eventHandler').getInstance()
const _ = require('lodash')
const PREFIX = '__window_id_'
module.exports = class Window {
    constructor(url, options, winOptions) {
        this.url = url
        this.options = {
            id: _.uniqueId(PREFIX),
            multiInstance: true, //多实例
            windowsType: "defaultWindow",
            close:()=>{},
            closed:()=>{},
            readyToShow:()=>{},
            show:()=>{},
            focus:()=>{},
            blur:()=>{},
            show:()=>{},
            hide:()=>{},
            ...options
        }
        this.winOptions = {
            width: 800,
            height: 600,
            show: false,//ready后再显示
            frame: true,//是否显示边缘框
            fullscreen: false, //是否全屏显示
            title: "",
            resizable: true,
            parent: null,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true, // 支持Node
                contextIsolation: false,  // 禁用下文隔离
                enableRemoteModule: true,// 开启Remote
            },
            ...winOptions
        }

    }
    getId(){
        return this.options.id
    }
    /**
     * 获取window类的所有信息
     * @returns 
     */
    getWinModelOpts() {
        return {
            url: this.url,
            options: this.options,
            winOptions: this.winOptions
        }
    }
    open() {
        eventEmitter.emit('__WINDOW_DO_OPEN__', this.getWinModelOpts())
    }
    close() {
        eventEmitter.emit('__WINDOW_DO_CLOSE__', this.getWinModelOpts())
    }
}