var Event = require('./Event');
var isPlask = require('is-plask');

/**
 * Keyboard Event class
 * @property {String} str       - string character representing that key (if any)
 * @property {Number} keyCode   - key code (not ASCI code)
 * @property {Boolean} altKey    - is alt key pressed?
 * @property {Boolean} shiftKey  - is shift key pressed?
 * @property {Boolean} ctrlKey   - is ctrl key pressed?
 * @property {Boolean} metaKey   - is meta (apple/win) key pressed?
 *
 * @param {String} type
 * @param {Object} data            - event data
 * @param {String} data.str        - string character representing that key (if any)
 * @param {Number} data.keyCode    - key code (not ASCI code)
 * @param {Boolean} data.altKey    - is alt key pressed?
 * @param {Boolean} data.shiftKey  - is shift key pressed?
 * @param {Boolean} data.ctrlKey   - is ctrl key pressed?
 * @param {Boolean} data.metaKey   - is meta (apple/win) key pressed?
 */
function KeyboardEvent(type, data) {
    Event.call(this, type, data);
}

KeyboardEvent.prototype = Object.create(Event.prototype);
KeyboardEvent.prototype.constructor = KeyboardEvent;

/**
 * Key down event constant
 * @instance
 */
KeyboardEvent.KEY_DOWN  = 'keydown';

/**
 * Key press event constant
 * @constant
 */
KeyboardEvent.KEY_PRESS = 'keypress';

/**
 * Key up event constant
 * @constant
 */
KeyboardEvent.KEY_UP    = 'keyup';

/**
 * Backspace key code
 * @constant
 */

KeyboardEvent.VK_BACKSPACE  = isPlask ?  51 : 8;

/**
 * Enter key code
 * @constant
 */
KeyboardEvent.VK_ENTER      = isPlask ? 56 : 13;

/**
 * Space key code
 * @constant
 */
KeyboardEvent.VK_SPACE   = isPlask ? 49 : 32;

/**
 * Delete key code
 * @constant
 */
KeyboardEvent.VK_DELETE  = isPlask ? 117 : 46;

/**
 * Tab key code
 * @constant
 */
KeyboardEvent.VK_TAB     = isPlask ? 48 : 9;

/**
 * Escape key code
 * @constant
 */
KeyboardEvent.VK_ESC     = isPlask ? 53 : 27;

/**
 * Up arrow key code
 * @constant
 */
KeyboardEvent.VK_UP      = isPlask ? 126 : 38;

/**
 * Down arrow key code
 * @constant
 */
KeyboardEvent.VK_DOWN    = isPlask ? 125 : 40;

/**
 * Left arrow key code
 * @constant
 */
KeyboardEvent.VK_LEFT    = isPlask ? 123 : 37;

/**
 * Right arrow key code
 * @constant
 */
KeyboardEvent.VK_RIGHT   = isPlask ? 124 : 39;

module.exports = KeyboardEvent;
