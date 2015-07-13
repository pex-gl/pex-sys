var EventDispatcher = require('./EventDispatcher');
var KeyboardEvent   = require('./KeyboardEvent');

function Keyboard() {
    EventDispatcher.call(this);
}

Keyboard.prototype = Object.create(EventDispatcher.prototype);
Keyboard.prototype.constructor = Keyboard;

Keyboard.prototype.handleKeyDown = function(e) {
    e.keyboard = this;
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KEY_DOWN, e));
}

Keyboard.prototype.handleKeyUp = function(e) {
    e.keyboard = this;
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KEY_UP, e));
}

module.exports = Keyboard;
