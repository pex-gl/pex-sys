var Event = require('./Event');

/**
 * Mouse event
 * @class
 * @param {String} type
 * @param {Object} data
 * @param {Number} data.x         - x mouse position
 * @param {Number} data.y         - y mouse position
 * @param {Boolean} data.altKey    - is alt key pressed?
 * @param {Boolean} data.shiftKey  - is shift key pressed?
 * @param {Boolean} data.ctrlKey   - is ctrl key pressed?
 * @param {Boolean} data.metaKey   - is meta (apple/win) key pressed?
 */
function MouseEvent(type, data) {
    Event.call(this, type, data);
}

MouseEvent.prototype = Object.create(Event.prototype);
MouseEvent.prototype.constructor = MouseEvent;

/**
 * Mouse down event constat
 * @constant
 */
MouseEvent.MOUSE_DOWN   = 'mousedown';

/**
 * Mouse down event constat
 * @constant
 */
MouseEvent.MOUSE_UP     = 'mouseup';

/**
 * Mouse down event constat
 * @constant
 */
MouseEvent.MOUSE_MOVE   = 'mousemove';

/**
 * Mouse down event constat
 * @constant
 */
MouseEvent.MOUSE_DRAG   = 'mousedrag';

/**
 * Mouse scroll event constat
 * @constant
 */
MouseEvent.MOUSE_SCROLL = 'mousescroll';

module.exports = MouseEvent;
