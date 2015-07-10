function Mouse() {
    this._x = 0;
    this._y = 0;
    this._prevX = 0;
    this._prevY = 0;
}

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

Mouse.prototype.handleMouseMove = function(e) {
    this._prevX = this._x;
    this._prevY = this._y;
    this._x = e.x;
    this._y = e.y;

    //TODO: fire event
}

module.exports = Mouse;
