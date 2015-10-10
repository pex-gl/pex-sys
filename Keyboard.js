var EventDispatcher = require('./EventDispatcher');
var KeyboardEvent   = require('./KeyboardEvent');

/**
 * EventDispatcher for keyboard events
 * @class
 *
 * @example
 * var Window = require('pex-sys').Window;
 * var KeyboardEvent = require('pex-sys').KeyboardEvent;
 *
 * Window.create({
 * 	 init: function() {
 * 	 	var kbd = this.getKeyboard()
 * 	 	kbd.addEventListener(KeyboardEvent.KEY_DOWN, function(e){ });
 * 	 	kbd.addEventListener(KeyboardEvent.KEY_PRESS, function(e){ });
 * 	 	kbd.addEventListener(KeyboardEvent.KEY_UP, function(e){ });
 * 	 }
 * })
 */
function Keyboard() {
    EventDispatcher.call(this);
}

Keyboard.prototype = Object.create(EventDispatcher.prototype);
Keyboard.prototype.constructor = Keyboard;

/**
 * Fires KEY_DOWN event
 * @protected
 *
 * @param {Object} e            - event data
 * @param {String} e.str        - '' (not used for KEY_DOWN)
 * @param {Number} e.keyCode    - key code (not ASCI code)
 * @param {Boolean} e.altKey    - is alt key pressed?
 * @param {Boolean} e.shiftKey  - is shift key pressed?
 * @param {Boolean} e.ctrlKey   - is ctrl key pressed?
 * @param {Boolean} e.metaKey   - is meta (apple/win) key pressed?
 */
Keyboard.prototype.handleKeyDown = function(e) {
    e.keyboard = this;
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KEY_DOWN, e));
}

/**
 * Fires KEY_PRESS event
 * @protected
 *
 * @param {Object} e           - event data
 * @param {String} e.str       - string character representing that key
 * @param {Number} e.keyCode   - key code (not ASCI code)
 * @param {Boolean} e.altKey   - is alt key pressed?
 * @param {Boolean} e.shiftKey - is shift key pressed?
 * @param {Boolean} e.ctrlKey  - is ctrl key pressed?
 * @param {Boolean} e.metaKey  - is meta (apple/win) key pressed?
 */
Keyboard.prototype.handleKeyPress = function(e) {
    e.keyboard = this;
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KEY_PRESS, e));
}

/**
 * Fires KEY_UP event
 * @protected
 *
 * @param {Object} e           - event data
 * @param {String} e.str       - '' (not used for KEY_UP)
 * @param {Number} e.keyCode   - key code (not ASCI code)
 * @param {Boolean} e.altKey   - is alt key pressed?
 * @param {Boolean} e.shiftKey - is shift key pressed?
 * @param {Boolean} e.ctrlKey  - is ctrl key pressed?
 * @param {Boolean} e.metaKey  - is meta (apple/win) key pressed?
 */
Keyboard.prototype.handleKeyUp = function(e) {
    e.keyboard = this;
    this.dispatchEvent(new KeyboardEvent(KeyboardEvent.KEY_UP, e));
}

module.exports = Keyboard;
