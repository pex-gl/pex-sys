var Event = require('./Event');
var isBrowser = require('is-browser');


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

KeyboardEvent.VK_BACKSPACE  = isBrowser ?  8 :  51;

/**
 * Enter key code
 * @constant
 */
KeyboardEvent.VK_ENTER      = isBrowser ? 13 :  36;

/**
 * Space key code
 * @constant
 */
KeyboardEvent.VK_SPACE   = isBrowser ? 32 :  49;

/**
 * Delete key code
 * @constant
 */
KeyboardEvent.VK_DELETE  = isBrowser ? 46 : 117;

/**
 * Tab key code
 * @constant
 */
KeyboardEvent.VK_TAB     = isBrowser ?  9 :  48;

/**
 * Escape key code
 * @constant
 */
KeyboardEvent.VK_ESC     = isBrowser ? 27 :  53;

/**
 * Up arrow key code
 * @constant
 */
KeyboardEvent.VK_UP      = isBrowser ? 38 : 126;

/**
 * Down arrow key code
 * @constant
 */
KeyboardEvent.VK_DOWN    = isBrowser ? 40 : 125;

/**
 * Left arrow key code
 * @constant
 */
KeyboardEvent.VK_LEFT    = isBrowser ? 37 : 123;

/**
 * Right arrow key code
 * @constant
 */
KeyboardEvent.VK_RIGHT   = isBrowser ? 39 : 124;

module.exports = KeyboardEvent;
