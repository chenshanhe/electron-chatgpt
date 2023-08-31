

const CONFIG_FILE = './etc/electron.conf'
var IniConfigParser = require('ini-config-parser')
var fs = require('fs')
let debug = require('debug')('config:logic')
const _ = require('lodash')

const isDevelopment = process.env.NODE_ENV !== 'production'


const EventEmitter = require('events')

function ConfigManager (configPath) {
    const path = require('path')

  // 参数必须赋值，否则抛出异常
    if(!configPath){
      throw new Error(`lack of falcon config file ${configPath}`)
    }
    configPath = path.join(process.env.appUrl, configPath)
    if(!isDevelopment && process.platform === 'linux') configPath = '/etc/electron.conf'
    if(!fs.existsSync(configPath)){
      throw new Error(`config file ${configPath} can not find`)
    }
  

  var data = fs.readFileSync(configPath).toString()
  this._path = configPath
  // 注释不可使用#,因为会于交换机prompt#冲突,只可使用;
  this.config = IniConfigParser.parse(data, {
    lineComment: [';'],
    nativeType: false
  })
  debug('这是初始化的配置信息%o', JSON.stringify(this.config))
  this._emitter = new EventEmitter()
}


// Encapsulation in JavaScript 封装，继承，多态CRUD就属于多态一种
// The one disadvantage of overwriting the prototype is that
// the constructor property no longer points to the prototype,
// so we have to set it manually.
ConfigManager.prototype = {
  constructor: ConfigManager,

  _getParams: function (section) {
    if (typeof(section) !== 'string') {
      throw new Error(`section param invalid`)
    }
    if (typeof(this.config[section]) !== 'object') {
      throw new Error(`params for ${section} not found`)
    }
    return this.config[section]
  },

  _setParams: function (section, params) {
    if (typeof(section) !== 'string') {
      throw new Error(`section param invalid`)
    }
    if (typeof(params) !== 'object') {
      throw new Error(`params param invalid`)
    }
    if (typeof(this.config[section]) !== 'object') {
      this.config[section] = {}
    }
    let container = this.config[section]
    for (let name in params) {
      container[name] = params[name]
    }
    this._save()
  },
  
  /**
   * 获取基本参数值, 注意参数返回均是字符串形式
   * @param {String} section 基本参数区块名称
   */
  getParams: function (section) {
    return this._getParams(section)
  },

   /**
   * 设置基本参数
   *  @param section  基本参数区块名称
   *  @param params   待写入的参数数组,以key-value形式的键值对
   */
  setParams: function (section, params) {    
    return this._setParams(section, params)
  },


  _save: function () {
    let str = ''
    for (let i in this.config) {
      str += '[' + i + ']\n'
      for (let s in this.config[i]) {
        str += s + '=' + this.config[i][s] + '\n'
      }
    }
    debug('修改后的配置文件信息%s', str)
    fs.writeFileSync(this._path, str)
  },

  getConfig(){
    return this.config
  },
  setConfig(config){
    this.config = config
    this._save()
  },

}


let cfm

const getInstance = () => {
  if (!cfm) {
    throw new Error('Config Manager not initialized!')
  }

  return cfm
}


const init = path => {
  let cfPath = CONFIG_FILE
  if (path) {
    cfPath = path
  }
  debug('init path = %s', path)
  cfm = new ConfigManager(cfPath)
  return Promise.resolve()
}



exports.getInstance = getInstance
exports.init = init

