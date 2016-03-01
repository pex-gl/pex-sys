var Event = require('./Event');

function WindowEvent(type, data){
    Event.call(this, type, data);
}

WindowEvent.prototype = Object.create(Event.prototype);
WindowEvent.prototype.constructor = WindowEvent;

WindowEvent.WINDOW_RESIZE = 'windowresize';
WindowEvent.WINDOW_READY = 'windowready';

module.exports = WindowEvent;
