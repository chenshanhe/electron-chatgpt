const log = require('electron-log');
const path = require('path')
import { app } from 'electron'


log.variables.label = process.env.NODE_ENV;
log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}][env-{label}] [{level}] {text}'
if (process.env.NODE_ENV === 'development') { // 开发模式下的路径处理，path.join仅是项目处理逻辑，可按需更改
    log.transports.file.resolvePath = () => path.join('./logs/main-server.log');
}else{
    log.transports.file.resolvePath = (variables) => {
        return path.join(process.env.appUrl, '/logs/main-server.log');
    }
    // log.transports.file.resolvePath = () => path.join(app.getAppPath(),'logs/main-server.log');
}
log.info('logger init done and start init app')
