const event = require('events')
exports.getInstance = getInstance
var eventEmitter

function getInstance() {
    if (eventEmitter) { return eventEmitter }
    eventEmitter = new event.EventEmitter()
    return eventEmitter
  }