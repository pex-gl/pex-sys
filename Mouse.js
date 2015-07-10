var EventDispatcher = require('./EventDispatcher');
var MouseEvent      = require('./MouseEvent');

function Mouse() {
    EventDispatcher.call(this);

    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;
    this._isDown = false;
}

Mouse.prototype = Object.create(EventDispatcher.prototype);
Mouse.prototype.constructor = Mouse;

Mouse.prototype.getX = function() {
    return this._x;
}

Mouse.prototype.getY = function() {
    return this._y;
}

Mouse.prototype.getPrevX = function() {
    return this._prevX;
}

Mouse.prototype.getPrevY = function() {
    return this._prevY;
}

Mouse.prototype.getDeltaX = function() {
    return this._x - this._prevX;
}

Mouse.prototype.getDeltaY = function() {
    return this._y - this._prevY;
}

Mouse.prototype.handleMouseDown = function(e) {
    this._isDown = true;
    this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN, { x: this._x, y: this._y, mouse: this }));
}

Mouse.prototype.handleMouseUp = function(e) {
    this._isDown = false;
    this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_UP, { x: this._x, y: this._y, mouse: this }));
}

Mouse.prototype.handleMouseMove = function(e) {
    this._prevX = this._x;
    this._prevY = this._y;
    this._x = e.x;
    this._y = e.y;

    var data = { x: this._x, y: this._y, mouse: this };

    //don't fire mouse move events while dragging
    if (this._isDown) {
        this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DRAG, data));
    }
    else {
        this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_MOVE, data));
    }
}

Mouse.prototype.handleMouseScroll = function(e) {
    this.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_SCROLL, { dx: e.dx, dy: e.dy, mouse: this }));
}

module.exports = Mouse;
