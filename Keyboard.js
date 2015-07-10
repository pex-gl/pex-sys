var EventDispatcher = require('./EventDispatcher');
var KeyboardEvent   = require('./KeyboardEvent');

function Keyboard() {
    EventDispatcher.call(this);
}

Keyboard.prototype.handleKeyDown = function(e) {
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KEY_DOWN, { code: e.code, str: e.str, keyboard: this }));
}

Keyboard.prototype.handleKeyUp = function(e) {
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KEY_UP, { code: e.code, str: e.str, keyboard: this }));
}

Keyboard.prototype = Object.create(EventDispatcher.prototype);
Keyboard.prototype.constructor = Keyboard;

module.exports = Keyboard;
