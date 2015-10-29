var EventDispatcher = require('./EventDispatcher');
var MouseEvent      = require('./MouseEvent');

/**
 * EventDispatcher for mouse events
 * @class
 *
 * @example
 * var Window = require('pex-sys').Window;
 * var MouseEvent = require('pex-sys').MouseEvent;
 *
 * Window.create({
 * 	 init: function() {
 * 	 	var mouse = this.getMouse()
 * 	 	mouse.addEventListener(MouseEvent.MOUSE_DOWN, function(e){ });
 * 	 	mouse.addEventListener(MouseEvent.MOUSE_UP, function(e){ });
 * 	 	mouse.addEventListener(MouseEvent.MOUSE_MOVE, function(e){ });
 * 	 	mouse.addEventListener(MouseEvent.MOUSE_DRAG, function(e){ });
 * 	 	mouse.addEventListener(MouseEvent.MOUSE_SCROLL, function(e){ });
 * 	 }
 * })
 */
function Mouse() {
    EventDispatcher.call(this);

    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;
    this._deltaX = 0;
    this._deltaY = 0;
    this._isDown = false;
}

Mouse.prototype = Object.create(EventDispatcher.prototype);
Mouse.prototype.constructor = Mouse;

/**
 * @return {Number} mouse x position
 */
Mouse.prototype.getPosX = function() {
    return this._x;
};

/**
 * @return {Number} mouse y position
 */
Mouse.prototype.getPosY = function() {
    return this._y;
};

/**
 * @return {Array} mouse position as [x, y]
 */
Mouse.prototype.getPos = function(out){
    if(out === undefined){
        return [this._x,this._y];
    }
    out[0] = this._x;
    out[1] = this._y;
    return out;
};

/**
 * @return {Number} previous mouse x position
 */
Mouse.prototype.getPrevPosX = function() {
    return this._prevX;
};

/**
 * @return {Number} previous mouse y position
 */
Mouse.prototype.getPrevPosY = function() {
    return this._prevY;
};

/**
 * @return {Array} previous mouse position as [x, y]
 */
Mouse.prototype.getPrevPos = function(out){
    if(out === undefined){
        return [this._prevX,this._prevY];
    }
    out[0] = this._prevX;
    out[1] = this._prevY;
    return out;
};

/**
 * @return {Number} the difference between current and the last position on the x axis
 */
Mouse.prototype.getDeltaX = function() {
    return this._deltaX;
};

/**
 * @return {Number} the difference between current and the last position on the y axis
 */
Mouse.prototype.getDeltaY = function() {
    return this._deltaY;
};

/**
 * @return {Array} the difference between current and the last position as [x,y]
 */
Mouse.prototype.getDelta = function(out){
    if(out === undefined){
        return [this._deltaX,this._deltaY];
    }
    out[0] = this._deltaX;
    out[1] = this._deltaY;
    return out;
};

/**
 * Fires MOUSE_DOWN event
 * @protected
 *
 * @param {Object} e            - event data
 * @param {String} e.x          - mouse x position
 * @param {Number} e.y          - mouse y position
 * @param {Boolean} e.altKey    - is alt key pressed?
 * @param {Boolean} e.shiftKey  - is shift key pressed?
 * @param {Boolean} e.ctrlKey   - is ctrl key pressed?
 * @param {Boolean} e.metaKey   - is meta (apple/win) key pressed?
 */
Mouse.prototype.handleMouseDown = function(e) {
    this._isDown = true;
    e.mouse = this;
    this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN, e));
}

/**
 * Fires MOUSE_UP event
 * @protected
 *
 * @param {Object} e            - event data
 * @param {String} e.x          - mouse x position
 * @param {Number} e.y          - mouse y position
 * @param {Boolean} e.altKey    - is alt key pressed?
 * @param {Boolean} e.shiftKey  - is shift key pressed?
 * @param {Boolean} e.ctrlKey   - is ctrl key pressed?
 * @param {Boolean} e.metaKey   - is meta (apple/win) key pressed?
 */
Mouse.prototype.handleMouseUp = function(e) {
    this._isDown = false;
    e.mouse = this;
    this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_UP, e));
}

/**
 * Fires MOUSE_MOVE event
 * @protected
 *
 * @param {Object} e            - event data
 * @param {String} e.x          - mouse x position
 * @param {Number} e.y          - mouse y position
 * @param {Boolean} e.altKey    - is alt key pressed?
 * @param {Boolean} e.shiftKey  - is shift key pressed?
 * @param {Boolean} e.ctrlKey   - is ctrl key pressed?
 * @param {Boolean} e.metaKey   - is meta (apple/win) key pressed?
 */
Mouse.prototype.handleMouseMove = function(e) {
    this._prevX = this._x;
    this._prevY = this._y;
    this._x = e.x;
    this._y = e.y;
    this._deltaX = this._x - this._prevX;
    this._deltaY = this._y - this._prevY;

    e.mouse = this;

    //don't fire mouse move events while dragging
    if (this._isDown) {
        this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DRAG, e));
    }
    else {
        this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_MOVE, e));
    }
}

/**
 * Fires MOUSE_SCROLL event
 * @protected
 *
 * @param {Object} e            - event data
 * @param {String} e.dx         - amount of scroll in x direction
 * @param {Number} e.dy         - amount of scroll in y direction
 * @param {Boolean} e.altKey    - is alt key pressed?
 * @param {Boolean} e.shiftKey  - is shift key pressed?
 * @param {Boolean} e.ctrlKey   - is ctrl key pressed?
 * @param {Boolean} e.metaKey   - is meta (apple/win) key pressed?
 */
Mouse.prototype.handleMouseScroll = function(e) {
    e.mouse = this;
    this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_SCROLL, e));
}

module.exports = Mouse;
