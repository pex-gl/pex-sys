var Event = require('./Event');

function WindowEvent(type, data){
    Event.call(this, type, data);
}

WindowEvent.prototype = Object.create(Event.prototype);
WindowEvent.prototype.constructor = WindowEvent;

WindowEvent.RESIZE = 'windowresize';

module.exports = WindowEvent;